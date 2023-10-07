# frozen_string_literal: true

module Scenarios
  class ScenarioE1 < Base
    ID = "E1"
    NAME = "Lost in the Woods"
    ALLIES = ["ussr"].freeze
    AXIS = ["ger"].freeze

    class << self
      # TODO: documentation for field descriptions
      def generate
        {
          turns: 6,
          first_setup: 1,
          first_move: 2,
          date: [1942, 7, 31],
          location: "Rzhev, Russia",
          author: "Douglas Triggs",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "A simple meeting engagement as German divisional reserves attempt
          to plug a gap in the German defenses by counterattacking a small
          Soviet breakthrough in the woods on the second day of the first
          Soviet Rzhev-Sychyovka offensive.",
        ]
      end

      # TODO: documentation for map definitions
      def map_data
        {
          orientation: "x+",
          hexes:,
        }
      end

      def hexes
        hexes = []
        10.times do
          row = []
          12.times do |x|
            hex = { t: "o" }
            hex[:f] = ["xs"] if x < 4
            hex[:f] = ["as"] if x > 5
            row.push(hex)
          end
          hexes.push(row)
        end
        hexes
      end

      # TODO: documentation for unit definitions
      def allied_units
        {
          s: [
            :ussr_leader_5_2,
            :ussr_leader_4_1,
            [8, :ussr_rifle_s],
            :ussr_lmg,
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) },
        }
      end

      def axis_units
        {
          s: [
            :ger_leader_6_2,
            :ger_leader_4_1,
            [6, :ger_rifle_s],
            [2, :ger_lmg],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) },
        }
      end
    end
  end
end
