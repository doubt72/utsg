class Api::V1::UsersController < ApplicationController
  skip_before_action :authenticate_user!, only: [:create, :login, :auth, :check_conflict]

  def create
    user = User.signup_user(create_params)
    if user
      session[:current_user] = user.id
      render json: user_body, status: :created
    else
      render json: user.errors, status: :unprocessable_entity
    end
  end

  # def update
  # end

  # def destroy
  #   @user.destroy
  #   render json: { message: 'success' }
  # end

  def login
    user = User.lookup(params[:user][:username])
    if user && user.authenticate(params[:user][:password])
      session[:current_user] = user.id
      render json: user_body, status: :ok
    else
      render json: { message: 'not authorized' }, status: :unauthorized
    end
  end

  def logout
    session[:current_user] = nil
    render json: {}, status: :ok
  end

  def auth
    if current_user
      if current_user.verified
        render json: user_body, status: :ok
      else
        render json: user_body, status: :forbidden
      end
    else
      render json: { message: 'not authorized' }, status: :unauthorized
    end
  end

  def validate_code
    code = params[:code]
    if current_user.confirmation_code == code
      current_user.update!(confirmation_code: nil, verified: true)
      render json: {}, status: :ok
    else
      render json: { message: 'confirmation code is invalid' }, status: :forbidden
    end
  end

  def check_conflict
    puts params
    user = User.lookup(params[:check].downcase)
    render json: { conflict: user ? true : false }, status: :ok
  end

  private

  def create_params
    params.require(:user).permit(:username, :email, :password)
  end

  def user_body
    {
      username: current_user.username,
      email: current_user.email,
    }
  end
end
