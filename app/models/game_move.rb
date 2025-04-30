# frozen_string_literal: true

class GameMove < ApplicationRecord
  belongs_to :game
  belongs_to :user, optional: true

  validates :data, presence: true
  validates :sequence, presence: true
  validates :sequence, uniqueness: { scope: :game_id }
  validates :player, presence: true, numericality: { in: 1..2 }

  after_create :update_game_last_move
  after_create :broadcast

  def self.create_move(params)
    game = Game.find_by(id: params[:game_id])
    user_id = params[:user_id]
    return nil unless game&.in_progress?

    if (params[:player].to_i == 1 && game.player_one.id != user_id) ||
       (params[:player].to_i == 2 && game.player_two.id != user_id)
      return nil
    end

    params[:data] = JSON.parse(params[:data])

    GameMove.create!(params)
  end

  def body
    {
      id:, sequence:, user: user&.username || User::UNKNOWN_USERNAME, player:, undone:,
      data:, created_at: format_created,
    }
  end

  def update_game_last_move
    game.update!(last_move_id: id)
  end

  private

  def format_created
    created_at.iso8601
  end

  def broadcast
    ActionCable.server.broadcast("moves-#{game_id || 0}", { body: })
  end
end
