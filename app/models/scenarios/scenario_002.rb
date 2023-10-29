# frozen_string_literal: true

module Scenarios
  class Scenario002 < Base
    ID = "002"
    NAME = "The Only Way to Win Is"
    ALLIES = ["ussr"].freeze
    AXIS = ["ger"].freeze

    class << self
      def generate
        {
          turns: 6,
          first_setup: 1,
          first_move: 2,
          date: [1942, 8, 23],
          location: "Stalingrad, Russia",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "An urban battle.  Russian defenders attempt to hold every inch of ground
          as the German army enters the city of Stalingrad.",
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
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 2, st: { sh: "s" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 5, st: { sh: "s" } },
            { t: "d", d: 2 },
            { t: "o", d: 2, st: { sh: "s" } },
            { t: "o", r: { d: [2, 4], t: "t" } },
            { t: "o", r: { d: [1, 2, 6], t: "t", c: "l" } },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 2, st: { sh: "m" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "s" } },
            { t: "d", d: 2 },
            { t: "o", d: 2, st: { sh: "m" } },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
          ], [
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 5, st: { sh: "s" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 5, st: { sh: "m" } },
            { t: "d", d: 2 },
            { t: "o", d: 5, st: { sh: "s" } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l" } },
            { t: "o", d: 1, st: { sh: "l" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 2, 5], t: "t" } },
            { t: "o", d: 5, st: { sh: "s" } },
            { t: "d", d: 2 },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
          ], [
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 2, st: { sh: "s" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "s" } },
            { t: "d", d: 2 },
            { t: "o", r: { d: [2, 4, 6], t: "t", c: "l" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
          ], [
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 2, st: { sh: "m" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 5, st: { sh: "m" } },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
          ], [
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 5, st: { sh: "s" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 5, st: { sh: "s" } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l" } },
            { t: "o", d: 1, st: { sh: "l" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 2, 5], t: "t" } },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
          ], [
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 2, st: { sh: "s" } },
            { t: "o", r: { d: [2, 4], t: "t" } },
            { t: "o", r: { d: [1, 2, 4, 6], t: "t", c: "l" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 2, st: { sh: "m" } },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
          ], [
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 5, st: { sh: "s" } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l" } },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
          ],
        ]
      end

      def allied_units
        {
          s: { list: [
            :ussr_leader_5_1,
            :ussr_leader_4_1,
            :ussr_leader_3_1,
            [8, :ussr_rifle_s],
            [2, :ussr_smg_s],
            [4, :ussr_dp_27],
            [6, :ussr_mc],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end

      def axis_units
        {
          s: { list: [
            :ger_leader_6_2,
            [2, :ger_leader_5_1],
            [10, :ger_rifle_s],
            [4, :ger_mg_34],
            :ger_ft,
            [2, :ger_sc],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end
    end
  end
end
