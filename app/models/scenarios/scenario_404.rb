# frozen_string_literal: true

module Scenarios
  class Scenario404 < Base
    ID = "404"
    NAME = "Intramuros"
    ALLIES = ["usa"].freeze
    AXIS = ["jap"].freeze
    STATUS = "p"

    DATE = [1945, 2, 23].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          :usa_leader_5_1,
          [2, :usa_leader_4_1],
          [2, :usa_engineer_s],
          [10, :usa_rifle_s],
          [3, :usa_m1919_browning],
          :usa_ft,
          :usa_sc,
          :usa_radio_155mm,
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :jap_leader_5_1,
          :jap_leader_4_1,
          [10, :jap_b_division_s],
          [3, :jap_type_92_hmg],
        ],
      },
    }.freeze

    class << self
      def generate
        {
          turns: 6,
          first_setup: 2,
          first_move: 1,
          date:,
          location: "Manila, Philippines",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "The Battle for Intramuros, fought in February 1945, was one of the
          most intense and destructive urban engagements of the Battle of
          Manila. Intramuros, the centuries-old walled city at the heart of
          Manila, was a heavily fortified Spanish colonial-era district that
          the Japanese had turned into a last bastion during their defense of
          the capital. As American and Filipino forces closed in, the Japanese
          garrison refused to surrender and prepared for a fight to the death,
          turning the ancient stone walls, churches, and government buildings
          into strongpoints.",

          "The U.S. 37th Infantry Division, alongside elements of the 1st
          Cavalry Division and Filipino guerrillas, assaulted Intramuros
          starting on February 23, 1945, following days of artillery
          bombardment aimed at breaking the Japanese defenses. The battle was
          brutal, featuring close-quarters combat, flamethrowers, and
          house-to-house fighting in narrow streets and rubble-strewn
          buildings. Thousands of civilians trapped inside were either killed
          by the Japanese in mass executions or died in the crossfire. By
          February 28, the walled city was in Allied hands, but at a
          staggering cost: nearly all of Intramuros was destroyed, along with
          much of Manila.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [1, 5, false],
          hexes:,
          layout:,
          allied_dir: 1,
          axis_dir: 4,
          victory_hexes: [
            [2, 9, 2], [3, 6, 2], [3, 1, 2], [5, 9, 2], [6, 3, 2], [9, 6, 2], [12, 8, 1],
          ],
          allied_setup: { "0" => [["12-14", "*"]] },
          axis_setup: { "0" => [["0-10", "*"]] },
          base_terrain: "u",
        }
      end

      def hexes
        [
          [
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "m", s: "u" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 2, st: { sh: "m", s: "u" } },
            { t: "o", b: "w", be: [3, 4], r: { d: [2, 5], t: "t" } },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "f" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "s", s: "u" } },
          ], [
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 5, st: { sh: "s", s: "u" } },
            { t: "o", d: 1, st: { sh: "s", s: "u" } },
            { t: "o", d: 1, st: { sh: "m", s: "u" } },
            { t: "o", d: 4, st: { sh: "s", s: "u" } },
            { t: "o", d: 5, st: { sh: "s", s: "u" } },
            { t: "o", b: "w", be: [3, 4], r: { d: [2, 5], t: "t" } },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "f" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "s", s: "u" } },
          ], [
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 2, 4, 5], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", b: "w", be: [3, 4], r: { d: [1, 2, 5], t: "t" } },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "f" },
            { t: "o" },
          ], [
            { t: "o", d: 4, st: { sh: "s", s: "u" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "s", s: "u" } },
            { t: "o", d: 1, st: { sh: "l", s: "u" } },
            { t: "o", d: 2, st: { sh: "s", s: "u" } },
            { t: "o", d: 1, st: { sh: "l", s: "u" } },
            { t: "o", d: 2, st: { sh: "s", s: "u" } },
            { t: "o", b: "w", be: [3, 4], r: { d: [2, 5], t: "t" } },
            { t: "o", b: "w", be: [2, 3] },
            { t: "o", b: "w", be: [2, 3, 4] },
            { t: "o" },
            { t: "f" },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "s", s: "u" } },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", d: 2, st: { sh: "l", s: "u" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "m", s: "u" } },
            { t: "d", d: 2 },
            { t: "o", d: 2, st: { sh: "m", s: "u" } },
            { t: "d", d: 2 },
            { t: "o", d: 2, st: { sh: "m", s: "u" } },
            { t: "o", b: "w", be: [3, 4], r: { d: [2, 5], t: "t" } },
            { t: "o", d: 1, st: { sh: "l2", s: "u" } },
            { t: "o", b: "w", be: [3, 4] },
            { t: "o" },
            { t: "f" },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "m", s: "u" } },
          ], [
            { t: "o", d: 1, st: { sh: "m", s: "u" } },
            { t: "o", d: 4, st: { sh: "s", s: "u" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 5, st: { sh: "s", s: "u" } },
            { t: "d", d: 2 },
            { t: "o", d: 5, st: { sh: "s", s: "u" } },
            { t: "d", d: 2 },
            { t: "o", d: 5, st: { sh: "s", s: "u" } },
            { t: "o", b: "w", be: [3, 5], r: { d: [2, 6], t: "t" } },
            { t: "o" },
            { t: "o", b: "w", be: [3, 4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5, 6], t: "t" } },
            { t: "o", d: 5, st: { sh: "s", s: "u" } },
          ], [
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "s", s: "u" } },
            { t: "o", d: 1, st: { sh: "s", s: "u" } },
            { t: "o", d: 1, st: { sh: "m", s: "u" } },
            { t: "o", d: 4, st: { sh: "s", s: "u" } },
            { t: "o", b: "w", be: [4, 5], r: { d: [3, 6], t: "t" } },
            { t: "o", d: 1, st: { sh: "l2", s: "u" } },
            { t: "o", b: "w", be: [4, 5] },
            { t: "o" },
            { t: "f" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
          ], [
            { t: "o", d: 2, st: { sh: "s", s: "u" } },
            { t: "o", d: 1, st: { sh: "l", s: "u" } },
            { t: "o", d: 2, st: { sh: "s", s: "u" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "m", s: "u" } },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "s", s: "u" } },
            { t: "o", b: "w", be: [4, 5], r: { d: [3, 6], t: "t" } },
            { t: "o", b: "w", be: [5, 6] },
            { t: "o", b: "w", be: [4, 5, 6] },
            { t: "o" },
            { t: "f" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "t" } },
          ], [
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "m", s: "u" } },
            { t: "o" },
            { t: "o", d: 2, st: { sh: "m", s: "u" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 5, st: { sh: "s", s: "u" } },
            { t: "o", d: 6, st: { sh: "m", s: "u" } },
            { t: "o", b: "w", be: [4], r: { d: [3, 5, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 5, st: { sh: "s", s: "u" } },
            { t: "o", d: 1, st: { sh: "l", s: "u" } },
            { t: "o", d: 5, st: { sh: "s", s: "u" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 6, st: { sh: "s", s: "u" } },
            { t: "o", b: "w", be: [4, 5], r: { d: [3, 6], t: "t" } },
            { t: "o", r: { d: [2, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3], t: "t" } },
            { t: "o" },
            { t: "w" },
            { t: "f" },
          ], [
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 2, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 2, 4], t: "t" } },
            { t: "o", b: "w", be: [4, 5], r: { d: [1, 3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "w" },
            { t: "f" },
          ],
        ]
      end
    end
  end
end
