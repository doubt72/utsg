# frozen_string_literal: true

module Scenarios
  class Scenario005 < Base
    ID = "005"
    NAME = "Typhoon's Last Gasp"
    ALLIES = ["ussr"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    DATE = [1941, 12, 1].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          [2, :ussr_leader_4_1],
          [8, :ussr_rifle_s],
          :ussr_dshk,
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :ger_leader_5_1,
          :ger_leader_4_1,
          [8, :ger_rifle_s],
          [2, :ger_mg_34],
          :ger_mg_08_15,
          :ger_5cm_legrw_36,
        ],
      },
    }.freeze

    class << self
      def generate
        {
          turns: 6,
          first_setup: 1,
          first_move: 2,
          date:,
          location: "Naro-Fominsk, Russia",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "In mid November of 1941, the Germans began their final attack on
          Moscow, with the goal of encircling it and linking up near the city
          of Noginsk, east of the capital. To achieve this objective, the
          German Third and Fourth Panzer Groups concentrated their attack to
          the north. In the south, the Second Panzer Army attempted to bypass
          Tula, and advance to Kashira and Kolomna, linking up with the
          northern pincer.",
          "Because of the resistance on both the northern and southern sides
          of Moscow eventually halted those attacks, the Wehrmacht then
          attempted a direct offensive from the west along the Minsk-Moscow
          highway near the city of Naro-Fominsk. This offensive had limited
          tank support and was directed against extensive Soviet defenses.
          After meeting determined resistance, that offensive too stalled, and
          Moscow would remain uncaptured.  Never again would he German army
          get so close to reaching Moscow.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [0, 2, false],
          hexes:,
          layout:,
          allied_edge: "r",
          axis_edge: "l",
          victory_hexes: [
            [1, 1, 2], [4, 9, 1], [6, 4, 1], [9, 2, 1], [11, 5, 1],
          ],
          allied_setup: { "0" => [["4-14", "*"]] },
          axis_setup: { "0" => [["0-2", "*"]] },
          base_terrain: "s",
        }
      end

      def hexes
        [
          [
            { t: "f" },
            { t: "f", r: { d: [2, 5] } },
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
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [4, 6] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "s", s: "f" } },
            { t: "o", r: { d: [3, 6] } },
            { t: "o", d: 1, st: { sh: "s", s: "f" } },
            { t: "o", d: 4, st: { sh: "s", s: "f" } },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "s", s: "f" } },
            { t: "o", r: { d: [3, 6] } },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 3, 4, 6] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "o", d: 1, st: { sh: "l", s: "f" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", b: "f", be: [1, 2, 3] },
            { t: "o", b: "f", be: [2, 3] },
            { t: "o", b: "f", be: [2, 3, 4, 5] },
            { t: "o", r: { d: [3, 6] } },
            { t: "o", d: 1, st: { sh: "s", s: "f" } },
            { t: "o", d: 4, st: { sh: "s", s: "f" } },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "o", d: 1, st: { sh: "l", s: "f" } },
            { t: "o" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "o" },
            { t: "o", b: "f", be: [1, 2] },
            { t: "o" },
            { t: "o", b: "f", be: [4, 5] },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l", s: "f" } },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
          ], [
            { t: "f" },
            { t: "o", b: "f", be: [2] },
            { t: "o" },
            { t: "o", b: "f", be: [4, 5] },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", b: "f", be: [1, 2, 3] },
            { t: "o", b: "f", be: [2, 3, 4] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", b: "f", be: [4, 5] },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", b: "f", be: [1, 2] },
            { t: "o" },
            { t: "o", b: "f", be: [3] },
            { t: "o", b: "f", be: [1, 2, 3] },
            { t: "o", b: "f", be: [2, 3] },
            { t: "o", b: "f", be: [2, 3] },
            { t: "f" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o", d: 3, st: { sh: "l", s: "f" } },
            { t: "o" },
            { t: "o", b: "f", be: [1, 2] },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "f", be: [1, 2] },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "f" },
            { t: "f" },
            { t: "o", b: "f", be: [2] },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "f", be: [1, 2] },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
          ],
        ]
      end
    end
  end
end
