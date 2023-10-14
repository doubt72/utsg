# frozen_string_literal: true

module Utility
  module Scenarios
    module Units
      class << self # rubocop:disable Metric/ClassLength
        # rubocop:disable Metric/MethodLength, Metric/AbcSize, Metric/CyclomaticComplexity
        # -rubocop:disable Metric/PerceivedComplexity
        def lookup_data
          leaders.merge(infantry).merge(machine_guns).merge(mortars).merge(radios)
                 .merge(support_weapons).merge(infantry_guns).merge(at_guns)
                 .merge(tanks).merge(assault_guns).merge(armored_cars).merge(half_tracks)
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
          sanitized = name.gsub(%r{[-\s/.']}, "_").gsub(/['()]/, "").downcase
          sanitized = sanitized.gsub("ä", "a").gsub("ö", "o").gsub("ü", "u").downcase
          puts sanitized unless sanitized =~ /^[a-z0-9_]*$/
          sanitized
        end

        def leaders
          # Currently 6-2, 5-2, 6-1, 5-1, 4-1, 3-1
          i = "leader"
          y = 0
          s = f = r = 1
          lu = {}
          %w[ger ita jap fin rom uk usa ussr fra chi pol gre nor phi net].each do |nation|
            [6, 5, 4, 3].each do |m|
              [2, 1].each do |l|
                next if l == 2 && m < 5
                next if l != 2 || m != 6 # TODO: remove after finishing units

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
            ["ger", "Pionier", 0, 4, 9, 2, 5, { a: 1, s: 1 }],
            ["ger", "SS", 34, 4, 8, 5, 5, { a: 1, s: 1 }],
            ["ger", "Fallschirmjäger", 35, 4, 7, 4, 5, { a: 1, s: 1 }],
            ["ger", "Sturm", 0, 4, 8, 4, 5, { a: 1, s: 1 }],
            ["ger", "Rifle", 0, 3, 7, 5, 4, { s: 1 }],
            ["ger", "Volksgrenadier", 44, 3, 7, 4, 4, {}],
            ["ger", "Conscript", 0, 2, 6, 3, 3, {}],
            ["usa", "Engineer", 0, 4, 9, 3, 5, { a: 1, s: 1 }],
            ["usa", "Paratroop", 43, 4, 8, 4, 5, { a: 1, s: 1 }],
            ["usa", "Ranger", 42, 4, 8, 4, 5, { a: 1, s: 1 }],
            ["usa", "Veteran", 0, 4, 7, 6, 4, { s: 1 }],
            ["usa", "Rifle", 0, 3, 7, 6, 4, { s: 1 }],
            ["usa", "Garrison", 0, 2, 6, 4, 3, {}],
            ["usa", "Green", 0, 2, 6, 4, 3, {}],
            ["usa", "Marine Rifle", 0, 4, 7, 6, 5, { a: 1 }],
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
          %w[ger usa ussr].each do |c|
            t = "tm"
            lu["#{c}_elite_crew_t"] = {
              c:, t:, n: "Crew", i: "crew", y: 30, m: 4, s: 3, f: 1, r: 1, v: 5, o: { cw: 2 },
            }
            lu["#{c}_crew_t"] = {
              c:, t:, n: "Crew", i: "crew", y: 30, m: 3, s: 3, f: 1, r: 1, v: 4, o: { cw: 1 },
            }
          end
          lu
        end

        def machine_guns
          lu = {}
          key = %i[c n y f r v o]
          [
            ["ger", "MG 34", 36, 5, 8, 0, { a: 1, r: 1, j: 3 }],
            ["ger", "MG 44", 42, 8, 8, 0, { a: 1, r: 1, j: 3 }],
            ["ger", "MG 08/15", 17, 10, 12, -1, { r: 1, j: 3 }],
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
            mortar[:o].merge!({ t: 1, b: 3 })
            mortar[:s] = 3 if mortar[:o][:c]
            lu["#{mortar[:c]}_#{sanitize(mortar[:n])}".to_sym] = mortar
          end
          lu
        end

        def radios
          lu = {}
          key = %i[c n y f]
          [
            ["ger", "Radio 10.5cm", 35, 32],
            ["ger", "Radio 15cm", 34, 64],
            ["ger", "Radio 17cm", 41, 80],
            ["ger", "Radio 21cm", 39, 96],
            ["usa", "Radio 75mm", 32, 16],
            ["usa", "Radio 105mm", 41, 32],
            ["usa", "Radio 155mm", 42, 64],
            ["usa", "Radio 8inch", 42, 96],
            ["ussr", "Radio 76mm", 37, 16],
            ["ussr", "Radio 85mm", 43, 20],
            ["ussr", "Radio 122mm", 39, 40],
            ["ussr", "Radio 152mm", 37, 64],
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
            ["usa", "M1 Bazooka", 42, 8, 4, 0, { b: 5 }],
            ["usa", "M1A1 Bazooka", 43, 10, 4, 0, { b: 4 }],
            ["usa", "M9 Bazooka", 43, 12, 3, 0, { b: 4 }],
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
            lu["#{c}_mc"] = { c:, t:, n:, i:, f: 4, r: 1, v: 0, o: { a: 1, x: 1, t: 1 } }
          end
          lu
        end

        def infantry_guns
          lu = {}
          key = %i[c n y f r o]
          [
            ["ger", "7.5cm leIG 18", 32, 16, 14, {}],
            ["ger", "15cm sIG 33", 36, 64, 18, {}],
            ["usa", "75mm M1 Pack", 27, 16, 16, {}],
            ["ussr", "76mm M1927", 28, 16, 16, {}],
          ].each do |unit|
            gun = { t: "gun", i: "gun" }
            unit.each_with_index do |v, i|
              gun[key[i]] = v
            end
            gun.merge!({ v: 1 })
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
            ["ger", "7.5cm Pak 97/38", 42, 24, 20, {}],
            ["ger", "7.5cm Pak 40", 42, 32, 24, {}],
            ["ger", "8.8cm Pak 43/41", 43, 64, 32, {}],
            ["ger", "8.8cm Pak 43", 43, 64, 32, { y: 1 }],
            ["ger", "12.8cm Pak 44", 44, 96, 40, { y: 1 }],
            ["ger", "8.8cm Flak 36", 36, 48, 30, { y: 1 }],
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
            at = { t: "gun", i: "atgun", s: 3 }
            unit.each_with_index do |v, i|
              at[key[i]] = v
            end
            at.merge!({ v: 1 })
            at[:o].merge!({ t: 1, j: 3, p: 1, c: 1 })
            lu["#{at[:c]}_#{sanitize(at[:n])}".to_sym] = at
          end
          lu
        end

        def tanks
          lu = {}
          key = %i[c n y s f r v o]
          [
            ["chi", "M4A4 Sherman", 43, 5, 24, 16, 5, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 } }],
            ["fra", "M4A4 Sherman", 43, 5, 24, 16, 5, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 } }],
            ["ger", "PzKpfw I", 34, 3, 6, 8, 5, { r: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 } }],
            ["ger", "PzKpfw II-A/E", 37, 3, 3, 10, 6, { t: 1, p: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 } }],
            ["ger", "PzKpfw II-F", 41, 3, 3, 10, 5, { t: 1, p: 1, ha: { f: 3, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 } }],
            ["ger", "PzKpfw II Luchs", 43, 3, 4, 10, 5, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 2, s: 2, r: 2 } }],
            ["ger", "PzKpfw 35(t)", 38, 3, 8, 12, 5, { t: 1, p: 1, ha: { f: 2, s: 1, r: 1 }, ta: { f: 2, s: 1, r: 2 } }],
            ["ger", "PzKpfw 38(t)-A/D", 39, 3, 8, 14, 5, { sn: 1, t: 1, p: 1, ha: { f: 2, s: 1, r: 1 }, ta: { f: 2, s: 1, r: 1 } }],
            ["ger", "PzKpfw 38(t)-E/G", 40, 3, 8, 14, 5, { sn: 1, t: 1, p: 1, ha: { f: 4, s: 1, r: 1 }, ta: { f: 4, s: 1, r: 1 } }],
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
            ["uk", "M3 Stuart I", 41, 3, 7, 10, 5, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 4, s: 3, r: 3 } }],
            ["uk", "M22 Locust", 42, 3, 7, 10, 7, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 0, r: 0 } }],
            ["uk", "M24 Chaffee", 44, 4, 24, 16, 5, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 3, s: 2, r: 2 } }],
            ["uk", "M3 Lee I", 41, 5, 7, 10, 5, { t: 1, p: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 4, s: 4, r: 4 }, sg: { f: 24, r: 12 } }],
            ["uk", "M3 Grant I", 41, 5, 7, 10, 5, { t: 1, p: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 4, s: 4, r: 4 }, sg: { f: 24, r: 12 } }],
            ["uk", "M4 Sherman I", 42, 5, 24, 16, 5, { t: 1, p: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 5, s: 4, r: 4 } }],
            ["uk", "M4 Sherman IIA", 43, 5, 40, 24, 5, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 } }],
            ["uk", "Sherman Firefly", 43, 5, 40, 24, 5, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 } }],
            ["usa", "M2A4", 35, 3, 6, 8, 7, { t: 1, p: 1, ha: { f: 2, s: 2, r: 2 }, ta: { f: 2, s: 2, r: 2 } }],
            ["usa", "M3 Stuart", 41, 3, 7, 10, 5, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 4, s: 3, r: 3 } }],
            ["usa", "M5 Stuart", 42, 3, 7, 10, 5, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 4, s: 3, r: 3 } }],
            ["usa", "M24 Chaffee", 44, 4, 24, 16, 5, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 3, s: 2, r: 2 } }],
            ["usa", "M3 Lee", 41, 5, 7, 10, 5, { t: 1, p: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 4, s: 4, r: 4 }, sg: { f: 24, r: 12 } }],
            ["usa", "M4 Sherman", 42, 5, 24, 16, 5, { t: 1, p: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 5, s: 4, r: 4 } }],
            ["usa", "M4(76) Sherman", 43, 5, 40, 24, 5, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 }, sn: 1 }],
            ["usa", "M4A3E2 Sherman", 44, 6, 24, 16, 4, { t: 1, p: 1, ha: { f: 7, s: 5, r: 5 }, ta: { f: 9, s: 9, r: 9 }, sn: 2 }],
            ["usa", "M4A3E8 Sherman", 44, 6, 40, 24, 4, { t: 1, p: 1, ha: { f: 7, s: 5, r: 5 }, ta: { f: 9, s: 9, r: 9 }, sn: 2 }],
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
            ["ussr", "M3 Stuart", 41, 3, 7, 10, 5, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 4, s: 3, r: 3 }, bd: 4 }],
            ["ussr", "M3 Grant", 41, 5, 7, 10, 5, { t: 1, p: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 4, s: 4, r: 4 }, bd: 4, sg: { f: 24, r: 12 } }],
            ["ussr", "M4A2 Sherman", 43, 5, 24, 16, 5, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 } }],
            ["ussr", "M4A2(76) Sherman", 44, 5, 40, 24, 5, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 }, sn: 3 }],
          ].each do |unit|
            tank = { t: "tank", i: "tank" }
            unit.each_with_index do |v, i|
              tank[key[i]] = v
            end
            tank[:o].merge!({ j: 3, u: 3, k: 1 })
            lu["#{tank[:c]}_#{sanitize(tank[:n])}".to_sym] = tank
          end
          lu
        end

        def assault_guns
          lu = {}
          key = %i[c n y s f r v o]
          [
            ["fra", "M10", 43, 5, 32, 20, 5, { t: 1, p: 1, ha: { f: 4, s: 2, r: 2 }, ta: { f: 4, s: 2, r: 2 } }],
            ["ger", "PzKpfw II Flamm", 37, 3, 24, 1, 6, { i: 1, ha: { f: 3, s: 1, r: 1 } }],
            ["ger", "StuG III-A", 40, 4, 16, 16, 5, { t: 1, g: 1, ha: { f: 4, s: 1, r: 1 }, bd: 3 }],
            ["ger", "StuG III-B/E", 40, 4, 16, 16, 5, { t: 1, g: 1, ha: { f: 4, s: 1, r: 1 } }],
            ["ger", "StuG III-F/G", 42, 4, 32, 24, 5, { t: 1, p: 1, ha: { f: 6, s: 1, r: 1 } }],
            ["ger", "StuH 42", 42, 4, 32, 24, 5, { t: 1, g: 1, ha: { f: 6, s: 1, r: 1 } }],
            ["ger", "StuG IV", 43, 4, 32, 24, 5, { t: 1, p: 1, ha: { f: 6, s: 1, r: 1 } }],
            ["ger", "SdKfz 166", 42, 5, 64, 20, 4, { t: 1, g: 1, ha: { f: 7, s: 1, r: 1 } }],
            ["ger", "Panzerjäger I", 40, 3, 12, 16, 6, { t: 1, p: 1, ha: { f: 1, s: 1, r: 1 } }],
            ["ger", "Marder I", 42, 3, 32, 24, 4, { t: 1, p: 1, ha: { f: 1, s: 1, r: 1 } }],
            ["ger", "Marder II", 42, 3, 32, 24, 5, { t: 1, p: 1, ha: { f: 3, s: 1, r: 1 } }],
            ["ger", "Marder III", 42, 3, 16, 16, 5, { t: 1, g: 1, ha: { f: 4, s: 1, r: 0 } }],
            ["ger", "Marder III-H/M", 43, 3, 32, 24, 5, { t: 1, p: 1, ha: { f: 4, s: 1, r: 0 } }],
            ["ger", "Nashorn", 42, 5, 64, 32, 5, { t: 1, p: 1, ha: { f: 3, s: 1, r: 1 } }],
            ["ger", "Elefant", 42, 8, 64, 32, 4, { t: 1, p: 1, ha: { f: 9, s: 3, r: 3 } }],
            ["ger", "Jagdpanzer IV", 43, 5, 40, 32, 5, { t: 1, p: 1, ha: { f: 6, s: 3, r: 2 } }],
            ["ger", "Hetzer", 44, 4, 40, 32, 4, { t: 1, p: 1, ha: { f: 4, s: 2, r: 2 } }],
            ["ger", "Jagdpanther", 44, 6, 64, 32, 6, { t: 1, p: 1, ha: { f: 6, s: 4, r: 3 } }],
            ["ger", "Jagdtiger", 44, 8, 96, 40, 4, { t: 1, p: 1, ha: { f: 9, s: 6, r: 6 } }],
            ["uk", "M10 Achilles", 42, 5, 32, 20, 5, { t: 1, p: 1, ha: { f: 4, s: 2, r: 2 }, ta: { f: 4, s: 2, r: 2 } }],
            ["uk", "M10C Achilles", 43, 5, 40, 24, 5, { t: 1, p: 1, ha: { f: 4, s: 2, r: 2 }, ta: { f: 4, s: 2, r: 2 } }],
            ["usa", "M3A1 Stuart FT", 44, 3, 24, 1, 5, { i: 1, ha: { f: 4, s: 3, r: 3 } }],
            ["usa", "M4A3R5 Sherman", 44, 5, 24, 1, 5, { i: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 }, sn: 2 }],
            ["usa", "M10", 42, 5, 32, 20, 5, { t: 1, p: 1, ha: { f: 4, s: 2, r: 2 }, ta: { f: 4, s: 2, r: 2 } }],
            ["usa", "M10A1", 43, 5, 32, 20, 6, { t: 1, p: 1, ha: { f: 4, s: 2, r: 2 }, ta: { f: 4, s: 2, r: 2 } }],
            ["usa", "M18 Hellcat", 43, 4, 40, 24, 7, { t: 1, p: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 2, s: 1, r: 1 } }],
            ["usa", "M36", 44, 5, 48, 32, 5, { t: 1, p: 1, ha: { f: 4, s: 2, r: 2 }, ta: { f: 5, s: 3, r: 3 } }],
            ["ussr", "SU-76", 42, 3, 16, 22, 5, { t: 1, g: 1, ha: { f: 3, s: 1, r: 1 } }],
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
            spg[:i] = "spat" if spg[:o][:p]
            spg[:i] = "spft" if spg[:o][:i]
            spg[:o][:u] = 1 if spg[:o][:ta]
            spg[:o].merge!({ j: 3, k: 1 })
            lu["#{spg[:c]}_#{sanitize(spg[:n])}".to_sym] = spg
          end
          lu
        end

        def armored_cars
          lu = {}
          key = %i[c n y s f r v o]
          [
            ["chi", "M3A1 Scout Car", 39, 3, 8, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 1 } }],
            ["fra", "M8 Greyhound", 43, 3, 7, 10, 5, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 2, s: 2, r: 2 }, bd: 3 }],
            ["ger", "SdKfz 221", 35, 3, 5, 8, 7, { r: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 } }],
            ["ger", "SdKfz 222", 37, 3, 3, 10, 7, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 } }],
            ["ger", "SdKfz 234/1", 43, 3, 4, 10, 6, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 2, s: 0, r: 0 } }],
            ["ger", "SdKfz 234/2", 43, 3, 24, 10, 6, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 3, s: 0, r: 0 } }],
            ["ger", "SdKfz 234/3", 44, 3, 16, 16, 6, { t: 1, g: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 3, s: 0, r: 0 } }],
            ["ger", "SdKfz 234/4", 44, 3, 32, 24, 6, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 3, s: 0, r: 0 } }],
            ["uk", "M3A1 Scout Car", 39, 3, 8, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 1 } }],
            ["uk", "M8 Greyhound", 43, 3, 7, 10, 5, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 2, s: 2, r: 2 }, bd: 3 }],
            ["usa", "M3A1 Scout Car", 39, 3, 8, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 1 } }],
            ["usa", "M8 Greyhound", 43, 3, 7, 10, 5, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 2, s: 2, r: 2 }, bd: 3 }],
            ["usa", "M20 Greyhound", 43, 3, 8, 12, 5, { r: 1, ha: { f: 1, s: 0, r: 0 } }],
            ["ussr", "BA-10", 38, 3, 12, 16, 4, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 }, bd: 3 }],
            ["ussr", "BA-20", 36, 3, 4, 6, 6, { r: 1, ha: { f: 0, s: 0, r: 0 }, ta: { f: 0, s: 0, r: 0 } }],
            ["ussr", "BA-64", 42, 3, 4, 6, 7, { r: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 0, s: 0, r: 0 } }],
            ["ussr", "M3A1 Scout Car", 39, 3, 8, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 1 } }],
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

        def half_tracks
          lu = {}
          key = %i[c n y s f r v o]
          [
            ["chi", "M5 Half-track", 42, 3, 8, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0 } }],
            ["fra", "M9 Half-track", 41, 3, 8, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0 } }],
            ["ger", "SdKfz 250/1", 41, 3, 5, 8, 6, { r: 1, ha: { f: 1, s: 0, r: 0 } }],
            ["ger", "SdKfz 250/7", 41, 3, 20, 16, 6, { t: 1, m: 3, ha: { f: 1, s: 0, r: 0 } }],
            ["ger", "SdKfz 250/8", 41, 3, 16, 16, 6, { t: 1, g: 1, ha: { f: 1, s: 0, r: 0 } }],
            ["ger", "SdKfz 250/9", 41, 3, 4, 10, 6, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 } }],
            ["ger", "SdKfz 250/10", 41, 3, 8, 16, 6, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 } }],
            ["ger", "SdKfz 250/11", 41, 3, 8, 10, 6, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 } }],
            ["ger", "SdKfz 251/1", 39, 3, 5, 8, 5, { r: 1, ha: { f: 1, s: 0, r: 0 } }],
            ["ger", "SdKfz 251/9", 39, 3, 16, 16, 5, { t: 1, g: 1, ha: { f: 1, s: 0, r: 0 } }],
            ["ger", "SdKfz 251/10", 39, 3, 8, 16, 5, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 } }],
            ["ger", "SdKfz 251/16", 39, 3, 24, 1, 5, { i: 1, ha: { f: 1, s: 0, r: 0 } }],
            ["uk", "M5 Half-track", 42, 3, 8, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0 } }],
            ["usa", "M2 Half-track", 41, 3, 8, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0 } }],
            ["usa", "M3 Half-track", 41, 3, 6, 8, 6, { r: 1, ha: { f: 1, s: 1, r: 0 } }],
            ["usa", "M3A1 Half-track", 42, 3, 8, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0 } }],
            ["usa", "T19/M21 MMC", 42, 3, 20, 20, 6, { t: 1, m: 3, ha: { f: 1, s: 1, r: 0 } }],
            ["usa", "T48 GMC", 42, 3, 7, 10, 6, { t: 1, p: 1, ha: { f: 1, s: 1, r: 0 } }],
            ["ussr", "M5 Half-track", 42, 3, 8, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0 } }],
            ["ussr", "M9 Half-track", 41, 3, 8, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0 } }],
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

        # rubocop:enable Metric/MethodLength, Metric/AbcSize, Metric/CyclomaticComplexity
        # -rubocop:enable Metric/PerceivedComplexity
        # rubocop:enable Metric/LineLength
      end
    end
  end
end
