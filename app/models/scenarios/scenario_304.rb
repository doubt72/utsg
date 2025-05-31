# frozen_string_literal: true

module Scenarios
  class Scenario304 < Base
    ID = "304"
    NAME = "Pegasus Bridge"
    ALLIES = ["uk"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    DATE = [1944, 6, 6].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          :uk_leader_6_2,
          :uk_engineer_s,
          [9, :uk_airborne_s],
          :uk_bren_lmg,
          :uk_piat,
        ],
      },
      "2": {
        list: [
          :uk_airborne_t,
          :ger_7_5cm_pak_40,
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :ger_leader_4_1,
          [4, :ger_rifle_s],
          :ger_mg_34,
          [2, :ger_pzkpfw_iv_g],
        ],
      },
      "2": {
        list: [
          :ger_leader_4_1,
          [4, :ger_rifle_s],
          :ger_mg_34,
          :ger_marder_iii,
        ],
      },
      "4": {
        list: [
          :ger_leader_4_1,
          [6, :ger_rifle_s],
          :ger_mg_34,
          :ger_8cm_grw_34,
          :ger_pzkpfw_iv_g,
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
          location: "Bénouville, France",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "The Battle of Pegasus Bridge took place in the early hours of 6
          June 1944, marking one of the very first engagements of the D-Day
          invasion.  As part of the British 6th Airborne Division's mission to
          secure the eastern flank of the Allied landings in Normandy, a small
          force of glider-borne troops was tasked with capturing two critical
          bridges over the Caen Canal and the Orne River.  These bridges were
          vital for preventing German counterattacks from reaching Sword
          Beach, where British forces were scheduled to land just hours later.
          Led by Major John Howard, D Company of the 2nd Battalion,
          Oxfordshire and Buckinghamshire Light Infantry, landed in six wooden
          Horsa gliders just after midnight, achieving near-perfect placement
          only yards from the objectives.",

          "The assault was swift and precise. The British troops stormed the
          Benouville Bridge (later renamed Pegasus Bridge in honor of the
          airborne division's winged-horse emblem) and the Ranville Bridge
          (later called Horsa Bridge) and secured both within ten minutes of
          landing, along with their defensive emplacements.  Due to isolated
          resistance and confusion among the German defenders, the mission was
          a success with minimal British casualties.  Throughout the rest of
          the night and the morning, the lightly armed airborne troops held
          their position against repeated German counterattacks until they
          were reinforced by units advancing inland from the beaches.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [2, 5, true],
          hexes:,
          layout:,
          allied_dir: 4.5,
          axis_dir: 1,
          victory_hexes: [
            [6, 3, 1], [8, 5, 1], [9, 3, 1], [10, 5, 1], [12, 6, 1],
          ],
          allied_setup: {
            "0" => 0.upto(10).map { |y| ["#{8 - ((y - 1) / 2)}-14", y] },
            "2" => 0.upto(10).map { |y| ["#{12 - ((y - 1) / 2)}-14", y] },
          },
          axis_setup: {
            "0" => [["0-1", "*"]],
            "2" => [[0, "*"]],
            "4" => [[0, "*"]],
          },
          base_terrain: "g",
          night: true,
        }
      end

      def hexes
        [
          [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [2, 6], t: "t" } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "w" },
            { t: "w" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "w" },
            { t: "w" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [1, 4, 6], t: "t", c: "l", r: 5 } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "w" },
            { t: "w" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3], t: "t" } },
            { t: "o", r: { d: [1, 3, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "o" },
            { t: "o", s: { d: [3, 6], t: "t" } },
            { t: "w" },
            { t: "w" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l2", s: "u" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l2", s: "u" } },
            { t: "d", d: 3 },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 1.5, st: { sh: "l2", s: "u" } },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "w" },
            { t: "w" },
            { t: "o", s: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "l2", s: "u" } },
            { t: "w", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
            { t: "w", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "o", s: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l2", s: "u" } },
            { t: "o", d: 1, st: { sh: "l2", s: "u" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l2", s: "u" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o", s: { d: [3, 6], t: "t" } },
            { t: "w" },
            { t: "w" },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [1, 2, 6], t: "t", c: "l", r: 5 } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "l2", s: "u" } },
            { t: "o" },
            { t: "o" },
            { t: "w" },
            { t: "w" },
            { t: "o", s: { d: [3, 6], t: "t" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l2", s: "u" } },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "l2", s: "u" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "w" },
            { t: "w" },
            { t: "o", s: { d: [3, 6], t: "t" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "l2", s: "u" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "l2", s: "u" } },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "w" },
            { t: "w" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "w" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "w" },
            { t: "w" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [3, 6], t: "t" } },
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
