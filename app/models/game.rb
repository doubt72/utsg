class Game < ApplicationRecord
  belongs_to :owner, class_name: 'User'
  belongs_to :player_one, class_name: 'User', optional: true
  belongs_to :player_two, class_name: 'User', optional: true

  has_many :game_moves
  has_many :messages

  validates :owner, presence: true
  validates :name, presence: true
end
