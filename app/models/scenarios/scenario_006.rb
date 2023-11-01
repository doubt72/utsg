# frozen_string_literal: true

module Scenarios
  class Scenario006 < Base
    ID = "006"
    NAME = "Surpise! KV"
    ALLIES = ["ussr"].freeze
    AXIS = ["ger"].freeze

    class << self
      def generate
        {
          turns: 6,
          first_setup: 1,
          first_move: 2,
          date: [1941, 6, 23],
          location: "Raseiniai, Lithuania",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "Germans encounter KV-1 tanks during the opening stages of Operation Barbarossa.
          The German army was completely unaware of the existance of German T-34s and KV tanks
          until encountering them in the field, and initially had significant trouble dealing
          with them.",
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
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "w" },
            { t: "w" },
            { t: "b" },
            { t: "b" },
            { t: "b" },
            { t: "w" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "b" },
            { t: "b" },
            { t: "w", s: { d: [3, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "f" },
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
          ], [
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "o", b: "f", be: [2, 3] },
            { t: "o", b: "f", be: [2, 3] },
            { t: "o", b: "f", be: [2, 3] },
            { t: "o", b: "f", be: [2, 3, 4] },
            { t: "o" },
            { t: "o", s: { d: [3, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "b" },
            { t: "b" },
            { t: "b" },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "f", be: [3, 4] },
            { t: "o", s: { d: [3, 6] } },
            { t: "b" },
            { t: "b" },
            { t: "o", r: { d: [4, 6] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "o", s: { d: [3, 5] } },
            { t: "b" },
            { t: "b" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o", d: 3, st: { sh: "c" } },
            { t: "d", d: 3 },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "g", b: "f", be: [1, 2] },
            { t: "g" },
            { t: "g" },
            { t: "o" },
            { t: "o", r: { d: [2, 4, 5] } },
            { t: "o", r: { d: [1, 4] }, s: { d: [2, 5] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 3] } },
            { t: "d", d: 3 },
            { t: "d", d: 3 },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "g", b: "f", be: [1, 2, 6] },
            { t: "g" },
            { t: "g" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [2, 5] } },
            { t: "o", s: { d: [2, 5] } },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "g", b: "f", be: [1, 5, 6] },
            { t: "g", b: "f", be: [5, 6] },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", s: { d: [2, 6] }, r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "d", d: 3 },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", s: { d: [3, 6] } },
            { t: "o" },
            { t: "f", r: { d: [2, 5] } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", s: { d: [3, 6] } },
            { t: "f" },
            { t: "f" },
            { t: "f", r: { d: [2, 5] } },
            { t: "f" },
            { t: "f" },
          ],
        ]
      end

      def allied_units
        {
          s: { list: [
            :ussr_leader_3_1,
            [4, :ussr_rifle_s],
            :ussr_dp_27,
            [2, :ussr_kv_1_m40],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end

      def axis_units
        {
          s: { list: [
            :ger_leader_5_2,
            :ger_pionier_s,
            [4, :ger_rifle_s],
            :ger_crew_t,
            [2, :ger_mg_34],
            :ger_3_7cm_pak_36,
            [4, :ger_pzkpfw_35t],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end
    end
  end
end
