class Game < ApplicationRecord
  belongs_to :owner, class_name: 'User'
  belongs_to :player_one, class_name: 'User', optional: true
  belongs_to :player_two, class_name: 'User', optional: true
  belongs_to :current_player, class_name: 'User', optional: true

  has_many :game_moves, dependent: destroy
  has_many :messages, dependent: destroy
  has_one :last_move_id

  validates :owner, presence: true
  validates :name, presence: true
  validates :state, presence: true
  validates :metadata, presence: true

  after_save :check_players

  # needs_player:   owner must choose side when creating game
  # ready:          players joined, start needs confirmation (but non-owner can drop back out)
  # in_progress:    game currently being played
  #                 -> moves to needs_player if player deletes account (otherwise no quitting)
  # complete:       game over
  enum state: [ needs_player: 0, :ready, :in_progress, :complete ]

  private

  def check_players
    if (ready? || in_progress?) && !(player_one && player_two)
      update!(state: :needs_player)
    end
  end
end
