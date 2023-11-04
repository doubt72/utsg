# frozen_string_literal: true

module Scenarios
  class Scenario205 < Base
    ID = "205"
    NAME = "Siezing the Port"
    ALLIES = ["usa"].freeze
    AXIS = ["ger"].freeze

    class << self
      def generate
        {
          turns: 6,
          first_setup: 2,
          first_move: 1,
          date: [1944, 6, 29],
          location: "Cherbourg, France",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "Last-ditch defense of the (already demolished) port of Cherbourg.  This was the last part
          of the Contentin Peninsula to be captured, and while the port was eventually put back
          into service, the damage was extensive.  By this point, the defenders were
          mostly made up of hastily drafted naval personnel and labor units.",
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
          base_terrain: "u",
        }
      end

      def hexes
        [
          [
            { t: "w" },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", r: { d: [2, 4, 6], t: "t", c: "l" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "s" } },
            { t: "d", d: 3 },
            { t: "o", d: 3, st: { sh: "s" } },
          ], [
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "s" } },
            { t: "d", d: 3 },
            { t: "o", d: 6, st: { sh: "s" } },
            { t: "d", d: 3 },
          ], [
            { t: "w" },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
          ], [
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "s" } },
            { t: "d", d: 3 },
            { t: "o", d: 3, st: { sh: "s" } },
            { t: "d", d: 3 },
            { t: "o", d: 3, st: { sh: "s" } },
          ], [
            { t: "w" },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", r: { d: [2, 4, 6], t: "t", c: "l" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3, 5], t: "t" } },
            { t: "o", d: 6, st: { sh: "s" } },
            { t: "d", d: 3 },
            { t: "o", d: 6, st: { sh: "s" } },
            { t: "d", d: 3 },
            { t: "o", d: 6, st: { sh: "s" } },
          ], [
            { t: "w" },
            { t: "w" },
            { t: "o", r: { d: [4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3, 4], t: "t", c: "r" } },
            { t: "o", r: { d: [1, 5], t: "t" } },
            { t: "o", d: 1, st: { sh: "t" } },
            { t: "o", d: 1, st: { sh: "t" } },
            { t: "o" },
            { t: "o", r: { d: [2, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
          ], [
            { t: "w" },
            { t: "w" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "s" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "c" } },
            { t: "o", r: { d: [2, 6], t: "t" } },
            { t: "o", d: 1, st: { sh: "t" } },
            { t: "o" },
            { t: "o", d: 2, st: { sh: "l" } },
            { t: "o", d: 2, st: { sh: "l" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "l" } },
            { t: "o", d: 1, st: { sh: "l" } },
            { t: "o", d: 1, st: { sh: "l" } },
          ], [
            { t: "w" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "m" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "t" } },
            { t: "o", r: { d: [3, 4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4, 6], t: "t" } },
            { t: "o", r: { d: [1, 3], t: "t" } },
            { t: "o", d: 3, st: { sh: "l" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3], t: "t" } },
            { t: "o", d: 3, st: { sh: "m" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "t" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 1, st: { sh: "t" } },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "s" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "s" } },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [4, 6], t: "t" } },
          ], [
            { t: "o" },
            { t: "o", d: 6, st: { sh: "s" } },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 1, st: { sh: "t" } },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "s" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "m" } },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "t" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "s" } },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
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
            :usa_m2_browning,
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end

      def axis_units
        {
          s: { list: [
            :ger_leader_4_1,
            :ger_leader_3_1,
            [9, :ger_conscript_s],
            :ger_mg_42,
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end
    end
  end
end
