# frozen_string_literal: true

module Utility
  class Scenario
    module Units
      module Definitions # rubocop:disable Metrics/ModuleLength
        class << self
          # rubocop:disable Metrics/MethodLength, Metrics/AbcSize, Metrics/CyclomaticComplexity
          # rubocop:disable Metrics/PerceivedComplexity, Layout/LineLength, Lint/SymbolConversion
          # rubocop:disable Style/SymbolLiteral
          def populate_vehicle_data(key, json)
            actual_key = vehicle_aliases[key] || key
            data = vehicle_data[actual_key]
            raise "key missing: #{key}:#{actual_key} #{json}" unless data

            json[:o] = json[:o] || {}

            json[:s] = data[:sz]
            json[:v] = data[:mv]
            if data[:arm]
              json[:o][:ha] = {
                f: data[:arm][0], s: data[:arm][1], r: data[:arm][2],
              }
              json[:o][:ha][:t] = -1 if data[:arm].length > 3
            end
            if data[:trt]
              json[:o][:u] = 1
              json[:o][:ta] = {
                f: data[:trt][0], s: data[:trt][1], r: data[:trt][2],
              }
              json[:o][:ta][:t] = -1 if data[:trt].length > 3
            end
            json[:o][:bd] = data[:bd] if data[:bd]
            json[:o][:tr] = data[:trn] if data[:trn]
            json[:o][:amp] = 1 if data[:amp]
            json[:o][:uu] = 1 if data[:rot]
            json[:o][:trg] = 1 if data[:ctw]
            json[:o][:bw] = 1 if data[:bw]
            data[:whl] ? json[:o][:w] = 1 : json[:o][:k] = 1
            json[:o].delete(:k) if data[:ft]
            if data[:wpn]
              populate_gun_data(data[:wpn], json)
            else
              json[:f] = 0
              json[:r] = 0
            end
            populate_sponson_data(data[:spn], json) if data[:spn]
          end

          def populate_gun_data(key, json, move: false)
            actual_key = weapon_aliases[key] || key
            data = weapon_data[actual_key]
            raise "key missing: #{key}:#{actual_key} #{json}" unless data

            json[:o] = json[:o] || {}

            json[:f] = data[:fp]
            json[:r] = data[:rng]
            json[:v] = data[:mv] if move
            json[:s] = data[:sz] if move
            json[:o][:tow] = data[:twsz] if data[:twsz] && move
            json[:o][:c] = 1 if data[:crw] && move
            json[:o][:x] = 1 if data[:sgl]
            json[:o][:a] = 1 if data[:ass] && move
            json[:o][:r] = 1 if data[:rpd]
            json[:o][:s] = 1 if data[:smk]
            json[:o][:i] = 1 if data[:flm]
            json[:o][:o] = 1 if data[:off]
            json[:o][:e] = 1 if data[:area]
            json[:o][:m] = data[:mrng] if data[:mrng]
            json[:o][:t] = 1 if data[:tgt]
            json[:o][:g] = 1 if data[:gun]
            json[:o][:p] = 1 if data[:at]
            json[:o][:j] = data[:jam] || 3 unless data[:brk] || data[:sgl]
            json[:o][:f] = data[:fix] || 16 unless data[:brk] || data[:sgl]
            json[:o][:b] = data[:brk] if data[:brk]
          end

          def populate_sponson_data(key, json)
            actual_key = weapon_aliases[key] || key
            data = weapon_data[actual_key]
            raise "key missing: #{key}:#{actual_key} #{json}" unless data

            type = "p"
            type = "g" if data[:gun]
            type = "ft" if data[:flm]
            json[:o] = json[:o] || {}
            json[:o][:sg] = {
              f: data[:fp], r: data[:rng], t: type,
            }
          end

          def weapon_aliases
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
            }
          end

          def vehicle_aliases
            {
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
              "zb_vz__26": { fp: 4, rng: 10, mv: 0, ass: true, rpd: true, sz: 1 },
              "zb_vz__30": { fp: 4, rng: 10, mv: 0, ass: true, rpd: true, sz: 1 },
              "ls_26": { fp: 4, rng: 5, mv: 0, ass: true, rpd: true, sz: 1 },
              "maxim_m_32_33": { fp: 8, rng: 10, mv: -1, rpd: true, sz: 1 },
              "m1915_chauchat": { fp: 2, rng: 5, mv: 0, ass: true, jam: 4, fix: 17, rpd: true, sz: 1 },
              "m1915_hotchkiss": { fp: 5, rng: 10, mv: -1, rpd: true, sz: 1 },
              "fm_24_29": { fp: 3, rng: 10, mv: 0, ass: true, rpd: true, sz: 1 },
              "mg_34": { fp: 5, rng: 8, mv: 0, ass: true, rpd: true, sz: 1 },
              "mg_42": { fp: 8, rng: 8, mv: 0, ass: true, rpd: true, sz: 1 },
              "mg_08_15": { fp: 8, rng: 10, mv: -1, rpd: true, sz: 1 },
              "breda_30": { fp: 3, rng: 6, mv: 0, jam: 4, fix: 17, rpd: true, sz: 1 },
              "fiat_revelli_1935": { fp: 4, rng: 10, mv: -1, jam: 4, fix: 17, rpd: true, sz: 1 },
              "breda_m37": { fp: 8, rng: 10, mv: -1, rpd: true, sz: 1 },
              "type_11_lmg": { fp: 2, rng: 6, mv: 0, jam: 5, fix: 17, rpd: true, sz: 1 },
              "type_96_lmg": { fp: 4, rng: 8, mv: 0, ass: true, jam: 4, fix: 17, rpd: true, sz: 1 },
              "type_99_lmg": { fp: 6, rng: 8, mv: 0, ass: true, rpd: true, sz: 1 },
              "type_3_hmg": { fp: 4, rng: 10, mv: -1, rpd: true, sz: 1 },
              "type_92_hmg": { fp: 8, rng: 10, mv: -2, rpd: true, sz: 1 },
              "rkm_wz__28": { fp: 6, rng: 6, mv: 0, ass: true, rpd: true, sz: 1 },
              "mg_30": { fp: 4, rng: 8, mv: 0, ass: true, rpd: true, sz: 1 },
              "bren_lmg": { fp: 3, rng: 6, mv: 0, ass: true, rpd: true, sz: 1 },
              "vickers_mg": { fp: 6, rng: 12, mv: -1, jam: 2, fix: 15, rpd: true, sz: 1 },
              "lewis_gun": { fp: 4, rng: 8, mv: 0, rpd: true, sz: 1 },
              "m1917_browning": { fp: 12, rng: 12, mv: -2, rpd: true, sz: 1 },
              "m1918_bar": { fp: 5, rng: 8, mv: 0, ass: true, rpd: true, sz: 1 },
              "m1919_browning": { fp: 8, rng: 8, mv: -1, rpd: true, sz: 1 },
              "m2_browning": { fp: 20, rng: 12, mv: -2, rpd: true, sz: 1 },
              "pm_m1910": { fp: 6, rng: 10, mv: -2, rpd: true, sz: 1 },
              "dp_27": { fp: 4, rng: 8, mv: 0, ass: true, rpd: true, sz: 1 },
              "sg_43": { fp: 6, rng: 10, mv: -1, rpd: true, sz: 1 },
              "dshk": { fp: 24, rng: 12, mv: -2, rpd: true, sz: 1 },
              # Mortars
              "brandt_m1935": { fp: 20, rng: 15, mrng: 3, mv: -1, smk: true, tgt: true, brk: 3, area: true, sz: 1 },
              "brandt_m27_31": { fp: 20, rng: 17, mrng: 3, mv: -1, smk: true, tgt: true, brk: 3, area: true, sz: 1 },
              "m1917_fabry": { fp: 48, rng: 20, mrng: 6, mv: 1, smk: true, crw: true, twsz: 3, tgt: true, brk: 3, area: true, sz: 3 },
              "5cm_legrw_36": { fp: 8, rng: 12, mrng: 2, mv: 0, tgt: true, brk: 3, area: true, sz: 1 },
              "8cm_grw_34": { fp: 16, rng: 17, mrng: 3, mv: -2, smk: true, tgt: true, brk: 3, area: true, sz: 1 },
              "kz_8cm_grw_42": { fp: 16, rng: 16, mrng: 3, mv: -1, smk: true, tgt: true, brk: 3, area: true, sz: 1 },
              "12cm_grw_42": { fp: 32, rng: 32, mrng: 5, mv: 2, smk: true, crw: true, twsz: 2, tgt: true, brk: 3, area: true, sz: 2 },
              "brixia_m35": { fp: 8, rng: 12, mrng: 2, mv: 0, tgt: true, brk: 3, area: true, sz: 1 },
              "81_14_m35": { fp: 20, rng: 18, mrng: 3, mv: -1, smk: true, tgt: true, brk: 3, area: true, sz: 1 },
              "type_10_gren_l": { fp: 8, rng: 7, mrng: 2, mv: 0, smk: true, tgt: true, brk: 3, area: true, sz: 1 },
              "type_89_gren_l": { fp: 8, rng: 8, mrng: 2, mv: 0, smk: true, tgt: true, brk: 3, area: true, sz: 1 },
              "type_97_81mm": { fp: 20, rng: 17, mrng: 3, mv: -2, smk: true, tgt: true, brk: 3, area: true, sz: 1 },
              "type_97_90mm": { fp: 20, rng: 27, mrng: 4, mv: -2, smk: true, tgt: true, brk: 3, area: true, sz: 1 },
              "type_94_90mm": { fp: 20, rng: 27, mrng: 4, mv: 2, smk: true, crw: true, twsz: 2, tgt: true, brk: 3, area: true, sz: 2 },
              "2inch_mortar": { fp: 10, rng: 15, mrng: 2, mv: 0, tgt: true, brk: 3, area: true, sz: 1 },
              "ml_3inch_mortar": { fp: 20, rng: 18, mrng: 3, mv: -1, smk: true, tgt: true, brk: 3, area: true, sz: 1 },
              "ml_4_2inch_mortar": { fp: 24, rng: 26, mrng: 5, mv: 2, smk: true, crw: true, twsz: 2, tgt: true, brk: 3, area: true, sz: 2 },
              "m2_mortar": { fp: 12, rng: 16, mrng: 2, mv: -1, tgt: true, brk: 3, area: true, sz: 1 },
              "m1_mortar": { fp: 20, rng: 24, mrng: 3, mv: -2, smk: true, tgt: true, brk: 3, area: true, sz: 1 },
              "m2_4_2inch_mortar": { fp: 24, rng: 28, mrng: 5, mv: 2, smk: true, crw: true, twsz: 2, tgt: true, brk: 3, area: true, sz: 2 },
              "rm_38": { fp: 8, rng: 14, mrng: 2, mv: 0, tgt: true, brk: 3, area: true, sz: 1 },
              "82_bm_37": { fp: 20, rng: 24, mrng: 3, mv: -2, smk: true, tgt: true, brk: 3, area: true, sz: 1 },
              "82_pm_41": { fp: 20, rng: 24, mrng: 3, mv: -2, smk: true, tgt: true, brk: 3, area: true, sz: 1 },
              "120_pm_38": { fp: 32, rng: 32, mrng: 5, mv: 2, smk: true, crw: true, twsz: 2, tgt: true, brk: 3, area: true, sz: 2 },
              # HE AT
              "panzerfaust": { fp: 20, rng: 1, mv: 0, tgt: true, sz: 1, sgl: true, at: true },
              "panzerschreck": { fp: 12, rng: 4, mv: 0, tgt: true, sz: 1, brk: 4, at: true },
              "piat": { fp: 10, rng: 3, mv: 0, tgt: true, sz: 1, brk: 4, at: true },
              "m1_bazooka": { fp: 8, rng: 4, mv: 0, tgt: true, sz: 1, brk: 5, at: true },
              "m1a1_bazooka": { fp: 10, rng: 4, mv: 0, tgt: true, sz: 1, brk: 4, at: true },
              "m9_bazooka": { fp: 10, rng: 4, mv: 0, tgt: true, sz: 1, brk: 4, at: true },
              "ampulomet": { fp: 16, rng: 7, mv: -1, tgt: true, sz: 1, brk: 5, flm: true, area: true },
              # AT Rifles
              "boys_at_rifle": { fp: 3, rng: 4, mv: -1, tgt: true, at: true, fix: 18, sz: 1 },
              "s_18_100": { fp: 3, rng: 6, mv: -2, tgt: true, at: true, fix: 18, sz: 1 },
              "wz__35_at_rifle": { fp: 2, rng: 4, mv: 0, tgt: true, at: true, fix: 18, sz: 1 },
              "lahti_l_39": { fp: 3, rng: 6, mv: -2, tgt: true, at: true, fix: 18, sz: 1 },
              "type_97_ac": { fp: 3, rng: 4, mv: -2, tgt: true, at: true, fix: 18, sz: 1 },
              # Artillery
              "radio_75mm": { fp: 24, rng: 99, mv: 0, smk: true, off: true, area: true, fix: 18, sz: 1 },
              "radio_76mm": { fp: 24, rng: 99, mv: 0, smk: true, off: true, area: true, fix: 18, sz: 1 },
              "radio_85mm": { fp: 32, rng: 99, mv: 0, smk: true, off: true, area: true, fix: 18, sz: 1 },
              "radio_88mm": { fp: 32, rng: 99, mv: 0, smk: true, off: true, area: true, fix: 18, sz: 1 },
              "radio_100mm": { fp: 40, rng: 99, mv: 0, smk: true, off: true, area: true, fix: 18, sz: 1 },
              "radio_105mm": { fp: 40, rng: 99, mv: 0, smk: true, off: true, area: true, fix: 18, sz: 1 },
              "radio_114mm": { fp: 48, rng: 99, mv: 0, smk: true, off: true, area: true, fix: 18, sz: 1 },
              "radio_122mm": { fp: 48, rng: 99, mv: 0, smk: true, off: true, area: true, fix: 18, sz: 1 },
              "radio_140mm": { fp: 64, rng: 99, mv: 0, smk: true, off: true, area: true, fix: 18, sz: 1 },
              "radio_149mm": { fp: 64, rng: 99, mv: 0, smk: true, off: true, area: true, fix: 18, sz: 1 },
              "radio_15cm": { fp: 64, rng: 99, mv: 0, smk: true, off: true, area: true, fix: 18, sz: 1 },
              "radio_152mm": { fp: 64, rng: 99, mv: 0, smk: true, off: true, area: true, fix: 18, sz: 1 },
              "radio_155mm": { fp: 80, rng: 99, mv: 0, smk: true, off: true, area: true, fix: 18, sz: 1 },
              "radio_17cm": { fp: 80, rng: 99, mv: 0, smk: true, off: true, area: true, fix: 18, sz: 1 },
              "radio_183mm": { fp: 96, rng: 99, mv: 0, smk: true, off: true, area: true, fix: 18, sz: 1 },
              "radio_8inch": { fp: 96, rng: 99, mv: 0, smk: true, off: true, area: true, fix: 18, sz: 1 },
              "radio_21cm": { fp: 96, rng: 99, mv: 0, smk: true, off: true, area: true, fix: 18, sz: 1 },
              # Field Guns
              "bofors_75mm": { fp: 16, rng: 20, mv: 1, tgt: true, fix: 18, gun: true, smk: true, crw: true, sz: 3, twsz: 3 },
              "75mm_m1897": { fp: 16, rng: 24, mv: 1, tgt: true, fix: 18, gun: true, smk: true, crw: true, sz: 3, twsz: 3 },
              "37mm_m1916": { fp: 6, rng: 14, mv: 2, tgt: true, fix: 18, gun: true, smk: true, crw: true, sz: 2, twsz: 2 },
              "7_5cm_gebg_36": { fp: 16, rng: 20, mv: 1, tgt: true, fix: 18, gun: true, smk: true, crw: true, sz: 3, twsz: 3 },
              "7_5cm_leig_18": { fp: 16, rng: 20, mv: 1, tgt: true, fix: 18, gun: true, smk: true, crw: true, sz: 3, twsz: 3 },
              "10_5cm_gebh_40": { fp: 24, rng: 32, mv: 1, tgt: true, fix: 18, gun: true, smk: true, crw: true, sz: 3, twsz: 3 },
              "15cm_sig_33": { fp: 48, rng: 24, mv: 1, tgt: true, fix: 18, gun: true, smk: true, crw: true, sz: 3, twsz: 3 },
              "cannone_da_65_17": { fp: 12, rng: 20, mv: 1, tgt: true, fix: 18, gun: true, smk: true, crw: true, sz: 3, twsz: 3 },
              "obice_da_75_18": { fp: 16, rng: 24, mv: 1, tgt: true, fix: 18, gun: true, smk: true, crw: true, sz: 3, twsz: 3 },
              "obice_da_100_17": { fp: 24, rng: 32, mv: 1, tgt: true, fix: 18, gun: true, smk: true, crw: true, sz: 3, twsz: 3 },
              "70mm_type_92": { fp: 16, rng: 16, mv: 2, tgt: true, fix: 18, gun: true, smk: true, crw: true, sz: 2, twsz: 2 },
              "qf_25_pounder": { fp: 20, rng: 32, mv: 1, tgt: true, fix: 18, gun: true, smk: true, crw: true, sz: 3, twsz: 3 },
              "qf_25pdr_short": { fp: 20, rng: 20, mv: 1, tgt: true, fix: 18, gun: true, smk: true, crw: true, sz: 3, twsz: 3 },
              "qf_4_5inch": { fp: 32, rng: 24, mv: 1, tgt: true, fix: 18, gun: true, smk: true, crw: true, sz: 3, twsz: 3 },
              "75mm_m1_pack": { fp: 16, rng: 20, mv: 1, tgt: true, fix: 18, gun: true, smk: true, crw: true, sz: 3, twsz: 3 },
              "76mm_zis_3": { fp: 16, rng: 28, mv: 1, tgt: true, fix: 18, gun: true, smk: true, crw: true, sz: 3, twsz: 3 },
              # AT Guns
              "25mm_hotchkiss": { fp: 4, rng: 12, mv: 2, tgt: true, fix: 18, at: true, crw: true, sz: 2, twsz: 2 },
              "47mm_apx": { fp: 12, rng: 16, mv: 1, tgt: true, fix: 18, at: true, crw: true, sz: 3, twsz: 3 },
              "2_8cm_spzb_41": { fp: 10, rng: 8, mv: 2, tgt: true, fix: 18, at: true, crw: true, sz: 2, twsz: 2 },
              "3_7cm_pak_36": { fp: 6, rng: 12, mv: 2, tgt: true, fix: 18, at: true, crw: true, sz: 2, twsz: 2 },
              "5cm_pak_38": { fp: 24, rng: 24, mv: 1, tgt: true, fix: 18, at: true, crw: true, sz: 3, twsz: 3 },
              "7_5cm_pak_97_38": { fp: 12, rng: 12, mv: 1, tgt: true, fix: 18, at: true, crw: true, sz: 3, twsz: 3 },
              "7_5cm_pak_40": { fp: 40, rng: 32, mv: 1, tgt: true, fix: 18, at: true, crw: true, sz: 3, twsz: 3 },
              "8_8cm_pak_43": { fp: 64, rng: 32, mv: 1, tgt: true, fix: 18, at: true, crw: true, sz: 3, twsz: 4 },
              "8_8cm_flak_36": { fp: 40, rng: 32, mv: 1, tgt: true, fix: 18, at: true, crw: true, sz: 3, twsz: 4 },
              "12_8cm_pak_44": { fp: 96, rng: 40, mv: 1, tgt: true, fix: 18, at: true, crw: true, sz: 3, twsz: 4 },
              "cannone_da_47_32": { fp: 6, rng: 12, mv: 2, tgt: true, fix: 18, at: true, crw: true, sz: 2, twsz: 2 },
              "cannone_da_47_40": { fp: 12, rng: 16, mv: 2, tgt: true, fix: 18, at: true, crw: true, sz: 2, twsz: 2 },
              "cannone_da_75_46": { fp: 24, rng: 24, mv: 1, tgt: true, fix: 18, at: true, crw: true, sz: 3, twsz: 4 },
              "cannone_da_90_53": { fp: 48, rng: 32, mv: 1, tgt: true, fix: 18, at: true, crw: true, sz: 3, twsz: 4 },
              "37mm_type_94": { fp: 5, rng: 12, mv: 2, tgt: true, fix: 18, at: true, crw: true, sz: 2, twsz: 2 },
              "37mm_type_1": { fp: 6, rng: 12, mv: 2, tgt: true, fix: 18, at: true, crw: true, sz: 2, twsz: 2 },
              "47mm_type_1": { fp: 12, rng: 16, mv: 1, tgt: true, fix: 18, at: true, crw: true, sz: 3, twsz: 3 },
              "75mm_type_90": { fp: 20, rng: 20, mv: 1, tgt: true, fix: 18, at: true, crw: true, sz: 3, twsz: 3 },
              "qf_2_pounder": { fp: 8, rng: 12, mv: 1, tgt: true, fix: 18, at: true, crw: true, sz: 3, twsz: 3 },
              "qf_6pdr_mk_ii": { fp: 16, rng: 20, mv: 1, tgt: true, fix: 18, at: true, crw: true, sz: 3, twsz: 3 },
              "qf_6pdr_mk_iv": { fp: 20, rng: 24, mv: 1, tgt: true, fix: 18, at: true, crw: true, sz: 3, twsz: 3 },
              "qf_17_pounder": { fp: 40, rng: 32, mv: 1, tgt: true, fix: 18, at: true, crw: true, sz: 3, twsz: 4 },
              "37mm_m3": { fp: 8, rng: 12, mv: 2, tgt: true, fix: 18, at: true, crw: true, sz: 2, twsz: 2 },
              "3inch_m5": { fp: 24, rng: 24, mv: 1, tgt: true, fix: 18, at: true, crw: true, sz: 3, twsz: 4 },
              "45mm_19_k": { fp: 8, rng: 12, mv: 1, tgt: true, fix: 18, at: true, crw: true, sz: 3, twsz: 3 },
              "45mm_53_k": { fp: 8, rng: 12, mv: 1, tgt: true, fix: 18, at: true, crw: true, sz: 3, twsz: 3 },
              "45mm_m_42": { fp: 12, rng: 16, mv: 1, tgt: true, fix: 18, at: true, crw: true, sz: 3, twsz: 3 },
              "57mm_zis_2": { fp: 24, rng: 24, mv: 1, tgt: true, fix: 18, at: true, crw: true, sz: 3, twsz: 3 },
              "76mm_f_22": { fp: 20, rng: 24, mv: 1, tgt: true, fix: 18, at: true, crw: true, sz: 3, twsz: 4 },
              "100mm_bs_3": { fp: 64, rng: 40, mv: 1, tgt: true, fix: 18, at: true, crw: true, sz: 3, twsz: 4 },
              "bofors_37mm_at": { fp: 8, rng: 12, mv: 2, tgt: true, fix: 18, at: true, crw: true, sz: 2, twsz: 2 },
              # Tank Weapons
              "hotchkiss_13_2mm": { fp: 16, rng: 12, mv: 0, rpd: true, sz: 1 },
              "mac_m1931": { fp: 6, rng: 10, mv: 0, rpd: true, sz: 1 },
              "vickers__50": { fp: 12, rng: 12, mv: 0, rpd: true, sz: 1 },
              "ft_croc": { fp: 24, rng: 2, brk: 4, flm: true, area: 1 },
              "ft": { fp: 24, rng: 1, brk: 4, flm: true, area: 1 },
              "7_5cm_kwk_37": { fp: 16, rng: 24, tgt: true, fix: 18, gun: true },
              "10_5cm_lefh_18": { fp: 24, rng: 32, tgt: true, fix: 18, gun: true },
              "15cm_stuh_43": { fp: 48, rng: 32, tgt: true, fix: 18, gun: true },
              "76mm_d_f_22": { fp: 16, rng: 24, tgt: true, fix: 18, gun: true },
              "c_da_75_18": { fp: 16, rng: 24, tgt: true, fix: 18, gun: true },
              "type_90_75mm": { fp: 16, rng: 24, tgt: true, fix: 18, gun: true },
              "type_92_10cm": { fp: 24, rng: 24, tgt: true, fix: 18, gun: true },
              "qf_95": { fp: 24, rng: 24, tgt: true, fix: 18, gun: true },
              "qf_3_7_m": { fp: 24, rng: 24, tgt: true, fix: 18, gun: true, smk: true },
              "qf_3inch": { fp: 16, rng: 24, tgt: true, fix: 18, gun: true, smk: true },
              "105mm_m4": { fp: 24, rng: 32, tgt: true, fix: 18, gun: true },
              "75mm_m2_m3": { fp: 16, rng: 24, tgt: true, fix: 18, gun: true },
              "m_10": { fp: 48, rng: 32, tgt: true, fix: 18, gun: true },
              "m_30": { fp: 32, rng: 32, tgt: true, fix: 18, gun: true },
              "76mm_zis_3m": { fp: 16, rng: 24, tgt: true, fix: 18, gun: true },
              "47mm_sa_35": { fp: 6, rng: 12, tgt: true, fix: 18, at: true },
              "37mm_sa_18": { fp: 4, rng: 12, tgt: true, fix: 18, at: true },
              "2cm_kwk_30": { fp: 4, rng: 12, tgt: true, fix: 18, at: true },
              "2cm_kwk_38": { fp: 6, rng: 12, tgt: true, fix: 18, at: true },
              "3_7cm_kwk_34t": { fp: 5, rng: 12, tgt: true, fix: 18, at: true },
              "37_mm_kwk_38t": { fp: 6, rng: 12, tgt: true, fix: 18, at: true },
              "3_7cm_kwk_36": { fp: 6, rng: 12, tgt: true, fix: 18, at: true },
              "5cm_kwk_38": { fp: 8, rng: 12, tgt: true, fix: 18, at: true },
              "5cm_kwk_39": { fp: 12, rng: 16, tgt: true, fix: 18, at: true },
              "7_5cm_kwk_40s": { fp: 24, rng: 24, tgt: true, fix: 18, at: true },
              "7_5cm_kwk_40": { fp: 40, rng: 32, tgt: true, fix: 18, at: true },
              "7_5cm_kwk_42": { fp: 40, rng: 32, tgt: true, fix: 18, at: true },
              "8_8cm_kwk_36": { fp: 48, rng: 40, tgt: true, fix: 18, at: true },
              "8_8cm_kwk_43": { fp: 80, rng: 40, tgt: true, fix: 18, at: true },
              "4_7cm_pakt": { fp: 10, rng: 12, tgt: true, fix: 18, at: true },
              "7_5cm_pak_39": { fp: 40, rng: 32, tgt: true, fix: 18, at: true },
              "breda_20_65": { fp: 2, rng: 12, tgt: true, fix: 18, at: true },
              "37mm_cannon": { fp: 4, rng: 12, tgt: true, fix: 18, at: true },
              "c_75_34": { fp: 16, rng: 24, tgt: true, fix: 18, at: true },
              "breda_m35": { fp: 2, rng: 12, tgt: true, fix: 18, at: true },
              "57mm_type_90": { fp: 12, rng: 20, tgt: true, fix: 18, at: true },
              "37_42m": { fp: 4, rng: 12, tgt: true, fix: 18, at: true },
              "qf_75": { fp: 16, rng: 24, tgt: true, fix: 18, at: true },
              "qf_77hv": { fp: 48, rng: 32, tgt: true, fix: 18, at: true },
              "oqf_3_pounder": { fp: 5, rng: 12, tgt: true, fix: 18, at: true },
              "qf_6_pounder": { fp: 16, rng: 20, tgt: true, fix: 18, at: true },
              "75mm_m6": { fp: 16, rng: 24, tgt: true, fix: 18, at: true },
              "76mm_m1": { fp: 32, rng: 24, tgt: true, fix: 18, at: true },
              "90mm_m3": { fp: 40, rng: 32, tgt: true, fix: 18, at: true },
              "76mm_m7": { fp: 24, rng: 24, tgt: true, fix: 18, at: true },
              "f_32": { fp: 16, rng: 24, tgt: true, fix: 18, at: true },
              "zis_s_53": { fp: 32, rng: 32, tgt: true, fix: 18, at: true },
              "a_19": { fp: 80, rng: 40, tgt: true, fix: 18, at: true },
              "d_10s": { fp: 80, rng: 40, tgt: true, fix: 18, at: true },
            }
          end

          def vehicle_data
            { # rubocop:disable Metric/CollectionLiteralLength
              # French Armored Vehicles
              "char_b1": { sz: 5, mv: 3, wpn: :"47mm_sa_35", spn: :"75mm_gun", arm: [3, 3, 3], trt: [3, 3, 3] },
              "char_b1_bis": { sz: 5, mv: 3, wpn: :"47mm_sa_35", spn: :"75mm_gun", arm: [4, 4, 4], trt: [3, 3, 3] },
              "amr_33": { sz: 3, mv: 6, wpn: :"mac_m1931", bd: 4, arm: [1, 1, 1], trt: [1, 1, 1] },
              "amr_35_7_5mg": { sz: 3, mv: 6, wpn: :"mac_m1931", arm: [1, 1, 1], trt: [1, 1, 1] },
              "amr_35_13_2mg": { sz: 3, mv: 6, wpn: :"hotchkiss_13_2mm", arm: [1, 1, 1], trt: [1, 1, 1] },
              "amr_35_zt2": { sz: 3, mv: 6, wpn: :"25mm_hotchkiss", arm: [1, 1, 1], trt: [1, 1, 1] },
              "fcm_36": { sz: 3, mv: 4, wpn: :"37mm_sa_18", arm: [3, 3, 3], trt: [3, 3, 3] },
              "hotchkiss_h35": { sz: 3, mv: 4, wpn: :"37mm_sa_18", arm: [3, 3, 3], trt: [3, 3, 3] },
              "renault_r35": { sz: 3, mv: 4, wpn: :"37mm_sa_18", bd: 3, arm: [3, 3, 3], trt: [3, 3, 3] },
              "renault_r40": { sz: 3, mv: 4, wpn: :"37mm_sa_18", arm: [3, 3, 3], trt: [3, 3, 3] },
              "amc_35": { sz: 3, mv: 5, wpn: :"47mm_sa_35", bd: 4, arm: [2, 2, 2], trt: [2, 2, 2] },
              "char_d2": { sz: 4, mv: 4, wpn: :"47mm_sa_35", arm: [3, 3, 3], trt: [3, 3, 3] },
              "somua_s35": { sz: 4, mv: 4, wpn: :"47mm_sa_35", arm: [4, 3, 3], trt: [3, 3, 3] },
              "amr_35_zt3": { sz: 3, mv: 6, wpn: :"25mm_hotchkiss", arm: [1, 1, 1] },
              "amc_schneider_p16": { sz: 3, mv: 6, wpn: :"37mm_sa_18", trn: 1, arm: [1, 1, 1], trt: [1, 1, 1] },
              "white_am_ac": { sz: 3, mv: 4, wpn: :"37mm_sa_18", whl: true, trn: 1, arm: [0, 0, 0], trt: [0, 0, 0] },
              "panhard_178": { sz: 3, mv: 5, wpn: :"25mm_hotchkiss", whl: true, trn: 1, arm: [2, 2, 2], trt: [2, 2, 2] },
              "renault_ue": { sz: 3, mv: 4, trn: 2, ctw: true, arm: [0, 0, 0, -1] },
              "lorraine_37l": { sz: 3, mv: 5, trn: 3, ctw: true, arm: [0, 0, 0, -1] },
              # German Armored Vehicles
              "pzkpfw_i": { sz: 3, mv: 5, wpn: :"mg_34", arm: [1, 1, 1], trt: [1, 1, 1] },
              "pzkpfw_ii_a_e": { sz: 3, mv: 6, wpn: :"2cm_kwk_30", arm: [1, 1, 1], trt: [1, 1, 1] },
              "pzkpfw_ii_f": { sz: 3, mv: 5, wpn: :"2cm_kwk_30", arm: [3, 1, 1], trt: [1, 1, 1] },
              "pzkpfw_ii_luchs": { sz: 3, mv: 5, wpn: :"2cm_kwk_38", arm: [3, 2, 2], trt: [2, 2, 2] },
              "pzkpfw_35t": { sz: 3, mv: 5, wpn: :"3_7cm_kwk_34t", arm: [2, 1, 1], trt: [2, 1, 2] },
              "pzkpfw_38t_a_d": { sz: 3, mv: 5, wpn: :"37_mm_kwk_38t", arm: [2, 1, 1], trt: [2, 1, 1] },
              "pzkpfw_38t_e_g": { sz: 3, mv: 5, wpn: :"37_mm_kwk_38t", arm: [4, 1, 1], trt: [4, 1, 1] },
              "pzkpfw_iii__39": { sz: 4, mv: 5, wpn: :"3_7cm_kwk_36", arm: [3, 3, 3], trt: [3, 3, 3] },
              "pzkpfw_iii__40": { sz: 4, mv: 5, wpn: :"5cm_kwk_38", arm: [3, 3, 3], trt: [3, 3, 3] },
              "pzkpfw_iii_j": { sz: 4, mv: 5, wpn: :"5cm_kwk_38", arm: [4, 4, 4], trt: [4, 4, 4] },
              "pzkpfw_iii_l": { sz: 4, mv: 5, wpn: :"5cm_kwk_39", arm: [4, 4, 4], trt: [4, 4, 4] },
              "pzkpfw_iii_n": { sz: 4, mv: 5, wpn: :"7_5cm_kwk_37", arm: [4, 4, 4], trt: [4, 4, 4] },
              "pzkpfw_iv_a": { sz: 4, mv: 5, wpn: :"7_5cm_kwk_37", arm: [1, 1, 1], trt: [2, 1, 1] },
              "pzkpfw_iv_b_c": { sz: 4, mv: 6, wpn: :"7_5cm_kwk_37", arm: [3, 1, 1], trt: [3, 1, 1] },
              "pzkpfw_iv_d": { sz: 4, mv: 5, wpn: :"7_5cm_kwk_37", arm: [3, 2, 2], trt: [3, 2, 2] },
              "pzkpfw_iv_e": { sz: 4, mv: 5, wpn: :"7_5cm_kwk_37", arm: [4, 3, 2], trt: [3, 2, 2] },
              "pzkpfw_iv_f1": { sz: 4, mv: 5, wpn: :"7_5cm_kwk_37", arm: [4, 3, 2], trt: [4, 3, 3] },
              "pzkpfw_iv_f2": { sz: 4, mv: 5, wpn: :"7_5cm_kwk_40s", arm: [4, 3, 2], trt: [4, 3, 3] },
              "pzkpfw_iv_g": { sz: 4, mv: 5, wpn: :"7_5cm_kwk_40s", arm: [6, 3, 2], trt: [4, 3, 3] },
              "pzkpfw_iv_h_j": { sz: 5, mv: 5, wpn: :"7_5cm_kwk_40", arm: [6, 3, 2], trt: [4, 3, 3] },
              "panther_d": { sz: 6, mv: 5, wpn: :"7_5cm_kwk_42", bd: 3, arm: [6, 3, 3], trt: [7, 4, 4] },
              "panther_a_g": { sz: 6, mv: 6, wpn: :"7_5cm_kwk_42", arm: [6, 3, 3], trt: [7, 4, 4] },
              "tiger_i": { sz: 7, mv: 5, wpn: :"8_8cm_kwk_36", bd: 3, arm: [7, 4, 4], trt: [8, 6, 6] },
              "tiger_ii": { sz: 8, mv: 4, wpn: :"8_8cm_kwk_43", bd: 4, arm: [9, 6, 6], trt: [9, 6, 6] },
              "pzkpfw_ii_flamm": { sz: 3, mv: 6, wpn: :"ft", arm: [3, 1, 1] },
              "stug_iii_a": { sz: 4, mv: 5, wpn: :"7_5cm_kwk_37", bd: 3, arm: [4, 1, 1] },
              "stug_iii_b_e": { sz: 4, mv: 5, wpn: :"7_5cm_kwk_37", arm: [4, 1, 1] },
              "stug_iii_f_g": { sz: 4, mv: 5, wpn: :"7_5cm_kwk_40", arm: [6, 1, 1] },
              "stuh_42": { sz: 4, mv: 5, wpn: :"10_5cm_lefh_18", arm: [6, 1, 1] },
              "stug_iv": { sz: 4, mv: 5, wpn: :"7_5cm_kwk_40", arm: [6, 1, 1] },
              "sdkfz_166": { sz: 5, mv: 4, wpn: :"15cm_stuh_43", arm: [7, 1, 1] },
              "panzerjager_i": { sz: 3, mv: 6, wpn: :"4_7cm_pakt", arm: [1, 1, -1] },
              "marder_i": { sz: 3, mv: 4, wpn: :"7_5cm_pak_40", arm: [1, 1, -1] },
              "marder_ii": { sz: 3, mv: 5, wpn: :"7_5cm_pak_40", arm: [3, 1, -1] },
              "marder_iii": { sz: 3, mv: 5, wpn: :"76mm_d_f_22", arm: [4, 1, -1] },
              "marder_iii_h_m": { sz: 3, mv: 5, wpn: :"7_5cm_pak_40", arm: [4, 1, -1] },
              "nashorn": { sz: 5, mv: 5, wpn: :"8_8cm_kwk_43", arm: [3, 1, -1] },
              "elefant": { sz: 8, mv: 4, wpn: :"8_8cm_kwk_43", arm: [9, 3, 3] },
              "jagdpanzer_iv": { sz: 5, mv: 5, wpn: :"7_5cm_kwk_42", arm: [6, 3, 2] },
              "hetzer": { sz: 4, mv: 4, wpn: :"7_5cm_pak_39", arm: [4, 2, 2] },
              "jagdpanther": { sz: 6, mv: 6, wpn: :"8_8cm_kwk_43", arm: [6, 4, 3] },
              "jagdtiger": { sz: 8, mv: 4, wpn: :"12_8cm_pak_44", arm: [9, 6, 6] },
              "sdkfz_221": { sz: 3, mv: 5, wpn: :"mg_34", whl: true, trn: 1, arm: [1, 0, 0, -1], trt: [1, 1, 1] },
              "sdkfz_222": { sz: 3, mv: 5, wpn: :"2cm_kwk_30", whl: true, trn: 1, arm: [1, 0, 0, -1], trt: [1, 1, 1] },
              "sdkfz_234_1": { sz: 3, mv: 5, wpn: :"2cm_kwk_38", whl: true, trn: 1, arm: [1, 0, 0, -1], trt: [2, 0, 0] },
              "sdkfz_234_2": { sz: 3, mv: 5, wpn: :"5cm_kwk_39", whl: true, trn: 1, arm: [1, 0, 0], trt: [3, 0, 0] },
              "sdkfz_234_3": { sz: 3, mv: 5, wpn: :"7_5cm_kwk_37", whl: true, trn: 1, arm: [1, 0, 0, -1], trt: [3, 0, 0] },
              "sdkfz_234_4": { sz: 3, mv: 5, wpn: :"7_5cm_kwk_40", whl: true, trn: 1, arm: [1, 0, 0, -1], trt: [3, 0, 0] },
              "sdkfz_250_1": { sz: 3, mv: 6, wpn: :"mg_34", trn: 2, ctw: true, arm: [1, 0, 0, -1] },
              "sdkfz_250_7": { sz: 3, mv: 6, wpn: :"81mm_mortar", arm: [1, 0, 0, -1] },
              "sdkfz_250_8": { sz: 3, mv: 6, wpn: :"7_5cm_kwk_37", arm: [1, 0, 0, -1] },
              "sdkfz_250_9": { sz: 3, mv: 6, wpn: :"2cm_kwk_38", arm: [1, 0, 0, -1] },
              "sdkfz_250_10": { sz: 3, mv: 6, wpn: :"3_7cm_pak_36", arm: [1, 0, 0, -1] },
              "sdkfz_250_11": { sz: 3, mv: 6, wpn: :"2_8cm_spzb_41", arm: [1, 0, 0, -1] },
              "sdkfz_251_1": { sz: 3, mv: 5, wpn: :"mg_34", trn: 3, ctw: true, arm: [1, 0, 0, -1] },
              "sdkfz_251_9": { sz: 3, mv: 5, wpn: :"7_5cm_kwk_37", arm: [1, 0, 0, -1] },
              "sdkfz_251_10": { sz: 3, mv: 5, wpn: :"3_7cm_pak_36", arm: [1, 0, 0, -1] },
              "sdkfz_251_16": { sz: 3, mv: 5, wpn: :"ft", arm: [1, 0, 0, -1] },
              # Hungarian Armored Vehicles
              "38m_toldi_i": { sz: 3, mv: 6, wpn: :"s_18_100", bd: 4, arm: [1, 1, 0], trt: [1, 1, 0] },
              "42m_toldi_ii": { sz: 3, mv: 6, wpn: :"s_18_100", arm: [2, 1, 1], trt: [2, 1, 1] },
              "42m_toldi_iia": { sz: 3, mv: 6, wpn: :"37_42m", arm: [3, 1, 1], trt: [3, 1, 1] },
              # Italian Armored Vehicles
              "l5_30": { sz: 3, mv: 4, wpn: :"fiat_revelli_1935", arm: [1, 1, 0], trt: [1, 1, 1] },
              "l6_40": { sz: 3, mv: 4, wpn: :"breda_20_65", arm: [3, 1, 0], trt: [3, 3, 3] },
              "m11_39": { sz: 3, mv: 4, wpn: :"breda_m37", spn: :"37mm_cannon", arm: [3, 1, 0], trt: [3, 3, 3] },
              "m13_40": { sz: 3, mv: 4, wpn: :"cannone_da_47_32", arm: [3, 2, 2], trt: [3, 3, 3] },
              "m14_41": { sz: 3, mv: 4, wpn: :"cannone_da_47_32", arm: [3, 2, 2], trt: [3, 3, 3] },
              "m15_42": { sz: 4, mv: 5, wpn: :"cannone_da_47_32", arm: [4, 2, 2], trt: [4, 3, 3] },
              "p26_40": { sz: 5, mv: 5, wpn: :"c_75_34", arm: [4, 3, 3], trt: [4, 3, 3] },
              "l3_33": { sz: 3, mv: 6, wpn: :"fiat_revelli_1935", arm: [1, 1, -1] },
              "l3_35": { sz: 3, mv: 6, wpn: :"breda_m37", arm: [1, 1, -1] },
              "l3_38": { sz: 3, mv: 6, wpn: :"hotchkiss_13_2mm", arm: [1, 1, -1] },
              "semovente_da_47_32": { sz: 3, mv: 4, wpn: :"cannone_da_47_32", arm: [3, 1, -1] },
              "semovente_da_75_18": { sz: 3, mv: 5, wpn: :"c_da_75_18", arm: [3, 2, 2] },
              "autoblindo_41": { sz: 3, mv: 4, wpn: :"breda_m35", whl: true, trn: 1, arm: [1, 0, 0], trt: [1, 1, 1] },
              # Japanese Armored Vehicles
              "type_94": { sz: 3, mv: 4, wpn: :"type_3_hmg", arm: [1, 0, 0], trt: [1, 0, 0] },
              "type_97_te_ke": { sz: 3, mv: 4, wpn: :"37mm_type_94", arm: [1, 0, 0], trt: [1, 1, 1] },
              "type_97_te_ke_mg": { sz: 3, mv: 4, wpn: :"type_92_hmg", arm: [1, 0, 0], trt: [1, 1, 1] },
              "type_95_ha_go": { sz: 3, mv: 6, wpn: :"37mm_type_94", arm: [1, 1, 1], trt: [1, 1, 1] },
              "type_89_i_go": { sz: 3, mv: 4, wpn: :"57mm_type_90", arm: [1, 0, 0], trt: [1, 0, 0] },
              "type_97_chi_ha": { sz: 3, mv: 5, wpn: :"47mm_type_1", arm: [2, 1, 1], trt: [2, 1, 1] },
              "type_97_kai": { sz: 4, mv: 4, wpn: :"47mm_type_1", arm: [2, 2, 2], trt: [3, 2, 2] },
              "type_2_ka_mi": { sz: 3, mv: 4, wpn: :"37mm_type_1", amp: true, arm: [1, 0, 0], trt: [0, 0, 0] },
              "type_97_chi_ha_ft": { sz: 3, mv: 5, wpn: :"ft", arm: [2, 1, 1] },
              "type_1_ho_ni_i": { sz: 4, mv: 5, wpn: :"type_90_75mm", arm: [2, 2, -1] },
              "type_1_ho_ni_ii": { sz: 4, mv: 5, wpn: :"type_92_10cm", arm: [2, 2, -1] },
              "type_1_ho_ni_iii": { sz: 4, mv: 4, wpn: :"75mm_type_90", arm: [2, 2, 1] },
              "chiyoda_ac": { sz: 3, mv: 4, wpn: :"type_3_hmg", whl: true, trn: 1, arm: [0, 0, 0], trt: [0, 0, 0] },
              "sumida_type_91": { sz: 3, mv: 3, wpn: :"type_3_hmg", whl: true, trn: 1, arm: [1, 0, 0], trt: [0, 0, 0] },
              "type_98_so_da": { sz: 3, mv: 5, trn: 3, ctw: true, arm: [1, 1, 1, -1] },
              "type_100_te_re": { sz: 3, mv: 5, trn: 1, arm: [0, 0, 0, -1] },
              "type_1_ho_ha": { sz: 3, mv: 6, wpn: :"type_99_lmg", trn: 3, ctw: true, arm: [0, 0, 0, -1] },
              # UK Armored Vehicles
              "sherman_firefly": { sz: 5, mv: 5, wpn: :"qf_17_pounder", arm: [5, 3, 3], trt: [6, 5, 5] },
              "light_tank_mk_vi": { sz: 3, mv: 6, wpn: :"vickers__50", arm: [1, 0, 0], trt: [1, 1, 1] },
              "tetrarch": { sz: 3, mv: 7, wpn: :"qf_2_pounder", arm: [1, 0, 0], trt: [1, 1, 1] },
              "cruiser_mk_i": { sz: 3, mv: 5, wpn: :"qf_2_pounder", bd: 3, arm: [1, 1, 1], trt: [1, 1, 1] },
              "cruiser_mk_ii": { sz: 3, mv: 4, wpn: :"qf_2_pounder", arm: [2, 2, 2], trt: [2, 2, 2] },
              "cruiser_mk_iii": { sz: 3, mv: 7, wpn: :"qf_2_pounder", bd: 3, arm: [1, 1, 1], trt: [1, 1, 1] },
              "cruiser_mk_iv": { sz: 3, mv: 7, wpn: :"qf_2_pounder", bd: 3, arm: [2, 2, 2], trt: [2, 2, 2] },
              "crusader_i": { sz: 4, mv: 6, wpn: :"qf_2_pounder", bd: 3, arm: [3, 3, 3], trt: [3, 3, 3] },
              "crusader_ii": { sz: 4, mv: 6, wpn: :"qf_2_pounder", bd: 3, arm: [4, 3, 3], trt: [4, 3, 3] },
              "crusader_iii": { sz: 4, mv: 6, wpn: :"qf_6pdr_mk_ii", bd: 3, arm: [4, 3, 3], trt: [4, 3, 3] },
              "centaur": { sz: 5, mv: 7, wpn: :"qf_75", arm: [5, 3, 3], trt: [6, 4, 4] },
              "cromwell": { sz: 5, mv: 7, wpn: :"qf_75", arm: [5, 3, 3], trt: [6, 4, 4] },
              "challenger": { sz: 5, mv: 6, wpn: :"qf_17_pounder", arm: [5, 3, 3], trt: [5, 3, 3] },
              "comet": { sz: 6, mv: 6, wpn: :"qf_77hv", arm: [5, 3, 3], trt: [7, 4, 4] },
              "matilda_i": { sz: 3, mv: 3, wpn: :"vickers__50", arm: [4, 2, 2], trt: [4, 3, 3] },
              "matilda_ii": { sz: 5, mv: 4, wpn: :"qf_2_pounder", arm: [6, 5, 4], trt: [5, 5, 5] },
              "valentine_i_vii": { sz: 4, mv: 5, wpn: :"qf_2_pounder", arm: [5, 4, 4], trt: [5, 4, 4] },
              "valentine_ix_x": { sz: 4, mv: 5, wpn: :"qf_6pdr_mk_ii", arm: [5, 4, 4], trt: [5, 4, 4] },
              "churchill_i_ii": { sz: 6, mv: 4, wpn: :"qf_2_pounder", arm: [7, 5, 4], trt: [6, 5, 5] },
              "churchill_iii_iv": { sz: 6, mv: 4, wpn: :"qf_6pdr_mk_ii", arm: [7, 5, 4], trt: [6, 5, 5] },
              "churchill_v_vi": { sz: 6, mv: 4, wpn: :"qf_95", arm: [7, 5, 4], trt: [6, 5, 5] },
              "churchill_vii_viii": { sz: 6, mv: 4, wpn: :"qf_75", arm: [9, 6, 4], trt: [9, 6, 6] },
              "vickers_6_ton": { sz: 3, mv: 5, wpn: :"oqf_3_pounder", arm: [1, 1, 1], trt: [1, 1, 1] },
              "churchill_crocodile": { sz: 6, mv: 4, wpn: :"qf_75", spn: :"ft_croc", arm: [9, 6, 4], trt: [9, 6, 6] },
              "cruiser_mk_i_cs": { sz: 3, mv: 5, wpn: :"qf_3_7_m", bd: 3, arm: [1, 1, 1], trt: [1, 1, 1] },
              "cruiser_mk_ii_cs": { sz: 3, mv: 4, wpn: :"qf_3_7_m", arm: [2, 2, 2], trt: [2, 2, 2] },
              "crusader_i_cs": { sz: 4, mv: 6, wpn: :"qf_3inch", bd: 3, arm: [4, 4, 4], trt: [4, 4, 4] },
              "crusader_ii_cs": { sz: 4, mv: 6, wpn: :"qf_3inch", bd: 3, arm: [4, 4, 4], trt: [4, 4, 4] },
              "matilda_ii_cs": { sz: 5, mv: 4, wpn: :"qf_3inch", bd: 3, arm: [6, 5, 4], trt: [5, 5, 5] },
              "matilda_frog": { sz: 5, mv: 4, wpn: :"ft", arm: [6, 5, 4], trt: [5, 5, 5] },
              "valentine_iii_cs": { sz: 4, mv: 5, wpn: :"qf_3inch", arm: [5, 4, 4], trt: [5, 4, 4] },
              "m10_achilles_c": { sz: 5, mv: 5, wpn: :"qf_17_pounder", arm: [4, 2, 2], trt: [4, 2, 2, -1] },
              "aec_ac_i": { sz: 3, mv: 3, wpn: :"qf_2_pounder", whl: true, trn: 1, arm: [2, 2, 2], trt: [5, 4, 4] },
              "aec_ac_ii": { sz: 3, mv: 4, wpn: :"qf_6_pounder", whl: true, trn: 1, arm: [2, 2, 2], trt: [2, 2, 2] },
              "aec_ac_ii_cs": { sz: 3, mv: 4, wpn: :"qf_75", whl: true, trn: 1, arm: [2, 2, 2], trt: [2, 2, 2] },
              "daimler_ac": { sz: 3, mv: 4, wpn: :"qf_2_pounder", whl: true, trn: 1, arm: [1, 0, 0], trt: [1, 1, 1] },
              "daimler_ac_cs": { sz: 3, mv: 4, wpn: :"qf_3inch", whl: true, trn: 1, arm: [1, 0, 0], trt: [1, 1, 1] },
              "humber_ac_i": { sz: 3, mv: 4, wpn: :"m2_browning", whl: true, trn: 1, arm: [1, 0, 0], trt: [1, 1, 1] },
              "humber_ac_iv": { sz: 3, mv: 4, wpn: :"37mm_m3", whl: true, trn: 1, arm: [1, 0, 0], trt: [1, 1, 1] },
              "t17e1_staghound": { sz: 3, mv: 4, wpn: :"37mm_m3", whl: true, trn: 1, arm: [1, 0, 0], trt: [3, 1, 1] },
              "humber_lrc": { sz: 3, mv: 6, wpn: :"boys_at_rifle", whl: true, trn: 1, arm: [1, 0, 0], trt: [0, 0, 0] },
              "loyd_carrier": { sz: 3, mv: 6, trn: 2, ctw: true, arm: [0, 0, 0, -1] },
              "universal_carrier": { sz: 3, mv: 7, wpn: :"bren_lmg", trn: 2, ctw: true, arm: [0, 0, 0, -1] },
              "u__carrier_2pdr": { sz: 3, mv: 7, wpn: :"qf_2_pounder", arm: [0, 0, 0, -1] },
              "u__carrier_6pdr": { sz: 3, mv: 7, wpn: :"qf_6_pounder", arm: [0, 0, 0, -1] },
              "u__carrier_wasp": { sz: 3, mv: 7, wpn: :"ft", arm: [0, 0, 0, -1] },
              # US Armored Vehicles
              "m2a4": { sz: 3, mv: 7, wpn: :"37mm_m3", arm: [2, 2, 2], trt: [2, 2, 2] },
              "m3_stuart": { sz: 3, mv: 5, wpn: :"37mm_m3", arm: [3, 2, 2], trt: [4, 3, 3] },
              "m5_stuart": { sz: 3, mv: 5, wpn: :"37mm_m3", arm: [3, 2, 2], trt: [4, 3, 3] },
              "m22_locust": { sz: 3, mv: 7, wpn: :"37mm_m3", arm: [1, 0, 0], trt: [1, 0, 0] },
              "m24_chaffee": { sz: 4, mv: 5, wpn: :"75mm_m6", arm: [3, 2, 2], trt: [3, 2, 2] },
              "m3_lee": { sz: 5, mv: 5, wpn: :"37mm_m3", spn: :"75mm_m6", arm: [4, 3, 3], trt: [4, 4, 4] },
              "m4_sherman": { sz: 5, mv: 5, wpn: :"75mm_m6", arm: [4, 3, 3], trt: [5, 4, 4] },
              "m476_sherman": { sz: 5, mv: 5, wpn: :"76mm_m1", arm: [5, 3, 3], trt: [6, 5, 5] },
              "m4105_sherman": { sz: 5, mv: 5, wpn: :"105mm_m4", arm: [4, 3, 3], trt: [5, 4, 4] },
              "m4_sherman_jumbo": { sz: 6, mv: 4, wpn: :"75mm_m6", arm: [7, 5, 5], trt: [9, 9, 9] },
              "m476_sh__jumbo": { sz: 6, mv: 4, wpn: :"76mm_m1", arm: [7, 5, 5], trt: [9, 9, 9] },
              "m26_pershing": { sz: 6, mv: 5, wpn: :"90mm_m3", bd: 3, arm: [5, 5, 5], trt: [7, 5, 5] },
              "m__h__ctls_4": { sz: 3, mv: 7, wpn: :"m1917_browning", arm: [2, 1, 1], trt: [2, 1, 1] },
              "m3a1_stuart_ft": { sz: 3, mv: 5, wpn: :"ft", arm: [4, 3, 3] },
              "m4_sherman_flame": { sz: 5, mv: 5, wpn: :"ft", arm: [5, 3, 3], trt: [6, 5, 5] },
              "m10": { sz: 5, mv: 5, wpn: :"76mm_m7", arm: [4, 2, 2], trt: [4, 2, 2, -1] },
              "m10a1": { sz: 5, mv: 6, wpn: :"76mm_m7", arm: [4, 2, 2], trt: [4, 2, 2, -1] },
              "m18_hellcat": { sz: 4, mv: 7, wpn: :"76mm_m1", arm: [1, 1, 1], trt: [2, 1, 1, -1] },
              "m36_jackson": { sz: 5, mv: 5, wpn: :"90mm_m3", arm: [4, 2, 2], trt: [5, 3, 3, -1] },
              "m8_scott": { sz: 4, mv: 5, wpn: :"75mm_m2_m3", arm: [3, 2, 2], trt: [3, 2, 2, -1] },
              "m3a1_scout_car": { sz: 3, mv: 5, wpn: :"m2_browning", whl: true, trn: 1, rot: true, arm: [1, 1, 1, -1] },
              "m8_greyhound": { sz: 3, mv: 4, wpn: :"37mm_m3", whl: true, bd: 3, trn: 1, arm: [1, 0, 0], trt: [2, 2, 2, -1] },
              "m20_greyhound": { sz: 3, mv: 4, wpn: :"m2_browning", whl: true, trn: 1, rot: true, arm: [1, 0, 0, -1] },
              "m2_half_track": { sz: 3, mv: 6, wpn: :"m2_browning", trn: 3, ctw: true, arm: [1, 1, 0, -1] },
              "m3_half_track": { sz: 3, mv: 6, wpn: :"m1919_browning", trn: 3, ctw: true, arm: [1, 1, 0, -1] },
              "m3a1_half_track": { sz: 3, mv: 6, wpn: :"m2_browning", trn: 3, ctw: true, arm: [1, 1, 0, -1] },
              "m5_half_track": { sz: 3, mv: 6, wpn: :"m2_browning", trn: 3, ctw: true, arm: [1, 1, 0, -1] },
              "m9_half_track": { sz: 3, mv: 6, wpn: :"m2_browning", trn: 3, ctw: true, arm: [1, 1, 0, -1] },
              "t19_m21_mmc": { sz: 3, mv: 6, wpn: :"81mm_mortar", arm: [1, 1, 0, -1] },
              "t48_gmc": { sz: 3, mv: 6, wpn: :"37mm_m3", arm: [1, 1, 0, -1] },
              "m3_gmc": { sz: 3, mv: 6, wpn: :"75mm_m2_m3", arm: [1, 1, 0, -1] },
              "t19_hmc": { sz: 3, mv: 6, wpn: :"105mm_m4", arm: [1, 1, 0, -1] },
              "lvt_1": { sz: 4, mv: 4, wpn: :"m2_browning", amp: true, bd: 4, trn: 3 },
              "lvt_2": { sz: 4, mv: 5, wpn: :"m2_browning", amp: true, bd: 3, trn: 3 },
              "lvt_4": { sz: 5, mv: 5, wpn: :"m2_browning", amp: true, bd: 3, trn: 3 },
              "lvta_1": { sz: 4, mv: 5, wpn: :"37mm_m3", amp: true, bd: 4, trn: 3, arm: [1, 0, 0], trt: [4, 3, 3] },
              "lvta_2": { sz: 4, mv: 5, wpn: :"m2_browning", amp: true, bd: 3, trn: 3, arm: [1, 0, 0, -1] },
              "lvta_4": { sz: 5, mv: 5, wpn: :"75mm_m2_m3", amp: true, bd: 3, trn: 3, arm: [1, 0, 0], trt: [4, 3, 3] },
              # USSR Armored Vehicles
              "bt_5": { sz: 3, mv: 9, wpn: :"45mm_19_k", arm: [1, 1, 1], trt: [1, 1, 1] },
              "bt_7": { sz: 3, mv: 9, wpn: :"45mm_19_k", arm: [1, 1, 1], trt: [1, 1, 1] },
              "t_26_m38": { sz: 3, mv: 4, wpn: :"45mm_19_k", arm: [1, 1, 1], trt: [1, 1, 1] },
              "t_26_m39": { sz: 3, mv: 4, wpn: :"45mm_19_k", arm: [2, 1, 1], trt: [2, 1, 1] },
              "t_70": { sz: 3, mv: 5, wpn: :"45mm_19_k", arm: [3, 3, 3], trt: [4, 3, 3] },
              "t_34_m40": { sz: 5, mv: 6, wpn: :"f_32", arm: [3, 3, 3], trt: [3, 3, 3] },
              "t_34_m41": { sz: 5, mv: 6, wpn: :"76mm_f_22", arm: [3, 3, 3], trt: [4, 4, 3] },
              "t_34_m42_m43": { sz: 5, mv: 6, wpn: :"76mm_f_22", arm: [3, 3, 3], trt: [6, 4, 3] },
              "t_34_85": { sz: 5, mv: 6, wpn: :"zis_s_53", arm: [3, 3, 3], trt: [6, 4, 3] },
              "t_34_85_m44": { sz: 5, mv: 6, wpn: :"zis_s_53", arm: [3, 3, 3], trt: [8, 4, 3] },
              "kv_1_m39": { sz: 6, mv: 5, wpn: :"f_32", bd: 4, arm: [5, 3, 3], trt: [4, 3, 3] },
              "kv_1_m40": { sz: 6, mv: 5, wpn: :"f_32", bd: 3, arm: [5, 4, 4], trt: [6, 4, 4] },
              "kv_1_m41": { sz: 6, mv: 5, wpn: :"f_32", bd: 3, arm: [6, 4, 4], trt: [6, 4, 4] },
              "kv_1_m42": { sz: 6, mv: 5, wpn: :"76mm_f_22", bd: 3, arm: [8, 5, 5], trt: [8, 5, 5] },
              "kv_1s": { sz: 6, mv: 5, wpn: :"76mm_f_22", arm: [6, 4, 4], trt: [6, 4, 4] },
              "kv_2": { sz: 7, mv: 4, wpn: :"m_10", bd: 3, arm: [7, 4, 4], trt: [7, 4, 4] },
              "kv_85": { sz: 6, mv: 5, wpn: :"zis_s_53", arm: [7, 4, 4], trt: [7, 4, 4] },
              "is_2": { sz: 6, mv: 5, wpn: :"a_19", arm: [7, 6, 6], trt: [8, 6, 6] },
              "su_76": { sz: 3, mv: 5, wpn: :"76mm_zis_3m", bd: 4, arm: [3, 1, 1] },
              "su_76m": { sz: 3, mv: 5, wpn: :"76mm_zis_3m", arm: [3, 1, -1] },
              "su_85": { sz: 5, mv: 6, wpn: :"zis_s_53", arm: [3, 3, 3] },
              "su_100": { sz: 5, mv: 6, wpn: :"d_10s", arm: [5, 3, 3] },
              "su_122": { sz: 5, mv: 6, wpn: :"m_30", arm: [3, 3, 3] },
              "su_152": { sz: 6, mv: 5, wpn: :"m_10", arm: [5, 4, 3] },
              "isu_122": { sz: 6, mv: 5, wpn: :"a_19", arm: [8, 6, 6] },
              "isu_152": { sz: 7, mv: 5, wpn: :"m_10", arm: [8, 6, 6] },
              "ba_10": { sz: 3, mv: 3, wpn: :"45mm_19_k", whl: true, bd: 3, trn: 1, arm: [1, 0, 0], trt: [1, 1, 1] },
              "ba_20": { sz: 3, mv: 5, wpn: :"dp_27", whl: true, trn: 1, arm: [0, 0, 0], trt: [0, 0, 0] },
              "ba_64": { sz: 3, mv: 5, wpn: :"dp_27", whl: true, trn: 1, arm: [1, 0, 0], trt: [0, 0, 0] },
              # Unarmored Vehicles
              "laffly_s20": { sz: 4, mv: 5, whl: true, trn: 3, ctw: true },
              "citroen_u23": { sz: 3, mv: 5, whl: true, trn: 3, ctw: true },
              "kettenkrad": { sz: 2, mv: 5, trn: 1, ctw: true },
              "maultier": { sz: 3, mv: 5, trn: 3, ctw: true },
              "sdkfz_6": { sz: 4, mv: 5, trn: 3, ctw: true },
              "sdkfz_7": { sz: 3, mv: 5, trn: 2, ctw: true },
              "sdkfz_8": { sz: 5, mv: 5, trn: 3, ctw: true },
              "sdkfz_9": { sz: 5, mv: 5, trn: 3, ctw: true },
              "sdkfz_10": { sz: 4, mv: 5, trn: 2, ctw: true },
              "sdkfz_11": { sz: 4, mv: 5, trn: 2, ctw: true },
              "m__benz_l3000": { sz: 4, mv: 5, whl: true, trn: 3, ctw: true },
              "opel_blitz": { sz: 3, mv: 5, whl: true, trn: 3, ctw: true },
              "bmw_325": { sz: 2, mv: 5, whl: true, trn: 2, ctw: true },
              "vw_kubelwagen": { sz: 2, mv: 5, whl: true, trn: 1 },
              "m__e__pkw": { sz: 2, mv: 5, whl: true, trn: 2, ctw: true },
              "s__e__pkw": { sz: 3, mv: 5, whl: true, trn: 3, ctw: true },
              "le__gl__lkw": { sz: 4, mv: 5, whl: true, trn: 3, ctw: true },
              "alfa_romeo_430": { sz: 4, mv: 5, whl: true, trn: 3, ctw: true },
              "alfa_romeo_500": { sz: 4, mv: 5, whl: true, trn: 3, ctw: true },
              "alfa_romeo_800": { sz: 4, mv: 5, whl: true, trn: 3, ctw: true },
              "polski_fiat_621": { sz: 4, mv: 5, whl: true, trn: 3, ctw: true },
              "bedford_mw": { sz: 3, mv: 5, whl: true, trn: 3, ctw: true },
              "bedford_oy": { sz: 4, mv: 5, whl: true, trn: 3, ctw: true },
              "bedford_ql": { sz: 4, mv: 5, whl: true, trn: 3, ctw: true },
              "ford_f15": { sz: 3, mv: 5, whl: true, trn: 3, ctw: true },
              "dodge_d60": { sz: 4, mv: 5, whl: true, trn: 3, ctw: true },
              "chevy_c30": { sz: 4, mv: 5, whl: true, trn: 3, ctw: true },
              "chevy_c30_mg": { sz: 4, mv: 5, wpn: :"vickers__50", whl: true, trn: 3, ctw: true, rot: true },
              "chevy_c30_at": { sz: 4, mv: 5, wpn: :"bofors_37mm_at", whl: true, trn: 3, ctw: true, bw: true },
              "aec_mk_i_deacon": { sz: 3, mv: 5, wpn: :"qf_6_pounder", whl: true },
              "jeep_mg": { sz: 2, mv: 5, wpn: :"lewis_gun", whl: true, ctw: true },
              "jeep_vickers__50": { sz: 2, mv: 5, wpn: :"vickers__50", whl: true, ctw: true },
              "dodge_vc_g_505": { sz: 3, mv: 5, whl: true, trn: 3, ctw: true },
              "dodge_wc_51": { sz: 4, mv: 5, whl: true, trn: 3, ctw: true },
              "gmc_cckw": { sz: 4, mv: 5, whl: true, trn: 3, ctw: true },
              "jeep": { sz: 2, mv: 5, whl: true, trn: 1, ctw: true },
              "jeep__50_mg": { sz: 2, mv: 5, wpn: :"m2_browning", whl: true, ctw: true },
              "m6_gmc": { sz: 3, mv: 5, wpn: :"37mm_m3", whl: true, bw: true },
              "gmc_dukw": { sz: 4, mv: 5, whl: true, amp: true, trn: 3 },
              "studebaker_us6": { sz: 4, mv: 5, whl: true, trn: 3, ctw: true },
              "gaz_67": { sz: 2, mv: 5, whl: true, trn: 1, ctw: true },
              "gaz_aa": { sz: 3, mv: 5, whl: true, trn: 3, ctw: true },
              "gaz_aaa": { sz: 4, mv: 5, whl: true, trn: 3, ctw: true },
              "gaz_mm": { sz: 3, mv: 5, whl: true, trn: 3, ctw: true },
              "zis_5": { sz: 4, mv: 5, whl: true, trn: 3, ctw: true },
              # Cavalry
              "bmw_r75": { sz: 3, mv: 6, whl: true, trn: 3 },
              "zundapp_ks_750": { sz: 3, mv: 6, whl: true, trn: 3 },
              "bmw_r17": { sz: 3, mv: 6, whl: true, trn: 3 },
              "bicycle": { sz: 3, mv: 4, whl: true, trn: 3 },
              "sokol_1000": { sz: 3, mv: 6, whl: true, trn: 3 },
              "harley_d__wla": { sz: 3, mv: 6, whl: true, trn: 3 },
              "pmz_a_750": { sz: 3, mv: 6, whl: true, trn: 3 },
              "dnepr_m_72": { sz: 3, mv: 6, whl: true, trn: 3 },
              "horse": { sz: 3, mv: 7, ft: true, trn: 3 },
            }
          end
          # rubocop:enable Metrics/MethodLength, Metrics/AbcSize, Metrics/CyclomaticComplexity
          # rubocop:enable Metrics/PerceivedComplexity, Layout/LineLength, Lint/SymbolConversion
          # rubocop:enable Style/SymbolLiteral
        end
      end
    end
  end
end
