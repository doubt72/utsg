# frozen_string_literal: true

module Scenarios
  class Scenario506 < Base
    ID = "506"
    NAME = "A Line in the Snow"
    ALLIES = ["ussr"].freeze
    AXIS = ["fin"].freeze
    STATUS = "p"

    DATE = [1939, 12, 15].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          :ussr_leader_5_1,
          :ussr_leader_4_1,
          [9, :ussr_rifle_s],
          [2, :ussr_dp_27],
          :ussr_82_bm_37,
          :ussr_radio_152mm,
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :fin_leader_6_2,
          :fin_leader_4_1,
          [6, :fin_regular_s],
          [2, :fin_mg_08_15],
          [2, :bunker],
        ],
      },
    }.freeze

    class << self
      def generate
        {
          turns: 6,
          first_setup: 2,
          first_move: 1,
          date:,
          location: "Taipale, Finland",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "At the beginning of the Soviet Invasion of Finland in 1939, the
          Karelian Isthmus was split into two military sectors: one on the
          side of Lake Ladoga and the other on the side of the Gulf of
          Finland. In the Ladoga sector, the Soviets were given orders to make
          a breakthrough in their sector, as the defenders in the other sector
          were more numerous and offered fiercer resistance. The former
          objective of reaching Viipuri on the Gulf side of the Karelian
          Isthmus became a secondary priority. The attack began on 6 December,
          when the Finns had retreated to the Mannerheim Line.",
          "The Battle of Taipale began when the Soviet 49th and 150th Rifle
          Divisions tried to cross the Taipale River at three locations. After
          a week of little progress, a new attack was launched against the
          eastern sector of the Line near Taipale.  Having an excellent field
          of fire, the Finns inflicted prohibitive losses on the
          enemy who had to advance across open fields and ice.  The endurance
          of the Finnish 10th Division was notable; no other sector was
          subjected to such prolonged punishment by artillery, aircraft, and
          ground attacks. But with the failure of the Soviets to break the
          line, the fighting on the Isthmus reached a stalemate.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [1, 3],
          wind: [0, 5, false],
          hexes:,
          layout:,
          allied_edge: "b",
          axis_edge: "t",
          victory_hexes: [
            [2, 3, 2], [6, 2, 2], [10, 4, 2], [11, 2, 2], [11, 8, 1],
          ],
          allied_setup: { "0" => [["*", "8-10"]] },
          axis_setup: { "0" => [["*", "0-6"]] },
          base_terrain: "s",
        }
      end

      def hexes
        [
          [
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o", r: { d: [2, 5] } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o", d: 2, st: { sh: "l", s: "f" } },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "l", s: "f" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "f", be: [1, 2, 3, 6] },
            { t: "o", b: "f", be: [2, 3] },
            { t: "o", b: "f", be: [2, 3, 4] },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "f", be: [1, 6] },
            { t: "o" },
            { t: "o", b: "f", be: [3, 4] },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
          ], [
            { t: "w" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", b: "f", be: [1, 5, 6] },
            { t: "o", b: "f", be: [5, 6] },
            { t: "o", b: "f", be: [3, 4, 5, 6] },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "f" },
            { t: "o" },
          ], [
            { t: "w" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
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
          ], [
            { t: "w" },
            { t: "w" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", d: 2, st: { sh: "l", s: "f" } },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "w" },
            { t: "w" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "f" },
            { t: "f" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
          ],
        ]
      end
    end
  end
end
