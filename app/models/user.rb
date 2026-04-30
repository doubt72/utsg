# frozen_string_literal: true

class User < ApplicationRecord # rubocop:disable Metrics/ClassLength
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
      code = generate_confirmation_code
      params["confirmation_code"] = code
      user = create(params)

      ::Utility::NotificationEmails.confirmation_code_resend(user, code)
      user
    end

    def generate_confirmation_code(length = 6)
      (1..length).map { [*(0..9), *("A".."Z")][rand(36)].to_s }.join
    end

    def toggle_dev(username)
      user = lookup(username)
      user.update!(developer: !user.developer)
    end

    def toggle_banned(username)
      user = lookup(username)
      user.update!(banned: !user.banned)
    end

    def notify(current_user, username, game_id) # rubocop:disable Metrics/CyclomaticComplexity
      user = lookup(username)
      game = Game.find(game_id)
      return false unless current_user == game.player_one || current_user == game.player_two
      return true if user.notified || !user.notifications || !game.in_progress?

      action = GameAction.where(game_id:, user:, undone: false).order(sequence: :desc).first
      if action && action.created_at < 15.minutes.ago
        ::Utility::NotificationEmails.turn_notification(user, game)
        user.update!(notified: true)
      end
      :success
    end

    def stats(username)
      user = lookup(username)
      return unless user

      games = {}
      Game.where("(player_one_id = ? OR player_two_id = ?) AND player_one_id <> player_two_id",
                 user.id, user.id).each do |game|
        game_record(user, game, games)
      end
      { stats: games.merge(all: total_record(games)), user: user.body }
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
    update!(confirmation_code: code)

    ::Utility::NotificationEmails.confirmation_code_resend(self, code)
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
    update!(recovery_code: code, recovery_code_expires: Time.zone.now + 1.day)

    ::Utility::NotificationEmails.recovery_code(self, code)
  end

  def reset_password_with_code(code, password)
    return false unless recovery_code
    return false if recovery_code_expires < Time.zone.now
    return false if recovery_code != code

    update!(password:, recovery_code: nil, recovery_code_expires: nil)
  end

  def toggle_notifications
    update!(notifications: !notifications)
  end

  def body
    # The rest doesn't matter if banned
    return { username:, email:, banned: } if banned
    return { username:, email:, notifications:, proto: true, mcp: true } if admin && developer
    return { username:, email:, notifications:, proto: true } if developer
    return { username:, email:, notifications:, mcp: true } if admin

    { username:, email:, notifications: }
  end

  def index_body # rubocop:disable Metrics/CyclomaticComplexity
    rc = recovery_code&.length&.positive? || false
    {
      username:, email:, proto: developer, mcp: admin,
      cc: confirmation_code&.length&.positive? || false,
      rc:, rc_valid: rc && recovery_code_expires > Time.zone.now, verified:, banned:,
    }
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
