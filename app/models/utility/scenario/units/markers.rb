# frozen_string_literal: true

module Utility
  class Scenario
    module Units
      module Markers # rubocop:disable Metrics/ModuleLength
        class << self
          # rubocop:disable Metrics/MethodLength, Metrics/AbcSize, Metrics/CyclomaticComplexity
          # rubocop:disable Metrics/PerceivedComplexity
          def markers
            initiative.merge(generic_markers).merge(hulls)
          end

          def generic_markers
            {
              turn1: { mk: 1, type: 12, v: "uk", v2: "ger" },
              turn2: { mk: 1, type: 12, v: "uk", v2: "ita" },
              turn3: { mk: 1, type: 12, v: "can", v2: "ger" },
              turn3a: { mk: 1, type: 12, v: "aus", v2: "ger" },
              turn3b: { mk: 1, type: 12, v: "nz", v2: "ger" },
              turn3c: { mk: 1, type: 12, v: "ind", v2: "ger" },
              turn3d: { mk: 1, type: 12, v: "sa", v2: "ger" },
              turn3e: { mk: 1, type: 12, v: "sa", v2: "ita" },
              turn4: { mk: 1, type: 12, v: "uk", v2: "jap" },
              turn4b: { mk: 1, type: 12, v: "aus", v2: "jap" },
              turn5: { mk: 1, type: 12, v: "ussr", v2: "ger" },
              turn6: { mk: 1, type: 12, v: "ussr", v2: "fin" },
              turn7: { mk: 1, type: 12, v: "ussr", v2: "bul" },
              turn8: { mk: 1, type: 12, v: "ussr", v2: "hun" },
              turn9: { mk: 1, type: 12, v: "ussr", v2: "rom" },
              turn10: { mk: 1, type: 12, v: "ussr", v2: "slv" },
              turn10b: { mk: 1, type: 12, v: "ussr", v2: "cro" },
              turn11: { mk: 1, type: 12, v: "ussr", v2: "jap" },
              turn12: { mk: 1, type: 12, v: "usa", v2: "ger" },
              turn13: { mk: 1, type: 12, v: "usa", v2: "ita" },
              turn13b: { mk: 1, type: 12, v: "bra", v2: "ita" },
              turn14: { mk: 1, type: 12, v: "usa", v2: "jap" },
              turn15: { mk: 1, type: 12, v: "pol", v2: "ger" },
              turn15b: { mk: 1, type: 12, v: "pol", v2: "slv" },
              turn16: { mk: 1, type: 12, v: "bel", v2: "ger" },
              turn17: { mk: 1, type: 12, v: "dut", v2: "ger" },
              turn18: { mk: 1, type: 12, v: "fra", v2: "ger" },
              turn18b: { mk: 1, type: 12, v: "frf", v2: "ger" },
              turn18c: { mk: 1, type: 12, v: "frf", v2: "ita" },
              turn19: { mk: 1, type: 12, v: "nor", v2: "ger" },
              turn20: { mk: 1, type: 12, v: "yug", v2: "ger" },
              turn21: { mk: 1, type: 12, v: "gre", v2: "ger" },
              turn22: { mk: 1, type: 12, v: "gre", v2: "ita" },
              turn23: { mk: 1, type: 12, v: "chi", v2: "jap" },
              turn24: { mk: 1, type: 12, v: "dut", v2: "jap" },
              calm: { mk: 1, type: 9, subtype: 0 },
              calm_variable: { mk: 1, type: 9, subtype: 0, v: true },
              breezy: { mk: 1, type: 9, subtype: 1 },
              breezy_variable: { mk: 1, type: 9, subtype: 1, v: true },
              windy: { mk: 1, type: 9, subtype: 2 },
              windy_variable: { mk: 1, type: 9, subtype: 2, v: true },
              still: { mk: 1, type: 9, subtype: 3 },
              still_variable: { mk: 1, type: 9, subtype: 3, v: true },
              sunny: { mk: 1, type: 10, subtype: 0 },
              fog: { mk: 1, type: 10, subtype: 1 },
              rain: { mk: 1, type: 10, subtype: 2 },
              rain_20: { mk: 1, type: 10, subtype: 2, v: 2 },
              rain_40: { mk: 1, type: 10, subtype: 2, v: 4 },
              rain_60: { mk: 1, type: 10, subtype: 2, v: 6 },
              rain_80: { mk: 1, type: 10, subtype: 2, v: 8 },
              snow: { mk: 1, type: 10, subtype: 3 },
              snow_20: { mk: 1, type: 10, subtype: 3, v: 2 },
              snow_40: { mk: 1, type: 10, subtype: 3, v: 4 },
              snow_60: { mk: 1, type: 10, subtype: 3, v: 6 },
              snow_80: { mk: 1, type: 10, subtype: 3, v: 8 },
              sand: { mk: 1, type: 10, subtype: 4 },
              dust: { mk: 1, type: 10, subtype: 5 },
              tired: { mk: 1, type: 2 },
              activated: { mk: 1, type: 4 },
              exhausted: { mk: 1, type: 5 },
              pinned: { mk: 1, type: 3 },
              jammed: { mk: 1, type: 6 },
              broken: { mk: 1, type: 15 },
              sponson_jammed: { mk: 1, type: 16 },
              sponson_broken: { mk: 1, type: 17 },
              routed: { mk: 1, type: 18 },
              turret_jammed: { mk: 1, type: 7 },
              immobilized: { mk: 1, type: 8 },
              elite_crew: { mk: 1, type: 13 },
              green_crew: { mk: 1, type: 14 },
            }
          end

          def initiative
            lu = {}
            Units.all_factions.each do |nation| # rubocop:disable Metrics/BlockLength
              if nation == "alm"
                lu[:pol_initiative] = { mk: 1, nation: "alm", i: "pol", type: 11 }
                lu[:gre_initiative] = { mk: 1, nation: "alm", i: "gre", type: 11 }
                lu[:nor_initiative] = { mk: 1, nation: "alm", i: "nor", type: 11 }
                lu[:bel_initiative] = { mk: 1, nation: "alm", i: "bel", type: 11 }
                lu[:dut_initiative] = { mk: 1, nation: "alm", i: "dut2", type: 11 }
                lu[:yug_initiative] = { mk: 1, nation: "alm", i: "yug", type: 11 }
                next
              end
              if nation == "axm"
                lu[:bul_initiative] = { mk: 1, nation: "axm", i: "bul", type: 11 }
                lu[:hun_initiative] = { mk: 1, nation: "axm", i: "hun", type: 11 }
                lu[:rum_initiative] = { mk: 1, nation: "axm", i: "rom", type: 11 }
                lu[:slv_initiative] = { mk: 1, nation: "axm", i: "slv", type: 11 }
                lu[:cro_initiative] = { mk: 1, nation: "axm", i: "cro", type: 11 }
                next
              end
              lu[:"#{nation}_initiative"] = {
                mk: 1, nation:, i: nation == "ussr" ? "ussr2" : nation, type: 11,
              }
              if nation == "uk"
                lu[:can_initiative] = { mk: 1, nation: "can", i: "can", type: 11 } if nation == "uk"
                lu[:aus_initiative] = { mk: 1, nation: "aus", i: "aus", type: 11 } if nation == "uk"
                lu[:nz_initiative] = { mk: 1, nation: "nz", i: "nz", type: 11 } if nation == "uk"
                lu[:ind_initiative] = { mk: 1, nation: "ind", i: "ind", type: 11 } if nation == "uk"
                lu[:sa_initiative] = { mk: 1, nation: "sa", i: "sa", type: 11 } if nation == "uk"
              end
              lu[:bra_initiative] = { mk: 1, nation: "bra", i: "bra", type: 11 } if nation == "usa"
              lu[:frf_initiative] = { mk: 1, nation: "frf", i: "frf", type: 11 } if nation == "fra"
            end
            lu
          end

          def hulls
            lu = {}
            Units.all_factions.each do |nation|
              lu[:"#{nation}_tracked_hull"] = { mk: 1, nation:, type: 0 }
              lu[:"#{nation}_wheeled_hull"] = { mk: 1, nation:, type: 1 }
            end
            lu
          end
          # rubocop:enable Metrics/MethodLength, Metrics/AbcSize, Metrics/CyclomaticComplexity
          # rubocop:enable Metrics/PerceivedComplexity
        end
      end
    end
  end
end
