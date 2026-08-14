# frozen_string_literal: true

module Scenarios
  class Scenario000 < Base
    ID = "000"
    NAME = "A Simple Matter"
    ALLIES = ["ussr"].freeze
    AXIS = ["ger"].freeze
    STATUS = ""
    VERSION = "1.0"

    DATE = [1942, 5, 15].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": { list: [
        :ussr_leader_5_1,
        :ussr_leader_4_1,
        [2, :ussr_guards_rifle_s],
        [2, :ussr_guards_smg_s],
        [2, :ussr_dp_27],
      ] },
    }.freeze

    AXIS_UNITS = {
      "0": { list: [
        :ger_leader_5_1,
        :ger_leader_4_1,
        :ger_pionier_s,
        [3, :ger_rifle_s],
        [2, :ger_mg_34],
      ] },
    }.freeze

    class << self
      def generate
        {
          turns: 5,
          first_deploy: 2,
          first_action: 1,
          date:,
          location: "Somewhere on the Eastern Front",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "This is a simple meeting engagement meant to be used as a tutorial
          or short learning scenario. This scenario is not set in any
          particular place, though at a particular time: when the Germans no
          longer held the upper hand, and the Soviets had not yet truly turned
          the tide of the war in their favor. The Soviet player will
          technically need to attack here to win, though the forces and
          position are meant to be reasonably balanced so that the average
          outcome should be fairly close to even with evenly-matched players
          at any skill level.",
        ]
      end

      def map_data
        {
          start_weather: "dry",
          base_weather: "dry",
          precip: [0, "rain"],
          wind: [1, 2, false],
          hexes:,
          layout:,
          allied_dir: 1,
          axis_dir: 4,
          victory_hexes: [
            [9, 4, 1], [4, 6, 2], [7, 5, 2], [3, 8, 2], [12, 4, 1],
          ],
          allied_setup: { "0" => [["8-14", "*"]] },
          axis_setup: { "0" => [["0-6", "*"]] },
        }
      end

      def hexes
        [
          [
            { t: "o" },
            { t: "b" },
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
            { t: "f" },
            { t: "f" },
          ],
          [
            { t: "b" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
          ],
          [
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ],
          [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "f", be: [2, 3] },
            { t: "o", b: "f", be: [2, 3] },
            { t: "o", r: { t: "d", d: [4, 6] } },
            { t: "o", r: { t: "d", d: [1, 4] } },
          ],
          [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "w" },
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o", st: { sh: "c", s: "u" }, d: 1 },
            { t: "o", r: { t: "d", d: [4, 6] } },
            { t: "o", r: { t: "d", d: [1, 4] } },
            { t: "o", r: { t: "d", d: [1, 4] } },
            { t: "o", r: { t: "d", d: [1, 3] } },
            { t: "o" },
          ],
          [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { t: "d", d: [4, 6] } },
            { t: "o", r: { t: "d", d: [1, 4] } },
            { t: "o", r: { t: "d", d: [1, 4] } },
            { t: "o", r: { t: "d", d: [1, 4] } },
            { t: "o", r: { t: "d", d: [1, 3] } },
            { t: "o" },
            { t: "o", st: { sh: "l", s: "f" }, d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o" },
          ],
          [
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o" },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o", r: { t: "d", d: [3, 6] } },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ],
          [
            { t: "o", r: { t: "d", d: [1, 4] } },
            { t: "o", r: { t: "d", d: [1, 4] } },
            { t: "o", r: { t: "d", d: [1, 5] } },
            { t: "o" },
            { t: "o", r: { t: "d", d: [3, 6] } },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "o" },
            { t: "w" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
          ],
          [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { t: "d", d: [2, 4, 6] } },
            { t: "o", r: { t: "d", d: [1, 3] } },
            { t: "o", b: "f", be: [3] },
            { t: "o", b: "f", be: [2, 3] },
            { t: "o", b: "f", be: [2, 3] },
            { t: "o", b: "f", be: [2] },
            { t: "w" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
          ],
          [
            { t: "o" },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "l", s: "f" } },
            { t: "o" },
            { t: "o" },
            { t: "b" },
            { t: "b" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
          ],
          [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "b" },
            { t: "b" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
          ],
        ]
      end
    end
  end
end
