# frozen_string_literal: true

module Utility
  module Scenarios
    module Units
      class << self # rubocop:disable Metric/ClassLength
        # rubocop:disable Metric/MethodLength
        def unit_definition(code) # rubocop:disable Metric/AbcSize
          lookup = leaders.merge(soviet_squads).merge(soviet_teams).merge(soviet_support)
                          .merge(soviet_guns)
                          .merge(german_squads).merge(german_teams).merge(german_support)
                          .merge(german_guns)
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
        #    i: ignore terrain, b: weapon break number, j: weapon jam number
        #    t: target fire, m: minimum range, p: anti-tank, o: off-board artillery
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
            c: nation, t: "sw", n: "Flamethrower", i: "flamethrower", f: 25, r: 1, v: 0,
            o: { a: 1, i: 1, b: 3 },
          }
        end

        def satchel_charge(nation)
          {
            c: nation, t: "sw", n: "Satchel Charge", i: "explosive", f: 32, r: 1, v: 0,
            o: { a: 1, x: 1 },
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
            ussr_lmg: { c:, t:, n: "Light MG", i: "mg", f: 6, r: 6, v: 0, o: { a: 1, r: 1, j: 2 } },
            ussr_mmg: { c:, t:, n: "Medium MG", i: "mg", f: 10, r: 10, v: -2, o: { r: 1, j: 2 } },
            ussr_hmg: { c:, t:, n: "Heavy MG", i: "mg", f: 12, r: 12, v: -2, o: { r: 1, j: 2 } },
            ussr_ft: flamethrower(c),
            ussr_sc: satchel_charge(c),
            ussr_mc: {
              c:, t:, n: "Molotov Coctail", i: "explosive", f: 12, r: 1, v: 0, o: { a: 1, x: 1 },
            },
            ussr_lm: {
              c:, t:, n: "Light Mortar", i: "mortar", f: 8, r: 14, v: -1, o: { t: 1, m: 2, b: 2 },
            },
            ussr_hm: {
              c:, t:, n: "Heavy Mortar", i: "mortar", f: 18, r: 16, v: -3,
              o: { t: 1, m: 3, b: 2, s: 1 },
            },
            ussr_ampulomet: {
              c:, t:, n: "Ampulomet", i: "rocket", f: 8, r: 4, v: 0, o: { b: 4, p: 1, t: 1 },
            },
            ussr_radio76: {
              c:, t:, n: "Radio 76mm", i: "radio", f: 12, r: 0, v: 0, o: { s: 1, o: 1 },
            },
            ussr_radio85: {
              c:, t:, n: "Radio 85mm", i: "radio", f: 18, r: 0, v: 0, o: { s: 1, o: 1 },
            },
            ussr_radio107: {
              c:, t:, n: "Radio 107mm", i: "radio", f: 25, r: 0, v: 0, o: { s: 1, o: 1 },
            },
            ussr_radio122: {
              c:, t:, n: "Radio 122mm", i: "radio", f: 32, r: 0, v: 0, o: { s: 1, o: 1 },
            },
            ussr_radio152: {
              c:, t:, n: "Radio 152mm", i: "radio", f: 40, r: 0, v: 0, o: { s: 1, o: 1 },
            },
          }
        end

        def soviet_guns
          c = "ussr"
          t = "gun"
          {
            ussr_76_inf: {
              c:, t:, n: "76mm Mountain", i: "gun", s: 3, f: 12, r: 16, v: -4,
              o: { t: 1, s: 1, j: 2 },
            },
            ussr_45_at: {
              c:, t:, n: "45mm 53-K", i: "atgun", s: 2, f: 6, r: 20, v: -3, o: { t: 1, p: 1, j: 2 },
            },
            ussr_45l_at: {
              c:, t:, n: "45mm M-42", i: "atgun", s: 2, f: 8, r: 20, v: -3, o: { t: 1, p: 1, j: 2 },
            },
            ussr_57_at: {
              c:, t:, n: "57mm ZiS-2", i: "atgun", s: 3, f: 12, r: 20, v: -4,
              o: { t: 1, p: 1, j: 2 },
            },
            ussr_100_at: {
              c:, t:, n: "100mm BS-3", i: "atgun", s: 4, f: 25, r: 24, v: -5,
              o: { t: 1, p: 1, j: 2 },
            },
          }
        end

        def german_squads
          c = "ger"
          t = "sqd"
          i = "squad"
          {
            ger_pioneer_s: {
              c:, t:, n: "Pioneer", i:, m: 4, s: 6, f: 7, r: 3, v: 5, o: { a: 1, s: 3 },
            },
            ger_ss_s: { c:, t:, n: "SS", i:, m: 4, s: 6, f: 6, r: 5, v: 5, o: { a: 1, s: 3 } },
            ger_fj_s: {
              c:, t:, n: "Fallschirmjäger", i:, m: 4, s: 6, f: 5, r: 4, v: 5, o: { a: 1, s: 3 },
            },
            ger_sturm_s: {
              c:, t:, n: "Sturm", i:, m: 4, s: 6, f: 6, r: 4, v: 4, o: { a: 1, s: 3 },
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
            ger_lmg: { c:, t:, n: "Light MG", i: "mg", f: 8, r: 8, v: 0, o: { a: 1, r: 1, j: 2 } },
            ger_hmg: { c:, t:, n: "Heavy MG", i: "mg", f: 12, r: 16, v: -1, o: { r: 1, j: 2 } },
            ger_ft: flamethrower(c),
            ger_sc: satchel_charge(c),
            ger_lm: {
              c:, t:, n: "Light Mortar", i: "mortar", f: 8, r: 13, v: -2, o: { t: 1, m: 2, b: 2 },
            },
            ger_mm: {
              c:, t:, n: "Medium Mortar", i: "mortar", f: 18, r: 16, v: -3,
              o: { t: 1, m: 3, b: 2, s: 1 },
            },
            ger_panzerfaust: {
              c:, t:, n: "Panzerfaust", i: "antitank", f: 18, r: 1, v: 0,
              o: { x: 1, p: 1, t: 1 },
            },
            ger_panzerschreck: {
              c:, t:, n: "Panzerschreck", i: "rocket", f: 18, r: 4, v: 0,
              o: { b: 3, p: 1, t: 1 },
            },
            ger_radio75: {
              c:, t:, n: "Radio 7.5cm", i: "radio", f: 12, r: 0, v: 0, o: { s: 1, o: 1 },
            },
            ger_radio105: {
              c:, t:, n: "Radio 10.5cm", i: "radio", f: 25, r: 0, v: 0, o: { s: 1, o: 1 },
            },
            ger_radio150: {
              c:, t:, n: "Radio 15cm", i: "radio", f: 40, r: 0, v: 0, o: { s: 1, o: 1 },
            },
          }
        end

        def german_guns
          c = "ger"
          t = "gun"
          {
            ger_ig18_inf: {
              c:, t:, n: "7.5cm IG 18", i: "gun", s: 3, f: 12, r: 16, v: -3,
              o: { t: 1, s: 1, j: 2 },
            },
            ger_sig33_inf: {
              c:, t:, n: "15cm sIG 33", i: "gun", s: 3, f: 18, r: 16, v: -4,
              o: { t: 1, s: 1, j: 2 },
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
              c:, t:, n: "7.5cm Pak 40", i: "atgun", s: 3, f: 18, r: 24, v: -4,
              o: { t: 1, p: 1, j: 2 },
            },
            ger_88_at: {
              c:, t:, n: "8.8cm Pak 43", i: "atgun", s: 6, f: 32, r: 24, v: -5,
              o: { t: 1, p: 1, j: 2 },
            },
            ger_88flak_at: {
              c:, t:, n: "8.8cm Flak 37", i: "atgun", s: 6, f: 32, r: 30, v: -5,
              o: { t: 1, p: 1, j: 2 },
            },
            ger_128_at: {
              c:, t:, n: "12.8cm Pak 44", i: "atgun", s: 6, f: 40, r: 30, v: -5,
              o: { t: 1, p: 1, j: 2 },
            },
          }
        end
        # rubocop:enable Metric/MethodLength
      end
    end
  end
end
