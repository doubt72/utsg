# frozen_string_literal: true

module Scenarios
  class Scenario305 < Base
    ID = "305"
    NAME = "The Shingle"
    ALLIES = ["usa"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    DATE = [1944, 6, 6].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": { list: [
        :usa_leader_5_1,
        :usa_leader_4_1,
        [2, :usa_engineer_s],
        [6, :usa_rifle_s],
        [2, :usa_m1918_bar],
      ] },
      "2": { list: [
        :usa_leader_5_1,
        [3, :usa_rifle_s],
        [1, :usa_m1918_bar],
      ] },
    }.freeze

    AXIS_UNITS = {
      "0": { list: [
        [2, :ger_leader_4_1],
        [4, :ger_volksgrenadier_s],
        [2, :ger_mg_42],
        [8, :wire],
        [2, :pillbox],
      ] },
    }.freeze

    class << self
      def generate
        {
          turns: 6,
          first_setup: 2,
          first_move: 1,
          date:,
          location: "Normandy, France",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "D-Day, Omaha Beach.  The American troops who survived the initial
          landings gathered at the shingle below the sea wall.  From there,
          they organized despeate assaults on the hills further inland, at the
          rear of the beach ocross the shelf, where German machine guns
          continued to rain down lead on the men below.",
          "It took several hours to clear Omaha Beach during the initial
          assault on D-Day.  The beach was cleared in about an hour, but it
          took a few more hours to clear the German defenses in the area
          behind the beach.  By the end of the the day, the initial assault
          had not reached all of its objectives, but a toehold had been
          established.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [3, 5, true],
          hexes:,
          layout:,
          allied_edge: "t",
          axis_edge: "b",
          victory_hexes: [[1, 10, 2], [5, 7, 2], [5, 10, 2], [7, 9, 2], [11, 10, 2]],
          allied_setup: {
            "0": [["*", 0], ["0-5", 1]],
            "2": [["*", 0], ["0-5", 1]],
          },
          axis_setup: { "0": [
            ["6-15", 1], ["*", 2], ["*", 3], ["*", 4], ["*", 5], ["*", 6], ["*", 7], ["*", 8],
            ["*", 9], ["*", 10],
          ] },
          base_terrain: "d",
        }
      end

      def hexes
        [
          [
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
          ], [
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
          ], [
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
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
          ], [
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
          ], [
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
          ], [
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "s" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
          ], [
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "s" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "b", h: 1 },
            { t: "b", h: 1 },
            { t: "b", h: 1 },
          ], [
            { t: "o", h: 2 },
            { t: "b", h: 2 },
            { t: "b", h: 2 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "b", h: 2 },
            { t: "b", h: 2 },
            { t: "b", h: 2 },
            { t: "o", h: 2 },
          ], [
            { t: "b", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "b", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 3 },
            { t: "b", h: 3 },
            { t: "b", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
          ], [
            { t: "b", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 3 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "b", h: 1 },
            { t: "b", h: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
            { t: "o", h: 4 },
          ],
        ]
      end
    end
  end
end
