# frozen_string_literal: true

module Utility
  class Scenario
    module Units
      module Markers # rubocop:disable Metrics/ModuleLength
        class << self
          # rubocop:disable Metrics/MethodLength, Metrics/AbcSize, Metrics/CyclomaticComplexity
          def markers
            initiative.merge(generic_markers).merge(hulls)
          end

          def generic_markers
            {
              turn1: { mk: 1, type: "turn", v: "uk", v2: "ger" },
              turn2: { mk: 1, type: "turn", v: "uk", v2: "ita" },
              turn3: { mk: 1, type: "turn", v: "can", v2: "ger" },
              turn3a: { mk: 1, type: "turn", v: "aus", v2: "ger" },
              turn3b: { mk: 1, type: "turn", v: "nz", v2: "ger" },
              turn3c: { mk: 1, type: "turn", v: "ind", v2: "ger" },
              turn3d: { mk: 1, type: "turn", v: "sa", v2: "ger" },
              turn3e: { mk: 1, type: "turn", v: "sa", v2: "ita" },
              turn4: { mk: 1, type: "turn", v: "uk", v2: "jap" },
              turn4b: { mk: 1, type: "turn", v: "aus", v2: "jap" },
              turn5: { mk: 1, type: "turn", v: "ussr", v2: "ger" },
              turn6: { mk: 1, type: "turn", v: "ussr", v2: "fin" },
              turn7: { mk: 1, type: "turn", v: "ussr", v2: "bul" },
              turn8: { mk: 1, type: "turn", v: "ussr", v2: "hun" },
              turn9: { mk: 1, type: "turn", v: "ussr", v2: "rom" },
              turn10: { mk: 1, type: "turn", v: "ussr", v2: "slv" },
              turn10b: { mk: 1, type: "turn", v: "ussr", v2: "cro" },
              turn11: { mk: 1, type: "turn", v: "ussr", v2: "jap" },
              turn12: { mk: 1, type: "turn", v: "usa", v2: "ger" },
              turn13: { mk: 1, type: "turn", v: "usa", v2: "ita" },
              turn13b: { mk: 1, type: "turn", v: "bra", v2: "ita" },
              turn14: { mk: 1, type: "turn", v: "usa", v2: "jap" },
              turn15: { mk: 1, type: "turn", v: "pol", v2: "ger" },
              turn15b: { mk: 1, type: "turn", v: "pol", v2: "slv" },
              turn16: { mk: 1, type: "turn", v: "bel", v2: "ger" },
              turn17: { mk: 1, type: "turn", v: "dut", v2: "ger" },
              turn18: { mk: 1, type: "turn", v: "fra", v2: "ger" },
              turn18b: { mk: 1, type: "turn", v: "frf", v2: "ger" },
              turn18c: { mk: 1, type: "turn", v: "frf", v2: "ita" },
              turn19: { mk: 1, type: "turn", v: "nor", v2: "ger" },
              turn20: { mk: 1, type: "turn", v: "yug", v2: "ger" },
              turn21: { mk: 1, type: "turn", v: "gre", v2: "ger" },
              turn22: { mk: 1, type: "turn", v: "gre", v2: "ita" },
              turn23: { mk: 1, type: "turn", v: "chi", v2: "jap" },
              turn24: { mk: 1, type: "turn", v: "dut", v2: "jap" },
              calm: { mk: 1, type: "wind", subtype: 1 },
              calm_variable: { mk: 1, type: "wind", subtype: 1, v: true },
              breezy: { mk: 1, type: "wind", subtype: 2 },
              breezy_variable: { mk: 1, type: "wind", subtype: 2, v: true },
              windy: { mk: 1, type: "wind", subtype: 3 },
              windy_variable: { mk: 1, type: "wind", subtype: 3, v: true },
              still: { mk: 1, type: "wind", subtype: 4 },
              still_variable: { mk: 1, type: "wind", subtype: 4, v: true },
              sunny: { mk: 1, type: "weather", subtype: "dry" },
              fog: { mk: 1, type: "weather", subtype: "fog" },
              rain: { mk: 1, type: "weather", subtype: "rain" },
              rain_20: { mk: 1, type: "weather", subtype: "rain", v: 2 },
              rain_40: { mk: 1, type: "weather", subtype: "rain", v: 4 },
              rain_60: { mk: 1, type: "weather", subtype: "rain", v: 6 },
              rain_80: { mk: 1, type: "weather", subtype: "rain", v: 8 },
              snow: { mk: 1, type: "weather", subtype: "snow" },
              snow_20: { mk: 1, type: "weather", subtype: "snow", v: 2 },
              snow_40: { mk: 1, type: "weather", subtype: "snow", v: 4 },
              snow_60: { mk: 1, type: "weather", subtype: "snow", v: 6 },
              snow_80: { mk: 1, type: "weather", subtype: "snow", v: 8 },
              sand: { mk: 1, type: "weather", subtype: "sand" },
              dust: { mk: 1, type: "weather", subtype: "dust" },
              tired: { mk: 1, type: "tired" },
              activated: { mk: 1, type: "activated" },
              exhausted: { mk: 1, type: "exhausted" },
              pinned: { mk: 1, type: "pinned" },
              jammed: { mk: 1, type: "jammed" },
              broken: { mk: 1, type: "weapon_broken" },
              sponson_jammed: { mk: 1, type: "sponson_jammed" },
              sponson_broken: { mk: 1, type: "sponson_broken" },
              routed: { mk: 1, type: "routed" },
              turret_jammed: { mk: 1, type: "turret_jammed" },
              immobilized: { mk: 1, type: "immobilized" },
              elite_crew: { mk: 1, type: "elite_crew" },
              green_crew: { mk: 1, type: "green_crew" },
            }
          end

          def initiative
            lu = {}
            Units.all_factions.each do |nation| # rubocop:disable Metrics/BlockLength
              if nation == "alm"
                lu[:pol_initiative] = { mk: 1, nation: "alm", i: "pol", type: "initiative" }
                lu[:gre_initiative] = { mk: 1, nation: "alm", i: "gre", type: "initiative" }
                lu[:nor_initiative] = { mk: 1, nation: "alm", i: "nor", type: "initiative" }
                lu[:bel_initiative] = { mk: 1, nation: "alm", i: "bel", type: "initiative" }
                lu[:dut_initiative] = { mk: 1, nation: "alm", i: "dut2", type: "initiative" }
                lu[:yug_initiative] = { mk: 1, nation: "alm", i: "yug", type: "initiative" }
                next
              end
              if nation == "axm"
                lu[:bul_initiative] = { mk: 1, nation: "axm", i: "bul", type: "initiative" }
                lu[:hun_initiative] = { mk: 1, nation: "axm", i: "hun", type: "initiative" }
                lu[:rum_initiative] = { mk: 1, nation: "axm", i: "rom", type: "initiative" }
                lu[:slv_initiative] = { mk: 1, nation: "axm", i: "slv", type: "initiative" }
                lu[:cro_initiative] = { mk: 1, nation: "axm", i: "cro", type: "initiative" }
                next
              end
              lu[:"#{nation}_initiative"] = {
                mk: 1, nation:, i: nation == "ussr" ? "ussr2" : nation, type: "initiative",
              }
              if nation == "uk"
                lu[:can_initiative] = { mk: 1, nation: "can", i: "can", type: "initiative" }
                lu[:aus_initiative] = { mk: 1, nation: "aus", i: "aus", type: "initiative" }
                lu[:nz_initiative] = { mk: 1, nation: "nz", i: "nz", type: "initiative" }
                lu[:ind_initiative] = { mk: 1, nation: "ind", i: "ind", type: "initiative" }
                lu[:sa_initiative] = { mk: 1, nation: "sa", i: "sa", type: "initiative" }
              end
              if nation == "usa"
                lu[:bra_initiative] = { mk: 1, nation: "bra", i: "bra", type: "initiative" }
              end
              if nation == "fra"
                lu[:frf_initiative] = { mk: 1, nation: "frf", i: "frf", type: "initiative" }
              end
            end
            lu
          end

          def hulls
            lu = {}
            Units.all_factions.each do |nation|
              lu[:"#{nation}_tracked_hull"] = { mk: 1, nation:, type: "tracked_hull" }
              lu[:"#{nation}_wheeled_hull"] = { mk: 1, nation:, type: "wheeled_hull" }
            end
            lu
          end
          # rubocop:enable Metrics/MethodLength, Metrics/AbcSize, Metrics/CyclomaticComplexity
        end
      end
    end
  end
end
