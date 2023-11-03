# frozen_string_literal: true

module Scenarios
  class Scenario301 < Base
    ID = "301"
    NAME = "Entering the Gates"
    ALLIES = ["usa"].freeze
    AXIS = ["ger"].freeze

    class << self
      def generate
        {
          turns: 6,
          first_setup: 2,
          first_move: 1,
          date: [1944, 10, 2],
          location: "Rimburg, Netherlands",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "Assault on german stronghold.  Part of the larger Seige of Aachen.",
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
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", b: "w", be: [1, 2, 3, 6] },
            { t: "o", r: { d: [4, 6], t: "t", c: "l" }, b: "w", be: [2, 3] },
            { t: "o", r: { d: [1, 4], t: "t" }, b: "w", be: [2, 3] },
            { t: "o", r: { d: [1, 4], t: "t" }, b: "w", be: [2, 3] },
            { t: "o", r: { d: [1, 5], t: "t", c: "r" }, b: "w", be: [2, 3] },
            { t: "o", b: "w", be: [2, 3, 4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l" } },
            { t: "o", r: { d: [2, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" }, b: "w", be: [1] },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" }  },
            { t: "o", d: 4, st: { sh: "s" }  },
            { t: "o", r: { d: [2, 6], t: "t", c: "l" }, b: "w", be: [4] },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "s" } },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", b: "w", be: [1, 2, 6] },
            { t: "o", r: { d: [4, 2], t: "t", c: "l" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4, 6], t: "t", c: "l" } },
            { t: "o", r: { d: [1, 3], t: "t", c: "r" } },
            { t: "o", b: "w", be: [3, 4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 5, st: { sh: "s" } },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "o" },
            { t: "o", b: "w", be: [1] },
            { t: "f" },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "f" },
            { t: "o", b: "w", be: [4] },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l" } },
            { t: "o", r: { d: [2, 4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
          ], [
            { t: "o" },
            { t: "o", b: "w", be: [1, 2, 6] },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 6], t: "t", c: "l" } },
            { t: "o" },
            { t: "o", b: "w", be: [3, 4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t" } },
            { t: "o" },
            { t: "b" },
          ], [
            { t: "f" },
            { t: "o" },
            { t: "o", b: "w", be: [1] },
            { t: "f" },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "f" },
            { t: "o", b: "w", be: [4] },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "s" } },
            { t: "o", r: { d: [2, 6], t: "t" } },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", b: "w", be: [1, 2, 5, 6] },
            { t: "o", b: "w", be: [5, 6] },
            { t: "o", b: "w", be: [6] },
            { t: "o", r: { d: [2, 6], t: "t", c: "l" }, b: "w", be: [5] },
            { t: "o", b: "w", be: [5, 6] },
            { t: "o", b: "w", be: [3, 4, 5, 6] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "s" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "f" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3, 4], t: "t", c: "r" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 5], t: "t" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "f" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [2, 3, 5], t: "t" } },
            { t: "f" },
            { t: "f" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "b" },
            { t: "b" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f", r: { d: [2, 5], t: "t" } },
            { t: "f" },
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
            :usa_m2_browning,
            :usa_m2_mortar,
            :usa_ft,
            [2, :usa_sc],
            :usa_radio_155mm,
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end

      def axis_units
        {
          s: { list: [
            :ger_leader_6_1,
            :ger_leader_4_1,
            [6, :ger_ss_s],
            [2, :ger_elite_crew_t],
            [2, :ger_mg_42],
            :ger_7_5cm_leig_18,
            [4, :wire],
            [2, :ap_mines],
            [2, :pillbox],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end
    end
  end
end
