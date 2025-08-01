# frozen_string_literal: true

module Scenarios
  class Scenario105 < Base
    ID = "105"
    NAME = "The Crumbling"
    ALLIES = ["uk"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    DATE = [1942, 10, 24].freeze
    LAYOUT = [23, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": { list: [
        :uk_leader_5_2,
        :uk_leader_4_1,
        [3, :uk_engineer_s],
        [4, :uk_line_s],
        [2, :uk_line_t],
        [2, :uk_lewis_gun],
        :uk_radio_114mm,
        [2, :uk_valentine_i_vii],
        [4, :uk_valentine_iii_cs],
      ] },
    }.freeze

    AXIS_UNITS = {
      "0": { list: [
        :ger_leader_6_1,
        :ger_leader_5_1,
        [2, :ger_rifle_s],
        [2, :ger_rifle_t],
        [2, :ger_elite_crew_t],
        :ger_mg_34,
        :ger_mg_08_15,
        [2, :ger_5cm_pak_38],
        [6, :wire],
        [6, :at_mines8],
        [3, :pillbox],
      ] },
    }.freeze

    class << self
      def generate
        {
          turns: 7,
          first_deploy: 2,
          first_action: 1,
          date:,
          location: "El Alamein, Egypt",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
          special_rules: [
            "infantry_wire_clearing", "armored_wire_clearing", "engineer_mine_clearing",
          ],
        }
      end

      def description
        [
          "On the 23rd of October, 1942 the British attack at El Alamein
          began.  The first phase was a massive general bombardment, followed
          by precision artillery support in support of advancing infantry. The
          plan was for the infantry (since they wouldn't set off anti-tank
          mines) to clear narrow paths for tanks coming behind. The minefields
          turned out to be exceptionally difficult and dangerous to clear,
          proving much deeper and more extensive than initially anticipated,
          and clearing them was additionally hampered by defensive fire by the
          defending troops.  In addition, the tanks following in the cleared
          paths stirred up so much dust that there was no visibility at all,
          and traffic jams developed with tanks getting bogged down.",
          "Clearing continued the next day in parts of the battlefield,
          fighting was intense at points where the British attacked or the
          Germans counter-attacked, but overall not much progress was made
          beyond the minefields that had been penetrated that day either; the
          battle remained one of attrition, not maneuver.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [1, 4, false],
          hexes:,
          layout:,
          allied_dir: 1,
          axis_dir: 4,
          victory_hexes: [
            [1, 8, 2], [3, 2, 2], [8, 5, 2], [12, 9, 2], [19, 3, 1],
          ],
          allied_setup: { "0" => [["15-22", "*"]] },
          axis_setup: { "0" => [["0-12", "*"]] },
          base_terrain: "d",
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
            { t: "o" },
            { t: "o" },
            { t: "r" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "s" },
            { t: "o", h: 1 },
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
            { t: "r" },
            { t: "r" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
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
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "r" },
            { t: "r" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
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
            { t: "r" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "s" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
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
            { t: "r" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
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
            { t: "s" },
            { t: "s" },
            { t: "s" },
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
            { t: "s" },
            { t: "s" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "r" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "r" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "r" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "s" },
            { t: "s" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "r" },
            { t: "r" },
            { t: "o" },
          ],
        ]
      end
    end
  end
end
