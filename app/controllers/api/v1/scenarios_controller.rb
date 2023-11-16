# frozen_string_literal: true

module Api
  module V1
    class ScenariosController < ApplicationController
      skip_before_action :authenticate_user!

      def index
        options = {}
        options[:string] = params[:string] if params[:string].present?
        options[:allies] = params[:allies] if params[:allies].present?
        options[:axis] = params[:axis] if params[:axis].present?
        render json: paginate(Utility::Scenario.all_scenarios(options)), status: :ok
      end

      def show
        render json: Utility::Scenario.scenario_by_id(params[:id]), status: :ok
      end

      def allied_factions
        render json: Utility::Scenarios::Definitions::AVAILABLE_ALLIED_FACTIONS, status: :ok
      end

      def axis_factions
        render json: Utility::Scenarios::Definitions::AVAILABLE_AXIS_FACTIONS, status: :ok
      end

      def all_units
        render json: Utility::Scenarios::Units.lookup_data, status: :ok
      end

      private

      def paginate(data)
        page_size = 10
        page = params[:page].to_i || 0
        count = data.length
        {
          data: data[(page * page_size)..(page_size * (page + 1) - 1)],
          page:, more: count > page_size * (page + 1),
        }
      end
    end
  end
end
