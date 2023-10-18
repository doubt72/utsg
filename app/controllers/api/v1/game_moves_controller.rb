# frozen_string_literal: true

module Api
  module V1
    class GameMovesController < ApplicationController
      skip_before_action :authenticate_user!, only: [:index]

      def index
        # TODO: clean up N+1s
        game_id = params[:game_id]&.to_i
        limit = params[:after_id]&.to_i
        if limit
          render json: GameMove.where(game_id:, id: (limit + 1)..).map(&:body), status: :ok
        else
          render json: GameMove.where(game_id:).map(&:body), status: :ok
        end
      end

      def create
        if (game_move = GameMove.create_move(create_params))
          render json: game_move.body, status: :ok
        else
          render json: {}, status: :unprocessable_entity
        end
      end

      private

      def create_params
        params[:game_move].merge!(user_id: current_user.id)

        params.require(:game_move).permit(:game_id, :user_id, :data, :player)
      end
    end
  end
end
