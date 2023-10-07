# frozen_string_literal: true

module Utility
  module Scenarios
    module Units
      class << self # rubocop:disable Metric/ClassLength
        # rubocop:disable Metric/MethodLength
        def unit_definition(code) # rubocop:disable Metric/AbcSize
          lookup = leaders.merge(soviet_squads).merge(soviet_teams).merge(soviet_support)
                          .merge(german_squads).merge(german_teams).merge(german_support)
          if code.is_a? Array
            lookup[code[1]]&.merge(x: code[0]) || :unknown
          else
            lookup[code] || :unknown
          end
        end

        # c: nation, t: type, n: name
        #               sqd, tm, ldr, sw
        # m: morale (2-6), s: size (l: 1, 3, 6), f: firepower, r: range, v: movement,
        #                                                        bv: broken movement (if not 6)
        # o: flags
        #    l: leadership, g: gun adj, a: assault, r: rapid fire, s: smoke, x: expend
        #    i: ignore terrain, b: weapon break number, j: weapon jam number
        # x: count

        def gen_leaders(nation)
          # Currently 6-2, 5-2, 6-1, 5-1, 4-1, 3-1
          lu = {}
          [5, 6].each do |x|
            lu["#{nation}_leader_#{x}_2".to_sym] = {
              c: nation, t: "ldr", n: "Leader", m: x, s: 1, f: 1, r: 1, v: 6, o: { l: 2 },
            }
          end
          [3, 4, 5, 6].each do |x|
            lu["#{nation}_leader_#{x}_1".to_sym] = {
              c: nation, t: "ldr", n: "Leader", m: x, s: 1, f: 1, r: 1, v: 6, o: { l: 1 },
            }
          end
          lu
        end

        def flamethrower(nation)
          { c: nation, t: "sw", n: "Flamethrower", f: 25, r: 1, v: 0, o: { a: 1, i: 1, b: 11 } }
        end

        def satchel_charge(nation)
          { c: nation, t: "sw", n: "Satchel Charge", f: 32, r: 1, v: 0, o: { a: 1, x: 1 } }
        end

        def leaders
          gen_leaders("ussr").merge(gen_leaders("ger"))
        end

        def soviet_squads
          c = "ussr"
          t = "sqd"
          {
            ussr_assault_s: {
              c:, t:, n: "Assault", m: 4, s: 6, f: 7, r: 2, v: 5, o: { a: 1, s: 1 },
            },
            ussr_guards_rifle_s: { c:, t:, n: "Guards Rifle", m: 3, s: 6, f: 5, r: 5, v: 5 },
            ussr_guards_smg_s: {
              c:, t:, n: "Guards SMG", m: 3, s: 6, f: 6, r: 3, v: 5, o: { a: 1 },
            },
            ussr_rifle_s: { c:, t:, n: "Rifle", m: 3, s: 6, f: 5, r: 3, v: 4 },
            ussr_smg_s: { c:, t:, n: "SMG", m: 3, s: 6, f: 5, r: 2, v: 4, o: { a: 1 } },
            ussr_militia_s: { c:, t:, n: "Militia", m: 2, s: 6, f: 5, r: 2, v: 3, bv: 5 },
          }
        end

        def soviet_teams
          c = "ussr"
          t = "tm"
          {
            ussr_assault_t: { c:, t:, n: "Assault", m: 4, s: 3, f: 3, r: 2, v: 5 },
            ussr_guards_rifle_t: { c:, t:, n: "Guards Rifle", m: 3, s: 3, f: 3, r: 2, v: 5 },
            ussr_guards_smg_t: { c:, t:, n: "Guards SMG", m: 3, s: 3, f: 3, r: 2, v: 5 },
            ussr_rifle_t: { c:, t:, n: "Rifle", m: 3, s: 3, f: 2, r: 2, v: 4 },
            ussr_smg_t: { c:, t:, n: "SMG", m: 3, s: 3, f: 2, r: 2, v: 4 },
            ussr_militia_t: { c:, t:, n: "Militia", m: 2, s: 3, f: 2, r: 2, v: 3, bv: 5 },

            ussr_elite_weapon_t: { c:, t:, n: "Weapon", m: 4, s: 3, f: 1, r: 1, v: 5, o: { g: 1 } },
            ussr_weapon_t: { c:, t:, n: "Weapon", m: 3, s: 3, f: 1, r: 1, v: 4, o: { g: 1 } },
          }
        end

        def soviet_support
          c = "ussr"
          t = "sw"
          {
            ussr_lmg: { c:, t:, n: "LMG", f: 6, r: 6, v: 0, o: { a: 1, r: 1, j: 12 } },
            ussr_mmg: { c:, t:, n: "MMG", f: 12, r: 10, v: -2, o: { r: 1, j: 12 } },
            ussr_hmg: { c:, t:, n: "HMG", f: 18, r: 12, v: -2, o: { r: 1, j: 12 } },
            ussr_ft: flamethrower(c),
            ussr_sc: satchel_charge(c),
            ussr_mt: { c:, t:, n: "Molotov Coctail", f: 12, r: 1, v: 0, o: { a: 1, x: 1 } },
          }
        end

        def german_squads
          c = "ger"
          t = "sqd"
          {
            ger_pioneer_s: {
              c:, t:, n: "Pioneer", m: 4, s: 6, f: 7, r: 3, v: 5, o: { a: 1, s: 3 },
            },
            ger_ss_s: { c:, t:, n: "SS", m: 4, s: 6, f: 6, r: 5, v: 5, o: { a: 1, s: 3 } },
            ger_fj_s: {
              c:, t:, n: "Fallschirmjäger", m: 4, s: 6, f: 5, r: 4, v: 5, o: { a: 1, s: 3 },
            },
            ger_sturm_s: { c:, t:, n: "Sturm", m: 4, s: 6, f: 6, r: 4, v: 4, o: { a: 1, s: 3 } },
            ger_rifle_s: { c:, t:, n: "Rifle", m: 3, s: 6, f: 5, r: 5, v: 4, o: { s: 1 } },
            ger_volkgrenadier_s: { c:, t:, n: "Volksgrenadier", m: 3, s: 6, f: 5, r: 4, v: 4 },
            ger_conscript_s: { c:, t:, n: "Conscript", m: 2, s: 6, f: 5, r: 3, v: 3, bv: 5 },
          }
        end

        def german_teams
          c = "ger"
          t = "tm"
          {
            ger_pioneer_t: { c:, t:, n: "Pioneer", m: 4, s: 3, f: 3, r: 3, v: 5 },
            ger_ss_t: { c:, t:, n: "SS", m: 4, s: 3, f: 3, r: 5, v: 5 },
            ger_fj_t: { c:, t:, n: "Fallschirmjäger", m: 4, s: 3, f: 2, r: 4, v: 5 },
            ger_sturm_t: { c:, t:, n: "Sturm", m: 4, s: 3, f: 3, r: 4, v: 4 },
            ger_rifle_t: { c:, t:, n: "Rifle", m: 3, s: 3, f: 2, r: 5, v: 4 },
            ger_volkgrndr_t: { c:, t:, n: "Volksgrenadier", m: 3, s: 3, f: 2, r: 4, v: 4 },
            ger_conscript_t: { c:, t:, n: "Conscript", m: 2, s: 3, f: 2, r: 3, v: 3, bv: 5 },

            ger_elite_weapon_t: { c:, t:, n: "Weapon", m: 4, s: 3, f: 1, r: 1, v: 5, o: { g: 1 } },
            ger_weapon_t: { c:, t:, n: "Weapon", m: 3, s: 3, f: 1, r: 1, v: 4, o: { g: 1 } },
          }
        end

        def german_support
          c = "ger"
          t = "sw"
          {
            ger_lmg: { c:, t:, n: "LMG", f: 8, r: 8, v: 0, o: { a: 1, r: 1, j: 12 } },
            ger_hmg: { c:, t:, n: "HMG", f: 18, r: 16, v: -1, o: { r: 1, j: 12 } },
            ger_ft: flamethrower(c),
            ger_sc: satchel_charge(c),
          }
        end
        # rubocop:enable Metric/MethodLength
      end
    end
  end
end
