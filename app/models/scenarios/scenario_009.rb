# frozen_string_literal: true

module Scenarios
  class Scenario009 < Base
    ID = "009"
    NAME = "That Sinking Feeling"
    ALLIES = ["ussr"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    DATE = [1941, 10, 17].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          :ussr_leader_4_1,
          [4, :ussr_rifle_s],
          [3, :ussr_rifle_t],
          [2, :ussr_dp_27],
          :ussr_45mm_53_k,
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :ger_leader_5_1,
          [2, :ger_rifle_s],
          [2, :ger_rifle_t],
          [2, :ger_mg_34],
          [2, :ger_pzkpfw_iii_j],
          [2, :ger_pzkpfw_iv_f1],
          :ger_sdkfz_251_1,
        ],
      },
    }.freeze

    class << self
      def generate
        {
          turns: 7,
          first_deploy: 1,
          first_action: 2,
          date:,
          location: "Mozhaisk, Russia",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
          special_rules: [:axis_fragile_vehicles],
        }
      end

      def description
        [
          "The Battle of Mozhaisk, fought in mid-October 1941, was part of the
          German advance on Moscow during Operation Typhoon. Soviet forces,
          using hastily formed defensive lines west of the capital, tried to
          slow the German offensive near the town of Mozhaisk. Despite being
          outnumbered and outmatched, Soviet troops put up fierce resistance.",

          "The battle took place during the Rasputitsa, when autumn rain and snow
          turned roads to mud, severely slowing German tanks and supply
          lines. Though the Germans captured Mozhaisk by the 18th of October,
          the delay allowed the Soviets to reinforce Moscow and contributed to
          the eventual failure of the German campaign.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [1, 3],
          wind: [0, 2, false],
          hexes:,
          layout:,
          allied_dir: 1,
          axis_dir: 4,
          victory_hexes: [
            [2, 4, 2], [9, 6, 1], [11, 9, 1], [12, 1, 1], [12, 3, 1],
          ],
          allied_setup: { "0" => [["4-14", "*"]] },
          axis_setup: { "0" => [["0-2", "*"]] },
          base_terrain: "m",
        }
      end

      def hexes
        [
          [
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
            { t: "o", d: 3.5, st: { sh: "l", s: "f" } },
            { t: "o", r: { d: [4, 6], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
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
            { t: "t" },
            { t: "t" },
            { t: "o", r: { d: [4, 6], t: "p" } },
            { t: "o", r: { d: [1, 3], t: "p" } },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "o", r: { d: [3, 6], t: "p" } },
            { t: "o", d: 1, st: { sh: "l", s: "f" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l", s: "f" } },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "o" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "o", r: { d: [3, 6], t: "p" } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [4, 6], t: "p" } },
            { t: "o", r: { d: [1, 3], t: "p" } },
            { t: "d", d: 3 },
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
            { t: "o", r: { d: [4, 6], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 3, 5], t: "p" } },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [3, 6], t: "p" } },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o", r: { d: [2, 5], t: "p" } },
            { t: "t" },
            { t: "t" },
            { t: "t" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [4, 6], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 3], t: "p" } },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "p" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 3], t: "p" } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "o", r: { d: [2, 5], t: "p" } },
            { t: "o", d: 2, st: { sh: "l", s: "f" } },
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
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [2, 5], t: "p" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ],
        ]
      end
    end
  end
end
