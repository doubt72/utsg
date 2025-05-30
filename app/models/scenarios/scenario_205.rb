# frozen_string_literal: true

module Scenarios
  class Scenario205 < Base
    ID = "205"
    NAME = "Bloody December"
    ALLIES = ["nz"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    DATE = [1943, 12, 7].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          [3, :uk_leader_4_1],
          [10, :uk_line_s],
          [3, :uk_bren_lmg],
          :uk_radio_152mm,
          :uk_m3a1_scout_car,
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :ger_leader_5_2,
          [6, :ger_rifle_s],
          [2, :ger_mg_42],
          :ger_marder_iii_h_m,
          [2, :wire],
          :at_mines8,
          :bunker,
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
          location: "Orsogna, Italy",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "The Battle of Orsogna was part of the Allied effort to break
          through the German Winter Line defenses.  Located in the mountainous
          Abruzzo region, the town of Orsogna sat on high ground and
          controlled vital road access to the east of the Gustav Line.  The
          battle was led by the New Zealand 2nd Division, part of the British
          Eighth Army, and opposed by well-prepared German troops entrenched
          in fortified positions.",

          "The Allies launched multiple attacks to seize the town and
          surrounding high ground, facing extremely difficult terrain, harsh
          winter weather, and stiff German resistance.  Despite artillery
          support and repeated infantry advances, the New Zealanders were
          unable to dislodge the German defenders.  Urban fighting in Orsogna
          itself was intense, but control of the town shifted only marginally.
          The German forces, using strong defensive tactics and terrain to
          their advantage, managed to hold their positions until the Allied
          focus shifted further south in early 1944. Although ultimately
          unsuccessful, the battle was part of the larger campaign that
          gradually wore down German defenses and contributed to the eventual
          breakthrough toward Rome.",
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
          allied_edge: "r",
          axis_edge: "l",
          victory_hexes: [
            [2, 5, 2], [3, 2, 2], [5, 2, 2], [8, 2, 2], [12, 3, 1],
          ],
          allied_setup: { "0" => [["12-14", "*"]] },
          axis_setup: { "0" => [["0-10", "*"]] },
          base_terrain: "g",
        }
      end

      def hexes
        [
          [
            { t: "o", h: 5 },
            { t: "o", h: 5, r: { d: [2, 5], t: "d" } },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "f", h: 2 },
            { t: "o", h: 2 },
          ], [
            { t: "o", h: 5, d: 2, st: { sh: "l2", s: "f" } },
            { t: "o", h: 5, r: { d: [2, 5], t: "d" } },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "f", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
          ], [
            { t: "o", h: 5 },
            { t: "o", h: 5, d: 2, st: { sh: "l2", s: "f" } },
            { t: "o", h: 5, r: { d: [2, 5], t: "d" } },
            { t: "o", h: 5, d: 4, st: { sh: "l2", s: "f" } },
            { t: "d", h: 5, d: 2.5 },
            { t: "o", h: 5, d: 4, st: { sh: "l2", s: "f" } },
            { t: "d", h: 5, d: 2.5 },
            { t: "o", h: 5, d: 4, st: { sh: "l2", s: "f" } },
            { t: "o", h: 5, d: 4, st: { sh: "l2", s: "f" } },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "f", h: 4 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
          ], [
            { t: "o", h: 5, r: { d: [1, 4], t: "d" } },
            { t: "o", h: 5, r: { d: [1, 4], t: "d" } },
            { t: "o", h: 5, r: { d: [1, 2, 4, 5], t: "d" } },
            { t: "o", h: 5, r: { d: [1, 4], t: "d" } },
            { t: "o", h: 5, r: { d: [1, 4], t: "d" } },
            { t: "o", h: 5, r: { d: [1, 4], t: "d" } },
            { t: "o", h: 5, r: { d: [1, 4], t: "d" } },
            { t: "o", h: 5, r: { d: [1, 4], t: "d" } },
            { t: "o", h: 5, r: { d: [1, 4], t: "d" } },
            { t: "o", h: 5, r: { d: [1, 4], t: "d" } },
            { t: "o", h: 5, r: { d: [1, 4], t: "d" } },
            { t: "o", h: 4, r: { d: [1, 4], t: "d" } },
            { t: "o", h: 4, r: { d: [1, 4], t: "d" } },
            { t: "o", h: 4, r: { d: [1, 4], t: "d" } },
            { t: "o", h: 4, r: { d: [1, 4], t: "d" } },
          ], [
            { t: "o", h: 5 },
            { t: "o", h: 5, d: 1, st: { sh: "l2", s: "f" } },
            { t: "o", h: 5, d: 2, st: { sh: "l2", s: "f" } },
            { t: "o", h: 5, r: { d: [2, 5], t: "d" } },
            { t: "f", h: 4 },
            { t: "f", h: 4 },
            { t: "f", h: 4 },
            { t: "f", h: 4 },
            { t: "f", h: 4 },
            { t: "f", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "d", h: 4, d: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
          ], [
            { t: "o", h: 5, d: 1, st: { sh: "l2", s: "f" } },
            { t: "d", h: 5, d: 2.5 },
            { t: "o", h: 5, d: 2, st: { sh: "l2", s: "f" } },
            { t: "o", h: 5, r: { d: [2, 5], t: "d" } },
            { t: "f", h: 4 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
          ], [
            { t: "o", h: 5, r: { d: [1, 4], t: "d" } },
            { t: "o", h: 5, r: { d: [1, 4], t: "d" } },
            { t: "o", h: 5, r: { d: [1, 4], t: "d" } },
            { t: "o", h: 5, r: { d: [1, 4], t: "d" } },
            { t: "o", h: 5, r: { d: [1, 2], t: "d" } },
            { t: "f", h: 4 },
            { t: "f", h: 3 },
            { t: "f", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
          ], [
            { t: "o", h: 4 },
            { t: "f", h: 4 },
            { t: "f", h: 4 },
            { t: "f", h: 4 },
            { t: "r", h: 4 },
            { t: "r", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
          ], [
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "r", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", h: 2 },
            { t: "r", h: 2 },
            { t: "r", h: 2 },
            { t: "r", h: 2 },
            { t: "r", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
          ], [
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
          ],
        ]
      end
    end
  end
end
