class Game < ApplicationRecord
  belongs_to :owner, class_name: 'User'
  belongs_to :player_one, class_name: 'User'
  belongs_to :player_two, class_name: 'User'

  has_many :messages

  validates :owner, presence: true
  validates :name, presence: true
end
