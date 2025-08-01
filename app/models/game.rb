# frozen_string_literal: true

class Game < ApplicationRecord
  belongs_to :owner, class_name: "User"
  belongs_to :player_one, class_name: "User", optional: true
  belongs_to :player_two, class_name: "User", optional: true
  belongs_to :current_player, class_name: "User", optional: true
  belongs_to :winner, class_name: "User", optional: true

  has_many :actions, class_name: "GameAction", dependent: :destroy
  has_many :messages, dependent: :destroy
  has_one :last_action, class_name: "GameAction", required: false

  validates :owner, presence: true
  validates :name, presence: true
  validates :scenario, presence: true
  validates :state, presence: true

  validate :valid_players

  before_create :set_current_player
  before_save :check_players

  # needs_player:   owner must choose side when creating game
  # ready:          players joined, start needs confirmation (but non-owner can drop back out)
  # in_progress:    game currently being played
  #                 -> changes to needs_player if player deletes account (otherwise no quitting)
  # complete:       game over
  enum state: { needs_player: 0, ready: 1, in_progress: 2, complete: 3 }

  # Owner should always be player one or two; players can only change if user deleted
  scope :for_user, ->(user) { where("player_one_id = ? OR player_two_id = ?", user.id, user.id) }

  # Rails enums are broken, referencing the column in a scope IN ANY WAY causes
  # errors, so we have to implement scopes ourselves.  WTAF Rails.
  def self.not_started
    where(state: [0, 1])
  end

  def self.needs_player_start(user)
    where(
      "state = ? AND owner_id = ? OR state = ? AND owner_id != ?", 1, user.id, 0, user.id
    )
  end

  def self.needs_action(user)
    where("current_player_id = ? AND state = ?", user.id, 2)
  end

  def self.create_game(params)
    game = Game.create(params)
    if game.persisted?
      GameAction.create(sequence: 1, game:, user: game.owner, player: 1,
                        data: { action: "create", old_initiative: 0 })
      GameAction.create(sequence: 2, game:, user: game.owner, player: game.player_one ? 1 : 2,
                        data: { action: "join", old_initiative: 0 })
      if game.player_one && game.player_two
        GameAction.create(sequence: 3, game:, user: game.owner, player: 2,
                          data: { action: "join", old_initiative: 0 })
      end
    end
    game
  end

  def body
    {
      id:, name:, scenario:, state:,
      owner: owner.username,
      player_one: player_one&.username,
      player_two: player_two&.username,
      current_player: current_player&.username,
      winner: winner&.username,
      created_at: created_at.iso8601,
      updated_at: last_action_at,
    }
  end

  def index_body
    s = Utility::Scenario.scenario_by_id(scenario)
    body.merge(
      summary_metadata: {
        scenario_name: s[:name],
        scenario_turns: s[:metadata][:turns],
        turn: metadata["turn"],
      }
    )
  end

  def show_body
    body.merge(metadata:)
  end

  def update_game(user, params)
    return nil unless [player_one_id, player_two_id].include? user.id

    update(params)
  end

  def join(user)
    return nil if game_full? || player_one_id == user.id || player_two_id == user.id

    player = 1
    if player_one
      update(player_two_id: user.id)
      player = 2
    else
      update(player_one_id: user.id)
    end
    GameAction.create!(sequence: last_sequence + 1, game: self, user:, player:,
                       data: { action: "join", old_initiative: 0 })
    self
  end

  def resign(user)
    return nil unless finish(user)

    player = user.id == player_one_id ? 1 : 2

    GameAction.create!(sequence: last_sequence + 1, game: self, user:, player:,
                       data: { action: "resign", old_initiative: 0 })
    self
  end

  def leave(user) # rubocop:disable Metrics/MethodLength
    return nil unless game_full?
    return nil unless player_one_id == user.id || player_two_id == user.id
    return nil if owner_id == user.id

    player = 2
    if player_one == user
      update(player_one: nil)
      player = 1
    else
      update(player_two: nil)
    end
    GameAction.create!(sequence: last_sequence + 1, game: self, user:, player:,
                       data: { action: "leave", old_initiative: 0 })
    self
  end

  def start(user)
    return nil unless owner_id == user.id && ready?

    first_deploy = Utility::Scenario.scenario_by_id(scenario)[:metadata][:first_deploy]
    update!(current_player: first_deploy == 1 ? player_one : player_two)
    seq = last_sequence + 1
    GameAction.create!(sequence: seq, game: self, user:, player: 1,
                       data: { action: "start", old_initiative: 0 })
    GameAction.create!(sequence: seq + 1, game: self, user:, player: first_deploy, data:
      { action: "phase", old_initiative: 0, phase_data: {
        old_turn: 0, new_turn: 0, old_phase: 0, new_phase: 0, new_player: first_deploy,
      }, })
    in_progress!
    self
  end

  def finish(user)
    return nil unless [player_one_id, player_two_id].include? user.id
    return nil unless state == "in_progress"

    update(winner: user.id == player_one_id ? player_two : player_one)

    complete!
    self
  end

  private

  def last_sequence
    # Zero failover for testing
    GameAction.where(game_id: id).pluck(:sequence).max || 0
  end

  def last_action_at
    last_action&.created_at&.iso8601 || updated_at.iso8601
  end

  def valid_players
    errors.add(:player_one, "or player_two must not be nil") if !player_one && !player_two
    errors.add(:owner, "must be one of the players") if owner != player_one && owner != player_two
  end

  def set_current_player
    self.current_player ||= player_one
  end

  def check_players
    needs_player! if (ready? || in_progress?) && !game_full?
    ready! if needs_player? && game_full?
  end

  def game_full?
    player_one && player_two
  end
end
