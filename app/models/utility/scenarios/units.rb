# frozen_string_literal: true

module Utility
  module Scenarios
    module Units
      class << self # rubocop:disable Metric/ClassLength
        # rubocop:disable Metric/MethodLength, Metric/AbcSize, Metric/CyclomaticComplexity
        # -rubocop:disable Metric/PerceivedComplexity
        def lookup_data
          features.merge(leaders).merge(infantry).merge(machine_guns).merge(mortars).merge(radios)
                  .merge(support_weapons).merge(infantry_guns).merge(at_guns)
                  .merge(tanks).merge(sp_guns).merge(half_tracks).merge(armored_cars)
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
          sanitized = name.gsub(%r{[-\s/.']}, "_").gsub(/['()]/, "").downcase
          sanitized = sanitized.gsub("ä", "a").gsub("ö", "o").gsub("ü", "u").downcase
          # TODO: remove when done debugging
          puts sanitized unless sanitized =~ /^[a-z0-9_]*$/
          sanitized
        end

        def all_factions
          %w[ger ita jap uk usa ussr] # fra fin chi axm alm
        end

        def features
          {
            smoke: { ft: 1, n: "Smoke", t: "smoke", i: "smoke", h: 2 },
            blaze: { ft: 1, n: "Blaze", t: "fire", i: "fire", o: { los: 1 } },
            wire: { ft: 1, n: "Wire", t: "wire", i: "wire", f: "½", r: 0, v: "A" },
            mines: { ft: 1, n: "Minefield", t: "mines", i: "mines", f: 8, r: 0, v: 0, o: { g: 1 } },
            ap_mines: { ft: 1, n: "AP Minefield", t: "mines", i: "mines", f: 8, r: 0, v: 0 },
            at_mines: {
              ft: 1, n: "AT Minefield", t: "mines", i: "mines", f: 8, r: 0, v: 0, o: { p: 1 },
            },
            foxhole: { ft: 1, n: "Foxhole", t: "foxhole", i: "foxhole", d: 2 },
            pillbox: {
              ft: 1, n: "Pillbox", t: "bunker", i: "bunker", o: { da: { f: 3, s: 3, r: 1 } },
            },
            bunker: {
              ft: 1, n: "Bunker", t: "bunker", i: "bunker", o: { da: { f: 4, s: 4, r: 1 } },
            },
            strongpoint: {
              ft: 1, n: "Strong Point", t: "bunker", i: "bunker", o: { da: { f: 5, s: 5, r: 1 } },
            },
          }
        end

        def leaders
          # Currently 6-2, 5-2, 6-1, 5-1, 4-1, 3-1
          i = "leader"
          y = 0
          s = f = r = 1
          lu = {}
          all_factions.each do |nation|
            [6, 5, 4, 3].each do |m|
              [2, 1].each do |l|
                next if l == 2 && m < 5

                lu["#{nation}_leader_#{m}_#{l}".to_sym] = {
                  c: nation, t: "ldr", n: "Leader", i:, y:, m:, s:, f:, r:, v: 6, o: { l: },
                }
              end
            end
          end
          lu
        end

        # rubocop:disable Metric/LineLength
        def infantry
          lu = {}
          key = %i[c n y m f r v o]
          [
            ["ger", "Pionier", 0, 4, 9, 3, 5, { a: 1, s: 1 }],
            ["ger", "SS", 34, 4, 8, 5, 5, { a: 1, s: 1 }],
            ["ger", "Fallschirmjäger", 35, 4, 7, 4, 5, { a: 1, s: 1 }],
            ["ger", "Sturm", 0, 4, 8, 4, 5, { a: 1, s: 1 }],
            ["ger", "Rifle", 0, 3, 7, 5, 4, { s: 1 }],
            ["ger", "Volksgrenadier", 44, 3, 7, 4, 4, {}],
            ["ger", "Conscript", 0, 2, 6, 3, 3, {}],
            ["ita", "Guastatori", 40, 4, 8, 2, 5, { a: 1, s: 1 }],
            ["ita", "Alpini", 0, 4, 7, 3, 5, { a: 1 }],
            ["ita", "Bersaglieri", 0, 4, 6, 4, 5, { s: 1 }],
            ["ita", "Paracadutisti", 40, 4, 6, 3, 5, { a: 1, s: 1 }],
            ["ita", "Fucilieri", 0, 3, 6, 4, 4, {}],
            ["ita", "Blackshirt", 23, 2, 5, 3, 3, {}],
            ["jap", "Betsudotai", 0, 5, 7, 3, 5, { a: 1 }],
            ["jap", "Konoehen", 0, 4, 6, 4, 5, { a: 1 }],
            ["jap", "A Division", 0, 4, 6, 4, 5, { a: 1 }],
            ["jap", "B Division", 0, 3, 6, 4, 4, { a: 1 }],
            ["jap", "SNLF", 0, 3, 6, 4, 4, { a: 1 }],
            ["jap", "Conscript", 0, 2, 5, 3, 3, {}],
            ["uk", "Engineer", 0, 4, 9, 5, 5, { a: 1, s: 1 }],
            ["uk", "Airborne", 42, 4, 8, 5, 5, { a: 1, s: 1 }],
            ["uk", "Gurkha", 0, 4, 7, 5, 5, { a: 1 }],
            ["uk", "Guard", 0, 4, 7, 5, 5, { s: 1 }],
            ["uk", "Line", 0, 3, 7, 4, 4, { s: 1 }],
            ["uk", "Indian", 0, 3, 6, 4, 4, {}],
            ["uk", "Territorial", 0, 2, 6, 3, 3, {}],
            ["uk", "Colonial", 0, 2, 6, 3, 3, {}],
            ["usa", "Engineer", 0, 4, 9, 3, 5, { a: 1, s: 1 }],
            ["usa", "Paratroop", 43, 4, 8, 4, 5, { a: 1, s: 1 }],
            ["usa", "Ranger", 42, 4, 8, 4, 5, { a: 1, s: 1 }],
            ["usa", "Marine Rifle", 0, 4, 7, 6, 5, { a: 1 }],
            ["usa", "Veteran", 0, 4, 7, 6, 4, { s: 1 }],
            ["usa", "Rifle", 0, 3, 7, 6, 4, { s: 1 }],
            ["usa", "Garrison", 0, 2, 6, 4, 3, {}],
            ["usa", "Green", 0, 2, 6, 4, 3, {}],
            ["ussr", "Assault", 41, 4, 9, 2, 5, { a: 1, s: 1 }],
            ["ussr", "Guards Rifle", 41, 4, 7, 5, 5, {}],
            ["ussr", "Guards SMG", 41, 4, 8, 3, 5, { a: 1 }],
            ["ussr", "Rifle", 0, 3, 7, 3, 4, {}],
            ["ussr", "SMG", 0, 3, 7, 2, 4, { a: 1 }],
            ["ussr", "Militia", 0, 2, 6, 2, 3, {}],
          ].each do |unit|
            squad = { t: "sqd", i: "squad", s: 6 }
            team = { t: "tm", i: "team", s: 3 }
            unit.each_with_index do |v, i|
              squad[key[i]] = v
              team[key[i]] = v
            end

            team[:v] == 3 ? team[:o][:bv] = 5 : team.delete(:o)
            team[:f] = team[:f] / 2

            name = "#{team[:c]}_#{sanitize(team[:n])}"
            lu["#{name}_s".to_sym] = squad
            lu["#{name}_t".to_sym] = team
          end
          all_factions.each do |c|
            t = "tm"
            lu["#{c}_elite_crew_t".to_sym] = {
              c:, t:, n: "Crew", i: "crew", y: 0, m: 4, s: 3, f: 1, r: 1, v: 5, o: { cw: 2 },
            }
            lu["#{c}_crew_t".to_sym] = {
              c:, t:, n: "Crew", i: "crew", y: 0, m: 3, s: 3, f: 1, r: 1, v: 4, o: { cw: 1 },
            }
          end
          lu
        end

        def machine_guns
          lu = {}
          key = %i[c n y f r v o]
          [
            ["ger", "MG 34", 36, 5, 8, 0, { a: 1, r: 1, j: 3 }],
            ["ger", "MG 42", 42, 8, 8, 0, { a: 1, r: 1, j: 3 }],
            ["ger", "MG 08/15", 17, 10, 12, -1, { r: 1, j: 3 }],
            ["ita", "Breda 30", 30, 3, 7, 0, { a: 1, r: 1, j: 4 }],
            ["ita", "Fiat-Revelli 1935", 36, 6, 10, -1, { r: 1, j: 4, sn: 1 }],
            ["ita", "Breda M37", 37, 8, 12, -1, { r: 1, j: 3 }],
            ["jap", "Type 11 LMG", 22, 3, 7, 0, { r: 1, j: 5 }],
            ["jap", "Type 96 LMG", 36, 4, 8, 0, { a: 1, r: 1, j: 4 }],
            ["jap", "Type 99 LMG", 39, 5, 8, 0, { a: 1, r: 1, j: 3 }],
            ["jap", "Type 3 HMG", 14, 5, 10, -2, { r: 1, j: 3 }],
            ["jap", "Type 92 HMG", 32, 7, 10, -2, { r: 1, j: 3 }],
            ["uk", "Bren LMG", 35, 3, 6, 0, { a: 1, r: 1, j: 3 }],
            ["uk", "Lewis Gun", 14, 4, 8, 0, { a: 1, r: 1, j: 3 }],
            ["uk", "Vickers MG", 12, 7, 10, -1, { r: 1, j: 2 }],
            ["usa", "M1918 BAR", 18, 5, 8, 0, { a: 1, r: 1, j: 3 }],
            ["usa", "M1919 Browning", 19, 6, 8, 0, { r: 1, j: 3 }],
            ["usa", "M1917 Browning", 17, 8, 12, -2, { r: 1, j: 3 }],
            ["usa", "M2 Browning", 33, 10, 15, -2, { r: 1, j: 3 }],
            ["ussr", "DP-27", 28, 4, 6, 0, { a: 1, r: 1, j: 3 }],
            ["ussr", "SG-43", 43, 5, 10, -2, { r: 1, j: 3 }],
            ["ussr", "PM M1910", 10, 8, 10, -2, { r: 1, j: 3 }],
            ["ussr", "DShK", 38, 14, 15, -2, { r: 1, j: 3 }],
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
            ["ger", "5cm leGrW 36", 36, 8, 11, 0, { m: 2 }],
            ["ger", "8cm GrW 34", 37, 20, 17, -2, { s: 1, m: 3 }],
            ["ger", "kz 8cm GrW 42", 41, 20, 16, -1, { s: 1, m: 3 }],
            ["ger", "12cm GrW 42", 43, 40, 32, 1, { s: 1, m: 4, c: 1 }],
            ["ita", "Brixia M35", 35, 6, 11, -1, { m: 2 }],
            ["ita", "81/14 M35", 35, 20, 16, -2, { s: 1, m: 3 }],
            ["jap", "Type 10 Gren.L", 21, 6, 6, 0, { s: 1, m: 2 }],
            ["jap", "Type 89 Gren.L", 29, 8, 11, 0, { s: 1, m: 2 }],
            ["jap", "Type 97 81mm", 37, 20, 24, -3, { s: 1, m: 3 }],
            ["jap", "Type 97 90mm", 37, 24, 24, 1, { s: 1, m: 3, c: 1 }],
            ["jap", "Type 94 90mm", 34, 24, 24, 1, { s: 1, m: 3, c: 1 }],
            ["uk", "2inch Mortar", 37, 7, 10, 0, { m: 2 }],
            ["uk", "ML 3inch Mortar", 33, 20, 17, -1, { s: 1, m: 3 }],
            ["uk", "ML 4.2inch Mortar", 40, 32, 32, 1, { s: 1, m: 4, c: 1, sn: 2 }],
            ["usa", "M2 Mortar", 40, 10, 16, -1, { m: 2 }],
            ["usa", "M1 Mortar", 35, 20, 24, -2, { s: 1, m: 3 }],
            ["usa", "M2 4.2inch Mortar", 43, 32, 32, 1, { sn: 2, s: 1, m: 4, c: 1 }],
            ["ussr", "RM-38", 38, 8, 14, 0, { m: 2 }],
            ["ussr", "82-BM-37", 37, 20, 24, -2, { s: 1, m: 3 }],
            ["ussr", "82-PM-41", 41, 20, 24, -2, { s: 1, m: 3 }],
            ["ussr", "120-PM-38", 39, 40, 32, 1, { s: 1, m: 4, c: 1 }],
          ].each do |unit|
            mortar = { t: "sw", i: "mortar" }
            unit.each_with_index do |v, i|
              mortar[key[i]] = v
            end
            mortar[:o].merge!({ t: 1, b: 3, g: 1 })
            mortar[:s] = 3 if mortar[:o][:c]
            lu["#{mortar[:c]}_#{sanitize(mortar[:n])}".to_sym] = mortar
          end
          lu
        end

        def radios
          lu = {}
          key = %i[c n y f]
          [
            ["ger", "Radio 10.5cm", 35, 24],
            ["ger", "Radio 15cm", 34, 48],
            ["ger", "Radio 17cm", 41, 64],
            ["ger", "Radio 21cm", 39, 96],
            ["ita", "Radio 75mm", 37, 12],
            ["ita", "Radio 100mm", 14, 24],
            ["ita", "Radio 149mm", 14, 48],
            ["jap", "Radio 7.5cm", 36, 12],
            ["jap", "Radio 10cm", 31, 24],
            ["jap", "Radio 15cm", 37, 48],
            ["uk", "Radio 88mm", 40, 24],
            ["uk", "Radio 114mm", 38, 32],
            ["uk", "Radio 140mm", 41, 40],
            ["uk", "Radio 152mm", 16, 48],
            ["uk", "Radio 183mm", 40, 80],
            ["usa", "Radio 75mm", 32, 12],
            ["usa", "Radio 105mm", 41, 24],
            ["usa", "Radio 155mm", 42, 48],
            ["usa", "Radio 8inch", 42, 96],
            ["ussr", "Radio 76mm", 37, 12],
            ["ussr", "Radio 85mm", 43, 16],
            ["ussr", "Radio 122mm", 39, 32],
            ["ussr", "Radio 152mm", 37, 48],
          ].each do |unit|
            radio = { t: "sw", i: "radio" }
            unit.each_with_index do |v, i|
              radio[key[i]] = v
            end
            radio.merge!({ r: 0, v: 0, o: { s: 1, o: 1, j: 3 } })
            lu["#{radio[:c]}_#{sanitize(radio[:n])}".to_sym] = radio
          end
          lu
        end

        def support_weapons
          lu = {}
          key = %i[c n y f r v o]
          [
            ["ger", "Panzerfaust", 43, 16, 1, 0, { x: 1 }],
            ["ger", "Panzerschreck", 43, 12, 3, 0, { b: 4 }],
            ["uk", "PIAT", 42, 8, 3, 0, { b: 4 }],
            ["usa", "M1 Bazooka", 42, 8, 4, 0, { b: 5 }],
            ["usa", "M1A1 Bazooka", 43, 10, 4, 0, { b: 4 }],
            ["usa", "M9 Bazooka", 43, 10, 4, 0, { b: 4 }],
            ["ussr", "Ampulomet", 41, 12, 6, -1, { b: 5 }],
          ].each do |unit|
            rocket = { t: "sw", i: "rocket" }
            unit.each_with_index do |v, i|
              rocket[key[i]] = v
            end
            rocket[:o].merge!({ t: 1, p: 1 })
            lu["#{rocket[:c]}_#{sanitize(rocket[:n])}".to_sym] = rocket
          end
          [
            ["jap", "Type 97 AC", 35, 3, 8, -2, { b: 3 }],
            ["uk", "Boys AT Rifle", 37, 2, 8, -1, { b: 3 }],
          ].each do |unit|
            at = { t: "sw", i: "antitank" }
            unit.each_with_index do |v, i|
              at[key[i]] = v
            end
            at[:o].merge!({ t: 1, p: 1 })
            lu["#{at[:c]}_#{sanitize(at[:n])}".to_sym] = at
          end
          t = "sw"
          all_factions.each do |c|
            i = "flamethrower"
            n = i.capitalize
            y = 15
            lu["#{c}_ft".to_sym] = { c:, t:, n:, y:, i:, f: 24, r: 1, v: 0, o: { a: 1, i: 1, b: 3 } }
            n = "Satchel Charge"
            i = "explosive"
            y = 36
            lu["#{c}_sc".to_sym] = { c:, t:, n:, y:, i:, f: 24, r: 1, v: 0, o: { a: 1, x: 1, t: 1 } }
          end
          %w[fin ussr].each do |c|
            n = "Molotov Cocktail"
            i = "explosive"
            y = 39
            lu["#{c}_mc".to_sym] = { c:, t:, n:, y:, i:, f: 4, r: 1, v: 0, o: { i: 1, a: 1, x: 1, t: 1, sn: 1 } }
          end
          lu
        end

        def infantry_guns
          lu = {}
          key = %i[c n y f r o]
          [
            ["ger", "7.5cm leIG 18", 32, 16, 14, {}],
            ["ger", "15cm sIG 33", 36, 64, 18, {}],
            ["ita", "Cannone da 65/17", 13, 12, 12, { sn: 2 }],
            ["ita", "Obice da 75/18", 34, 16, 14, {}],
            ["ita", "Obice da 100/17", 14, 32, 16, {}],
            ["jap", "70mm Type 92", 32, 12, 14, {}],
            ["uk", "QF 25-Pounder", 40, 20, 16, {}],
            ["uk", "QF 25Pdr Short", 43, 16, 15, {}],
            ["uk", "QF 4.5inch", 8, 32, 20, {}],
            ["usa", "75mm M1 Pack", 27, 16, 16, {}],
            ["ussr", "76mm M1927", 28, 16, 16, {}],
          ].each do |unit|
            gun = { t: "gun", i: "gun", v: 1, s: 3 }
            unit.each_with_index do |v, i|
              gun[key[i]] = v
            end
            gun[:o].merge!({ t: 1, j: 3, g: 1, s: 1, c: 1 })
            lu["#{gun[:c]}_#{sanitize(gun[:n])}".to_sym] = gun
          end
          lu
        end

        def at_guns
          lu = {}
          key = %i[c n y f r o]
          [
            ["ger", "2.8cm sPzB 41", 41, 8, 10, {}],
            ["ger", "3.7cm Pak 36", 36, 8, 16, {}],
            ["ger", "5cm Pak 38", 40, 24, 16, {}],
            ["ger", "7.5cm Pak 97/38", 42, 24, 20, { sn: 1 }],
            ["ger", "7.5cm Pak 40", 42, 32, 24, {}],
            ["ger", "8.8cm Pak 43/41", 43, 64, 32, { sn: 1 }],
            ["ger", "8.8cm Pak 43", 43, 64, 32, { y: 1 }],
            ["ger", "12.8cm Pak 44", 44, 96, 40, { y: 1 }],
            ["ger", "8.8cm Flak 36", 36, 48, 30, { y: 1 }],
            ["ita", "Cannone da 47/32", 35, 12, 16, { sn: 2 }],
            ["ita", "Cannone da 47/40", 38, 16, 16, { sn: 2 }],
            ["ita", "Cannone da 75/46", 34, 32, 24, { sn: 2 }],
            ["ita", "Cannone da 90/53", 39, 48, 32, { sn: 2 }],
            ["jap", "37mm Type 94", 36, 8, 14, {}],
            ["jap", "37mm Type 1", 41, 10, 16, {}],
            ["jap", "47mm Type 1", 42, 16, 16, {}],
            ["jap", "75mm Type 90", 42, 32, 20, {}],
            ["uk", "QF 2-Pounder", 36, 10, 12, {}],
            ["uk", "QF 6Pdr Mk II", 41, 20, 16, {}],
            ["uk", "QF 6Pdr Mk IV", 41, 24, 20, {}],
            ["uk", "QF 17-Pounder", 43, 48, 24, {}],
            ["usa", "37mm M3", 38, 7, 12, {}],
            ["usa", "57mm M1A2", 43, 20, 16, {}],
            ["usa", "75mm M1897", 40, 24, 20, {}],
            ["usa", "3inch M5", 43, 40, 24, {}],
            ["ussr", "45mm 19-K", 34, 12, 16, {}],
            ["ussr", "45mm 53-K", 37, 12, 16, {}],
            ["ussr", "45mm M-42", 42, 16, 16, {}],
            ["ussr", "57mm ZiS-2", 41, 24, 20, {}],
            ["ussr", "76mm F-22", 37, 32, 24, {}],
            ["ussr", "100mm BS-3", 44, 64, 30, {}],
          ].each do |unit|
            at = { t: "gun", i: "atgun", v: 1, s: 3 }
            unit.each_with_index do |v, i|
              at[key[i]] = v
            end
            at[:o].merge!({ t: 1, j: 3, p: 1, c: 1 })
            lu["#{at[:c]}_#{sanitize(at[:n])}".to_sym] = at
          end
          lu
        end

        def tanks
          lu = {}
          key = %i[c n y s f r v o]
          [
            ["ger", "PzKpfw I", 34, 3, 8, 8, 5, { r: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 } }],
            ["ger", "PzKpfw II-A/E", 37, 3, 3, 10, 6, { t: 1, p: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 } }],
            ["ger", "PzKpfw II-F", 41, 3, 3, 10, 5, { t: 1, p: 1, ha: { f: 3, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 } }],
            ["ger", "PzKpfw II Luchs", 43, 3, 4, 10, 5, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 2, s: 2, r: 2 } }],
            ["ger", "PzKpfw 35(t)", 38, 3, 8, 12, 5, { t: 1, p: 1, ha: { f: 2, s: 1, r: 1 }, ta: { f: 2, s: 1, r: 2 } }],
            ["ger", "PzKpfw 38(t) A/D", 39, 3, 8, 14, 5, { t: 1, p: 1, ha: { f: 2, s: 1, r: 1 }, ta: { f: 2, s: 1, r: 1 }, sn: 1 }],
            ["ger", "PzKpfw 38(t) E/G", 40, 3, 8, 14, 5, { t: 1, p: 1, ha: { f: 4, s: 1, r: 1 }, ta: { f: 4, s: 1, r: 1 }, sn: 1 }],
            ["ger", "PzKpfw III ('39)", 39, 4, 8, 14, 5, { t: 1, p: 1, ha: { f: 3, s: 3, r: 3 }, ta: { f: 3, s: 3, r: 3 } }],
            ["ger", "PzKpfw III ('40)", 40, 4, 16, 16, 5, { t: 1, p: 1, ha: { f: 3, s: 3, r: 3 }, ta: { f: 3, s: 3, r: 3 } }],
            ["ger", "PzKpfw III-J", 41, 4, 16, 16, 5, { t: 1, p: 1, ha: { f: 4, s: 4, r: 4 }, ta: { f: 4, s: 4, r: 4 } }],
            ["ger", "PzKpfw III-L", 41, 4, 24, 20, 5, { t: 1, p: 1, ha: { f: 4, s: 4, r: 4 }, ta: { f: 4, s: 4, r: 4 } }],
            ["ger", "PzKpfw III-N", 42, 4, 16, 16, 5, { t: 1, g: 1, ha: { f: 4, s: 4, r: 4 }, ta: { f: 4, s: 4, r: 4 } }],
            ["ger", "PzKpfw IV-A", 39, 4, 16, 16, 5, { t: 1, g: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 2, s: 1, r: 1 } }],
            ["ger", "PzKpfw IV-B/C", 39, 4, 16, 16, 6, { t: 1, g: 1, ha: { f: 3, s: 1, r: 1 }, ta: { f: 3, s: 1, r: 1 } }],
            ["ger", "PzKpfw IV-D", 39, 4, 16, 16, 5, { t: 1, g: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 3, s: 2, r: 2 } }],
            ["ger", "PzKpfw IV-E", 40, 4, 16, 16, 5, { t: 1, g: 1, ha: { f: 4, s: 3, r: 2 }, ta: { f: 3, s: 2, r: 2 } }],
            ["ger", "PzKpfw IV-F1", 41, 4, 16, 16, 5, { t: 1, g: 1, ha: { f: 4, s: 3, r: 2 }, ta: { f: 4, s: 3, r: 3 } }],
            ["ger", "PzKpfw IV-F2", 42, 4, 32, 20, 5, { t: 1, p: 1, ha: { f: 4, s: 3, r: 2 }, ta: { f: 4, s: 3, r: 3 } }],
            ["ger", "PzKpfw IV-G", 43, 4, 32, 20, 5, { t: 1, p: 1, ha: { f: 6, s: 3, r: 2 }, ta: { f: 4, s: 3, r: 3 } }],
            ["ger", "PzKpfw IV-H/J", 43, 5, 32, 24, 5, { t: 1, p: 1, ha: { f: 6, s: 3, r: 2 }, ta: { f: 4, s: 3, r: 3 } }],
            ["ger", "Panther D", 43, 6, 40, 32, 5, { t: 1, p: 1, ha: { f: 6, s: 3, r: 3 }, ta: { f: 7, s: 4, r: 4 }, bd: 3 }],
            ["ger", "Panther A/G", 43, 6, 40, 32, 6, { t: 1, p: 1, ha: { f: 6, s: 3, r: 3 }, ta: { f: 7, s: 4, r: 4 } }],
            ["ger", "Tiger I", 42, 7, 48, 32, 5, { t: 1, p: 1, ha: { f: 7, s: 4, r: 4 }, ta: { f: 8, s: 6, r: 6 }, bd: 3 }],
            ["ger", "Tiger II", 44, 8, 64, 32, 4, { t: 1, p: 1, ha: { f: 9, s: 6, r: 6 }, ta: { f: 9, s: 6, r: 6 }, bd: 4 }],
            ["ita", "L5/30", 30, 3, 10, 8, 4, { r: 1, ha: { f: 1, s: 1, r: 0 }, ta: { f: 1, s: 1, r: 1 } }],
            ["ita", "L6/40", 40, 3, 3, 12, 4, { t: 1, p: 1, ha: { f: 3, s: 1, r: 0 }, ta: { f: 3, s: 3, r: 3 } }],
            ["ita", "M11/39", 39, 3, 8, 12, 4, { t: 1, p: 1, ha: { f: 3, s: 1, r: 0 }, ta: { f: 3, s: 3, r: 3 } }],
            ["ita", "M13/40", 40, 3, 12, 14, 4, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 3, s: 3, r: 3 } }],
            ["ita", "M14/41", 41, 3, 12, 14, 4, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 3, s: 3, r: 3 } }],
            ["jap", "Type 94", 34, 3, 4, 8, 4, { r: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 0, r: 0 } }],
            ["jap", "Type 97 Te-Ke", 38, 3, 8, 12, 4, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 } }],
            ["jap", "Type 97 Te-Ke MG", 30, 3, 4, 8, 4, { r: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 }, sn: 2 }],
            ["jap", "Type 95 Ha-Go", 33, 3, 4, 12, 6, { t: 1, p: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 } }],
            ["jap", "Type 89 I-Go", 31, 3, 10, 12, 4, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 0, r: 0 } }],
            ["jap", "Type 97 Chi-Ha", 38, 3, 10, 12, 5, { t: 1, p: 1, ha: { f: 2, s: 1, r: 1 }, ta: { f: 2, s: 1, r: 1 }, sn: 1 }],
            ["jap", "Type 97 Kai", 39, 4, 16, 14, 4, { t: 1, p: 1, ha: { f: 2, s: 2, r: 2 }, ta: { f: 3, s: 2, r: 2 }, sn: 1 }],
            ["jap", "Type 2 Ka-Mi", 41, 3, 8, 14, 4, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 0, s: 0, r: 0 }, amp: 1 }],
            ["uk", "Light Tank Mk VI", 36, 3, 8, 12, 6, { r: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 }, sn: 1 }],
            ["uk", "Tetrarch", 38, 3, 10, 12, 7, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 } }],
            ["uk", "Cruiser Mk I", 38, 3, 10, 12, 5, { t: 1, p: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 }, bd: 3 }],
            ["uk", "Cruiser Mk II", 40, 3, 10, 12, 4, { t: 1, p: 1, ha: { f: 2, s: 2, r: 2 }, ta: { f: 2, s: 2, r: 2 } }],
            ["uk", "Cruiser Mk III", 40, 3, 10, 12, 7, { t: 1, p: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 }, bd: 3 }],
            ["uk", "Cruiser Mk IV", 40, 3, 10, 12, 7, { t: 1, p: 1, ha: { f: 2, s: 2, r: 2 }, ta: { f: 2, s: 2, r: 2 }, bd: 3 }],
            ["uk", "Crusader I", 41, 4, 10, 12, 6, { t: 1, p: 1, ha: { f: 3, s: 3, r: 3 }, ta: { f: 3, s: 3, r: 3 }, bd: 3 }],
            ["uk", "Crusader II", 41, 4, 10, 12, 6, { t: 1, p: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 4, s: 3, r: 3 }, bd: 3 }],
            ["uk", "Crusader III", 42, 4, 20, 16, 6, { t: 1, p: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 4, s: 3, r: 3 }, bd: 3 }],
            ["uk", "Centaur", 44, 5, 24, 16, 7, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 4, r: 4 } }],
            ["uk", "Cromwell", 44, 5, 24, 16, 7, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 4, r: 4 } }],
            ["uk", "Challenger", 44, 5, 48, 32, 6, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 5, s: 3, r: 3 } }],
            ["uk", "Comet", 44, 6, 40, 28, 6, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 7, s: 4, r: 4 } }],
            ["uk", "Matilda I", 38, 3, 8, 12, 3, { r: 1, ha: { f: 4, s: 2, r: 2 }, ta: { f: 4, s: 3, r: 3 } }],
            ["uk", "Matilda II", 39, 5, 10, 12, 4, { t: 1, p: 1, ha: { f: 6, s: 5, r: 4 }, ta: { f: 5, s: 5, r: 5 } }],
            ["ussr", "Matilda II", 41, 5, 10, 12, 4, { t: 1, p: 1, ha: { f: 6, s: 5, r: 4 }, ta: { f: 5, s: 5, r: 5 } }],
            ["uk", "Valentine I-VII", 40, 4, 10, 12, 5, { t: 1, p: 1, ha: { f: 5, s: 4, r: 4 }, ta: { f: 5, s: 4, r: 4 } }],
            ["uk", "Valentine IX-X", 43, 4, 20, 16, 5, { t: 1, p: 1, ha: { f: 5, s: 4, r: 4 }, ta: { f: 5, s: 4, r: 4 } }],
            ["ussr", "Valentine", 41, 4, 10, 12, 5, { t: 1, p: 1, ha: { f: 5, s: 4, r: 4 }, ta: { f: 5, s: 4, r: 4 } }],
            ["uk", "Churchill I-II", 41, 6, 10, 12, 4, { t: 1, p: 1, ha: { f: 7, s: 5, r: 4 }, ta: { f: 6, s: 5, r: 5 } }],
            ["uk", "Churchill III-IV", 42, 6, 20, 16, 4, { t: 1, p: 1, ha: { f: 7, s: 5, r: 4 }, ta: { f: 6, s: 5, r: 5 } }],
            ["uk", "Churchill V-VI", 43, 6, 24, 16, 4, { t: 1, p: 1, ha: { f: 7, s: 5, r: 4 }, ta: { f: 6, s: 5, r: 5 } }],
            ["uk", "Churchill VII-VIII", 44, 6, 24, 16, 4, { t: 1, p: 1, ha: { f: 9, s: 6, r: 4 }, ta: { f: 9, s: 6, r: 6 } }],
            ["ussr", "Churchill II", 41, 6, 10, 12, 4, { t: 1, p: 1, ha: { f: 7, s: 5, r: 4 }, ta: { f: 6, s: 5, r: 5 } }],
            ["ussr", "Churchill III", 42, 6, 20, 16, 4, { t: 1, p: 1, ha: { f: 7, s: 5, r: 4 }, ta: { f: 6, s: 5, r: 5 } }],
            ["usa", "M2A4", 35, 3, 6, 8, 7, { t: 1, p: 1, ha: { f: 2, s: 2, r: 2 }, ta: { f: 2, s: 2, r: 2 } }],
            ["usa", "M3 Stuart", 41, 3, 7, 10, 5, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 4, s: 3, r: 3 } }],
            ["usa", "M5 Stuart", 42, 3, 7, 10, 5, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 4, s: 3, r: 3 } }],
            ["uk", "M3 Stuart", 41, 3, 7, 10, 5, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 4, s: 3, r: 3 } }],
            ["ussr", "M3 Stuart", 41, 3, 7, 10, 5, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 4, s: 3, r: 3 }, bd: 4 }],
            ["uk", "M22 Locust", 42, 3, 7, 10, 7, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 0, r: 0 } }],
            ["usa", "M24 Chaffee", 44, 4, 24, 16, 5, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 3, s: 2, r: 2 } }],
            ["uk", "M24 Chaffee", 44, 4, 24, 16, 5, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 3, s: 2, r: 2 } }],
            ["usa", "M3 Lee", 41, 5, 7, 10, 5, { t: 1, p: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 4, s: 4, r: 4 }, sg: { f: 20, r: 12 } }],
            ["uk", "M3 Lee", 41, 5, 7, 10, 5, { t: 1, p: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 4, s: 4, r: 4 }, sg: { f: 20, r: 12 } }],
            ["uk", "M3 Grant", 41, 5, 7, 10, 5, { t: 1, p: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 4, s: 4, r: 4 }, sg: { f: 20, r: 12 } }],
            ["ussr", "M3 Grant", 41, 5, 7, 10, 5, { t: 1, p: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 4, s: 4, r: 4 }, bd: 4, sg: { f: 20, r: 12 } }],
            ["usa", "M4 Sherman", 42, 5, 24, 16, 5, { t: 1, p: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 5, s: 4, r: 4 } }],
            ["usa", "M4(76) Sherman", 43, 5, 40, 24, 5, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 }, sn: 1 }],
            ["usa", "M4A3E2 Sherman", 44, 6, 24, 16, 4, { t: 1, p: 1, ha: { f: 7, s: 5, r: 5 }, ta: { f: 9, s: 9, r: 9 }, sn: 2 }],
            ["usa", "M4A3E8 Sherman", 44, 6, 40, 24, 4, { t: 1, p: 1, ha: { f: 7, s: 5, r: 5 }, ta: { f: 9, s: 9, r: 9 }, sn: 2 }],
            # ["chi", "M4 Sherman", 43, 5, 24, 16, 5, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 } }],
            # ["fra", "M4 Sherman", 43, 5, 24, 16, 5, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 } }],
            ["uk", "M4 Sherman", 42, 5, 24, 16, 5, { t: 1, p: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 5, s: 4, r: 4 } }],
            ["uk", "M4(76) Sherman", 43, 5, 40, 24, 5, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 }, sn: 1 }],
            ["uk", "Sherman Firefly", 43, 5, 40, 24, 5, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 } }],
            ["ussr", "M4 Sherman", 43, 5, 24, 16, 5, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 } }],
            ["ussr", "M4(76) Sherman", 44, 5, 40, 24, 5, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 }, sn: 1 }],
            ["usa", "M26 Pershing", 44, 6, 48, 32, 5, { t: 1, p: 1, ha: { f: 5, s: 5, r: 5 }, ta: { f: 7, s: 5, r: 5 } }],
            ["ussr", "BT-5", 32, 3, 12, 16, 9, { t: 1, p: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 } }],
            ["ussr", "BT-7", 35, 3, 12, 16, 9, { t: 1, p: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 } }],
            ["ussr", "T-26 M38", 38, 3, 12, 16, 4, { t: 1, p: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 } }],
            ["ussr", "T-26 M39", 39, 3, 12, 16, 4, { t: 1, p: 1, ha: { f: 2, s: 1, r: 1 }, ta: { f: 2, s: 1, r: 1 } }],
            ["ussr", "T-70", 42, 3, 12, 16, 5, { t: 1, p: 1, ha: { f: 3, s: 3, r: 3 }, ta: { f: 4, s: 3, r: 3 } }],
            ["ussr", "T-34 M40", 40, 5, 24, 22, 6, { t: 1, p: 1, ha: { f: 3, s: 3, r: 3 }, ta: { f: 3, s: 3, r: 3 } }],
            ["ussr", "T-34 M41", 41, 5, 32, 24, 6, { t: 1, p: 1, ha: { f: 3, s: 3, r: 3 }, ta: { f: 4, s: 4, r: 3 } }],
            ["ussr", "T-34 M42/M43", 42, 5, 32, 24, 6, { t: 1, p: 1, ha: { f: 3, s: 3, r: 3 }, ta: { f: 6, s: 4, r: 3 } }],
            ["ussr", "T-34-85", 43, 5, 48, 28, 6, { t: 1, p: 1, ha: { f: 3, s: 3, r: 3 }, ta: { f: 6, s: 4, r: 3 } }],
            ["ussr", "T-34-85 M44", 44, 5, 48, 28, 6, { t: 1, p: 1, ha: { f: 3, s: 3, r: 3 }, ta: { f: 8, s: 4, r: 3 } }],
            ["ussr", "KV-1 M39", 39, 6, 24, 22, 5, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 4, s: 3, r: 3 }, bd: 4 }],
            ["ussr", "KV-1 M40", 40, 6, 24, 22, 5, { t: 1, p: 1, ha: { f: 5, s: 4, r: 4 }, ta: { f: 6, s: 4, r: 4 }, bd: 3 }],
            ["ussr", "KV-1 M41", 41, 6, 24, 22, 5, { t: 1, p: 1, ha: { f: 6, s: 4, r: 4 }, ta: { f: 6, s: 4, r: 4 }, bd: 3 }],
            ["ussr", "KV-1 M42", 42, 6, 32, 24, 5, { t: 1, p: 1, ha: { f: 8, s: 5, r: 5 }, ta: { f: 8, s: 5, r: 5 }, bd: 3 }],
            ["ussr", "KV-1S", 42, 6, 32, 24, 5, { t: 1, p: 1, ha: { f: 6, s: 4, r: 4 }, ta: { f: 6, s: 4, r: 4 } }],
            ["ussr", "KV-2", 40, 7, 64, 32, 4, { t: 1, g: 1, ha: { f: 7, s: 4, r: 4 }, ta: { f: 7, s: 4, r: 4 }, bd: 3 }],
            ["ussr", "KV-85", 43, 6, 48, 28, 5, { t: 1, p: 1, ha: { f: 7, s: 4, r: 4 }, ta: { f: 7, s: 4, r: 4 } }],
            ["ussr", "IS-2", 44, 6, 96, 32, 5, { t: 1, p: 1, ha: { f: 7, s: 6, r: 6 }, ta: { f: 8, s: 6, r: 6 } }],
          ].each do |unit|
            tank = { t: "tank", i: "tank" }
            unit.each_with_index do |v, i|
              tank[key[i]] = v
            end
            tank[:i] = "tank-amp" if tank[:o][:amp]
            tank[:o].merge!({ j: 3, u: 1, k: 1 })
            lu["#{tank[:c]}_#{sanitize(tank[:n])}".to_sym] = tank
          end
          lu
        end

        def sp_guns # rubocop:disable Metrics/PerceivedComplexity
          lu = {}
          key = %i[c n y s f r v o]
          [
            ["ger", "PzKpfw II Flamm", 40, 3, 24, 1, 6, { i: 1, ha: { f: 3, s: 1, r: 1 } }],
            ["ger", "StuG III-A", 40, 4, 16, 16, 5, { t: 1, g: 1, ha: { f: 4, s: 1, r: 1 }, bd: 3 }],
            ["ger", "StuG III-B/E", 40, 4, 16, 16, 5, { t: 1, g: 1, ha: { f: 4, s: 1, r: 1 } }],
            ["ger", "StuG III-F/G", 42, 4, 32, 24, 5, { t: 1, p: 1, ha: { f: 6, s: 1, r: 1 } }],
            ["ger", "StuH 42", 42, 4, 32, 24, 5, { t: 1, g: 1, ha: { f: 6, s: 1, r: 1 } }],
            ["ger", "StuG IV", 43, 4, 32, 24, 5, { t: 1, p: 1, ha: { f: 6, s: 1, r: 1 } }],
            ["ger", "SdKfz 166", 42, 5, 64, 20, 4, { t: 1, g: 1, ha: { f: 7, s: 1, r: 1 } }],
            ["ger", "Panzerjäger I", 40, 3, 12, 16, 6, { t: 1, p: 1, ha: { f: 1, s: 1, r: -1 } }],
            ["ger", "Marder I", 42, 3, 32, 24, 4, { t: 1, p: 1, ha: { f: 1, s: 1, r: -1 } }],
            ["ger", "Marder II", 42, 3, 32, 24, 5, { t: 1, p: 1, ha: { f: 3, s: 1, r: -1 } }],
            ["ger", "Marder III", 42, 3, 16, 16, 5, { t: 1, g: 1, ha: { f: 4, s: 1, r: -1 } }],
            ["ger", "Marder III-H/M", 43, 3, 32, 24, 5, { t: 1, p: 1, ha: { f: 4, s: 1, r: -1 } }],
            ["ger", "Nashorn", 42, 5, 64, 32, 5, { t: 1, p: 1, ha: { f: 3, s: 1, r: -1 } }],
            ["ger", "Elefant", 42, 8, 64, 32, 4, { t: 1, p: 1, ha: { f: 9, s: 3, r: 3 } }],
            ["ger", "Jagdpanzer IV", 43, 5, 40, 32, 5, { t: 1, p: 1, ha: { f: 6, s: 3, r: 2 } }],
            ["ger", "Hetzer", 44, 4, 40, 32, 4, { t: 1, p: 1, ha: { f: 4, s: 2, r: 2 } }],
            ["ger", "Jagdpanther", 44, 6, 64, 32, 6, { t: 1, p: 1, ha: { f: 6, s: 4, r: 3 } }],
            ["ger", "Jagdtiger", 44, 8, 96, 40, 4, { t: 1, p: 1, ha: { f: 9, s: 6, r: 6 } }],
            ["ita", "L3/33", 33, 3, 3, 6, 6, { r: 1, ha: { f: 1, s: 1, r: -1 } }],
            ["ita", "L3/35", 35, 3, 10, 8, 6, { r: 1, ha: { f: 1, s: 1, r: -1 } }],
            ["ita", "L3/38", 38, 3, 10, 10, 6, { r: 1, ha: { f: 1, s: 1, r: -1 } }],
            ["ita", "Sv da 47/32", 42, 3, 12, 14, 4, { t: 1, p: 1, ha: { f: 3, s: 1, r: 1 } }],
            ["ita", "Sv da 75/18", 42, 3, 16, 14, 5, { t: 1, g: 1, ha: { f: 3, s: 2, r: 2 } }],
            ["jap", "Type 97 Chi-Ha FT", 41, 3, 24, 1, 5, { i: 1, ha: { f: 2, s: 1, r: 1 }, sn: 3 }],
            ["jap", "Type 1 Ho-Ni I", 42, 4, 16, 16, 5, { t: 1, g: 1, ha: { f: 2, s: 2, r: -1 } }],
            ["jap", "Type 1 Ho-Ni II", 43, 4, 32, 20, 5, { t: 1, g: 1, ha: { f: 2, s: 2, r: -1 } }],
            ["jap", "Type 1 Ho-Ni III", 44, 4, 32, 20, 4, { t: 1, p: 1, ha: { f: 2, s: 2, r: 1 } }],
            ["uk", "Cruiser Mk I CS", 38, 3, 24, 16, 5, { t: 1, g: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 }, bd: 3, s: 1 }],
            ["uk", "Cruiser Mk II CS", 40, 3, 24, 16, 4, { t: 1, g: 1, ha: { f: 2, s: 2, r: 2 }, ta: { f: 2, s: 2, r: 2 }, s: 1 }],
            ["uk", "Crusader I CS", 41, 4, 16, 12, 6, { t: 1, g: 1, ha: { f: 4, s: 4, r: 4 }, ta: { f: 4, s: 4, r: 4 }, bd: 3, s: 1 }],
            ["uk", "Crusader II CS", 42, 4, 16, 12, 6, { t: 1, g: 1, ha: { f: 4, s: 4, r: 4 }, ta: { f: 4, s: 4, r: 4 }, bd: 3, s: 1 }],
            ["uk", "Matilda II CS", 39, 5, 16, 12, 4, { t: 1, g: 1, ha: { f: 6, s: 5, r: 4 }, ta: { f: 5, s: 5, r: 5 }, bd: 3, s: 1 }],
            ["uk", "Matilda Frog", 44, 5, 24, 1, 4, { i: 1, ha: { f: 6, s: 5, r: 4 }, ta: { f: 5, s: 5, r: 5 } }],
            ["uk", "Valentine III CS", 40, 4, 16, 12, 5, { t: 1, g: 1, ha: { f: 5, s: 4, r: 4 }, ta: { f: 5, s: 4, r: 4 }, s: 1 }],
            ["uk", "Churchill Crocodile", 44, 6, 24, 16, 4, { t: 1, p: 1, ha: { f: 9, s: 6, r: 4 }, ta: { f: 9, s: 6, r: 6 }, sn: 3, sg: { f: "F24", r: 1 } }],
            ["usa", "M3A1 Stuart FT", 44, 3, 24, 1, 5, { i: 1, ha: { f: 4, s: 3, r: 3 } }],
            ["usa", "M4A3R5 Sherman", 44, 5, 24, 1, 5, { i: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 }, sn: 2 }],
            ["usa", "M10", 42, 5, 32, 20, 5, { t: 1, p: 1, ha: { f: 4, s: 2, r: 2 }, ta: { f: 4, s: 2, r: 2 } }],
            ["usa", "M10A1", 43, 5, 32, 20, 6, { t: 1, p: 1, ha: { f: 4, s: 2, r: 2 }, ta: { f: 4, s: 2, r: 2 } }],
            ["usa", "M18 Hellcat", 43, 4, 40, 24, 7, { t: 1, p: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 2, s: 1, r: 1 } }],
            ["usa", "M36", 44, 5, 48, 32, 5, { t: 1, p: 1, ha: { f: 4, s: 2, r: 2 }, ta: { f: 5, s: 3, r: 3 } }],
            # ["fra", "M10", 43, 5, 32, 20, 5, { t: 1, p: 1, ha: { f: 4, s: 2, r: 2 }, ta: { f: 4, s: 2, r: 2 } }],
            ["uk", "M10 Achilles", 42, 5, 32, 20, 5, { t: 1, p: 1, ha: { f: 4, s: 2, r: 2 }, ta: { f: 4, s: 2, r: 2 } }],
            ["uk", "M10 Achilles C", 43, 5, 40, 24, 5, { t: 1, p: 1, ha: { f: 4, s: 2, r: 2 }, ta: { f: 4, s: 2, r: 2 } }],
            ["ussr", "SU-76", 42, 3, 16, 22, 5, { t: 1, g: 1, ha: { f: 3, s: 1, r: 1 }, bd: 4 }],
            ["ussr", "SU-76M", 42, 3, 16, 22, 5, { t: 1, g: 1, ha: { f: 3, s: 1, r: -1 } }],
            ["ussr", "SU-85", 43, 5, 48, 28, 6, { t: 1, p: 1, ha: { f: 3, s: 3, r: 3 } }],
            ["ussr", "SU-100", 44, 5, 80, 30, 6, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 } }],
            ["ussr", "SU-122", 42, 5, 40, 30, 6, { t: 1, g: 1, ha: { f: 3, s: 3, r: 3 } }],
            ["ussr", "SU-152", 43, 6, 64, 32, 5, { t: 1, g: 1, ha: { f: 5, s: 4, r: 3 } }],
            ["ussr", "ISU-122", 44, 6, 96, 32, 5, { t: 1, p: 1, ha: { f: 8, s: 6, r: 6 } }],
            ["ussr", "ISU-152", 43, 7, 64, 32, 5, { t: 1, g: 1, ha: { f: 8, s: 6, r: 6 } }],
          ].each do |unit|
            spg = { t: "spg" }
            unit.each_with_index do |v, i|
              spg[key[i]] = v
            end
            spg[:i] = "spg" if spg[:o][:g]
            spg[:i] = "spgmg" if spg[:o][:r]
            spg[:i] = "spat" if spg[:o][:p]
            spg[:i] = "spft" if spg[:o][:i] || spg[:o][:sg]
            spg[:o][:u] = 1 if spg[:o][:ta]
            spg[:o].merge!({ j: 3, k: 1 })
            lu["#{spg[:c]}_#{sanitize(spg[:n])}".to_sym] = spg
          end
          lu
        end

        def half_tracks
          lu = {}
          key = %i[c n y s f r v o]
          [
            ["ger", "SdKfz 250/1", 41, 3, 8, 8, 6, { r: 1, ha: { f: 1, s: 0, r: 0 } }],
            ["ger", "SdKfz 250/7", 41, 3, 20, 16, 6, { t: 1, m: 3, ha: { f: 1, s: 0, r: 0 } }],
            ["ger", "SdKfz 250/8", 41, 3, 16, 16, 6, { t: 1, g: 1, ha: { f: 1, s: 0, r: 0 } }],
            ["ger", "SdKfz 250/9", 41, 3, 4, 10, 6, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 } }],
            ["ger", "SdKfz 250/10", 41, 3, 8, 16, 6, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 } }],
            ["ger", "SdKfz 250/11", 41, 3, 8, 10, 6, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 } }],
            ["ger", "SdKfz 251/1", 39, 3, 8, 8, 5, { r: 1, ha: { f: 1, s: 0, r: 0 } }],
            ["ger", "SdKfz 251/9", 39, 3, 16, 16, 5, { t: 1, g: 1, ha: { f: 1, s: 0, r: 0 } }],
            ["ger", "SdKfz 251/10", 39, 3, 8, 16, 5, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 } }],
            ["ger", "SdKfz 251/16", 39, 3, 24, 1, 5, { i: 1, ha: { f: 1, s: 0, r: 0 } }],
            ["jap", "Type 98 So-Da", 41, 3, 0, 0, 5, { r: 1, ha: { f: 1, s: 1, r: 1 } }],
            ["jap", "Type 100 Te-Re", 40, 3, 0, 0, 5, { r: 1, ha: { f: 0, s: 0, r: 0 } }],
            ["jap", "Type 1 Ho-Ga", 44, 3, 4, 8, 6, { r: 1, ha: { f: 0, s: 0, r: 0 } }],
            ["uk", "Loyd Carrier", 39, 3, 0, 0, 6, { r: 1, ha: { f: 0, s: 0, r: 0 } }],
            ["uk", "Universal Carrier", 40, 3, 3, 6, 7, { r: 1, ha: { f: 0, s: 0, r: 0 }, sn: 1 }],
            ["uk", "U Carrier 2Pdr", 41, 3, 10, 12, 7, { t: 1, p: 1, ha: { f: 0, s: 0, r: 0 } }],
            ["uk", "U Carrier 6Pdr", 41, 3, 20, 16, 7, { t: 1, p: 1, ha: { f: 0, s: 0, r: 0 } }],
            ["uk", "U Carrier Wasp", 41, 3, 24, 1, 7, { i: 1, ha: { f: 0, s: 0, r: 0 } }],
            ["usa", "M2 Half-track", 41, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0 } }],
            ["usa", "M3 Half-track", 41, 3, 6, 8, 6, { r: 1, ha: { f: 1, s: 1, r: 0 } }],
            ["usa", "M3A1 Half-track", 42, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0 } }],
            ["uk", "M5 Half-track", 42, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0 } }],
            ["ussr", "M5 Half-track", 42, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0 } }],
            # ["chi", "M5 Half-track", 42, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0 } }],
            ["ussr", "M9 Half-track", 41, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0 } }],
            # ["fra", "M9 Half-track", 41, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0 } }],
            ["usa", "T48 GMC", 42, 3, 7, 10, 6, { t: 1, p: 1, ha: { f: 1, s: 1, r: 0 } }],
            ["usa", "T19/M21 MMC", 42, 3, 20, 20, 6, { t: 1, m: 3, ha: { f: 1, s: 1, r: 0 } }],
          ].each do |unit|
            ht = { t: "ht", i: "ht" }
            unit.each_with_index do |v, i|
              ht[key[i]] = v
            end
            ht[:i] = "htgun" if ht[:o][:g]
            ht[:i] = "htat" if ht[:o][:p]
            ht[:i] = "htmtr" if ht[:o][:m]
            ht[:i] = "htft" if ht[:o][:i]
            ht[:o].merge!({ k: 1 })
            ht[:o][:m] ? ht[:o].merge!({ b: 3 }) : ht[:o].merge!({ j: 3 })
            lu["#{ht[:c]}_#{sanitize(ht[:n])}".to_sym] = ht
          end
          lu
        end

        def armored_cars
          lu = {}
          key = %i[c n y s f r v o]
          [
            ["ger", "SdKfz 221", 35, 3, 8, 8, 7, { r: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 } }],
            ["ger", "SdKfz 222", 37, 3, 3, 10, 7, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 } }],
            ["ger", "SdKfz 234/1", 43, 3, 4, 10, 6, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 2, s: 0, r: 0 } }],
            ["ger", "SdKfz 234/2", 43, 3, 24, 10, 6, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 3, s: 0, r: 0 } }],
            ["ger", "SdKfz 234/3", 44, 3, 16, 16, 6, { t: 1, g: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 3, s: 0, r: 0 } }],
            ["ger", "SdKfz 234/4", 44, 3, 32, 24, 6, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 3, s: 0, r: 0 } }],
            ["ita", "Autoblindo 41", 41, 3, 3, 12, 5, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 } }],
            ["jap", "Chiyoda AC", 31, 3, 4, 8, 5, { r: 1, ha: { f: 0, s: 0, r: 0 }, ta: { f: 0, s: 0, r: 0 } }],
            ["jap", "Sumida Type 91", 33, 3, 4, 8, 3, { r: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 0, s: 0, r: 0 } }],
            ["uk", "AEC AC I", 41, 3, 10, 12, 4, { t: 1, p: 1, ha: { f: 2, s: 2, r: 2 }, ta: { f: 5, s: 4, r: 4 } }],
            ["uk", "AEC AC II", 42, 3, 20, 16, 5, { t: 1, p: 1, ha: { f: 2, s: 2, r: 2 }, ta: { f: 2, s: 2, r: 2 } }],
            ["uk", "AEC AC II CS", 42, 3, 16, 12, 5, { t: 1, g: 1, ha: { f: 2, s: 2, r: 2 }, ta: { f: 2, s: 2, r: 2 } }],
            ["uk", "Daimler AC", 41, 3, 10, 12, 5, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 } }],
            ["uk", "Daimler AC CS", 41, 3, 16, 12, 5, { t: 1, g: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 } }],
            ["uk", "Humber AC I", 40, 3, 32, 15, 5, { r: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 } }],
            ["uk", "Humber AC IV", 42, 3, 24, 16, 5, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 } }],
            ["uk", "T17E1 Staghound", 44, 3, 24, 16, 5, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 3, s: 1, r: 1 }, sn: 1 }],
            ["uk", "Humber LRC", 40, 3, 2, 8, 8, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 0, s: 0, r: 0 } }],
            ["usa", "M3A1 Scout Car", 39, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 1 } }],
            ["usa", "M8 Greyhound", 43, 3, 7, 10, 5, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 2, s: 2, r: 2 }, bd: 3 }],
            ["usa", "M20 Greyhound", 43, 3, 10, 12, 5, { r: 1, ha: { f: 1, s: 0, r: 0 } }],
            # ["chi", "M3A1 Scout Car", 39, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 1 } }],
            # ["fra", "M8 Greyhound", 43, 3, 7, 10, 5, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 2, s: 2, r: 2 }, bd: 3 }],
            ["uk", "M3A1 Scout Car", 39, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 1 } }],
            ["uk", "M8 Greyhound", 43, 3, 7, 10, 5, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 2, s: 2, r: 2 }, bd: 3 }],
            ["ussr", "M3A1 Scout Car", 39, 3, 10, 15, 6, { r: 1, ha: { f: 1, s: 1, r: 0 } }],
            ["ussr", "BA-10", 38, 3, 12, 16, 4, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 }, bd: 3 }],
            ["ussr", "BA-20", 36, 3, 4, 6, 6, { r: 1, ha: { f: 0, s: 0, r: 0 }, ta: { f: 0, s: 0, r: 0 } }],
            ["ussr", "BA-64", 42, 3, 4, 6, 7, { r: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 0, s: 0, r: 0 } }],
          ].each do |unit|
            ac = { t: "ac", i: "ac" }
            unit.each_with_index do |v, i|
              ac[key[i]] = v
            end
            ac[:o].merge!({ j: 3, u: 1, w: 1 })
            lu["#{ac[:c]}_#{sanitize(ac[:n])}".to_sym] = ac
          end
          lu
        end

        # rubocop:enable Metric/MethodLength, Metric/AbcSize, Metric/CyclomaticComplexity
        # -rubocop:enable Metric/PerceivedComplexity
        # rubocop:enable Metric/LineLength
      end
    end
  end
end
