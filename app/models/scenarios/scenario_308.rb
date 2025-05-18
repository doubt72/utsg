# frozen_string_literal: true

module Scenarios
  class Scenario308 < Base
    ID = "308"
    NAME = "A Day on the Waterfront"
    ALLIES = ["usa"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    DATE = [1944, 6, 29].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": { list: [
        :usa_leader_5_1,
        :usa_leader_4_1,
        [2, :usa_engineer_s],
        [8, :usa_rifle_s],
        [2, :usa_m1918_bar],
        :usa_m2_browning,
        :usa_m2_mortar,
      ] },
    }.freeze

    AXIS_UNITS = {
      "0": { list: [
        :ger_leader_4_1,
        :ger_leader_3_1,
        [10, :ger_conscript_s],
        :ger_mg_42,
      ] },
    }.freeze

    class << self
      def generate
        {
          turns: 6,
          first_setup: 2,
          first_move: 1,
          date:,
          location: "Cherbourg, France",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "Despite not landing directly on Cotentin Peninsula, capturing the
          city of Cherbourg there was a priority after the invasion of
          Normandy due to the need for deep-water ports to supply the
          invasion.  However, it was a hard-fought, month-long campaign to
          capture the city and the port, and by the time the port was
          captured, it had been thoroughly wrecked by the Germans and was not
          fully operational again for months afterwards.",
          "Due to being cut off from reinforcements and resupply, as well as
          some ill-considered decisions imposed by Hitler in the defense, by
          the time Cherbourg fell (though the port was already destroyed)
          the city itself was only defended by a rag-tag collection of dispirited and
          disorganized defenders, including hastily drafted naval personnel
          and men from labor units.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [2, 5, true],
          hexes:,
          layout:,
          allied_edge: "r",
          axis_edge: "l",
          victory_hexes: [
            [4, 2, 2], [4, 4, 2], [5, 7, 2], [10, 2, 2], [11, 5, 1],
          ],
          allied_setup: {
            "0": 0.upto(10).map do |y|
              (12 - ((y - 1) / 2)).upto(14).map { |x| [x, y] }
            end.flatten(1),
            "3": 10.upto(14).map { |x| [x, 20] }.concat(15.upto(20).map { |y| [14, y] }),
          },
          axis_setup: {
            "0": 0.upto(10).map do |y|
              0.upto(10 - ((y - 1) / 2)).map { |x| [x, y] }
            end.flatten(1),
          },
          base_terrain: "u",
        }
      end

      def hexes
        [
          [
            { t: "w" },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", r: { d: [2, 4, 6], t: "t", c: "l" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "s" } },
            { t: "d", d: 3 },
            { t: "o", d: 3, st: { sh: "s" } },
          ], [
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3, 5], t: "t", c: "r" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "s" } },
            { t: "d", d: 3 },
            { t: "o", d: 6, st: { sh: "s" } },
            { t: "d", d: 3 },
          ], [
            { t: "w" },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
          ], [
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3, 5], t: "t", c: "r" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "s" } },
            { t: "d", d: 3 },
            { t: "o", d: 3, st: { sh: "s" } },
            { t: "d", d: 3 },
            { t: "o", d: 3, st: { sh: "s" } },
          ], [
            { t: "w" },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", r: { d: [2, 4, 6], t: "t", c: "l" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3, 5], t: "t" } },
            { t: "o", d: 6, st: { sh: "s" } },
            { t: "d", d: 3 },
            { t: "o", d: 6, st: { sh: "s" } },
            { t: "d", d: 3 },
            { t: "o", d: 6, st: { sh: "s" } },
          ], [
            { t: "w" },
            { t: "w" },
            { t: "o", r: { d: [4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3, 4], t: "t", c: "r" } },
            { t: "o", r: { d: [1, 5], t: "t" }, b: "w", be: [2, 3] },
            { t: "o", d: 1, st: { sh: "c" }, b: "w", be: [2, 3] },
            { t: "o", d: 1, st: { sh: "c" }, b: "w", be: [2, 3] },
            { t: "o", b: "w", be: [2, 3, 4, 5]  },
            { t: "o", r: { d: [2, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
          ], [
            { t: "w" },
            { t: "w" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "d", d: 3 },
            { t: "o", b: "w", be: [1, 2, 3] },
            { t: "o", d: 1, st: { sh: "c" }, b: "w", be: [2] },
            { t: "o", r: { d: [2, 6], t: "t" } },
            { t: "o", d: 1, st: { sh: "t" } },
            { t: "o", b: "w", be: [4, 5] },
            { t: "o" },
            { t: "o", d: 2, st: { sh: "l" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "l" } },
            { t: "o", d: 1, st: { sh: "l" } },
            { t: "o", d: 1, st: { sh: "l" } },
          ], [
            { t: "w" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "d", d: 3 },
            { t: "o", b: "w", be: [1, 2] },
            { t: "o", d: 1, st: { sh: "t" } },
            { t: "o", r: { d: [3, 4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4, 6], t: "t" } },
            { t: "o", r: { d: [1, 3], t: "t" } },
            { t: "o", d: 3, st: { sh: "l" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3], t: "t" } },
            { t: "d", d: 3 },
            { t: "o", b: "w", be: [1, 2] },
            { t: "o", d: 1, st: { sh: "t" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 1, st: { sh: "t" } },
            { t: "o", b: "w", be: [4, 5] },
            { t: "o", b: "w", be: [2] },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "s" } },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [4, 6], t: "t" } },
          ], [
            { t: "o", d: 3, st: { sh: "s" }  },
            { t: "o" },
            { t: "o", b: "w", be: [1, 2] },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 1, st: { sh: "t" } },
            { t: "o", b: "w", be: [4, 5] },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "m" } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
          ], [
            { t: "o", d: 6, st: { sh: "s" } },
            { t: "o" },
            { t: "o", b: "w", be: [1, 2] },
            { t: "o", d: 1, st: { sh: "t" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o", b: "w", be: [4, 5] },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "s" } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
          ],
        ]
      end
    end
  end
end
