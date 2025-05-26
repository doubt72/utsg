# frozen_string_literal: true

module Scenarios
  class Scenario508 < Base
    ID = "508"
    NAME = "Midtskogen Farm"
    ALLIES = ["nor"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    DATE = [1940, 4, 9].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          :alm_leader_5_1,
          [2, :alm_elite_s],
          [8, :alm_conscript_s],
          [2, :alm_colt_m_29],
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :ger_leader_6_1,
          :ger_leader_5_1,
          [9, :ger_fallschirmjager_s],
          [3, :ger_mg_34],
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
          location: "Elverum, Norway",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "The Battle of Midtskogen was one of the first armed engagements
          between Norwegian forces and the German military during the invasion
          of Norway. The clash took place near the Midtskogen farm, close to
          the town of Elverum, and played a crucial role in delaying a German
          attempt to capture the Norwegian King and government.",

          "After Germany launched its surprise invasion, a
          detachment of German paratroopers and soldiers advanced inland with
          the goal of capturing King Haakon VII and his cabinet, who had fled
          Oslo.  Norwegian forces, consisting of local volunteers, soldiers,
          and members of the Royal Guards, set up an ambush at Midtskogen.
          Though lightly armed and hastily organized, the Norwegians managed
          to halt the German advance in a short but intense firefight.  The
          German commander was seriously wounded, and the attackers retreated.
          This delay gave the Norwegian leadership critical time to escape
          further north, eventually allowing them to continue resistance and
          organize in exile.",
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
            [2, 5, 2], [7, 7, 1], [10, 2, 1], [10, 7, 1], [12, 7, 1],
          ],
          allied_setup: { "0" => [["4-14", "*"]] },
          axis_setup: { "0" => [["0-2", "*"]] },
          base_terrain: "g",
        }
      end

      def hexes
        [
          [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", s: { d: [2, 6] } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", s: { d: [3, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", s: { d: [2, 6] } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "s2", s: "f" } },
            { t: "o", d: 4, st: { sh: "s2", s: "f" } },
            { t: "o", d: 2.5, st: { sh: "l2", s: "f" } },
            { t: "o" },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", s: { d: [3, 5] } },
            { t: "o" },
            { t: "o", d: 2.5, st: { sh: "l2", s: "f" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", s: { d: [2, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 6], t: "t", c: "l" } },
            { t: "o", d: 1, st: { sh: "l2", s: "f" } },
            { t: "o" },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l2", s: "f" } },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o", s: { d: [3, 6] } },
            { t: "o" },
            { t: "o", d: 2.5, st: { sh: "l2", s: "f" } },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "o", d: 2.5, st: { sh: "l2", s: "f" } },
            { t: "f" },
            { t: "f" },
            { t: "o", s: { d: [3, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 6], t: "t", c: "l" } },
            { t: "o" },
            { t: "o" },
            { t: "f" },
          ], [
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 2, 4], t: "t", c: "l" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", s: { d: [2, 5] }, r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3, 4], t: "t", c: "r" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", s: { d: [2, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] }, s: { d: [3, 6] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", s: { d: [4, 6] } },
            { t: "o", s: { d: [1, 4] } },
            { t: "o", s: { d: [1, 4] } },
            { t: "o", s: { d: [1, 4] } },
            { t: "o", s: { d: [1, 3] } },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ],
        ]
      end
    end
  end
end
