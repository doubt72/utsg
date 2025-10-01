# frozen_string_literal: true

module Utility
  class Scenario
    module Units
      module SpGuns
        class << self
          # rubocop:disable Metrics/MethodLength, Metrics/AbcSize, Metrics/CyclomaticComplexity
          def sp_guns
            lu = {}
            key = %i[c n y o]
            [
              # Hungarian
              ["axm", "Fiat L3", 35, {}],

              ["fra", "AMR 35 ZT3", 36, {}],
              ["fra", "M10", 43, {}],

              ["ger", "PzKpfw II Flamm", 40, { sn: 1 }],
              ["ger", "StuG III-A", 40, {}],
              ["ger", "StuG III-B/E", 40, {}],
              ["ger", "StuG III-F/G", 42, {}],
              ["ger", "StuH 42", 42, {}],
              ["ger", "StuG IV", 43, {}],
              ["ger", "SdKfz 166", 42, {}],
              ["ger", "Panzerjäger I", 40, {}],
              ["ger", "Marder I", 42, {}],
              ["ger", "Marder II", 42, {}],
              ["ger", "Marder III", 42, {}],
              ["ger", "Marder III-H/M", 43, {}],
              ["ger", "Nashorn", 42, {}],
              ["ger", "Elefant", 42, {}],
              ["ger", "Jagdpanzer IV", 43, {}],
              ["ger", "Hetzer", 44, {}],
              ["ger", "Jagdpanther", 44, {}],
              ["ger", "Jagdtiger", 44, {}],

              ["ita", "L3/33", 33, {}],
              ["ita", "L3/35", 35, {}],
              ["ita", "L3/38", 38, {}],
              ["ita", "Semovente da 47/32", 42, { sn: 4 }],
              ["ita", "Semovente da 75/18", 42, { sn: 4 }],

              ["jap", "Type 97 Chi-Ha FT", 41, { sn: 3 }],
              ["jap", "Type 1 Ho-Ni I", 42, {}],
              ["jap", "Type 1 Ho-Ni II", 43, {}],
              ["jap", "Type 1 Ho-Ni III", 44, {}],

              ["uk", "Cruiser Mk I CS", 38, {}],
              ["uk", "Cruiser Mk II CS", 40, { sn: 1 }],
              ["uk", "Crusader I CS", 41, {}],
              ["uk", "Crusader II CS", 42, {}],
              ["uk", "Matilda II CS", 39, {}],
              ["uk", "Matilda Frog", 44, {}],
              ["uk", "Valentine III CS", 40, {}],
              ["uk", "Churchill Crocodile", 44, { sn: 3 }],
              ["uk", "M10 Achilles", 42, {}],
              ["uk", "M10 Achilles C", 43, {}],

              ["usa", "M3A1 Stuart FT", 44, {}],
              ["usa", "M4 Sherman Flame", 44, { sn: 3 }],
              ["usa", "M10", 42, {}],
              ["usa", "M10A1", 43, {}],
              ["usa", "M18 Hellcat", 43, {}],
              ["usa", "M8 Scott", 42, {}],
              ["usa", "M36 Jackson", 44, {}],

              ["ussr", "SU-76", 42, {}],
              ["ussr", "SU-76M", 42, {}],
              ["ussr", "SU-85", 43, {}],
              ["ussr", "SU-100", 44, {}],
              ["ussr", "SU-122", 42, {}],
              ["ussr", "SU-152", 43, {}],
              ["ussr", "ISU-122", 44, {}],
              ["ussr", "ISU-152", 43, {}],
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
          # rubocop:enable Metrics/MethodLength, Metrics/AbcSize, Metrics/CyclomaticComplexity
        end
      end
    end
  end
end
