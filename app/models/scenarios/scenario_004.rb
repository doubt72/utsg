# frozen_string_literal: true

module Scenarios
  class Scenario004 < Base
    ID = "004"
    NAME = "Into the the Gap"
    ALLIES = ["ussr"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    DATE = [1942, 7, 31].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": { list: [
        :ussr_leader_5_2,
        :ussr_leader_4_1,
        [2, :ussr_smg_s],
        [5, :ussr_rifle_s],
        [2, :ussr_rifle_t],
        :ussr_dp_27,
        :ussr_sg_43,
      ] },
    }.freeze

    AXIS_UNITS = {
      "0": { list: [
        :ger_leader_6_2,
        :ger_leader_4_1,
        [5, :ger_rifle_s],
        [3, :ger_rifle_t],
        [2, :ger_mg_34],
        :ger_5cm_legrw_36,
      ] },
    }.freeze

    class << self
      # TODO: documentation for field descriptions
      def generate
        {
          turns: 6,
          first_deploy: 1,
          first_action: 2,
          date:,
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
          "The battle of Rzhev started with an artillery barrage on the
          morning of July 30th, 1942.  After half an hour of intense
          bombardment, Soviet infantry advanced through heavy rain and quickly
          overran forward German defenses.  The rain (and muddy terrain — it
          had been an unusually wet summer) did the attackers no favors, and
          had additionally limited the ability of the Soviets to bring up
          armor and artillery support.  Regardless, the attack picked up
          momentum and the Soviets made substantial gains, although they were
          eventually brought to a halt by German counter-attacks.",
          "The next day, while the Soviets attempted to resume their advance,
          the Germans had started to hold fast, and were managing to plug what
          gaps had appeared with divisional reserves who were now fighting
          desperate battles to hold the line until help could arrive.",
        ]
      end

      # TODO: documentation for map definitions
      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [3, 2],
          wind: [0, 1, false],
          hexes:,
          layout:,
          allied_dir: 1,
          axis_dir: 4,
          victory_hexes: [
            [2, 3, 2], [6, 6, 2], [7, 1, 2], [10, 9, 1], [12, 8, 1],
          ],
          allied_setup: { "0" => [["9-14", "*"]] },
          axis_setup: { "0" => [["0-5", "*"]] },
          base_terrain: "m",
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
    end
  end
end
