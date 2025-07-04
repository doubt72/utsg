# frozen_string_literal: true

module Scenarios
  class Scenario103 < Base
    ID = "103"
    NAME = "Less Sand than Stone"
    ALLIES = ["uk"].freeze
    AXIS = ["ita"].freeze
    STATUS = "p"

    DATE = [1941, 11, 19].freeze
    LAYOUT = [15, 23, "x"].freeze

    ALLIED_UNITS = {
      "0": { list: [
        :uk_leader_5_2,
        :uk_radio_140mm,
        [6, :uk_crusader_i],
        [2, :uk_humber_lrc],
      ] },
    }.freeze

    AXIS_UNITS = {
      "0": { list: [
        :ita_leader_5_1,
        :ita_leader_3_1,
        [3, :ita_bersaglieri_s],
        [3, :ita_bersaglieri_t],
        [2, :ita_elite_crew_t],
        [2, :ita_breda_30],
        [1, :ita_brixia_m35],
        [2, :ita_cannone_da_47_32],
        [4, :ita_m13_40],
      ] },
    }.freeze

    class << self
      def generate
        {
          turns: 6,
          first_deploy: 1,
          first_action: 2,
          date:,
          location: "Bir el Gubi, Libya",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "During the opening of Operation Crusader, the British
          22nd Armoured Brigade attempted to capture Bir el Gubi, a key
          position in Cyrenaica. The Italian \"Ariete\" Division repelled the
          attack, inflicting heavy casualties and holding their ground,
          resulting in a significant Italian victory.",
          "With their forces unexpectedly tied up with the Italians, only one
          full-strength British armored regiment reached Sidi Rezegh, where it
          was crushed by the Afrika Korps. The defeat marked the failure of
          the initial British move in Crusader, though it later defeated the
          Italian−German forces in a battle of attrition and forced them to
          retreat. The British attacked with Crusader tanks with long-range
          artillery support but no infantry. The \"Ariete\" Division had adopted
          the German practice of tank–infantry coordination while training
          with the Panzer units of the Afrika Korps during the previous months
          and had put it to god use at Bir el Gubi.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [1, 3, false],
          hexes:,
          layout:,
          allied_dir: 1,
          axis_dir: 4,
          victory_hexes: [
            [2, 2, 2], [5, 6, 2], [6, 9, 2], [2, 18, 2], [12, 8, 1],
          ],
          allied_setup: { "0" => [["12-14", "*"]] },
          axis_setup: { "0" => [["0-6", "*"]] },
          base_terrain: "d",
        }
      end

      def hexes
        [
          [
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "p" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "p" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 6], t: "p" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "p" } },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "p" } },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "p" } },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "s" },
            { t: "s" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", h: 1 },
            { t: "s" },
            { t: "s" },
            { t: "o", r: { d: [2, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4, 6], t: "p" } },
            { t: "o", r: { d: [1, 5], t: "p" } },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", h: 1 },
            { t: "s" },
            { t: "s" },
            { t: "o", d: 2, st: { sh: "h", s: "f" } },
            { t: "o", r: { d: [3, 6], t: "p" } },
            { t: "o", h: 1 },
            { t: "o", r: { d: [2, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 5], t: "p" } },
            { t: "b" },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "s" },
            { t: "b" },
            { t: "o", r: { d: [3, 6], t: "p" } },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", r: { d: [2, 4], t: "p" } },
            { t: "o", h: 1, r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
          ], [
            { t: "o", h: 1 },
            { t: "s" },
            { t: "s" },
            { t: "o", r: { d: [3, 5], t: "p" } },
            { t: "b" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "s" },
            { t: "o" },
            { t: "o", r: { d: [2, 6], t: "p" } },
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
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "p" } },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "p" } },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "p" } },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "p" } },
            { t: "o", h: 1 },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 6], t: "p" } },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "p" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "p" } },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "p" } },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "s" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "p" } },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "p" } },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [3, 6], t: "p" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [3, 6], t: "p" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "o" },
            { t: "o" },
          ],
        ]
      end
    end
  end
end
