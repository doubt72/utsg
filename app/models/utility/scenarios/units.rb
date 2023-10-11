# frozen_string_literal: true

module Utility
  module Scenarios
    module Units
      class << self # rubocop:disable Metric/ClassLength
        # rubocop:disable Metric/MethodLength, Metric/AbcSize, Metric/CyclomaticComplexity
        # -rubocop:disable Metric/PerceivedComplexity
        def lookup_data
          leaders.merge(infantry).merge(machine_guns).merge(mortars).merge(radios)
                 .merge(support_weapons)
                 .merge(soviet_guns).merge(soviet_tanks).merge(soviet_vehicles)
                 .merge(german_guns).merge(german_tanks).merge(german_vehicles)
        end

        def unit_definition(code)
          lookup = lookup_data
          if code.is_a? Array
            lookup[code[1]]&.merge(x: code[0]) || { not_found: true, code: }
          else
            lookup[code] || { not_found: true, code: }
          end
        end

        def sanitize(name)
          # TODO: remove when done debugging
          puts "--- #{name.gsub(%r{[-\s/]}, '_').downcase}"
          name.gsub(%r{[-\s/]}, "_").downcase
        end

        # c: nation, t: type, n: name, i: icon, y: year
        #               sqd, tm, ldr, sw
        # m: morale (2-6), s: size (l: 1, 3, 6), f: firepower, r: range, v: movement,
        #                                                        bv: broken movement (if not 6)
        # o: flags
        #    l: leadership, g: gun adj, a: assault, r: rapid fire, s: smoke, x: expend
        #    i: ignore terrain, b: weapon break number, j: weapon jam number, d: drive break
        #    t: target fire, m: minimum range, p: anti-tank, o: off-board artillery, u: turret
        #    k: tracked, w: wheeled, c: crewed gun/mortar, z: rotating mount
        #    ha: hull armor
        #    ta: turret armor
        #        f: front, s: side, r: rear
        # x: count

        def leaders
          # Currently 6-2, 5-2, 6-1, 5-1, 4-1, 3-1
          i = "leader"
          y = 30
          s = f = r = 1
          lu = {}
          %w[ger usa ussr].each do |nation|
            [6, 5, 4, 3].each do |m|
              [2, 1].each do |l|
                next if l == 2 && m < 5
                next if l + m != 8 && l + m != 4 # TODO: remove when done rejiggering CSS

                lu["#{nation}_leader_#{m}_#{l}".to_sym] = {
                  c: nation, t: "ldr", n: "Leader", i:, y:, m:, s:, f:, r:, v: 6, o: { l: },
                }
              end
            end
          end
          lu
        end

        def infantry
          lu = {}
          key = %i[c n y m f r v o]
          [
            ["ger", "Pionier", 0, 4, 9, 2, 5, { a: 1, s: 1 }],
            # TODO: replace all units when done rejiggering CSS
            # ["ger", "SS", 34, 4, 8, 5, 5, { a: 1, s: 1 }],
            # ["ger", "Fallschirmjäger", 35, 4, 7, 4, 5, { a: 1, s: 1 }],
            # ["ger", "Sturm", 0, 4, 8, 4, 5, { a: 1, s: 1 }],
            ["ger", "Rifle", 0, 3, 7, 5, 4, { a: nil, s: 1 }],
            ["ger", "Volksgrenadier", 44, 3, 7, 4, 4, { a: nil, s: nil }],
            # ["ger", "Conscript", 0, 2, 6, 3, 3, { a: nil, s: nil }],
            # ["usa", "Engineer", 0, 4, 9, 3, 5, { a: 1, s: 1 }],
            # ["usa", "Paratroop", 43, 4, 8, 4, 5, { a: 1, s: 1 }],
            ["usa", "Ranger", 42, 4, 8, 4, 5, { a: 1, s: 1 }],
            ["usa", "Veteran", 0, 4, 7, 6, 4, { a: nil, s: 1 }],
            # ["usa", "Rifle", 0, 3, 7, 6, 4, { a: nil, s: 1 }],
            # ["usa", "Garrison", 0, 2, 6, 4, 3, { a: nil, s: nil }],
            ["usa", "Green", 0, 2, 6, 4, 3, { a: nil, s: nil }],
            ["ussr", "Assault", 41, 4, 9, 2, 5, { a: 1, s: 1 }],
            # ["ussr", "Guards Rifle", 41, 4, 7, 5, 5, { a: nil, s: nil }],
            ["ussr", "Guards SMG", 41, 4, 8, 3, 5, { a: 1, s: nil }],
            ["ussr", "Rifle", 0, 3, 7, 3, 4, { a: nil, s: nil }],
            # ["ussr", "SMG", 0, 3, 7, 2, 4, { a: 1, s: nil }],
            # ["ussr", "Militia", 0, 2, 6, 2, 3, { a: nil, s: nil }],
          ].each do |unit|
            squad = { t: "sqd", i: "squad", s: 6 }
            team = { t: "tm", i: "team", s: 3 }
            unit.each_with_index do |v, i|
              squad[key[i]] = v
              team[key[i]] = v
            end
            squad[:o].delete(:a) if squad[:o][:a].nil?
            squad[:o].delete(:s) if squad[:o][:s].nil?
            squad.delete(:o) if squad[:o][:a].nil? && squad[:o][:s].nil?

            team.delete(:o)
            team[:f] = team[:f] / 2

            name = "#{team[:c]}_#{sanitize(team[:n])}"
            lu["#{name}_s".to_sym] = squad
            lu["#{name}_t".to_sym] = team
          end
          %w[ger usa ussr].each do |c|
            t = "tm"
            lu["#{c}_elite_crew_t"] = {
              c:, t:, n: "Crew", i: "crew", y: 30, m: 4, s: 3, f: 1, r: 1, v: 5, o: { g: 2 },
            }
            lu["#{c}_crew_t"] = {
              c:, t:, n: "Crew", i: "crew", y: 30, m: 3, s: 3, f: 1, r: 1, v: 4, o: { g: 1 },
            }
          end
          lu
        end

        def machine_guns
          lu = {}
          key = %i[c n y f r v o]
          [
            ["ger", "MG 34 LMG", 36, 5, 8, 0, { a: 1, r: 1, j: 3 }],
            # ["ger", "MG 44 LMG", 42, 8, 8, 0, { a: 1, r: 1, j: 3 }],
            ["ger", "MG 08/15 HMG", 17, 10, 12, -1, { r: 1, j: 3 }],
            ["ussr", "DP-27 LMG", 28, 4, 6, 0, { a: 1, r: 1, j: 3 }],
            # ["ussr", "SG-43 MMG", 43, 5, 10, -2, { r: 1, j: 3 }],
            # ["ussr", "PM M1910 HMG", 10, 8, 10, -2, { r: 1, j: 3 }],
            ["ussr", "DShK HMG", 38, 14, 15, -2, { r: 1, j: 3 }],
          ].each do |unit|
            mg = { t: "sw", i: "mg" }
            unit.each_with_index do |v, i|
              mg[key[i]] = v
            end
            lu["#{mg[:c]}_#{sanitize(mg[:n])}".to_sym] = mg
          end
          lu
        end

        def mortars
          lu = {}
          key = %i[c n y f r v o]
          [
            ["ger", "5cm leGrW 36 MTR", 36, 8, 11, 0, { m: 2 }],
            # ["ger", "8cm GrW 34 MTR", 37, 20, 17, -2, { s: 1, m: 3 }],
            ["ger", "kz 8cm GrW 42 MTR", 41, 20, 16, -1, { s: 1, m: 3 }],
            ["ger", "12cm GrW 42 MTR", 43, 40, 32, 1, { s: 1, m: 4, c: 1 }],
            ["ussr", "RM-38 MTR", 38, 8, 14, 0, { m: 2 }],
            # ["ussr", "82-BM-37 MTR", 37, 20, 24, -2, { s: 1, m: 3 }],
            ["ussr", "82-PM-41 MTR", 41, 20, 24, -2, { s: 1, m: 3 }],
            ["ussr", "120-PM-38 MTR", 39, 40, 32, 1, { s: 1, m: 4, c: 1 }],
          ].each do |unit|
            mortar = { t: "sw", i: "mortar" }
            unit.each_with_index do |v, i|
              mortar[key[i]] = v
            end
            mortar[:o].merge!({ t: 1, b: 3 })
            lu["#{mortar[:c]}_#{sanitize(mortar[:n])}".to_sym] = mortar
          end
          lu
        end

        def radios
          lu = {}
          key = %i[c n y f]
          [
            ["ger", "Radio 7.5cm", 31, 16],
            # ["ussr", "Radio 76mm", 41, 16],
            # ["ussr", "Radio 85mm", 41, 20],
            # ["ussr", "Radio 122mm", 41, 40],
            ["ussr", "Radio 152mm", 41, 64],
          ].each do |unit|
            radio = { t: "sw", i: "radio" }
            unit.each_with_index do |v, i|
              radio[key[i]] = v
            end
            radio.merge!({ r: 0, v: 0, o: { s: 1, o: 1 } })
            lu["#{radio[:c]}_#{sanitize(radio[:n])}".to_sym] = radio
          end
          lu
        end

        def support_weapons
          lu = {}
          key = %i[c n y f r v o]
          [
            ["ger", "Panzerfaust", 43, 6, 1, 0, { x: 1 }],
            ["ger", "Panzerschreck", 43, 10, 4, 0, { b: 4 }],
            ["ussr", "Ampulomet", 41, 6, 6, -1, { b: 5 }],
          ].each do |unit|
            rocket = { t: "sw", i: "rocket" }
            unit.each_with_index do |v, i|
              rocket[key[i]] = v
            end
            rocket[:o].merge!({ t: 1, p: 1 })
            lu["#{rocket[:c]}_#{sanitize(rocket[:n])}".to_sym] = rocket
          end
          [
            # TODO: currently no light AT
          ].each do |unit|
            at = { t: "sw", i: "antitank" }
            unit.each_with_index do |v, i|
              at[key[i]] = v
            end
            at[:o].merge!({ t: 1, b: 3 })
            lu["#{at[:c]}_#{sanitize(at[:n])}".to_sym] = at
          end
          t = "sw"
          %w[ger usa ussr].each do |c|
            i = "flamethrower"
            n = i.capitalize
            lu["#{c}_ft"] = { c:, t:, n:, i:, f: 24, r: 1, v: 0, o: { a: 1, i: 1, b: 3 } }
            n = "Satchel Charge"
            i = "explosive"
            lu["#{c}_sc"] = { c:, t:, n:, i:, f: 24, r: 1, v: 0, o: { a: 1, x: 1, t: 1 } }
          end
          %w[ussr].each do |c|
            n = "Molotov Coctail"
            i = "explosive"
            lu["#{c}_mc"] = { c:, t:, n:, i:, f: 4, r: 1, v: 0, o: { a: 1, i: 1, x: 1, t: 1 } }
          end
          lu
        end

        def soviet_guns
          c = "ussr"
          t = "gun"
          {
            ussr_76_inf: {
              c:, t:, n: "76mm Mountain", i: "gun", s: 3, f: 12, r: 16, v: -4,
              o: { t: 1, s: 1, j: 2, c: 1 },
            },
            ussr_45_at: {
              c:, t:, n: "45mm 53-K", i: "atgun", s: 2, f: 6, r: 16, v: -3, o: { t: 1, p: 1, j: 2 },
            },
            ussr_45l_at: {
              c:, t:, n: "45mm M-42", i: "atgun", s: 2, f: 8, r: 20, v: -3, o: { t: 1, p: 1, j: 2 },
            },
            ussr_57_at: {
              c:, t:, n: "57mm ZiS-2", i: "atgun", s: 3, f: 12, r: 20, v: -4,
              o: { t: 1, p: 1, j: 2 },
            },
            ussr_76_at: {
              c:, t:, n: "76mm F-22", i: "atgun", s: 3, f: 16, r: 24, v: -4,
              o: { t: 1, p: 1, j: 2 },
            },
            ussr_100_at: {
              c:, t:, n: "100mm BS-3", i: "atgun", s: 4, f: 32, r: 30, v: -4,
              o: { t: 1, p: 1, j: 2 },
            },
          }
        end

        def soviet_tanks
          c = "ussr"
          t = "veh"
          i = "tank"
          {
            ussr_bt7: {
              c:, t:, n: "BT-7", i:, s: 3, f: 6, r: 12, v: 8,
              o: {
                t: 1, p: 1, j: 2, u: 1, k: 1,
                ha: { f: 1, s: 1, r: 1 },
                ta: { f: 1, s: 1, r: 1 },
              },
            },
            ussr_t26: {
              c:, t:, n: "T-26 M38", i:, s: 3, f: 6, r: 12, v: 7,
              o: {
                t: 1, p: 1, j: 2, u: 1, k: 1,
                ha: { f: 1, s: 1, r: 1 },
                ta: { f: 1, s: 1, r: 1 },
              },
            },
            ussr_t70: {
              c:, t:, n: "T-70", i:, s: 3, f: 6, r: 12, v: 7,
              o: {
                t: 1, p: 1, j: 2, u: 1, k: 1,
                ha: { f: 3, s: 3, r: 2 },
                ta: { f: 3, s: 2, r: 2 },
              },
            },
            ussr_t34_40: {
              c:, t:, n: "T-34 M40", i:, s: 4, f: 12, r: 16, v: 6,
              o: {
                t: 1, p: 1, j: 2, u: 1, k: 1,
                ha: { f: 3, s: 2, r: 2 },
                ta: { f: 3, s: 2, r: 2 },
              },
            },
            ussr_t34_41: {
              c:, t:, n: "T-34 M41", i:, s: 4, f: 16, r: 20, v: 6,
              o: {
                t: 1, p: 1, j: 2, u: 1, k: 1,
                ha: { f: 3, s: 3, r: 3 },
                ta: { f: 3, s: 3, r: 2 },
              },
            },
            ussr_t34_85: {
              c:, t:, n: "T-34-85", i:, s: 4, f: 24, r: 24, v: 6,
              o: {
                t: 1, p: 1, j: 2, u: 1, k: 1,
                ha: { f: 3, s: 3, r: 3 },
                ta: { f: 4, s: 3, r: 2 },
              },
            },
            ussr_kv1: {
              c:, t:, n: "KV-1", i:, s: 5, f: 16, r: 20, v: 4,
              o: {
                t: 1, p: 1, d: 2, j: 2, u: 1, k: 1,
                ha: { f: 4, s: 4, r: 3 },
                ta: { f: 4, s: 4, r: 3 },
              },
            },
            ussr_kv2: {
              c:, t:, n: "KV-2", i:, s: 5, f: 48, r: 24, v: 4,
              o: {
                t: 1, d: 2, j: 2, u: 1, k: 1, c: 1,
                ha: { f: 4, s: 4, r: 3 },
                ta: { f: 3, s: 3, r: 3 },
              },
            },
            ussr_kv85: {
              c:, t:, n: "KV-85", i:, s: 5, f: 32, r: 24, v: 5,
              o: {
                t: 1, p: 1, j: 2, u: 1, k: 1,
                ha: { f: 4, s: 4, r: 3 },
                ta: { f: 5, s: 4, r: 4 },
              },
            },
            ussr_is2: {
              c:, t:, n: "IS-2", i:, s: 6, f: 48, r: 28, v: 5,
              o: {
                t: 1, p: 1, j: 3, u: 1, k: 1,
                ha: { f: 5, s: 4, r: 4 },
                ta: { f: 5, s: 4, r: 4 },
              },
            },
          }
        end

        def soviet_vehicles
          c = "ussr"
          t = "veh"
          {
            ussr_su76: {
              c:, t:, n: "SU-76", i: "spg", s: 3, f: 12, r: 16, v: 7,
              o: {
                t: 1, j: 2, k: 1, c: 1,
                ha: { f: 2, s: 1, r: 1 },
              },
            },
            ussr_su85: {
              c:, t:, n: "SU-85", i: "spat", s: 4, f: 24, r: 24, v: 6,
              o: {
                t: 1, p: 1, j: 2, k: 1,
                ha: { f: 3, s: 1, r: 1 },
              },
            },
            ussr_su100: {
              c:, t:, n: "SU-100", i: "spat", s: 4, f: 32, r: 24, v: 6,
              o: {
                t: 1, p: 1, j: 2, k: 1,
                ha: { f: 4, s: 3, r: 3 },
              },
            },
            ussr_su122: {
              c:, t:, n: "SU-122", i: "spg", s: 4, f: 32, r: 28, v: 6,
              o: {
                t: 1, j: 2, k: 1, c: 1,
                ha: { f: 2, s: 1, r: 1 },
              },
            },
            ussr_su152: {
              c:, t:, n: "SU-152", i: "spg", s: 5, f: 48, r: 28, v: 4,
              o: {
                t: 1, j: 2, k: 1, c: 1,
                ha: { f: 4, s: 3, r: 3 },
              },
            },
            ussr_isu122: {
              c:, t:, n: "ISU-122", i: "spat", s: 6, f: 48, r: 28, v: 4,
              o: {
                t: 1, p: 1, j: 2, k: 1,
                ha: { f: 4, s: 4, r: 4 },
              },
            },
            ussr_isu152: {
              c:, t:, n: "ISU-152", i: "spg", s: 6, f: 48, r: 28, v: 4,
              o: {
                t: 1, j: 2, k: 1, c: 1,
                ha: { f: 4, s: 4, r: 4 },
              },
            },
            ussr_ba10: {
              c:, t:, n: "BA-10", i: "car", s: 3, f: 6, r: 12, v: 9,
              o: {
                t: 1, p: 1, j: 2, u: 1, w: 1,
                ha: { f: 1, s: 1, r: 1 },
                ta: { f: 1, s: 1, r: 1 },
              },
            },
            ussr_ba20: {
              c:, t:, n: "BA-20", i: "car", s: 3, f: 6, r: 6, v: 8,
              o: {
                r: 1, j: 2, u: 1, w: 1,
                ha: { f: 0, s: 0, r: 0 },
                ta: { f: 0, s: 0, r: 0 },
              },
            },
            ussr_ba64: {
              c:, t:, n: "BA-64", i: "car", s: 3, f: 6, r: 6, v: 10,
              o: {
                r: 1, j: 2, u: 1, w: 1,
                ha: { f: 1, s: 0, r: 0 },
                ta: { f: 1, s: 1, r: 1 },
              },
            },
          }
        end

        def german_guns
          c = "ger"
          t = "gun"
          {
            ger_ig18_inf: {
              c:, t:, n: "7.5cm IG 18", i: "gun", s: 3, f: 12, r: 16, v: -3,
              o: { t: 1, s: 1, c: 1, j: 2 },
            },
            ger_lefh18_inf: {
              c:, t:, n: "10.5cm IeFH 18", i: "gun", s: 3, f: 16, r: 16, v: -4,
              o: { t: 1, s: 1, c: 1, j: 2 },
            },
            ger_sig33_inf: {
              c:, t:, n: "15cm sIG 33", i: "gun", s: 3, f: 24, r: 16, v: -4,
              o: { t: 1, s: 1, c: 1, j: 2 },
            },
            ger_28_at: {
              c:, t:, n: "2.8cm sPzB 41", i: "atgun", f: 4, r: 16, v: -2, o: { t: 1, p: 1, j: 2 },
            },
            ger_37_at: {
              c:, t:, n: "3.7cm Pak 36", i: "atgun", s: 2, f: 6, r: 16, v: -3,
              o: { t: 1, p: 1, j: 2 },
            },
            ger_50_at: {
              c:, t:, n: "5cm Pak 38", i: "atgun", s: 2, f: 8, r: 20, v: -3,
              o: { t: 1, p: 1, j: 2 },
            },
            ger_75_at: {
              c:, t:, n: "7.5cm Pak 97/38", i: "atgun", s: 3, f: 12, r: 20, v: -4,
              o: { t: 1, p: 1, j: 2 },
            },
            ger_75l_at: {
              c:, t:, n: "7.5cm Pak 40", i: "atgun", s: 3, f: 16, r: 24, v: -4,
              o: { t: 1, p: 1, j: 2 },
            },
            ger_88_at: {
              c:, t:, n: "8.8cm Pak 43", i: "atgun", s: 6, f: 32, r: 24, v: -4,
              o: { t: 1, p: 1, j: 2 },
            },
            ger_88flak_at: {
              c:, t:, n: "8.8cm Flak 37", i: "atgun", s: 6, f: 32, r: 30, v: -4,
              o: { t: 1, p: 1, j: 2, z: 1 },
            },
            ger_128_at: {
              c:, t:, n: "12.8cm Pak 44", i: "atgun", s: 6, f: 48, r: 30, v: -4,
              o: { t: 1, p: 1, j: 2 },
            },
          }
        end

        def german_tanks
          c = "ger"
          t = "veh"
          i = "tank"
          {
            ger_pzi: {
              c:, t:, n: "PzKpfw I", i:, s: 3, f: 10, r: 8, v: 8,
              o: {
                r: 1, j: 2, u: 1, k: 1,
                ha: { f: 1, s: 1, r: 1 },
                ta: { f: 1, s: 1, r: 1 },
              },
            },
            ger_pziia: {
              c:, t:, n: "PzKpfw II-C", i:, s: 3, f: 3, r: 10, v: 6,
              o: {
                t: 1, p: 1, j: 2, u: 1, k: 1,
                ha: { f: 1, s: 1, r: 1 },
                ta: { f: 1, s: 1, r: 1 },
              },
            },
            ger_pziif: {
              c:, t:, n: "PzKpfw II-F", i:, s: 3, f: 3, r: 10, v: 7,
              o: {
                t: 1, p: 1, j: 2, u: 1, k: 1,
                ha: { f: 2, s: 1, r: 1 },
                ta: { f: 2, s: 1, r: 1 },
              },
            },
            ger_pzii_luchs: {
              c:, t:, n: "PzKpfw II Luchs", i:, s: 3, f: 4, r: 12, v: 7,
              o: {
                t: 1, p: 1, j: 2, u: 1, k: 1,
                ha: { f: 2, s: 1, r: 1 },
                ta: { f: 2, s: 1, r: 1 },
              },
            },
            ger_pz35: {
              c:, t:, n: "PzKpfw 35(t)", i:, s: 3, f: 6, r: 12, v: 5,
              o: {
                t: 1, p: 1, j: 2, u: 1, k: 1,
                ha: { f: 2, s: 1, r: 1 },
                ta: { f: 2, s: 1, r: 1 },
              },
            },
            ger_pz38: {
              c:, t:, n: "PzKpfw 38(t)", i:, s: 3, f: 6, r: 14, v: 5,
              o: {
                t: 1, p: 1, j: 2, u: 1, k: 1,
                ha: { f: 2, s: 1, r: 1 },
                ta: { f: 2, s: 1, r: 1 },
              },
            },
            ger_pziiid: {
              c:, t:, n: "PzKpfw III-E", i:, s: 4, f: 6, r: 14, v: 6,
              o: {
                t: 1, p: 1, j: 2, u: 1, k: 1,
                ha: { f: 2, s: 2, r: 2 },
                ta: { f: 2, s: 2, r: 2 },
              },
            },
            ger_pziiif: {
              c:, t:, n: "PzKpfw III-F '41", i:, s: 4, f: 8, r: 16, v: 6,
              o: {
                t: 1, p: 1, j: 2, u: 1, k: 1,
                ha: { f: 2, s: 2, r: 2 },
                ta: { f: 2, s: 2, r: 2 },
              },
            },
            ger_pziiij: {
              c:, t:, n: "PzKpfw III-J", i:, s: 4, f: 8, r: 16, v: 6,
              o: {
                t: 1, p: 1, j: 2, u: 1, k: 1,
                ha: { f: 3, s: 2, r: 2 },
                ta: { f: 3, s: 2, r: 2 },
              },
            },
            ger_iiin: {
              c:, t:, n: "PzKpfw III-N", i:, s: 4, f: 12, r: 16, v: 6,
              o: {
                t: 1, p: 1, j: 2, u: 1, k: 1,
                ha: { f: 3, s: 2, r: 2 },
                ta: { f: 3, s: 3, r: 3 },
              },
            },
            ger_ivd: {
              c:, t:, n: "PzKpfw IV-D", i:, s: 4, f: 12, r: 16, v: 5,
              o: {
                t: 1, p: 1, j: 2, u: 1, k: 1,
                ha: { f: 2, s: 2, r: 2 },
                ta: { f: 2, s: 2, r: 2 },
              },
            },
            ger_ivf2: {
              c:, t:, n: "PzKpfw IV-F2", i:, s: 4, f: 16, r: 16, v: 5,
              o: {
                t: 1, p: 1, j: 2, u: 1, k: 1,
                ha: { f: 3, s: 2, r: 2 },
                ta: { f: 3, s: 2, r: 2 },
              },
            },
            ger_ivh: {
              c:, t:, n: "PzKpfw IV-H", i:, s: 4, f: 16, r: 20, v: 5,
              o: {
                t: 1, p: 1, j: 2, u: 1, k: 1,
                ha: { f: 4, s: 2, r: 2 },
                ta: { f: 4, s: 2, r: 2 },
              },
            },
            ger_panther: {
              c:, t:, n: "Panther", i:, s: 5, f: 24, r: 24, v: 6,
              o: {
                t: 1, p: 1, j: 2, d: 2, u: 1, k: 1,
                ha: { f: 4, s: 3, r: 3 },
                ta: { f: 4, s: 3, r: 3 },
              },
            },
            ger_tiger: {
              c:, t:, n: "Tiger", i:, s: 6, f: 32, r: 24, v: 5,
              o: {
                t: 1, p: 1, j: 2, d: 2, u: 1, k: 1,
                ha: { f: 4, s: 3, r: 3 },
                ta: { f: 4, s: 4, r: 4 },
              },
            },
            ger_tigerii: {
              c:, t:, n: "Tiger II", i:, s: 6, f: 32, r: 24, v: 5,
              o: {
                t: 1, p: 1, j: 2, d: 2, u: 1, k: 1,
                ha: { f: 5, s: 4, r: 4 },
                ta: { f: 5, s: 4, r: 4 },
              },
            },
          }
        end

        def german_vehicles
          c = "ger"
          t = "veh"
          {
            ger_stugiiib: {
              c:, t:, n: "StuG III-B", i: "spg", s: 4, f: 12, r: 16, v: 6,
              o: { t: 1, j: 2, k: 1, c: 1, ha: { f: 3, s: 1, r: 1 } },
            },
            ger_stugiiig: {
              c:, t:, n: "StuG III-G", i: "spat", s: 4, f: 16, r: 20, v: 6,
              o: { t: 1, p: 1, j: 2, k: 1, ha: { f: 3, s: 1, r: 1 } },
            },
            ger_stuh42: {
              c:, t:, n: "StuH 42", i: "spg", s: 4, f: 16, r: 16, v: 6,
              o: { t: 1, j: 2, k: 1, c: 1, ha: { f: 3, s: 1, r: 1 } },
            },
            ger_stugiv: {
              c:, t:, n: "StuG IV", i: "spat", s: 4, f: 16, r: 20, v: 5,
              o: { p: 1, t: 1, j: 2, k: 1, ha: { f: 3, s: 1, r: 1 } },
            },
            ger_pji: {
              c:, t:, n: "Panzerjäger I", i: "spat", s: 3, f: 6, r: 12, v: 8,
              o: { p: 1, t: 1, j: 2, k: 1, ha: { f: 1, s: 0, r: 0 } },
            },
            ger_marderiii: {
              c:, t:, n: "Marder III", i: "spat", s: 3, f: 16, r: 20, v: 5,
              o: { p: 1, t: 1, j: 2, k: 1, ha: { f: 3, s: 1, r: 0 } },
            },
            ger_nashorn: {
              c:, t:, n: "Nashorn", i: "spat", s: 4, f: 32, r: 24, v: 6,
              o: { p: 1, t: 1, j: 2, k: 1, ha: { f: 2, s: 1, r: 1 } },
            },
            ger_elefant: {
              c:, t:, n: "Elefant", i: "spat", s: 6, f: 32, r: 24, v: 4,
              o: { p: 1, d: 2, t: 1, j: 2, k: 1, ha: { f: 5, s: 3, r: 3 } },
            },
            ger_hetzer: {
              c:, t:, n: "Hetzer", i: "spat", s: 3, f: 12, r: 16, v: 5,
              o: { p: 1, t: 1, j: 2, k: 1, ha: { f: 3, s: 1, r: 1 } },
            },
            ger_jagdpanzeriv: {
              c:, t:, n: "Jagdpanzer IV", i: "spat", s: 4, f: 16, r: 20, v: 5,
              o: { p: 1, t: 1, j: 2, k: 1, ha: { f: 4, s: 3, r: 3 } },
            },
            ger_jagdpanther: {
              c:, t:, n: "Jagdpanther", i: "spat", s: 5, f: 32, r: 24, v: 5,
              o: { p: 1, t: 1, j: 2, k: 1, ha: { f: 4, s: 3, r: 3 } },
            },
            ger_jagdtiger: {
              c:, t:, n: "Jagdtiger", i: "spat", s: 6, f: 48, r: 28, v: 4,
              o: { p: 1, t: 1, d: 3, j: 2, k: 1, ha: { f: 5, s: 4, r: 4 } },
            },
            ger_sdkfz221: {
              c:, t:, n: "SdKfz 221", i: "car", s: 3, f: 8, r: 8, v: 10,
              o: {
                r: 1, j: 2, u: 1, w: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 },
              },
            },
            ger_sdkfz222b: {
              c:, t:, n: "SdKfz 222-B", i: "car", s: 3, f: 10, r: 10, v: 10,
              o: {
                r: 1, j: 2, u: 1, w: 1, ha: { f: 2, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 },
              },
            },
            ger_sdkfz234_1: {
              c:, t:, n: "SdKfz 234/1", i: "car", s: 3, f: 10, r: 10, v: 12,
              o: {
                r: 1, j: 2, u: 1, w: 1, ha: { f: 2, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 },
              },
            },
            ger_sdkfz234_2: {
              c:, t:, n: "SdKfz 234/2", i: "car", s: 3, f: 8, r: 16, v: 12,
              o: {
                t: 1, p: 1, j: 2, u: 1, w: 1, ha: { f: 2, s: 1, r: 1 }, ta: { f: 2, s: 1, r: 1 },
              },
            },
            ger_sdkfz234_4: {
              c:, t:, n: "SdKfz 234/4", i: "car", s: 3, f: 12, r: 16, v: 12,
              o: {
                t: 1, p: 1, j: 2, u: 1, w: 1, ha: { f: 2, s: 1, r: 1 }, ta: { f: 2, s: 1, r: 1 },
              },
            },
          }
        end
        # rubocop:enable Metric/MethodLength, Metric/AbcSize, Metric/CyclomaticComplexity
        # -rubocop:enable Metric/PerceivedComplexity
      end
    end
  end
end
