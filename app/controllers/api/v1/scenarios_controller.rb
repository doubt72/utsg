# frozen_string_literal: true

module Api
  module V1
    class ScenariosController < ApplicationController
      skip_before_action :authenticate_user!

      def index
        options = {}
        params.each_pair do |key, value|
          options[key] = value if %w[
            string allies axis status theater type size sort sort_dir
          ].include? key
        end
        render json: paginate(Utility::Scenario.all_scenarios(options)), status: :ok
      end

      def show
        render json: Utility::Scenario.scenario_by_id(params[:id]), status: :ok
      end

      def allied_factions
        render json: Utility::Scenario::Definitions::AVAILABLE_ALLIED_FACTIONS, status: :ok
      end

      def axis_factions
        render json: Utility::Scenario::Definitions::AVAILABLE_AXIS_FACTIONS, status: :ok
      end

      def all_units
        render json: Utility::Scenario::Units.lookup_data, status: :ok
      end

      private

      def paginate(data)
        page_size = 10
        page = params[:page].to_i || 0
        count = data.length
        {
          data: data[(page * page_size)..((page_size * (page + 1)) - 1)],
          page:, more: count > page_size * (page + 1),
        }
      end
    end
  end
end
