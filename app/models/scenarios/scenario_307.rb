# frozen_string_literal: true

module Scenarios
  class Scenario307 < Base
    ID = "307"
    NAME = "Into the Tiger's Den"
    ALLIES = ["uk"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    DATE = [1944, 6, 13].freeze
    LAYOUT = [23, 23, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          :uk_leader_5_1,
          [2, :uk_leader_4_1],
          [5, :uk_line_s],
          [5, :uk_line_t],
          :uk_crew_t,
          [3, :uk_bren_lmg],
          [2, :uk_piat],
          :uk_qf_6pdr_mk_iv,
          [3, :uk_cromwell],
          [3, :uk_sherman_firefly],
          [2, :uk_m3_stuart],
          :uk_bedford_ql,
        ],
      },
      "1": {
        list: [
          :uk_leader_4_1,
          :uk_line_s,
          :uk_line_t,
          :uk_bren_lmg,
          :uk_radio_152mm,
          [2, :uk_bedford_ql],
          :uk_jeep,
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :ger_leader_6_1,
          :ger_leader_4_1,
          [4, :ger_ss_s],
          [2, :ger_ss_t],
          [2, :ger_mg_42],
          [3, :ger_tiger_i],
          [5, :ger_pzkpfw_iv_g],
          [2, :ger_stug_iii_f_g],
          [2, :ger_sdkfz_251_1],
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
          location: "Villers-Bocage, France",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "In the days following the D-Day landings, British forces aimed to
          exploit a gap in the German lines and capture the strategically
          important town of Villers-Bocage, west of Caen.  Elements of the
          British 7th Armoured Division, including the 4th County of London
          Yeomanry, entered the town intending to secure high ground beyond it that
          would threaten the German rear.  However, they were ambushed by
          German Tiger tanks from the elite 1st SS Panzer Division, most
          notably under the command of SS-Obersturmführer Michael Wittmann. In
          a surprise attack that became legendary, Wittmann destroyed numerous
          British tanks and vehicles inflicting heavy losses and forcing a
          British withdrawal.",

          "Although the engagement was a tactical victory for the Germans and
          delayed the British advance toward Caen, it was ultimately only a
          temporary setback.  The Allies eventually captured Villers-Bocage
          weeks later as part of the broader campaign to liberate Normandy.
          The battle highlighted the vulnerability of fast-moving armored
          columns without adequate reconnaissance and support and demonstrated
          the formidable effectiveness of German armored units.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [1, 3, false],
          hexes:,
          layout:,
          allied_dir: 5.5,
          axis_dir: 2.5,
          victory_hexes: [
            [6, 2, 1], [10, 3, 1], [17, 3, 1], [9, 5, 1], [8, 7, 1], [12, 10, 1], [5, 14, 1],
            [21, 16, 1], [1, 17, 2], [16, 18, 2], [2, 20, 2],
          ],
          allied_setup: {
            "0" => 7.upto(15).map { |n| ["#{11 - ((n + 1) / 2)}-#{13 - ((n + 1) / 2)}", n] }
                    .push(["8-9", 6], ["4-5", 16]),
            "1" => [["*", 0]],
          },
          axis_setup: { "0" => [["*", "18-22"], ["0-2", 17]] },
          base_terrain: "g",
        }
      end

      def hexes
        [
          [
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "o", b: "b", be: [1] },
            { t: "o" },
            { t: "o", b: "b", be: [4] },
            { t: "o" },
            { t: "o", b: "b", be: [4] },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "o", r: { d: [3, 6] }, b: "b", be: [1, 4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3] },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3] },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3] },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3] },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3] },
            { t: "o", r: { d: [1, 5] }, b: "b", be: [2, 3, 4] },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "o", b: "b", be: [1, 2] },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [3, 4] },
            { t: "o" },
            { t: "o", b: "b", be: [3, 4] },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "o", r: { d: [3, 6] }, b: "b", be: [1, 2, 4, 5] },
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
            { t: "o", r: { d: [2, 5] }, b: "b", be: [3, 4] },
            { t: "g" },
            { t: "g" },
            { t: "o", b: "b", be: [1, 2] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [3, 4] },
            { t: "o" },
            { t: "o", b: "b", be: [3, 4] },
            { t: "g" },
            { t: "g" },
            { t: "o", r: { d: [3, 6] }, b: "b", be: [1, 2, 4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", b: "b", be: [2, 3] },
            { t: "o", b: "b", be: [2, 3] },
            { t: "o", b: "b", be: [2, 3] },
            { t: "o", b: "b", be: [2, 3, 4] },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5] }, b: "b", be: [3, 4] },
            { t: "g" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [4, 6] }, b: "b", be: [1, 2, 3, 5] },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3, 5, 6] },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3, 5, 6] },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3, 5, 6] },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3, 5, 6] },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3, 5, 6] },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3, 6] },
            { t: "o", r: { d: [1, 3] }, b: "b", be: [2, 4, 5, 6] },
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
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5] }, b: "b", be: [3] },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] }, b: "b", be: [1, 2, 4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [4] },
            { t: "o" },
            { t: "o", b: "b", be: [4] },
            { t: "o" },
            { t: "o", b: "b", be: [5, 6] },
            { t: "o", b: "b", be: [5, 6] },
            { t: "o", b: "b", be: [5, 6] },
            { t: "o", b: "b", be: [5, 6] },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 3, 6] }, b: "b", be: [4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [3, 4, 5] },
            { t: "o" },
            { t: "o", b: "b", be: [3, 4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] }, b: "b", be: [1] },
          ], [
            { t: "g", b: "b", be: [2, 3] },
            { t: "g", b: "b", be: [2, 3] },
            { t: "o", b: "b", be: [1, 2, 3, 6] },
            { t: "f", b: "b", be: [2, 3] },
            { t: "o", b: "b", be: [2, 3] },
            { t: "o", b: "b", be: [2, 3, 4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [3, 6] } },
            { t: "o", b: "b", be: [1, 5, 6] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "o", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] }, b: "b", be: [1, 2, 5] },
          ], [
            { t: "g" },
            { t: "g" },
            { t: "o", b: "b", be: [1, 6] },
            { t: "f" },
            { t: "o", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [3, 4, 6] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] }, b: "b", be: [3, 4] },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "o", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] }, b: "b", be: [1, 2, 4, 5] },
            { t: "g" },
          ], [
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "o", b: "b", be: [1, 6] },
            { t: "o", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [3, 6] } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o", r: { d: [2, 5] }, b: "b", be: [3, 4] },
            { t: "o" },
            { t: "o", b: "b", be: [4, 5] },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] }, b: "b", be: [1, 2, 4, 5] },
            { t: "g" },
          ], [
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "o", b: "b", be: [1, 4, 5, 6] },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [3, 6] } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5] }, b: "b", be: [3, 4] },
            { t: "o", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] }, b: "b", be: [1, 2, 4, 5] },
            { t: "g" },
            { t: "g" },
          ], [
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "g", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [3, 6] } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 6] }, b: "b", be: [3, 4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [3, 6] }, b: "b", be: [4] },
            { t: "g" },
            { t: "g" },
          ], [
            { t: "g" },
            { t: "g" },
            { t: "g", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [3, 6] } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "g", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "g", b: "b", be: [5, 6] },
            { t: "g", b: "b", be: [5, 6] },
            { t: "g", b: "b", be: [4, 5, 6] },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [3, 6] } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "g", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [3, 6] } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "o", b: "b", be: [1] },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [3, 6] } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "g", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] }, b: "b", be: [1, 4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [3, 6] } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "g", b: "b", be: [4, 5] },
            { t: "o", b: "b", be: [3] },
            { t: "o", b: "b", be: [1, 6] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] }, b: "b", be: [1, 2, 4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [3, 6] } },
          ], [
            { t: "d", d: 3 },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [3, 6] } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "g", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "o", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] }, b: "b", be: [1, 2, 4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [3, 5] } },
            { t: "o", d: 2, st: { sh: "l", s: "r" } },
          ], [
            { t: "d", d: 3 },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] } },
            { t: "d", d: 3 },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "g", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "o", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] }, b: "b", be: [1, 2, 4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l", s: "r" } },
            { t: "o", r: { d: [2, 5] } },
          ], [
            { t: "d", d: 3 },
            { t: "o", d: 1, st: { sh: "l", s: "r" } },
            { t: "o", d: 1, st: { sh: "l", s: "r" } },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "g" },
            { t: "g" },
            { t: "g", b: "b", be: [4] },
            { t: "o" },
            { t: "o", b: "b", be: [4] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [4, 6] } },
            { t: "o", r: { d: [1, 5] }, b: "b", be: [2, 3] },
            { t: "o", r: { d: [3, 6] }, b: "b", be: [1, 2, 4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
            { t: "o", r: { d: [2, 4, 6] } },
          ], [
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "o", r: { d: [3, 4, 6] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3, 5, 6] },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3, 5, 6] },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3, 5, 6] },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3, 5, 6] },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3] },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3] },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3] },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3] },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3] },
            { t: "o", r: { d: [1, 3] }, b: "b", be: [2] },
            { t: "o" },
            { t: "o", r: { d: [2, 3, 5, 6] }, b: "b", be: [1, 4] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] } },
          ], [
            { t: "o" },
            { t: "o", d: 3, st: { sh: "l", s: "r" } },
            { t: "o", r: { d: [2, 3, 6] } },
            { t: "o", d: 3, st: { sh: "l", s: "r" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] }, b: "b", be: [1, 2, 4, 5] },
            { t: "o", r: { d: [2, 4] }, b: "b", be: [3] },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3] },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3] },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3] },
            { t: "o", r: { d: [1, 4] }, b: "b", be: [2, 3] },
            { t: "o", r: { d: [1, 3] } },
            { t: "d", d: 3 },
          ], [
            { t: "o", r: { d: [4, 6] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 3, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] }, b: "b", be: [1, 2, 4, 5] },
            { t: "g" },
            { t: "g" },
            { t: "g", b: "b", be: [4] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 3 },
          ], [
            { t: "d", d: 1 },
            { t: "o", r: { d: [3, 6] } },
            { t: "o", d: 3, st: { sh: "l", s: "r" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] }, b: "b", be: [1, 2, 4, 5] },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "g", b: "b", be: [3, 4] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", r: { d: [3, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "b", be: [4] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 6] }, b: "b", be: [1, 2, 4] },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "g" },
            { t: "g", b: "b", be: [3, 4] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ],
        ]
      end
    end
  end
end
