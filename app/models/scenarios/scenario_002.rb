# frozen_string_literal: true

module Scenarios
  class Scenario002 < Base
    ID = "002"
    NAME = "Block by Block"
    ALLIES = ["ussr"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    DATE = [1942, 8, 23].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": { list: [
        :ussr_leader_5_1,
        :ussr_leader_4_1,
        :ussr_leader_3_1,
        [7, :ussr_rifle_s],
        [2, :ussr_smg_s],
        [3, :ussr_dp_27],
        [6, :ussr_mc],
        :sniper3,
      ] },
    }.freeze

    AXIS_UNITS = {
      "0": { list: [
        :ger_leader_6_2,
        [2, :ger_leader_5_1],
        [2, :ger_pionier_s],
        [8, :ger_rifle_s],
        [3, :ger_mg_42],
        :ger_ft,
        [2, :ger_sc],
      ] },
    }.freeze

    class << self
      def generate
        {
          turns: 8,
          first_setup: 1,
          first_move: 2,
          date:,
          location: "Stalingrad, Russia",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "On the 23rd of August 1942, the German 6th Army reached the
          outskirts of Stalingrad in pursuit of the Soviet 62nd and 64th
          Armies, which fell back into the city itself.  Recognizing the
          danger of having the Volga cut in two, the Soviets rushed all
          available troops to the east bank of the Volga, some from as far
          away as Siberia.  The Luftwaffe had begun bombing the city, and in
          particular took measures to try and prevent reinforcements from
          crossing the river, bombing river ferries and troop transports.",
          "The 6th Army began fighting its way into the city against
          stiffening resistance, fighting through houses and apartments,
          advancing house-to-house, room-to-room on its way to eventually
          reaching the Dzershinszky Tractor Factory where fighting would
          continue for months.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [1, 4, false],
          hexes:,
          layout:,
          allied_dir: 1,
          axis_dir: 4,
          victory_hexes: [
            [3, 1, 2], [4, 6, 2], [7, 5, 1], [7, 1, 1], [7, 9, 1], [10, 3, 1], [10, 7, 1],
          ],
          allied_setup: { "0": [
            [5, "*"], [6, "*"], [7, "*"], [8, "*"], [9, "*"],
            [10, "*"], [11, "*"], [12, "*"], [13, "*"], [14, "*"],
          ] },
          axis_setup: { "0": [
            [0, "*"], [1, "*"], [2, "*"], [3, "*"], [4, "*"],
          ] },
          base_terrain: "u",
        }
      end

      def hexes
        [
          [
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 2, st: { sh: "s" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 5, st: { sh: "s" } },
            { t: "d", d: 2 },
            { t: "o", d: 2, st: { sh: "s" } },
            { t: "o", r: { d: [2, 4], t: "t" } },
            { t: "o", r: { d: [1, 2, 6], t: "t", c: "l" } },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 2, st: { sh: "m" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "s" } },
            { t: "d", d: 2 },
            { t: "o", d: 2, st: { sh: "m" } },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
          ], [
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 5, st: { sh: "s" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 5, st: { sh: "m" } },
            { t: "d", d: 2 },
            { t: "o", d: 5, st: { sh: "s" } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l" } },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o" },
          ], [
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 2, 5], t: "t" } },
            { t: "o", d: 5, st: { sh: "s" } },
            { t: "d", d: 2 },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
          ], [
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 2, st: { sh: "s" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "s" } },
            { t: "d", d: 2 },
            { t: "o", r: { d: [2, 4, 6], t: "t", c: "l" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
          ], [
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 2, st: { sh: "m" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 5, st: { sh: "m" } },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
          ], [
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 5, st: { sh: "s" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 5, st: { sh: "s" } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l" } },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o" },
          ], [
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 2, 5], t: "t" } },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
          ], [
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 2, st: { sh: "s" } },
            { t: "o", r: { d: [2, 4], t: "t" } },
            { t: "o", r: { d: [1, 2, 4, 6], t: "t", c: "l" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 2, st: { sh: "m" } },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
          ], [
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 5, st: { sh: "s" } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l" } },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
          ],
        ]
      end
    end
  end
end
