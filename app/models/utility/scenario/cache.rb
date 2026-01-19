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

      def scenario_by_version_id(id, version)
        if version
          data = ScenarioVersion.find_by(scenario: id, version:)&.data
          data = JSON.parse(data) if data
        end
        data || scenario_by_id(id)
      end
    end
  end
end
