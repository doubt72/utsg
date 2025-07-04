# frozen_string_literal: true

class User < ApplicationRecord
  # Owned games are deleted only if no other users are associated with them (see
  # before_destroy hooks)
  has_many :games, foreign_key: :owner_id
  has_many :messages
  has_many :ratings

  has_many :games_as_player_one, class_name: "Game", foreign_key: :player_one_id
  has_many :games_as_player_two, class_name: "Game", foreign_key: :player_two_id
  has_many :games_as_current_player, class_name: "Game", foreign_key: :current_player_id
  has_many :game_actions, dependent: :nullify

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

    def stats(username)
      user = lookup(username)
      return unless user

      games = {}
      Game.where("(player_one_id = ? OR player_two_id = ?) AND player_one_id <> player_two_id",
                 user.id, user.id).each do |game|
        game_record(user, game, games)
      end
      games.merge(all: total_record(games))
    end

    private

    def game_record(user, game, games)
      curr = games[game.scenario] ||= {
        name: Utility::Scenario.scenario_by_id(game.scenario)[:name],
        count: 0, win: 0, loss: 0, wait: 0, abandoned: 0,
      }
      curr[:count] += 1
      if game.winner_id
        game.winner_id == user.id ? curr[:win] += 1 : curr[:loss] += 1
      elsif game.current_player_id == user.id
        game.updated_at > 7.days.ago ? curr[:wait] += 1 : curr[:abandoned] += 1
      end
    end

    def total_record(games)
      games.map { |g| g[1] }.reduce(
        { name: "total", count: 0, win: 0, loss: 0, wait: 0, abandoned: 0 }
      ) do |sum, s|
        {
          name: "total", count: sum[:count] + s[:count],
          win: sum[:win] + s[:win], loss: sum[:loss] + s[:loss],
          wait: sum[:wait] + s[:wait], abandoned: sum[:abandoned] + s[:abandoned],
        }
      end
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
