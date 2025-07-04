# frozen_string_literal: true

module Scenarios
  class Scenario411 < Base
    ID = "411"
    NAME = "Breaking Back"
    ALLIES = ["aus"].freeze
    AXIS = ["jap"].freeze
    STATUS = "p"

    DATE = [1942, 10, 22].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          :uk_leader_5_1,
          :uk_leader_4_1,
          [8, :uk_line_s],
          [2, :uk_line_t],
          [2, :uk_vickers_mg],
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :jap_leader_5_1,
          :jap_leader_4_1,
          [4, :jap_b_division_s],
          [2, :jap_b_division_t],
          :jap_crew_t,
          [2, :jap_type_92_hmg],
          :jap_70mm_type_92,
          :pillbox,
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
          "During a series of battles along the Kokoda Track across the Owen
          Stanley Range along the spine of Papua New Guinea in August and
          September, the Japanese force fought the Australians back to near
          the southern end of the Kokoda Track at Ioribaiwa.  Here, in
          mid-September, the Australians finally managed to fight the Japanese
          to a standstill before withdrawing further to Imita Ridge, where
          they established a final defensive line for a last stand.  Before
          this climactic battle could take place, though, the Japanese reached
          the limit of their supply line and the strategic situation elsewhere
          in the Pacific, specifically the defeats around Milne Bay and on
          Guadalcanal, resulted in the tide shifting towards the Australians.
          By late September, the Japanese commander had received orders to
          assume a defensive posture rather than continuing the drive on Port
          Moresby.",

          "By October, the tide had completely turned, and the Australians
          advanced along the Kokoda Track.  A series of actions were
          subsequently fought around the Eora Creek and Templeton's Crossing
          and now the Australians outnumbered the Japanese roughly 2 to 1,
          essentially mirroring the situation during the first battle in the vicinity.",
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
          allied_dir: 2.5,
          axis_dir: 5.5,
          victory_hexes: [
            [2, 5, 2], [6, 4, 2], [8, 6, 2], [11, 5, 2], [13, 2, 2],
          ],
          allied_setup: { "0" => [["*", "9-10"]] },
          axis_setup: { "0" => [["*", "0-7"]] },
          base_terrain: "g",
        }
      end

      def hexes
        Utility::Scenario::Maps::EORA
      end
    end
  end
end
