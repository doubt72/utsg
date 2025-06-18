# frozen_string_literal: true

module Api
  module V1
    class GameActionsController < ApplicationController
      skip_before_action :authenticate_user!, only: [:index]

      def index
        game_id = params[:game_id]&.to_i
        limit = params[:after_id]&.to_i
        if limit
          render json: GameAction.includes(:user).where(game_id:, id: (limit + 1)..)
                                 .order(:sequence).map(&:body),
                 status: :ok
        else
          render json: GameAction.includes(:user).where(game_id:).order(:sequence)
                                 .map(&:body), status: :ok
        end
      end

      def create
        if (game_action = GameAction.create_action(create_params))
          render json: game_action.body, status: :ok
        else
          render json: {}, status: :unprocessable_entity
        end
      end

      def undo
        if current_action&.undo(current_user)
          render json: current_action.body, status: :ok
        else
          render json: {}, status: :forbidden
        end
      end

      private

      def create_params
        params[:game_action].merge!(user_id: current_user.id)

        params.require(:game_action).permit(:sequence, :game_id, :user_id, :player, :undone, :data)
      end

      def current_action
        @current_action ||= GameAction.find_by(id: params[:id])
      end
    end
  end
end
