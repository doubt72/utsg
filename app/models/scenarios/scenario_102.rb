# frozen_string_literal: true

module Scenarios
  class Scenario102 < Base
    ID = "102"
    NAME = "Hellfire Pass"
    ALLIES = ["uk"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    class << self
      def generate
        {
          turns: 6,
          first_setup: 1,
          first_move: 2,
          date: [1941, 6, 15],
          location: "Halfaya Pass, Libya",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "British armored forces try to force the pass during Operation Battleaxe.
          The Germans attempted to draw in British tanks by deploying a small tank
          force of their own, but they'd fortified the pass with 88s in hopes of
          surprising the attackers.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [2, 5, true],
          hexes:,
          layout: [15, 21, "x"],
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
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "w" },
            { t: "w" },
            { t: "w" },
          ], [
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
          ], [
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
          ], [
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "o", d: 1, st: { sh: "h", s: "f" } },
            { t: "o", d: 1, st: { sh: "h", s: "f" } },
            { t: "s" },
          ], [
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4, 6] } },
            { t: "s", r: { d: [1, 4] } },
          ], [
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", d: 3, st: { sh: "h", s: "f" } },
            { t: "o", r: { d: [3, 6] } },
            { t: "s" },
            { t: "o" },
          ], [
            { t: "r", h: 3 },
            { t: "r", h: 3 },
            { t: "r", h: 3 },
            { t: "r", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", d: 3, st: { sh: "h", s: "f" } },
            { t: "o", r: { d: [3, 6] } },
            { t: "s" },
            { t: "o" },
          ], [
            { t: "r", h: 3 },
            { t: "r", h: 3 },
            { t: "r", h: 3 },
            { t: "r", h: 3 },
            { t: "r", h: 3 },
            { t: "r", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", r: { d: [3, 5] } },
            { t: "s" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
          ], [
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "r", h: 3 },
            { t: "r", h: 3 },
            { t: "r", h: 3 },
            { t: "r", h: 3 },
            { t: "r", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o", h: 1 },
          ], [
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 5, b: "c", be: [2, 3] },
            { t: "o", h: 5, b: "c", be: [2, 3, 4] },
            { t: "r", h: 3 },
            { t: "r", h: 3 },
            { t: "r", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", r: { d: [2, 6] } },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
          ], [
            { t: "o", h: 5 },
            { t: "o", h: 5 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 5, b: "c", be: [3] },
            { t: "o", h: 5, b: "c", be: [2, 3, 4] },
            { t: "r", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", r: { d: [3, 6] } },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
          ], [
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 5 },
            { t: "o", h: 4 },
            { t: "o", h: 5 },
            { t: "o", h: 5, b: "c", be: [3, 4, 5] },
            { t: "r", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", h: 1, r: { d: [6, 4] } },
            { t: "o", h: 1, r: { d: [1, 3] } },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
          ], [
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 5, b: "c", be: [4] },
            { t: "r", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1, r: { d: [3, 5] } },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
          ], [
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 5 },
            { t: "o", h: 5, b: "c", be: [3, 4, 5] },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1, r: { d: [4, 5] } },
            { t: "o", h: 1, r: { d: [1, 2] } },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
          ], [
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 5, b: "c", be: [4, 5] },
            { t: "r", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 2, r: { d: [4, 5] } },
            { t: "o", h: 1, r: { d: [1, 2] } },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 3 },
          ], [
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2, r: { d: [5, 6] } },
            { t: "o", h: 2, r: { d: [4, 6] } },
            { t: "o", h: 2, r: { d: [1, 2] } },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
          ], [
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 3 },
            { t: "o", h: 2, r: { d: [4, 6] } },
            { t: "o", h: 2, r: { d: [1, 3] } },
            { t: "o", h: 2, r: { d: [2, 3] } },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "r", h: 3 },
            { t: "r", h: 3 },
          ], [
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 3, r: { d: [3, 6] } },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "r", h: 3 },
            { t: "r", h: 4 },
            { t: "r", h: 4 },
          ], [
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4, d: 1, st: { sh: "h", s: "f" } },
            { t: "o", h: 4, d: 1, st: { sh: "h", s: "f" } },
            { t: "o", h: 3, r: { d: [4, 6] } },
            { t: "o", h: 3, r: { d: [1, 3] } },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 4 },
            { t: "r", h: 4 },
            { t: "r", h: 4 },
            { t: "o", h: 5 },
          ], [
            { t: "o", h: 4 },
            { t: "o", h: 4, r: { d: [4, 6] } },
            { t: "o", h: 4, r: { d: [1, 4] } },
            { t: "o", h: 4, r: { d: [1, 3] } },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "r", h: 4 },
            { t: "o", h: 5 },
            { t: "o", h: 5 },
            { t: "o", h: 5 },
          ], [
            { t: "o", h: 4, r: { d: [1, 4] } },
            { t: "o", h: 4, r: { d: [1, 3] } },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 5 },
            { t: "o", h: 5 },
            { t: "o", h: 5 },
            { t: "o", h: 5 },
          ],
        ]
      end

      def allied_units
        {
          "0": { list: [
            :uk_leader_5_1,
            :uk_leader_4_1,
            [6, :uk_line_s],
            :uk_bren_lmg,
            :uk_2inch_mortar,
            [5, :uk_matilda_ii],
            [2, :uk_matilda_ii_cs],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end

      def axis_units
        {
          "0": { list: [
            :ger_leader_6_2,
            [4, :ger_rifle_s],
            [3, :ger_elite_crew_t],
            :ger_mg_34,
            [3, :ger_8_8cm_flak_36],
            [2, :ger_pzkpfw_ii_f],
            :ger_pzkpfw_iii__40,
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end
    end
  end
end
