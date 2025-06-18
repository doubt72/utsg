# frozen_string_literal: true

module Scenarios
  class Scenario512 < Base
    ID = "512"
    NAME = "Molon Labe"
    ALLIES = ["gre"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    DATE = [1941, 4, 6].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          :alm_leader_5_1,
          [4, :alm_regular_s],
          [2, :alm_regular_t],
          [2, :alm_vickers_mg],
          [2, :alm_75mm_gun],
          [3, :strongpoint],
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :ger_leader_6_1,
          :ger_leader_5_1,
          [10, :ger_gebirgsjager_s],
          [4, :ger_mg_34],
          :ger_5cm_legrw_36,
          :ger_radio_15cm,
          [2, :ger_pzkpfw_iv_e],
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
          location: "Roupel Pass, Greece",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "The Battle of the Metaxas Line took place in early April 1941 when
          German forces launched a coordinated invasion of northern Greece as
          part of their Balkans Campaign. The Metaxas Line, a chain of
          fortified positions stretching across the Greek-Bulgarian border,
          was designed to defend against northern invasion. Though incomplete,
          it featured dozens of bunkers and fortresses built into mountainous
          terrain, including heavily fortified positions like Fort Roupel.",

          "Despite being outnumbered and facing overwhelming air and artillery
          attacks, Greek defenders mounted a fierce resistance. For several
          days, they held off the German 18th Mountain Corps and 2nd Panzer
          Division with determined infantry, machine gun nests, and
          underground fortifications. The Germans suffered heavy casualties
          trying to breach the line through frontal assaults and mountain
          flanking maneuvers.",

          "Ultimately, the Metaxas Line was not defeated — it was bypassed.
          German forces advancing through Yugoslavia penetrated into central
          Greece, outflanking the defensive line and forcing the Greek
          defenders to surrender to avoid encirclement. Though the line fell,
          the defense became a symbol of Greek bravery and resistance
          against Axis aggression.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [0, 2, false],
          hexes:,
          layout:,
          allied_dir: 1,
          axis_dir: 4,
          victory_hexes: [
            [10, 3, 1], [11, 3, 1], [10, 4, 1], [13, 4, 1], [6, 8, 2],
          ],
          allied_setup: { "0" => [
            ["9-14", "1-2"], ["8-14", "3-5"], ["9-14", 6],
          ] },
          axis_setup: { "0" => [
            ["3-5", "0-2"], ["2-4", "3-5"], ["3-5", "6-7"], ["4-6", "8-10"],
          ] },
          base_terrain: "g",
        }
      end

      def hexes
        [
          [
            { t: "f", h: 2 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "o" },
            { t: "o", s: { d: [2, 5] } },
            { t: "o", r: { d: [2, 5] } },
            { t: "b", h: 1 },
            { t: "b", h: 1 },
            { t: "b", h: 2 },
            { t: "b", h: 2 },
            { t: "b", h: 2 },
            { t: "b", h: 2 },
            { t: "b", h: 2 },
            { t: "b", h: 2 },
            { t: "b", h: 2 },
          ], [
            { t: "f", h: 2 },
            { t: "b", h: 1 },
            { t: "b", h: 1 },
            { t: "o" },
            { t: "o", s: { d: [2, 6] } },
            { t: "o", r: { d: [2, 6] } },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 2 },
            { t: "b", h: 3 },
            { t: "b", h: 3 },
            { t: "b", h: 3 },
            { t: "b", h: 3 },
            { t: "b", h: 3 },
            { t: "b", h: 3 },
          ], [
            { t: "f", h: 2 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "o", s: { d: [4, 6] } },
            { t: "o", s: { d: [1, 3] } },
            { t: "o", r: { d: [3, 6] } },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "b", h: 2 },
            { t: "b", h: 3 },
            { t: "r", h: 4 },
            { t: "r", h: 4 },
            { t: "r", h: 4 },
            { t: "f", h: 4 },
            { t: "f", h: 4 },
          ], [
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "o", s: { d: [3, 6] } },
            { t: "o" },
            { t: "o", r: { d: [3, 6] } },
            { t: "b", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 2 },
            { t: "b", h: 3 },
            { t: "r", h: 4 },
            { t: "o", h: 5, b: "w", be: [1, 2, 3] },
            { t: "o", h: 5, b: "w", be: [2, 3, 4, 5] },
            { t: "f", h: 4 },
            { t: "f", h: 4 },
            { t: "f", h: 4 },
          ], [
            { t: "f", h: 1 },
            { t: "b", h: 1 },
            { t: "o", s: { d: [3, 5] } },
            { t: "o" },
            { t: "o", r: { d: [3, 5] } },
            { t: "b", h: 1 },
            { t: "b", h: 1 },
            { t: "b", h: 2 },
            { t: "b", h: 3 },
            { t: "r", h: 4 },
            { t: "o", h: 5, b: "w", be: [1, 2, 5, 6] },
            { t: "o", h: 5, b: "w", be: [5, 6] },
            { t: "o", h: 5, r: { d: [1, 4] }, b: "c", be: [5, 6] },
            { t: "o", h: 4, r: { d: [1, 4, 6] } },
            { t: "o", h: 4, r: { d: [1, 4] } },
          ], [
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "o", s: { d: [2, 5] } },
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 2 },
            { t: "b", h: 3 },
            { t: "r", h: 4 },
            { t: "o", h: 4, r: { d: [4, 6] } },
            { t: "o", h: 4, r: { d: [1, 4] } },
            { t: "o", h: 4, r: { d: [1, 3] } },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
          ], [
            { t: "f", h: 2 },
            { t: "f", h: 1 },
            { t: "b", h: 1 },
            { t: "o", s: { d: [2, 4] } },
            { t: "o", s: { d: [1, 5] } },
            { t: "o", r: { d: [2, 5] } },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "b", h: 2 },
            { t: "b", h: 3 },
            { t: "o", h: 3, r: { d: [3, 4] } },
            { t: "o", h: 3, r: { d: [1, 5] } },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
          ], [
            { t: "f", h: 2 },
            { t: "f", h: 1 },
            { t: "b", h: 1 },
            { t: "o" },
            { t: "o", s: { d: [2, 5] } },
            { t: "o", r: { d: [2, 5] } },
            { t: "f", h: 1 },
            { t: "b", h: 1 },
            { t: "b", h: 2 },
            { t: "b", h: 2 },
            { t: "b", h: 2 },
            { t: "o", h: 2, r: { d: [6, 2] } },
            { t: "b", h: 2 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
          ], [
            { t: "f", h: 3 },
            { t: "f", h: 2 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "o" },
            { t: "o", s: { d: [2, 5] } },
            { t: "o", r: { d: [2, 4, 5] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", h: 1, r: { d: [1, 4] } },
            { t: "o", h: 1, r: { d: [1, 4] } },
            { t: "o", h: 2, r: { d: [1, 4] } },
            { t: "o", h: 2, r: { d: [1, 3] } },
            { t: "b", h: 2 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
          ], [
            { t: "f", h: 3 },
            { t: "f", h: 2 },
            { t: "f", h: 1 },
            { t: "b", h: 1 },
            { t: "o" },
            { t: "o", s: { d: [2, 6] } },
            { t: "o", r: { d: [2, 6] } },
            { t: "b", h: 1 },
            { t: "b", h: 1 },
            { t: "b", h: 2 },
            { t: "f", h: 2 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
          ], [
            { t: "f", h: 3 },
            { t: "f", h: 2 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "o" },
            { t: "o", s: { d: [3, 6] } },
            { t: "o", r: { d: [3, 6] } },
            { t: "b", h: 1 },
            { t: "b", h: 1 },
            { t: "b", h: 2 },
            { t: "f", h: 2 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
            { t: "f", h: 3 },
          ],
        ]
      end
    end
  end
end
