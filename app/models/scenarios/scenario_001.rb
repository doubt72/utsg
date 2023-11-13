# frozen_string_literal: true

module Scenarios
  class Scenario001 < Base
    ID = "001"
    NAME = "Into the the Gap"
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
          date: [1942, 7, 31],
          location: "Rzhev, Russia",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "A simple meeting engagement.  German divisional reserves attempt
          to plug a gap in the German defenses by counterattacking a small
          Soviet breakthrough in the woods on the second day of the first
          Soviet Rzhev-Sychyovka offensive.",
          "Special rules: mud",
        ]
      end

      # TODO: documentation for map definitions
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

      # TODO: maybe standardize maps?  Maybe not?
      # TODO: think about modularity?
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
            { t: "o", s: { d: [3, 5] } },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "f" },
            { t: "o", r: { t: "d", d: [4, 6] } },
            { t: "o", r: { t: "d", d: [1, 4] } },
            { t: "o", r: { t: "d", d: [1, 4] } },
            { t: "o", r: { t: "d", d: [1, 4] } },
            { t: "o", r: { t: "d", d: [1, 4] } },
            { t: "o", s: { d: [2, 6] }, r: { t: "d", d: [1, 4] } },
            { t: "o", r: { t: "d", d: [1, 4] } },
            { t: "o", r: { t: "d", d: [1, 4] } },
            { t: "o", r: { t: "d", d: [1, 4] } },
            { t: "o", r: { t: "d", d: [1, 4] } },
            { t: "o", r: { t: "d", d: [1, 5] } },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "o", r: { t: "d", d: [1, 4] } },
            { t: "o", r: { t: "d", d: [1, 4, 5] } },
            { t: "o", r: { t: "d", d: [1, 3] } },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", s: { d: [3, 5] } },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "f", r: { t: "d", d: [2, 4] } },
            { t: "o", r: { t: "d", d: [1, 4] } },
          ], [
            { t: "d", d: 2, b: "f", be: [2, 3, 4] },
            { t: "o", r: { t: "d", d: [2, 5] } },
            { t: "o", d: 2, st: { sh: "l", s: "f" } },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", s: { d: [2, 5] } },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "d", d: 2 },
            { t: "d", d: 2, b: "f", be: [3, 4] },
            { t: "o", r: { t: "d", d: [2, 4] } },
            { t: "o", r: { t: "d", d: [1, 4] } },
            { t: "o", r: { t: "d", d: [1, 4] } },
            { t: "o", r: { t: "d", d: [1, 5] } },
            { t: "f" },
            { t: "f" },
            { t: "o", s: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "d", d: 2 },
            { t: "d", d: 2, b: "f", be: [3] },
            { t: "o", b: "f", be: [2, 3] },
            { t: "o", b: "f", be: [2, 3] },
            { t: "o", b: "f", be: [2, 3, 4] },
            { t: "o", r: { t: "d", d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o", s: { d: [2, 6] } },
            { t: "o", b: "f", be: [1, 2, 3] },
            { t: "o", b: "f", be: [2, 3] },
            { t: "o", b: "f", be: [2, 3, 4] },
            { t: "f" },
            { t: "f" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o", r: { t: "d", d: [2, 4] } },
            { t: "o", r: { t: "d", d: [1, 5] } },
            { t: "o", s: { d: [3, 5] } },
            { t: "g", b: "f", be: [1, 2, 6] },
            { t: "g" },
            { t: "g" },
            { t: "o", b: "f", be: [3, 4] },
            { t: "f" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "b" },
            { t: "o", r: { t: "d", d: [2, 5] } },
            { t: "o", s: { d: [2, 5] } },
            { t: "g", b: "f", be: [1, 5, 6] },
            { t: "g", b: "f", be: [6] },
            { t: "g" },
            { t: "o", b: "f", be: [3, 4] },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "b" },
            { t: "o", r: { t: "d", d: [2, 5] } },
            { t: "o", s: { d: [2, 4] } },
            { t: "o", s: { d: [1, 5] } },
            { t: "o", b: "f", be: [1, 6] },
            { t: "o", d: 1, st: { sh: "l", s: "f" } },
            { t: "o", b: "f", be: [3] },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "m" },
            { t: "o", r: { t: "d", d: [2, 4] } },
            { t: "o", r: { t: "d", d: [1, 4] } },
            { t: "o", s: { d: [2, 6] }, r: { t: "d", d: [1, 4] } },
            { t: "o", r: { t: "d", d: [1, 4] } },
            { t: "o", r: { t: "d", d: [1, 4] } },
            { t: "f", r: { t: "d", d: [1, 5] } },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "m" },
            { t: "m" },
            { t: "m" },
            { t: "o", s: { d: [3, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f", r: { t: "d", d: [2, 5] } },
          ],
        ]
      end

      # TODO: documentation for unit definitions
      def allied_units
        {
          s: { list: [
            :ussr_leader_5_2,
            :ussr_leader_4_1,
            [5, :ussr_rifle_s],
            [2, :ussr_smg_s],
            :ussr_dp_27,
            :ussr_sg_43,
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end

      def axis_units
        {
          s: { list: [
            :ger_leader_6_2,
            :ger_leader_4_1,
            [6, :ger_rifle_s],
            [2, :ger_mg_34],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end
    end
  end
end
