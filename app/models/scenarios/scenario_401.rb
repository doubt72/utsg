# frozen_string_literal: true

module Scenarios
  class Scenario401 < Base
    ID = "401"
    NAME = "Fields of Lyte"
    ALLIES = ["usa"].freeze
    AXIS = ["jap"].freeze
    STATUS = "p"

    DATE = [1944, 10, 31].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          :usa_leader_5_1,
          :usa_leader_4_1,
          [8, :usa_rifle_s],
          [2, :usa_m1919_browning],
          :usa_radio_105mm,
          :usa_m4_sherman,
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :jap_leader_5_1,
          :jap_leader_4_1,
          [6, :jap_b_division_s],
          :jap_crew_t,
          [2, :jap_type_92_hmg],
          :jap_70mm_type_92,
        ],
      },
    }.freeze

    class << self
      def generate
        {
          turns: 6,
          first_deploy: 2,
          first_action: 1,
          date:,
          location: "Lyte Island, Philippines",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "After crossing the rugged central mountains of Leyte in late
          October 1944, X Corps, particularly the 1st Cavalry Division and
          24th Infantry Division, emerged into the more open terrain of the Leyte
          Valley plains. The transition from jungle-covered ridges to flat
          rice paddies and road networks allowed for greater mobility, but
          also exposed U.S. forces to concentrated Japanese resistance,
          especially near strategic towns such as Carigara in the north. The
          Japanese, having reinforced their positions with units from the 16th
          and 26th Divisions, launched a series of counterattacks in an effort
          to stall the American advance and protect their remaining footholds
          on the island.",

          "Despite fierce opposition, and torrential rains that could turn the
          plains into a sea of mud, X Corps steadily pushed forward. U.S.
          forces engaged in intense fighting to seize road junctions, bridges,
          and supply routes, often under fire from well-concealed Japanese
          positions and enduring banzai charges and artillery bombardments.
          The culmination of the campaign in the valley came with the capture
          of Carigara on November 2, 1944, effectively cutting off Japanese
          reinforcements from the north and collapsing organized resistance in
          the Leyte Valley.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [2, 2],
          wind: [0, 3, false],
          hexes:,
          layout:,
          allied_dir: 1,
          axis_dir: 4,
          victory_hexes: [
            [12, 2, 2], [11, 8, 2], [9, 4, 2], [8, 7, 2], [2, 4, 2],
          ],
          allied_setup: { "0" => [["13-14", "*"]] },
          axis_setup: { "0" => [["0-11", "*"]] },
          base_terrain: "g",
        }
      end

      def hexes
        [
          [
            { t: "o", s: { d: [1, 4] } },
            { t: "o", s: { d: [1, 4] } },
            { t: "o", s: { d: [1, 4] } },
            { t: "o", s: { d: [1, 4] } },
            { t: "o", s: { d: [1, 5] } },
            { t: "m" },
            { t: "o", s: { d: [3, 5] } },
            { t: "o" },
            { t: "p" },
            { t: "p" },
            { t: "p" },
            { t: "p" },
            { t: "p" },
            { t: "p" },
            { t: "p" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", s: { d: [2, 5] } },
            { t: "m" },
            { t: "o", s: { d: [2, 5] } },
            { t: "o" },
            { t: "p" },
            { t: "p" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "p" },
            { t: "p" },
            { t: "p" },
            { t: "p" },
            { t: "o" },
            { t: "o", s: { d: [2, 4] } },
            { t: "o", s: { d: [1, 4] } },
            { t: "o", s: { d: [1, 2] } },
            { t: "o" },
            { t: "p" },
            { t: "o" },
            { t: "p" },
            { t: "o", r: { d: [4, 6] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
          ], [
            { t: "p" },
            { t: "p" },
            { t: "p" },
            { t: "p" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "p" },
            { t: "p" },
            { t: "o", r: { d: [4, 6] } },
            { t: "o", r: { d: [1, 3] } },
            { t: "p" },
            { t: "o" },
            { t: "p" },
          ], [
            { t: "p" },
            { t: "p" },
            { t: "o", d: 1.5, st: { sh: "l2", s: "f" } },
            { t: "p" },
            { t: "p" },
            { t: "p" },
            { t: "p" },
            { t: "o" },
            { t: "p" },
            { t: "o", d: 3, st: { sh: "l2", s: "f" } },
            { t: "o", r: { d: [3, 6] } },
            { t: "p" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "p" },
            { t: "o" },
            { t: "p" },
            { t: "p" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "p" },
            { t: "o" },
            { t: "p" },
          ], [
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "p" },
            { t: "p" },
            { t: "p" },
            { t: "p" },
            { t: "o" },
            { t: "p" },
            { t: "p" },
            { t: "o", r: { d: [3, 6] } },
            { t: "p" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "p" },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 3, 5] } },
            { t: "p" },
            { t: "p" },
            { t: "p" },
            { t: "o" },
            { t: "p" },
            { t: "p" },
          ], [
            { t: "p" },
            { t: "p" },
            { t: "o" },
            { t: "p" },
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", d: 1, st: { sh: "s2", s: "u" } },
            { t: "o", d: 4, st: { sh: "s2", s: "u" } },
            { t: "o" },
            { t: "p" },
          ], [
            { t: "p" },
            { t: "p" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o" },
            { t: "p" },
            { t: "o" },
            { t: "p" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "p" },
            { t: "p" },
            { t: "p" },
            { t: "o" },
            { t: "p" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "p" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "p" },
          ],
        ]
      end
    end
  end
end
