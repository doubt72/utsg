# frozen_string_literal: true

module Scenarios
  class Scenario302 < Base
    ID = "302"
    NAME = "American Armor"
    ALLIES = ["usa"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    class << self
      def generate
        {
          turns: 6,
          first_setup: 1,
          first_move: 2,
          date: [1944, 9, 19],
          location: "Arracourt, France",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "German forces counter-attack the American bridgehead near Arracourt.  Fog negated
          American air support at the beginning of the battle, but the Americans still had
          significant artillery support, and while the German attackers had recently received
          new Panther tanks, they neither had the time nor fuel to properly train the new crews
          operating them, and fuel shortages also dogged the Germans once the fight began.",
          "Special rules: rookie Germans, fog, special breakdown rules",
        ]
      end

      def map_data
        {
          hexes:,
          layout: [23, 21, "x"],
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
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", r: { d: [3, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "g" },
            { t: "g" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "f", be: [1] },
          ], [
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "g" },
            { t: "g" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "g" },
            { t: "g" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "f", be: [1, 2] },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "g" },
            { t: "g" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", r: { d: [2, 6], t: "t" } },
            { t: "o", d: 1, st: { sh: "c" } },
            { t: "o", d: 4, st: { sh: "l" } },
            { t: "o", r: { d: [4, 6], t: "t" } },
            { t: "o", r: { d: [1, 3, 4], t: "t" } },
            { t: "o", r: { d: [1, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "f", be: [1, 2] },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t" } },
            { t: "g", b: "f", be: [5, 6] },
            { t: "g", b: "f", be: [5, 6] },
            { t: "o", b: "f", be: [5, 6] },
            { t: "o", b: "f", be: [5, 6] },
            { t: "o", b: "f", be: [6] },
            { t: "o" },
            { t: "o", b: "f", be: [1, 6] },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3], t: "t" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "g", b: "f", be: [1, 2] },
            { t: "g" },
            { t: "o", s: { d: [3, 6] } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "g", b: "f", be: [1, 6] },
            { t: "g" },
            { t: "o", r: { d: [3, 5], t: "t" } },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o" },
            { t: "g", b: "f", be: [1, 2] },
            { t: "g" },
            { t: "o", s: { d: [3, 6] } },
          ], [
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "g", b: "f", be: [1, 6] },
            { t: "g" },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", b: "f", be: [2] },
            { t: "o" },
            { t: "o", s: { d: [3, 6] } },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "g", b: "f", be: [1, 6, 5] },
            { t: "g", b: "f", be: [6] },
            { t: "o", r: { d: [2, 6], t: "t" } },
            { t: "o", b: "f", be: [5, 6] },
            { t: "o", b: "f", be: [5, 6] },
            { t: "o", b: "f", be: [5, 6] },
            { t: "o", b: "f", be: [4, 5] },
            { t: "o", b: "f", be: [2, 3] },
            { t: "o", b: "f", be: [2] },
            { t: "o", r: { d: [2, 6], t: "t" } },
            { t: "o" },
            { t: "o", s: { d: [3, 6] } },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", r: { d: [2, 6], t: "t" } },
            { t: "o", b: "f", be: [5, 6] },
            { t: "o", b: "f", be: [5, 6] },
            { t: "o", b: "f", be: [6] },
            { t: "b" },
            { t: "o" },
            { t: "o", b: "f", be: [1, 6] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "f", be: [4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t" } },
            { t: "o" },
            { t: "o", s: { d: [3, 6] } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "b" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "f", be: [1, 6] },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "f", be: [1, 6] },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "t" }, s: { d: [6, 4] } },
            { t: "o", s: { d: [1, 3] } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "b" },
            { t: "o", b: "f", be: [5] },
            { t: "o", b: "f", be: [5, 6] },
            { t: "o", b: "f", be: [5, 6] },
            { t: "o", b: "f", be: [5, 6, 1] },
            { t: "o", b: "f", be: [5, 6] },
            { t: "o", b: "f", be: [6] },
            { t: "o", r: { d: [2, 6], t: "t" } },
            { t: "o", b: "f", be: [5, 6] },
            { t: "o", b: "f", be: [5, 6] },
            { t: "o", b: "f", be: [5, 6] },
            { t: "o", b: "f", be: [5, 6] },
            { t: "o", b: "f", be: [1, 6, 5] },
            { t: "o", b: "f", be: [5, 6] },
            { t: "o", s: { d: [3, 5] } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "b" },
            { t: "b" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "o", r: { d: [3, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "f", be: [1, 2] },
            { t: "g" },
            { t: "g" },
            { t: "o", s: { d: [2, 6] } },
            { t: "o", r: { d: [2, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "o", r: { d: [2, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "f", be: [1, 2] },
            { t: "g" },
            { t: "g" },
            { t: "o", s: { d: [3, 6] } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "w" },
            { t: "w" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [4, 6], t: "t" } },
            { t: "o", r: { d: [1, 3], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "f", be: [1, 2] },
            { t: "g" },
            { t: "g" },
            { t: "o", s: { d: [3, 6] } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", b: "f", be: [5, 6] },
            { t: "o", b: "f", be: [5, 6] },
            { t: "o", b: "f", be: [5, 6] },
          ], [
            { t: "f" },
            { t: "o" },
            { t: "w" },
            { t: "w" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "l" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "s" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", s: { d: [3, 5] } },
            { t: "o", r: { d: [3, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "w" },
            { t: "f" },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "s" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o", s: { d: [2, 5] } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "w" },
            { t: "w" },
            { t: "f" },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "l" } },
            { t: "o", r: { d: [3, 4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 5], t: "t" } },
            { t: "d", d: 2 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", s: { d: [4, 6] } },
            { t: "o", s: { d: [1, 2, 5] } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 1, st: { sh: "l", s: "f" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "w" },
            { t: "w" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "d", d: 2 },
            { t: "o" },
            { t: "o", s: { d: [4, 6] } },
            { t: "o", b: "f", be: [5, 6], s: { d: [1, 4] } },
            { t: "o", b: "f", be: [5, 6], s: { d: [1, 4] } },
            { t: "o", b: "f", be: [6], s: { d: [1, 3] } },
            { t: "o", r: { d: [4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" }, s: { d: [2, 5] } },
            { t: "o", r: { d: [1, 2, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
          ], [
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "o", r: { d: [4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3], t: "t" } },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o" },
            { t: "o", s: { d: [3, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o", s: { d: [2, 4] } },
            { t: "o", s: { d: [1, 4] } },
            { t: "o", s: { d: [1, 4] } },
            { t: "o", s: { d: [1, 4] } },
          ], [
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3], t: "t" } },
            { t: "o", s: { d: [4, 6] } },
            { t: "o", s: { d: [1, 4] } },
            { t: "o", s: { d: [1, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", s: { d: [3, 6] } },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", s: { d: [1, 4] } },
            { t: "o", s: { d: [1, 4] } },
            { t: "w", s: { d: [1, 4] } },
            { t: "w", s: { d: [1, 4] } },
            { t: "o", s: { d: [1, 3] } },
            { t: "o" },
            { t: "o" },
            { t: "o", s: { d: [2, 4] } },
            { t: "o", s: { d: [1, 4] } },
            { t: "o", s: { d: [1, 4] } },
            { t: "o", s: { d: [1, 4] } },
            { t: "o", s: { d: [1, 4] } },
            { t: "o", r: { d: [2, 5], t: "t" }, s: { d: [1, 3] } },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "o", r: { d: [3, 6], t: "t" } },
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
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ],
        ]
      end

      def allied_units
        {
          s: { list: [
            :usa_leader_6_2,
            :usa_leader_5_1,
            [2, :usa_engineer_s],
            [5, :usa_rifle_s],
            [2, :usa_m2_browning],
            :usa_radio_155mm,
            [3, :usa_m3a1_half_track],
            [7, :usa_m4_sherman],
            [3, :usa_m18_hellcat],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end

      def axis_units
        {
          s: { list: [
            :ger_leader_5_1,
            :ger_leader_3_1,
            [9, :ger_rifle_s],
            [3, :ger_mg_42],
            [5, :ger_panther_a_g],
            [3, :ger_jagdpanzer_iv],
            [3, :ger_stug_iv],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end
    end
  end
end
