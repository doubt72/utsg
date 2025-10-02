# frozen_string_literal: true

module Utility
  class Scenario
    module Units
      class << self
        def lookup_data
          # rubocop: disable Style/ClassVars
          @@lu ||= Markers.markers
                          .merge(Features.features)
                          .merge(Infantry.infantry)
                          .merge(InfantryWeapons.infantry_weapons)
                          .merge(TowedGuns.towed_guns)
                          .merge(ArmoredFightingVehicles.armored_fighting_vehicles)
                          .merge(UtilityVehicles.utility_vehicles)
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
      end
    end
  end
end
