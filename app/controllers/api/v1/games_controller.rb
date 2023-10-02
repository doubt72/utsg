# frozen_string_literal: true

module Api
  module V1
    class GamesController < ApplicationController
      skip_before_action :authenticate_user!, only: %i[index show]

      def index
        # TODO: do we need to limit by state?  Or perhaps aggregate by state?
        # Or just leave to client side?
        # TODO: pagination
        # TODO: Clean up N+1s
        if (user = User.lookup(params[:user]))
          render json: user_games(user), status: :ok
        else
          render json: all_games, status: :ok
        end
      end

      def show
        # TODO: version with moves included?
        if current_game
          render json: current_game.show_body, status: :ok
        else
          render json: {}, status: :not_found
        end
      end

      def create
        game = Game.create(create_params)
        if !game.errors
          render json: game.show_body, status: :ok
        else
          render json: game.errors, status: :unprocessable_entity
        end
      end

      def update
        if current_game&.update_game(current_user, update_params)
          render json: current_game.show_body, status: :ok
        else
          render json: {}, status: :forbidden
        end
      end

      def join
        if current_game&.join(current_user)
          render json: current_game.show_body, status: :ok
        else
          render json: {}, status: :forbidden
        end
      end

      def start
        if current_game&.start(current_user)
          render json: current_game.show_body, status: :ok
        else
          render json: {}, status: :forbidden
        end
      end

      def complete
        if current_game&.complete(current_user)
          render json: current_game.show_body, status: :ok
        else
          render json: {}, status: :forbidden
        end
      end

      private

      def all_games
        Game.all.order(created_at: :desc).map(&:index_body)
      end

      def user_games(user)
        Game.user_games(user).order(created_at: :desc).map(&:index_body)
      end

      def create_params
        params[:game].merge!(owner_id: current_user.id)
        translate("player_one")
        translate("player_two")

        params.require(:game).permit(:name, :owner_id, :player_one_id, :player_two_id, :metadata)
      end

      def update_params
        translate("current_player")

        params.require(:game).permit(:current_player_id, :metadata)
      end

      def translate(player)
        params[:game].merge!("#{player}_id".to_sym => User.lookup(params[:game][player.to_sym])&.id)
      end

      def current_game
        @current_game ||= Game.find_by(id: params[:id])
      end
    end
  end
end
