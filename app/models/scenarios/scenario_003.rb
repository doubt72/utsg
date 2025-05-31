# frozen_string_literal: true

module Scenarios
  class Scenario003 < Base
    ID = "003"
    NAME = "Speed Bump"
    ALLIES = ["ussr"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    DATE = [1941, 7, 10].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": { list: [
        :ussr_leader_4_1,
        :ussr_leader_3_1,
        [5, :ussr_rifle_s],
        [2, :ussr_crew_t],
        :ussr_dp_27,
        :ussr_82_bm_37,
        [2, :ussr_45mm_19_k],
      ] },
    }.freeze

    AXIS_UNITS = {
      "0": { list: [
        :ger_leader_5_1,
        :ger_leader_4_1,
        [5, :ger_rifle_s],
        :ger_mg_34,
        [3, :ger_pzkpfw_iii__40],
      ] },
    }.freeze

    class << self
      def generate
        {
          turns: 6,
          first_setup: 1,
          first_move: 2,
          date:,
          location: "Mogilev, Belarus",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "After a massive Soviet counterattack against German Army Group
          Center failed, and multiple Soviet armies had been encircled and
          destroyed just to the east, German forces were closing in on
          Smolensk from multiple directions.  However, several armies had
          managed to escape that pocket and were reforming to defend the city,
          and the rapid advances into Soviet territory were starting to cause
          logistical crises of increasing severity.",
          "Here, a small Soviet detachment attempts to slow German armor as
          best they can to buy time to establish a new defensive line.",
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
          victory_hexes: [[1, 3, 2], [4, 4, 1], [6, 6, 1], [11, 6, 1], [13, 8, 1]],
          allied_setup: { "0": [
            [3, "*"], [4, "*"], [5, "*"], [6, "*"], [7, "*"], [8, "*"], [9, "*"], [10, "*"],
            [11, "*"], [12, "*"], [13, "*"], [14, "*"],
          ] },
          axis_setup: { "0": [
            [0, "*"], [1, "*"], [2, "*"],
          ] },
        }
      end

      def hexes
        [
          [
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "b", h: 1 },
            { t: "b", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "f", h: 1 },
          ], [
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "b" },
            { t: "b" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "b" },
            { t: "b" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
          ], [
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "b" },
            { t: "b" },
            { t: "o", h: 1 },
            { t: "f", h: 1 },
            { t: "b" },
            { t: "b" },
            { t: "o" },
            { t: "f" },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
          ], [
            { t: "o", r: { d: [1, 4] } },
            { t: "f", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "f", h: 1 },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l", s: "f" } },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "o", r: { d: [2, 5] } },
            { t: "b" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o", d: 1, st: { sh: "c" } },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "f" },
            { t: "f" },
            { t: "f", h: 1 },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "o" },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "o", r: { d: [2, 5] } },
            { t: "f" },
            { t: "f" },
            { t: "f", h: 1 },
          ], [
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "b" },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "o", r: { d: [2, 5] } },
            { t: "o", d: 2, st: { sh: "l", s: "f" } },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "b" },
            { t: "b" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
          ], [
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "f", h: 1 },
            { t: "f" },
            { t: "f" },
            { t: "f" },
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
