# frozen_string_literal: true

module Scenarios
  class Scenario005 < Base
    ID = "005"
    NAME = "Second Contact"
    ALLIES = ["ussr"].freeze
    AXIS = ["ger"].freeze

    class << self
      def generate
        {
          turns: 6,
          first_setup: 1,
          first_move: 2,
          date: [1942, 5, 17],
          location: "Barvenkovo, Ukraine",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "German counter-attack.  Part of a German attempt to eliminate a Soviet salient during
          the Second Battle of Kharkov.",
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
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "o", r: { d: [1, 5] } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o", r: { d: [2, 5] } },
            { t: "o", d: 2, st: { sh: "s", s: "f" } },
            { t: "o" },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "o", d: 1, st: { sh: "s", s: "f" } },
            { t: "o", d: 4, st: { sh: "s", s: "f" } },
            { t: "o", d: 1, st: { sh: "x", s: "f" } },
            { t: "o", r: { d: [2, 6] } },
            { t: "o", d: 5, st: { sh: "s", s: "f" } },
            { t: "o" },
            { t: "o", d: 5, st: { sh: "c" } },
            { t: "g" },
            { t: "g" },
            { t: "o", r: { d: [4, 6] } },
          ], [
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 3, 4, 6] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 3] } },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l", s: "f" } },
            { t: "o", d: 3, st: { sh: "l", s: "f" } },
            { t: "o", r: { d: [3, 6] } },
            { t: "o", d: 3, st: { sh: "s", s: "f" } },
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 5] } },
            { t: "o", d: 6, st: { sh: "s", s: "f" } },
            { t: "o" },
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
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "g" },
            { t: "g" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "f", r: { d: [2, 5] } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ],
        ]
      end

      def allied_units
        {
          s: { list: [
            :ussr_leader_5_1,
            :ussr_leader_3_1,
            [5, :ussr_rifle_s],
            :ussr_crew_t,
            :ussr_dp_27,
            :ussr_rm_38,
            :ussr_45mm_53_k,
            :ussr_t_34_m40,
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end

      def axis_units
        {
          s: { list: [
            :ger_leader_5_2,
            :ger_leader_4_1,
            [6, :ger_rifle_s],
            [2, :ger_mg_34],
            :ger_radio_15cm,
            :ger_sc,
            :ger_sdkfz_250_1,
            :ger_pzkpfw_iii_j,
            :ger_panzerjager_i,
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end
    end
  end
end
