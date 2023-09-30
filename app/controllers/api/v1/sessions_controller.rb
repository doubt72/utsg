# frozen_string_literal: true

module Api
  module V1
    class SessionsController < ApplicationController
      skip_before_action :authenticate_user!, only: %i[create auth]

      def create
        user = User.lookup(params[:user][:username])
        if user&.authenticate(params[:user][:password])
          session[:current_user] = user.id
          render json: user.body, status: :ok
        else
          render json: { message: "not authorized" }, status: :unauthorized
        end
      end

      def destroy
        session[:current_user] = nil
        render json: {}, status: :ok
      end

      def auth
        if current_user
          if current_user.verified
            render json: current_user.body, status: :ok
          else
            render json: current_user.body, status: :forbidden
          end
        else
          render json: { message: "not authorized" }, status: :unauthorized
        end
      end
    end
  end
end
