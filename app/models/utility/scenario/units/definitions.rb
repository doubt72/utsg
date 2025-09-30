# frozen_string_literal: true

module Utility
  class Scenario
    module Units
      module Definitions
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
            json[:o][:a] = 1 if data[:assault]
            json[:o][:r] = 1 if data[:rapid]
            json[:o][:j] = data[:break] || 3
            json[:o][:f] = data[:fix] || 16
          end

          def translate_names
            {
              colt_m_29: :m1917_browning,
              mg_30t: :zb_vz__30,
              czeck_lmg: :zb_vz__26,
              fn_m1930: :m1918_bar,
              type_24_maxim: :mg_08_15,
              type_triple_ten: :m1917_browning,
            }
          end

          def weapon_data
            {
              zb_vz__26: { fire: 4, range: 10, move: 0, assault: true, rapid: true, size: 1 },
              zb_vz__30: { fire: 4, range: 10, move: 0, assault: true, rapid: true, size: 1 },
              ls_26: { fire: 4, range: 5, move: 0, assault: true, rapid: true, size: 1 },
              maxim_m_32_33: { fire: 8, range: 12, move: -1, assault: false, rapid: true, size: 1 },
              m1915_chauchat: { fire: 2, range: 5, move: 0, assault: true, break: 4, fix: 17, rapid: true, size: 1 },
              m1915_hotchkiss: { fire: 5, range: 10, move: -1, assault: false, rapid: true, size: 1 },
              fm_24_29: { fire: 3, range: 10, move: 0, assault: true, rapid: true, size: 1 },
              mg_34: { fire: 5, range: 8, move: 0, assault: true, rapid: true, size: 1 },
              mg_42: { fire: 8, range: 8, move: 0, assault: true, rapid: true, size: 1 },
              mg_08_15: { fire: 8, range: 12, move: -1, assault: false, rapid: true, size: 1 },
              breda_30: { fire: 3, range: 6, move: 0, assault: false, break: 4, fix: 17, rapid: true, size: 1 },
              fiat_revelli_1935: { fire: 4, range: 10, move: -1, assault: false, break: 4, fix: 17, rapid: true, size: 1 },
              breda_m37: { fire: 8, range: 10, move: -1, assault: false, rapid: true, size: 1 },
              type_11_lmg: { fire: 2, range: 6, move: 0, assault: false, break: 5, fix: 17, rapid: true, size: 1 },
              type_96_lmg: { fire: 4, range: 8, move: 0, assault: true, break: 4, fix: 17, rapid: true, size: 1 },
              type_99_lmg: { fire: 6, range: 8, move: 0, assault: true, rapid: true, size: 1 },
              type_3_hmg: { fire: 4, range: 10, move: -1, assault: false, rapid: true, size: 1 },
              type_92_hmg: { fire: 8, range: 10, move: -2, assault: false, rapid: true, size: 1 },
              rkm_wz__28: { fire: 6, range: 6, move: 0, assault: true, rapid: true, size: 1 },
              mg_30: { fire: 4, range: 8, move: 0, assault: true, rapid: true, size: 1 },
              bren_lmg: { fire: 3, range: 6, move: 0, assault: true, rapid: true, size: 1 },
              vickers_mg: { fire: 6, range: 15, move: -1, assault: false, break: 2, fix: 15, rapid: true, size: 1 },
              lewis_gun: { fire: 4, range: 8, move: 0, assault: false, rapid: true, size: 1 },
              m1917_browning: { fire: 12, range: 12, move: -2, assault: false, rapid: true, size: 1 },
              m1918_bar: { fire: 5, range: 8, move: 0, assault: true, rapid: true, size: 1 },
              m1919_browning: { fire: 8, range: 8, move: -1, assault: false, rapid: true, size: 1 },
              m2_browning: { fire: 20, range: 15, move: -2, assault: false, rapid: true, size: 1 },
              pm_m1910: { fire: 6, range: 12, move: -2, assault: false, rapid: true, size: 1 },
              dp_27: { fire: 4, range: 8, move: 0, assault: true, rapid: true, size: 1 },
              sg_43: { fire: 6, range: 10, move: -1, assault: false, rapid: true, size: 1 },
              dshk: { fire: 24, range: 16, move: -2, assault: false, rapid: true, size: 1 },
            }
          end
          # rubocop:enable Metrics/MethodLength, Metrics/AbcSize, Metrics/CyclomaticComplexity
          # rubocop:enable Metrics/PerceivedComplexity, Layout/LineLength
        end
      end
    end
  end
end
