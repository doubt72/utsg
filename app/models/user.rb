class User < ApplicationRecord
  validates :username, presence: true, uniqueness: { case_sensitive: false }
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  has_secure_password

  def self.lookup(username)
    user = User.find_by(username: username)
    user = User.find_by(email: username) unless user
    user
  end

  def self.signup_user(create_params)
    code = (0..5).map { [*(0..9), *("A".."Z")][rand(36)].to_s }.join
    create_params["confirmation_code"] = code
    # TODO mail out that code
    create!(create_params)
  end
end
