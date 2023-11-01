# frozen_string_literal: true

module Scenarios
  class Scenario998 < Base
    ID = "998"
    NAME = "Broken Ground"
    ALLIES = ["uk"].freeze
    AXIS = ["ger"].freeze

    class << self
      def generate
        {
          turns: 6,
          first_setup: 1,
          first_move: 2,
          date: [1941, 6, 15],
          location: "Halfaya Pass, Libya",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "Vicious block-to-block fighing.  Russian defenders attempt to hold
          every inch of ground as the German army enters the city on the first
          day of the battle of Stalingrad.",
        ]
      end

      def map_data
        {
          hexes:,
          layout: [15, 11, "x"],
          allied_edge: "r",
          axis_edge: "l",
          victory_hexes: [],
          allied_setup: { "0" => [] },
          axis_setup: { "0" => [] },
        }
      end

      def hexes
        [
          [
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
          ], [
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
          ], [
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o", r: { d: [3, 5] } },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
          ], [
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 6] } },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
          ], [
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", r: { d: [4, 6] } },
            { t: "o", r: { d: [1, 3] } },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
          ], [
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", r: { d: [3, 5] } },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
          ], [
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1, r: { d: [4, 5] } },
            { t: "o", h: 1, r: { d: [1, 2] } },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
          ], [
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1, r: { d: [4, 6] } },
            { t: "o", h: 1, r: { d: [1, 2] } },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
          ], [
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1, r: { d: [3, 6] } },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
          ], [
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2, r: { d: [4, 6] } },
            { t: "o", h: 2, r: { d: [1, 4] } },
            { t: "o", h: 2, r: { d: [1, 3] } },
            { t: "o", h: 2 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
          ], [
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2, r: { d: [4, 6] } },
            { t: "o", h: 2, r: { d: [1, 3] } },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
            { t: "o", h: 3 },
          ],
        ]
      end

      def allied_units
        {
          s: { list: [
            :ussr_leader_5_1,
            :ussr_leader_4_1,
            :ussr_leader_3_1,
            [6, :ussr_rifle_s],
            [4, :ussr_smg_s],
            [4, :ussr_dp_27],
            [6, :ussr_mc],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end

      def axis_units
        {
          s: { list: [
            :ger_leader_6_2,
            [2, :ger_leader_5_1],
            [10, :ger_rifle_s],
            [4, :ger_mg_34],
            :ger_ft,
            [2, :ger_sc],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end
    end
  end
end
