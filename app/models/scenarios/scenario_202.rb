# frozen_string_literal: true

module Scenarios
  class Scenario202 < Base
    ID = "202"
    NAME = "Counterattack!"
    ALLIES = ["usa"].freeze
    AXIS = ["ger"].freeze

    class << self
      def generate
        {
          turns: 6,
          first_setup: 1,
          first_move: 2,
          date: [1944, 8, 7],
          location: "Mortain, France",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "American forces attempt to stop a German counterattack.  Part of the Operation
          Lüttich, a large-scale german attempt to push back the Allies during the battle
          of Normandy.",
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
            { t: "d", d: 2 },
            { t: "o" },
            { t: "o", b: "b", be: [1, 6] },
            { t: "o", b: "b", be: [4, 5] },
            { t: "g" },
            { t: "g", b: "b", be: [4, 5] },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", b: "b", be: [1, 2] },
            { t: "o" },
            { t: "o", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "d", d: 2 },
            { t: "o" },
            { t: "o", b: "b", be: [1, 4, 5, 6] },
            { t: "g" },
            { t: "g", b: "b", be: [4, 5] },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", b: "b", be: [1, 2, 5, 6] },
            { t: "o", b: "b", be: [5, 6] },
            { t: "o", b: "b", be: [4, 5, 6] },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "d", d: 2 },
            { t: "o" },
            { t: "g", b: "b", be: [1, 6] },
            { t: "g", b: "b", be: [4, 5] },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "g", b: "b", be: [1, 2] },
            { t: "g" },
            { t: "g", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l", s: "f" } },
          ], [
            { t: "o", r: { d: [1, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "g", b: "b", be: [1, 4, 5, 6] },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "g", b: "b", be: [1, 2, 5, 6] },
            { t: "g", b: "b", be: [5, 6] },
            { t: "g", b: "b", be: [4, 5, 6] },
            { t: "o" },
            { t: "o" },
            { t: "f", r: { d: [4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
          ], [
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "s" } },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", d: 2, st: { sh: "s" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 5, st: { sh: "s" } },
            { t: "o", r: { d: [3, 5], t: "t" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", d: 5, st: { sh: "s" } },
            { t: "o", r: { d: [2, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 2, 4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4, 5], t: "t" } },
            { t: "o", r: { d: [1, 3], t: "t" } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [4, 6] } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "s" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "s" } },
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o", r: { d: [2, 5] } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f", r: { d: [3, 6] } },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "s" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "s" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "c" } },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "f", r: { d: [1, 3] } },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "b" },
            { t: "b" },
            { t: "o" },
            { t: "d", d: 2 },
            { t: "d", d: 2 },
            { t: "d", d: 2 },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "b" },
            { t: "b" },
            { t: "b" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ],
        ]
      end

      def allied_units
        {
          s: { list: [
            :usa_leader_5_1,
            :usa_leader_4_1,
            :usa_leader_4_1,
            [8, :usa_rifle_s],
            [2, :usa_m1918_bar],
            :usa_m2_browning,
            [2, :usa_m1a1_bazooka],
            :usa_m2_mortar,
            :usa_radio_155mm,
            [3, :foxhole],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end

      def axis_units
        {
          s: { list: [
            :ger_leader_5_1,
            :ger_leader_4_1,
            [6, :ger_ss_s],
            [2, :ger_mg_42],
            [2, :ger_sdkfz_250_1],
            [4, :ger_pzkpfw_iv_h_j],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end
    end
  end
end
