# frozen_string_literal: true

module Scenarios
  class Scenario503 < Base
    ID = "503"
    NAME = "Uruguay"
    ALLIES = ["pol"].freeze
    AXIS = ["ger"].freeze
    STATUS = "p"

    DATE = [1939, 9, 1].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": { list: [
        :alm_leader_5_1,
        :alm_leader_4_1,
        [6, :alm_regular_s],
        [2, :alm_regular_t],
        [2, :alm_rkm_wz__1928],
        [2, :alm_wz__35_at_rifle],
      ] },
    }.freeze

    AXIS_UNITS = {
      "0": { list: [
        :ger_leader_6_2,
        :ger_leader_4_1,
        [4, :ger_rifle_s],
        [2, :ger_mg_34],
        :ger_pzkpfw_i,
        [2, :ger_pzkpfw_ii_a_e],
        :ger_pzkpfw_35t,
      ] },
    }.freeze

    class << self
      def generate
        {
          turns: 6,
          first_deploy: 1,
          first_action: 2,
          date:,
          location: "Mokra, Poland",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "During the late 1930's, Poland developed the \"karabin
          przeciwpancerny wz. 35\", a 7.92mm anti-tank rifle.  Such was the
          secrecy around it that it wasn't until shortly before the German
          invasion of Poland that it was issued to select groups of sworn
          infantry and cavalry markmen, about two thousand in total.  Up to
          that point, combat ready rifles were held in sealed crates marked
          (among other similar things) \"Do not open! Surveillance Equipment
          A.R.\" Among various codenames, it was known as \"Urugwaj\" after
          the country it was supposedly being exported to, and that's the name
          it was most known as after the war.",
          "The subterfuge was successful — despite the fairly large numbers
          produced and deployed, neither the Germans or Soviets were aware of
          the rifle's existance unti encountering it in the field.  The weapon
          itself was only moderately successful.  Several other nations
          independently produced similar (even superior) anti-tank
          rifles, and though it could be used successfully against lighter
          armor at short ranges, it wasn't really a substitute for larger
          anti-tank weapons (or later various man-portable rocket-propelled
          weapons with large warheads), and it was quickly made obsolete by
          heavier tanks. The Poles, however, did not last long enough to see
          that happen first-hand.",
        ]
      end

      def map_data
        {
          hexes:,
          layout:,
          allied_dir: 1,
          axis_dir: 4,
          victory_hexes: [
            [3, 5, 1], [7, 6, 1], [11, 3, 1], [11, 9, 1], [12, 5, 1],
          ],
          allied_setup: { "0" => [["4-14", "*"]] },
          axis_setup: { "0" => [["0-1", "*"]] },
          base_terrain: "g",
        }
      end

      def hexes
        [
          [
            { t: "f" },
            { t: "o", r: { d: [2, 5], t: "t" } },
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
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "o", d: 2.5, st: { sh: "l2" } },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "d", d: 2.5 },
            { t: "o", r: { d: [2, 6], t: "t", c: "l" } },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "d", d: 2.5 },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "l" } },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 2.5, st: { sh: "l" } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l" } },
            { t: "o" },
            { t: "f" },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l2" } },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "l" } },
            { t: "o", d: 1, st: { sh: "l" } },
            { t: "f" },
            { t: "o", d: 1, st: { sh: "x" } },
            { t: "o", d: 1, st: { sh: "l2" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "o", d: 2.5, st: { sh: "l" } },
            { t: "o" },
          ], [
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 2, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 2, 4, 6], t: "t", c: "l" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
          ], [
            { t: "o" },
            { t: "o", d: 1, st: { sh: "s2" } },
            { t: "o", d: 4, st: { sh: "s2" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l2" } },
            { t: "o", d: 4, st: { sh: "l" } },
            { t: "o", d: 4, st: { sh: "l" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "o", d: 2.5, st: { sh: "l" } },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o", d: 2.5, st: { sh: "l" } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l" } },
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
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "d", d: 2.5 },
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
            { t: "o", d: 2.5, st: { sh: "l" } },
            { t: "o", r: { d: [2, 6], t: "t", c: "l" } },
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
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "o" },
            { t: "o" },
          ],
        ]
      end
    end
  end
end
