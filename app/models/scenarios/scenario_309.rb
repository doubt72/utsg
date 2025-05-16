# frozen_string_literal: true

module Scenarios
  class Scenario309 < Base
    ID = "309"
    NAME = "Storming the Gates"
    ALLIES = ["usa"].freeze
    AXIS = ["ger"].freeze
    STATUS = "a"

    class << self
      def generate
        {
          turns: 6,
          first_setup: 2,
          first_move: 1,
          date: [1944, 10, 2],
          location: "Rimburg, Netherlands",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "While Aachen had little intrinsic military importance, it was an
          important symbol to both the Nazi regime and the German people; it
          was the first German city threatened, it was the historical capital
          of Charlemagne, founder of the Holy Roman Empire, whose legacy the
          Nazis claimed, so the psychological value was immense.  It was the
          first time the Germans were fighting on home soil instead of as
          occupiers.  Both sides took heavy losses and much of the city was
          destroyed, and the tenacious defense significantly disrupted Allied
          plans for the advance into Germany.",
          "This scenario is for the assault of an outlying manor that has been
          turned into a German stronghold as part of the overall battle, rather than
          part of the (significant) urban fighting in the city proper.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [1, 2, true],
          hexes:,
          layout: [15, 11, "x"],
          allied_edge: "b",
          axis_edge: "t",
          victory_hexes: [
            [3, 2, 2], [4, 8, 2], [5, 2, 2], [11, 9, 1], [13, 3, 2],
          ],
          allied_setup: { "0" => [["*", "9-10"]] },
          axis_setup: { "0" => [["0-6", "0-7"], ["*", "0-4"]] },
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
            { t: "o", r: { d: [3, 5], t: "t" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", b: "w", be: [1, 2, 3, 6] },
            { t: "o", r: { d: [4, 6], t: "t", c: "l" }, b: "w", be: [2, 3] },
            { t: "o", r: { d: [1, 4], t: "t" }, b: "w", be: [2, 3] },
            { t: "o", r: { d: [1, 4], t: "t" }, b: "w", be: [2, 3] },
            { t: "o", r: { d: [1, 5], t: "t", c: "r" }, b: "w", be: [2, 3] },
            { t: "o", b: "w", be: [2, 3, 4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l" } },
            { t: "o", r: { d: [2, 6], t: "t" } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" }, b: "w", be: [1] },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" }  },
            { t: "o", d: 4, st: { sh: "s" }  },
            { t: "o", r: { d: [2, 6], t: "t", c: "l" }, b: "w", be: [4] },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t" } },
            { t: "o", d: 2, st: { sh: "s" } },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", b: "w", be: [1, 2, 6] },
            { t: "o", r: { d: [4, 2], t: "t", c: "l" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4, 6], t: "t", c: "l" } },
            { t: "o", r: { d: [1, 3], t: "t", c: "r" } },
            { t: "o", b: "w", be: [3, 4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5], t: "t" } },
            { t: "o", d: 5, st: { sh: "s" } },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "o" },
            { t: "o", b: "w", be: [1] },
            { t: "f" },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "f" },
            { t: "o", b: "w", be: [4] },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l" } },
            { t: "o", r: { d: [2, 4, 6], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
          ], [
            { t: "o" },
            { t: "o", b: "w", be: [1, 2, 6] },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 6], t: "t", c: "l" } },
            { t: "o" },
            { t: "o", b: "w", be: [3, 4, 5] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [3, 5], t: "t" } },
            { t: "o" },
            { t: "b" },
          ], [
            { t: "f" },
            { t: "o" },
            { t: "o", b: "w", be: [1] },
            { t: "f" },
            { t: "o", r: { d: [3, 5], t: "t", c: "r" } },
            { t: "f" },
            { t: "o", b: "w", be: [4] },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o", d: 3, st: { sh: "s" } },
            { t: "o", r: { d: [2, 6], t: "t" } },
            { t: "o" },
          ], [
            { t: "o" },
            { t: "o", b: "w", be: [1, 2, 5, 6] },
            { t: "o", b: "w", be: [5, 6] },
            { t: "o", b: "w", be: [6] },
            { t: "o", r: { d: [2, 6], t: "t", c: "l" }, b: "w", be: [5] },
            { t: "o", b: "w", be: [5, 6] },
            { t: "o", b: "w", be: [3, 4, 5, 6] },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 6, st: { sh: "s" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "f" },
            { t: "o" },
          ], [
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 3, 4], t: "t", c: "r" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 4], t: "t" } },
            { t: "o", r: { d: [1, 5], t: "t" } },
            { t: "o", r: { d: [3, 6], t: "t" } },
            { t: "f" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "d", d: 1 },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [2, 3, 5], t: "t" } },
            { t: "f" },
            { t: "f" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "b" },
            { t: "b" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f", r: { d: [2, 5], t: "t" } },
            { t: "f" },
            { t: "o" },
          ],
        ]
      end

      def allied_units
        {
          "0": { list: [
            :usa_leader_5_1,
            :usa_leader_4_1,
            [2, :usa_engineer_s],
            [8, :usa_rifle_s],
            :usa_m2_browning,
            :usa_ft,
            [2, :usa_sc],
            :usa_radio_155mm,
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end

      def axis_units
        {
          "0": { list: [
            :ger_leader_6_1,
            :ger_leader_4_1,
            [6, :ger_ss_s],
            :ger_elite_crew_t,
            [2, :ger_mg_42],
            :ger_7_5cm_leig_18,
            [4, :wire],
            :ap_mines,
            [2, :pillbox],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end
    end
  end
end
