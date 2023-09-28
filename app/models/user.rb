class User < ApplicationRecord
  has_many :games, foreign_key: :owner_id, dependent: :destroy
  has_many :messages, dependent: :destroy

  has_many :games_as_player_one, class_name: "Game", foreign_key: :player_one_id, dependent: :nullify
  has_many :games_as_player_two, class_name: "Game", foreign_key: :player_two_id, dependent: :nullify

  validates :username, presence: true, uniqueness: { case_sensitive: false }
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  has_secure_password

  def self.lookup(username)
    user = User.where(
      "LOWER(username) = ? OR LOWER(email) = ?",
      username.downcase, username.downcase
    ).first
    user
  end

  def self.signup_user(params)
    params["confirmation_code"] = generate_confirmation_code
    # TODO mail out that code
    create!(params)
  end

  def reset_confirmation_code
    code = User.generate_confirmation_code
    # TODO mail out that code
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
    # TODO mail out that code
    update!(recovery_code: code, recovery_code_expires: Time.zone.now + 1.day)
  end

  def reset_password_with_code(code, password)
    return false unless recovery_code
    return false if recovery_code_expires < Time.zone.now
    return false if recovery_code != code
    update!(password: password, recovery_code: nil, recovery_code_expires: nil)
  end

  def body
    {
      username:,
      email:,
    }
  end

  private

  def self.generate_confirmation_code(length = 6)
    code = (1..length).map { [*(0..9), *("A".."Z")][rand(36)].to_s }.join
  end
end
