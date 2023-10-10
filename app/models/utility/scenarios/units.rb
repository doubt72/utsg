# frozen_string_literal: true

module Utility
  module Scenarios
    module Units
      class << self # rubocop:disable Metric/ClassLength
        # rubocop:disable Metric/MethodLength
        def lookup_data # rubocop:disable Metric/AbcSize
          leaders.merge(soviet_squads).merge(soviet_teams).merge(soviet_support)
                 .merge(soviet_guns).merge(soviet_tanks).merge(soviet_vehicles)
                 .merge(german_squads).merge(german_teams).merge(german_support)
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

        # c: nation, t: type, n: name, i: icon
        #               sqd, tm, ldr, sw
        # m: morale (2-6), s: size (l: 1, 3, 6), f: firepower, r: range, v: movement,
        #                                                        bv: broken movement (if not 6)
        # o: flags
        #    l: leadership, g: gun adj, a: assault, r: rapid fire, s: smoke, x: expend
        #    i: ignore terrain, b: weapon break number, j: weapon jam number, d: drive break
        #    t: target fire, m: minimum range, p: anti-tank, o: off-board artillery, u: turret
        #    k: tracked, w: wheeled, c: dual purpose gun, z: rotating mount
        #    ha: hull armor
        #    ta: turret armor
        #        f: front, s: side, r: rear
        # x: count

        def gen_leaders(nation)
          # Currently 6-2, 5-2, 6-1, 5-1, 4-1, 3-1
          i = "leader"
          lu = {}
          [5, 6].each do |x|
            lu["#{nation}_leader_#{x}_2".to_sym] = {
              c: nation, t: "ldr", n: "Leader", i:, m: x, s: 1, f: 1, r: 1, v: 6, o: { l: 2 },
            }
          end
          [3, 4, 5, 6].each do |x|
            lu["#{nation}_leader_#{x}_1".to_sym] = {
              c: nation, t: "ldr", n: "Leader", i:, m: x, s: 1, f: 1, r: 1, v: 6, o: { l: 1 },
            }
          end
          lu
        end

        def flamethrower(nation)
          {
            c: nation, t: "sw", n: "Flamethrower", i: "flamethrower", f: 24, r: 1, v: 0,
            o: { a: 1, i: 1, b: 3 },
          }
        end

        def satchel_charge(nation)
          {
            c: nation, t: "sw", n: "Satchel Charge", i: "explosive", f: 32, r: 1, v: 0,
            o: { a: 1, x: 1, t: 1 },
          }
        end

        def leaders
          gen_leaders("ussr").merge(gen_leaders("ger"))
        end

        def soviet_squads
          c = "ussr"
          t = "sqd"
          i = "squad"
          {
            ussr_assault_s: {
              c:, t:, n: "Assault", i:, m: 4, s: 6, f: 7, r: 2, v: 5, o: { a: 1, s: 1 },
            },
            ussr_guards_rifle_s: { c:, t:, n: "Guards Rifle", i:, m: 3, s: 6, f: 5, r: 5, v: 5 },
            ussr_guards_smg_s: {
              c:, t:, n: "Guards SMG", i:, m: 3, s: 6, f: 6, r: 3, v: 5, o: { a: 1 },
            },
            ussr_rifle_s: { c:, t:, n: "Rifle", i:, m: 3, s: 6, f: 5, r: 3, v: 4 },
            ussr_smg_s: { c:, t:, n: "SMG", i:, m: 3, s: 6, f: 5, r: 2, v: 4, o: { a: 1 } },
            ussr_militia_s: {
              c:, t:, n: "Militia", i:, m: 2, s: 6, f: 5, r: 2, v: 3, o: { bv: 5 },
            },
          }
        end

        def soviet_teams
          c = "ussr"
          t = "tm"
          i = "team"
          {
            ussr_assault_t: { c:, t:, n: "Assault", i:, m: 4, s: 3, f: 3, r: 2, v: 5 },
            ussr_guards_rifle_t: { c:, t:, n: "Guards Rifle", i:, m: 3, s: 3, f: 3, r: 2, v: 5 },
            ussr_guards_smg_t: { c:, t:, n: "Guards SMG", i:, m: 3, s: 3, f: 3, r: 2, v: 5 },
            ussr_rifle_t: { c:, t:, n: "Rifle", i:, m: 3, s: 3, f: 2, r: 2, v: 4 },
            ussr_smg_t: { c:, t:, n: "SMG", i:, m: 3, s: 3, f: 2, r: 2, v: 4 },
            ussr_militia_t: {
              c:, t:, n: "Militia", i:, m: 2, s: 3, f: 2, r: 2, v: 3, o: { bv: 5 },
            },

            ussr_elite_crew: {
              c:, t:, n: "Crew", i: "crew", m: 4, s: 3, f: 1, r: 1, v: 5, o: { g: 1 },
            },
            ussr_crew: {
              c:, t:, n: "Crew", i: "crew", m: 3, s: 3, f: 1, r: 1, v: 4, o: { g: 1 },
            },
          }
        end

        def soviet_support
          c = "ussr"
          t = "sw"
          {
            ussr_lmg: {
              c:, t:, n: "DP-27 LMG", i: "mg", f: 6, r: 6, v: 0, o: { a: 1, r: 1, j: 2 },
            },
            ussr_mmg: { c:, t:, n: "SG-43 G MMG", i: "mg", f: 8, r: 10, v: -2, o: { r: 1, j: 2 } },
            ussr_hmg: {
              c:, t:, n: "PM M1910 HMG", i: "mg", f: 12, r: 12, v: -2, o: { r: 1, j: 2 },
            },
            ussr_50cal: {
              c:, t:, n: "DShK HMG", i: "mg", f: 16, r: 16, v: -2, o: { r: 1, j: 2 },
            },
            ussr_ft: flamethrower(c),
            ussr_sc: satchel_charge(c),
            ussr_mc: {
              c:, t:, n: "Molotov Coctail", i: "explosive", f: 12, r: 1, v: 0,
              o: { a: 1, x: 1, t: 1 },
            },
            ussr_lm: {
              c:, t:, n: "82-PM-41 MTR", i: "mortar", f: 8, r: 14, v: -1, o: { t: 1, m: 2, b: 2 },
            },
            ussr_hm: {
              c:, t:, n: "120-PM-38 MTR", i: "mortar", f: 16, r: 16, v: -3,
              o: { t: 1, m: 3, b: 2, s: 1 },
            },
            ussr_ampulomet: {
              c:, t:, n: "Ampulomet", i: "rocket", f: 8, r: 4, v: 0, o: { b: 4, p: 1, t: 1 },
            },
            ussr_radio76: {
              c:, t:, n: "Radio 76mm", i: "radio", f: 12, r: 0, v: 0, o: { s: 1, o: 1 },
            },
            ussr_radio85: {
              c:, t:, n: "Radio 85mm", i: "radio", f: 16, r: 0, v: 0, o: { s: 1, o: 1 },
            },
            ussr_radio107: {
              c:, t:, n: "Radio 107mm", i: "radio", f: 24, r: 0, v: 0, o: { s: 1, o: 1 },
            },
            ussr_radio122: {
              c:, t:, n: "Radio 122mm", i: "radio", f: 32, r: 0, v: 0, o: { s: 1, o: 1 },
            },
            ussr_radio152: {
              c:, t:, n: "Radio 152mm", i: "radio", f: 48, r: 0, v: 0, o: { s: 1, o: 1 },
            },
          }
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

        def german_squads
          c = "ger"
          t = "sqd"
          i = "squad"
          {
            ger_pioneer_s: {
              c:, t:, n: "Pioneer", i:, m: 4, s: 6, f: 7, r: 3, v: 5, o: { a: 1, s: 1 },
            },
            ger_ss_s: { c:, t:, n: "SS", i:, m: 4, s: 6, f: 6, r: 5, v: 5, o: { a: 1, s: 1 } },
            ger_fj_s: {
              c:, t:, n: "Fallschirmjäger", i:, m: 4, s: 6, f: 5, r: 4, v: 5, o: { a: 1, s: 1 },
            },
            ger_sturm_s: {
              c:, t:, n: "Sturm", i:, m: 4, s: 6, f: 6, r: 4, v: 4, o: { a: 1, s: 1 },
            },
            ger_rifle_s: { c:, t:, n: "Rifle", i:, m: 3, s: 6, f: 5, r: 5, v: 4, o: { s: 1 } },
            ger_volksgrenadier_s: { c:, t:, n: "Volksgrenadier", i:, m: 3, s: 6, f: 5, r: 4, v: 4 },
            ger_conscript_s: {
              c:, t:, n: "Conscript", i:, m: 2, s: 6, f: 5, r: 3, v: 3, o: { bv: 5 },
            },
          }
        end

        def german_teams
          c = "ger"
          t = "tm"
          i = "team"
          {
            ger_pioneer_t: { c:, t:, n: "Pioneer", i:, m: 4, s: 3, f: 3, r: 3, v: 5 },
            ger_ss_t: { c:, t:, n: "SS", i:, m: 4, s: 3, f: 3, r: 5, v: 5 },
            ger_fj_t: { c:, t:, n: "Fallschirmjäger", i:, m: 4, s: 3, f: 2, r: 4, v: 5 },
            ger_sturm_t: { c:, t:, n: "Sturm", i:, m: 4, s: 3, f: 3, r: 4, v: 4 },
            ger_rifle_t: { c:, t:, n: "Rifle", i:, m: 3, s: 3, f: 2, r: 5, v: 4 },
            ger_volksgrenadier_t: { c:, t:, n: "Volksgrenadier", i:, m: 3, s: 3, f: 2, r: 4, v: 4 },
            ger_conscript_t: {
              c:, t:, n: "Conscript", i:, m: 2, s: 3, f: 2, r: 3, v: 3, o: { bv: 5 },
            },

            ger_elite_crew: {
              c:, t:, n: "Crew", i: "crew", m: 4, s: 3, f: 1, r: 1, v: 5, o: { g: 1 },
            },
            ger_crew: { c:, t:, n: "Crew", i: "crew", m: 3, s: 3, f: 1, r: 1, v: 4, o: { g: 1 } },
          }
        end

        def german_support
          c = "ger"
          t = "sw"
          {
            ger_lmg: { c:, t:, n: "MG 34 LMG", i: "mg", f: 8, r: 8, v: 0, o: { a: 1, r: 1, j: 2 } },
            ger_lmg2: {
              c:, t:, n: "MG 42 LMG", i: "mg", f: 10, r: 8, v: 0, o: { a: 1, r: 1, j: 2 },
            },
            ger_hmg: { c:, t:, n: "MG 08/15 HMG", i: "mg", f: 12, r: 16, v: -1, o: { r: 1, j: 2 } },
            ger_ft: flamethrower(c),
            ger_sc: satchel_charge(c),
            ger_lm: {
              c:, t:, n: "5cm leGrW 36", i: "mortar", f: 8, r: 13, v: -2, o: { t: 1, m: 2, b: 2 },
            },
            ger_mm: {
              c:, t:, n: "8cm GrW 34", i: "mortar", f: 16, r: 16, v: -3,
              o: { t: 1, m: 3, b: 2, s: 1 },
            },
            ger_panzerfaust: {
              c:, t:, n: "Panzerfaust", i: "antitank", f: 16, r: 1, v: 0,
              o: { x: 1, p: 1, t: 1 },
            },
            ger_panzerschreck: {
              c:, t:, n: "Panzerschreck", i: "rocket", f: 16, r: 4, v: 0,
              o: { b: 3, p: 1, t: 1 },
            },
            ger_radio75: {
              c:, t:, n: "Radio 7.5cm", i: "radio", f: 12, r: 0, v: 0, o: { s: 1, o: 1 },
            },
            ger_radio105: {
              c:, t:, n: "Radio 10.5cm", i: "radio", f: 24, r: 0, v: 0, o: { s: 1, o: 1 },
            },
            ger_radio150: {
              c:, t:, n: "Radio 15cm", i: "radio", f: 48, r: 0, v: 0, o: { s: 1, o: 1 },
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
        # rubocop:enable Metric/MethodLength
      end
    end
  end
end
