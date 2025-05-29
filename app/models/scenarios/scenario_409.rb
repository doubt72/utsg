# frozen_string_literal: true

module Scenarios
  class Scenario409 < Base
    ID = "409"
    NAME = "The Last Track"
    ALLIES = ["aus"].freeze
    AXIS = ["jap"].freeze
    STATUS = "p"

    DATE = [1942, 11, 4].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          :uk_leader_5_1,
          [2, :uk_leader_4_1],
          [10, :uk_line_s],
          [3, :uk_vickers_mg],
          [2, :uk_ml_3inch_mortar],
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :jap_leader_5_1,
          :jap_leader_4_1,
          [6, :jap_b_division_s],
          [2, :jap_crew_t],
          [2, :jap_type_92_hmg],
          [2, :jap_70mm_type_92],
          [4, :bunker],
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
          location: "Oivi, Papua New Guinea",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "The Battle of Oivi–Gorari marked the final major engagement of the
          Kokoda Track Campaign, as Australian forces launched a coordinated
          offensive to destroy the last organized Japanese defenses inland
          from the Papuan coast. The Japanese had entrenched themselves at
          Oivi, a strong defensive position situated along the Kokoda Track.
          There, they constructed a complex of well-dug bunkers, foxholes, and
          machine-gun nests, taking full advantage of the dense jungle, steep
          ridges, and natural choke points. The Australians, having regained
          Kokoda days earlier, faced a determined enemy willing to fight to
          the death to delay their advance.",

          "The fighting at Oivi was intense and grueling.  Australian troops
          from the 16th and 25th Brigades launched repeated frontal attacks
          into thick, well-defended jungle terrain, coming under heavy fire
          and suffering mounting casualties.  The Japanese resisted fiercely,
          but eventually the Australians executing a wide flanking maneuver to
          the east, targeting Gorari, a key position behind the Japanese
          lines.  As the Australians broke through at Gorari and threatened
          encirclement, the Japanese position at Oivi became untenable.  Under
          heavy pressure, the Japanese began a chaotic retreat, suffering
          devastating losses in the withdrawal across the flood-swollen Kumusi
          River.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [0, 6, false],
          hexes:,
          layout:,
          allied_edge: "r",
          axis_edge: "l",
          victory_hexes: [
            [3, 3, 2], [7, 5, 2], [11, 5, 2], [12, 2, 2], [12, 8, 2],
          ],
          allied_setup: { "0" => [["0-2", "*"]] },
          axis_setup: { "0" => [["4-14", "*"]] },
          base_terrain: "g",
        }
      end

      def hexes
        [
          [
            { t: "o" },
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "o" },
            { t: "j" },
          ], [
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "o" },
            { t: "j" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "p" },
            { t: "o" },
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "j" },
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "o" },
            { t: "j" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "p" },
            { t: "p" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "j" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4, 5], c: "r" } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "j" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "p" },
            { t: "p" },
            { t: "o", r: { d: [2, 6], c: "l", t: "p" } },
            { t: "p" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "p" },
            { t: "p" },
            { t: "o" },
            { t: "o" },
            { t: "p" },
            { t: "p" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], c: "r", t: "p" } },
            { t: "o" },
            { t: "o" },
            { t: "j" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "o" },
            { t: "p" },
            { t: "p" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l2", s: "f" } },
            { t: "o" },
            { t: "j" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "j" },
            { t: "o" },
            { t: "j" },
            { t: "o" },
            { t: "o" },
            { t: "j" },
            { t: "j" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
          ],
        ]
      end
    end
  end
end
