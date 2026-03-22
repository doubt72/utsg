# frozen_string_literal: true

module Scenarios
  class Scenario101 < Base
    ID = "101"
    NAME = "A Brief Encounter"
    ALLIES = ["uk"].freeze
    AXIS = ["ger"].freeze
    STATUS = ""
    VERSION = "1.0"

    DATE = [1941, 5, 13].freeze
    LAYOUT = [23, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": { list: [
        [6, :uk_cruiser_mk_iv],
      ] },
    }.freeze

    AXIS_UNITS = {
      "0": { list: [
        [3, :ger_pzkpfw_iii__40],
        [2, :ger_pzkpfw_iv_e],
      ] },
    }.freeze

    class << self
      def generate
        {
          turns: 4,
          first_deploy: 2,
          first_action: 1,
          date:,
          location: "Near the Frontier Wire",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "Operation Brevity was a limited British offensive launched in May
          1941. Conceived as a preliminary move ahead of a larger effort to
          relieve the besieged port of Tobruk, its primary aim was to probe
          Axis defenses, seize key terrain, and weaken the already thin German
          and Italian forces holding the frontier. However, the British were
          operating under significant constraints. Recent setbacks had
          depleted the forces available to British, and as a result, the
          attacking force was organized into three relatively small columns
          tasked with advancing along separate axes.",
          "Despite these limitations, the opening phase of the operation
          achieved some success. British forces captured the
          strategically vital Halfaya Pass and secured Fort Capuzzo, both key
          positions controlling movement along the frontier. Meanwhile,
          farther inland in the open desert, elements of the 4th Royal Tank
          Regiment encountered German armored units, including Panzer III and
          Panzer IV tanks. A sharp engagement followed, marking one of the
          earliest clashes between British and German armor in the campaign.",
        ]
      end

      def map_data
        {
          start_weather: "dry",
          base_weather: "dry",
          precip: [0, ""],
          wind: [2, 4, false],
          hexes:,
          layout:,
          allied_dir: 1,
          axis_dir: 4,
          victory_hexes: [
            [1, 1, 2], [4, 6, 2], [10, 6, 2], [14, 7, 2], [18, 5, 1],
          ],
          allied_setup: { "0" => [["18-22", "*"]] },
          axis_setup: { "0" => [["0-4", "*"]] },
          base_terrain: "d",
        }
      end

      def hexes
        [
          [
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "p" } },
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
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "p" } },
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
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "p" } },
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
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "p" } },
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
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "p" } },
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
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "p" } },
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
            { t: "o", r: { d: [4, 6], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 4, 6], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 5], t: "p" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [4, 6], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 3], t: "p" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 3], t: "p" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 4], t: "p" } },
            { t: "o", r: { d: [1, 3], t: "p" } },
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
          ],
        ]
      end
    end
  end
end
