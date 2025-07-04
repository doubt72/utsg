# frozen_string_literal: true

module Scenarios
  class Scenario012 < Base
    ID = "012"
    NAME = "Iron Winter"
    ALLIES = ["ussr"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    DATE = [1941, 11, 18].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          :ussr_leader_4_1,
          [4, :ussr_rifle_s],
          [2, :ussr_rifle_t],
          :ussr_crew_t,
          :ussr_dp_27,
          :ussr_dshk,
          :ussr_45mm_53_k,
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :ger_leader_5_2,
          [2, :ger_rifle_s],
          [2, :ger_rifle_t],
          [2, :ger_mg_34],
          :ger_pzkpfw_iii__40,
          :ger_pzkpfw_iv_e,
          :ger_stug_iii_a,
        ],
      },
    }.freeze

    class << self
      def generate
        {
          turns: 6,
          first_deploy: 1,
          first_action: 2,
          date:,
          location: "Tula, Russia",
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
          "As the Germans began their final attempt to capture Moscow, they
          attempted to break through in pincer attacks from the north and the
          south in an attempt to surround it.  The southern attacks were
          concentrated near Tula, where the Germans attempted to encircle and
          then bypass the city before proceeding to the east and north.",
          "The German forces involved were extremely battered from previous
          fighting and still had no winter clothing. As a result, initial
          German progress was only a few miles per day.  Moreover, it exposed
          the German tank armies to flanking attacks from the Soviet armies
          located near Tula, further slowing the advance.  The Germans were
          nevertheless able to continue the offensive, eventually taking
          Stalinogorsk and surrounding a Soviet rifle division stationed there
          before eventually being stopped.",
          "Tula itself was never taken, and the Wehrmacht never got close to
          the capital from the south.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [0, 4, false],
          hexes:,
          layout:,
          allied_dir: 1,
          axis_dir: 4,
          victory_hexes: [
            [3, 1, 1], [7, 1, 1], [11, 1, 1], [11, 5, 1], [11, 8, 1],
          ],
          allied_setup: { "0" => [["4-14", "*"]] },
          axis_setup: { "0" => [["0-2", "*"]] },
          base_terrain: "s",
        }
      end

      def hexes
        [
          [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", d: 1, st: { sh: "l2", s: "f" } },
            { t: "o" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4, 5] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "f" },
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
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
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
            { t: "o", r: { d: [2, 5] } },
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
            { t: "d", d: 3 },
            { t: "o", r: { d: [2, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
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
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
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
            { t: "o" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o", d: 3, st: { sh: "l2", s: "f" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
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
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ],
        ]
      end
    end
  end
end
