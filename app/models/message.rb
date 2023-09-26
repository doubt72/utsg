class Message < ApplicationRecord
  belongs_to :user
  belongs_to :games

  validate :owner, presence: true
  validate :value, presence: true
end
