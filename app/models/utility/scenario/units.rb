# frozen_string_literal: true

module Utility
  class Scenario
    module Units # rubocop:disable Metrics/ModuleLength
      class << self
        # rubocop:disable Metrics/MethodLength, Metrics/AbcSize, Metrics/CyclomaticComplexity
        # rubocop:disable Metrics/PerceivedComplexity, Layout/LineLength
        def lookup_data
          # rubocop: disable Style/ClassVars
          @@lu ||= Markers.markers
                          .merge(Features.features)
                          .merge(Infantry.infantry)
                          .merge(InfantryWeapons.infantry_weapons)
                          .merge(Guns.guns)
                          .merge(ArmoredFightingVehicles.armored_fighting_vehicles)
                          .merge(half_tracks)
                          .merge(trucks)
                          .merge(other)
          # rubocop: enable Style/ClassVars
        end

        def unit_definition(code)
          lookup = lookup_data
          if code.is_a? Array
            lookup[code[1]]&.merge(id: code[1])&.merge(x: code[0]) || { not_found: true, code: }
          else
            lookup[code]&.merge(id: code) || { not_found: true, code: }
          end
        end

        def sanitize(name)
          sanitized = name.gsub(%r{[-\s/.']}, "_").gsub(/['()]/, "").downcase
          sanitized = sanitized.gsub("ä", "a").gsub("ö", "o").gsub("ü", "u")
          sanitized = sanitized.gsub("é", "e")
          puts sanitized unless sanitized =~ /^[a-z0-9_]*$/
          sanitized
        end

        def all_factions
          %w[ger ita jap fin axm ussr usa uk fra chi alm]
        end

        def half_tracks
          # Usually carriers (or base), sometimes fully tracked, some infantry, some more for artillery
          lu = {}
          key = %i[c n y s f r v o]
          [
            ["fra", "Renault UE", 32, 3, 0, 0, 4, { r: 1, ha: { f: 0, s: 0, r: 0, t: -1 }, tr: 2, trg: 1 }],
            ["fra", "Lorraine 37L", 39, 3, 0, 0, 5, { r: 1, ha: { f: 0, s: 0, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["ger", "SdKfz 250/1", 41, 3, 8, 8, 6, { r: 1, ha: { f: 1, s: 0, r: 0, t: -1 }, tr: 2, trg: 1 }],
            ["ger", "SdKfz 250/7", 41, 3, 20, 16, 6, { t: 1, m: 3, e: 1, ha: { f: 1, s: 0, r: 0, t: -1 } }],
            ["ger", "SdKfz 250/8", 41, 3, 16, 16, 6, { t: 1, g: 1, ha: { f: 1, s: 0, r: 0, t: -1 } }],
            ["ger", "SdKfz 250/9", 41, 3, 4, 10, 6, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0, t: -1 } }],
            ["ger", "SdKfz 250/10", 41, 3, 8, 16, 6, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0, t: -1 } }],
            ["ger", "SdKfz 250/11", 41, 3, 8, 10, 6, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0, t: -1 } }],
            ["ger", "SdKfz 251/1", 39, 3, 8, 8, 5, { r: 1, ha: { f: 1, s: 0, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["ger", "SdKfz 251/9", 39, 3, 16, 16, 5, { t: 1, g: 1, ha: { f: 1, s: 0, r: 0, t: -1 } }],
            ["ger", "SdKfz 251/10", 39, 3, 8, 16, 5, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0, t: -1 } }],
            ["ger", "SdKfz 251/16", 39, 3, 24, 1, 5, { i: 1, ha: { f: 1, s: 0, r: 0, t: -1 } }],
            ["jap", "Type 98 So-Da", 41, 3, 0, 0, 5, { r: 1, ha: { f: 1, s: 1, r: 1, t: -1 }, tr: 3, trg: 1 }],
            ["jap", "Type 100 Te-Re", 40, 3, 0, 0, 5, { r: 1, ha: { f: 0, s: 0, r: 0, t: -1 }, tr: 1 }],
            ["jap", "Type 1 Ho-Ha", 44, 3, 4, 8, 6, { r: 1, ha: { f: 0, s: 0, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["uk", "Loyd Carrier", 39, 3, 0, 0, 6, { r: 1, ha: { f: 0, s: 0, r: 0, t: -1 }, tr: 2, trg: 1 }],
            ["uk", "Universal Carrier", 40, 3, 3, 6, 7, { r: 1, ha: { f: 0, s: 0, r: 0, t: -1 }, sn: 1, tr: 2, trg: 1 }],
            ["uk", "U Carrier 2Pdr", 41, 3, 10, 12, 7, { t: 1, p: 1, ha: { f: 0, s: 0, r: 0, t: -1 } }],
            ["uk", "U Carrier 6Pdr", 41, 3, 20, 16, 7, { t: 1, p: 1, ha: { f: 0, s: 0, r: 0, t: -1 } }],
            ["uk", "U Carrier Wasp", 41, 3, 24, 1, 7, { i: 1, ha: { f: 0, s: 0, r: 0, t: -1 } }],
            ["usa", "M2 Half-track", 41, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["usa", "M3 Half-track", 41, 3, 6, 8, 6, { r: 1, ha: { f: 1, s: 1, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["usa", "M3A1 Half-track", 42, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["uk", "M5 Half-track", 42, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["ussr", "M5 Half-track", 42, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["chi", "M5 Half-track", 42, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["ussr", "M9 Half-track", 41, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["fra", "M9 Half-track", 41, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["usa", "M2 Half-track", 41, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["usa", "LVT-1", 42, 4, 10, 12, 5, { r: 1, amp: 1, tr: 3, bd: 3 }],
            ["usa", "LVT-2", 42, 4, 7, 10, 5, { t: 1, p: 1, amp: 1, tr: 3, bd: 3 }],
            ["usa", "LVT(A)-1", 44, 4, 7, 10, 5, { u: 1, t: 1, g: 1, ha: { f: 3, s: 0, r: 0 }, ta: { f: 4, s: 3, r: 3 }, amp: 1, tr: 3, bd: 3 }],
            ["usa", "LVT(A)-4", 44, 4, 24, 20, 5, { u: 1, t: 1, g: 1, ha: { f: 3, s: 0, r: 0 }, ta: { f: 3, s: 2, r: 2, t: -1 }, amp: 1, tr: 3, bd: 3 }],
            ["usa", "LVT-1 Armor", 43, 4, 10, 12, 5, { r: 1, ha: { f: 1, s: 0, r: 0, t: -1 }, amp: 1, tr: 3, bd: 3 }],
            ["usa", "LVT-2 Armor", 43, 4, 7, 10, 5, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0, t: -1 }, amp: 1, tr: 3, bd: 3 }],
            ["usa", "M3 GMC", 42, 3, 24, 20, 6, { t: 1, g: 1, ha: { f: 1, s: 1, r: 0, t: -1 } }],
            ["usa", "T19 GMC", 42, 3, 40, 24, 6, { t: 1, g: 1, ha: { f: 1, s: 1, r: 0, t: -1 } }],
            ["uk", "T48 GMC", 42, 3, 20, 16, 6, { t: 1, p: 1, ha: { f: 1, s: 1, r: 0, t: -1 } }],
            ["ussr", "T48 GMC", 42, 3, 20, 16, 6, { t: 1, p: 1, ha: { f: 1, s: 1, r: 0, t: -1 } }],
            ["usa", "T19/M21 MMC", 42, 3, 20, 20, 6, { t: 1, m: 3, e: 1, ha: { f: 1, s: 1, r: 0, t: -1 } }],
          ].each do |unit|
            ht = { t: "ht", i: "ht" }
            unit.each_with_index do |v, i|
              ht[key[i]] = v
            end
            ht[:i] = "htgun" if ht[:o][:g]
            ht[:i] = "htat" if ht[:o][:p]
            ht[:i] = "htmtr" if ht[:o][:m]
            ht[:i] = "htft" if ht[:o][:i]
            ht[:i] += "-amp" if ht[:o][:amp]
            ht[:o].merge!({ k: 1 })
            ht[:o][:m] || ht[:o][:i] ? ht[:o].merge!({ b: 3 }) : ht[:o].merge!({ j: 3, f: 18 })
            lu[:"#{ht[:c]}_#{sanitize(ht[:n])}"] = ht
          end
          lu
        end

        def trucks
          lu = {}
          key = %i[c n i y s f r v o]
          [
            ["alm", "Horse", "cav", 0, 3, 0, 0, 7, { tr: 3 }],
            ["alm", "Sokol 1000", "cav-wheel", 33, 3, 0, 0, 6, { tr: 3 }],
            ["alm", "Polski Fiat 621", "truck", 35, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["axm", "Horse", "cav", 0, 3, 0, 0, 7, { tr: 3 }],
            ["chi", "Horse", "cav", 0, 3, 0, 0, 7, { tr: 3 }],
            ["fra", "Horse", "cav", 0, 3, 0, 0, 7, { tr: 3 }],
            ["fra", "Laffly S20", "truck", 37, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["fra", "Citroen U23", "truck", 35, 4, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ger", "Horse", "cav", 0, 3, 0, 0, 7, { tr: 3 }],
            ["ger", "BMW R75", "cav-wheel", 41, 3, 0, 0, 6, { tr: 3 }],
            ["ger", "Zündapp KS 750", "cav-wheel", 41, 3, 0, 0, 6, { sn: 1, tr: 3 }],
            ["ger", "BMW R17", "cav-wheel", 35, 3, 0, 0, 6, { tr: 3 }],
            ["ger", "Kettenkrad", "truck", 41, 2, 0, 0, 5, { tr: 1, trg: 1, k: 1 }],
            ["ger", "Maultier", "truck", 41, 3, 0, 0, 5, { tr: 3, trg: 1, k: 1 }],
            ["ger", "SdKfz 6", "truck", 39, 4, 0, 0, 5, { tr: 3, trg: 1, k: 1 }],
            ["ger", "SdKfz 7", "truck", 38, 3, 0, 0, 5, { tr: 2, trg: 1, k: 1 }],
            ["ger", "SdKfz 8", "truck", 37, 5, 0, 0, 5, { tr: 3, trg: 1, k: 1 }],
            ["ger", "SdKfz 9", "truck", 39, 5, 0, 0, 5, { tr: 3, trg: 1, k: 1 }],
            ["ger", "SdKfz 10", "truck", 38, 4, 0, 0, 5, { tr: 2, trg: 1, k: 1 }],
            ["ger", "SdKfz 11", "truck", 38, 4, 0, 0, 5, { tr: 2, trg: 1, k: 1 }],
            ["ger", "L3000", "truck", 38, 4, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ger", "Opel Blitz", "truck", 30, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ger", "BMW 325", "car", 36, 2, 0, 0, 5, { tr: 2, trg: 1 }],
            ["ger", "VW Kübelwagen", "car", 40, 2, 0, 0, 5, { sn: 1, tr: 1 }],
            ["ger", "m. E. Pkw", "car", 37, 2, 0, 0, 5, { tr: 2, trg: 1 }],
            ["ger", "s. E. Pkw", "truck", 38, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ger", "le. gl. Lkw", "truck", 37, 4, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ger", "L3000", "truck", 38, 4, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ita", "Alfa Romeo 430", "truck", 42, 4, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ita", "Alfa Romeo 500", "truck", 37, 4, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ita", "Alfa Romeo 800", "truck", 40, 5, 0, 0, 5, { tr: 3, trg: 1 }],
            ["jap", "Horse", "cav", 0, 3, 0, 0, 7, { tr: 3 }],
            ["jap", "Bicycle", "cav-wheel", 30, 3, 0, 0, 4, { w: 1, tr: 3 }],
            ["uk", "Horse", "cav", 0, 3, 0, 0, 7, { tr: 3 }],
            ["uk", "Bedford MW", "truck", 39, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["uk", "Bedford OY", "truck", 39, 4, 0, 0, 5, { tr: 3, trg: 1 }],
            ["uk", "Bedford QL", "truck", 41, 4, 0, 0, 5, { tr: 3, trg: 1 }],
            ["uk", "Ford F15", "truck", 39, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["uk", "Dodge D60", "truck", 39, 4, 0, 0, 5, { tr: 3, trg: 1 }],
            ["uk", "Chevy C30", "truck", 39, 4, 0, 0, 5, { tr: 3, trg: 1 }],
            ["uk", "Chevy C30 MG", "truck", 39, 4, 7, 10, 5, { uu: 1, r: 1, j: 3, f: 16, tr: 3, trg: 1 }],
            ["uk", "Chevy C30 AT", "truck", 39, 4, 7, 10, 5, { bw: 1, t: 1, p: 1, j: 3, f: 16, tr: 3, trg: 1 }],
            ["uk", "AEC Mk I Deacon", "truck", 42, 4, 20, 16, 5, { t: 1, p: 1, j: 3, f: 16, sn: 1 }],
            ["uk", "Dodge WC", "truck", 41, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["usa", "H-D WLA", "cav-wheel", 40, 3, 0, 0, 6, { tr: 3 }],
            ["usa", "Dodge VC", "truck", 40, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["usa", "Dodge WC", "truck", 41, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ussr", "Dodge WC", "truck", 42, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["fra", "Dodge WC", "truck", 41, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["uk", "Dodge WC", "truck", 41, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["usa", "GMC CCKW", "truck", 41, 4, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ussr", "Studebaker US6", "truck", 41, 4, 0, 0, 5, { sn: 1, tr: 3, trg: 1 }],
            ["usa", "Jeep", "car", 41, 2, 0, 0, 5, { tr: 1, trg: 1 }],
            ["uk", "Jeep", "car", 41, 2, 0, 0, 5, { tr: 1, trg: 1 }], # TODO: arm as needed, especially SAS
            ["ussr", "Jeep", "car", 41, 2, 0, 0, 5, { tr: 1, trg: 1 }],
            ["fra", "Jeep", "car", 41, 2, 0, 0, 5, { tr: 1, trg: 1 }],
            ["ussr", "Jeep", "car", 41, 2, 0, 0, 5, { tr: 1, trg: 1 }],
            ["usa", "Jeep .50 MG", "car", 41, 2, 10, 15, 5, { r: 1, j: 3, f: 16, trg: 1 }],
            ["uk", "Jeep MG", "car", 41, 2, 7, 10, 5, { r: 1, j: 3, f: 16, trg: 1 }],
            ["usa", "M6 GMC", "truck", 42, 3, 7, 10, 5, { t: 1, j: 3, f: 18, p: 1, bw: 1 }],
            ["usa", "GMC DUKW", "truck-amp", 42, 4, 0, 0, 5, { amp: 1, tr: 3 }],
            ["uk", "GMC DUKW", "truck-amp", 42, 4, 0, 0, 5, { amp: 1, tr: 3 }],
            ["ussr", "Horse", "cav", 0, 3, 0, 0, 7, { tr: 3 }],
            ["ussr", "PMZ-A-750", "cav-wheel", 34, 3, 0, 0, 5, { tr: 3 }],
            ["ussr", "Dnepr M-72", "cav-wheel", 42, 3, 0, 0, 6, { tr: 3 }],
            ["ussr", "GAZ-67", "car", 43, 2, 0, 0, 5, { tr: 1, trg: 1 }],
            ["ussr", "GAZ-AA", "truck", 32, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ussr", "GAZ-AAA", "truck", 36, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ussr", "GAZ-MM", "truck", 36, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ussr", "ZIS-5", "truck", 34, 3, 0, 0, 5, { tr: 3, trg: 1 }],
          ].each do |unit|
            truck = { t: "truck" }
            unit.each_with_index do |v, i|
              truck[key[i]] = v
            end
            truck[:o].merge!({ w: 1 }) if truck[:n] != "Horse" && !truck[:o][:k]
            truck[:t] = "cav" if %w[cav cav-wheel].include?(truck[:i])
            lu[:"#{truck[:c]}_#{sanitize(truck[:n])}"] = truck
          end
          lu
        end

        def other
          lu = {}
          key = %i[c n i y s f r v o]
          [
            ["ita", "Supply Dump", "supply", 0, 8, 0, 0, 0, {}],
          ].each do |unit|
            other = { t: "other" }
            unit.each_with_index do |v, i|
              other[key[i]] = v
            end
            lu[:"#{other[:c]}_#{sanitize(other[:n])}"] = other
          end
          lu
        end

        # rubocop:enable Metrics/PerceivedComplexity
        # rubocop:enable Metrics/MethodLength, Metrics/AbcSize, Metrics/CyclomaticComplexity
        # rubocop:enable Layout/LineLength
      end
    end
  end
end
