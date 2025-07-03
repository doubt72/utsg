# frozen_string_literal: true

module Api
  module V1
    class RatingsController < ApplicationController
      skip_before_action :authenticate_user!, only: [:index]

      def index
        render json: Rating.average_rating(params[:scenario_id]), status: :ok
      end

      def show
        if current_rating
          render json: current_rating.show_body, status: :ok
        else
          render json: {}, status: :not_found
        end
      end

      def create
        rating = Rating.create_or_update(create_params)
        if rating.persisted?
          render json: rating.show_body, status: :ok
        else
          render json: rating.errors, status: :unprocessable_entity
        end
      end

      private

      def current_rating
        @current_rating ||= Rating.find_by(
          scenario: params[:scenario], user_id: current_user.id
        )
      end

      def create_params
        params[:rating].merge!(user_id: current_user.id)
        params.require(:rating).permit(:user_id, :scenario, :rating)
      end
    end
  end
end
