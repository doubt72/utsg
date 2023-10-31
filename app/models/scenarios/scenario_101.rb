# frozen_string_literal: true

module Scenarios
  class Scenario101 < Base
    ID = "101"
    NAME = "Useful Confusion"
    ALLIES = ["usa"].freeze
    AXIS = ["ger"].freeze

    class << self
      def generate
        {
          turns: 6,
          first_setup: 1,
          first_move: 2,
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
          "German infantry attempt to dislodge a group of American paratroopers that have
          captured a small town.",
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
        }
      end

      def hexes
        [
          [
            { t: "o" },
            { t: "o", b: "b", be: [4] },
            { t: "o" },
            { t: "d", d: 2 },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "g", b: "b", be: [1, 6] },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "o", b: "b", be: [1, 6] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", b: "b", be: [3, 4] },
            { t: "o" },
            { t: "d", d: 2 },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "s" } },
            { t: "o" },
            { t: "g", b: "b", be: [1, 6] },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "o", b: "b", be: [1, 6] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [3, 4] },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "g", b: "b", be: [1, 5, 6] },
            { t: "g", b: "b", be: [5, 6] },
            { t: "g", b: "b", be: [5, 6] },
            { t: "g", b: "b", be: [5, 6] },
            { t: "o", b: "b", be: [1, 5, 6] },
            { t: "o", b: "b", be: [5, 6] },
            { t: "o", b: "b", be: [5, 6] },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [3, 4] },
            { t: "o" },
            { t: "o", d: 2, st: { sh: "s" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "g", b: "b", be: [3] },
            { t: "g", b: "b", be: [2, 3] },
            { t: "g", b: "b", be: [2, 3] },
            { t: "g", b: "b", be: [2, 3, 4, 5] },
            { t: "o" },
            { t: "o", d: 5, st: { sh: "s" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l" } },
            { t: "o" },
          ], [
            { t: "g" },
            { t: "g" },
            { t: "g", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o", r: { d: [2, 4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
          ], [
            { t: "g", b: "b", be: [5, 6] },
            { t: "g", b: "b", be: [5, 6] },
            { t: "g", b: "b", be: [4, 5, 6] },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "s" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", b: "w", be: [4, 5] },
            { t: "o" },
            { t: "g", b: "b", be: [1, 2, 3] },
            { t: "g", b: "b", be: [2, 3] },
            { t: "g", b: "b", be: [2, 3] },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "s" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "d", d: 1, b: "w", be: [5, 6] },
            { t: "d", d: 1, b: "w", be: [5, 6] },
            { t: "d", d: 1, b: "w", be: [5, 6] },
            { t: "o", b: "w", be: [4, 5, 6] },
            { t: "o" },
            { t: "g", b: "b", be: [1, 2] },
            { t: "g" },
            { t: "g" },
            { t: "g" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "g", b: "b", be: [1, 2] },
            { t: "g" },
            { t: "g" },
            { t: "g" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [1, 2, 3] },
            { t: "o", b: "b", be: [2, 3] },
            { t: "o", b: "b", be: [2, 3] },
            { t: "o", b: "b", be: [2, 3] },
            { t: "o", b: "b", be: [2] },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [1, 2] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ],
        ]
      end

      def allied_units
        {
          s: { list: [
            :usa_leader_6_2,
            :usa_leader_5_1,
            [6, :usa_paratroop_s],
            [2, :usa_m1918_bar],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end

      def axis_units
        {
          s: { list: [
            :ger_leader_4_1,
            :ger_leader_3_1,
            [10, :ger_rifle_s],
            [2, :ger_mg_42],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end
    end
  end
end
