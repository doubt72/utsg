# frozen_string_literal: true

module Utility
  class Scenario
    module Filter
      def filter(scenarios, options)
        filter_string(scenarios, options["string"])
        filter_status(scenarios, options["status"])
        filter_theater(scenarios, options["theater"])
        filter_type(scenarios, options["type"])
        filter_size(scenarios, options["size"])
        filter_faction(scenarios, "allies", options)
        filter_faction(scenarios, "axis", options)
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

      def filter_theater(scenarios, theater)
        return unless theater

        scenarios.filter! { |s| s[:id][0] == theater }
      end

      def filter_type(scenarios, type)
        return unless type

        scenarios.filter! { |s| infantry_only?(s) } if type == "inf"
        scenarios.filter! { |s| infantry_artillery_only?(s) } if type == "art"
        scenarios.filter! { |s| vehicles_only?(s) } if type == "tank"
        scenarios.filter! { |s| no_features?(s) } if type == "no_feat"
      end

      def infantry_only?(scenarios)
        units = processed_units(scenarios)
        units.each do |u|
          return false unless %w[ldr sqd tm horse sw].include?(u[:t]) || u[:ft]
        end
        true
      end

      def infantry_artillery_only?(scenario)
        units = processed_units(scenario)
        units.each do |u|
          return false unless %w[ldr sqd tm sw horse gun].include?(u[:t]) || u[:ft]
        end
        true
      end

      def vehicles_only?(scenario)
        units = processed_units(scenario)
        units.each do |u|
          return false if %w[ldr sqd tm sw horse gun].include?(u[:t]) && !u[:ft]
        end
        true
      end

      def no_features?(scenario)
        units = processed_units(scenario)
        units.each do |u|
          return false if u[:ft]
        end
        true
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
        # "4x1" => { x: 32, y: 11 },
        # "4x2" => { x: 32, y: 23 },
        # "4x3" => { x: 32, y: 36 },
      }.freeze

      def matches_size?(scenario, size)
        x, y = scenario[:layout]

        SIZES.each_pair do |k, v|
          check = v[:x] == x && v[:y] == y
          return check if k == size
          return false if check
        end
        true
      end
    end
  end
end
