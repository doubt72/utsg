# frozen_string_literal: true

module Utility
  class Scenario
    module Units
      module ArmoredFightingVehicles # rubocop:disable Metrics/ModuleLength
        class << self
          # rubocop:disable Metrics/MethodLength, Metrics/AbcSize, Metrics/CyclomaticComplexity
          def armored_fighting_vehicles
            tanks.merge(sp_guns).merge(armored_cars)
          end

          def tanks
            lu = {}
            key = %i[c n y o]
            [
              # Romanian
              ["axm", "R-2", 38], ["axm", "T-3", 42], ["axm", "T-4", 43], ["axm", "T-38", 40],

              # Hungarian
              ["axm", "38M Toldi I", 39], ["axm", "42M Toldi II", 42], ["axm", "42M Toldi IIA", 43],

              ["chi", "T-26", 38], ["chi", "Vickers 6-Ton", 34], ["chi", "M3 Stuart", 42],
              ["chi", "M4 Sherman", 43],

              ["fra", "Char B1", 35], ["fra", "Char B1 bis", 37], ["fra", "AMR 33", 33],
              ["fra", "AMR 35 (7.5MG)", 36, { sn: 1 }], ["fra", "AMR 35 (13.2MG)", 36, { sn: 2 }],
              ["fra", "AMR 35 ZT2", 36], ["fra", "FCM 36", 38], ["fra", "Hotchkiss H35", 36],
              ["fra", "Renault R35", 36], ["fra", "Renault R40", 36], ["fra", "AMC 35", 38],
              ["fra", "Char D2", 36], ["fra", "SOMUA S35", 35], ["fra", "M4 Sherman", 43],

              ["ger", "PzKpfw I", 34], ["ger", "PzKpfw II-A/E", 37], ["ger", "PzKpfw II-F", 41],
              ["ger", "PzKpfw II Luchs", 43], ["ger", "PzKpfw 35(t)", 38],
              ["ger", "PzKpfw 38(t) A/D", 39, { sn: 2 }],
              ["ger", "PzKpfw 38(t) E/G", 40, { sn: 2 }], ["ger", "PzKpfw III ('39)", 39],
              ["ger", "PzKpfw III ('40)", 40], ["ger", "PzKpfw III-J", 41],
              ["ger", "PzKpfw III-L", 41], ["ger", "PzKpfw III-N", 42], ["ger", "PzKpfw IV-A", 39],
              ["ger", "PzKpfw IV-B/C", 39], ["ger", "PzKpfw IV-D", 39], ["ger", "PzKpfw IV-E", 40],
              ["ger", "PzKpfw IV-F1", 41], ["ger", "PzKpfw IV-F2", 42], ["ger", "PzKpfw IV-G", 43],
              ["ger", "PzKpfw IV-H/J", 43], ["ger", "Panther D", 43], ["ger", "Panther A/G", 43],
              ["ger", "Tiger I", 42], ["ger", "Tiger II", 44],

              ["ita", "L5/30", 30], ["ita", "L6/40", 40], ["ita", "M11/39", 39],
              ["ita", "M13/40", 40], ["ita", "M14/41", 41], ["ita", "M15/42", 43],
              ["ita", "P26/40", 43],

              ["jap", "Type 94", 34], ["jap", "Type 97 Te-Ke", 38],
              ["jap", "Type 97 Te-Ke MG", 30, { sn: 3 }], ["jap", "Type 95 Ha-Go", 33],
              ["jap", "Type 89 I-Go", 31], ["jap", "Type 97 Chi-Ha", 38],
              ["jap", "Type 97 Kai", 39], ["jap", "Type 2 Ka-Mi", 41],

              ["uk", "Light Tank Mk VI", 36, { sn: 1 }], ["uk", "Tetrarch", 38],
              ["uk", "Cruiser Mk I", 38], ["uk", "Cruiser Mk II", 40], ["uk", "Cruiser Mk III", 40],
              ["uk", "Cruiser Mk IV", 40], ["uk", "Crusader I", 41], ["uk", "Crusader II", 41],
              ["uk", "Crusader III", 42], ["uk", "Centaur", 44], ["uk", "Cromwell", 44],
              ["uk", "Challenger", 44], ["uk", "Comet", 44], ["uk", "Matilda I", 38],
              ["uk", "Matilda II", 39], ["uk", "Valentine I-VII", 40], ["uk", "Valentine IX-X", 43],
              ["uk", "Churchill I-II", 41], ["uk", "Churchill III-IV", 42],
              ["uk", "Churchill V-VI", 43], ["uk", "Churchill VII-VIII", 44, { sn: 1 }],
              ["uk", "M3 Stuart", 41], ["uk", "M22 Locust", 42], ["uk", "M24 Chaffee", 44],
              ["uk", "M3 Lee", 41], ["uk", "M3 Grant", 41], ["uk", "M4 Sherman", 42],
              ["uk", "M4(76) Sherman", 43, { sn: 1 }], ["uk", "Sherman Firefly", 43],

              ["usa", "M.-H. CTLS-4", 43], ["usa", "M2A4", 35], ["usa", "M3 Stuart", 41],
              ["usa", "M5 Stuart", 42], ["usa", "M24 Chaffee", 44], ["usa", "M3 Lee", 41],
              ["usa", "M4 Sherman", 42], ["usa", "M4(105) Sherman", 42, { sn: 2 }],
              ["usa", "M4(76) Sherman", 43, { sn: 1 }], ["usa", "M4 Sherman Jumbo", 44, { sn: 4 }],
              ["usa", "M4(76) Sh. Jumbo", 44, { sn: 3 }], ["usa", "M26 Pershing", 44],

              ["ussr", "BT-5", 32], ["ussr", "BT-7", 35], ["ussr", "T-26 M38", 38],
              ["ussr", "T-26 M39", 39], ["ussr", "T-70", 42], ["ussr", "T-34 M40", 40],
              ["ussr", "T-34 M41", 41], ["ussr", "T-34 M42/M43", 42], ["ussr", "T-34-85", 43],
              ["ussr", "T-34-85 M44", 44], ["ussr", "KV-1 M39", 39], ["ussr", "KV-1 M40", 40],
              ["ussr", "KV-1 M41", 41], ["ussr", "KV-1 M42", 42], ["ussr", "KV-1S", 42],
              ["ussr", "KV-2", 40], ["ussr", "KV-85", 43], ["ussr", "IS-2", 44],
              ["ussr", "Matilda II", 41], ["ussr", "Valentine", 41], ["ussr", "Churchill II", 41],
              ["ussr", "Churchill III", 42], ["ussr", "M3 Stuart", 41, { bd: 4 }],
              ["ussr", "M3 Grant", 41, { bd: 4 }], ["ussr", "M4 Sherman", 43],
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

          def sp_guns
            lu = {}
            key = %i[c n y o]
            [
              # Hungarian
              ["axm", "Fiat L3", 35],

              ["fra", "AMR 35 ZT3", 36], ["fra", "M10", 43],

              ["ger", "PzKpfw II Flamm", 40, { sn: 1 }], ["ger", "StuG III-A", 40],
              ["ger", "StuG III-B/E", 40], ["ger", "StuG III-F/G", 42], ["ger", "StuH 42", 42],
              ["ger", "StuG IV", 43], ["ger", "SdKfz 166", 42], ["ger", "Panzerjäger I", 40],
              ["ger", "Marder I", 42], ["ger", "Marder II", 42], ["ger", "Marder III", 42],
              ["ger", "Marder III-H/M", 43], ["ger", "Nashorn", 42], ["ger", "Elefant", 42],
              ["ger", "Jagdpanzer IV", 43], ["ger", "Hetzer", 44], ["ger", "Jagdpanther", 44],
              ["ger", "Jagdtiger", 44],

              ["ita", "L3/33", 33], ["ita", "L3/35", 35], ["ita", "L3/38", 38],
              ["ita", "Semovente da 47/32", 42, { sn: 4 }],
              ["ita", "Semovente da 75/18", 42, { sn: 4 }],

              ["jap", "Type 97 Chi-Ha FT", 41, { sn: 3 }], ["jap", "Type 1 Ho-Ni I", 42],
              ["jap", "Type 1 Ho-Ni II", 43], ["jap", "Type 1 Ho-Ni III", 44],

              ["uk", "Cruiser Mk I CS", 38], ["uk", "Cruiser Mk II CS", 40, { sn: 1 }],
              ["uk", "Crusader I CS", 41], ["uk", "Crusader II CS", 42],
              ["uk", "Matilda II CS", 39], ["uk", "Matilda Frog", 44],
              ["uk", "Valentine III CS", 40], ["uk", "Churchill Crocodile", 44, { sn: 3 }],
              ["uk", "M10 Achilles", 42], ["uk", "M10 Achilles C", 43],

              ["usa", "M3A1 Stuart FT", 44], ["usa", "M4 Sherman Flame", 44, { sn: 3 }],
              ["usa", "M10", 42], ["usa", "M10A1", 43], ["usa", "M18 Hellcat", 43],
              ["usa", "M8 Scott", 42], ["usa", "M36 Jackson", 44],

              ["ussr", "SU-76", 42], ["ussr", "SU-76M", 42], ["ussr", "SU-85", 43],
              ["ussr", "SU-100", 44], ["ussr", "SU-122", 42], ["ussr", "SU-152", 43],
              ["ussr", "ISU-122", 44], ["ussr", "ISU-152", 43],
            ].each do |unit|
              spg = { t: "spg" }
              unit.each_with_index do |v, i|
                spg[key[i]] = v
              end
              Definitions.populate_vehicle_data(Units.sanitize(spg[:n]).to_sym, spg)
              spg[:i] = "spg" if spg[:o][:g]
              spg[:i] = "spgmg" if spg[:o][:r]
              spg[:i] = "spat" if spg[:o][:p]
              spg[:i] = "spft" if spg[:o][:i] || spg[:o][:sg]
              lu[:"#{spg[:c]}_#{Units.sanitize(spg[:n])}"] = spg
            end
            lu
          end

          def armored_cars
            # Except one half-track
            lu = {}
            key = %i[c n y o]
            [
              ["chi", "M3A1 Scout Car", 39, { sn: 1 }],

              ["fra", "AMC Schneider P16", 28, { sn: 4 }], ["fra", "White AM AC", 15],
              ["fra", "Panhard 178", 37], ["fra", "M8 Greyhound", 43],

              ["ger", "SdKfz 221", 35], ["ger", "SdKfz 222", 37], ["ger", "SdKfz 234/1", 43],
              ["ger", "SdKfz 234/2", 43], ["ger", "SdKfz 234/3", 44], ["ger", "SdKfz 234/4", 44],

              ["ita", "Autoblindo 41", 41],

              ["jap", "Chiyoda AC", 31], ["jap", "Sumida Type 91", 33, { sn: 1 }],

              ["uk", "AEC AC I", 41], ["uk", "AEC AC II", 42], ["uk", "AEC AC II CS", 42],
              ["uk", "Daimler AC", 41], ["uk", "Daimler AC CS", 41], ["uk", "Humber AC I", 40],
              ["uk", "Humber AC IV", 42], ["uk", "T17E1 Staghound", 44, { sn: 1 }],
              ["uk", "Humber LRC", 40], ["uk", "M3A1 Scout Car", 39, { sn: 1 }],
              ["uk", "M8 Greyhound", 43],

              ["usa", "M3A1 Scout Car", 39, { sn: 1 }], ["usa", "M8 Greyhound", 43],
              ["usa", "M20 Greyhound", 43, { sn: 1 }],

              ["ussr", "BA-10", 38], ["ussr", "BA-20", 36], ["ussr", "BA-64", 42],
              ["ussr", "M3A1 Scout Car", 39, { sn: 1 }],
            ].each do |unit|
              ac = { t: "ac", i: "ac" }
              unit.each_with_index do |v, i|
                ac[key[i]] = v
              end
              Definitions.populate_vehicle_data(Units.sanitize(ac[:n]).to_sym, ac)
              ac[:i] = "acav" if ac[:n] == "AMC Schneider P16"
              lu[:"#{ac[:c]}_#{Units.sanitize(ac[:n])}"] = ac
            end
            lu
          end
          # rubocop:enable Metrics/MethodLength, Metrics/AbcSize, Metrics/CyclomaticComplexity
        end
      end
    end
  end
end
