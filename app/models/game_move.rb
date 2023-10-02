# frozen_string_literal: true

class GameMove < ApplicationRecord
  belongs_to :game
  belongs_to :user, optional: true

  validates :data, presence: true
  validates :player, presence: true, numericality: { in: 1..2 }

  after_create :update_game_last_move

  def self.create_move(params)
    game = Game.find_by(id: params[:game_id])
    user_id = params[:user_id]
    return nil unless game&.in_progress?

    if params[:player].to_i == 1 && game.player_one.id != user_id ||
       params[:player].to_i == 2 && game.player_two.id != user_id
      return nil
    end

    GameMove.create(params)
  end

  def body
    {
      game_id:, user: user&.username || User::UNKNOWN_USERNAME, player:, data:,
      created_at: created_at.iso8601,
    }
  end

  def update_game_last_move
    game.update!(last_move_id: id)
  end
end
