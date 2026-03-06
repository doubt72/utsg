# frozen_string_literal: true

class GameAction < ApplicationRecord
  belongs_to :game
  belongs_to :user, optional: true

  validates :data, presence: true
  validates :sequence, presence: true
  validates :sequence, uniqueness: { scope: :game_id }
  validates :player, presence: true, numericality: { in: 1..2 }

  after_create :update_game_last_action
  after_update :broadcast_if_undone
  after_create :broadcast

  def self.create_action(params)
    game = Game.find_by(id: params[:game_id])
    user_id = params[:user_id]
    return nil unless game&.in_progress?
    return nil if game.player_one.id != user_id.to_i && game.player_two.id != user_id.to_i

    params[:data] = JSON.parse(params[:data])

    GameAction.create!(params)
  end

  def body
    {
      id:, sequence:, user: user&.username || User::UNKNOWN_USERNAME, player:, undone:,
      data:, created_at: format_created,
    }
  end

  def undo(user)
    return nil unless undoable?(user)

    records = GameAction.where("game_id = ? AND sequence >= ?", game_id, sequence)
    records.each do |a|
      a.update!(undone: true)
    end
    true
  end

  def update_game_last_action
    game.update!(last_action_id: id)
  end

  private

  def undoable?(user)
    return false if undone
    return false unless [game.player_one.id, game.player_two.id].include?(user.id)

    # (not going to whitelist actions for now; dice results should be enough for the moment)
    # action "action" isn't actually used except for testing
    # return false unless %w[action deploy info phase move assault_move rout_self]
    #                     .include?(data["action"])

    records = GameAction.where("game_id = ? AND sequence >= ?", game_id, sequence).filter do |a|
      a.data["dice_result"]&.present?
    end
    return false if records.any?

    true
  end

  def format_created
    created_at.iso8601
  end

  def broadcast
    ActionCable.server.broadcast("actions-#{game_id || 0}", { body: })
  end

  def broadcast_if_undone
    broadcast if undone
  end
end
