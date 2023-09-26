class User < ApplicationRecord
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

  def body
    {
      username:,
      email:,
    }
  end

  private

  def self.generate_confirmation_code
    code = (0..5).map { [*(0..9), *("A".."Z")][rand(36)].to_s }.join
  end
end
