# frozen_string_literal: true

class Message < ApplicationRecord
  belongs_to :user
  belongs_to :games, optional: true

  validates :user, presence: true
  validates :value, presence: true

  after_create :broadcast

  def format_created
    created_at.iso8601
  end

  def body
    { created_at: format_created, username: user.username, value: }
  end

  private

  def broadcast
    ActionCable.server.broadcast(
      "game-#{game_id || 0}",
      {
        body: { created_at: format_created, username: user.username, value: },
      }
    )
  end
end
