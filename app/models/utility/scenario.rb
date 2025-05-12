# frozen_string_literal: true

module Utility
  class Scenario
    include Utility::Scenarios::Definitions

    class << self
      def all_scenarios(options = {})
        scenarios = ::Scenarios.constants.reject { |k| %i[Base Scenario999].include?(k) }
                               .map { |k| ::Scenarios.const_get(k).index_record }
        filter(scenarios, :string, options)
        filter(scenarios, :allies, options)
        filter(scenarios, :axis, options)
        scenarios.sort { |a, b| a[:id] <=> b[:id] }.each { |s| s.delete(:string) }
      end

      def filter(scenarios, key, options)
        return unless options[key]

        if key == :string
          scenarios.filter! do |s|
            s[key].include?(options[key].downcase) || s[:id].include?(options[key])
          end
          return
        end
        nations = nations_by_key(key, options[key])
        scenarios.filter! do |s|
          !s[key].intersection(nations).empty?
        end
      end

      def nations_by_key(side, code)
        factions = if side == :allies
                     Utility::Scenarios::Definitions::AVAILABLE_ALLIED_FACTIONS
                   else
                     Utility::Scenarios::Definitions::AVAILABLE_AXIS_FACTIONS
                   end
        factions.find { |x| x[:code] == code }[:nations]
      end

      def scenario_by_id(id)
        return if id&.empty?

        ::Scenarios.constants.map { |k| ::Scenarios.const_get(k) }
                   .select { |k| id == k::ID }.last&.full_record
      end
    end
  end
end
