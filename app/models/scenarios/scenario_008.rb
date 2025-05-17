# frozen_string_literal: true

module Scenarios
  class Scenario008 < Base
    ID = "008"
    NAME = "Surpise! KV"
    ALLIES = ["ussr"].freeze
    AXIS = ["ger"].freeze
    STATUS = "a"

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
          "When the Germans first encountered Soviet KV-1 tanks, they came as a
          surprise. They were completely unaware of their existence until
          encountering them in the feild, and the discovery was not a pleasant
          one.  The KV's heavy armor was practically immune to the guns the
          German tanks mounted at the time, and the larger guns of the KV
          tanks could easily make short work of the less-armored German tanks
          in turn.  The Germans referred to the the tank as the \"Russischer
          Koloss\" — \"Russian Colossus\".",
          "Germans first faced them in the Battle of Raseiniai, just after the
          start of Operation Barbarossa.  While the tanks were difficult to
          kill, the Germans were able to outflank them or destroy them with
          explosive charges or point-blank fire.  The tanks were not without
          their flaws, they were difficult to steer and the transmissions were
          terrible, the ergonomics were also bad and visibility was very poor.
          They were ultimately inferior to the T-34 — another tank that was
          also an unpleasant surprise to the Germans.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [1, 5, false],
          hexes:,
          layout: [15, 11, "x"],
          allied_edge: "r",
          axis_edge: "l",
          victory_hexes: [[2, 3, 2], [9, 6, 1], [10, 8, 1], [11, 9, 1], [13, 4, 1]],
          allied_setup: { "0": [
            [4, "*"], [5, "*"], [6, "*"], [7, "*"], [8, "*"], [9, "*"], [10, "*"],
            [11, "*"], [12, "*"], [13, "*"], [14, "*"],
          ] },
          axis_setup: { "0": [
            [0, "*"], [1, "*"], [2, "*"], [3, "*"],
          ] },
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
          "0": { list: [
            :ussr_leader_3_1,
            [4, :ussr_rifle_s],
            :ussr_dp_27,
            [2, :ussr_kv_1_m40],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end

      def axis_units
        {
          "0": { list: [
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
