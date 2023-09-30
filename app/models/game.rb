# frozen_string_literal: true

class Game < ApplicationRecord
  belongs_to :owner, class_name: "User"
  belongs_to :player_one, class_name: "User", optional: true
  belongs_to :player_two, class_name: "User", optional: true
  belongs_to :current_player, class_name: "User", optional: true

  has_many :game_moves, dependent: :destroy
  has_many :messages, dependent: :destroy
  has_one :last_move, class_name: "GameMove", required: false

  validates :owner, presence: true
  validates :name, presence: true
  validates :state, presence: true

  after_save :check_players

  # needs_player:   owner must choose side when creating game
  # ready:          players joined, start needs confirmation (but non-owner can drop back out)
  # in_progress:    game currently being played
  #                 -> moves to needs_player if player deletes account (otherwise no quitting)
  # complete:       game over
  enum state: %i[needs_player ready in_progress complete]

  private

  def check_players
    update!(state: :needs_player) if (ready? || in_progress?) && !game_full?
    update!(state: :ready) if needs_player? && game_full?
  end

  def game_full?
    player_one && player_two
  end
end
