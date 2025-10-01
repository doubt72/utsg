# frozen_string_literal: true

module Utility
  class Scenario
    module Units
      module Tanks # rubocop:disable Metrics/ModuleLength
        class << self
          # rubocop:disable Metrics/MethodLength
          def tanks
            lu = {}
            key = %i[c n y o]
            [
              # Romanian
              ["axm", "R-2", 38, {}],
              ["axm", "T-3", 42, {}],
              ["axm", "T-4", 43, {}],
              ["axm", "T-38", 40, {}],

              # Hungarian
              ["axm", "38M Toldi I", 39, {}],
              ["axm", "42M Toldi II", 42, {}],
              ["axm", "42M Toldi IIA", 43, {}],

              ["chi", "T-26", 38, {}],
              ["chi", "Vickers 6-Ton", 34, {}],
              ["chi", "M3 Stuart", 42, {}],
              ["chi", "M4 Sherman", 43, {}],

              ["fra", "Char B1", 35, {}],
              ["fra", "Char B1 bis", 37, {}],
              ["fra", "AMR 33", 33, {}],
              ["fra", "AMR 35 (7.5MG)", 36, { sn: 1 }],
              ["fra", "AMR 35 (13.2MG)", 36, { sn: 2 }],
              ["fra", "AMR 35 ZT2", 36, {}],
              ["fra", "FCM 36", 38, {}],
              ["fra", "Hotchkiss H35", 36, {}],
              ["fra", "Hotchkiss H35/39", 39, { sn: 2 }],
              ["fra", "Renault R35", 36, {}],
              ["fra", "Renault R40", 36, {}],
              ["fra", "AMC 35", 38, {}],
              ["fra", "Char D2", 36, {}],
              ["fra", "SOMUA S35", 35, {}],
              ["fra", "M4 Sherman", 43, {}],

              ["ger", "PzKpfw I", 34, {}],
              ["ger", "PzKpfw II-A/E", 37, {}],
              ["ger", "PzKpfw II-F", 41, {}],
              ["ger", "PzKpfw II Luchs", 43, {}],
              ["ger", "PzKpfw 35(t)", 38, {}],
              ["ger", "PzKpfw 38(t) A/D", 39, { sn: 2 }],
              ["ger", "PzKpfw 38(t) E/G", 40, { sn: 2 }],
              ["ger", "PzKpfw III ('39)", 39, {}],
              ["ger", "PzKpfw III ('40)", 40, {}],
              ["ger", "PzKpfw III-J", 41, {}],
              ["ger", "PzKpfw III-L", 41, {}],
              ["ger", "PzKpfw III-N", 42, {}],
              ["ger", "PzKpfw IV-A", 39, {}],
              ["ger", "PzKpfw IV-B/C", 39, {}],
              ["ger", "PzKpfw IV-D", 39, {}],
              ["ger", "PzKpfw IV-E", 40, {}],
              ["ger", "PzKpfw IV-F1", 41, {}],
              ["ger", "PzKpfw IV-F2", 42, {}],
              ["ger", "PzKpfw IV-G", 43, {}],
              ["ger", "PzKpfw IV-H/J", 43, {}],
              ["ger", "Panther D", 43, {}],
              ["ger", "Panther A/G", 43, {}],
              ["ger", "Tiger I", 42, {}],
              ["ger", "Tiger II", 44, {}],

              ["ita", "L5/30", 30, {}],
              ["ita", "L6/40", 40, {}],
              ["ita", "M11/39", 39, {}],
              ["ita", "M13/40", 40, {}],
              ["ita", "M14/41", 41, {}],
              ["ita", "M15/42", 43, {}],
              ["ita", "P26/40", 43, {}],

              ["jap", "Type 94", 34, {}],
              ["jap", "Type 97 Te-Ke", 38, {}],
              ["jap", "Type 97 Te-Ke MG", 30, { sn: 3 }],
              ["jap", "Type 95 Ha-Go", 33, {}],
              ["jap", "Type 89 I-Go", 31, {}],
              ["jap", "Type 97 Chi-Ha", 38, {}],
              ["jap", "Type 97 Kai", 39, {}],
              ["jap", "Type 2 Ka-Mi", 41, {}],

              ["uk", "Light Tank Mk VI", 36, { sn: 1 }],
              ["uk", "Tetrarch", 38, {}],
              ["uk", "Cruiser Mk I", 38, {}],
              ["uk", "Cruiser Mk II", 40, {}],
              ["uk", "Cruiser Mk III", 40, {}],
              ["uk", "Cruiser Mk IV", 40, {}],
              ["uk", "Crusader I", 41, {}],
              ["uk", "Crusader II", 41, {}],
              ["uk", "Crusader III", 42, {}],
              ["uk", "Centaur", 44, {}],
              ["uk", "Cromwell", 44, {}],
              ["uk", "Challenger", 44, {}],
              ["uk", "Comet", 44, {}],
              ["uk", "Matilda I", 38, {}],
              ["uk", "Matilda II", 39, {}],
              ["uk", "Valentine I-VII", 40, {}],
              ["uk", "Valentine IX-X", 43, {}],
              ["uk", "Churchill I-II", 41, {}],
              ["uk", "Churchill III-IV", 42, {}],
              ["uk", "Churchill V-VI", 43, {}],
              ["uk", "Churchill VII-VIII", 44, { sn: 1 }],
              ["uk", "M3 Stuart", 41, {}],
              ["uk", "M22 Locust", 42, {}],
              ["uk", "M24 Chaffee", 44, {}],
              ["uk", "M3 Lee", 41, {}],
              ["uk", "M3 Grant", 41, {}],
              ["uk", "M4 Sherman", 42, {}],
              ["uk", "M4(76) Sherman", 43, { sn: 1 }],
              ["uk", "Sherman Firefly", 43, {}],

              ["usa", "M2A4", 35, {}],
              ["usa", "M3 Stuart", 41, {}],
              ["usa", "M5 Stuart", 42, {}],
              ["usa", "M24 Chaffee", 44, {}],
              ["usa", "M3 Lee", 41, {}],
              ["usa", "M4 Sherman", 42, {}],
              ["usa", "M4(105) Sherman", 42, { sn: 2 }],
              ["usa", "M4(76) Sherman", 43, { sn: 1 }],
              ["usa", "M4 Sherman Jumbo", 44, { sn: 4 }],
              ["usa", "M4(76) Sher. Jumbo", 44, { sn: 4 }],
              ["usa", "M26 Pershing", 44, {}],

              ["ussr", "BT-5", 32, {}],
              ["ussr", "BT-7", 35, {}],
              ["ussr", "T-26 M38", 38, {}],
              ["ussr", "T-26 M39", 39, {}],
              ["ussr", "T-70", 42, {}],
              ["ussr", "T-34 M40", 40, {}],
              ["ussr", "T-34 M41", 41, {}],
              ["ussr", "T-34 M42/M43", 42, {}],
              ["ussr", "T-34-85", 43, {}],
              ["ussr", "T-34-85 M44", 44, {}],
              ["ussr", "KV-1 M39", 39, {}],
              ["ussr", "KV-1 M40", 40, {}],
              ["ussr", "KV-1 M41", 41, {}],
              ["ussr", "KV-1 M42", 42, {}],
              ["ussr", "KV-1S", 42, {}],
              ["ussr", "KV-2", 40, {}],
              ["ussr", "KV-85", 43, {}],
              ["ussr", "IS-2", 44, {}],
              ["ussr", "Matilda II", 41, {}],
              ["ussr", "Valentine", 41, {}],
              ["ussr", "Churchill II", 41, {}],
              ["ussr", "Churchill III", 42, {}],
              ["ussr", "M3 Stuart", 41, { bd: 4 }],
              ["ussr", "M3 Grant", 41, { bd: 4 }],
              ["ussr", "M4 Sherman", 43, {}],
              ["ussr", "M4(76) Sherman", 44, { sn: 1 }],
            ].each do |unit|
              tank = { t: "tank", i: "tank" }
              unit.each_with_index do |v, i|
                tank[key[i]] = v
              end
              Definitions.populate_vehicle_data(Units.sanitize(tank[:n]).to_sym, tank)
              tank[:i] = "tank-amp" if tank[:o][:amp]
              lu[:"#{tank[:c]}_#{Units.sanitize(tank[:n])}"] = tank
            end
            lu
          end
          # rubocop:enable Metrics/MethodLength
        end
      end
    end
  end
end
