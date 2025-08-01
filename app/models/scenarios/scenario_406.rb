# frozen_string_literal: true

module Scenarios
  class Scenario406 < Base
    ID = "406"
    NAME = "Butcher's Atoll"
    ALLIES = ["usa"].freeze
    AXIS = ["jap"].freeze
    STATUS = "p"

    DATE = [1943, 11, 20].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          :usa_leader_6_2,
          :usa_leader_5_1,
          [2, :usa_leader_4_1],
          [8, :usa_marine_rifle_s],
          [4, :usa_marine_rifle_t],
          [4, :usa_m1918_bar],
          :usa_radio_8inch,
          [2, :usa_lvt_1],
          :usa_lvt_2,
        ],
      },
      "2": {
        list: [
          :usa_leader_5_1,
          [2, :usa_marine_rifle_s],
          [2, :usa_marine_rifle_t],
          [2, :usa_m1918_bar],
          [3, :usa_lvt_1],
          :usa_lvt_2,
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          [3, :jap_leader_4_1],
          [8, :jap_snlf_s],
          [4, :jap_snlf_t],
          [2, :jap_crew_t],
          [4, :jap_type_92_hmg],
          [2, :jap_70mm_type_92],
          [5, :bunker],
        ],
      },
    }.freeze

    class << self
      def generate
        {
          turns: 6,
          first_deploy: 1,
          first_action: 1,
          date:,
          location: "Tarawa, Gilbert Islands",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "Part of Operation Galvanic, The landings at Tarawa Atoll,
          specifically on Betio Island, were the first major American
          amphibious assault in the central Pacific.  U.S. Marines of the 2nd
          Marine Division approached under cover of naval and aerial
          bombardment but the preparatory shelling failed to neutralize the
          heavily fortified Japanese defenses. Compounding the challenge, many
          landing craft became stuck on coral reefs due to miscalculated
          tides, forcing Marines to wade hundreds of yards under heavy machine
          gun and mortar fire to reach the beach. Japanese forces, dug into
          bunkers, pillboxes, and trenches, unleashed a relentless barrage,
          resulting in catastrophic Marine casualties within the first few
          hours of the assault.",

          "Despite the chaos and carnage, the Marines gradually pushed inland
          through intense, close-quarters combat.  Over the next three days,
          they engaged in a brutal battle against a determined enemy willing
          to fight to the death.  Reinforcements and tanks eventually helped
          turn the tide, but progress remained slow and costly.  By the end of
          the 76-hour battle, nearly all of the approximately 4,500 Japanese
          defenders had been killed, along with over 1,000 Marines and Navy
          personnel. The landings at Tarawa were a harsh lesson in amphibious
          warfare, exposing flaws in planning and logistics, but they also
          marked a turning point, proving that the U.S. could seize heavily
          defended islands and paving the way for future Pacific offensives.",
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
          allied_dir: 6,
          axis_dir: 3,
          victory_hexes: [
            [4, 2, 2], [7, 4, 2], [10, 4, 1], [0, 7, 2], [7, 7, 2], [9, 8, 2], [12, 8, 2],
          ],
          allied_setup: {
            "0" => [
              ["*", "0-1"], ["5-14", 2], ["7-14", 3], ["8-14", 4], ["10-14", 5],
              ["11-14", "6-7"], ["13-14", "8-9"],
            ],
            "2" => [["6-14", 0]],
          },
          axis_setup: {
            "0" => [
              ["*", 10], ["0-12", "8-9"], ["0-10", "6-7"], ["0-9", 5], ["0-7", 4], ["0-6", 3],
              ["0-4", 2],
            ],
          },
          base_terrain: "d",
        }
      end

      def hexes
        [
          [
            { t: "y" },
            { t: "y" },
            { t: "y" },
            { t: "y" },
            { t: "y" },
            { t: "y" },
            { t: "y" },
            { t: "y" },
            { t: "y" },
            { t: "y" },
            { t: "y" },
            { t: "y" },
            { t: "y", r: { d: [3, 6], t: "d" } },
            { t: "y" },
            { t: "y" },
          ], [
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "y" },
            { t: "y" },
            { t: "y" },
            { t: "y" },
            { t: "y" },
            { t: "y" },
            { t: "y", r: { d: [3, 6], t: "d" } },
            { t: "y" },
            { t: "y" },
            { t: "y" },
          ], [
            { t: "o", h: 1 },
            { t: "o", h: 1, d: 1, st: { sh: "l2", s: "f" } },
            { t: "o", h: 1, d: 1, st: { sh: "l2", s: "f" } },
            { t: "o", h: 1 },
            { t: "o", h: 1, d: 2, st: { sh: "l2", s: "f" } },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "y" },
            { t: "y" },
            { t: "y" },
            { t: "y", r: { d: [3, 6], t: "d" } },
            { t: "y" },
            { t: "y" },
            { t: "y" },
          ], [
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1, d: 2, st: { sh: "l2", s: "f" } },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "s" },
            { t: "y" },
            { t: "y" },
            { t: "o", r: { d: [3, 6], t: "d" } },
            { t: "y" },
            { t: "y" },
            { t: "y" },
            { t: "y" },
          ], [
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1, d: 3.5, st: { sh: "l2", s: "f" } },
            { t: "o", h: 1, d: 2, st: { sh: "l2", s: "f" } },
            { t: "s" },
            { t: "s" },
            { t: "o" },
            { t: "s" },
            { t: "y" },
            { t: "y" },
            { t: "y" },
          ], [
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1, d: 1, st: { sh: "h", s: "f" } },
            { t: "o", h: 1, d: 1, st: { sh: "h", s: "f" } },
            { t: "s" },
            { t: "y" },
            { t: "y" },
            { t: "y" },
            { t: "y" },
          ], [
            { t: "o", h: 1, r: { d: [1, 4], t: "a" } },
            { t: "o", h: 1, r: { d: [1, 4], t: "a" } },
            { t: "o", h: 1, r: { d: [1, 4], t: "a" } },
            { t: "o", h: 1, r: { d: [1, 4], t: "a" } },
            { t: "o", h: 1, r: { d: [1, 4], t: "a" } },
            { t: "o", h: 1, r: { d: [1, 4], t: "a" } },
            { t: "o", h: 1, r: { d: [1, 4], t: "a" } },
            { t: "o", h: 1, r: { d: [1, 4], t: "a" } },
            { t: "o", h: 1, r: { d: [1, 4, 5], t: "a" } },
            { t: "o", h: 1, r: { d: [1, 5], t: "a" } },
            { t: "o", h: 1 },
            { t: "s" },
            { t: "y" },
            { t: "y" },
            { t: "y" },
          ], [
            { t: "o", h: 1, d: 1, st: { sh: "h", s: "u" } },
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1, d: 1, st: { sh: "l2", s: "u" } },
            { t: "o", h: 1, r: { d: [2, 5], t: "a" } },
            { t: "o", h: 1, r: { d: [2, 5], t: "a" } },
            { t: "p", h: 1 },
            { t: "s" },
            { t: "s" },
            { t: "y" },
            { t: "y" },
          ], [
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "o", h: 1, r: { d: [2, 4], t: "a" } },
            { t: "o", h: 1, r: { d: [1, 2, 5], t: "a" } },
            { t: "o", h: 1, d: 2, st: { sh: "l2", s: "f" } },
            { t: "o", h: 1, d: 3.5, st: { sh: "l2", s: "f" } },
            { t: "s" },
            { t: "y" },
          ], [
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "o", h: 1, d: 2, st: { sh: "h", s: "u" } },
            { t: "o", h: 1, r: { d: [2, 5], t: "a" } },
            { t: "p", h: 1 },
            { t: "o", h: 1, d: 2, st: { sh: "l2", s: "f" } },
            { t: "s" },
            { t: "s" },
          ], [
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "p", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1, r: { d: [2, 5], t: "a" } },
            { t: "p", h: 1 },
            { t: "o", h: 1, d: 2, st: { sh: "l2", s: "f" } },
            { t: "p", h: 1 },
          ],
        ]
      end
    end
  end
end
