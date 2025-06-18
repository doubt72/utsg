# frozen_string_literal: true

module Scenarios
  class Scenario301 < Base
    ID = "301"
    NAME = "Rally Point"
    ALLIES = ["usa"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    DATE = [1944, 6, 6].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": { list: [
        :usa_leader_6_2,
        :usa_leader_5_1,
        [6, :usa_paratroop_s],
        [2, :usa_m1918_bar],
      ] },
    }.freeze

    AXIS_UNITS = {
      "0": { list: [
        :ger_leader_4_1,
        :ger_leader_3_1,
        [10, :ger_volksgrenadier_s],
        [2, :ger_mg_42],
      ] },
    }.freeze

    class << self
      def generate
        {
          turns: 6,
          first_deploy: 1,
          first_action: 2,
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
          "After the airborne landings in Normandy, paratroopers were badly
          scattered due to cloud cover, anti-aircraft fire, and difficult
          navigation, and just plain mis-drops. This caused many to land
          outside their intended drop zones, often far outside, disrupting
          most of the pre-drop plans.  On the other hand, the scattered
          landings also created confusion among the German forces, as they
          didn't know the true extent of the airborne assault.",
          "While initially chaotic, the scattered paratroopers still managed
          to capture many of their objectives, disrupt German defenses and tie
          down significant enemy forces, contributing to the success of the
          Normandy invasion.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [1, 3, false],
          hexes:,
          layout:,
          allied_dir: 4,
          axis_dir: 1,
          victory_hexes: [
            [4, 3, 1], [4, 7, 1], [6, 5, 1], [8, 4, 1], [9, 6, 1],
          ],
          allied_setup: { "0" => [["4-9", "3-7"]] },
          axis_setup: { "0" => [["0-1", "*"], ["13-14", "*"], ["*", "0-1"], ["*", "9-10"]] },
        }
      end

      def hexes
        [
          [
            { t: "o" },
            { t: "o", b: "b", be: [4] },
            { t: "o" },
            { t: "d", d: 2 },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [1, 6] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [1, 6] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", b: "b", be: [3, 4] },
            { t: "o" },
            { t: "d", d: 2 },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "l" } },
            { t: "o" },
            { t: "o", b: "b", be: [1, 6] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [1, 6] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [3, 4] },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [1, 5, 6] },
            { t: "o", b: "b", be: [5, 6] },
            { t: "o", b: "b", be: [5, 6] },
            { t: "o", b: "b", be: [5, 6] },
            { t: "o", b: "b", be: [1, 5, 6] },
            { t: "o", b: "b", be: [5, 6] },
            { t: "o", b: "b", be: [5, 6] },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [3, 4] },
            { t: "o" },
            { t: "o", d: 2, st: { sh: "s" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
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
            { t: "o", b: "b", be: [3] },
            { t: "o", b: "b", be: [2, 3] },
            { t: "o", b: "b", be: [2, 3] },
            { t: "o", b: "b", be: [2, 3, 4, 5] },
            { t: "o" },
            { t: "o", d: 5, st: { sh: "s" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l" } },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o", r: { d: [2, 4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
          ], [
            { t: "o", b: "b", be: [5, 6] },
            { t: "o", b: "b", be: [5, 6] },
            { t: "o", b: "b", be: [4, 5, 6] },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "s" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", b: "w", be: [4, 5] },
            { t: "o" },
            { t: "o", b: "b", be: [1, 2, 3] },
            { t: "o", b: "b", be: [2, 3] },
            { t: "o", b: "b", be: [2, 3] },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "s" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "d", d: 1, b: "w", be: [5, 6] },
            { t: "d", d: 1, b: "w", be: [5, 6] },
            { t: "d", d: 1, b: "w", be: [5, 6] },
            { t: "o", b: "w", be: [4, 5, 6] },
            { t: "o" },
            { t: "o", b: "b", be: [1, 2] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [1, 2] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [1, 2, 3] },
            { t: "o", b: "b", be: [2, 3] },
            { t: "o", b: "b", be: [2, 3] },
            { t: "o", b: "b", be: [2, 3] },
            { t: "o", b: "b", be: [2] },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [1, 2] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ],
        ]
      end
    end
  end
end
