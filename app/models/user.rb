# frozen_string_literal: true

class User < ApplicationRecord
  # Owned games are deleted only if no other users are associated with them (see reassign_games)
  has_many :games, foreign_key: :owner_id, dependent: :destroy
  has_many :messages, dependent: :destroy

  # Games are not otherwise deleted, only abandoned (other participants can still see/continue them)
  has_many :games_as_player_one, class_name: "Game", foreign_key: :player_one_id, dependent: :nullify
  has_many :games_as_player_two, class_name: "Game", foreign_key: :player_two_id, dependent: :nullify
  has_many :games_as_current_player, class_name: "Game", foreign_key: :current_player_id,
                                     dependent: :nullify
  has_many :game_moves, dependent: :nullify

  validates :username, presence: true, uniqueness: { case_sensitive: false }
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  has_secure_password

  before_destroy :reassign_games

  class << self
    def self.lookup(username)
      User.where(
        "LOWER(username) = ? OR LOWER(email) = ?",
        username.downcase, username.downcase
      ).first
    end

    def self.signup_user(params)
      params["confirmation_code"] = generate_confirmation_code
      # TODO: mail out that code
      create!(params)
    end

    private_class_methods

    def self.generate_confirmation_code(length = 6)
      (1..length).map { [*(0..9), *("A".."Z")][rand(36)].to_s }.join
    end
  end

  def reset_confirmation_code
    code = User.generate_confirmation_code
    # TODO: mail out that code
    update!(confirmation_code: code)
  end

  def update_user(params)
    if params["old_password"]
      return false unless authenticate(params["old_password"])

      update!(password: params["password"])
    else
      update!(params)
    end
  end

  def set_recovery_code
    code = User.generate_confirmation_code(12).downcase
    # TODO: mail out that code
    update!(recovery_code: code, recovery_code_expires: Time.zone.now + 1.day)
  end

  def reset_password_with_code(code, password)
    return false unless recovery_code
    return false if recovery_code_expires < Time.zone.now
    return false if recovery_code != code

    update!(password:, recovery_code: nil, recovery_code_expires: nil)
  end

  def body
    {
      username:,
      email:,
    }
  end

  private

  def reassign_games
    # Reassign games to other players if possible
    Game.where(owner: self).each do |g|
      if g.player_one && g.player_one != self
        g.update!(owner: g.player_one)
      elsif g.player_two && g.player_two != self
        g.update!(owner: g.player_two)
      end
    end
  end
end
