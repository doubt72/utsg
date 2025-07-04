# frozen_string_literal: true

module Scenarios
  class Scenario603 < Base
    ID = "603"
    NAME = "Red Dust"
    ALLIES = ["chi"].freeze
    AXIS = ["jap"].freeze
    STATUS = "p"

    DATE = [1941, 9, 26].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          :chi_leader_5_1,
          [6, :chi_regular_s],
          [2, :chi_regular_t],
          [2, :chi_type_triple_ten],
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :jap_leader_6_1,
          :jap_leader_4_1,
          [5, :jap_b_division_s],
          [4, :jap_b_division_t],
          [2, :jap_type_99_lmg],
          :jap_type_89_gren_l,
          :jap_70mm_type_92,
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
          location: "Jintan, China",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "The Japanese launched a series of offensives in September of 1941
          to capture Changsha, which was a vital transportation and
          communication hub. The Chinese defenders implemented a strategic
          defense-in-depth approach, utilizing the region's natural terrain
          and fortified positions to slow the Japanese advance. The engagement
          near Jintan was marked by intense infantry combat, with both sides
          suffering significant casualties. Despite the Japanese numerical
          superiority and initial successes, the Chinese forces managed to
          inflict heavy losses on the advancing troops, disrupting their
          momentum.",

          "The battle near Jintan exemplified the Chinese strategy of
          attrition, aiming to wear down the Japanese forces through sustained
          resistance and tactical withdrawals. While the Japanese eventually
          captured Jintan, the engagement delayed their advance and
          contributed to the broader Chinese success in the Second Battle of
          Changsha, where the Japanese were ultimately repelled. This victory
          was significant as it marked one of the first major defeats for the
          Japanese army in the war, boosting Chinese morale and demonstrating
          the effectiveness of their defensive strategies.",
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
          allied_dir: 4,
          axis_dir: 1,
          victory_hexes: [
            [3, 2, 1], [3, 8, 1], [7, 9, 1], [9, 2, 1], [12, 3, 2],
          ],
          allied_setup: { "0" => [["0-10", "*"]] },
          axis_setup: { "0" => [["12-14", "*"]] },
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
            { t: "o", r: { d: [3, 6] } },
          ], [
            { t: "f" },
            { t: "o", r: { d: [4, 6] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l2", s: "f" } },
            { t: "d", d: 1 },
            { t: "o", d: 1, st: { sh: "l2", s: "f" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l2", s: "f" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l2", s: "f" } },
            { t: "o", d: 1, st: { sh: "l2", s: "f" } },
            { t: "d", d: 1 },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 3, 5] } },
            { t: "f" },
          ], [
            { t: "o", r: { d: [3, 6] } },
            { t: "o", d: 3, st: { sh: "l2", s: "f" } },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "o" },
            { t: "o", d: 2, st: { sh: "l2", s: "f" } },
            { t: "o", r: { d: [2, 5] } },
            { t: "f" },
          ], [
            { t: "o", r: { d: [3, 6] } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "o" },
            { t: "t" },
            { t: "d", d: 2 },
            { t: "o", r: { d: [2, 4, 6] } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "o", s: { d: [4, 6] } },
            { t: "o", s: { d: [1, 4] } },
            { t: "o", s: { d: [1, 4] } },
            { t: "o", s: { d: [1, 4] } },
            { t: "w", s: { d: [1, 4] } },
            { t: "w" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "o", s: { d: [3, 6] } },
            { t: "t" },
            { t: "t" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "o", s: { d: [3, 6] } },
            { t: "t" },
            { t: "t" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", s: { d: [3, 6] }, r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "t" },
            { t: "t" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "w" },
            { t: "w" },
            { t: "w", s: { d: [3, 6] } },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o", d: 1, st: { sh: "l2", s: "f" } },
            { t: "o" },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 3, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
          ], [
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o" },
            { t: "o" },
          ],
        ]
      end
    end
  end
end
