# frozen_string_literal: true

class User < ApplicationRecord
  # Owned games are deleted only if no other users are associated with them (see
  # before_destroy hooks)
  has_many :games, foreign_key: :owner_id
  has_many :messages

  has_many :games_as_player_one, class_name: "Game", foreign_key: :player_one_id
  has_many :games_as_player_two, class_name: "Game", foreign_key: :player_two_id
  has_many :games_as_current_player, class_name: "Game", foreign_key: :current_player_id
  has_many :game_moves, dependent: :nullify

  validates :username, presence: true, uniqueness: { case_sensitive: false }
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  has_secure_password

  before_destroy :reassign_games_nullify_and_destroy
  before_destroy :cleanup_messages

  UNKNOWN_USERNAME = "[unknown]"

  class << self
    def lookup(username)
      return nil unless username.present?

      User.where(
        "LOWER(username) = ? OR LOWER(email) = ?",
        username.downcase, username.downcase
      ).first
    end

    def signup_user(params)
      params["confirmation_code"] = generate_confirmation_code
      # TODO: mail out that code
      create(params)
    end

    def generate_confirmation_code(length = 6)
      (1..length).map { [*(0..9), *("A".."Z")][rand(36)].to_s }.join
    end
  end

  def reset_confirmation_code
    code = User.generate_confirmation_code
    # TODO: mail out that code
    update!(confirmation_code: code)
  end

  def update_user(params)
    if params["password"]
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
    { username:, email: }
  end

  private

  # Doing this ourselves because dependencies don't fire hooks
  def reassign_games_nullify_and_destroy
    reassign_games
    cleanup_games
  end

  def reassign_games
    Game.where(owner: self).each do |g|
      if g.player_one && g.player_one != self
        g.update!(owner: g.player_one)
      elsif g.player_two && g.player_two != self
        g.update!(owner: g.player_two)
      end
    end
  end

  def cleanup_games
    Game.where(owner: self).destroy_all

    %i[player_one player_two current_player].each do |f|
      Game.where(f => self).each { |g| g.update!(f => nil) }
    end
  end

  def cleanup_messages
    Message.where(user: self, game: nil).destroy_all
    Message.where(user: self).update_all(user_id: nil)
  end
end
