# frozen_string_literal: true

module Api
  module V1
    class GamesController < ApplicationController # rubocop:disable Metrics/ClassLength
      skip_before_action :authenticate_user!, only: %i[index show]

      def index
        games = index_games(params[:scope])
        if (user = User.lookup(params[:user]))
          games = games.for_user(user)
        end
        render json: serialize_index(games), status: :ok
      end

      def show
        if current_game
          render json: current_game.show_body, status: :ok
        else
          render json: {}, status: :not_found
        end
      end

      def create
        game = Game.create_game(create_params)
        if game.persisted?
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

      def leave
        if current_game&.leave(current_user)
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

      def index_includes
        %i[owner player_one player_two winner last_move]
      end

      def index_games(scope) # rubocop:disable Metrics/MethodLength
        games = Game.includes(index_includes)
        case scope
        when "not_started"
          games = games.not_started
        when "active"
          games = games.in_progress
        when "complete"
          games = games.complete
        when "needs_action"
          games = games.needs_action(current_user)
        when "needs_move"
          games = games.needs_move(current_user)
        end
        games.order(created_at: :desc)
      end

      def serialize_index(games)
        page_size = 8
        page = params[:page].to_i
        count = games.count
        games = games.limit(page_size).offset(page * page_size)
        { data: games.map(&:index_body), page:, more: count > page_size * (page + 1) }
      end

      def create_params
        p = params.require(:game).permit(
          :name, :scenario, :player_one, :player_two, :metadata
        )
        p[:owner_id] = current_user.id
        # raw json causes issues with parameter validation
        p[:metadata] = JSON.parse(p[:metadata])
        translate(translate(p, "player_one"), "player_two")
      end

      def update_params
        p = params.require(:game).permit(:current_player, :metadata)
        p[:metadata] = JSON.parse(p[:metadata]) if p[:metadata]
        translate(p, "current_player")
      end

      def translate(pars, player)
        pars[:"#{player}_id"] = User.lookup(pars[player.to_sym])&.id
        pars.delete(player.to_sym)
        pars
      end

      def current_game
        @current_game ||= Game.find_by(id: params[:id])
      end
    end
  end
end
