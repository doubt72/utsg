class Api::V1::UsersController < ApplicationController
  skip_before_action :authenticate_user!, only: [:create, :auth]
  # before_action :set_user, only: %i[show destroy]

  def create
    user = User.signup_user(create_params)
    if user
      session[:current_user] = user.id
      render json: user, status: :created
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

  def auth
    if current_user
      body = {
        username: current_user.username,
        email: current_user.email,
      }
      if current_user.verified
        render json: body, status: :ok
      else
        render json: body, status: :forbidden
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

  private

  def create_params
    params.require(:user).permit(:username, :email, :password)
  end

  def set_user
    @user = User.find(params[:id])
  end
end
