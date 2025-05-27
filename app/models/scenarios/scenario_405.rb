# frozen_string_literal: true

module Scenarios
  class Scenario405 < Base
    ID = "405"
    NAME = "Patrol's End"
    ALLIES = ["usa"].freeze
    AXIS = ["jap"].freeze
    STATUS = "p"

    DATE = [1942, 12, 3].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          :usa_leader_6_2,
          :usa_leader_5_1,
          [8, :usa_marine_rifle_s],
          :usa_m1918_bar,
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :jap_leader_4_1,
          :jap_leader_3_1,
          [6, :jap_b_division_s],
          [2, :jap_type_99_lmg],
        ],
      },
    }.freeze

    class << self
      def generate
        {
          turns: 7,
          first_setup: 2,
          first_move: 1,
          date:,
          location: "Guadalcanal, Solomon Islands",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "Carlson's Long Patrol was a grueling 29-day mission
          conducted by the 2nd Marine Raider Battalion during the Guadalcanal
          campaign. From November to December 1942, just over 200
          Marine Raiders trekked more than 150 miles through dense jungle
          terrain on the island of Guadalcanal. Their objective was to disrupt
          Japanese supply lines, gather intelligence, and harass enemy forces
          operating behind the front lines. Using guerrilla-style tactics, the
          Raiders launched ambushes, conducted hit-and-run attacks, and
          inflicted heavy casualties, reportedly killing over 500 Japanese
          troops while losing only 16 of their own.",

          "On 3 December, having received orders to terminate the patrol,
          Companies C, D, and E headed east towards the Lunga perimeter via
          the Tenaru River while Companies A, B, and F headed west via
          Mount Austen. Companies C, D, and E reached the lower Tenaru and
          entered friendly lines at Lunga Point without incident. Companies A,
          B, and F, however, encountered a Japanese patrol near the summit of
          Mount Austen.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [0, 4, false],
          hexes:,
          layout:,
          allied_edge: "b",
          axis_edge: "t",
          victory_hexes: [
            [5, 2, 2], [5, 4, 2], [8, 4, 2], [6, 5, 2], [8, 8, 1],
          ],
          allied_setup: { "0" => [["*", "8-10"]] },
          axis_setup: { "0" => [["*", "0-6"]] },
          base_terrain: "g",
        }
      end

      def hexes
        [
          [
            { t: "j", h: 3 },
            { t: "j", h: 3 },
            { t: "j", h: 3 },
            { t: "j", h: 3 },
            { t: "o", h: 3, r: { d: [2, 5], t: "p" } },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "p", h: 2 },
            { t: "p", h: 2 },
            { t: "j", h: 2 },
            { t: "j", h: 2 },
            { t: "o", h: 2 },
            { t: "p", h: 2 },
            { t: "p", h: 2 },
          ], [
            { t: "j", h: 3 },
            { t: "j", h: 3 },
            { t: "j", h: 3 },
            { t: "j", h: 4 },
            { t: "o", h: 4, r: { d: [2, 5], t: "p" } },
            { t: "j", h: 3 },
            { t: "j", h: 3 },
            { t: "o", h: 3 },
            { t: "p", h: 3 },
            { t: "j", h: 3 },
            { t: "j", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "p", h: 2 },
            { t: "p", h: 2 },
          ], [
            { t: "j", h: 3 },
            { t: "j", h: 3 },
            { t: "j", h: 3 },
            { t: "j", h: 4 },
            { t: "j", h: 4 },
            { t: "o", h: 4, r: { d: [2, 5], t: "p" } },
            { t: "j", h: 4 },
            { t: "j", h: 4 },
            { t: "j", h: 4 },
            { t: "j", h: 3 },
            { t: "j", h: 3 },
            { t: "o", h: 3 },
            { t: "j", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
          ], [
            { t: "j", h: 3 },
            { t: "j", h: 3 },
            { t: "j", h: 4 },
            { t: "j", h: 4 },
            { t: "j", h: 4 },
            { t: "o", h: 5, r: { d: [2, 5], t: "p" } },
            { t: "j", h: 5 },
            { t: "j", h: 5 },
            { t: "j", h: 4 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
          ], [
            { t: "j", h: 3 },
            { t: "j", h: 3 },
            { t: "j", h: 3 },
            { t: "j", h: 4 },
            { t: "j", h: 4 },
            { t: "j", h: 5 },
            { t: "o", h: 5, r: { d: [2, 5], t: "p" } },
            { t: "j", h: 5 },
            { t: "j", h: 5 },
            { t: "j", h: 4 },
            { t: "j", h: 3 },
            { t: "j", h: 2 },
            { t: "j", h: 2 },
            { t: "j", h: 2 },
            { t: "j", h: 2 },
          ], [
            { t: "j", h: 2 },
            { t: "j", h: 2 },
            { t: "j", h: 3 },
            { t: "j", h: 4 },
            { t: "o", h: 4 },
            { t: "j", h: 5 },
            { t: "o", h: 5, r: { d: [2, 4], t: "p" } },
            { t: "o", h: 5, r: { d: [1, 5], t: "p" } },
            { t: "j", h: 4 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "j", h: 2 },
            { t: "j", h: 2 },
            { t: "j", h: 2 },
          ], [
            { t: "p", h: 2 },
            { t: "p", h: 2 },
            { t: "j", h: 2 },
            { t: "j", h: 3 },
            { t: "j", h: 3 },
            { t: "o", h: 4 },
            { t: "j", h: 4 },
            { t: "j", h: 4 },
            { t: "o", h: 4, r: { d: [2, 6], t: "p" } },
            { t: "j", h: 3 },
            { t: "j", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "j", h: 2 },
            { t: "j", h: 2 },
          ], [
            { t: "j", h: 1, b: "c", be: [2, 3, 4] },
            { t: "p", h: 2 },
            { t: "j", h: 2 },
            { t: "j", h: 3 },
            { t: "j", h: 3 },
            { t: "j", h: 3 },
            { t: "o", h: 3, r: { d: [4, 5], t: "p" } },
            { t: "o", h: 3, r: { d: [1, 3], t: "p" } },
            { t: "j", h: 3 },
            { t: "j", h: 2 },
            { t: "j", h: 2 },
            { t: "j", h: 2 },
            { t: "j", h: 2 },
            { t: "j", h: 2 },
            { t: "j", h: 2 },
          ], [
            { t: "j", h: 1 },
            { t: "j", h: 1, b: "c", be: [3, 4] },
            { t: "p", h: 2, b: "c", be: [5, 6] },
            { t: "p", h: 2, b: "c", be: [5, 6] },
            { t: "p", h: 2, b: "c", be: [5, 6] },
            { t: "j", h: 2, b: "c", be: [5, 6] },
            { t: "j", h: 2, b: "c", be: [5, 6] },
            { t: "o", h: 2, b: "c", be: [5, 6], r: { d: [2, 4], t: "p" } },
            { t: "o", h: 2, r: { d: [1, 5], t: "p" } },
            { t: "j", h: 2 },
            { t: "j", h: 2 },
            { t: "j", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "j", h: 2 },
          ], [
            { t: "j" },
            { t: "j" },
            { t: "o", s: { d: [4, 6] } },
            { t: "o", s: { d: [1, 4] } },
            { t: "o", s: { d: [1, 4] } },
            { t: "o", s: { d: [1, 4] } },
            { t: "o", s: { d: [1, 4] } },
            { t: "p", s: { d: [1, 5] }, b: "c", be: [3, 4] },
            { t: "j", h: 1, r: { d: [2, 5], t: "p" } },
            { t: "j", h: 1 },
            { t: "j", h: 2, b: "c", be: [5, 6] },
            { t: "j", h: 2, b: "c", be: [5, 6] },
            { t: "j", h: 2, b: "c", be: [5, 6] },
            { t: "j", h: 2, b: "c", be: [5, 6] },
            { t: "j", h: 2, b: "c", be: [5, 6] },
          ], [
            { t: "j" },
            { t: "j" },
            { t: "p", s: { d: [3, 6] } },
            { t: "j", h: 2, b: "c", be: [1, 2, 3] },
            { t: "j", h: 2, b: "c", be: [2, 3] },
            { t: "j", h: 2, b: "c", be: [2, 3] },
            { t: "j", h: 2, b: "c", be: [2, 3] },
            { t: "j", h: 2, b: "c", be: [2, 3, 4] },
            { t: "p", s: { d: [2, 6] } },
            { t: "j", h: 1, r: { d: [2, 4], t: "p" } },
            { t: "o", r: { d: [1, 5], t: "p" } },
            { t: "p", s: { d: [4, 6] } },
            { t: "p", s: { d: [1, 4] } },
            { t: "p", s: { d: [1, 4] } },
            { t: "p", s: { d: [1, 4] } },
          ],
        ]
      end
    end
  end
end
