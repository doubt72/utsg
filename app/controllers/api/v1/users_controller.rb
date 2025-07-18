# frozen_string_literal: true

module Api
  module V1
    class UsersController < ApplicationController
      skip_before_action :authenticate_user!, only: %i[
        create check_conflict set_recovery password_reset
      ]

      def create
        user = User.signup_user(create_params)
        if user && !user.errors.present?
          session[:current_user] = user.id
          render json: user.body, status: :created
        else
          render json: user.errors, status: :unprocessable_entity
        end
      end

      def update
        if current_user.update_user(update_params)
          render json: current_user.body, status: :ok
        else
          render json: { message: "not authorized" }, status: :unauthorized
        end
      end

      def destroy
        user = current_user
        session[:current_user] = nil
        user.destroy
        render json: {}, status: :ok
      end

      def new_code
        current_user.reset_confirmation_code
        render json: current_user.body, status: :ok
      end

      def validate_code
        code = params[:code]
        if current_user.confirmation_code == code
          current_user.update!(confirmation_code: nil, verified: true)
          render json: {}, status: :ok
        else
          render json: { message: "confirmation code is invalid" }, status: :forbidden
        end
      end

      def check_conflict
        user = User.lookup(params[:check].downcase) ||
               params[:check].downcase == User::UNKNOWN_USERNAME
        render json: { conflict: user ? true : false }, status: :ok
      end

      def set_recovery
        User.lookup(params[:check].downcase)&.set_recovery_code
        render json: {}, status: :ok
      end

      def password_reset
        if User.lookup(params[:check].downcase)
               &.reset_password_with_code(params[:code], params[:password])
          render json: {}, status: :ok
        else
          render json: { message: "recovery code is invalid" }, status: :forbidden
        end
      end

      def stats
        stats = User.stats(params[:id])
        if stats
          render json: stats, status: :ok
        else
          render json: {}, status: :not_found
        end
      end

      private

      def create_params
        params.require(:user).permit(:username, :email, :password)
      end

      def update_params
        params.require(:user).permit(:username, :email, :password, :old_password)
      end
    end
  end
end
