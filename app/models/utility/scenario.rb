# frozen_string_literal: true

module Utility
  class Scenario
    class << self
      include Utility::Scenario::Definitions
      include Utility::Scenario::Filter
      include Utility::Scenario::Sort

      def all_scenarios(options = {})
        scenarios = ::Scenarios.constants.reject { |k| %i[Base Scenario999].include?(k) }
                               .map { |k| ::Scenarios.const_get(k).index_record }
        filter(scenarios, options)
        sort(scenarios, options["sort"], options["sort_dir"]).map do |s|
          s.except(:string, :date, :layout, :allied_units, :axis_units)
        end
      end

      def nations_by_key(side, code)
        faction = if side == "allies"
                    Utility::Scenario::Definitions::AVAILABLE_ALLIED_FACTIONS
                  else
                    Utility::Scenario::Definitions::AVAILABLE_AXIS_FACTIONS
                  end
        faction.find { |x| x[:code] == code }[:nations]
      end

      def all_units(scenario)
        units = scenario[:allied_units].map { |t| t[1] }.flatten(1) +
                scenario[:axis_units].map { |t| t[1] }.flatten(1)

        units.map { |u| u[:list] }.flatten(1)
      end

      def processed_units(scenario)
        ::Scenarios::Base.convert_units(all_units(scenario))
      end

      def scenario_by_id(id)
        return if id&.empty?

        name = "Scenario#{id.is_a?(String) ? id : format('%03d', id)}"

        ::Scenarios.const_get(name).full_record
      end
    end
  end
end
