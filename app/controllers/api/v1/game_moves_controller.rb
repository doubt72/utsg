# frozen_string_literal: true

module Api
  module V1
    class GameMovesController < ApplicationController
      skip_before_action :authenticate_user!, only: [:index]

      def index
        game_id = params[:game_id]&.to_i
        limit = params[:after_id]&.to_i
        if limit
          render json: GameMove.includes(:user).where(game_id:, id: (limit + 1)..)
                               .order(:sequence).map(&:body),
                 status: :ok
        else
          render json: GameMove.includes(:user).where(game_id:).order(:sequence)
                               .map(&:body), status: :ok
        end
      end

      def create
        if (game_move = GameMove.create_move(create_params))
          render json: game_move.body, status: :ok
        else
          render json: {}, status: :unprocessable_entity
        end
      end

      def undo
        if current_move&.undo(current_user)
          render json: current_move.body, status: :ok
        else
          render json: {}, status: :forbidden
        end
      end

      private

      def create_params
        params[:game_move].merge!(user_id: current_user.id)

        params.require(:game_move).permit(:sequence, :game_id, :user_id, :player, :undone, :data)
      end

      def current_move
        @current_move ||= GameMove.find_by(id: params[:id])
      end
    end
  end
end
