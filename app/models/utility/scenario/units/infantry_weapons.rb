# frozen_string_literal: true

module Utility
  class Scenario
    module Units
      module InfantryWeapons # rubocop:disable Metrics/ModuleLength
        class << self
          # rubocop:disable Metrics/MethodLength, Metrics/AbcSize, Layout/LineLength
          def infantry_weapons
            machine_guns.merge(mortars).merge(radios).merge(support_weapons)
                        .merge(flamethrowers_and_satchels).merge(molotov_coctails)
          end

          def machine_guns
            lu = {}
            key = %i[c n y o]
            [
              ["alm", "M1915 Chauchat", 15, { sn: 1 }], ["alm", "Bren LMG", 35, {}],
              ["alm", "Vickers MG", 12, {}], ["alm", "Colt M/29", 17, {}], ["alm", "MG 08/15", 24, {}],
              ["alm", "rkm wz. 28", 28, {}], ["alm", "ZB vz. 30", 26, {}],

              ["axm", "MG 08/15", 24, {}], ["axm", "MG 30", 31, {}], ["axm", "MG 34", 36, {}],
              ["axm", "MG 42", 42, {}], ["axm", "ZB vz. 26", 26, {}], ["axm", "ZB vz. 30", 26, {}],

              ["chi", "Type Triple-Ten", 21, {}], ["chi", "Czeck LMG", 26, {}],
              ["chi", "Type 24 Maxim", 24, {}], ["chi", "FN M1930", 30, {}], ["chi", "DP-27", 28, {}],
              ["chi", "Bren LMG", 35, {}], ["chi", "M1915 Hotchkiss", 14, { sn: 1 }],

              ["fin", "Vickers MG", 12, {}], ["fin", "LS/26", 30, {}], ["fin", "Maxim M/32-33", 33, {}],
              ["fin", "MG 08/15", 24, {}], ["fin", "DP-27", 40, {}],

              ["fra", "Bren LMG", 41, {}], ["fra", "M1918 BAR", 41, {}],
              ["fra", "M1915 Chauchat", 15, { sn: 1 }], ["fra", "M1915 Hotchkiss", 14, { sn: 1 }],
              ["fra", "FM 24/29", 25, {}],

              ["ger", "MG 34", 36, {}], ["ger", "MG 30(t)", 39, {}], ["ger", "MG 42", 42, {}],
              ["ger", "MG 08/15", 17, {}],

              ["ita", "Breda 30", 30, {}], ["ita", "Fiat-Revelli 1935", 36, { sn: 1 }],
              ["ita", "Breda M37", 37, {}],

              ["jap", "Type 11 LMG", 22, {}], ["jap", "Type 96 LMG", 36, {}], ["jap", "Type 99 LMG", 39, {}],
              ["jap", "Type 3 HMG", 14, {}], ["jap", "Type 92 HMG", 32, {}],

              ["uk", "Bren LMG", 35, {}], ["uk", "Lewis Gun", 14, {}], ["uk", "Vickers MG", 12, {}],

              ["usa", "M1918 BAR", 18, {}], ["usa", "M1919 Browning", 19, {}], ["usa", "M1917 Browning", 17, {}],
              ["usa", "M2 Browning", 33, {}],

              ["ussr", "DP-27", 28, {}], ["ussr", "SG-43", 43, {}], ["ussr", "PM M1910", 10, {}],
              ["ussr", "DShK", 38, {}],
            ].each do |unit|
              mg = { t: "sw", i: "mg" }
              unit.each_with_index do |v, i|
                mg[key[i]] = v
              end
              Definitions.populate_gun_data(Units.sanitize(mg[:n]).to_sym, mg, move: true)
              lu[:"#{mg[:c]}_#{Units.sanitize(mg[:n])}"] = mg
            end
            lu
          end

          def mortars
            lu = {}
            key = %i[c n y f r v o]
            [
              ["alm", "81mm Mortar", 27, 20, 24, -2, { s: 1, m: 3 }],
              ["axm", "81mm Mortar", 27, 20, 24, -2, { s: 1, m: 3 }],
              ["chi", "Type 15 Mortar", 33, 16, 16, -1, { s: 1, m: 3 }],
              ["chi", "Type 20 Mortar", 27, 20, 24, -2, { s: 1, m: 3 }],
              ["chi", "M1 Mortar", 42, 20, 24, -2, { s: 1, m: 3 }],
              ["chi", "M2 Mortar", 42, 10, 16, -1, { m: 2 }],
              ["chi", "M2 4.2inch Mortar", 43, 32, 32, 1, { sn: 2, s: 1, m: 4, c: 1, tow: 3 }],
              ["fin", "81mm Tampelia", 27, 20, 24, -2, { s: 1, m: 3 }],
              ["fra", "Brandt M1935", 35, 10, 16, -1, { m: 3 }],
              ["fra", "Brandt M27/31", 27, 20, 24, -2, { s: 1, m: 3 }],
              ["fra", "M1917 Fabry", 18, 64, 32, 1, { s: 1, m: 4, c: 1, tow: 4 }],
              ["ger", "5cm leGrW 36", 36, 8, 11, 0, { m: 2 }],
              ["ger", "8cm GrW 34", 37, 20, 17, -2, { s: 1, m: 3 }],
              ["ger", "kz 8cm GrW 42", 41, 20, 16, -1, { s: 1, m: 3 }],
              ["ger", "12cm GrW 42", 43, 40, 32, 1, { s: 1, m: 4, c: 1, tow: 4 }],
              ["ita", "Brixia M35", 35, 6, 11, -1, { m: 2 }],
              ["ita", "81/14 M35", 35, 20, 16, -2, { s: 1, m: 3 }],
              ["jap", "Type 10 Gren.L", 21, 6, 6, 0, { s: 1, m: 2 }],
              ["jap", "Type 89 Gren.L", 29, 8, 11, 0, { s: 1, m: 2 }],
              ["jap", "Type 97 81mm", 37, 20, 24, -3, { s: 1, m: 3 }],
              ["jap", "Type 97 90mm", 37, 24, 24, 1, { s: 1, m: 3, c: 1, tow: 3 }],
              ["jap", "Type 94 90mm", 34, 24, 24, 1, { s: 1, m: 3, c: 1, tow: 3 }],
              ["uk", "2inch Mortar", 37, 7, 10, 0, { m: 2 }],
              ["uk", "ML 3inch Mortar", 33, 20, 17, -1, { s: 1, m: 3 }],
              ["uk", "ML 4.2inch Mortar", 40, 32, 32, 1, { s: 1, m: 4, c: 1, sn: 2, tow: 3 }],
              ["usa", "M2 Mortar", 40, 10, 16, -1, { m: 2 }],
              ["usa", "M1 Mortar", 35, 20, 24, -2, { s: 1, m: 3 }],
              ["usa", "M2 4.2inch Mortar", 43, 32, 32, 1, { sn: 2, s: 1, m: 4, c: 1, tow: 3 }],
              ["ussr", "RM-38", 38, 8, 14, 0, { m: 2 }],
              ["ussr", "82-BM-37", 37, 20, 24, -2, { s: 1, m: 3 }],
              ["ussr", "82-PM-41", 41, 20, 24, -2, { s: 1, m: 3 }],
              ["ussr", "120-PM-38", 39, 40, 32, 1, { s: 1, m: 4, c: 1, tow: 4 }],
            ].each do |unit|
              mortar = { t: "sw", i: "mortar" }
              unit.each_with_index do |v, i|
                mortar[key[i]] = v
              end
              mortar[:o].merge!({ t: 1, b: 3, e: 1 })
              mortar[:s] = 1
              mortar[:s] = 3 if mortar[:o][:c]
              lu[:"#{mortar[:c]}_#{Units.sanitize(mortar[:n])}"] = mortar
            end
            lu
          end

          def radios
            lu = {}
            key = %i[c n y]
            [
              ["fra", "Radio 105mm", 13], ["fra", "Radio 155mm", 17],

              ["ger", "Radio 10.5cm", 35], ["ger", "Radio 15cm", 34], ["ger", "Radio 17cm", 41],
              ["ger", "Radio 21cm", 39],

              ["ita", "Radio 75mm", 37], ["ita", "Radio 100mm", 14], ["ita", "Radio 149mm", 14],

              ["jap", "Radio 7.5cm", 36], ["jap", "Radio 10cm", 31], ["jap", "Radio 15cm", 37],

              ["uk", "Radio 88mm", 40], ["uk", "Radio 114mm", 38], ["uk", "Radio 140mm", 41],
              ["uk", "Radio 152mm", 16], ["uk", "Radio 183mm", 40],

              ["usa", "Radio 75mm", 32], ["usa", "Radio 105mm", 41], ["usa", "Radio 155mm", 42],
              ["usa", "Radio 8inch", 42],

              ["ussr", "Radio 76mm", 37], ["ussr", "Radio 85mm", 43], ["ussr", "Radio 122mm", 39],
              ["ussr", "Radio 152mm", 37],
            ].each do |unit|
              radio = { t: "sw", i: "radio" }
              unit.each_with_index do |v, i|
                radio[key[i]] = v
              end
              Definitions.populate_gun_data(Units.sanitize(radio[:n]).to_sym, radio, move: true)
              lu[:"#{radio[:c]}_#{Units.sanitize(radio[:n])}"] = radio
            end
            lu
          end

          def support_weapons
            lu = {}
            key = %i[c n y f r v o]
            [
              ["alm", "PIAT", 42, 8, 3, 0, { b: 4 }],
              ["chi", "M1A1 Bazooka", 43, 10, 4, 0, { b: 4 }],
              ["fra", "PIAT", 42, 8, 3, 0, { b: 4 }],
              ["ger", "Panzerfaust", 43, 16, 1, 0, { x: 1 }],
              ["ger", "Panzerschreck", 43, 12, 3, 0, { b: 4 }],
              ["uk", "PIAT", 42, 8, 3, 0, { b: 4 }],
              ["usa", "M1 Bazooka", 42, 8, 4, 0, { b: 5 }],
              ["usa", "M1A1 Bazooka", 43, 10, 4, 0, { b: 4 }],
              ["usa", "M9 Bazooka", 43, 10, 4, 0, { b: 4 }],
              ["ussr", "Ampulomet", 41, 4, 6, -1, { b: 5, i: 1, e: 1 }],
            ].each do |unit|
              rocket = { t: "sw", i: "rocket", s: 1 }
              unit.each_with_index do |v, i|
                rocket[key[i]] = v
              end
              rocket[:o].merge!({ t: 1 })
              rocket[:o].merge!({ p: 1 }) unless rocket[:n] == "Ampulomet"
              lu[:"#{rocket[:c]}_#{Units.sanitize(rocket[:n])}"] = rocket
            end
            [
              ["axm", "S-18/100", 34, 4, 6, -2, { j: 3 }],
              ["alm", "Boys AT Rifle", 37, 3, 6, -1, { j: 3 }],
              ["alm", "wz. 35 AT Rifle", 38, 3, 4, 0, { j: 3 }],
              ["chi", "Boys AT Rifle", 44, 3, 6, -1, { j: 3 }],
              ["fin", "Lahti L-39", 40, 4, 6, -2, { j: 3 }],
              ["fin", "14mm pst kiv/37", 37, 3, 6, -1, { j: 3, sn: 1 }],
              ["fin", "8mm pst kiv/38", 38, 3, 4, 0, { j: 3 }],
              ["jap", "Type 97 AC", 35, 3, 5, -2, { j: 3 }],
              ["uk", "Boys AT Rifle", 37, 3, 6, -1, { j: 3 }],
            ].each do |unit|
              at = { t: "sw", i: "antitank", s: 1 }
              unit.each_with_index do |v, i|
                at[key[i]] = v
              end
              at[:o].merge!({ t: 1, p: 1 })
              lu[:"#{at[:c]}_#{Units.sanitize(at[:n])}"] = at
            end
            lu
          end

          def flamethrowers_and_satchels
            lu = {}
            t = "sw"
            Units.all_factions.each do |c|
              i = "flamethrower"
              n = i.capitalize
              y = 15
              lu[:"#{c}_ft"] = { c:, t:, n:, y:, i:, f: 24, r: 1, v: 0, s: 1, o: { a: 1, i: 1, b: 4, e: 1 } }
              n = "Satchel Charge"
              i = "explosive"
              y = 36
              lu[:"#{c}_sc"] = { c:, t:, n:, y:, i:, f: 24, r: 1, v: 0, s: 1, o: { x: 1, t: 1, e: 1 } }
            end
            lu
          end

          def molotov_coctails
            lu = {}
            t = "sw"
            %w[fin ussr].each do |c|
              n = "Molotov Cocktail"
              i = "explosive"
              y = 39
              lu[:"#{c}_mc"] = { c:, t:, n:, y:, i:, f: 4, r: 1, v: 0, s: 1, o: { i: 1, x: 1, t: 1, sn: 1, e: 1 } }
            end
            lu
          end
          # rubocop:enable Metrics/MethodLength, Metrics/AbcSize, Layout/LineLength
        end
      end
    end
  end
end
