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

      # Used for version validation
      def checksum(id)
        scenario = scenario_by_id(id)
        version = scenario[:version] + scenario[:status]
        "#{version}-#{Digest::MD5.hexdigest(scenario.to_json)}"
      end

      def stats(id)
        one = Game.where(
          "player_one_id = winner_id AND player_one_id <> player_two_id AND scenario = ?", id
        ).count + 1
        two = Game.where(
          "player_two_id = winner_id AND player_one_id <> player_two_id AND scenario = ?", id
        ).count + 1
        { one:, two: }
      end

      def all_stats(data)
        ids = data[:data].map { |s| s[:id] }
        p1 = Game.where(
          "player_one_id = winner_id AND player_one_id <> player_two_id AND scenario IN (?)", ids
        ).group(:scenario).count
        p2 = Game.where(
          "player_two_id = winner_id AND player_one_id <> player_two_id AND scenario IN (?)", ids
        ).group(:scenario).count
        {
          page: data[:page], more: data[:more], data: data[:data].map do |s|
            s.merge(wins: { one: p1[s[:id]].to_i + 1, two: p2[s[:id]].to_i + 1 })
          end,
        }
      end
    end
  end
end
