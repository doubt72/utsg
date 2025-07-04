# frozen_string_literal: true

module Scenarios
  class Scenario408 < Base
    ID = "408"
    NAME = "Operation Landcrab"
    ALLIES = ["usa"].freeze
    AXIS = ["jap"].freeze
    STATUS = "p"

    DATE = [1943, 5, 18].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          :usa_leader_5_1,
          :usa_leader_4_1,
          [6, :usa_rifle_s],
          [4, :usa_rifle_t],
          [2, :usa_m2_browning],
          [2, :usa_m1_mortar],
          :usa_radio_105mm,
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :jap_leader_4_1,
          [4, :jap_b_division_s],
          [3, :jap_b_division_t],
          [2, :jap_type_92_hmg],
          :jap_70mm_type_92,
          :jap_radio_7_5cm,
          [2, :bunker],
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
          location: "Attu Island, Alaska",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "Operation Landcrab was the U.S. military assault on Attu Island in
          the Aleutian chain, launched on May 11, 1943.  It was part of the
          Aleutian Islands Campaign aimed at reclaiming American territory
          seized by the Japanese in 1942.  Attu and nearby Kiska were the only
          parts of the continental United States occupied by enemy forces
          during the war. The operation involved approximately 11,000 U.S.
          Army troops, primarily from the 7th Infantry Division, who landed on
          the island expecting light resistance.  Instead, they encountered
          harsh weather, rugged terrain, and fierce Japanese opposition
          entrenched in mountainous positions.",

          "The battle lasted nearly three weeks and was marked by brutal
          close-quarters combat, freezing temperatures, and supply challenges.
          The Japanese defenders, numbering around 2,300, fought fanatically,
          culminating in a massive banzai charge on May 29 that resulted in
          the deaths of most of the remaining enemy troops.  Fewer than 30
          Japanese soldiers were taken prisoner.  American forces suffered over
          3,800 casualties, including more than 500 killed, many from exposure
          and disease.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [2, 3],
          wind: [2, 6, true],
          hexes:,
          layout:,
          allied_dir: 4,
          axis_dir: 1,
          victory_hexes: [
            [2, 5, 1], [12, 2, 2], [12, 4, 2], [12, 6, 2], [12, 8, 2],
          ],
          allied_setup: { "0" => [["0-3", "*"]] },
          axis_setup: { "0" => [["12-14", "*"]] },
          base_terrain: "s",
        }
      end

      def hexes
        [
          [
            { t: "o", h: -1 },
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
            { t: "o", s: { d: [3, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", h: -1 },
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
            { t: "o", s: { d: [2, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", h: -1 },
            { t: "o", h: -1 },
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
            { t: "o", s: { d: [3, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", h: -1 },
            { t: "o", h: -1 },
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
            { t: "o", s: { d: [2, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", h: -1 },
            { t: "o", h: -1 },
            { t: "o", s: { d: [2, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", s: { d: [3, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", h: -1 },
            { t: "o", h: -1 },
            { t: "o", s: { d: [2, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", s: { d: [2, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", h: -1 },
            { t: "o" },
            { t: "o", s: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", s: { d: [3, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", h: -1 },
            { t: "o", h: -1 },
            { t: "o", h: -1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", s: { d: [2, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", h: -1 },
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
            { t: "o", s: { d: [3, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", h: -1 },
            { t: "o", h: -1 },
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
            { t: "o", s: { d: [2, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", h: -1 },
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
            { t: "o", s: { d: [3, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
          ],
        ]
      end
    end
  end
end
