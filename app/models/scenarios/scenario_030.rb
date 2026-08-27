# frozen_string_literal: true

module Scenarios
  class Scenario030 < Base
    ID = "030"
    NAME = "Railway Station No. 1"
    ALLIES = ["ussr"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"
    VERSION = "0.1"

    DATE = [1942, 9, 14].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": { list: [
        [2, :ussr_leader_4_1],
        [2, :ussr_pm_m1910],
        :ussr_ampulomet,
        [3, :ussr_guards_rifle_s],
        [2, :ussr_guards_smg_s],
      ] },
    }.freeze

    AXIS_UNITS = {
      "0": { list: [
        :ger_leader_6_1,
        [2, :ger_leader_5_1],
        [8, :ger_rifle_s],
        [4, :ger_mg_34],
        [2, :ger_sc],
        :ger_pzkpfw_iii_j,
        :ger_pzkpfw_iv_f1,
      ] },
    }.freeze

    class << self
      def generate
        {
          turns: 6,
          first_deploy: 1,
          first_action: 2,
          date:,
          location: "Stalingrad, Russia",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "Railway Station No. 1 was a central objective during the Battle of
          Stalingrad, where the Soviet 13th Guards Rifle Division and the
          German 71st Infantry Division engaged in some of the war’s most
          ferocious urban combat.  The station changed hands 15 times over
          five days of intense fighting.  The Soviets suffered devastating
          losses, as fighting took place in multi-level buildings, railway
          platforms, and among destroyed carriages. The station was eventually
          taken by German forces only after the Soviet defenders were largely
          wiped out.",
        ]
      end

      def map_data
        {
          start_weather: "dry",
          base_weather: "dry",
          precip: [0, "rain"],
          wind: [1, 4, true],
          hexes:,
          layout:,
          allied_dir: 1.5,
          axis_dir: 4.5,
          victory_hexes: [
            [3, 5, 2], [7, 7, 1], [10, 2, 1], [9, 5, 1], [11, 6, 1],
          ],
          allied_setup: {
            "0" => [
              ["11-14", 0], ["10-14", 1], ["10-14", 2], ["9-14", 3], ["9-14", 4], ["8-14", 5],
              ["8-14", 6], ["7-14", 7], ["7-14", 8], ["6-14", 9], ["6-14", 10],
            ],
          },
          axis_setup: {
            "0" => [
              ["0-7", 0], ["0-6", 1], ["0-6", 2], ["0-5", 3], ["0-5", 4], ["0-4", 5], ["0-4", 6],
              ["0-3", 7], ["0-3", 8], ["0-2", 9], ["0-2", 10],
            ],
          },
          base_terrain: "u",
        }
      end

      def hexes
        [
          [
            { t: "o" },
            { t: "o" },
            { t: "x" },
            { t: "x" },
            { t: "d", d: 3 },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "d", d: 3 },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "x" },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
          ],
          [
            { t: "o", st: { sh: "l", s: "f" }, d: 1.5 },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o" },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "x" },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "d", d: 3 },
          ],
          [
            { t: "o", r: { t: "t", d: [3, 5], c: "r", r: 2 } },
            { t: "o" },
            { t: "o", st: { sh: "l", s: "f" }, d: 1.5 },
            { t: "d", d: 3 },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o" },
            { t: "x" },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "o", st: { sh: "s", s: "u" }, d: 3 },
            { t: "o" },
            { t: "o", r: { t: "t", d: [1, 2, 4], c: "l", r: 2 } },
            { t: "o", r: { t: "t", d: [3, 5], c: "r", r: 2 } },
            { t: "d", d: 3 },
          ],
          [
            { t: "o", r: { t: "t", d: [2, 6], c: "l", r: 2 } },
            { t: "o", r: { t: "t", d: [3, 5], c: "r", r: 2 } },
            { t: "d", d: 3 },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o" },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "x" },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "o", st: { sh: "m", s: "u" }, d: 3 },
            { t: "o", st: { sh: "l", s: "u" }, d: 1.5 },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o", r: { t: "t", d: [2, 6], c: "l", r: 2 } },
            { t: "o", r: { t: "t", d: [3, 5], c: "r", r: 2 } },
          ],
          [
            { t: "o", st: { sh: "l", s: "f" }, d: 1.5 },
            { t: "o" },
            { t: "o", r: { t: "t", d: [2, 6], c: "l", r: 2 } },
            { t: "o", r: { t: "t", d: [3, 5], c: "r", r: 2 } },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "x" },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "x" },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "o", st: { sh: "m", s: "u" }, d: 3 },
            { t: "o" },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "d", d: 3 },
            { t: "o", st: { sh: "l", s: "f" }, d: 1.5 },
          ],
          [
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o", r: { t: "t", d: [1, 4, 6], c: "l", r: 2 } },
            { t: "x" },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "o", st: { sh: "m", s: "u" }, d: 3 },
            { t: "o", st: { sh: "l", s: "u" }, d: 1.5 },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o" },
          ],
          [
            { t: "x" },
            { t: "d", d: 3 },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o" },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "o", st: { sh: "m", s: "u" }, d: 3 },
            { t: "o" },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o" },
          ],
          [
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o" },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "x" },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "o", st: { sh: "s", s: "u" }, d: 6 },
            { t: "o", st: { sh: "l", s: "u" }, d: 1.5 },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "x" },
            { t: "o" },
          ],
          [
            { t: "d", d: 3 },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o" },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "x" },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "x" },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
          ],
          [
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "d", d: 3 },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "x" },
            { t: "o" },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "d", d: 3 },
            { t: "x" },
            { t: "x" },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o" },
          ],
          [
            { t: "o" },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "d", d: 3 },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "o", rr: { d: [[6, 3]] } },
            { t: "o" },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "x" },
            { t: "o" },
            { t: "o" },
          ],
        ]
      end
    end
  end
end
