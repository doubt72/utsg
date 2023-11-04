# frozen_string_literal: true

module Scenarios
  class Scenario203 < Base
    ID = "203"
    NAME = "Over the Hedge"
    ALLIES = ["usa"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    class << self
      def generate
        {
          turns: 6,
          first_setup: 2,
          first_move: 1,
          date: [1944, 7, 1],
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
          "American troops advance through the difficult bocage terrain of Normandy,
          France.",
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
            { t: "o", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "o", b: "b", be: [4, 5] },
            { t: "g" },
            { t: "g", b: "b", be: [1, 6] },
            { t: "g", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "o", b: "b", be: [4, 5] },
            { t: "o", r: { d: [3, 6] } },
            { t: "d", d: 2 },
            { t: "g", b: "b", be: [1, 6] },
            { t: "o", b: "b", be: [1, 6] },
            { t: "o" },
            { t: "g", b: "b", be: [1] },
          ], [
            { t: "o", b: "b", be: [4, 5, 6] },
            { t: "o", b: "b", be: [5, 6] },
            { t: "o", b: "b", be: [4, 5, 6] },
            { t: "g", b: "b", be: [5, 6] },
            { t: "g", b: "b", be: [4, 5, 6] },
            { t: "g", b: "b", be: [4, 5, 6] },
            { t: "o", b: "b", be: [5, 6] },
            { t: "o", b: "b", be: [4, 5, 6] },
            { t: "o", r: { d: [3, 6] } },
            { t: "o", d: 3, st: { sh: "l", s: "f" } },
            { t: "d", d: 2 },
            { t: "g", b: "b", be: [1, 5, 6] },
            { t: "o", b: "b", be: [1, 5, 6] },
            { t: "g", b: "b", be: [1, 2, 5, 6] },
            { t: "g", b: "b", be: [5, 6] },
          ], [
            { t: "g", b: "b", be: [5] },
            { t: "g", b: "b", be: [5, 6] },
            { t: "g", b: "b", be: [4, 5, 6] },
            { t: "o", b: "b", be: [6] },
            { t: "o", b: "b", be: [4, 5] },
            { t: "o", b: "b", be: [5, 6] },
            { t: "o", b: "b", be: [4, 5, 6] },
            { t: "g", b: "b", be: [4, 5, 6] },
            { t: "o", r: { d: [3, 4, 6] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "o", b: "b", be: [1, 5, 6] },
            { t: "o", b: "b", be: [5, 6] },
          ], [
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "o", b: "b", be: [1, 4, 5, 6] },
            { t: "g", b: "b", be: [4, 5] },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o", r: { d: [3, 6] } },
            { t: "g", b: "b", be: [1, 2, 3, 4, 5, 6] },
            { t: "o", b: "b", be: [2, 3, 4, 6] },
            { t: "d", d: 2 },
            { t: "o", d: 3, st: { sh: "l", s: "f" }, b: "b", be: [4] },
            { t: "o", r: { d: [2, 5] } },
            { t: "g", b: "b", be: [1, 5, 6] },
            { t: "g", b: "b", be: [5, 6] },
          ], [
            { t: "g", b: "b", be: [2, 3] },
            { t: "g", b: "b", be: [2, 3, 4, 5] },
            { t: "o", b: "b", be: [2, 3, 4] },
            { t: "o", r: { d: [2, 5] } },
            { t: "g", b: "b", be: [1, 4, 5, 6] },
            { t: "d", d: 3, b: "b", be: [5, 6] },
            { t: "o", d: 1, st: { sh: "l", s: "f" }, b: "b", be: [5, 6] },
            { t: "o", r: { d: [3, 4, 6] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "o", b: "b", be: [1, 3, 4, 5, 6] },
            { t: "d", d: 2 },
            { t: "o", b: "b", be: [3, 4] },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
          ], [
            { t: "g", b: "b", be: [4, 5, 6] },
            { t: "o", b: "b", be: [5, 6] },
            { t: "o", b: "b", be: [3, 4, 5, 6] },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4, 6] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 3] } },
            { t: "g", b: "b", be: [1, 2, 3, 4, 6] },
            { t: "o", b: "b", be: [2, 3, 4] },
            { t: "o", r: { d: [2, 5] } },
            { t: "g", b: "b", be: [1, 3, 6] },
            { t: "g", b: "b", be: [2, 3] },
            { t: "o", b: "b", be: [1, 2, 3] },
            { t: "g", b: "b", be: [1, 2, 3, 6] },
            { t: "g", b: "b", be: [2, 3] },
          ], [
            { t: "o" },
            { t: "o", b: "b", be: [4, 5] },
            { t: "g", b: "b", be: [4, 5] },
            { t: "o", b: "b", be: [3, 4, 5] },
            { t: "o", r: { d: [3, 6] } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o" },
            { t: "g", b: "b", be: [1, 3, 4, 5, 6] },
            { t: "o", b: "b", be: [3, 4, 5, 6] },
            { t: "o", r: { d: [2, 5] } },
            { t: "g", b: "b", be: [1, 5, 6] },
            { t: "o", b: "b", be: [1, 2, 5, 6] },
            { t: "o", b: "b", be: [5, 6] },
            { t: "g", b: "b", be: [1, 5, 6] },
          ], [
            { t: "o", b: "b", be: [4, 5, 6] },
            { t: "g", b: "b", be: [4, 5, 6] },
            { t: "o", b: "b", be: [4, 5, 6] },
            { t: "o", r: { d: [3, 6] } },
            { t: "d", d: 1, b: "b", be: [1, 2] },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o", b: "b", be: [1, 2] },
            { t: "o", b: "b", be: [4, 5] },
            { t: "g", b: "b", be: [3, 4] },
            { t: "o", r: { d: [2, 5] } },
            { t: "o", b: "b", be: [1] },
            { t: "d", d: 2 },
            { t: "o", b: "b", be: [1, 6] },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", b: "b", be: [4, 5] },
            { t: "g", b: "b", be: [4, 5] },
            { t: "o", r: { d: [3, 6] } },
            { t: "o", b: "b", be: [1, 2, 3] },
            { t: "o", b: "b", be: [2, 3, 4, 5] },
            { t: "o", d: 1, st: { sh: "c" } },
            { t: "g", b: "b", be: [1, 2, 3, 4] },
            { t: "o", b: "b", be: [4] },
            { t: "g" },
            { t: "g", b: "b", be: [3, 4] },
            { t: "o", r: { d: [2, 5] } },
            { t: "o", d: 2, st: { sh: "l", s: "f" } },
            { t: "d", d: 2 },
            { t: "o", b: "b", be: [1, 5, 6] },
          ], [
            { t: "o", b: "b", be: [4, 5, 6] },
            { t: "g", b: "b", be: [4, 5, 6] },
            { t: "o", r: { d: [3, 6] } },
            { t: "g", b: "b", be: [1, 2, 3, 4, 5] },
            { t: "o", b: "b", be: [2, 3, 4, 5] },
            { t: "g", b: "b", be: [3, 4] },
            { t: "o", b: "b", be: [2, 3] },
            { t: "o", b: "b", be: [2, 3, 4, 5] },
            { t: "g", b: "b", be: [2, 3, 4, 5] },
            { t: "o", b: "b", be: [2, 3] },
            { t: "g", b: "b", be: [1, 2, 3, 4, 6] },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "g", b: "b", be: [1, 2] },
            { t: "g" },
          ], [
            { t: "o" },
            { t: "o", b: "b", be: [4] },
            { t: "o", r: { d: [3, 6] } },
            { t: "g", b: "b", be: [1, 2, 4] },
            { t: "o", b: "b", be: [4] },
            { t: "g" },
            { t: "g", b: "b", be: [3, 4] },
            { t: "o", b: "b", be: [4] },
            { t: "g", b: "b", be: [4] },
            { t: "o" },
            { t: "o" },
            { t: "g", b: "b", be: [1, 3, 4] },
            { t: "o", r: { d: [2, 5] } },
            { t: "g", b: "b", be: [1, 2] },
            { t: "g" },
          ],
        ]
      end

      def allied_units
        {
          s: { list: [
            :usa_leader_5_1,
            :usa_leader_4_1,
            [7, :usa_rifle_s],
            :usa_m1917_browning,
            :usa_radio_105mm,
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end

      def axis_units
        {
          s: { list: [
            :ger_leader_5_1,
            :ger_leader_4_1,
            [5, :ger_volksgrenadier_s],
            [2, :ger_mg_42],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end
    end
  end
end
