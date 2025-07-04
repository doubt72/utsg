# frozen_string_literal: true

module Scenarios
  class Scenario601 < Base
    ID = "601"
    NAME = "None Shall Pass"
    ALLIES = ["chi"].freeze
    AXIS = ["jap"].freeze
    STATUS = "p"

    DATE = [1939, 5, 13].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          :chi_leader_4_1,
          [5, :chi_regular_s],
          :chi_regular_t,
          :chi_type_24_maxim,
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :jap_leader_5_1,
          [6, :jap_b_division_s],
          [2, :jap_b_division_t],
          [2, :jap_type_96_lmg],
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
          location: "Tongbai, China",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "The Defense of Tongbai occurred during the Battle of
          Suixian-Zaoyang in the Second Sino-Japanese War.  Japanese forces
          attempted a two-pronged offensive to encircle Chinese troops and
          capture strategic towns in northern Hubei.  While they seized
          Zaoyang, their advance stalled in the Tongbai Mountains, where
          Chinese troops used the rugged terrain to mount a determined
          defense.",

          "Chinese forces successfully disrupted the Japanese attack,
          preventing their forces from linking up.  Reinforcements then
          launched counterattacks across the Hanshui River, striking Japanese
          flanks. By May 20, Chinese forces had retaken the lost ground,
          turning the tide of the battle to restore the pre-battle status quo,
          and marking one of the first successful large-scale Chinese
          counteroffensives of the war.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [0, 1, false],
          hexes:,
          layout:,
          allied_dir: 2.5,
          axis_dir: 5.5,
          victory_hexes: [
            [6, 3, 1], [5, 5, 1], [8, 6, 1], [2, 7, 1], [7, 8, 1],
          ],
          allied_setup: { "0" => [["*", "4-10"]] },
          axis_setup: { "0" => [["*", "0-2"]] },
          base_terrain: "g",
        }
      end

      def hexes
        [
          [
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "f" },
            { t: "f" },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1, r: { d: [3, 6], t: "p" } },
          ], [
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "f" },
            { t: "f" },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1, r: { d: [3, 6], t: "p" } },
            { t: "f", h: 1 },
          ], [
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [3, 5] } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "o", h: 1, r: { d: [3, 6], t: "p" } },
            { t: "f", h: 1 },
          ], [
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [2, 5, 6] } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "o", h: 1, r: { d: [3, 6], t: "p" } },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
          ], [
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [4, 6] } },
            { t: "o", r: { d: [1, 3] } },
            { t: "o", r: { d: [2, 5] } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f", h: 1 },
            { t: "f", h: 1, r: { d: [3, 6], t: "p" } },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
          ], [
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o", d: 3, st: { sh: "l2", s: "f" } },
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f", h: 1, r: { d: [3, 6], t: "p" } },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
          ], [
            { t: "f", h: 1 },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "f" },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o", r: { d: [2, 4, 6] } },
            { t: "f", r: { d: [1, 4], t: "p" } },
            { t: "f", r: { d: [1, 4], t: "p" } },
            { t: "f", r: { d: [1, 3], t: "p" } },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "o", d: 1, st: { sh: "h", s: "f" } },
            { t: "o", r: { d: [3, 6] } },
            { t: "f" },
            { t: "f", h: 1 },
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
          ], [
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 3] } },
            { t: "f" },
            { t: "f", h: 1 },
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "f" },
            { t: "f" },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f", h: 1 },
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o", d: 3, st: { sh: "h", s: "f" } },
            { t: "f" },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
          ],
        ]
      end
    end
  end
end
