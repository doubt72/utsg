# frozen_string_literal: true

module Scenarios
  class Scenario325 < Base
    ID = "325"
    NAME = "Widerstandsnest 73"
    ALLIES = ["usa"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"
    VERSION = "0.1"

    DATE = [1944, 6, 6].freeze
    LAYOUT = [23, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": { list: [
        :usa_leader_6_1,
        [2, :usa_ranger_s],
        :usa_m1918_bar,
      ] },
      "1": { list: [
        :usa_leader_6_1,
        [2, :usa_ranger_s],
      ] },
      "2": { list: [
        [2, :usa_ranger_s],
        :usa_m1918_bar,
      ] },
    }.freeze

    AXIS_UNITS = {
      "0": { list: [
        :ger_leader_3_1,
      ] },
      "3": { list: [
        :ger_leader_4_1,
        [3, :ger_volksgrenadier_s],
        :ger_mg_42,
      ] },
    }.freeze

    INIT_AXIS_UNITS = [
      { data: :bunker, x: 16, y: 3, facing: 3 },
      { data: :bunker, x: 12, y: 3, facing: 3 },
      { data: :bunker, x: 10, y: 3, facing: 3 },
      { data: :bunker, x: 7, y: 1, facing: 3 },
      { data: :bunker, x: 5, y: 1, facing: 3 },
      { data: :ger_elite_crew_t, x: 12, y: 3, facing: 3 },
      { data: :ger_7_5cm_pak_97_38, x: 12, y: 3, facing: 3 },
      { data: :ger_volksgrenadier_t, x: 5, y: 1, facing: 3 },
      { data: :ger_volksgrenadier_t, x: 7, y: 1, facing: 3 },
      { data: :ger_volksgrenadier_t, x: 10, y: 3, facing: 3 },
      { data: :ger_volksgrenadier_t, x: 16, y: 3, facing: 3 },
      { data: :ger_volksgrenadier_t, x: 8, y: 5, facing: 3 },
      { data: :ger_volksgrenadier_t, x: 12, y: 6, facing: 3 },
      { data: :ger_mg_42, x: 5, y: 1, facing: 3 },
      { data: :ger_mg_42, x: 7, y: 1, facing: 3 },
      { data: :ger_mg_42, x: 10, y: 3, facing: 3 },
      { data: :ger_mg_42, x: 16, y: 3, facing: 3 },
      { data: :ger_12cm_grw_42, x: 8, y: 5, facing: 3 },
      { data: :ger_12cm_grw_42, x: 12, y: 6, facing: 3 },
    ].freeze

    class << self
      def generate
        {
          turns: 5,
          first_deploy: 2,
          first_action: 1,
          date:,
          location: "Vierville-sur-Mer, France",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
          init_axis_units:,
        }
      end

      def description
        [
          "On D-Day, the two Ranger companies that were initially tasked with
          the mission to follow up on the Pointe-du-Hoc attack were redirected
          to land to the right of the 29th Infantry near the Vierville draw
          beach exit at Omaha Beach. Captain Goranson of Company C had devised
          two different attack plans depending on the situation when they
          landed. If the infantry were able to clear the Vierville draw, they
          would move inland via the draw after landing, then swing west and
          clear the widerstandsnests to the west of the draw, WN 72 and WN 73,
          before continuing to the strongpoint at Pointe de la Percée and then
          Pointe du Hoc. However, if the Vierville draw had not been cleared,
          they would instead ascend the sheer cliffs overlooking Charlie
          sector prior to moving inland, a far more challenging task as they
          lacked most of the specialized climbing gear that their fellow
          Rangers would use at Pointe du Hoc.",
          "After the landing, the landing American troops were under heavy
          fire from the three widerstandsnests guarding the draw, and so the
          Rangers choose to scale the cliffs past WN 73. Despite the
          difficulties, they were successful reaching the top, and Goranson
          decided the situation in front of the Vierville draw required
          immediate action, so the Rangers turned east in order to silence the
          guns, mortars, and machine guns of the strongpoint that were causing
          so many casualties on the beach — including the Rangers themselves
          as they approached the base of cliffs — rather than moving west to
          eliminate WN 74 at Pointe de la Percée.",
        ]
      end

      def map_data
        {
          start_weather: "dry",
          base_weather: "dry",
          precip: [0, "rain"],
          wind: [4, 6, false],
          hexes:,
          layout:,
          allied_dir: 4,
          axis_dir: 2.5,
          victory_hexes: [
            [7, 1, 2], [10, 3, 2], [12, 3, 2], [16, 3, 2], [8, 5, 2], [12, 6, 2], [5, 1, 2],
          ],
          allied_setup: {
            "0" => [
              [0, "1-5"],
            ],
            "1" => [
              [0, "1-5"],
            ],
            "2" => [
              [0, "1-5"],
            ],
          },
          axis_setup: {
            "0" => [
              ["5-7", 1], ["5-9", 2], ["4-16", 3], ["4-18", 4], ["3-19", 5], ["4-20", 6],
              ["4-22", 7], ["5-22", "8-9"], ["6-22", 10],
            ],
            "3" => [
              ["9-22", 10],
            ],
          },
        }
      end

      def hexes
        [
          [
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "s" },
            { t: "s" },
          ],
          [
            { t: "o", h: 3, b: "c", be: [2, 3] },
            { t: "o", h: 3, b: "c", be: [2, 3] },
            { t: "o", h: 3, b: "c", be: [2, 3] },
            { t: "o", h: 3, b: "c", be: [2, 3] },
            { t: "o", h: 3, b: "c", be: [2, 3] },
            { t: "o", h: 3, b: "c", be: [2, 3] },
            { t: "o", h: 3, b: "c", be: [2, 3] },
            { t: "o", h: 3, b: "c", be: [2, 3, 4] },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "s" },
          ],
          [
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "b", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3, s: { t: "t", d: [3, 6] } },
            { t: "o", h: 3, s: { t: "t", d: [2, 4] } },
            { t: "o", h: 3, s: { t: "t", d: [1, 3] } },
            { t: "o", h: 3, s: { t: "t", d: [2, 5] }, b: "c", be: [3] },
            { t: "o", h: 3, b: "c", be: [2, 3, 4] },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 2, r: { t: "p", d: [4, 6] } },
            { t: "o", h: 2, r: { t: "p", d: [1, 4] } },
            { t: "o", h: 2, r: { t: "p", d: [1, 4] } },
            { t: "o", h: 1, r: { t: "p", d: [1, 4] } },
            { t: "o", h: 1, r: { t: "p", d: [1, 4] } },
            { t: "o", h: 1, r: { t: "p", d: [1, 4] } },
            { t: "s", r: { t: "p", d: [1, 3] } },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o", h: 1 },
          ],
          [
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "b", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3, s: { t: "t", d: [3, 6] } },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3, s: { t: "t", d: [2, 4, 6] } },
            { t: "o", h: 3, s: { t: "t", d: [1, 4] } },
            { t: "o", h: 2 },
            { t: "o", h: 2, r: { t: "p", d: [3, 6] } },
            { t: "o", h: 3, b: "c", be: [2, 3] },
            { t: "o", h: 3, b: "c", be: [2, 3] },
            { t: "b", h: 3, b: "c", be: [2, 3] },
            { t: "b", h: 3, b: "c", be: [2, 3] },
            { t: "o", h: 3, b: "c", be: [2, 3] },
            { t: "f", h: 2, b: "c", be: [2, 3] },
            { t: "f", h: 2, b: "c", be: [2, 3] },
            { t: "f", h: 2, b: "c", be: [2, 3, 4] },
            { t: "s" },
            { t: "s" },
            { t: "s" },
          ],
          [
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3, s: { t: "t", d: [3, 6] } },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3, st: { sh: "l2", s: "u" }, d: 3 },
            { t: "o", h: 3, s: { t: "t", d: [3, 6] } },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3, r: { t: "p", d: [3, 5] } },
            { t: "o", h: 3, s: { t: "t", d: [1, 3] } },
            { t: "o", h: 3, s: { t: "t", d: [2, 4] } },
            { t: "o", h: 3, s: { t: "t", d: [1, 4, 6] } },
            { t: "o", h: 3, s: { t: "t", d: [1, 4, 5] } },
            { t: "o", h: 3, s: { t: "t", d: [1, 3] } },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "f", h: 2 },
            { t: "f", h: 2, b: "c", be: [3] },
            { t: "f", h: 2, b: "c", be: [2, 3] },
            { t: "f", h: 2, b: "c", be: [2, 3] },
          ],
          [
            { t: "o", h: 3 },
            { t: "b", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3, s: { t: "t", d: [3, 5] } },
            { t: "b", h: 3 },
            { t: "b", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3, s: { t: "t", d: [3, 6] } },
            { t: "o", h: 3, st: { sh: "l2", s: "u" }, d: 2 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3, r: { t: "p", d: [2, 6] } },
            { t: "o", h: 3 },
            { t: "o", h: 3, s: { t: "t", d: [3, 6] } },
            { t: "o", h: 3 },
            { t: "o", h: 3, s: { t: "t", d: [2, 5] } },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "f", h: 2 },
            { t: "f", h: 2 },
            { t: "f", h: 2 },
          ],
          [
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "b", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3, s: { t: "t", d: [2, 4] } },
            { t: "o", h: 3, s: { t: "t", d: [1, 4] } },
            { t: "o", h: 3, st: { sh: "l2", s: "u" }, d: 1 },
            { t: "o", h: 3, s: { t: "t", d: [1, 3] } },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "f", h: 3 },
            { t: "o", h: 3, r: { t: "p", d: [3, 6] } },
            { t: "o", h: 3, st: { sh: "l2", s: "u" }, d: 1 },
            { t: "o", h: 3, s: { t: "t", d: [1, 3, 5] } },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3, s: { t: "t", d: [2, 4, 6] } },
            { t: "o", h: 3, st: { sh: "l2", s: "u" }, d: 1 },
            { t: "o", h: 3 },
            { t: "b", h: 3 },
            { t: "o", h: 3 },
            { t: "f", h: 2 },
            { t: "f", h: 2 },
          ],
          [
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "b", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "f", h: 3 },
            { t: "o", h: 3, r: { t: "p", d: [3, 6] } },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3, s: { t: "t", d: [2, 4] } },
            { t: "o", h: 3, s: { t: "t", d: [1, 4] } },
            { t: "o", h: 3, st: { sh: "l2", s: "u" }, d: 1 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
          ],
          [
            { t: "o", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3, r: { t: "p", d: [3, 5] } },
            { t: "o", h: 3 },
            { t: "b", h: 3 },
            { t: "b", h: 3 },
            { t: "o", h: 3, r: { t: "p", d: [4, 6] } },
            { t: "o", h: 3, r: { t: "p", d: [1, 4] } },
            { t: "o", h: 3, r: { t: "p", d: [1, 4] } },
            { t: "o", h: 3, r: { t: "p", d: [1, 4] } },
            { t: "o", h: 3, r: { t: "p", d: [1, 5] } },
            { t: "o", h: 3 },
            { t: "b", h: 3 },
            { t: "b", h: 3 },
            { t: "o", h: 3 },
          ],
          [
            { t: "o", h: 3 },
            { t: "f", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3, r: { t: "p", d: [2, 4, 6] } },
            { t: "o", h: 3, r: { t: "p", d: [1, 4] } },
            { t: "o", h: 3, r: { t: "p", d: [1, 4] } },
            { t: "o", h: 3, r: { t: "p", d: [1, 3] } },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3, r: { t: "p", d: [2, 4] } },
            { t: "o", h: 3, r: { t: "p", d: [1, 4] } },
            { t: "o", h: 3, r: { t: "p", d: [1, 4] } },
            { t: "o", h: 3, r: { t: "p", d: [1, 5] } },
            { t: "o", h: 3 },
          ],
          [
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3, r: { t: "p", d: [3, 6] } },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3, r: { t: "p", d: [2, 4] } },
          ],
        ]
      end
    end
  end
end
