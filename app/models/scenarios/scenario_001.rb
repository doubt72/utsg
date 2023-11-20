# frozen_string_literal: true

module Scenarios
  class Scenario001 < Base
    ID = "001"
    NAME = "A Straightforward Proposition"
    ALLIES = ["ussr"].freeze
    AXIS = ["ger"].freeze
    STATUS = "b"

    class << self
      # TODO: documentation for field descriptions
      def generate
        {
          turns: 6,
          first_setup: 1,
          first_move: 2,
          date: [1944, 6, 25],
          location: "Bogushevsk, Belarus",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "Soviet infantry doing a clearing operation against a local German force concentration.
          Part of the Vitebsk-Orsha offensive during Operation Bagration.",
        ]
      end

      # TODO: documentation for map definitions
      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [0, 3, false],
          hexes:,
          layout: [15, 11, "x"],
          allied_edge: "r",
          axis_edge: "l",
          victory_hexes: [],
          allied_setup: { "0" => [] },
          axis_setup: { "0" => [] },
        }
      end

      # TODO: maybe standardize maps?  Maybe not?
      # TODO: think about modularity?
      def hexes
        [
          [
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "b" },
            { t: "b" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l", s: "f" } },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "o", d: 3, st: { sh: "l", s: "f" } },
            { t: "o", r: { d: [4, 6] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "o", d: 2, st: { sh: "l", s: "f" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [4, 6] } },
            { t: "o", r: { d: [1, 4] } },
          ], [
            { t: "o" },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 3, 6] } },
            { t: "o", d: 1, st: { sh: "s", s: "f" } },
            { t: "o", d: 4, st: { sh: "s", s: "f" } },
            { t: "o", d: 1, st: { sh: "l", s: "f" } },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "c" } },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 3, 6] } },
            { t: "f" },
            { t: "f" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "b" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "b" },
            { t: "b" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [1, 3] } },
            { t: "o" },
            { t: "o" },
            { t: "b" },
            { t: "b" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] } },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "b" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "w" },
            { t: "w" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [4, 6] } },
            { t: "o", r: { d: [1, 3] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ],
        ]
      end

      # TODO: documentation for unit definitions
      def allied_units
        {
          s: { list: [
            :ussr_leader_6_2,
            :ussr_leader_4_1,
            [6, :ussr_rifle_s],
            [3, :ussr_smg_s],
            [2, :ussr_dp_27],
            :ussr_dshk,
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end

      def axis_units
        {
          s: { list: [
            :ger_leader_5_1,
            :ger_leader_4_1,
            [6, :ger_rifle_s],
            [2, :ger_mg_42],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end
    end
  end
end
