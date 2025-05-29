# frozen_string_literal: true

module Scenarios
  class Scenario501 < Base
    ID = "501"
    NAME = "Raate Road"
    ALLIES = ["ussr"].freeze
    AXIS = ["fin"].freeze
    STATUS = "p"

    DATE = [1940, 1, 1].freeze
    LAYOUT = [23, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": { list: [
        :ussr_leader_4_1,
        [6, :ussr_rifle_s],
        [2, :ussr_dp_27],
        :ussr_t_26_m38,
        :ussr_ba_20,
      ] },
    }.freeze

    AXIS_UNITS = {
      "0": { list: [
        :fin_leader_6_1,
        :fin_leader_5_1,
        [8, :fin_sissi_s],
        [2, :fin_ls_26],
        :fin_14_mm_pst_kiv_37,
      ] },
    }.freeze

    class << self
      def generate
        {
          turns: 5,
          first_setup: 1,
          first_move: 2,
          date:,
          location: "Suomussalmi, Finland",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
          special_rules: ["winter", "axis_ignore_snow"],
        }
      end

      def description
        [
          "On the 30th of November 1939, the Soviet 163rd Rifle Division
          crossed the border into Finland.  The Soviet objective was to
          advance all the way across Finland, cutting it in half.  The initial
          objective was Suomussalmi.  The Finns were initially unable to stop
          the Soviet advance, as they were outnumbered and had very little
          with which to counter Soviet armor, but ultimately the bitter cold
          of the Finnish winter and difficult logistics over limited roads was
          an even greater challenge, and the Finns were entirely prepared to
          turn it to their advantage.  On the 7th of December, the 163rd took
          Suomussalmi, but the victory was short-lived.  On the 9th of
          December Finnish reinforcements had arrived, and by the 11th Raate
          Road was cut off.  Soon the Soviets were completely cut off, and
          then Finnish artillery arrived.  By the end of December, the 163rd
          had been completely annihilated.",
          "In the meantime, however, the Soviets had sent the 44th Rifle
          Division to relieve the cut off 163rd.  As it advanced, not being
          equipped with skis, the deep snow forced it to stay on the road.
          Once Finnish radio intelligence had confirmed that the entire
          division had entered the road, the more mobile (ski-equipped) and
          now better-armed Finns were able to annihilate the entire unit
          piecemeal.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [2, 3],
          wind: [1, 5, false],
          hexes:,
          layout:,
          allied_edge: "r",
          axis_edge: "l",
          victory_hexes: [
            [1, 4, 2], [2, 5, 2], [8, 5, 1], [13, 5, 1], [18, 5, 1],
          ],
          allied_setup: { "0" => [["4-13", 5], ["14-17", 6]] },
          axis_setup: { "0" => [["*", "0-1"], ["*", "9-10"], ["0-2", "*"]] },
          base_terrain: "s",
        }
      end

      def hexes
        [
          [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f", h: 1, r: { d: [2, 4], t: "p" } },
            { t: "f", h: 1, r: { d: [1, 5], t: "p" } },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "w" },
            { t: "w" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f", h: 1, r: { d: [2, 5], t: "p" } },
            { t: "f", h: 1 },
            { t: "f", h: 1 },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "w", s: { d: [2, 6] } },
            { t: "w" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f", r: { d: [2, 5], t: "p" } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o", s: { d: [3, 6] } },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [2, 5], t: "p" } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", s: { d: [3, 5] } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 5], t: "d" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "p" } },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o", s: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [4, 6], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 2, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 5], t: "d" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [4, 6], t: "d" }, s: { d: [2, 5] } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 3], t: "d" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 4, 6], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 4], t: "d" } },
            { t: "o", r: { d: [1, 3], t: "d" } },
            { t: "m", s: { d: [2, 5] } },
            { t: "m" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f", r: { d: [3, 6], t: "p" } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "m", s: { d: [2, 6] } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f", r: { d: [3, 5], t: "p" } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", s: { d: [3, 5] } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o", r: { d: [2, 6], t: "p" } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "m", s: { d: [2, 5] } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6], t: "p" } },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "m" },
            { t: "m", s: { d: [2, 6] } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ],
        ]
      end
    end
  end
end
