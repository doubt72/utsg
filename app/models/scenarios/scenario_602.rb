# frozen_string_literal: true

module Scenarios
  class Scenario602 < Base
    ID = "602"
    NAME = "Gates of Imphal"
    ALLIES = ["ind"].freeze
    AXIS = ["jap"].freeze
    STATUS = "p"

    DATE = [1944, 3, 20].freeze
    LAYOUT = [15, 23, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          :uk_leader_4_1,
          [2, :uk_indian_s],
          :uk_indian_t,
          :uk_bren_lmg,
          [4, :uk_m3_lee],
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :jap_leader_6_1,
          [4, :jap_a_division_s],
          [2, :jap_a_division_t],
          [2, :jap_type_99_lmg],
          [4, :jap_type_95_ha_go],
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
          location: "Tamu, Burma",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "On March 20, 1944, during the opening phases of the Battle of
          Imphal, the Indian 20th Division held the strategic town of Tamu
          near the Chindwin River. This position was critical for controlling
          the route into India and served as a vital supply point for the
          Allies.  On that day, six Lee medium tanks of the British 3rd
          Carabiniers engaged six Japanese Type 95 Ha-Go light tanks advancing
          from the south. The Japanese tanks, lighter and less armored, were
          decisively outclassed by the more heavily armed and armored British
          tanks and were all destroyed.",

          "Acting major-general Douglas Gracey was opposed to making any
          retreat, but on 25 March he was ordered to detach some of his
          division to provide a reserve for IV Corps. As this left the
          division too weak to hold Tamu and Moreh, they withdrew to the
          Shenam Saddle, a complex of hills through which the Imphal-Tamu road
          ran. After destroying the supply dump at Moreh, the division fell
          back without difficulty.",
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
          allied_dir: 5.5,
          axis_dir: 2.5,
          victory_hexes: [
            [3, 4, 1], [12, 4, 1], [3, 12, 1], [5, 15, 1], [5, 20, 2],
          ],
          allied_setup: { "0" => [["*", "0-15"]] },
          axis_setup: { "0" => [["*", "17-22"]] },
          base_terrain: "g",
        }
      end

      def hexes
        [
          [
            { t: "g" },
            { t: "g" },
            { t: "j" },
            { t: "o", r: { d: [2, 6] } },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "g" },
            { t: "j" },
            { t: "o", r: { d: [3, 6] } },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
          ], [
            { t: "g" },
            { t: "j" },
            { t: "o", r: { d: [3, 5] } },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
          ], [
            { t: "o" },
            { t: "j" },
            { t: "o", r: { d: [2, 5] } },
            { t: "g" },
            { t: "g" },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", d: 2, st: { sh: "h", s: "f" } },
            { t: "o", r: { d: [2, 4, 5] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", d: 2, st: { sh: "h", s: "f" } },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "o" },
          ], [
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "j" },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "o" },
          ], [
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "j" },
            { t: "o", r: { d: [2, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [2, 5] } },
            { t: "g" },
            { t: "g" },
            { t: "j" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [2, 5] } },
            { t: "g" },
            { t: "j" },
            { t: "o", r: { d: [3, 6] } },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
          ], [
            { t: "g" },
            { t: "o", r: { d: [2, 5] } },
            { t: "j" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "g" },
            { t: "o", r: { d: [2, 5] } },
            { t: "o", r: { d: [3, 5] } },
            { t: "o", d: 2, st: { sh: "h", s: "f" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "g" },
            { t: "g" },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 2, 5] } },
            { t: "j" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o", r: { d: [2, 5] } },
            { t: "j" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "j" },
            { t: "o", d: 1, st: { sh: "h", s: "f" } },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 4, 6] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
          ], [
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o", r: { d: [3, 5] } },
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
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "d", d: 2 },
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
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "d", d: 2 },
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
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "d", d: 2 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "d", d: 2 },
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
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "d", d: 2 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ],
        ]
      end
    end
  end
end
