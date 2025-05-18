# frozen_string_literal: true

module Scenarios
  class Scenario303 < Base
    ID = "303"
    NAME = "Over the Hedge"
    ALLIES = ["usa"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    DATE = [1944, 7, 1].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": { list: [
        :usa_leader_5_1,
        :usa_leader_4_1,
        [7, :usa_rifle_s],
        :usa_m1917_browning,
        :usa_radio_105mm,
      ] },
    }.freeze

    AXIS_UNITS = {
      "0": { list: [
        :ger_leader_5_1,
        :ger_leader_4_1,
        [5, :ger_volksgrenadier_s],
        [2, :ger_mg_42],
      ] },
    }.freeze

    class << self
      def generate
        {
          turns: 6,
          first_setup: 2,
          first_move: 1,
          date:,
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
          "The Normandy bocage, a landscape characterized by dense hedgerows
          and sunken lanes, presented significant challenges for Allied forces
          during the Battle of Normandy. These natural defenses allowed German
          troops to easily create fortifications and ambush advancing Allied
          forces. The bocage also hindered Allied tank movement and made
          progress slow and costly",
          "The fighting in the bocage became known as the \"Battle of the
          Hedgerows\" or \"Hedge War,\" highlighting the significant impact of
          this terrain on the Allied advance.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [1, 4, false],
          hexes:,
          layout:,
          allied_edge: "l",
          axis_edge: "r",
          victory_hexes: [
            [5, 6, 2], [6, 4, 2], [9, 1, 2], [11, 3, 2], [12, 8, 2],
          ],
          allied_setup: { "0" => [["0-2", "*"]] },
          axis_setup: { "0" => [["4-14", "*"]] },
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
            { t: "g" },
            { t: "g" },
            { t: "o", b: "b", be: [1] },
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
            { t: "o", d: 2, st: { sh: "l", s: "f" } },
            { t: "d", d: 2 },
            { t: "g", b: "b", be: [1, 5, 6] },
            { t: "g", b: "b", be: [5, 6] },
            { t: "o", b: "b", be: [1, 2, 5, 6] },
            { t: "o", b: "b", be: [6] },
          ], [
            { t: "g", b: "b", be: [5] },
            { t: "g", b: "b", be: [5, 6] },
            { t: "g", b: "b", be: [4, 5, 6] },
            { t: "g", b: "b", be: [6] },
            { t: "g", b: "b", be: [4] },
            { t: "o", b: "b", be: [5, 6] },
            { t: "o", b: "b", be: [5, 6] },
            { t: "o", b: "b", be: [4, 5, 6] },
            { t: "o", r: { d: [3, 4, 6] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "g", b: "b", be: [1, 6] },
            { t: "g" },
          ], [
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "g", b: "b", be: [1, 6] },
            { t: "g", b: "b", be: [4, 5] },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o", b: "b", be: [1, 2, 3, 5, 6] },
            { t: "o", b: "b", be: [2, 3, 4, 6] },
            { t: "d", d: 2 },
            { t: "o", d: 2, st: { sh: "l", s: "f" } },
            { t: "o", r: { d: [2, 5] } },
            { t: "g", b: "b", be: [1, 5, 6] },
            { t: "g", b: "b", be: [6] },
          ], [
            { t: "g", b: "b", be: [3] },
            { t: "g", b: "b", be: [2, 3, 4, 5] },
            { t: "o", b: "b", be: [2, 3, 4] },
            { t: "o", r: { d: [2, 5] } },
            { t: "g", b: "b", be: [1, 4, 5, 6] },
            { t: "d", d: 3, b: "b", be: [5, 6] },
            { t: "o", d: 3, st: { sh: "l", s: "f" } },
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
            { t: "g", b: "b", be: [1, 2, 3, 6] },
            { t: "g", b: "b", be: [2, 3, 4] },
            { t: "o", r: { d: [2, 5] } },
            { t: "g", b: "b", be: [1, 3, 6] },
            { t: "g", b: "b", be: [2, 3] },
            { t: "o", b: "b", be: [1, 2, 3] },
            { t: "g", b: "b", be: [1, 2, 3, 6] },
            { t: "g", b: "b", be: [2] },
          ], [
            { t: "o" },
            { t: "o", b: "b", be: [4, 5] },
            { t: "g" },
            { t: "g", b: "b", be: [3, 4, 5] },
            { t: "o", r: { d: [3, 6] } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o" },
            { t: "g", b: "b", be: [1, 5, 6] },
            { t: "g", b: "b", be: [3, 4, 5, 6] },
            { t: "o", r: { d: [2, 5] } },
            { t: "g", b: "b", be: [1, 5, 6] },
            { t: "o", b: "b", be: [1, 2, 5, 6] },
            { t: "o", b: "b", be: [5, 6] },
            { t: "g", b: "b", be: [1, 5, 6] },
          ], [
            { t: "o", b: "b", be: [4, 5, 6] },
            { t: "g", b: "b", be: [5, 6] },
            { t: "g", b: "b", be: [4, 5, 6] },
            { t: "o", r: { d: [3, 6] } },
            { t: "d", d: 1, b: "b", be: [1, 2] },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "g", b: "b", be: [1, 2] },
            { t: "g", b: "b", be: [4, 5] },
            { t: "o", b: "b", be: [3, 4] },
            { t: "o", r: { d: [2, 5] } },
            { t: "o", b: "b", be: [1] },
            { t: "d", d: 2 },
            { t: "o", b: "b", be: [1, 6] },
            { t: "o" },
          ], [
            { t: "g" },
            { t: "g" },
            { t: "g", b: "b", be: [4, 5] },
            { t: "o", r: { d: [3, 6] } },
            { t: "g", b: "b", be: [1, 2, 3] },
            { t: "g", b: "b", be: [2, 3, 4, 5] },
            { t: "o", d: 1, st: { sh: "c" } },
            { t: "g", b: "b", be: [1, 2] },
            { t: "g", b: "b", be: [4] },
            { t: "o" },
            { t: "o", b: "b", be: [3, 4] },
            { t: "o", r: { d: [2, 5] } },
            { t: "o", d: 2, st: { sh: "x", s: "f" } },
            { t: "d", d: 2 },
            { t: "o", b: "b", be: [1, 5, 6] },
          ], [
            { t: "g", b: "b", be: [5, 6] },
            { t: "g", b: "b", be: [4, 5, 6] },
            { t: "o", r: { d: [3, 6] } },
            { t: "g", b: "b", be: [1, 2, 5, 6] },
            { t: "g", b: "b", be: [4, 5, 6] },
            { t: "g", b: "b", be: [3, 4] },
            { t: "o", b: "b", be: [2, 3] },
            { t: "o", b: "b", be: [2, 3] },
            { t: "o", b: "b", be: [2, 3, 4, 5] },
            { t: "g", b: "b", be: [2, 3] },
            { t: "g", b: "b", be: [2, 3, 4] },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "g", b: "b", be: [1, 2] },
            { t: "g" },
          ], [
            { t: "o" },
            { t: "o", b: "b", be: [4] },
            { t: "o", r: { d: [3, 6] } },
            { t: "o", b: "b", be: [1, 2] },
            { t: "o", b: "b", be: [4] },
            { t: "g" },
            { t: "g", b: "b", be: [3, 4] },
            { t: "o" },
            { t: "o", b: "b", be: [4] },
            { t: "g" },
            { t: "g" },
            { t: "g", b: "b", be: [3, 4] },
            { t: "o", r: { d: [2, 5] } },
            { t: "g", b: "b", be: [1, 2] },
            { t: "g" },
          ],
        ]
      end
    end
  end
end
