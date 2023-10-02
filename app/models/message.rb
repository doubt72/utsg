# frozen_string_literal: true

class Message < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :game, optional: true

  validates :user, presence: true
  validates :value, presence: true

  after_create :broadcast

  def format_created
    created_at.iso8601
  end

  def username
    user&.username || User::UNKNOWN_USERNAME
  end

  def body
    { created_at: format_created, user: username, value: }
  end

  private

  def broadcast
    ActionCable.server.broadcast(
      "game-#{game_id || 0}",
      {
        body: { created_at: format_created, user: username, value: },
      }
    )
  end
end
