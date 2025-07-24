# frozen_string_literal: true

class GameAction < ApplicationRecord
  belongs_to :game
  belongs_to :user, optional: true

  validates :data, presence: true
  validates :sequence, presence: true
  validates :sequence, uniqueness: { scope: :game_id }
  validates :player, presence: true, numericality: { in: 1..2 }

  after_create :update_game_last_action
  after_create :broadcast

  def self.create_action(params)
    game = Game.find_by(id: params[:game_id])
    user_id = params[:user_id]
    return nil unless game&.in_progress?

    if (params[:player].to_i == 1 && game.player_one.id != user_id) ||
       (params[:player].to_i == 2 && game.player_two.id != user_id)
      return nil
    end

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

    update!(undone: true)

    ActionCable.server.broadcast("actions-#{game_id || 0}", { body: })
    true
  end

  def update_game_last_action
    game.update!(last_action_id: id)
  end

  private

  def undoable?(user)
    return false if user.id != user_id || undone
    return false unless !data["dice_result"] || data["dice_result"].empty?
    # action "action" isn't actually used except for testing
    return false unless %w[action deploy info phase move assault_move rout_self]
                        .include?(data["action"])
    if GameAction.where(
      "game_id = ? AND sequence > ? AND undone = false", game_id, sequence
    ).count.positive?
      return false
    end

    true
  end

  def format_created
    created_at.iso8601
  end

  def broadcast
    ActionCable.server.broadcast("actions-#{game_id || 0}", { body: })
  end
end
