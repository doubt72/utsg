# frozen_string_literal: true

module Scenarios
  class Scenario204 < Base
    ID = "204"
    NAME = "The Shingle"
    ALLIES = ["usa"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    class << self
      def generate
        {
          turns: 6,
          first_setup: 2,
          first_move: 1,
          date: [1944, 6, 6],
          location: "Normandy, France",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "D-Day, Omaha Beach.  The American troops who survived the initial landings gathered at
          the shingle below the sea wall.  From there, they organized despeate assaults on the
          hills further inland, at the rear of the beach ocross the shelf, where German machine
          guns continued to rain down fire on the men below.",
        ]
      end

      def map_data
        {
          hexes:,
          layout: [15, 11, "x"],
          allied_edge: "r",
          axis_edge: "l",
          victory_hexes: [],
          allied_setup: { "0" => [] },
          axis_setup: { "0" => [] },
          base_terrain: "d",
        }
      end

      def hexes
        [
          [
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
          ], [
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
          ], [
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
          ], [
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
          ], [
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
          ], [
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "s" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
          ], [
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "s" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "b", h: 1 },
            { t: "b", h: 1 },
            { t: "b", h: 1 },
          ], [
            { t: "o", h: 2 },
            { t: "b", h: 2 },
            { t: "b", h: 2 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "b", h: 2 },
            { t: "b", h: 2 },
            { t: "b", h: 2 },
            { t: "o", h: 2 },
          ], [
            { t: "b", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "b", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 3 },
            { t: "b", h: 3 },
            { t: "b", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
          ], [
            { t: "b", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "b", h: 1 },
            { t: "b", h: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
          ],
        ]
      end

      def allied_units
        {
          s: { list: [
            :usa_leader_5_1,
            :usa_leader_4_1,
            [2, :usa_engineer_s],
            [8, :usa_rifle_s],
            [2, :usa_m1918_bar],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end

      def axis_units
        {
          s: { list: [
            [2, :ger_leader_4_1],
            [4, :ger_volksgrenadier_s],
            [2, :ger_mg_42],
            [8, :wire],
            [2, :pillbox],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end
    end
  end
end
