# frozen_string_literal: true

module Utility
  class Scenario
    module Units
      module UtilityVehicles
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
              ["chi", "M5 Half-track", 42, {}],

              ["fra", "Renault UE", 32, {}], ["fra", "Lorraine 37L", 39, {}],
              ["fra", "M9 Half-track", 41, {}],

              ["ger", "SdKfz 250/1", 41, {}], ["ger", "SdKfz 250/7", 41, {}],
              ["ger", "SdKfz 250/8", 41, {}], ["ger", "SdKfz 250/9", 41, {}],
              ["ger", "SdKfz 250/10", 41, {}], ["ger", "SdKfz 250/11", 41, {}],
              ["ger", "SdKfz 251/1", 39, {}], ["ger", "SdKfz 251/9", 39, {}],
              ["ger", "SdKfz 251/10", 39, {}], ["ger", "SdKfz 251/16", 39, {}],

              ["jap", "Type 98 So-Da", 41, {}], ["jap", "Type 100 Te-Re", 40, {}],
              ["jap", "Type 1 Ho-Ha", 44, {}],

              ["uk", "Loyd Carrier", 39, {}], ["uk", "Universal Carrier", 40, { sn: 1 }],
              ["uk", "U Carrier 2Pdr", 41, {}], ["uk", "U Carrier 6Pdr", 41, {}],
              ["uk", "U Carrier Wasp", 41, {}], ["uk", "M5 Half-track", 42, {}],

              ["usa", "M2 Half-track", 41, {}], ["usa", "M3 Half-track", 41, {}],
              ["usa", "M3A1 Half-track", 42, {}], ["usa", "M2 Half-track", 41, {}],
              ["usa", "LVT-1", 41, {}], ["usa", "LVT-2", 43, {}], ["usa", "LVT-4", 44, {}],
              ["usa", "LVT(A)-1", 41, {}], ["usa", "LVT(A)-2", 43, {}], ["usa", "LVT(A)-4", 44, {}],
              ["usa", "M3 GMC", 42, {}], ["usa", "T19 HMC", 42, {}],
              ["usa", "T19/M21 MMC", 42, {}],

              ["ussr", "M5 Half-track", 42, {}], ["ussr", "M9 Half-track", 41, {}],
              ["ussr", "T48 GMC", 42, {}],
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
            Units.trucks
          end

          def cavalry
            {}
          end
          # rubocop:enable Metrics/MethodLength, Metrics/AbcSize, Metrics/CyclomaticComplexity
        end
      end
    end
  end
end
