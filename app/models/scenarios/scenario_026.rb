# frozen_string_literal: true

module Scenarios
  class Scenario026 < Base
    ID = "026"
    NAME = "The Grain Elevator"
    ALLIES = ["ussr"].freeze
    AXIS = ["ger"].freeze
    STATUS = "b"
    VERSION = "0.1"

    DATE = [1942, 9, 21].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": { list: [
        :ussr_leader_4_1,
        [2, :ussr_rifle_s],
        :ussr_smg_s,
        :ussr_dshk,
        :ussr_pm_m1910,
        [2, :ussr_decoy_leader6],
        [6, :ussr_decoy_squad4_s],
        [2, :ussr_decoy_weapon2],
        :ussr_decoy_weapon1,
        :ussr_ampulomet,
      ] },
    }.freeze

    AXIS_UNITS = {
      "0": { list: [
        :ger_leader_5_1,
        :ger_leader_4_1,
        [5, :ger_rifle_s],
        [2, :ger_mg_34],
        [2, :ger_sc],
        [2, :ger_pzkpfw_iii_j],
        :ger_radio_15cm,
      ] },
      "3": { list: [
        :ger_leader_5_1,
        [3, :ger_rifle_s],
        :ger_mg_34,
        :ger_ft,
        :ger_sc,
        :ger_stug_iii_b_e,
        :ger_pzkpfw_iv_f1,
      ] },
    }.freeze

    class << self
      def generate
        {
          turns: 5,
          first_deploy: 1,
          first_action: 2,
          date:,
          location: "Stalingrad, Russia",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
          special_rules: ["allied_hidden_units"],
        }
      end

      def description
        [
          "The Stalingrad Grain Elevator was (and is) a massive,
          steel-reinforced concrete structure built in 1940, measuring 90
          meters long, 50 meters wide, and 35 meters high. Located in the
          southern part of the city, it served as one of the most iconic and
          heavily fortified defensive positions during the Battle of
          Stalingrad.",
          "Despite being cut off from supplies, and under heavy artillery
          bombardment, a small group of Red Army defenders held the elevator
          against German attacks for five days until food and ammunition ran
          out. The elevator's fierce defense was so notable that German Field
          Marshal Friedrich Paulus selected its image for the proposed
          Stalingrad Shield (Stalingradschild) medal, which was never awarded
          due to the German defeat. Today the building remains in Volgograd
          and continues to function as an active grain storage facility, with
          visible battle damage preserved.",
        ]
      end

      def map_data
        {
          start_weather: "dry",
          base_weather: "dry",
          precip: [0, "rain"],
          wind: [3, 5, true],
          hexes:,
          layout:,
          allied_dir: 1.5,
          axis_dir: 4.5,
          victory_hexes: [
            [4, 6, 2], [11, 2, 1], [9, 5, 1], [11, 4, 1], [8, 8, 1],
          ],
          allied_setup: {
            "0" => [["11-12", 2], ["10-11", 3], ["10-11", 4], ["9-10", 5], [9, 6], [8, 7], [8, 8]],
          },
          axis_setup: {
            "0" => [
              ["0-8", 0], ["0-7", "1-2"], ["0-6", "3-4"], ["0-5", "5-6"], ["0-4", "7-8"],
              ["0-3", "9-10"],
            ],
            "3" => [[0, "*"]],
          },
          base_terrain: "u",
        }
      end

      def hexes
        [
          [
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "x" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o" },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", st: { sh: "l2", s: "f" }, d: 1.5 },
            { t: "o", r: { t: "t", d: [2, 6], c: "l", r: 2 } },
            { t: "o", r: { t: "t", d: [3, 5], c: "r", r: 2 } },
          ],
          [
            { t: "x" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o" },
            { t: "x" },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o" },
            { t: "o", st: { sh: "l2", s: "u" }, d: 3 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", st: { sh: "l2", s: "f" }, d: 1.5 },
            { t: "o", r: { t: "t", d: [1, 2, 4, 6], c: "l", r: 2 } },
          ],
          [
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "x" },
            { t: "o" },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", st: { sh: "bc2", s: "u" }, d: 6 },
            { t: "o", st: { sh: "bc4", s: "u" }, d: 3 },
            { t: "o" },
            { t: "o", r: { t: "t", d: [3, 6] } },
          ],
          [
            { t: "o", rr: { d: [[3, 6]] }, r: { t: "t", d: [3, 5], c: "r", r: 2 } },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o" },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o", st: { sh: "bs2", s: "u" }, d: 6 },
            { t: "o", st: { sh: "bs2", s: "u" }, d: 3 },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "s2", s: "u" }, d: 3 },
          ],
          [
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", r: { t: "t", d: [1, 2, 4, 6], c: "l", r: 2 } },
            { t: "o", r: { t: "t", d: [3, 5], c: "r", r: 2 } },
            { t: "o" },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o", st: { sh: "bs2", s: "u" }, d: 6 },
            { t: "o", st: { sh: "bs2", s: "u" }, d: 3 },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "s2", s: "u" }, d: 6 },
          ],
          [
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o", r: { t: "t", d: [2, 6], c: "l", r: 2 } },
            { t: "o", r: { t: "t", d: [3, 5], c: "r", r: 2 } },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o" },
            { t: "o", st: { sh: "l2", s: "u" }, d: 3 },
            { t: "o" },
            { t: "o", st: { sh: "bc4", s: "u" }, d: 6 },
            { t: "o", st: { sh: "bc2", s: "u" }, d: 3 },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o" },
            { t: "f" },
          ],
          [
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o" },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o", r: { t: "t", d: [1, 4, 6], c: "l", r: 2 } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", st: { sh: "s2", s: "u" }, d: 3 },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "s2", s: "u" }, d: 3 },
            { t: "f" },
          ],
          [
            { t: "o" },
            { t: "o" },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o", st: { sh: "m2", s: "u" }, d: 3 },
            { t: "o", rr: { d: [[3, 6], [4, 6]] } },
            { t: "o", rr: { d: [[3, 1]] } },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "s2", s: "u" }, d: 6 },
            { t: "f" },
            { t: "f" },
          ],
          [
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o", st: { sh: "s2", s: "u" }, d: 6 },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "f" },
          ],
          [
            { t: "o" },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o" },
            { t: "x" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "x" },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "s2", s: "u" }, d: 3 },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "f" },
          ],
          [
            { t: "o" },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "l", s: "f" }, d: 3 },
            { t: "x" },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o", st: { sh: "l2", s: "f" }, d: 1.5 },
            { t: "o", rr: { d: [[3, 6]] } },
            { t: "x" },
            { t: "o", r: { t: "t", d: [3, 6] } },
            { t: "o", st: { sh: "s2", s: "u" }, d: 6 },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "f" },
          ],
        ]
      end
    end
  end
end
