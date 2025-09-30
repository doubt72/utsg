# frozen_string_literal: true

module Utility
  class Scenario
    module Units
      module Definitions # rubocop:disable Metrics/ModuleLength
        class << self
          # rubocop:disable Metrics/MethodLength, Metrics/AbcSize, Metrics/CyclomaticComplexity
          # rubocop:disable Metrics/PerceivedComplexity, Layout/LineLength
          def populate_gun_data(key, json, move: false)
            translated_key = translate_names[key] || key
            data = weapon_data[translated_key]
            raise "key missing: #{key}" unless data

            json[:f] = data[:fire]
            json[:r] = data[:range]
            json[:v] = data[:move] if move
            json[:s] = data[:size] if move
            json[:o] = json[:o] || {}
            json[:o][:a] = 1 if data[:assault]
            json[:o][:r] = 1 if data[:rapid]
            json[:o][:s] = 1 if data[:smoke]
            json[:o][:o] = 1 if data[:offboard]
            json[:o][:e] = 1 if data[:area]
            json[:o][:m] = data[:minrange] if data[:minrange]
            json[:o][:c] = 1 if data[:crewed]
            json[:o][:t] = 1 if data[:targeted]
            json[:o][:tow] = data[:tow] if data[:tow]
            json[:o][:j] = data[:jam] || 3 unless data[:break]
            json[:o][:f] = data[:fix] || 16 unless data[:break]
            json[:o][:b] = data[:break] if data[:break]
          end

          def translate_names
            {
              # Machine Guns
              colt_m_29: :m1917_browning,
              mg_30t: :zb_vz__30,
              czeck_lmg: :zb_vz__26,
              fn_m1930: :m1918_bar,
              type_24_maxim: :mg_08_15,
              type_triple_ten: :m1917_browning,
              # Mortars
              "81mm_mortar": :brandt_m27_31,
              "81mm_tampella": :brandt_m27_31,
              type_20_mortar: :brandt_m27_31,
              type_15_mortar: :"82_bm_37",
              type_31_mortar: :m2_mortar,
              # Artillery
              radio_7_5cm: :radio_75mm,
              radio_10cm: :radio_100mm,
              radio_10_5cm: :radio_105mm,
            }
          end

          def weapon_data
            {
              # Machine Guns
              zb_vz__26: { fire: 4, range: 10, move: 0, assault: true, rapid: true, size: 1 },
              zb_vz__30: { fire: 4, range: 10, move: 0, assault: true, rapid: true, size: 1 },
              ls_26: { fire: 4, range: 5, move: 0, assault: true, rapid: true, size: 1 },
              maxim_m_32_33: { fire: 8, range: 12, move: -1, assault: false, rapid: true, size: 1 },
              m1915_chauchat: { fire: 2, range: 5, move: 0, assault: true, jam: 4, fix: 17, rapid: true, size: 1 },
              m1915_hotchkiss: { fire: 5, range: 10, move: -1, assault: false, rapid: true, size: 1 },
              fm_24_29: { fire: 3, range: 10, move: 0, assault: true, rapid: true, size: 1 },
              mg_34: { fire: 5, range: 8, move: 0, assault: true, rapid: true, size: 1 },
              mg_42: { fire: 8, range: 8, move: 0, assault: true, rapid: true, size: 1 },
              mg_08_15: { fire: 8, range: 12, move: -1, assault: false, rapid: true, size: 1 },
              breda_30: { fire: 3, range: 6, move: 0, assault: false, jam: 4, fix: 17, rapid: true, size: 1 },
              fiat_revelli_1935: { fire: 4, range: 10, move: -1, assault: false, jam: 4, fix: 17, rapid: true, size: 1 },
              breda_m37: { fire: 8, range: 10, move: -1, assault: false, rapid: true, size: 1 },
              type_11_lmg: { fire: 2, range: 6, move: 0, assault: false, jam: 5, fix: 17, rapid: true, size: 1 },
              type_96_lmg: { fire: 4, range: 8, move: 0, assault: true, jam: 4, fix: 17, rapid: true, size: 1 },
              type_99_lmg: { fire: 6, range: 8, move: 0, assault: true, rapid: true, size: 1 },
              type_3_hmg: { fire: 4, range: 10, move: -1, assault: false, rapid: true, size: 1 },
              type_92_hmg: { fire: 8, range: 10, move: -2, assault: false, rapid: true, size: 1 },
              rkm_wz__28: { fire: 6, range: 6, move: 0, assault: true, rapid: true, size: 1 },
              mg_30: { fire: 4, range: 8, move: 0, assault: true, rapid: true, size: 1 },
              bren_lmg: { fire: 3, range: 6, move: 0, assault: true, rapid: true, size: 1 },
              vickers_mg: { fire: 6, range: 15, move: -1, assault: false, jam: 2, fix: 15, rapid: true, size: 1 },
              lewis_gun: { fire: 4, range: 8, move: 0, assault: false, rapid: true, size: 1 },
              m1917_browning: { fire: 12, range: 12, move: -2, assault: false, rapid: true, size: 1 },
              m1918_bar: { fire: 5, range: 8, move: 0, assault: true, rapid: true, size: 1 },
              m1919_browning: { fire: 8, range: 8, move: -1, assault: false, rapid: true, size: 1 },
              m2_browning: { fire: 20, range: 15, move: -2, assault: false, rapid: true, size: 1 },
              pm_m1910: { fire: 6, range: 12, move: -2, assault: false, rapid: true, size: 1 },
              dp_27: { fire: 4, range: 8, move: 0, assault: true, rapid: true, size: 1 },
              sg_43: { fire: 6, range: 10, move: -1, assault: false, rapid: true, size: 1 },
              dshk: { fire: 24, range: 16, move: -2, assault: false, rapid: true, size: 1 },
              # Mortars
              brandt_m1935: { fire: 20, range: 15, minrange: 3, move: -1, targeted: true, break: 3, area: true, size: 1 },
              brandt_m27_31: { fire: 20, range: 17, minrange: 3, move: -1, smoke: true, targeted: true, break: 3, area: true, size: 1 },
              m1917_fabry: { fire: 48, range: 20, minrange: 6, move: 1, smoke: true, crewed: true, tow: 3, targeted: true, break: 3, area: true, size: 3 },
              "5cm_legrw_36": { fire: 8, range: 12, minrange: 2, move: 0, targeted: true, break: 3, area: true, size: 1 },
              "8cm_grw_34": { fire: 16, range: 17, minrange: 3, move: -2, smoke: true, targeted: true, break: 3, area: true, size: 1 },
              kz_8cm_grw_42: { fire: 16, range: 16, minrange: 3, move: -1, smoke: true, targeted: true, break: 3, area: true, size: 1 },
              "12cm_grw_42": { fire: 32, range: 32, minrange: 5, move: 2, smoke: true, crewed: true, tow: 2, targeted: true, break: 3, area: true, size: 2 },
              brixia_m35: { fire: 8, range: 12, minrange: 2, move: 0, targeted: true, break: 3, area: true, size: 1 },
              "81_14_m35": { fire: 20, range: 18, minrange: 3, move: -1, smoke: true, targeted: true, break: 3, area: true, size: 1 },
              type_10_gren_l: { fire: 8, range: 7, minrange: 2, move: 0, smoke: true, targeted: true, break: 3, area: true, size: 1 },
              type_89_gren_l: { fire: 8, range: 8, minrange: 2, move: 0, smoke: true, targeted: true, break: 3, area: true, size: 1 },
              type_97_81mm: { fire: 20, range: 17, minrange: 3, move: -2, smoke: true, targeted: true, break: 3, area: true, size: 1 },
              type_97_90mm: { fire: 20, range: 27, minrange: 4, move: -2, smoke: true, targeted: true, break: 3, area: true, size: 1 },
              type_94_90mm: { fire: 20, range: 27, minrange: 4, move: 2, smoke: true, crewed: true, tow: 2, targeted: true, break: 3, area: true, size: 2 },
              "2inch_mortar": { fire: 10, range: 15, minrange: 2, move: 0, targeted: true, break: 3, area: true, size: 1 },
              ml_3inch_mortar: { fire: 20, range: 18, minrange: 3, move: -1, smoke: true, targeted: true, break: 3, area: true, size: 1 },
              ml_4_2inch_mortar: { fire: 24, range: 26, minrange: 5, move: 2, smoke: true, crewed: true, tow: 2, targeted: true, break: 3, area: true, size: 2 },
              m2_mortar: { fire: 12, range: 16, minrange: 2, move: -1, targeted: true, break: 3, area: true, size: 1 },
              m1_mortar: { fire: 20, range: 24, minrange: 3, move: -2, smoke: true, targeted: true, break: 3, area: true, size: 1 },
              m2_4_2inch_mortar: { fire: 24, range: 28, minrange: 5, move: 2, smoke: true, crewed: true, tow: 2, targeted: true, break: 3, area: true, size: 2 },
              rm_38: { fire: 8, range: 14, minrange: 2, move: 0, targeted: true, break: 3, area: true, size: 1 },
              "82_bm_37": { fire: 20, range: 24, minrange: 3, move: -2, smoke: true, targeted: true, break: 3, area: true, size: 1 },
              "82_pm_41": { fire: 20, range: 24, minrange: 3, move: -2, smoke: true, targeted: true, break: 3, area: true, size: 1 },
              "120_pm_38": { fire: 32, range: 32, minrange: 5, move: 2, smoke: true, crewed: true, tow: 2, targeted: true, break: 3, area: true, size: 2 },
              # Artillery
              radio_75mm: { fire: 24, range: 99, move: 0, smoke: true, offboard: true, area: true, fix: 18, size: 1 },
              radio_76mm: { fire: 24, range: 99, move: 0, smoke: true, offboard: true, area: true, fix: 18, size: 1 },
              radio_85mm: { fire: 32, range: 99, move: 0, smoke: true, offboard: true, area: true, fix: 18, size: 1 },
              radio_88mm: { fire: 32, range: 99, move: 0, smoke: true, offboard: true, area: true, fix: 18, size: 1 },
              radio_100mm: { fire: 40, range: 99, move: 0, smoke: true, offboard: true, area: true, fix: 18, size: 1 },
              radio_105mm: { fire: 40, range: 99, move: 0, smoke: true, offboard: true, area: true, fix: 18, size: 1 },
              radio_114mm: { fire: 48, range: 99, move: 0, smoke: true, offboard: true, area: true, fix: 18, size: 1 },
              radio_122mm: { fire: 48, range: 99, move: 0, smoke: true, offboard: true, area: true, fix: 18, size: 1 },
              radio_140mm: { fire: 64, range: 99, move: 0, smoke: true, offboard: true, area: true, fix: 18, size: 1 },
              radio_149mm: { fire: 64, range: 99, move: 0, smoke: true, offboard: true, area: true, fix: 18, size: 1 },
              radio_15cm: { fire: 64, range: 99, move: 0, smoke: true, offboard: true, area: true, fix: 18, size: 1 },
              radio_152mm: { fire: 64, range: 99, move: 0, smoke: true, offboard: true, area: true, fix: 18, size: 1 },
              radio_155mm: { fire: 80, range: 99, move: 0, smoke: true, offboard: true, area: true, fix: 18, size: 1 },
              radio_17cm: { fire: 80, range: 99, move: 0, smoke: true, offboard: true, area: true, fix: 18, size: 1 },
              radio_183mm: { fire: 96, range: 99, move: 0, smoke: true, offboard: true, area: true, fix: 18, size: 1 },
              radio_8inch: { fire: 96, range: 99, move: 0, smoke: true, offboard: true, area: true, fix: 18, size: 1 },
              radio_21cm: { fire: 96, range: 99, move: 0, smoke: true, offboard: true, area: true, fix: 18, size: 1 },
            }
          end
          # rubocop:enable Metrics/MethodLength, Metrics/AbcSize, Metrics/CyclomaticComplexity
          # rubocop:enable Metrics/PerceivedComplexity, Layout/LineLength
        end
      end
    end
  end
end
