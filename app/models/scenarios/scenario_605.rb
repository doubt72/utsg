# frozen_string_literal: true

module Scenarios
  class Scenario605 < Base
    ID = "605"
    NAME = "The Red House"
    ALLIES = ["ind"].freeze
    AXIS = ["jap"].freeze
    STATUS = "p"

    DATE = [1944, 6, 24].freeze
    LAYOUT = [15, 11, "x"].freeze

    ALLIED_UNITS = {
      "0": {
        list: [
          :uk_leader_6_1,
          :uk_leader_5_1,
          [4, :uk_gurkha_s],
          [4, :uk_indian_s],
          [2, :uk_bren_lmg],
          :uk_2inch_mortar,
          :uk_ft,
        ],
      },
    }.freeze

    AXIS_UNITS = {
      "0": {
        list: [
          :jap_leader_5_1,
          [6, :jap_b_division_s],
          [2, :jap_type_92_hmg],
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
          location: "Mogaung, Burma",
          author: "The Establishment",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "The Battle of Mogaung was fought in June 1944, part of the broader
          Allied campaign to liberate northern Burma from Japanese occupation.
          The battle was fought by the 77th Indian Infantry Brigade, part of
          the British Chindit forces.  The brigade had been operating behind
          enemy lines for several months and had already suffered significant
          casualties.  Despite these challenges, they launched an assault on
          Mogaung, aiming to disrupt Japanese supply lines and capture the
          town.",

          "The Red House, a large brick building, was identified as a key
          defensive position held by the Japanese.  On June 23, after intense
          bombardment by Chinese artillery and British mortars, the Chindits
          launched an assault from the north.  The Japanese defenders, despite
          being heavily outnumbered, put up fierce resistance. The Chindits
          employed flamethrowers, grenades, and PIATs to overcome the
          defenders.  Notably, Rifleman Tulbahadur Pun of the 3rd Battalion,
          6th Gurkha Rifles, displayed extraordinary bravery during this
          assault, earning him a nomination for the Victoria Cross, as did
          Captain Michael Allmand who earned his nomination posthumously.",

          "The capture of the Red House was a significant turning point in the
          battle.  It disrupted the Japanese defensive positions and forced
          them to withdraw. Subsequent assaults by the Chindits and Chinese
          forces led to the capture of the railway station on June 25. By June
          27, the Japanese had abandoned Mogaung, marking the first major town
          in Burma to be liberated from Japanese control.  It also marked a
          shift in the momentum of the war in the region, contributing to the
          eventual Allied victory in Burma.",
        ]
      end

      def map_data
        {
          start_weather: 0,
          base_weather: 0,
          precip: [0, 2],
          wind: [0, 4, false],
          hexes:,
          layout:,
          allied_dir: 1,
          axis_dir: 4,
          victory_hexes: [
            [2, 2, 2], [3, 6, 2], [6, 2, 2], [7, 6, 2], [8, 9, 2],
          ],
          allied_setup: { "0" => [["12-14", "*"]] },
          axis_setup: { "0" => [["0-10", "*"]] },
          base_terrain: "m",
        }
      end

      def hexes
        [
          [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1, rr: { d: [[3, 6]] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "o" },
            { t: "o", r: { d: [4, 6] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
          ], [
            { t: "w" },
            { t: "w" },
            { t: "w", rr: { d: [[3, 6]] } },
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "w" },
            { t: "o", r: { d: [4, 6] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 3] } },
            { t: "p" },
            { t: "p" },
            { t: "p" },
          ], [
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", h: 1, rr: { d: [[3, 5]] }, r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4, 5] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 3] } },
            { t: "o", d: 3, st: { sh: "h", s: "f" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", d: 1, st: { sh: "h", s: "f" } },
            { t: "d", d: 2 },
            { t: "o", h: 1, rr: { d: [[2, 5]] } },
            { t: "o", d: 1, st: { sh: "h", s: "f" } },
            { t: "o", d: 1, st: { sh: "h", s: "f" } },
            { t: "o", d: 1, st: { sh: "h", s: "f" } },
            { t: "o", r: { d: [2, 5] } },
            { t: "o", d: 1, st: { sh: "h", s: "f" } },
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
            { t: "d", d: 2 },
            { t: "o", h: 1, rr: { d: [[2, 5]] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 5] } },
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
            { t: "o", h: 1, rr: { d: [[2, 5]] } },
            { t: "d", d: 2 },
            { t: "o" },
            { t: "o", d: 2, st: { sh: "s2", s: "u" } },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "j" },
            { t: "j" },
            { t: "j" },
          ], [
            { t: "o", r: { d: [2, 5] } },
            { t: "o", d: 2, st: { sh: "h", s: "f" } },
            { t: "o" },
            { t: "o", h: 1, d: 2, st: { sh: "s2", s: "u" } },
            { t: "o", h: 1, rr: { d: [[2, 5]] } },
            { t: "d", d: 2 },
            { t: "o" },
            { t: "o", d: 5, st: { sh: "s2", s: "u" } },
            { t: "o", r: { d: [2, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "w" },
            { t: "w" },
            { t: "w" },
          ], [
            { t: "o", r: { d: [2, 5] } },
            { t: "o", d: 2, st: { sh: "h", s: "f" } },
            { t: "o" },
            { t: "o", h: 1, d: 5, st: { sh: "s2", s: "u" } },
            { t: "o", h: 1, rr: { d: [[2, 6]] } },
            { t: "d", d: 2 },
            { t: "o" },
            { t: "o" },
            { t: "o", r: { d: [2, 6] } },
            { t: "o" },
            { t: "o" },
            { t: "w" },
            { t: "p" },
            { t: "p" },
            { t: "p" },
          ], [
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 2, 5] } },
            { t: "o", d: 2, st: { sh: "h", s: "f" } },
            { t: "o" },
            { t: "o", h: 1, rr: { d: [[3, 5]] } },
            { t: "o", d: 1, st: { sh: "h", s: "f" } },
            { t: "o", d: 1, st: { sh: "h", s: "f" } },
            { t: "o", d: 1, st: { sh: "h", s: "f" } },
            { t: "o", r: { d: [3, 5] } },
            { t: "o" },
            { t: "o" },
            { t: "w" },
            { t: "p" },
            { t: "o" },
            { t: "o" },
          ], [
            { t: "o", d: 2, st: { sh: "h", s: "f" } },
            { t: "o", r: { d: [2, 4] } },
            { t: "o", h: 1, r: { d: [1, 4] } },
            { t: "o", h: 1, r: { d: [1, 4] } },
            { t: "o", h: 1, rr: { d: [[2, 6]] }, r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", r: { d: [1, 4, 5] } },
            { t: "o", r: { d: [1, 4] } },
            { t: "o", h: 1, r: { d: [1, 2, 4] } },
            { t: "o", h: 1, r: { d: [1, 4] } },
            { t: "o", h: 1, r: { d: [1, 4] } },
            { t: "w", r: { d: [1, 4] } },
            { t: "o", h: 1, r: { d: [1, 4] } },
            { t: "o", h: 1, r: { d: [1, 4] } },
            { t: "o", h: 1, r: { d: [1, 4] } },
          ], [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1, rr: { d: [[3, 6]] } },
            { t: "o", d: 1, st: { sh: "h", s: "f" } },
            { t: "o", d: 1, st: { sh: "h", s: "f" } },
            { t: "o", r: { d: [2, 5] } },
            { t: "o", d: 1, st: { sh: "h", s: "f" } },
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "w" },
            { t: "p" },
            { t: "o" },
          ],
        ]
      end
    end
  end
end
