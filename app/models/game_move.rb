# frozen_string_literal: true

class GameMove < ApplicationRecord
  belongs_to :game
  belongs_to :user, optional: true

  validates :data, presence: true
end
