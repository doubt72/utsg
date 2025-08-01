# frozen_string_literal: true

module Scenarios
  class Scenario016 < Base
    ID = "016"
    NAME = "The Tractor Factory"
    ALLIES = ["ussr"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    DATE = [1942, 10, 14].freeze
    LAYOUT = [23, 36, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          :ussr_leader_5_1,
          [2, :ussr_leader_3_1],
          [4, :ussr_rifle_s],
          [4, :ussr_militia_s],
          [4, :ussr_rifle_t],
          [4, :ussr_militia_t],
          [4, :ussr_dp_27],
          [2, :ussr_82_bm_37],
          [2, :ussr_ampulomet],
          [6, :ussr_mc],
          [2, :ussr_t_34_m42_m43],
          [10, :wire],
          :sniper5,
        ],
      },
      "2": {
        list: [
          :ussr_leader_5_1,
          [2, :ussr_guards_smg_s],
          [2, :ussr_guards_rifle_t],
          :ussr_dp_27,
          :ussr_sc,
        ],
      },
      "4": {
        list: [
          :ussr_leader_4_1,
          [8, :ussr_militia_s],
          [2, :ussr_militia_t],
          :ussr_dp_27,
          [4, :ussr_mc],
        ],
      },
      "6": {
        list: [
          :ussr_leader_4_1,
          :ussr_leader_3_1,
          [3, :ussr_rifle_s],
          [4, :ussr_militia_s],
          :ussr_rifle_t,
          [2, :ussr_militia_t],
          [2, :ussr_dp_27],
          [4, :ussr_mc],
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :ger_leader_5_2,
          [3, :ger_leader_4_1],
          [10, :ger_rifle_s],
          [6, :ger_rifle_t],
          [2, :ger_crew_t],
          [4, :ger_mg_34],
          :ger_kz_8cm_grw_42,
          :ger_radio_10_5cm,
          :ger_7_5cm_leig_18,
          :ger_7_5cm_pak_40,
          [2, :ger_pzkpfw_iii_l],
          [2, :ger_pzkpfw_iv_f1],
          :ger_sdkfz_222,
          :sniper4,
        ],
      },
      "3": {
        list: [
          :ger_leader_5_1,
          [3, :ger_pionier_s],
          :ger_rifle_s,
          :ger_pionier_t,
          [3, :ger_rifle_t],
          [2, :ger_mg_34],
          [2, :ger_sc],
          :ger_ft,
          [2, :ger_sdkfz_251_1],
        ],
      },
      "5": {
        list: [
          :ger_leader_5_1,
          [6, :ger_rifle_s],
          [2, :ger_rifle_t],
          [2, :ger_mg_34],
        ],
      },
    }.freeze

    class << self
      def generate
        {
          turns: 9,
          first_deploy: 1,
          first_action: 2,
          date:,
          location: "Stalingrad, Russia",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "In October 1942, German forces attacked the Dzerzhinsky Tractor
          Factory in northern Stalingrad, a major industrial site still
          producing T-34 tanks. The fighting was intense and close-quarters,
          taking place inside the factory’s vast workshops and around its
          rubble-strewn grounds.",

          "Soviet defenders included regular army units, factory workers, and
          tank crews.  Control of parts of the factory shifted repeatedly as
          both sides launched constant assaults and counterattacks.  The area
          became a brutal urban battlefield marked by hand-to-hand combat,
          constant shelling, and high casualties. Despite heavy pressure,
          Soviet forces retained footholds in the complex until the broader
          Soviet counteroffensive in November.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [1, 2, true],
          hexes:,
          layout:,
          allied_dir: 1,
          axis_dir: 4,
          victory_hexes: [
            [2, 11, 2], [2, 34, 2], [15, 4, 1], [15, 7, 1], [13, 8, 1], [15, 12, 1],
            [9, 15, 1], [12, 17, 1], [11, 19, 1], [17, 21, 1], [8, 25, 1], [13, 24, 1],
            [14, 28, 1],
          ],
          allied_setup: {
            "0" => [["4-22", "*"]],
            "2" => [[22, "0-30"]],
            "4" => [[22, "0-30"]],
            "6" => [[22, "0-30"]],
          },
          axis_setup: {
            "0" => [["0-2", "*"]],
            "3" => [[0, "*"]],
            "5" => [[0, "*"]],
          },
          base_terrain: "u",
        }
      end

      def hexes
        [
          [
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", rr: { d: [[2, 5]] } },
            { t: "o", d: 1, st: { sh: "s2" } },
            { t: "o", d: 1, st: { sh: "m2" } },
            { t: "o", d: 4, st: { sh: "s2" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "s2" } },
            { t: "o", d: 1, st: { sh: "m2" } },
            { t: "o", d: 4, st: { sh: "s2" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "m2" } },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "m2" } },
            { t: "o" },
            { t: "x" },
            { t: "x" },
            { t: "x" },
            { t: "x" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", rr: { d: [[2, 5]] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "s2" } },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "s2" } },
            { t: "o" },
            { t: "x" },
            { t: "x" },
            { t: "x" },
            { t: "x" },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "s2" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", d: 5, st: { sh: "s2" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", rr: { d: [[2, 5]] } },
            { t: "o", d: 1, st: { sh: "s2" } },
            { t: "o", d: 1, st: { sh: "m2" } },
            { t: "o", d: 4, st: { sh: "s2" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "s2" } },
            { t: "o", d: 1, st: { sh: "m2" } },
            { t: "o", d: 4, st: { sh: "s2" } },
            { t: "o", r: { d: [4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "m2" } },
            { t: "o" },
            { t: "x" },
          ], [
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", rr: { d: [[2, 5]] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o", rr: { d: [[4, 6]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 5]] } },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "o", d: 6, st: { sh: "s2" } },
            { t: "o" },
            { t: "x" },
            { t: "x" },
          ], [
            { t: "o" },
            { t: "o", d: 2, st: { sh: "s2" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", rr: { d: [[2, 5]] } },
            { t: "o", d: 1, st: { sh: "s2" } },
            { t: "o", d: 1, st: { sh: "m2" } },
            { t: "o", d: 4, st: { sh: "s2" } },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", d: 3, st: { sh: "s2" } },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "bc2" } },
            { t: "o", d: 3, st: { sh: "bs1" } },
            { t: "o" },
            { t: "o", rr: { d: [[2, 5]] } },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "x" },
            { t: "x" },
          ], [
            { t: "o" },
            { t: "o", d: 2, st: { sh: "m2" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", rr: { d: [[2, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", r: { d: [3, 6], t: "t" }, rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[3, 6], [1, 3]] } },
            { t: "o", d: 6, st: { sh: "s2" } },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "bc1" } },
            { t: "o", d: 3, st: { sh: "bm" } },
            { t: "o", d: 3, st: { sh: "bs4" } },
            { t: "o", d: 3, st: { sh: "bs1" } },
            { t: "o", rr: { d: [[2, 5]] } },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "o", r: { d: [3, 6], t: "t" } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", d: 5, st: { sh: "s2" } },
            { t: "o", r: { d: [2, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3], t: "t" } },
            { t: "o", d: 3, st: { sh: "s2" } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o", r: { d: [1, 6], c: "l", t: "t", r: 5 } },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "bs1" } },
            { t: "o", d: 6, st: { sh: "bs4" } },
            { t: "o", d: 3, st: { sh: "bm" } },
            { t: "o", d: 3, st: { sh: "bc1" } },
            { t: "o", rr: { d: [[2, 5], [2, 6]] } },
            { t: "o" },
            { t: "x" },
            { t: "x" },
            { t: "o", r: { d: [3, 4], t: "t", c: "r", r: 5 } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "s2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "m2" } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", d: 3, st: { sh: "s2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", r: { d: [3, 5], c: "r", t: "t", r: 5 } },
            { t: "o", r: { d: [2, 6], c: "l", t: "t", r: 5 } },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "bs1" } },
            { t: "o", d: 3, st: { sh: "bc2" } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", rr: { d: [[2, 5], [2, 6]] } },
            { t: "o" },
            { t: "x" },
            { t: "x" },
            { t: "o", d: 3, st: { sh: "s2" } },
          ], [
            { t: "o" },
            { t: "o", d: 3, st: { sh: "s2" } },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "m2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "s2" } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", d: 3, st: { sh: "m2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "bc2" } },
            { t: "o", d: 3, st: { sh: "bs1" } },
            { t: "o", r: { d: [3, 5], c: "r", t: "t", r: 5 } },
            { t: "o", r: { d: [1, 2, 6], c: "l", t: "t", r: 5 } },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", rr: { d: [[2, 5]] } },
            { t: "o" },
            { t: "x" },
            { t: "o", d: 3, st: { sh: "m2" } },
          ], [
            { t: "o", d: 6, st: { sh: "s2" } },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "s2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", d: 6, st: { sh: "s2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "bs2" } },
            { t: "o", d: 3, st: { sh: "bm" } },
            { t: "o", d: 3, st: { sh: "bc1" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", r: { d: [3, 5], c: "r", t: "t", r: 5 } },
            { t: "o", rr: { d: [[3, 6]] }, r: { d: [2, 6], c: "l", t: "t", r: 5 } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o", rr: { d: [[2, 5], [2, 6]] } },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "s2" } },
            { t: "o", rr: { d: [[3, 6]] } },
          ], [
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "bs2" } },
            { t: "o", d: 3, st: { sh: "bm" } },
            { t: "o", d: 3, st: { sh: "bs2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", rr: { d: [[3, 6]] }, r: { d: [3, 5], c: "r", t: "t", r: 5 } },
            { t: "o", r: { d: [2, 1], c: "l", t: "t", r: 5 } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", rr: { d: [[2, 5]] } },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
          ], [
            { t: "o", d: 1.5, st: { sh: "l2" } },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [1, 2, 4, 6], t: "t", c: "l", r: 5 } },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "w", be: [1] },
            { t: "o", d: 3, st: { sh: "l2" } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", d: 3, st: { sh: "s2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "bs2" } },
            { t: "o", d: 3, st: { sh: "bm" } },
            { t: "o", d: 3, st: { sh: "bs2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "bc2" } },
            { t: "o", d: 3, st: { sh: "bs1" } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o", rr: { d: [[2, 6]] } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", r: { d: [3, 6], t: "t" } },
          ], [
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3, 6], t: "t" } },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "o", b: "w", be: [1, 2] },
            { t: "o", d: 3, st: { sh: "l2" } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", d: 3, st: { sh: "m2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "bs2" } },
            { t: "o", d: 3, st: { sh: "bm" } },
            { t: "o", d: 3, st: { sh: "bs2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "bc4" } },
            { t: "o", d: 6, st: { sh: "bs4" } },
            { t: "o", d: 3, st: { sh: "bc1" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", r: { d: [3, 6], t: "t" } },
          ], [
            { t: "o", d: 3, st: { sh: "s2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 }, b: "w", be: [1] },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", d: 6, st: { sh: "s2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "bs2" } },
            { t: "o", d: 3, st: { sh: "bm" } },
            { t: "o", d: 3, st: { sh: "bs2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "bc3" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "s2" } },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6], [6, 4]] } },
            { t: "o", rr: { d: [[1, 3]] } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "s2" } },
          ], [
            { t: "o", d: 6, st: { sh: "m2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "f" },
            { t: "o" },
            { t: "o", b: "w", be: [1, 2] },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 }, rr: { d: [[3, 6]] } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "bc1" } },
            { t: "o", d: 3, st: { sh: "bm" } },
            { t: "o", d: 3, st: { sh: "bs2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "bc2" } },
            { t: "o", d: 3, st: { sh: "bs1" } },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "m2" } },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "x" },
            { t: "o", r: { d: [1, 4, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
          ], [
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "f" },
            { t: "f" },
            { t: "o", b: "w", be: [2] },
            { t: "o", d: 3, st: { sh: "l2" } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o", r: { d: [1, 3, 4, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "o", d: 6, st: { sh: "bs1" } },
            { t: "o", d: 3, st: { sh: "bc2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "bs2" } },
            { t: "o", d: 3, st: { sh: "bm" } },
            { t: "o", d: 3, st: { sh: "bc1" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "s2" } },
            { t: "o", d: 3, st: { sh: "s2" } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "x" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "s2" } },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
          ], [
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "l2" } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "s2" } },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "bc1" } },
            { t: "o", d: 3, st: { sh: "bm" } },
            { t: "o", d: 3, st: { sh: "bs2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "s2" } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", d: 1.5, st: { sh: "l2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "m2" } },
            { t: "d", d: 3 },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "m2" } },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "s2" } },
            { t: "o", r: { d: [1, 3, 4, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "o", d: 6, st: { sh: "bs1" } },
            { t: "o", d: 3, st: { sh: "bc2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", d: 1.5, st: { sh: "l2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "s2" } },
            { t: "d", d: 3 },
            { t: "o", d: 6, st: { sh: "m2" } },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "s2" } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "m2" } },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "m2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "bc3" } },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", d: 6, st: { sh: "s2" } },
          ], [
            { t: "f" },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "m2" } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "m2" } },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "m2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "bs2" } },
            { t: "o", d: 3, st: { sh: "bs4" } },
            { t: "o", d: 3, st: { sh: "bc4" } },
            { t: "o", r: { d: [3, 4, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "x" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "s2" } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "d", d: 3 },
          ], [
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "s2" } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "m2" } },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "m2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "bs2" } },
            { t: "o", d: 3, st: { sh: "bm" } },
            { t: "o", d: 3, st: { sh: "bs2" } },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 }, rr: { d: [[3, 6]] } },
            { t: "x" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "m2" } },
            { t: "d", d: 3 },
            { t: "o", d: 3, st: { sh: "s2" } },
            { t: "d", d: 3 },
          ], [
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "o", rr: { d: [[3, 5]] } },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "s2" } },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "m2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "bs2" } },
            { t: "o", d: 3, st: { sh: "bm" } },
            { t: "o", d: 3, st: { sh: "bs2" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [1, 2, 4, 6], t: "t", c: "l", r: 5 } },
            { t: "o", d: 6, st: { sh: "s2" } },
            { t: "d", d: 3 },
            { t: "o", d: 6, st: { sh: "m2" } },
            { t: "d", d: 3 },
            { t: "o", d: 3, st: { sh: "s2" } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 }, rr: { d: [[2, 5]] } },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "m2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "bs2" } },
            { t: "o", d: 3, st: { sh: "bm" } },
            { t: "o", d: 3, st: { sh: "bs2" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "o", d: 6, st: { sh: "s2" } },
            { t: "d", d: 3 },
            { t: "o", d: 6, st: { sh: "m2" } },
          ], [
            { t: "o" },
            { t: "o", d: 3, st: { sh: "s2" } },
            { t: "o" },
            { t: "o", rr: { d: [[2, 5]] }, r: { d: [3, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 }, rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "s2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "bs2" } },
            { t: "o", d: 3, st: { sh: "bm" } },
            { t: "o", d: 3, st: { sh: "bs2" } },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "bc2" } },
            { t: "o", d: 3, st: { sh: "bc4" } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", d: 3, st: { sh: "s2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o", h: -1 },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "o", d: 6, st: { sh: "s2" } },
            { t: "d", d: 3 },
          ], [
            { t: "o" },
            { t: "o", d: 6, st: { sh: "s2" } },
            { t: "o" },
            { t: "o" },
            { t: "o", rr: { d: [[2, 5], [3, 5]] } },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 }, rr: { d: [[3, 6]] } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "bc1" } },
            { t: "o", d: 3, st: { sh: "bm" } },
            { t: "o", d: 3, st: { sh: "bs2" } },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "bs2" } },
            { t: "o", d: 3, st: { sh: "bs2" } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", d: 6, st: { sh: "s2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 3, st: { sh: "s2" } },
            { t: "o" },
            { t: "o", h: -1 },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", rr: { d: [[2, 5]] } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", r: { d: [3, 4, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "o", d: 6, st: { sh: "bs1" } },
            { t: "o", d: 3, st: { sh: "bc2" } },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "bc4" } },
            { t: "o", d: 3, st: { sh: "bc2" } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "x" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 6, st: { sh: "s2" } },
            { t: "o" },
            { t: "x" },
            { t: "o", h: -1 },
            { t: "o", h: -1 },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "bc2" } },
            { t: "o", d: 3, st: { sh: "bs1" } },
            { t: "o", rr: { d: [[2, 5], [3, 5]] } },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 }, rr: { d: [[3, 6]] } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 } },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "x" },
            { t: "o", r: { d: [3, 4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 5], t: "t" } },
            { t: "o" },
            { t: "x" },
            { t: "x" },
            { t: "o", h: -1 },
            { t: "o", h: -1 },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "bs2" } },
            { t: "o", d: 3, st: { sh: "bm" } },
            { t: "o", d: 3, st: { sh: "bc1" } },
            { t: "o", rr: { d: [[2, 6], [4, 6]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 3]] } },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t", c: "r", r: 5 } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l", r: 5 }, rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "x" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 1, st: { sh: "t" } },
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o" },
            { t: "x" },
            { t: "x" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "bc1" } },
            { t: "o", d: 3, st: { sh: "bm" } },
            { t: "o", d: 3, st: { sh: "bs2" } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o", r: { d: [3, 5, 6], t: "t" } },
            { t: "o", d: 1, st: { sh: "t" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "t" } },
            { t: "o", r: { d: [2, 4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 5], t: "t" } },
            { t: "o", h: -1 },
            { t: "o", h: -1 },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "bs1" } },
            { t: "o", d: 3, st: { sh: "bc2" } },
            { t: "o", rr: { d: [[3, 6], [4, 6]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4], [1, 3]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 3]] } },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "t" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", d: 1, st: { sh: "t" } },
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o" },
            { t: "o", h: -1 },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "s2" } },
            { t: "o", d: 4, st: { sh: "s2" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o", r: { d: [2, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3, 5], t: "t" } },
            { t: "o", d: 1, st: { sh: "t" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "t" } },
            { t: "o", r: { d: [2, 6], t: "t" } },
            { t: "o", h: -1 },
          ], [
            { t: "x" },
            { t: "x" },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1.5, st: { sh: "l2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "x" },
            { t: "x" },
            { t: "x" },
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "t" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o", h: -1 },
            { t: "w", h: -1 },
          ], [
            { t: "x" },
            { t: "x" },
            { t: "x" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o" },
            { t: "x" },
            { t: "x" },
            { t: "x" },
            { t: "x" },
            { t: "o" },
            { t: "o", d: 1.5, st: { sh: "l2" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "x" },
            { t: "x" },
            { t: "x" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3], t: "t" } },
            { t: "o", h: -1 },
            { t: "w", h: -1 },
          ], [
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 4]] } },
            { t: "o", rr: { d: [[1, 3]] } },
            { t: "o" },
            { t: "o" },
            { t: "x" },
            { t: "x" },
            { t: "x" },
            { t: "x" },
            { t: "x" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "x" },
            { t: "x" },
            { t: "x" },
            { t: "o", h: -1 },
            { t: "w", h: -1 },
            { t: "w", h: -1 },
          ], [
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: -1 },
            { t: "o", h: -1 },
            { t: "w", h: -1 },
            { t: "w", h: -1 },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "s2" } },
            { t: "o", d: 4, st: { sh: "s2" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "s2" } },
            { t: "o", d: 4, st: { sh: "s2" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: -1 },
            { t: "w", h: -1 },
            { t: "w", h: -1 },
            { t: "w", h: -1 },
          ],
        ]
      end
    end
  end
end
