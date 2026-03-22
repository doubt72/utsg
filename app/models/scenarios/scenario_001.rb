# frozen_string_literal: true

module Scenarios
  class Scenario001 < Base
    ID = "001"
    NAME = "A Straightforward Proposition"
    ALLIES = ["ussr"].freeze
    AXIS = ["ger"].freeze
    STATUS = ""
    VERSION = "1.2"

    DATE = [1944, 6, 25].freeze
    LAYOUT = [15, 11, "x"].freeze

    # TODO: documentation for unit definitions
    ALLIED_UNITS = {
      "0": { list: [
        :ussr_leader_6_2,
        :ussr_leader_4_1,
        [2, :ussr_smg_s],
        [3, :ussr_rifle_s],
        [3, :ussr_rifle_t],
        [2, :ussr_dp_27],
        :ussr_dshk,
      ] },
    }.freeze

    AXIS_UNITS = {
      "0": { list: [
        :ger_leader_5_1,
        :ger_leader_4_1,
        [4, :ger_rifle_s],
        [2, :ger_rifle_t],
        [2, :ger_mg_42],
      ] },
    }.freeze

    class << self
      # TODO: documentation for field descriptions
      def generate
        {
          turns: 7,
          first_deploy: 2,
          first_action: 1,
          date:,
          location: "Bogushevsk, Belarus",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "Operation Bagration was a massive Soviet offensive conducted in
          June, July, and August of 1944 across Byelorussia.  Expecting the main
          Soviet advance to be elsewhere, the German high command had weakened
          Army Group Center, transferring roughly a third of its artillery,
          half of its tank destroyers, and most of its armored forces to
          reinforce Army Group South.",
          "As a result, German defensive lines in Byelorussia were dangerously
          thin. When the Soviet offensive began, these depleted formations
          were unable to withstand the Red Army's assault.  Exploiting faulty
          German assumptions about where the main attack would fall, Soviet
          forces shattered the defenses of Army Group Center and rapidly
          recaptured all of Byelorussia.",
          "This scenario depicts a Soviet clearing operation against a
          localized German force concentration during the Vitebsk-Orsha
          Offensive, one of the opening phases of Operation Bagration.",
        ]
      end

      # TODO: documentation for map definitions
      def map_data
        {
          start_weather: "dry",
          base_weather: "dry",
          precip: [0, ""],
          wind: [1, 1, false],
          hexes:,
          layout:,
          allied_dir: 1,
          axis_dir: 4,
          victory_hexes: [[2, 2, 2], [3, 1, 2], [5, 3, 2], [7, 2, 2], [11, 5, 2]],
          allied_setup: { "0": [[12, "*"], [13, "*"], [14, "*"]] },
          axis_setup: { "0": [
            [0, "*"], [1, "*"], [2, "*"], [3, "*"], [4, "*"], [5, "*"],
            [6, "*"], [7, "*"], [8, "*"], [9, "*"], [10, "*"], [11, "*"],
          ] },
        }
      end

      # TODO: maybe standardize maps?  Maybe not?
      # TODO: think about modularity?
      def hexes
        [
          [
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "b" },
            { t: "b" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l", s: "f" } },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "o", d: 3, st: { sh: "l", s: "f" } },
            { t: "o", r: { d: [4, 6] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "o", d: 2, st: { sh: "l", s: "f" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [4, 6] } },
            { t: "o", r: { d: [1, 4] } },
          ], [
            { t: "o" },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 3, 6] } },
            { t: "o", d: 1, st: { sh: "s", s: "f" } },
            { t: "o", d: 4, st: { sh: "s", s: "f" } },
            { t: "o", d: 1, st: { sh: "l", s: "f" } },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "c" } },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 3, 6] } },
            { t: "f" },
            { t: "f" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "b" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "b" },
            { t: "b" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [1, 3] } },
            { t: "o" },
            { t: "o" },
            { t: "b" },
            { t: "b" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] } },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "b" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [3, 5] } },
            { t: "w" },
            { t: "w" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
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
