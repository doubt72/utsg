# frozen_string_literal: true

class Game < ApplicationRecord
  belongs_to :owner, class_name: "User"
  belongs_to :player_one, class_name: "User", optional: true
  belongs_to :player_two, class_name: "User", optional: true
  belongs_to :current_player, class_name: "User", optional: true
  belongs_to :winner, class_name: "User", optional: true

  has_many :moves, class_name: "GameMove", dependent: :destroy
  has_many :messages, dependent: :destroy
  has_one :last_move, class_name: "GameMove", required: false

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
  #                 -> moves to needs_player if player deletes account (otherwise no quitting)
  # complete:       game over
  enum state: %i[needs_player ready in_progress complete]

  def self.user_games(user)
    # Owner should always be player one or two; players can only change if user deleted
    Game.where("player_one_id = ? OR player_two_id = ?", user.id, user.id)
  end

  def index_body # rubocop:disable Metrics/AbcSize
    {
      id:, name:, scenario:, state:,
      owner: owner.username,
      player_one: player_one&.username,
      player_two: player_two&.username,
      current_player: current_player&.username,
      winner: winner&.username,
      created_at: created_at.iso8601,
      updated_at: last_moved_at,
    }
  end

  def show_body
    index_body.merge(metadata:)
  end

  def update_game(user, params)
    return nil unless [player_one_id, player_two_id].include? user.id

    update(params)
  end

  def join(user)
    return nil if game_full? || player_one_id == user.id || player_two_id == user.id

    !player_one_id ? update(player_one_id: user.id) : update(player_two_id: user.id)
  end

  def start(user)
    return nil unless owner_id == user.id && ready?

    in_progress!
    self
  end

  def complete(user)
    return nil unless [player_one_id, player_two_id].include? user.id

    complete!
    self
  end

  private

  def last_moved_at
    last_move&.created_at&.iso8601 || updated_at.iso8601
  end

  def valid_players
    errors.add(:player_one, "or player_two must not be nil") if !player_one && !player_two
    if player_one == player_two && player_one
      errors.add(:player_one, "cannot be the same as player two")
    end
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
