# frozen_string_literal: true

module Scenarios
  class Scenario001 < Base
    ID = "001"
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
          hexes:,
          layout: [15, 11, "x"],
          allied_edge: "r",
          axis_edge: "l",
          victory_hexes: [],
          allied_setup: { "0" => [] },
          axis_setup: { "0" => [] },
        }
      end

      # TODO: maybe standardize maps?  Maybe not?
      # TODO: think about modularity?
      def hexes
        hexes = []
        11.times do
          row = []
          15.times do
            hex = { t: "o" }
            row.push(hex)
          end
          hexes.push(row)
        end
        hexes
      end

      # TODO: documentation for unit definitions
      def allied_units
        {
          s: { list: [
            :ussr_leader_5_2,
            :ussr_leader_4_1,
            [5, :ussr_rifle_s],
            [2, :ussr_smg_s],
            :ussr_dp_27,
            :ussr_sg_43,
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end

      def axis_units
        {
          s: { list: [
            :ger_leader_6_2,
            :ger_leader_4_1,
            [6, :ger_rifle_s],
            [2, :ger_mg_34],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end
    end
  end
end
