# frozen_string_literal: true

module Utility
  class Scenario
    module Units
      module UtilityVehicles # rubocop:disable Metrics/ModuleLength
        class << self
          # rubocop:disable Metrics/MethodLength, Metrics/AbcSize, Metrics/CyclomaticComplexity
          def utility_vehicles
            half_tracks.merge(trucks).merge(cavalry)
          end

          def half_tracks
            # Usually carriers (or base), sometimes fully tracked, some
            # infantry, some more for artillery
            lu = {}
            key = %i[c n y o]
            [
              ["chi", "M5 Half-track", 42],

              ["fra", "Renault UE", 32], ["fra", "Lorraine 37L", 39], ["fra", "M9 Half-track", 41],

              ["ger", "SdKfz 250/1", 41], ["ger", "SdKfz 250/7", 41], ["ger", "SdKfz 250/8", 41],
              ["ger", "SdKfz 250/9", 41], ["ger", "SdKfz 250/10", 41], ["ger", "SdKfz 250/11", 41],
              ["ger", "SdKfz 251/1", 39], ["ger", "SdKfz 251/9", 39], ["ger", "SdKfz 251/10", 39],
              ["ger", "SdKfz 251/16", 39],

              ["jap", "Type 98 So-Da", 41], ["jap", "Type 100 Te-Re", 40],
              ["jap", "Type 1 Ho-Ha", 44],

              ["uk", "Loyd Carrier", 39], ["uk", "Universal Carrier", 37, { sn: 1 }],
              ["uk", "U. Carrier 2Pdr", 41], ["uk", "U. Carrier 6Pdr", 41],
              ["uk", "U. Carrier Wasp", 44], ["uk", "M5 Half-track", 42],

              ["usa", "M2 Half-track", 41], ["usa", "M3 Half-track", 41],
              ["usa", "M3A1 Half-track", 42], ["usa", "M2 Half-track", 41], ["usa", "LVT-1", 41],
              ["usa", "LVT-2", 43], ["usa", "LVT-4", 44], ["usa", "LVT(A)-1", 43],
              ["usa", "LVT(A)-2", 43], ["usa", "LVT(A)-4", 44], ["usa", "M3 GMC", 42],
              ["usa", "T19 HMC", 42], ["usa", "T19/M21 MMC", 42],

              ["ussr", "M5 Half-track", 42], ["ussr", "M9 Half-track", 41], ["ussr", "T48 GMC", 42],
            ].each do |unit|
              ht = { t: "ht", i: "ht" }
              unit.each_with_index do |v, i|
                ht[key[i]] = v
              end
              Definitions.populate_vehicle_data(Units.sanitize(ht[:n]).to_sym, ht)
              ht[:i] = "htgun" if ht[:o][:g]
              ht[:i] = "htat" if ht[:o][:p]
              ht[:i] = "htmtr" if ht[:o][:m]
              ht[:i] = "htft" if ht[:o][:i]
              ht[:i] += "-amp" if ht[:o][:amp]
              lu[:"#{ht[:c]}_#{Units.sanitize(ht[:n])}"] = ht
            end
            lu
          end

          def trucks
            lu = {}
            key = %i[c n i y o]
            [
              ["alm", "Polski Fiat 621", "truck", 35],

              ["fra", "Laffly S20", "truck", 37], ["fra", "Citroen U23", "truck", 35],
              ["fra", "Dodge WC-51", "truck", 41], ["fra", "Jeep", "car", 41],

              ["ger", "Kettenkrad", "truck", 41], ["ger", "Maultier", "truck", 41],
              ["ger", "SdKfz 6", "truck", 39], ["ger", "SdKfz 7", "truck", 38],
              ["ger", "SdKfz 8", "truck", 37], ["ger", "SdKfz 9", "truck", 39],
              ["ger", "SdKfz 10", "truck", 38], ["ger", "SdKfz 11", "truck", 38],
              ["ger", "M.-Benz L3000", "truck", 38], ["ger", "Opel Blitz", "truck", 30],
              ["ger", "BMW 325", "car", 36], ["ger", "VW Kübelwagen", "car", 40, { sn: 1 }],
              ["ger", "m. E. Pkw", "car", 37], ["ger", "s. E. Pkw", "truck", 38],
              ["ger", "le. gl. Lkw", "truck", 37],

              ["ita", "Alfa Romeo 430", "truck", 42], ["ita", "Alfa Romeo 500", "truck", 37],
              ["ita", "Alfa Romeo 800", "truck", 40],

              ["uk", "Bedford MW", "truck", 39], ["uk", "Bedford OY", "truck", 39],
              ["uk", "Bedford QL", "truck", 41], ["uk", "Ford F15", "truck", 39],
              ["uk", "Dodge D60", "truck", 39], ["uk", "Chevy C30", "truck", 39],
              ["uk", "Chevy C30 MG", "truck", 40], ["uk", "Chevy C30 AT", "truck", 40],
              ["uk", "AEC Mk I Deacon", "truck", 42, { sn: 1 }], ["uk", "Dodge WC-51", "truck", 41],
              ["uk", "Jeep", "car", 41], ["uk", "Jeep MG", "car", 41],
              ["uk", "Jeep Vickers .50", "car", 41, { sn: 1 }],

              ["usa", "Dodge VC G-505", "truck", 40, { sn: 1 }],
              ["usa", "Dodge WC-51", "truck", 41], ["usa", "GMC CCKW", "truck", 41],
              ["usa", "Jeep", "car", 41], ["usa", "Jeep .50 MG", "car", 42],
              ["usa", "M6 GMC", "truck", 42], ["usa", "GMC DUKW", "truck-amp", 42],

              ["ussr", "GAZ-67", "car", 43], ["ussr", "GAZ-AA", "truck", 32],
              ["ussr", "GAZ-AAA", "truck", 36], ["ussr", "GAZ-MM", "truck", 36],
              ["ussr", "ZIS-5", "truck", 34], ["ussr", "Dodge WC-51", "truck", 42],
              ["ussr", "Studebaker US6", "truck", 41, { sn: 1 }], ["ussr", "Jeep", "car", 41],
            ].each do |unit|
              truck = { t: "truck" }
              unit.each_with_index do |v, i|
                truck[key[i]] = v
              end
              truck[:i] = "truck-at" if ["AEC Mk I Deacon", "M6 GMC"].include?(truck[:n])
              Definitions.populate_vehicle_data(Units.sanitize(truck[:n]).to_sym, truck)
              lu[:"#{truck[:c]}_#{Units.sanitize(truck[:n])}"] = truck
            end
            lu
          end

          def cavalry
            lu = {}
            key = %i[c n i y o]
            [
              ["alm", "Horse", "cav", 0], ["alm", "Sokol 1000", "cav-wheel", 33],

              ["axm", "Horse", "cav", 0],

              ["chi", "Horse", "cav", 0],

              ["fra", "Horse", "cav", 0],

              ["ger", "Horse", "cav", 0], ["ger", "BMW R75", "cav-wheel", 41],
              ["ger", "Zündapp KS 750", "cav-wheel", 41, { sn: 1 }],
              ["ger", "BMW R17", "cav-wheel", 35],

              ["jap", "Horse", "cav", 0], ["jap", "Bicycle", "cav-wheel", 30],

              ["uk", "Horse", "cav", 0],

              ["usa", "Harley-D. WLA", "cav-wheel", 40],

              ["ussr", "Horse", "cav", 0], ["ussr", "PMZ-A-750", "cav-wheel", 34],
              ["ussr", "Dnepr M-72", "cav-wheel", 42],
            ].each do |unit|
              cav = { t: "cav" }
              unit.each_with_index do |v, i|
                cav[key[i]] = v
              end
              Definitions.populate_vehicle_data(Units.sanitize(cav[:n]).to_sym, cav)
              lu[:"#{cav[:c]}_#{Units.sanitize(cav[:n])}"] = cav
            end
            lu
          end
          # rubocop:enable Metrics/MethodLength, Metrics/AbcSize, Metrics/CyclomaticComplexity
        end
      end
    end
  end
end
