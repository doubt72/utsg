# frozen_string_literal: true

module Scenarios
  class Scenario203 < Base
    ID = "203"
    NAME = "Little Stalingrad"
    ALLIES = ["can"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    DATE = [1943, 12, 25].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          :uk_leader_5_1,
          [3, :uk_leader_4_1],
          [2, :uk_engineer_s],
          [10, :uk_line_s],
          [4, :uk_bren_lmg],
          [4, :uk_sc],
          :sniper5,
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :ger_leader_6_1,
          :ger_leader_5_1,
          [8, :ger_fallschirmjager_s],
          [4, :ger_mg_42],
          [4, :ger_sc],
          [4, :wire],
          [2, :ap_mines],
          :sniper5,
        ],
      },
    }.freeze

    class << self
      def generate
        {
          turns: 7,
          first_setup: 2,
          first_move: 1,
          date:,
          location: "Ortona, Italy",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "The Battle of Ortona was culmination of the fighting on the
          Adriatic front in Italy during \"Bloody December\" and one of the
          bloodiest urban battles of the Italian campaign in World War II. The
          town of Ortona held strategic value as a port and gateway to the
          German defensive positions on the Gustav Line. Canadian forces of
          the 1st Infantry Division were ordered to capture it from elite
          German Fallschirmjäger troops. The Germans had fortified the town
          extensively, turning it into a deadly urban stronghold with mines,
          booby traps, and strategically rigged buildings. What followed was
          intense, close-quarters combat as the Canadians advanced street by
          street in bitter winter conditions.",

          "Fighting was slow and brutal, with Canadian troops adapting by
          using a tactic called \"mouse-holing\": blasting through walls to
          avoid sniper fire in the open streets. Casualties mounted on both
          sides as soldiers battled through rubble, collapsed buildings, and
          narrow alleys. After over a week of relentless fighting, the Germans
          withdrew. Though small in scale, the ferocity of the combat earned
          the battle the nickname “Little Stalingrad,” and it became one of
          the most iconic and costly engagements fought by Canadian forces in
          World War II.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [1, 3],
          wind: [2, 2, true],
          hexes:,
          layout:,
          allied_edge: "b",
          axis_edge: "t",
          victory_hexes: [
            [3, 2, 2], [13, 2, 2], [9, 3, 2], [3, 5, 2], [8, 6, 2], [3, 8, 1], [12, 8, 1],
          ],
          allied_setup: { "0" => [["*", "8-10"]] },
          axis_setup: { "0" => [["*", "0-6"]] },
          base_terrain: "s",
        }
      end

      def hexes
        [
          [
            { t: "o", d: 1, st: { sh: "s", s: "u" } },
            { t: "d", d: 3 },
            { t: "o", d: 2, st: { sh: "s", s: "u" } },
            { t: "o", d: 5, st: { sh: "s", s: "u" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 1, st: { sh: "s", s: "u" } },
            { t: "o", d: 4, st: { sh: "s", s: "u" } },
            { t: "d", d: 3 },
            { t: "o", d: 1, st: { sh: "s", s: "u" } },
            { t: "o", d: 4, st: { sh: "s", s: "u" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "m2", s: "u" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "s", s: "u" } },
            { t: "o", d: 3, st: { sh: "s", s: "u" } },
          ], [
            { t: "d", d: 3 },
            { t: "o", d: 2, st: { sh: "s", s: "u" } },
            { t: "o", d: 5, st: { sh: "s", s: "u" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 1, st: { sh: "s", s: "u" } },
            { t: "o", d: 4, st: { sh: "s", s: "u" } },
            { t: "d", d: 3 },
            { t: "o", d: 1, st: { sh: "s", s: "u" } },
            { t: "o", d: 4, st: { sh: "s", s: "u" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "s2", s: "u" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "s", s: "u" } },
            { t: "o", d: 6, st: { sh: "s", s: "u" } },
            { t: "d", d: 3 },
          ], [
            { t: "o", d: 2, st: { sh: "s", s: "u" } },
            { t: "o", d: 2, st: { sh: "s", s: "u" } },
            { t: "o", d: 5, st: { sh: "s", s: "u" } },
            { t: "o", r: { d: [3, 4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3, 4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3, 4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4, 5], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
          ], [
            { t: "o", d: 5, st: { sh: "s", s: "u" } },
            { t: "o", d: 5, st: { sh: "s", s: "u" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 1, st: { sh: "s", s: "u" } },
            { t: "o", d: 4, st: { sh: "s", s: "u" } },
            { t: "d", d: 3 },
            { t: "o", d: 1, st: { sh: "s", s: "u" } },
            { t: "o", d: 4, st: { sh: "s", s: "u" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "s2", s: "u" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "b" },
            { t: "b" },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 1, st: { sh: "s", s: "u" } },
          ], [
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3, 5], t: "t" } },
            { t: "o", d: 1, st: { sh: "s", s: "u" } },
            { t: "o", d: 4, st: { sh: "s", s: "u" } },
            { t: "d", d: 3 },
            { t: "o", d: 1, st: { sh: "s", s: "u" } },
            { t: "o", d: 4, st: { sh: "s", s: "u" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "s2", s: "u" } },
            { t: "o", r: { d: [3, 5, 6], t: "t" } },
            { t: "b" },
            { t: "w" },
            { t: "b" },
            { t: "o", r: { d: [2, 4, 6], t: "t" } },
          ], [
            { t: "o", d: 2, st: { sh: "l", s: "u" } },
            { t: "o", d: 2, st: { sh: "l", s: "u" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "l", s: "u" } },
            { t: "d", d: 3 },
            { t: "o", d: 3, st: { sh: "s", s: "u" } },
            { t: "o", d: 3, st: { sh: "l", s: "u" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "s2", s: "u" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "b" },
            { t: "b" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 1, st: { sh: "s", s: "u" } },
          ], [
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "d", d: 3 },
            { t: "o", d: 6, st: { sh: "s", s: "u" } },
            { t: "o", d: 6, st: { sh: "l", s: "u" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "s2", s: "u" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 2, st: { sh: "s", s: "u" } },
            { t: "o", r: { d: [2, 4, 5], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
          ], [
            { t: "o", d: 3, st: { sh: "l", s: "u" } },
            { t: "o", d: 3, st: { sh: "l", s: "u" } },
            { t: "o", d: 3, st: { sh: "l", s: "u" } },
            { t: "o", r: { d: [2, 4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3, 4, 5], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "s", s: "u" } },
            { t: "o", d: 5, st: { sh: "s", s: "u" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "s", s: "u" } },
            { t: "o", d: 2, st: { sh: "s", s: "u" } },
            { t: "d", d: 2 },
          ], [
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "s", s: "u" } },
            { t: "o", d: 3, st: { sh: "s", s: "u" } },
            { t: "o", d: 3, st: { sh: "s", s: "u" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "s2", s: "u" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 5, st: { sh: "s", s: "u" } },
            { t: "o", d: 2, st: { sh: "s", s: "u" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 5, st: { sh: "s", s: "u" } },
            { t: "o", d: 5, st: { sh: "s", s: "u" } },
          ], [
            { t: "o", d: 3, st: { sh: "s", s: "u" } },
            { t: "o", d: 3, st: { sh: "s", s: "u" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "s", s: "u" } },
            { t: "o", d: 6, st: { sh: "s", s: "u" } },
            { t: "o", d: 6, st: { sh: "s", s: "u" } },
            { t: "o", d: 3, st: { sh: "s", s: "u" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "m2", s: "u" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "s", s: "u" } },
            { t: "o", d: 5, st: { sh: "s", s: "u" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "s", s: "u" } },
            { t: "o", d: 2, st: { sh: "s", s: "u" } },
          ], [
            { t: "o", d: 6, st: { sh: "s", s: "u" } },
            { t: "o", d: 6, st: { sh: "s", s: "u" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 1, st: { sh: "s", s: "u" } },
            { t: "o", d: 4, st: { sh: "s", s: "u" } },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "s", s: "u" } },
            { t: "o", d: 3, st: { sh: "s", s: "u" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 5, st: { sh: "s2", s: "u" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 5, st: { sh: "s", s: "u" } },
            { t: "o", d: 2, st: { sh: "s", s: "u" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 5, st: { sh: "s", s: "u" } },
          ],
        ]
      end
    end
  end
end
