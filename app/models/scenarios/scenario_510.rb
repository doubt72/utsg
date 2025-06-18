# frozen_string_literal: true

module Scenarios
  class Scenario510 < Base
    ID = "510"
    NAME = "Le Hérisson"
    ALLIES = ["fra"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    DATE = [1940, 6, 8].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          [2, :fra_leader_4_1],
          [6, :fra_reservist_s],
          [3, :fra_m1915_chauchat],
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :ger_leader_5_1,
          :ger_leader_4_1,
          [9, :ger_rifle_s],
          [3, :ger_mg_34],
        ],
      },
    }.freeze

    class << self
      def generate
        {
          turns: 6,
          first_deploy: 1,
          first_action: 2,
          date:,
          location: "Soissons, France",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "Fall Rot (\"Case Red\") was the second phase of Germany's 1940
          campaign against France, launched after the success of Fall Gelb
          (\"Case Yellow\"). While Fall Gelb had focused on encircling Allied
          forces in Belgium and northern France — culminating in the evacuation
          at Dunkirk — Fall Rot, which began on June 5, 1940, aimed to defeat
          what remained of the French Army and occupy the rest of the
          country.",

          "During the next three weeks, far from the easy advance the
          Wehrmacht expected, they encountered strong resistance from a
          rejuvenated French Army, which fallen back on their lines of supply
          and communications and were closer to repair shops, supply dumps and
          stores.  German progress was made only late on the third day of
          operations, finally forcing crossings of the Somme, and captured
          Paris a week later.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [0, 5, false],
          hexes:,
          layout:,
          allied_dir: 1,
          axis_dir: 4,
          victory_hexes: [
            [2, 7, 2], [7, 8, 1], [8, 4, 1], [12, 6, 1], [12, 8, 1],
          ],
          allied_setup: { "0" => [["4-14", "*"]] },
          axis_setup: { "0" => [["0-2", "*"]] },
          base_terrain: "g",
        }
      end

      def hexes
        [
          [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "g" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "g" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "o", r: { d: [3, 6], t: "d" } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "x", s: "f" } },
            { t: "f" },
            { t: "f" },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "o", r: { d: [3, 6], t: "d" } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "d", d: 1.5 },
            { t: "o", r: { d: [3, 6], t: "d" } },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o", r: { d: [2, 6], t: "d", c: "l" } },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", d: 3, st: { sh: "l2", s: "f" } },
            { t: "o", r: { d: [3, 6], t: "d" } },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "c", s: "u" } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [3, 5], t: "d", c: "r" } },
            { t: "d", d: 1 },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [3, 6], t: "d" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 2, 4], t: "d", c: "l" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 3, 5], t: "d" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [2, 5], t: "d" } },
            { t: "o", d: 2, st: { sh: "l2", s: "f" } },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [2, 5], t: "d" } },
            { t: "o" },
          ],
        ]
      end
    end
  end
end
