# frozen_string_literal: true

module Scenarios
  class Scenario006 < Base
    ID = "006"
    NAME = "Clash of Steel"
    ALLIES = ["ussr"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    class << self
      def generate
        {
          turns: 6,
          first_setup: 1,
          first_move: 2,
          date: [1943, 7, 5],
          location: "Orel, Russia",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "German heavy armor (supported by artillery) advances and attempts a
          breakthrough after penetrating the first line of defenses at a weak point
          in the Soviet line.  Soviet reserves attempt to stop them.  An armored
          clash during the first day of the initial German attack during the battle
          of Kursk.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [1, 3, true],
          hexes:,
          layout: [15, 21, "x"],
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
            { t: "o", r: { d: [2, 5] } },
            { t: "o", d: 2, st: { sh: "l" } },
            { t: "o", r: { d: [3, 6] } },
            { t: "f" },
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
            { t: "f" },
            { t: "o", d: 2, st: { sh: "l" } },
            { t: "o", r: { d: [2, 4, 5] } },
            { t: "o", r: { d: [1, 3] } },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "f" },
            { t: "o", d: 2, st: { sh: "l" } },
            { t: "o", r: { d: [2, 5] } },
            { t: "o", d: 2, st: { sh: "l" } },
            { t: "f" },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "g", b: "f", be: [1, 2, 6] },
            { t: "g" },
            { t: "o", r: { d: [2, 5] } },
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
          ], [
            { t: "o" },
            { t: "o" },
            { t: "g", b: "f", be: [1, 6] },
            { t: "g" },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "g", b: "f", be: [1, 5, 6] },
            { t: "g", b: "f", be: [5, 6] },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", r: { d: [2, 5] } },
            { t: "g" },
            { t: "g" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", r: { d: [4, 6] } },
            { t: "o", r: { d: [1, 4] } },
          ], [
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", r: { d: [3, 6] } },
            { t: "g" },
            { t: "g" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", r: { d: [2, 6] } },
            { t: "o", d: 2, st: { sh: "c" } },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", r: { d: [3, 6] } },
            { t: "g" },
            { t: "g" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] } },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o" },
            { t: "o", r: { d: [3, 6] } },
            { t: "g" },
            { t: "g" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "o" },
            { t: "g", b: "f", be: [1, 2, 3] },
            { t: "g", b: "f", be: [2, 3] },
            { t: "o", r: { d: [3, 4, 6] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 3] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "o" },
            { t: "g", b: "f", be: [1, 2] },
            { t: "g" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o", d: 1, st: { sh: "x", s: "f" } },
            { t: "o" },
            { t: "g" },
            { t: "g", b: "f", be: [3, 4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "g", b: "f", be: [1, 2] },
            { t: "g" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "g" },
            { t: "g", b: "f", be: [4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "g", b: "f", be: [1, 2, 6] },
            { t: "g" },
            { t: "o", r: { d: [3, 5] } },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "g", b: "f", be: [4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "g", b: "f", be: [1, 5, 6] },
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "g", b: "f", be: [5] },
            { t: "g", b: "f", be: [5, 6] },
            { t: "g", b: "f", be: [4, 5, 6] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "l" } },
            { t: "o", r: { d: [2, 5, 6] } },
            { t: "o", d: 2, st: { sh: "l" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "o", r: { d: [4, 6] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 3] } },
            { t: "o", r: { d: [2, 5] } },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l" } },
            { t: "o", d: 1, st: { sh: "l" } },
            { t: "o", r: { d: [2, 5] } },
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
          "0": { list: [
            :ussr_leader_6_1,
            :ussr_leader_4_1,
            [3, :ussr_rifle_s],
            [2, :ussr_smg_s],
            [2, :ussr_crew_t],
            [2, :ussr_57mm_zis_2],
            :ussr_120_pm_38,
            [4, :ussr_t_34_m42_m43],
            [2, :ussr_su_122],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end

      def axis_units
        {
          "0": { list: [
            :ger_leader_6_2,
            :ger_leader_4_1,
            [5, :ger_rifle_s],
            [2, :ger_mg_42],
            :ger_radio_15cm,
            :ger_sdkfz_222,
            [2, :ger_sdkfz_251_1],
            [5, :ger_tiger_i],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end
    end
  end
end
