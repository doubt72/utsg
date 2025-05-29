# frozen_string_literal: true

module Scenarios
  class Scenario102 < Base
    ID = "102"
    NAME = "Fort Capuzzo"
    ALLIES = ["uk"].freeze
    AXIS = ["ita"].freeze
    STATUS = "p"

    DATE = [1940, 5, 14].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": { list: [
        :uk_leader_5_1,
        :uk_leader_4_1,
        [6, :uk_line_s],
        [2, :uk_bren_lmg],
        :uk_matilda_ii,
        :uk_humber_ac_i,
      ] },
    }.freeze

    AXIS_UNITS = {
      "0": { list: [
        :ita_leader_3_1,
        [6, :ita_fucilieri_s],
        :ita_breda_30,
      ] },
    }.freeze

    class << self
      # TODO: documentation for field descriptions
      def generate
        {
          turns: 6,
          first_setup: 2,
          first_move: 1,
          date:,
          location: "Fort Capuzzo, Libya",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "Four days after the Italian declaration of war on Britain, the 7th
          Hussars and 1st Royal Tank Regiment were sent to capture Fort
          Capuzzo, which they did.  The Fort was not occupied for long due to
          shortages of troops and equipment, instead demolition parties
          destroyed as much of the Italian ammunition and vehicles stored
          there as possible.",
          "Fort Capuzzo would soon be reoccupied by the Italians, and would end
          up changing hands several more times over the course of the war.",
        ]
      end

      # TODO: documentation for map definitions
      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [0, 1, false],
          hexes:,
          layout:,
          allied_edge: "r",
          axis_edge: "l",
          victory_hexes: [
            [4, 3, 2], [4, 7, 2], [6, 5, 2], [7, 2, 2], [8, 5, 2], [10, 3, 2], [10, 7, 2],
          ],
          allied_setup: { "0": [["*", 9], ["*", 10], [13, "*"], [14, "*"]] },
          axis_setup: { "0": [
            ["0-10", "0-7"], [11, 0], [11, 2], [11, 4], [11, 6],
          ] },
          base_terrain: "d",
        }
      end

      # TODO: maybe standardize maps?  Maybe not?
      # TODO: think about modularity?
      def hexes
        [
          [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 4, st: { sh: "l2", s: "f" } },
            { t: "o", d: 4, st: { sh: "l2", s: "f" } },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 4, st: { sh: "l2", s: "f" } },
            { t: "o", d: 4, st: { sh: "l2", s: "f" } },
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
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [5, 6], t: "p" } },
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
            { t: "o", r: { d: [4, 5], t: "p", c: "r" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "c" }, b: "w", be: [1] },
            { t: "o", r: { d: [1, 3], t: "p" } },
            { t: "o", r: { d: [2, 4], t: "p" }, b: "w", be: [1] },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 6], t: "p", c: "l" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 6], t: "p", c: "l" } },
            { t: "o", d: 1, st: { sh: "s2", s: "f" }, b: "w", be: [1, 2, 3] },
            { t: "o", d: 1, st: { sh: "m2", s: "f" }, b: "w", be: [2, 3] },
            { t: "o", d: 1, st: { sh: "m2", s: "f" }, b: "w", be: [2, 3] },
            { t: "o", d: 1, st: { sh: "m2", s: "f" }, b: "w", be: [2, 3] },
            { t: "o", d: 1, st: { sh: "m2", s: "f" }, b: "w", be: [2, 3] },
            { t: "o", d: 1, st: { sh: "m2", s: "f" }, b: "w", be: [2, 3] },
            { t: "o", d: 4, st: { sh: "s2", s: "f" }, b: "w", be: [2, 3] },
            { t: "o", r: { d: [3, 5], t: "p", c: "r" }, b: "w", be: [1] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "p", c: "r" } },
            { t: "o", b: "w", be: [1, 2] },
            { t: "o", r: { d: [4, 6], t: "p", c: "l" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 5], t: "p", c: "r" } },
            { t: "o", b: "w", be: [3] },
            { t: "o", r: { d: [2, 6], t: "p", c: "l" }, b: "w", be: [1] },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 6], t: "p", c: "l" }, b: "w", be: [3] },
            { t: "o", r: { d: [3, 5], t: "p", c: "r" }, b: "w", be: [1] },
            { t: "o", d: 1, st: { sh: "l2", s: "f" } },
            { t: "o", d: 4, st: { sh: "l2", s: "f" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l2", s: "f" } },
            { t: "o", d: 4, st: { sh: "l2", s: "f" } },
            { t: "o", r: { d: [4, 2, 6], t: "p", c: "l" } },
            { t: "o", r: { d: [1, 3, 5], t: "p", c: "r" }, b: "w", be: [2] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [2, 5], t: "d" } },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "p", c: "r" } },
            { t: "o", b: "w", be: [1, 2] },
            { t: "o", r: { d: [2, 4], t: "p", c: "l" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 3], t: "p", c: "r" } },
            { t: "o", b: "w", be: [3] },
            { t: "o", r: { d: [2, 6], t: "p", c: "l" }, b: "w", be: [1] },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [2, 5], t: "d" } },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 6], t: "p", c: "l" }, b: "w", be: [3] },
            { t: "o", d: 1, st: { sh: "s2", s: "f" }, b: "w", be: [1] },
            { t: "o", d: 1, st: { sh: "m2", s: "f" } },
            { t: "o", d: 1, st: { sh: "m2", s: "f" } },
            { t: "o", d: 1, st: { sh: "m2", s: "f" } },
            { t: "o", d: 1, st: { sh: "m2", s: "f" } },
            { t: "o", d: 1, st: { sh: "m2", s: "f" } },
            { t: "o", d: 4, st: { sh: "s2", s: "f" } },
            { t: "o", r: { d: [3, 5], t: "p", c: "r" }, b: "w", be: [1, 2] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", r: { d: [2, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 3, 4], t: "d", c: "r" } },
            { t: "o", r: { d: [1, 4], t: "d" }, b: "w", be: [3] },
            { t: "o", r: { d: [1, 4], t: "d" }, b: "w", be: [2, 3] },
            { t: "o", r: { d: [1, 4], t: "d" }, b: "w", be: [2, 3] },
            { t: "o", r: { d: [1, 4], t: "d" }, b: "w", be: [2, 3] },
            { t: "o", r: { d: [1, 4], t: "d" }, b: "w", be: [2, 3] },
            { t: "o", r: { d: [1, 4], t: "d" }, b: "w", be: [2, 3] },
            { t: "o", r: { d: [1, 4], t: "d" }, b: "w", be: [2, 3] },
            { t: "o", r: { d: [1, 4], t: "d" }, b: "w", be: [2] },
            { t: "o", r: { d: [1, 2, 4], t: "d", c: "l" } },
            { t: "o", r: { d: [1, 5], t: "d" } },
            { t: "o" },
          ], [
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
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
          ], [
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
