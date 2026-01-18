# frozen_string_literal: true

module Utility
  class Scenario
    module Cache
      # Store versioned scenario data in the DB on demand
      def create_game_with_version(params)
        scenario = params[:scenario]
        data = ::Utility::Scenario.scenario_by_id(params[:scenario]) if scenario
        scenario_version = data[:version] if data

        unless ScenarioVersion.exists?(scenario:, version: scenario_version)
          ScenarioVersion.create(scenario:, version: scenario_version, data: data.to_json)
        end
        Game.create(params.merge(scenario_version:))
      end
    end
  end
end
