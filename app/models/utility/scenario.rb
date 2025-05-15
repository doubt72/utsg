# frozen_string_literal: true

module Utility
  class Scenario # rubocop:disable Metrics/ClassLength
    include Utility::Scenarios::Definitions

    class << self
      def all_scenarios(options = {})
        scenarios = ::Scenarios.constants.reject { |k| %i[Base Scenario999].include?(k) }
                               .map { |k| ::Scenarios.const_get(k).index_record }
        filter_string(scenarios, options["string"])
        filter_status(scenarios, options["status"])
        filter_type(scenarios, options["type"])
        filter_size(scenarios, options["size"])
        filter_faction(scenarios, "allies", options)
        filter_faction(scenarios, "axis", options)
        scenarios.sort { |a, b| a[:id] <=> b[:id] }.each { |s| s.delete(:string) }
      end

      def filter_string(scenarios, string)
        return unless string

        scenarios.filter! do |s|
          s[:string].include?(string.downcase) || s[:id].include?(string)
        end
      end

      def filter_faction(scenarios, key, options)
        return unless options[key]

        nations = nations_by_key(key, options[key])
        scenarios.filter! do |s|
          !s[key.to_sym].intersection(nations).empty?
        end
      end

      def nations_by_key(side, code)
        faction = if side == "allies"
                    Utility::Scenarios::Definitions::AVAILABLE_ALLIED_FACTIONS
                  else
                    Utility::Scenarios::Definitions::AVAILABLE_AXIS_FACTIONS
                  end
        faction.find { |x| x[:code] == code }[:nations]
      end

      def filter_status(scenarios, status)
        return if status == "*"

        if status
          scenarios.filter! { |s| s[:status] == status }
        else
          scenarios.filter! do |s|
            !%w[a b p].include?(s[:status])
          end
        end
      end

      def filter_type(scenarios, type)
        return unless type

        scenarios.filter! { |s| infantry_only?(s) } if type == "inf"
        scenarios.filter! { |s| infantry_artillery_only?(s) } if type == "art"
        scenarios.filter! { |s| vehicles_only?(s) } if type == "tank"
        scenarios.filter! { |s| no_features?(s) } if type == "no_feat"
      end

      def infantry_only?(scenarios)
        units = all_units(scenarios)
        units.each do |u|
          return false unless %w[ldr sqd tm horse sw].include?(u[:t]) || u[:ft]
        end
        true
      end

      def infantry_artillery_only?(scenarios)
        units = all_units(scenarios)
        units.each do |u|
          return false unless %w[ldr sqd tm sw horse gun].include?(u[:t]) || u[:ft]
        end
        true
      end

      def vehicles_only?(scenarios)
        units = all_units(scenarios)
        units.each do |u|
          return false if %w[ldr sqd tm sw horse gun].include?(u[:t]) && !u[:ft]
        end
        true
      end

      def no_features?(scenarios)
        units = all_units(scenarios)
        units.each do |u|
          return false if u[:ft]
        end
        true
      end

      def all_units(scenarios)
        data = scenario_by_id(scenarios[:id])[:metadata]

        units = data[:allied_units].map { |t| t[1] }.flatten(1) +
                data[:axis_units].map { |t| t[1] }.flatten(1)
        units.map { |u| u[:list] }.flatten(1)
      end

      def filter_size(scenarios, size)
        return unless size

        scenarios.filter! { |s| matches_size?(s, size) }
      end

      SIZES = {
        "2x1" => { x: 15, y: 11 },
        "2x2" => { x: 15, y: 23 },
        "2x3" => { x: 15, y: 36 },
        "3x1" => { x: 23, y: 11 },
        "3x2" => { x: 23, y: 23 },
        "3x3" => { x: 23, y: 36 },
        "4x1" => { x: 32, y: 11 },
        "4x2" => { x: 32, y: 23 },
        "4x3" => { x: 32, y: 36 },
      }.freeze

      def matches_size?(scenarios, size)
        data = scenario_by_id(scenarios[:id])

        x, y = data[:metadata][:map_data][:layout]
        SIZES.each_pair do |k, v|
          check = v[:x] == x && v[:y] == y
          return check if k == size
          return false if check
        end
        true
      end

      def scenario_by_id(id)
        return if id&.empty?

        ::Scenarios.constants.map { |k| ::Scenarios.const_get(k) }
                   .select { |k| id == k::ID }.last&.full_record
      end
    end
  end
end
