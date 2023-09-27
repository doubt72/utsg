class Message < ApplicationRecord
  belongs_to :user
  belongs_to :games, optional: true

  validates :user, presence: true
  validates :value, presence: true
  
  after_create :broadcast

  def created
    created_at.iso8601
  end

  def body
    { created_at: created, username: user.username, value: value }
  end

  private

  def broadcast
    ActionCable.server.broadcast("game-#{game_id || 0}", {
      body: { created_at: created, username: user.username, value: value }
    })
  end
end
