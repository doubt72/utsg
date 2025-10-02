# frozen_string_literal: true

module Utility
  class Scenario
    module Units
      module TowedGuns
        class << self
          # rubocop:disable Metrics/MethodLength
          def towed_guns
            infantry_guns.merge(at_guns)
          end

          def infantry_guns
            lu = {}
            key = %i[c n y o]
            [
              ["alm", "75mm Gun", 32, {}],

              ["axm", "75mm Gun", 32, {}],

              ["chi", "Bofors 75mm", 23, {}], ["chi", "75mm M1 Pack", 42, {}],
              ["chi", "75mm Gun", 32, {}],

              ["fin", "75mm Gun", 32, {}],

              ["fra", "75mm M1897", 0, {}], ["fra", "37mm M1916", 16, {}],

              ["ger", "7.5cm leIG 18", 32, {}], ["ger", "7.5cm GebG 36", 38, {}],
              ["ger", "10.5cm GebH 40", 42, { sn: 1 }], ["ger", "15cm sIG 33", 36, {}],

              ["ita", "Cannone da 65/17", 13, { sn: 2 }], ["ita", "Obice da 75/18", 34, {}],
              ["ita", "Obice da 100/17", 14, { sn: 1 }],

              ["jap", "70mm Type 92", 32, {}],

              ["uk", "QF 25-Pounder", 40, {}], ["uk", "QF 25Pdr Short", 43, {}],
              ["uk", "QF 4.5inch", 8, {}],

              ["usa", "75mm M1 Pack", 27, {}], ["usa", "75mm M1897", 40, {}],

              ["ussr", "76mm ZiS-3", 28, {}],
            ].each do |unit|
              gun = { t: "gun", i: "gun" }
              unit.each_with_index do |v, i|
                gun[key[i]] = v
              end
              Definitions.populate_gun_data(Units.sanitize(gun[:n]).to_sym, gun, move: true)
              lu[:"#{gun[:c]}_#{Units.sanitize(gun[:n])}"] = gun
            end
            lu
          end

          def at_guns
            lu = {}
            key = %i[c n y o]
            [
              ["alm", "Bofors 37mm AT", 35, { sn: 1 }],

              ["axm", "Bofors 37mm AT", 35, { sn: 1 }], ["axm", "3.7cm Pak 36", 36, {}],

              ["chi", "Type 30 AT", 36, {}], ["chi", "45mm 19-K", 34, {}],
              ["chi", "37mm M3", 42, {}],

              ["fin", "Bofors 37mm AT", 35, { sn: 1 }],

              ["fra", "25mm Hotchkiss", 34, { sn: 1 }], ["fra", "47mm APX", 39, {}],

              ["ger", "2.8cm sPzB 41", 41, {}], ["ger", "3.7cm Pak 36", 36, {}],
              ["ger", "5cm Pak 38", 40, {}], ["ger", "7.5cm Pak 97/38", 42, { sn: 1 }],
              ["ger", "7.5cm Pak 40", 42, {}], ["ger", "8.8cm Pak 43", 43, {}],
              ["ger", "12.8cm Pak 44", 44, {}], ["ger", "8.8cm Flak 36", 36, {}],

              ["ita", "Cannone da 47/32", 35, { sn: 3 }],
              ["ita", "Cannone da 47/40", 38, { sn: 3 }],
              ["ita", "Cannone da 75/46", 34, { sn: 3 }],
              ["ita", "Cannone da 90/53", 39, { sn: 3 }],

              ["jap", "37mm Type 94", 36, {}], ["jap", "37mm Type 1", 41, {}],
              ["jap", "47mm Type 1", 42, {}], ["jap", "75mm Type 90", 42, {}],

              ["uk", "QF 2-Pounder", 36, {}], ["uk", "QF 6Pdr Mk II", 41, {}],
              ["uk", "QF 6Pdr Mk IV", 41, {}], ["uk", "QF 17-Pounder", 43, {}],

              ["usa", "37mm M3", 38, {}], ["usa", "57mm M1", 42, {}], ["usa", "3inch M5", 43, {}],

              ["ussr", "45mm 19-K", 34, {}], ["ussr", "45mm 53-K", 37, {}],
              ["ussr", "45mm M-42", 42, {}], ["ussr", "57mm ZiS-2", 41, {}],
              ["ussr", "76mm F-22", 37, {}], ["ussr", "100mm BS-3", 44, {}],
            ].each do |unit|
              at = { t: "gun", i: "atgun" }
              unit.each_with_index do |v, i|
                at[key[i]] = v
              end
              Definitions.populate_gun_data(Units.sanitize(at[:n]).to_sym, at, move: true)
              lu[:"#{at[:c]}_#{Units.sanitize(at[:n])}"] = at
            end
            lu
          end
          # rubocop:enable Metrics/MethodLength
        end
      end
    end
  end
end
