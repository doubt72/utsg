# frozen_string_literal: true

module Scenarios
  class Scenario201 < Base
    ID = "201"
    NAME = "Sicilian Crucible"
    ALLIES = ["usa"].freeze
    AXIS = ["ita"].freeze
    STATUS = "p"

    DATE = [1943, 7, 31].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          :usa_leader_5_1,
          [2, :usa_leader_4_1],
          [8, :usa_rifle_s],
          [2, :usa_m1918_bar],
          :usa_m2_mortar,
          :usa_radio_155mm,
          :usa_m3a1_scout_car,
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          [2, :ita_leader_5_1],
          [4, :ita_fucilieri_s],
          [2, :ita_fucilieri_t],
          [2, :ita_breda_m37],
          :ita_brixia_m35,
          :ita_obice_da_100_17,
          [2, :pillbox],
        ],
      },
    }.freeze

    class << self
      def generate
        {
          turns: 7,
          first_deploy: 2,
          first_action: 1,
          date:,
          location: "Troina, Sicily",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "After 20 days of combat, it was clear to both the Allied and German
          high commands that Sicily was lost and the American and British
          troops would break through the Etna Line.  Troina was considered one
          of the main anchors of the Line, and the US 1st and 9th Infantry
          Divisions were ordered to move into the valley to attack the city.
          It was defended by the 15th Panzer Grenadier Division and the
          Italian 28th Infantry Division Aosta. The Axis forces, in deep
          trenches, had a clear view of the oncoming Allied soldiers, who had
          little cover.",
          "The battle began when the Germans repelled an advance by the 39th
          Infantry, a 9th Infantry Division formation temporarily attached to
          the 1st Infantry Division.  This setback forced the Americans to
          orchestrate a massive assault.  Over the next six days the men of
          the 1st Infantry Division, together with elements of the 9th
          Division, a French Moroccan infantry battalion, 165 artillery
          pieces, and numerous Allied aircraft were locked in combat with
          Troina's tenacious defenders.  Control of key hilltop positions
          changed hands often, with the Germans and Italians launching more
          than two dozen counterattacks during the week-long battle.",
        ]
      end

      def map_data
        {
          hexes:,
          layout:,
          allied_dir: 2.5,
          axis_dir: 5.5,
          victory_hexes: [
            [1, 4, 2], [4, 1, 2], [7, 6, 2], [11, 2, 2], [13, 6, 2],
          ],
          allied_setup: { "0" => [["*", "8-10"]] },
          axis_setup: { "0" => [["*", "0-4"], ["0-1", "5-6"], [10, 5]] },
          base_terrain: "g",
        }
      end

      def hexes
        [
          [
            { t: "o", h: 5 },
            { t: "o", h: 5 },
            { t: "o", h: 4 },
            { t: "o", h: 4, r: { d: [2, 4] } },
            { t: "o", h: 4, r: { d: [1, 5] } },
            { t: "o", h: 4 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2, r: { d: [3, 6] } },
          ], [
            { t: "o", h: 5 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4, r: { d: [4, 6] } },
            { t: "o", h: 4, r: { d: [1, 2, 4] } },
            { t: "o", h: 3, r: { d: [1, 4] } },
            { t: "o", h: 3, r: { d: [1, 4] } },
            { t: "o", h: 3, r: { d: [1, 4] } },
            { t: "o", h: 3, r: { d: [1, 4] } },
            { t: "o", h: 3, r: { d: [1, 4] } },
            { t: "o", h: 3, r: { d: [1, 4] } },
            { t: "o", h: 3, r: { d: [1, 5] } },
            { t: "o", h: 2 },
            { t: "o", h: 2, r: { d: [3, 6] } },
            { t: "o", h: 1 },
          ], [
            { t: "o", h: 5 },
            { t: "o", h: 4 },
            { t: "o", h: 4, d: 3, st: { sh: "l", s: "f" } },
            { t: "o", h: 4, r: { d: [3, 6] } },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "r", h: 2 },
            { t: "r", h: 2 },
            { t: "r", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 3 },
            { t: "o", h: 3, d: 1, st: { sh: "l", s: "f" } },
            { t: "o", h: 3, r: { d: [2, 5] } },
            { t: "o", h: 2, r: { d: [3, 5] } },
            { t: "o", h: 1 },
          ], [
            { t: "o", h: 5, b: "c", be: [5] },
            { t: "o", h: 4, r: { d: [6, 4] } },
            { t: "o", h: 4, r: { d: [1, 3] } },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 3 },
            { t: "d", d: 1, h: 4 },
            { t: "d", d: 1, h: 4 },
            { t: "o", h: 3, r: { d: [2, 4, 5] } },
            { t: "o", h: 2, r: { d: [1, 2] } },
            { t: "o", h: 1 },
          ], [
            { t: "o", h: 5, r: { d: [1, 5] } },
            { t: "o", h: 4, r: { d: [6, 3] } },
            { t: "o", h: 4 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 3 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "r", h: 3 },
            { t: "o", h: 2, r: { d: [2, 6] } },
            { t: "o", h: 1 },
          ], [
            { t: "o", h: 5, r: { d: [2, 3] } },
            { t: "o", h: 5, b: "c", be: [2, 3] },
            { t: "o", h: 4 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "d", d: 3, h: 1 },
            { t: "o", h: 1, r: { d: [4, 6] } },
            { t: "o", h: 2, r: { d: [1, 5] } },
            { t: "o", h: 3 },
            { t: "o", h: 4 },
            { t: "r", h: 3 },
            { t: "o", h: 2, r: { d: [3, 5] } },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
          ], [
            { t: "o", h: 5 },
            { t: "o", h: 5 },
            { t: "o", h: 4 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "d", d: 3, h: 1 },
            { t: "o", r: { d: [3, 6] } },
            { t: "o", h: 1 },
            { t: "o", h: 2, r: { d: [2, 5] } },
            { t: "r", h: 3 },
            { t: "r", h: 3 },
            { t: "o", h: 2, r: { d: [4, 6] } },
            { t: "o", h: 2, r: { d: [1, 2, 5] } },
            { t: "o", h: 1 },
          ], [
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "d", d: 3, h: 1 },
            { t: "o", r: { d: [3, 6] } },
            { t: "b" },
            { t: "o", h: 1 },
            { t: "o", h: 2, r: { d: [2, 4] } },
            { t: "o", h: 2, r: { d: [1, 4] } },
            { t: "o", h: 2, r: { d: [1, 3] } },
            { t: "o", h: 1 },
            { t: "o", h: 1, r: { d: [2, 5] } },
            { t: "o", h: 1 },
          ], [
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 4 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", r: { d: [3, 6] } },
            { t: "b" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o", h: 1, r: { d: [2, 6] } },
          ], [
            { t: "o", h: 2 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", r: { d: [3, 5] } },
            { t: "b" },
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o", h: 1 },
          ], [
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", r: { d: [2, 5] } },
            { t: "b" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o", h: 1 },
          ],
        ]
      end
    end
  end
end
