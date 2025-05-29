# frozen_string_literal: true

module Scenarios
  class Scenario402 < Base
    ID = "402"
    NAME = "Withdrawal by Measures"
    ALLIES = ["aus"].freeze
    AXIS = ["jap"].freeze
    STATUS = "p"

    DATE = [1942, 9, 1].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          :uk_leader_4_1,
          :uk_leader_3_1,
          [8, :uk_territorial_s],
          :uk_vickers_mg,
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :jap_leader_5_1,
          [5, :jap_b_division_s],
          :jap_type_92_hmg,
        ],
      },
      "2": {
        list: [
          :jap_leader_4_1,
          [2, :jap_b_division_s],
          :jap_type_92_hmg,
        ],
      },
      "3": {
        list: [
          :jap_leader_4_1,
          [2, :jap_b_division_s],
        ],
      },
      "4": {
        list: [
          [2, :jap_b_division_s],
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
          location: "Eora, Papua New Guinea",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "After being pushed back from Kokoda earlier in the month, and
          coming in the aftermath of the fighting around Isurava, an
          engagement around Eora was fought as the Australians attempted to
          disengage from the Japanese pursuit.  The heavily depleted Australian
          39th Infantry Battalion successfully delayed two battalions from the
          Japanese 41st Infantry Regiment.  This subsequently allowed the
          Australians to fall back further towards Efogi.",

          "The Australians covered the withdrawal from Isurava (and
          particularly, the wounded from the battle) toward Eora Village from
          a series of positions between Alola and Eora Village. They withdrew
          from the last of these, about halfway between the two localities, on
          the early morning of the 1st of September.  The rearguard from this
          position was closely pursued as it retired toward Eora Village.
          Arriving around mid-day on the 1st of September, the Australians
          adopted a defensive position on a bald spur on the southern side of
          the creek that overlooked the crossing and village.  While the
          Japanese advanced, two companies attempted a flanking move from the
          east.  These attackers, having not been previously engaged during
          the campaign, were somewhat cautious in approaching the Australian
          position.  Nonetheless, the Australians were aggressively probed
          through the night.  The battalion held until the designated time to
          disengage at 6AM the next morning and then withdrew through the
          reserve to a position on a high point of the track about 1km north
          of Templeton's Crossing.",
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
          allied_edge: "r",
          axis_edge: "l",
          victory_hexes: [
            [2, 5, 1], [4, 8, 1], [6, 4, 1], [8, 6, 1], [10, 4, 1],
          ],
          allied_setup: { "0" => [["*", "3-10"]] },
          axis_setup: {
            "0" => [["*", "0-1"]],
            "2" => [[0, "*"]],
            "4" => [[14, "0-5"]],
            "5" => [[0, "*"]],
          },
          base_terrain: "g",
          night: true,
        }
      end

      def hexes
        Utility::Scenario::Maps::EORA
      end
    end
  end
end
