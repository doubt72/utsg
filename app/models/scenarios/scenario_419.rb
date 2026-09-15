# frozen_string_literal: true

module Scenarios
  class Scenario419 < Base
    ID = "419"
    NAME = "Saddle Ridge"
    ALLIES = ["usa"].freeze
    AXIS = ["jap"].freeze
    STATUS = "p"
    VERSION = "0.1"

    DATE = [1942, 10, 26].freeze
    LAYOUT = [23, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": { list: [
        :usa_leader_5_1,
        [2, :usa_leader_4_1],
        [9, :usa_marine_rifle_s],
        [3, :usa_m1917_browning],
        :usa_m2_mortar,
        [7, :foxhole],
      ] },
      "2": { list: [
        :usa_leader_5_1,
        [3, :usa_marine_rifle_s],
        [4, :usa_garrison_s],
        :usa_m1918_bar,
      ] },
    }.freeze

    AXIS_UNITS = {
      "0": { list: [
        :jap_leader_6_1,
        [2, :jap_leader_4_1],
        [12, :jap_a_division_s],
        [4, :jap_type_96_lmg],
      ] },
    }.freeze

    class << self
      def generate
        {
          turns: 5,
          first_deploy: 1,
          first_action: 2,
          date:,
          location: "Lunga, Guadalcanal",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "During the Battle for Henderson Field on Guadalcanal, American
          forces defended the field against attacks by the Japanese all along
          the perimeter. One of these was an attack by the Japanese 124th
          Infantry Regiment under the command Colonel Akinosuka Oku against
          the defenses near the Matanikau, where he had attempted to flank the
          Americans to the south and assaulted all along an east–west saddle
          ridge held by a 2nd Battalion, 7th Marines commanded by Lt. Colonel
          Herman H. Hanneken. The attack concentrated particularly on
          Hanneken's Company F, which defended the extreme left flank of the
          Marine positions on the ridge. A Company F machine gun section under
          Mitchell Paige killed many of the Japanese attackers, but Japanese
          fire eventually killed or injured almost all the Marine machine
          gunners. Two hours after commencing the attack, the Japanese
          attackers succeeded in scaling the steep slope of the ridge and
          pushed the surviving members of Company F off the crest.",
          "Responding to the Japanese capture of part of the ridgeline, Major
          Odell M. Conoley — Hanneken's battalion executive officer — quickly
          gathered a counterattack unit of 17 men, including communications
          specialists, messmen, a cook, and a bandsman. Conoley's scratch
          force was joined by elements of Hanneken's Company G, Company C, and
          a few unwounded survivors from Company F and attacked the Japanese
          before they could consolidate their positions on top of the ridge.
          Within an hour, Conoley's force had pushed the Japanese back off the
          ridge, effectively ending Oka's attack.",
        ]
      end

      def map_data
        {
          start_weather: "dry",
          base_weather: "dry",
          precip: [0, "rain"],
          wind: [1, 2, false],
          hexes:,
          layout:,
          allied_dir: 5.5,
          axis_dir: 2.5,
          victory_hexes: [
            [3, 7, 1], [10, 6, 1], [14, 1, 1], [19, 5, 1], [12, 5, 1], [7, 6, 1], [16, 5, 1],
          ],
          allied_setup: {
            "0" => [["0-21", 4], ["0-19", 5], ["3-10", 6], ["3-4", 7], ["*", "0-3"]],
            "2" => [["*", 0]],
          },
          axis_setup: { "0" => [["11-13", 7], ["16-19", 7], ["6-22", 8], ["*", "9-10"]] },
          night: true,
        }
      end

      def hexes
        [
          [
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "y" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "j", h: 1 },
            { t: "j", h: 1 },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "o" },
            { t: "j" },
            { t: "j" },
          ],
          [
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "y" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "o" },
            { t: "j", h: 1 },
            { t: "j", h: 1 },
          ],
          [
            { t: "o" },
            { t: "j" },
            { t: "y" },
            { t: "y" },
            { t: "y" },
            { t: "j" },
            { t: "j" },
            { t: "o" },
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "j", h: 1 },
            { t: "o", h: 1 },
            { t: "b", h: 1 },
            { t: "b", h: 1 },
            { t: "b", h: 1 },
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "j", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
          ],
          [
            { t: "j" },
            { t: "y" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "j", h: 1 },
            { t: "j" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "j" },
            { t: "j", h: 1 },
            { t: "j", h: 1 },
            { t: "o", h: 2 },
            { t: "b", h: 2 },
            { t: "b", h: 2 },
            { t: "o", h: 2 },
          ],
          [
            { t: "j" },
            { t: "j" },
            { t: "y" },
            { t: "j" },
            { t: "j" },
            { t: "o", h: 1 },
            { t: "b", h: 1 },
            { t: "b", h: 1 },
            { t: "b", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "b", h: 1 },
            { t: "b", h: 1 },
            { t: "b", h: 1 },
            { t: "b", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "b", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
          ],
          [
            { t: "j" },
            { t: "y" },
            { t: "j" },
            { t: "j" },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "b", h: 1 },
            { t: "o", h: 1 },
            { t: "b", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "b" },
          ],
          [
            { t: "j" },
            { t: "y" },
            { t: "j" },
            { t: "j", h: 1 },
            { t: "o", h: 1 },
            { t: "b", h: 2 },
            { t: "b", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 2 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "b", h: 1 },
            { t: "b", h: 1 },
            { t: "o", h: 1 },
            { t: "b", h: 1 },
            { t: "b", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "b" },
          ],
          [
            { t: "y" },
            { t: "j" },
            { t: "j", h: 1 },
            { t: "o", h: 2 },
            { t: "b", h: 2 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "b", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "j" },
            { t: "j" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "b" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "b" },
            { t: "b" },
            { t: "o" },
          ],
          [
            { t: "y" },
            { t: "j" },
            { t: "j" },
            { t: "j", h: 1 },
            { t: "o", h: 1 },
            { t: "b", h: 1 },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "o" },
          ],
          [
            { t: "j" },
            { t: "j", h: 1 },
            { t: "j" },
            { t: "j" },
            { t: "o" },
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "j", h: 1 },
            { t: "j", h: 1 },
            { t: "o", h: 1 },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
            { t: "o" },
            { t: "j" },
            { t: "j" },
          ],
          [
            { t: "j" },
            { t: "j", h: 1 },
            { t: "o", h: 1 },
            { t: "j" },
            { t: "j" },
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o", h: 1 },
            { t: "o" },
            { t: "j" },
            { t: "j", h: 1 },
            { t: "j", h: 1 },
            { t: "j" },
            { t: "j" },
            { t: "j" },
          ],
        ]
      end
    end
  end
end
