# frozen_string_literal: true

module Utility
  class Scenario
    module Units
      module Guns
        class << self
          # rubocop:disable Metrics/MethodLength
          def guns
            infantry_guns.merge(at_guns)
          end

          def infantry_guns
            lu = {}
            key = %i[c n y f r o]
            [
              ["alm", "75mm Gun", 32, 16, 16, { tow: 3 }],
              ["chi", "Bofors 75mm", 23, 16, 16, { tow: 3 }],
              ["chi", "75mm M1 Pack", 42, 16, 16, { tow: 3 }],
              ["chi", "75mm Gun", 32, 16, 16, { tow: 3 }],
              ["fra", "75mm M1897", 0, 16, 16, { tow: 3 }],
              ["fra", "37mm M1916", 16, 4, 12, { tow: 2 }],
              ["ger", "7.5cm leIG 18", 32, 16, 14, { tow: 3 }],
              ["ger", "15cm sIG 33", 36, 64, 18, { tow: 4 }],
              ["ita", "Cannone da 65/17", 13, 12, 12, { sn: 2, tow: 3 }],
              ["ita", "Obice da 75/18", 34, 16, 14, { tow: 3 }],
              ["ita", "Obice da 100/17", 14, 32, 16, { tow: 4 }],
              ["jap", "70mm Type 92", 32, 12, 14, { tow: 3 }],
              ["uk", "QF 25-Pounder", 40, 20, 16, { tow: 3 }],
              ["uk", "QF 25Pdr Short", 43, 16, 15, { tow: 3 }],
              ["uk", "QF 4.5inch", 8, 32, 20, { tow: 3 }],
              ["usa", "75mm M1 Pack", 27, 16, 16, { tow: 3 }],
              ["usa", "75mm M1897", 40, 16, 16, { tow: 3 }],
              ["ussr", "76mm M1927", 28, 16, 16, { tow: 3 }],
            ].each do |unit|
              gun = { t: "gun", i: "gun", v: 1, s: 3 }
              unit.each_with_index do |v, i|
                gun[key[i]] = v
              end
              gun[:v] = 2 if gun[:f] < 10
              gun[:s] = 2 if gun[:f] < 10
              gun[:o].merge!({ t: 1, j: 3, f: 18, g: 1, s: 1, c: 1 })
              lu[:"#{gun[:c]}_#{Units.sanitize(gun[:n])}"] = gun
            end
            lu
          end

          def at_guns
            lu = {}
            key = %i[c n y f r o]
            [
              ["axm", "3.7cm Pak 36", 36, 8, 16, { tow: 2 }],
              ["chi", "Type 30 AT Gun", 36, 8, 16, { tow: 2 }],
              ["chi", "45mm 19-K", 34, 12, 16, { tow: 2 }],
              ["chi", "37mm M3", 42, 7, 12, { tow: 2 }],
              ["fra", "25mm Hotchkiss", 34, 4, 12, { sn: 1, tow: 2 }],
              ["fra", "47mm ATX", 39, 16, 16, { tow: 2 }],
              ["ger", "2.8cm sPzB 41", 41, 8, 10, { tow: 2 }],
              ["ger", "3.7cm Pak 36", 36, 8, 16, { tow: 2 }],
              ["ger", "5cm Pak 38", 40, 24, 16, { tow: 2 }],
              ["ger", "7.5cm Pak 97/38", 42, 24, 20, { sn: 1, tow: 3 }],
              ["ger", "7.5cm Pak 40", 42, 32, 24, { tow: 3 }],
              ["ger", "8.8cm Pak 43/41", 43, 64, 32, { sn: 1, tow: 4 }],
              ["ger", "8.8cm Pak 43", 43, 64, 32, { y: 1, tow: 4 }],
              ["ger", "12.8cm Pak 44", 44, 96, 40, { y: 1, tow: 4 }],
              ["ger", "8.8cm Flak 36", 36, 48, 30, { y: 1, tow: 4 }],
              ["ita", "Cannone da 47/32", 35, 12, 16, { sn: 2, tow: 2  }],
              ["ita", "Cannone da 47/40", 38, 16, 16, { sn: 2, tow: 2  }],
              ["ita", "Cannone da 75/46", 34, 32, 24, { sn: 2, tow: 3 }],
              ["ita", "Cannone da 90/53", 39, 48, 32, { sn: 2, tow: 4 }],
              ["jap", "37mm Type 94", 36, 8, 14, { tow: 2 }],
              ["jap", "37mm Type 1", 41, 10, 16, { tow: 2 }],
              ["jap", "47mm Type 1", 42, 16, 16, { tow: 2 }],
              ["jap", "75mm Type 90", 42, 32, 20, { tow: 3 }],
              ["uk", "QF 2-Pounder", 36, 10, 12, { tow: 2 }],
              ["uk", "QF 6Pdr Mk II", 41, 20, 16, { tow: 3 }],
              ["uk", "QF 6Pdr Mk IV", 41, 24, 20, { tow: 3 }],
              ["uk", "QF 17-Pounder", 43, 48, 24, { tow: 4 }],
              ["usa", "37mm M3", 38, 7, 12, { tow: 2 }],
              ["usa", "57mm M1", 42, 20, 16, { tow: 2 }],
              ["usa", "57mm M1A2", 43, 20, 16, { tow: 2 }],
              ["usa", "3inch M5", 43, 40, 24, { tow: 3 }],
              ["ussr", "45mm 19-K", 34, 12, 16, { tow: 2 }],
              ["ussr", "45mm 53-K", 37, 12, 16, { tow: 2 }],
              ["ussr", "45mm M-42", 42, 16, 16, { tow: 2 }],
              ["ussr", "57mm ZiS-2", 41, 24, 20, { tow: 2 }],
              ["ussr", "76mm F-22", 37, 32, 24, { tow: 3 }],
              ["ussr", "100mm BS-3", 44, 64, 30, { tow: 4 }],
            ].each do |unit|
              at = { t: "gun", i: "atgun", v: 1, s: 3 }
              unit.each_with_index do |v, i|
                at[key[i]] = v
              end
              at[:v] = 2 if at[:f] < 10
              at[:s] = 2 if at[:f] < 10
              at[:o].merge!({ t: 1, j: 3, f: 18, p: 1, c: 1 })
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
