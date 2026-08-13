# frozen_string_literal: true

module Scenarios
  class Scenario017 < Base
    ID = "017"
    NAME = "Bridge to Uman"
    ALLIES = ["ussr"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"
    VERSION = "0.1"

    DATE = [1941, 7, 21].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": { list: [
        :ussr_leader_4_1,
        [3, :ussr_rifle_s],
        :ussr_dp_27,
        :ussr_crew_t,
        :ussr_76mm_zis_3,
      ] },
    }.freeze

    AXIS_UNITS = {
      "0": { list: [
        :ger_leader_5_1,
        :ger_leader_4_1,
        [6, :ger_rifle_s],
        [2, :ger_mg_34],
        :ger_kz_8cm_grw_42,
      ] },
    }.freeze

    class << self
      def generate
        {
          turns: 5,
          first_deploy: 2,
          first_action: 1,
          date:,
          location: "Malyn, Ukraine",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "The Battle of Uman occurred in Ukraine in 1941. In the course of
          three weeks the Wehrmacht encircled and annihilated the two Soviet
          armies.  The battle occurred during the defense of Kiev between the
          elements of the Red Army's Southwestern Front, retreating from the
          Lwow salient, and German Army Group South as part of Operation
          Barbarossa.",
          "Here Soviet a small German force attempts to hold a river crossing
          against attacking German infantry forces on the northern flank of
          the battle.",
        ]
      end

      def map_data
        {
          start_weather: "dry",
          base_weather: "dry",
          precip: [0, "rain"],
          wind: [2, 4, false],
          hexes:,
          layout:,
          allied_dir: 1,
          axis_dir: 1,
          victory_hexes: [
            [6, 5, 1], [2, 5, 2], [10, 3, 1], [4, 7, 1], [12, 5, 1],
          ],
          allied_setup: { "0" => [["4-14", "*"]] },
          axis_setup: { "0" => [["0-2", "*"]] },
        }
      end

      def hexes
        [
          [
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1, b: "c", be: [4] },
            { t: "o", h: -1, s: { t: "s", d: [3, 5] } },
            { t: "o", h: 1, b: "c", be: [1, 6] },
            { t: "o", h: 2 },
            { t: "f", h: 2 },
            { t: "f", h: 2 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
          ],
          [
            { t: "o", h: 4 },
            { t: "f", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "b", h: 2 },
            { t: "b", h: 1, b: "c", be: [3, 4] },
            { t: "o", h: -1, s: { t: "s", d: [2, 5] } },
            { t: "o", h: 1, b: "c", be: [1, 6] },
            { t: "o", h: 2 },
            { t: "f", h: 2 },
            { t: "f", h: 2 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "f", h: 4 },
            { t: "f", h: 4 },
          ],
          [
            { t: "o", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 2 },
            { t: "o", h: 2 },
            { t: "b", h: 2 },
            { t: "b", h: 1 },
            { t: "b" },
            { t: "o", h: -1, s: { t: "s", d: [2, 6] } },
            { t: "o", h: 1, b: "c", be: [1] },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
          ],
          [
            { t: "o", h: 2 },
            { t: "f", h: 2 },
            { t: "f", h: 2 },
            { t: "o", h: 2 },
            { t: "b", h: 1 },
            { t: "o" },
            { t: "o", h: -1, s: { t: "s", d: [3, 5] } },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 2, st: { sh: "l", s: "f" }, d: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
          ],
          [
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o", h: -1, s: { t: "s", d: [2, 6] } },
            { t: "o", r: { t: "d", d: [4, 6] } },
            { t: "o", h: 1, r: { t: "d", d: [1, 4] } },
            { t: "o", h: 2, r: { t: "d", d: [1, 4] } },
            { t: "o", h: 2, r: { t: "d", d: [1, 5] } },
            { t: "d", h: 2, d: 1 },
            { t: "d", h: 2, d: 1 },
            { t: "d", h: 2, d: 1 },
          ],
          [
            { t: "d", h: 2, d: 1 },
            { t: "d", h: 2, d: 1 },
            { t: "o", h: 2, st: { sh: "l", s: "f" }, d: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", r: { t: "d", d: [4, 6] } },
            { t: "o", h: -1, s: { t: "s", d: [3, 5] }, r: { t: "d", d: [1, 4] } },
            { t: "o", r: { t: "d", d: [1, 3] } },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "d", h: 2, d: 1 },
            { t: "o", h: 2, r: { t: "d", d: [2, 4] } },
            { t: "o", h: 2, r: { t: "d", d: [1, 4] } },
            { t: "o", h: 2, r: { t: "d", d: [1, 4] } },
            { t: "o", h: 2, r: { t: "d", d: [1, 4] } },
          ],
          [
            { t: "o", h: 2, r: { t: "d", d: [1, 4] } },
            { t: "o", h: 2, r: { t: "d", d: [1, 4] } },
            { t: "o", h: 2, r: { t: "d", d: [1, 5] } },
            { t: "o", h: 2 },
            { t: "d", h: 2, d: 1 },
            { t: "o", h: 1, r: { t: "d", d: [3, 6] } },
            { t: "o" },
            { t: "o", h: -1, s: { t: "s", d: [2, 5] } },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "d", h: 2, d: 1 },
            { t: "o", h: 2 },
            { t: "d", h: 2, d: 1 },
          ],
          [
            { t: "o", h: 2 },
            { t: "d", h: 2, d: 1 },
            { t: "o", h: 2, r: { t: "d", d: [2, 4] } },
            { t: "o", h: 2, r: { t: "d", d: [1, 4] } },
            { t: "o", h: 2, r: { t: "d", d: [1, 3] } },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o", s: { t: "s", d: [2, 5] } },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
          ],
          [
            { t: "f", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", s: { t: "s", d: [2, 5] } },
            { t: "o", h: 1 },
            { t: "b", h: 2 },
            { t: "b", h: 2 },
            { t: "b", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
          ],
          [
            { t: "f", h: 4 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "b", h: 2 },
            { t: "b", h: 2 },
            { t: "o", h: 1 },
            { t: "o", h: 1, s: { t: "s", d: [2, 5] } },
            { t: "b", h: 2 },
            { t: "b", h: 2 },
            { t: "b", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
          ],
          [
            { t: "f", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "b", h: 3 },
            { t: "b", h: 2 },
            { t: "b", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1, s: { t: "s", d: [2, 6] } },
            { t: "b", h: 2 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "f", h: 4 },
            { t: "f", h: 4 },
          ],
        ]
      end
    end
  end
end
