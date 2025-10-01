# frozen_string_literal: true

module Utility
  class Scenario
    module Units
      module Definitions # rubocop:disable Metrics/ModuleLength
        class << self
          # rubocop:disable Metrics/MethodLength, Metrics/AbcSize, Metrics/CyclomaticComplexity
          # rubocop:disable Metrics/PerceivedComplexity, Layout/LineLength
          def populate_vehicle_data(key, json)
            actual_key = aliases[key] || key
            data = vehicle_data[actual_key]
            raise "key missing: #{actual_key}" unless data

            json[:o] = json[:o] || {}

            json[:s] = data[:size]
            json[:v] = data[:move]
            if data[:hull]
              json[:o][:ha] = {
                f: data[:hull][0], s: data[:hull][1], r: data[:hull][2],
              }
            end
            if data[:turret]
              json[:o][:u] = 1
              json[:o][:ta] = {
                f: data[:turret][0], s: data[:turret][1], r: data[:turret][2],
              }
              json[:o][:ta][:t] = -1 if data[:turret].length > 3
            end
            json[:o][:bd] = data[:breakdown] if data[:breakdown]
            json[:o][:amp] = 1 if data[:amphibious]
            data[:wheel] ? json[:o][:w] = 1 : json[:o][:k] = 1
            populate_gun_data(data[:weapon], json)
            populate_sponson_data(data[:sponson], json) if data[:sponson]
          end

          def populate_gun_data(key, json, move: false)
            actual_key = aliases[key] || key
            data = weapon_data[actual_key]
            raise "key missing: #{actual_key}" unless data

            json[:o] = json[:o] || {}

            json[:f] = data[:fire]
            json[:r] = data[:range]
            json[:v] = data[:move] if move
            json[:s] = data[:size] if move
            json[:o][:tow] = data[:tow] if data[:tow] && move
            json[:o][:c] = 1 if data[:crewed] && move
            json[:o][:x] = 1 if data[:single]
            json[:o][:a] = 1 if data[:assault] && move
            json[:o][:r] = 1 if data[:rapid]
            json[:o][:s] = 1 if data[:smoke]
            json[:o][:i] = 1 if data[:incendiary]
            json[:o][:o] = 1 if data[:offboard]
            json[:o][:e] = 1 if data[:area]
            json[:o][:m] = data[:minrange] if data[:minrange]
            json[:o][:t] = 1 if data[:targeted]
            json[:o][:g] = 1 if data[:gun]
            json[:o][:p] = 1 if data[:at]
            json[:o][:j] = data[:jam] || 3 unless data[:break] || data[:single]
            json[:o][:f] = data[:fix] || 16 unless data[:break] || data[:single]
            json[:o][:b] = data[:break] if data[:break]
          end

          def populate_sponson_data(key, json)
            actual_key = aliases[key] || key
            data = weapon_data[actual_key]
            raise "key missing: #{actual_key}" unless data

            type = "p"
            type = "g" if data[:gun]
            type = "ft" if data[:incendiary]
            json[:o] = json[:o] || {}
            json[:o][:sg] = {
              f: data[:fire], r: data[:range], t: type,
            }
          end

          def aliases
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
              # AT Rifles
              "14mm_pst_kiv_37": :boys_at_rifle,
              "8mm_pst_kiv_38": :wz__35_at_rifle,
              # Artillery
              radio_7_5cm: :radio_75mm,
              radio_10cm: :radio_100mm,
              radio_10_5cm: :radio_105mm,
              # Field Guns
              "75mm_gun": :"75mm_m1897",
              # AT Guns
              type_30_at: :"3_7cm_pak_36",
              "57mm_m1": :qf_6pdr_mk_iv,
              # Vehicles
              r_2: :pzkpfw_35t,
              t_38: :pzkpfw_38t_a_d,
              t_3: :pzkpfw_iii__40,
              t_4: :pzkpfw_iv_e,
              valentine: :valentine_ix_x,
              churchill_ii: :churchill_i_ii,
              churchill_iii: :churchill_iii_iv,
              m3_grant: :m3_lee,
              t_26: :t_26_m38,
              m10_achilles: :m10,
              fiat_l3: :l3_35,
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
              # HE AT
              panzerfaust: { fire: 20, range: 1, move: 0, targeted: true, size: 1, single: true, at: true },
              panzerschreck: { fire: 12, range: 4, move: 0, targeted: true, size: 1, break: 4, at: true },
              piat: { fire: 10, range: 3, move: 0, targeted: true, size: 1, break: 4, at: true },
              m1_bazooka: { fire: 8, range: 4, move: 0, targeted: true, size: 1, break: 5, at: true },
              m1a1_bazooka: { fire: 10, range: 4, move: 0, targeted: true, size: 1, break: 4, at: true },
              m9_bazooka: { fire: 10, range: 4, move: 0, targeted: true, size: 1, break: 4, at: true },
              ampulomet: { fire: 16, range: 7, move: -1, targeted: true, size: 1, break: 5, incendiary: true, area: true },
              # AT Rifles
              boys_at_rifle: { fire: 3, range: 4, move: -1, targeted: true, at: true, fix: 18, size: 1 },
              s_18_100: { fire: 3, range: 6, move: -2, targeted: true, at: true, fix: 18, size: 1 },
              wz__35_at_rifle: { fire: 2, range: 4, move: 0, targeted: true, at: true, fix: 18, size: 1 },
              lahti_l_39: { fire: 3, range: 6, move: -2, targeted: true, at: true, fix: 18, size: 1 },
              type_97_ac: { fire: 3, range: 4, move: -2, targeted: true, at: true, fix: 18, size: 1 },
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
              # Field Guns
              bofors_75mm: { fire: 16, range: 20, move: 1, targeted: true, fix: 18, gun: true, smoke: true, crewed: true, size: 3, tow: 3 },
              "75mm_m1897": { fire: 16, range: 24, move: 1, targeted: true, fix: 18, gun: true, smoke: true, crewed: true, size: 3, tow: 3 },
              "37mm_m1916": { fire: 6, range: 14, move: 2, targeted: true, fix: 18, gun: true, smoke: true, crewed: true, size: 2, tow: 2 },
              "7_5cm_gebg_36": { fire: 16, range: 20, move: 1, targeted: true, fix: 18, gun: true, smoke: true, crewed: true, size: 3, tow: 3 },
              "7_5cm_leig_18": { fire: 16, range: 20, move: 1, targeted: true, fix: 18, gun: true, smoke: true, crewed: true, size: 3, tow: 3 },
              "10_5cm_gebh_40": { fire: 24, range: 32, move: 1, targeted: true, fix: 18, gun: true, smoke: true, crewed: true, size: 3, tow: 3 },
              "15cm_sig_33": { fire: 48, range: 24, move: 1, targeted: true, fix: 18, gun: true, smoke: true, crewed: true, size: 3, tow: 3 },
              cannone_da_65_17: { fire: 12, range: 20, move: 1, targeted: true, fix: 18, gun: true, smoke: true, crewed: true, size: 3, tow: 3 },
              obice_da_75_18: { fire: 16, range: 24, move: 1, targeted: true, fix: 18, gun: true, smoke: true, crewed: true, size: 3, tow: 3 },
              obice_da_100_17: { fire: 24, range: 32, move: 1, targeted: true, fix: 18, gun: true, smoke: true, crewed: true, size: 3, tow: 3 },
              "70mm_type_92": { fire: 16, range: 16, move: 2, targeted: true, fix: 18, gun: true, smoke: true, crewed: true, size: 2, tow: 2 },
              qf_25_pounder: { fire: 20, range: 32, move: 1, targeted: true, fix: 18, gun: true, smoke: true, crewed: true, size: 3, tow: 3 },
              qf_25pdr_short: { fire: 20, range: 20, move: 1, targeted: true, fix: 18, gun: true, smoke: true, crewed: true, size: 3, tow: 3 },
              qf_4_5inch: { fire: 32, range: 24, move: 1, targeted: true, fix: 18, gun: true, smoke: true, crewed: true, size: 3, tow: 3 },
              "75mm_m1_pack": { fire: 16, range: 20, move: 1, targeted: true, fix: 18, gun: true, smoke: true, crewed: true, size: 3, tow: 3 },
              "76mm_zis_3": { fire: 16, range: 28, move: 1, targeted: true, fix: 18, gun: true, smoke: true, crewed: true, size: 3, tow: 3 },
              # AT Guns
              "25mm_hotchkiss": { fire: 4, range: 12, move: 2, targeted: true, fix: 18, at: true, crewed: true, size: 2, tow: 2 },
              "47mm_apx": { fire: 12, range: 16, move: 1, targeted: true, fix: 18, at: true, crewed: true, size: 3, tow: 3 },
              "2_8cm_spzb_41": { fire: 10, range: 8, move: 2, targeted: true, fix: 18, at: true, crewed: true, size: 2, tow: 2 },
              "3_7cm_pak_36": { fire: 6, range: 12, move: 2, targeted: true, fix: 18, at: true, crewed: true, size: 2, tow: 2 },
              "5cm_pak_38": { fire: 24, range: 24, move: 1, targeted: true, fix: 18, at: true, crewed: true, size: 3, tow: 3 },
              "7_5cm_pak_97_38": { fire: 12, range: 12, move: 1, targeted: true, fix: 18, at: true, crewed: true, size: 3, tow: 3 },
              "7_5cm_pak_40": { fire: 40, range: 32, move: 1, targeted: true, fix: 18, at: true, crewed: true, size: 3, tow: 3 },
              "8_8cm_pak_43": { fire: 64, range: 32, move: 1, targeted: true, fix: 18, at: true, crewed: true, size: 3, tow: 4 },
              "8_8cm_flak_36": { fire: 40, range: 32, move: 1, targeted: true, fix: 18, at: true, crewed: true, size: 3, tow: 4 },
              "12_8cm_pak_44": { fire: 96, range: 40, move: 1, targeted: true, fix: 18, at: true, crewed: true, size: 3, tow: 4 },
              cannone_da_47_32: { fire: 6, range: 12, move: 2, targeted: true, fix: 18, at: true, crewed: true, size: 2, tow: 2 },
              cannone_da_47_40: { fire: 12, range: 16, move: 2, targeted: true, fix: 18, at: true, crewed: true, size: 2, tow: 2 },
              cannone_da_75_46: { fire: 24, range: 24, move: 1, targeted: true, fix: 18, at: true, crewed: true, size: 3, tow: 4 },
              cannone_da_90_53: { fire: 48, range: 32, move: 1, targeted: true, fix: 18, at: true, crewed: true, size: 3, tow: 4 },
              "37mm_type_94": { fire: 5, range: 12, move: 2, targeted: true, fix: 18, at: true, crewed: true, size: 2, tow: 2 },
              "37mm_type_1": { fire: 6, range: 12, move: 2, targeted: true, fix: 18, at: true, crewed: true, size: 2, tow: 2 },
              "47mm_type_1": { fire: 12, range: 16, move: 1, targeted: true, fix: 18, at: true, crewed: true, size: 3, tow: 3 },
              "75mm_type_90": { fire: 20, range: 20, move: 1, targeted: true, fix: 18, at: true, crewed: true, size: 3, tow: 3 },
              qf_2_pounder: { fire: 8, range: 12, move: 1, targeted: true, fix: 18, at: true, crewed: true, size: 3, tow: 3 },
              qf_6pdr_mk_ii: { fire: 16, range: 20, move: 1, targeted: true, fix: 18, at: true, crewed: true, size: 3, tow: 3 },
              qf_6pdr_mk_iv: { fire: 20, range: 24, move: 1, targeted: true, fix: 18, at: true, crewed: true, size: 3, tow: 3 },
              qf_17_pounder: { fire: 40, range: 32, move: 1, targeted: true, fix: 18, at: true, crewed: true, size: 3, tow: 4 },
              "37mm_m3": { fire: 8, range: 12, move: 2, targeted: true, fix: 18, at: true, crewed: true, size: 2, tow: 2 },
              "3inch_m5": { fire: 24, range: 24, move: 1, targeted: true, fix: 18, at: true, crewed: true, size: 3, tow: 4 },
              "45mm_19_k": { fire: 8, range: 12, move: 1, targeted: true, fix: 18, at: true, crewed: true, size: 3, tow: 3 },
              "45mm_53_k": { fire: 8, range: 12, move: 1, targeted: true, fix: 18, at: true, crewed: true, size: 3, tow: 3 },
              "45mm_m_42": { fire: 12, range: 16, move: 1, targeted: true, fix: 18, at: true, crewed: true, size: 3, tow: 3 },
              "57mm_zis_2": { fire: 24, range: 24, move: 1, targeted: true, fix: 18, at: true, crewed: true, size: 3, tow: 3 },
              "76mm_f_22": { fire: 20, range: 24, move: 1, targeted: true, fix: 18, at: true, crewed: true, size: 3, tow: 4 },
              "100mm_bs_3": { fire: 64, range: 40, move: 1, targeted: true, fix: 18, at: true, crewed: true, size: 3, tow: 4 },
              bofors_37mm_at: { fire: 8, range: 12, move: 2, targeted: true, fix: 18, at: true, crewed: true, size: 2, tow: 2 },
              # Tank Weapons
              hotchkiss_13_2mm: { fire: 16, range: 12, move: 0, assault: false, rapid: true, size: 1 },
              mac_m1931: { fire: 6, range: 10, move: 0, assault: false, rapid: true, size: 1 },
              "105mm_m4": { fire: 24, range: 32, targeted: true, fix: 18, gun: true },
              "7_5cm_kwk_37": { fire: 16, range: 24, targeted: true, fix: 18, gun: true },
              m_10: { fire: 48, range: 32, targeted: true, fix: 18, gun: true },
              qf_95: { fire: 24, range: 24, targeted: true, fix: 18, gun: true },
              "75mm_m6": { fire: 16, range: 24, targeted: true, fix: 18, at: true },
              "76mm_m1": { fire: 32, range: 24, targeted: true, fix: 18, at: true },
              "90mm_m3": { fire: 40, range: 32, targeted: true, fix: 18, at: true },
              "2cm_kwk_30": { fire: 4, range: 12, targeted: true, fix: 18, at: true },
              "2cm_kwk_38": { fire: 6, range: 12, targeted: true, fix: 18, at: true },
              "3_7cm_kwk_34t": { fire: 5, range: 12, targeted: true, fix: 18, at: true },
              "37_mm_kwk_38t": { fire: 6, range: 12, targeted: true, fix: 18, at: true },
              "3_7cm_kwk_36": { fire: 6, range: 12, targeted: true, fix: 18, at: true },
              "5cm_kwk_38": { fire: 8, range: 12, targeted: true, fix: 18, at: true },
              "5cm_kwk_39": { fire: 12, range: 16, targeted: true, fix: 18, at: true },
              "7_5cm_kwk_40s": { fire: 24, range: 24, targeted: true, fix: 18, at: true },
              "7_5cm_kwk_40": { fire: 40, range: 32, targeted: true, fix: 18, at: true },
              "7_5cm_kwk_42": { fire: 40, range: 32, targeted: true, fix: 18, at: true },
              "8_8cm_kwk_36": { fire: 48, range: 40, targeted: true, fix: 18, at: true },
              "8_8cm_kwk_43": { fire: 80, range: 40, targeted: true, fix: 18, at: true },
              f_32: { fire: 16, range: 24, targeted: true, fix: 18, at: true },
              zis_s_53: { fire: 32, range: 32, targeted: true, fix: 18, at: true },
              a_19: { fire: 80, range: 40, targeted: true, fix: 18, at: true },
              qf_75: { fire: 16, range: 24, targeted: true, fix: 18, at: true },
              qf_77hv: { fire: 48, range: 32, targeted: true, fix: 18, at: true },
              breda_20_65: { fire: 2, range: 12, targeted: true, fix: 18, at: true },
              "37mm_cannon": { fire: 4, range: 12, targeted: true, fix: 18, at: true },
              c_75_34: { fire: 16, range: 24, targeted: true, fix: 18, at: true },
              "57mm_type_90": { fire: 12, range: 20, targeted: true, fix: 18, at: true },
              "47mm_sa_35": { fire: 6, range: 12, targeted: true, fix: 18, at: true },
              "37mm_sa_18": { fire: 4, range: 12, targeted: true, fix: 18, at: true },
              oqf_3_pounder: { fire: 5, range: 12, targeted: true, fix: 18, at: true },
              "37_42m": { fire: 4, range: 12, targeted: true, fix: 18, at: true },
              # Plus SPG weapons
              ft: { fire: 24, range: 1, incendiary: true, area: true, break: 4 },
              ft_croc: { fire: 24, range: 2, incendiary: true, area: true, break: 4 },
              "10_5cm_lefh_18": { fire: 24, range: 32, targeted: true, fix: 18, gun: true },
              "15cm_stuh_43": { fire: 48, range: 32, targeted: true, fix: 18, gun: true },
              "76mm_d_f_22": { fire: 16, range: 24, targeted: true, fix: 18, gun: true },
              type_90_75mm: { fire: 16, range: 24, targeted: true, fix: 18, gun: true },
              type_92_10cm: { fire: 24, range: 24, targeted: true, fix: 18, gun: true },
              qf_3_7_m: { fire: 24, range: 24, targeted: true, fix: 18, gun: true, smoke: true },
              qf_3inch: { fire: 16, range: 24, targeted: true, fix: 18, gun: true, smoke: true },
              m_30: { fire: 32, range: 32, targeted: true, fix: 18, gun: true },
              "4_7cm_pakt": { fire: 10, range: 12, targeted: true, fix: 18, at: true },
              "7_5cm_pak_39": { fire: 40, range: 32, targeted: true, fix: 18, at: true },
              "76mm_m7": { fire: 24, range: 24, targeted: true, fix: 18, at: true },
              d_10s: { fire: 80, range: 40, targeted: true, fix: 18, at: true },
              "75mm_m2_m3": { fire: 16, range: 24, targeted: true, fix: 18, gun: true },
              "76mm_zis_3m": { fire: 16, range: 24, targeted: true, fix: 18, gun: true },
              c_da_75_18: { fire: 16, range: 24, targeted: true, fix: 18, gun: true },
            }
          end

          def vehicle_data
            {
              # Tanks
              char_b1: { size: 5, move: 3, weapon: :"47mm_sa_35", sponson: :"75mm_gun", hull: [3, 3, 3], turret: [3, 3, 3] },
              char_b1_bis: { size: 5, move: 3, weapon: :"47mm_sa_35", sponson: :"75mm_gun", hull: [4, 4, 4], turret: [3, 3, 3] },
              amr_33: { size: 3, move: 6, weapon: :mac_m1931, breakdown: 4, hull: [1, 1, 1], turret: [1, 1, 1] },
              amr_35_7_5mg: { size: 3, move: 6, weapon: :mac_m1931, hull: [1, 1, 1], turret: [1, 1, 1] },
              amr_35_13_2mg: { size: 3, move: 6, weapon: :hotchkiss_13_2mm, hull: [1, 1, 1], turret: [1, 1, 1] },
              amr_35_zt2: { size: 3, move: 6, weapon: :"25mm_hotchkiss", hull: [1, 1, 1], turret: [1, 1, 1] },
              fcm_36: { size: 3, move: 4, weapon: :"37mm_sa_18", hull: [3, 3, 3], turret: [3, 3, 3] },
              hotchkiss_h35: { size: 3, move: 4, weapon: :"37mm_sa_18", hull: [3, 3, 3], turret: [3, 3, 3] },
              hotchkiss_h35_39: { size: 3, move: 4, weapon: :"37mm_sa_18", hull: [3, 3, 3], turret: [3, 3, 3] },
              renault_r35: { size: 3, move: 4, weapon: :"37mm_sa_18", breakdown: 3, hull: [3, 3, 3], turret: [3, 3, 3] },
              renault_r40: { size: 3, move: 4, weapon: :"37mm_sa_18", hull: [3, 3, 3], turret: [3, 3, 3] },
              amc_35: { size: 3, move: 5, weapon: :"47mm_sa_35", breakdown: 4, hull: [2, 2, 2], turret: [2, 2, 2] },
              char_d2: { size: 4, move: 4, weapon: :"47mm_sa_35", hull: [3, 3, 3], turret: [3, 3, 3] },
              somua_s35: { size: 4, move: 4, weapon: :"47mm_sa_35", hull: [4, 3, 3], turret: [3, 3, 3] },
              pzkpfw_i: { size: 3, move: 5, weapon: :mg_34, hull: [1, 1, 1], turret: [1, 1, 1] },
              pzkpfw_ii_a_e: { size: 3, move: 6, weapon: :"2cm_kwk_30", hull: [1, 1, 1], turret: [1, 1, 1] },
              pzkpfw_ii_f: { size: 3, move: 5, weapon: :"2cm_kwk_30", hull: [3, 1, 1], turret: [1, 1, 1] },
              pzkpfw_ii_luchs: { size: 3, move: 5, weapon: :"2cm_kwk_38", hull: [3, 2, 2], turret: [2, 2, 2] },
              pzkpfw_35t: { size: 3, move: 5, weapon: :"3_7cm_kwk_34t", hull: [2, 1, 1], turret: [2, 1, 2] },
              pzkpfw_38t_a_d: { size: 3, move: 5, weapon: :"37_mm_kwk_38t", hull: [2, 1, 1], turret: [2, 1, 1] },
              pzkpfw_38t_e_g: { size: 3, move: 5, weapon: :"37_mm_kwk_38t", hull: [4, 1, 1], turret: [4, 1, 1] },
              pzkpfw_iii__39: { size: 4, move: 5, weapon: :"3_7cm_kwk_36", hull: [3, 3, 3], turret: [3, 3, 3] },
              pzkpfw_iii__40: { size: 4, move: 5, weapon: :"5cm_kwk_38", hull: [3, 3, 3], turret: [3, 3, 3] },
              pzkpfw_iii_j: { size: 4, move: 5, weapon: :"5cm_kwk_38", hull: [4, 4, 4], turret: [4, 4, 4] },
              pzkpfw_iii_l: { size: 4, move: 5, weapon: :"5cm_kwk_39", hull: [4, 4, 4], turret: [4, 4, 4] },
              pzkpfw_iii_n: { size: 4, move: 5, weapon: :"7_5cm_kwk_37", hull: [4, 4, 4], turret: [4, 4, 4] },
              pzkpfw_iv_a: { size: 4, move: 5, weapon: :"7_5cm_kwk_37", hull: [1, 1, 1], turret: [2, 1, 1] },
              pzkpfw_iv_b_c: { size: 4, move: 6, weapon: :"7_5cm_kwk_37", hull: [3, 1, 1], turret: [3, 1, 1] },
              pzkpfw_iv_d: { size: 4, move: 5, weapon: :"7_5cm_kwk_37", hull: [3, 2, 2], turret: [3, 2, 2] },
              pzkpfw_iv_e: { size: 4, move: 5, weapon: :"7_5cm_kwk_37", hull: [4, 3, 2], turret: [3, 2, 2] },
              pzkpfw_iv_f1: { size: 4, move: 5, weapon: :"7_5cm_kwk_37", hull: [4, 3, 2], turret: [4, 3, 3] },
              pzkpfw_iv_f2: { size: 4, move: 5, weapon: :"7_5cm_kwk_40s", hull: [4, 3, 2], turret: [4, 3, 3] },
              pzkpfw_iv_g: { size: 4, move: 5, weapon: :"7_5cm_kwk_40s", hull: [6, 3, 2], turret: [4, 3, 3] },
              pzkpfw_iv_h_j: { size: 5, move: 5, weapon: :"7_5cm_kwk_40", hull: [6, 3, 2], turret: [4, 3, 3] },
              panther_d: { size: 6, move: 5, weapon: :"7_5cm_kwk_42", breakdown: 3, hull: [6, 3, 3], turret: [7, 4, 4] },
              panther_a_g: { size: 6, move: 6, weapon: :"7_5cm_kwk_42", hull: [6, 3, 3], turret: [7, 4, 4] },
              tiger_i: { size: 7, move: 5, weapon: :"8_8cm_kwk_36", breakdown: 3, hull: [7, 4, 4], turret: [8, 6, 6] },
              tiger_ii: { size: 8, move: 4, weapon: :"8_8cm_kwk_43", breakdown: 4, hull: [9, 6, 6], turret: [9, 6, 6] },
              "38m_toldi_i": { size: 3, move: 6, weapon: :s_18_100, breakdown: 4, hull: [1, 1, 0], turret: [1, 1, 0] },
              "42m_toldi_ii": { size: 3, move: 6, weapon: :s_18_100, hull: [2, 1, 1], turret: [2, 1, 1] },
              "42m_toldi_iia": { size: 3, move: 6, weapon: :"37_42m", hull: [3, 1, 1], turret: [3, 1, 1] },
              l5_30: { size: 3, move: 4, weapon: :fiat_revelli_1935, hull: [1, 1, 0], turret: [1, 1, 1] },
              l6_40: { size: 3, move: 4, weapon: :breda_20_65, hull: [3, 1, 0], turret: [3, 3, 3] },
              m11_39: { size: 3, move: 4, weapon: :breda_m37, sponson: :"37mm_cannon", hull: [3, 1, 0], turret: [3, 3, 3] },
              m13_40: { size: 3, move: 4, weapon: :cannone_da_47_32, hull: [3, 2, 2], turret: [3, 3, 3] },
              m14_41: { size: 3, move: 4, weapon: :cannone_da_47_32, hull: [3, 2, 2], turret: [3, 3, 3] },
              m15_42: { size: 4, move: 5, weapon: :cannone_da_47_32, hull: [4, 2, 2], turret: [4, 3, 3] },
              p26_40: { size: 5, move: 5, weapon: :c_75_34, hull: [4, 3, 3], turret: [4, 3, 3] },
              type_94: { size: 3, move: 4, weapon: :type_3_hmg, hull: [1, 0, 0], turret: [1, 0, 0] },
              type_97_te_ke: { size: 3, move: 4, weapon: :"37mm_type_94", hull: [1, 0, 0], turret: [1, 1, 1] },
              type_97_te_ke_mg: { size: 3, move: 4, weapon: :type_92_hmg, hull: [1, 0, 0], turret: [1, 1, 1] },
              type_95_ha_go: { size: 3, move: 6, weapon: :"37mm_type_94", hull: [1, 1, 1], turret: [1, 1, 1] },
              type_89_i_go: { size: 3, move: 4, weapon: :"57mm_type_90", hull: [1, 0, 0], turret: [1, 0, 0] },
              type_97_chi_ha: { size: 3, move: 5, weapon: :"47mm_type_1", hull: [2, 1, 1], turret: [2, 1, 1] },
              type_97_kai: { size: 4, move: 4, weapon: :"47mm_type_1", hull: [2, 2, 2], turret: [3, 2, 2] },
              type_2_ka_mi: { size: 3, move: 4, weapon: :"37mm_type_1", amphibious: true, hull: [1, 0, 0], turret: [0, 0, 0] },
              sherman_firefly: { size: 5, move: 5, weapon: :qf_17_pounder, hull: [5, 3, 3], turret: [6, 5, 5] },
              light_tank_mk_vi: { size: 3, move: 6, weapon: :vickers_mg, hull: [1, 0, 0], turret: [1, 1, 1] },
              tetrarch: { size: 3, move: 7, weapon: :qf_2_pounder, hull: [1, 0, 0], turret: [1, 1, 1] },
              cruiser_mk_i: { size: 3, move: 5, weapon: :qf_2_pounder, breakdown: 3, hull: [1, 1, 1], turret: [1, 1, 1] },
              cruiser_mk_ii: { size: 3, move: 4, weapon: :qf_2_pounder, hull: [2, 2, 2], turret: [2, 2, 2] },
              cruiser_mk_iii: { size: 3, move: 7, weapon: :qf_2_pounder, breakdown: 3, hull: [1, 1, 1], turret: [1, 1, 1] },
              cruiser_mk_iv: { size: 3, move: 7, weapon: :qf_2_pounder, breakdown: 3, hull: [2, 2, 2], turret: [2, 2, 2] },
              crusader_i: { size: 4, move: 6, weapon: :qf_2_pounder, breakdown: 3, hull: [3, 3, 3], turret: [3, 3, 3] },
              crusader_ii: { size: 4, move: 6, weapon: :qf_2_pounder, breakdown: 3, hull: [4, 3, 3], turret: [4, 3, 3] },
              crusader_iii: { size: 4, move: 6, weapon: :qf_6pdr_mk_ii, breakdown: 3, hull: [4, 3, 3], turret: [4, 3, 3] },
              centaur: { size: 5, move: 7, weapon: :qf_75, hull: [5, 3, 3], turret: [6, 4, 4] },
              cromwell: { size: 5, move: 7, weapon: :qf_75, hull: [5, 3, 3], turret: [6, 4, 4] },
              challenger: { size: 5, move: 6, weapon: :qf_17_pounder, hull: [5, 3, 3], turret: [5, 3, 3] },
              comet: { size: 6, move: 6, weapon: :qf_77hv, hull: [5, 3, 3], turret: [7, 4, 4] },
              matilda_i: { size: 3, move: 3, weapon: :vickers_mg, hull: [4, 2, 2], turret: [4, 3, 3] },
              matilda_ii: { size: 5, move: 4, weapon: :qf_2_pounder, hull: [6, 5, 4], turret: [5, 5, 5] },
              valentine_i_vii: { size: 4, move: 5, weapon: :qf_2_pounder, hull: [5, 4, 4], turret: [5, 4, 4] },
              valentine_ix_x: { size: 4, move: 5, weapon: :qf_6pdr_mk_ii, hull: [5, 4, 4], turret: [5, 4, 4] },
              churchill_i_ii: { size: 6, move: 4, weapon: :qf_2_pounder, hull: [7, 5, 4], turret: [6, 5, 5] },
              churchill_iii_iv: { size: 6, move: 4, weapon: :qf_6pdr_mk_ii, hull: [7, 5, 4], turret: [6, 5, 5] },
              churchill_v_vi: { size: 6, move: 4, weapon: :qf_95, hull: [7, 5, 4], turret: [6, 5, 5] },
              churchill_vii_viii: { size: 6, move: 4, weapon: :qf_75, hull: [9, 6, 4], turret: [9, 6, 6] },
              vickers_6_ton: { size: 3, move: 5, weapon: :oqf_3_pounder, hull: [1, 1, 1], turret: [1, 1, 1] },
              m2a4: { size: 3, move: 7, weapon: :"37mm_m3", hull: [2, 2, 2], turret: [2, 2, 2] },
              m3_stuart: { size: 3, move: 5, weapon: :"37mm_m3", hull: [3, 2, 2], turret: [4, 3, 3] },
              m5_stuart: { size: 3, move: 5, weapon: :"37mm_m3", hull: [3, 2, 2], turret: [4, 3, 3] },
              m22_locust: { size: 3, move: 7, weapon: :"37mm_m3", hull: [1, 0, 0], turret: [1, 0, 0] },
              m24_chaffee: { size: 4, move: 5, weapon: :"75mm_m6", hull: [3, 2, 2], turret: [3, 2, 2] },
              m3_lee: { size: 5, move: 5, weapon: :"37mm_m3", sponson: :"75mm_m6", hull: [4, 3, 3], turret: [4, 4, 4] },
              m4_sherman: { size: 5, move: 5, weapon: :"75mm_m6", hull: [4, 3, 3], turret: [5, 4, 4] },
              m476_sherman: { size: 5, move: 5, weapon: :"76mm_m1", hull: [5, 3, 3], turret: [6, 5, 5] },
              m4105_sherman: { size: 5, move: 5, weapon: :"105mm_m4", hull: [4, 3, 3], turret: [5, 4, 4] },
              m4_sherman_jumbo: { size: 6, move: 4, weapon: :"75mm_m6", hull: [7, 5, 5], turret: [9, 9, 9] },
              m476_sher_jumbo: { size: 6, move: 4, weapon: :"76mm_m1", hull: [7, 5, 5], turret: [9, 9, 9] },
              m26_pershing: { size: 6, move: 5, weapon: :"90mm_m3", breakdown: 3, hull: [5, 5, 5], turret: [7, 5, 5] },
              bt_5: { size: 3, move: 9, weapon: :"45mm_19_k", hull: [1, 1, 1], turret: [1, 1, 1] },
              bt_7: { size: 3, move: 9, weapon: :"45mm_19_k", hull: [1, 1, 1], turret: [1, 1, 1] },
              t_26_m38: { size: 3, move: 4, weapon: :"45mm_19_k", hull: [1, 1, 1], turret: [1, 1, 1] },
              t_26_m39: { size: 3, move: 4, weapon: :"45mm_19_k", hull: [2, 1, 1], turret: [2, 1, 1] },
              t_70: { size: 3, move: 5, weapon: :"45mm_19_k", hull: [3, 3, 3], turret: [4, 3, 3] },
              t_34_m40: { size: 5, move: 6, weapon: :f_32, hull: [3, 3, 3], turret: [3, 3, 3] },
              t_34_m41: { size: 5, move: 6, weapon: :"76mm_f_22", hull: [3, 3, 3], turret: [4, 4, 3] },
              t_34_m42_m43: { size: 5, move: 6, weapon: :"76mm_f_22", hull: [3, 3, 3], turret: [6, 4, 3] },
              t_34_85: { size: 5, move: 6, weapon: :zis_s_53, hull: [3, 3, 3], turret: [6, 4, 3] },
              t_34_85_m44: { size: 5, move: 6, weapon: :zis_s_53, hull: [3, 3, 3], turret: [8, 4, 3] },
              kv_1_m39: { size: 6, move: 5, weapon: :f_32, breakdown: 4, hull: [5, 3, 3], turret: [4, 3, 3] },
              kv_1_m40: { size: 6, move: 5, weapon: :f_32, breakdown: 3, hull: [5, 4, 4], turret: [6, 4, 4] },
              kv_1_m41: { size: 6, move: 5, weapon: :f_32, breakdown: 3, hull: [6, 4, 4], turret: [6, 4, 4] },
              kv_1_m42: { size: 6, move: 5, weapon: :"76mm_f_22", breakdown: 3, hull: [8, 5, 5], turret: [8, 5, 5] },
              kv_1s: { size: 6, move: 5, weapon: :"76mm_f_22", hull: [6, 4, 4], turret: [6, 4, 4] },
              kv_2: { size: 7, move: 4, weapon: :m_10, breakdown: 3, hull: [7, 4, 4], turret: [7, 4, 4] },
              kv_85: { size: 6, move: 5, weapon: :zis_s_53, hull: [7, 4, 4], turret: [7, 4, 4] },
              is_2: { size: 6, move: 5, weapon: :a_19, hull: [7, 6, 6], turret: [8, 6, 6] },
              m_h_ctls_4: { size: 3, move: 7, weapon: :m1917_browning, hull: [2, 1, 1], turret: [2, 1, 1] },
              # SPGs and Tank Destroyers
              amr_35_zt3: { size: 3, move: 6, weapon: :"25mm_hotchkiss", hull: [1, 1, 1] },
              pzkpfw_ii_flamm: { size: 3, move: 6, weapon: :ft, hull: [3, 1, 1] },
              stug_iii_a: { size: 4, move: 5, weapon: :"7_5cm_kwk_37", breakdown: 3, hull: [4, 1, 1] },
              stug_iii_b_e: { size: 4, move: 5, weapon: :"7_5cm_kwk_37", hull: [4, 1, 1] },
              stug_iii_f_g: { size: 4, move: 5, weapon: :"7_5cm_kwk_40", hull: [6, 1, 1] },
              stuh_42: { size: 4, move: 5, weapon: :"10_5cm_lefh_18", hull: [6, 1, 1] },
              stug_iv: { size: 4, move: 5, weapon: :"7_5cm_kwk_40", hull: [6, 1, 1] },
              sdkfz_166: { size: 5, move: 4, weapon: :"15cm_stuh_43", hull: [7, 1, 1] },
              panzerjager_i: { size: 3, move: 6, weapon: :"4_7cm_pakt", hull: [1, 1, -1] },
              marder_i: { size: 3, move: 4, weapon: :"7_5cm_pak_40", hull: [1, 1, -1] },
              marder_ii: { size: 3, move: 5, weapon: :"7_5cm_pak_40", hull: [3, 1, -1] },
              marder_iii: { size: 3, move: 5, weapon: :"76mm_d_f_22", hull: [4, 1, -1] },
              marder_iii_h_m: { size: 3, move: 5, weapon: :"7_5cm_pak_40", hull: [4, 1, -1] },
              nashorn: { size: 5, move: 5, weapon: :"8_8cm_kwk_43", hull: [3, 1, -1] },
              elefant: { size: 8, move: 4, weapon: :"8_8cm_kwk_43", hull: [9, 3, 3] },
              jagdpanzer_iv: { size: 5, move: 5, weapon: :"7_5cm_kwk_42", hull: [6, 3, 2] },
              hetzer: { size: 4, move: 4, weapon: :"7_5cm_pak_39", hull: [4, 2, 2] },
              jagdpanther: { size: 6, move: 6, weapon: :"8_8cm_kwk_43", hull: [6, 4, 3] },
              jagdtiger: { size: 8, move: 4, weapon: :"12_8cm_pak_44", hull: [9, 6, 6] },
              l3_33: { size: 3, move: 6, weapon: :fiat_revelli_1935, hull: [1, 1, -1] },
              l3_35: { size: 3, move: 6, weapon: :breda_m37, hull: [1, 1, -1] },
              l3_38: { size: 3, move: 6, weapon: :hotchkiss_13_2mm, hull: [1, 1, -1] },
              semovente_da_47_32: { size: 3, move: 4, weapon: :cannone_da_47_32, hull: [3, 1, -1] },
              semovente_da_75_18: { size: 3, move: 5, weapon: :c_da_75_18, hull: [3, 2, 2] },
              type_97_chi_ha_ft: { size: 3, move: 5, weapon: :ft, hull: [2, 1, 1] },
              type_1_ho_ni_i: { size: 4, move: 5, weapon: :type_90_75mm, hull: [2, 2, -1] },
              type_1_ho_ni_ii: { size: 4, move: 5, weapon: :type_92_10cm, hull: [2, 2, -1] },
              type_1_ho_ni_iii: { size: 4, move: 4, weapon: :"75mm_type_90", hull: [2, 2, 1] },
              churchill_crocodile: { size: 6, move: 4, weapon: :qf_75, sponson: :ft_croc, hull: [9, 6, 4], turret: [9, 6, 6] },
              cruiser_mk_i_cs: { size: 3, move: 5, weapon: :qf_3_7_m, breakdown: 3, hull: [1, 1, 1], turret: [1, 1, 1] },
              cruiser_mk_ii_cs: { size: 3, move: 4, weapon: :qf_3_7_m, hull: [2, 2, 2], turret: [2, 2, 2] },
              crusader_i_cs: { size: 4, move: 6, weapon: :qf_3inch, breakdown: 3, hull: [4, 4, 4], turret: [4, 4, 4] },
              crusader_ii_cs: { size: 4, move: 6, weapon: :qf_3inch, breakdown: 3, hull: [4, 4, 4], turret: [4, 4, 4] },
              matilda_ii_cs: { size: 5, move: 4, weapon: :qf_3inch, breakdown: 3, hull: [6, 5, 4], turret: [5, 5, 5] },
              matilda_frog: { size: 5, move: 4, weapon: :ft, hull: [6, 5, 4], turret: [5, 5, 5] },
              valentine_iii_cs: { size: 4, move: 5, weapon: :qf_3inch, hull: [5, 4, 4], turret: [5, 4, 4] },
              m10_achilles_c: { size: 5, move: 5, weapon: :qf_17_pounder, hull: [4, 2, 2], turret: [4, 2, 2, -1] },
              m3a1_stuart_ft: { size: 3, move: 5, weapon: :ft, hull: [4, 3, 3] },
              m4_sherman_flame: { size: 5, move: 5, weapon: :ft, hull: [5, 3, 3], turret: [6, 5, 5] },
              m10: { size: 5, move: 5, weapon: :"76mm_m7", hull: [4, 2, 2], turret: [4, 2, 2, -1] },
              m10a1: { size: 5, move: 6, weapon: :"76mm_m7", hull: [4, 2, 2], turret: [4, 2, 2, -1] },
              m18_hellcat: { size: 4, move: 7, weapon: :"76mm_m1", hull: [1, 1, 1], turret: [2, 1, 1, -1] },
              m36_jackson: { size: 5, move: 5, weapon: :"90mm_m3", hull: [4, 2, 2], turret: [5, 3, 3, -1] },
              m8_scott: { size: 4, move: 5, weapon: :"75mm_m2_m3", hull: [3, 2, 2], turret: [3, 2, 2, -1] },
              su_76: { size: 3, move: 5, weapon: :"76mm_zis_3m", breakdown: 4, hull: [3, 1, 1] },
              su_76m: { size: 3, move: 5, weapon: :"76mm_zis_3m", hull: [3, 1, -1] },
              su_85: { size: 5, move: 6, weapon: :zis_s_53, hull: [3, 3, 3] },
              su_100: { size: 5, move: 6, weapon: :d_10s, hull: [5, 3, 3] },
              su_122: { size: 5, move: 6, weapon: :m_30, hull: [3, 3, 3] },
              su_152: { size: 6, move: 5, weapon: :m_10, hull: [5, 4, 3] },
              isu_122: { size: 6, move: 5, weapon: :a_19, hull: [8, 6, 6] },
              isu_152: { size: 7, move: 5, weapon: :m_10, hull: [8, 6, 6] },
            }
          end
          # rubocop:enable Metrics/MethodLength, Metrics/AbcSize, Metrics/CyclomaticComplexity
          # rubocop:enable Metrics/PerceivedComplexity, Layout/LineLength
        end
      end
    end
  end
end
