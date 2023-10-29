# frozen_string_literal: true

module Scenarios
  class Scenario003 < Base
    ID = "003"
    NAME = "Holding the Line"
    ALLIES = ["ussr"].freeze
    AXIS = ["ger"].freeze

    class << self
      def generate
        {
          turns: 6,
          first_setup: 1,
          first_move: 2,
          date: [1941, 7, 10],
          location: "Mogilev, Belarus",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "Defensive action near Mogilev.  In the opening days of the battle of Smolensk,
          Soviet troops attempt to slow the German offensive.",
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
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "f", h: 1 },
          ], [
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
          ], [
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "o", h: 1 },
            { t: "f", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
          ], [
            { t: "o", r: { d: [1, 4] } },
            { t: "f", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "g" },
            { t: "g" },
            { t: "f", h: 1 },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l", s: "f" } },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o", d: 1, st: { sh: "c" } },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "f" },
            { t: "f" },
            { t: "f", h: 1 },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "o" },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "o", r: { d: [2, 5] } },
            { t: "f" },
            { t: "f" },
            { t: "f", h: 1 },
          ], [
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "o", r: { d: [2, 5] } },
            { t: "o", d: 2, st: { sh: "l", s: "f" } },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
          ], [
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "f", h: 1 },
            { t: "f" },
            { t: "f" },
            { t: "f" },
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
            :ussr_leader_4_1,
            :ussr_leader_3_1,
            [5, :ussr_rifle_s],
            [2, :ussr_crew_t],
            :ussr_dp_27,
            :ussr_82_bm_37,
            [2, :ussr_45mm_19_k],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end

      def axis_units
        {
          s: { list: [
            :ger_leader_5_1,
            :ger_leader_4_1,
            [4, :ger_rifle_s],
            :ger_mg_34,
            [3, :ger_pzkpfw_iii__40],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end
    end
  end
end