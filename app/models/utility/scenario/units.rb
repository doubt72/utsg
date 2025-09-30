# frozen_string_literal: true

module Utility
  class Scenario
    module Units # rubocop:disable Metrics/ModuleLength
      class << self
        # rubocop:disable Metrics/MethodLength, Metrics/AbcSize, Metrics/CyclomaticComplexity
        # rubocop:disable Metrics/PerceivedComplexity, Layout/LineLength
        def lookup_data
          # rubocop: disable Style/ClassVars
          @@lu ||= Markers.markers
                          .merge(Features.features)
                          .merge(Infantry.infantry)
                          .merge(InfantryWeapons.infantry_weapons)
                          .merge(Guns.guns)
                          .merge(tanks)
                          .merge(sp_guns)
                          .merge(half_tracks)
                          .merge(armored_cars)
                          .merge(trucks)
                          .merge(other)
          # rubocop: enable Style/ClassVars
        end

        def unit_definition(code)
          lookup = lookup_data
          if code.is_a? Array
            lookup[code[1]]&.merge(id: code[1])&.merge(x: code[0]) || { not_found: true, code: }
          else
            lookup[code]&.merge(id: code) || { not_found: true, code: }
          end
        end

        def sanitize(name)
          sanitized = name.gsub(%r{[-\s/.']}, "_").gsub(/['()]/, "").downcase
          sanitized = sanitized.gsub("ä", "a").gsub("ö", "o").gsub("ü", "u")
          sanitized = sanitized.gsub("é", "e")
          puts sanitized unless sanitized =~ /^[a-z0-9_]*$/
          sanitized
        end

        def all_factions
          %w[ger ita jap fin axm ussr usa uk fra chi alm]
        end

        def tanks
          lu = {}
          key = %i[c n y s f r v o]
          [
            # Romanian
            ["axm", "R-2", 38, 3, 8, 12, 5, { t: 1, p: 1, ha: { f: 2, s: 1, r: 1 }, ta: { f: 2, s: 1, r: 2 } }],
            ["axm", "T-3", 42, 4, 16, 16, 5, { t: 1, g: 1, ha: { f: 4, s: 4, r: 4 }, ta: { f: 4, s: 4, r: 4 } }],
            ["axm", "T-4", 43, 4, 32, 20, 5, { t: 1, p: 1, ha: { f: 6, s: 3, r: 2 }, ta: { f: 4, s: 3, r: 3 } }],
            ["axm", "T-38", 40, 3, 8, 14, 5, { t: 1, p: 1, ha: { f: 4, s: 1, r: 1 }, ta: { f: 4, s: 1, r: 1 }, sn: 1 }],
            # Hungarian
            ["axm", "38M Toldi I", 39, 3, 3, 8, 6, { t: 1, p: 1, ha: { f: 1, s: 1, r: 0 }, ta: { f: 1, s: 1, r: 0 }, bd: 4 }],
            ["axm", "42M Toldi II", 42, 3, 3, 8, 6, { t: 1, p: 1, ha: { f: 2, s: 1, r: 1 }, ta: { f: 2, s: 1, r: 1 } }],
            ["axm", "42M Toldi IIA", 43, 3, 8, 12, 6, { t: 1, p: 1, ha: { f: 3, s: 1, r: 1 }, ta: { f: 3, s: 1, r: 1 } }],
            ["chi", "T-26", 38, 3, 12, 16, 4, { t: 1, p: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 } }],
            ["chi", "Vickers 6-Ton", 34, 3, 8, 8, 4, { t: 1, p: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 } }],
            ["fra", "Char B1", 35, 5, 10, 12, 3, { t: 1, p: 1, ha: { f: 3, s: 3, r: 3 }, ta: { f: 3, s: 3, r: 3 }, sg: { f: 20, r: 12, t: "p" } }],
            ["fra", "Char B1 bis", 37, 5, 12, 12, 3, { t: 1, p: 1, ha: { f: 4, s: 4, r: 4 }, ta: { f: 3, s: 3, r: 3 }, sg: { f: 20, r: 12, t: "p" } }],
            ["fra", "AMR 33", 33, 3, 4, 8, 6, { r: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 } }],
            ["fra", "AMR 35 (7.5MG)", 36, 3, 4, 8, 6, { r: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 }, sn: 1 }],
            ["fra", "AMR 35 (13.2MG)", 36, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 }, sn: 2 }],
            ["fra", "AMR 35 ZT2", 36, 3, 4, 12, 6, { t: 1, p: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 } }],
            ["fra", "FCM 36", 38, 3, 8, 12, 4, { t: 1, p: 1, ha: { f: 3, s: 3, r: 3 }, ta: { f: 3, s: 3, r: 3 } }],
            ["fra", "Hotchkiss H35", 36, 3, 8, 12, 4, { t: 1, p: 1, ha: { f: 3, s: 3, r: 3 }, ta: { f: 3, s: 3, r: 3 } }],
            ["fra", "Hotchkiss H35/39", 39, 3, 10, 12, 4, { t: 1, p: 1, ha: { f: 3, s: 3, r: 3 }, ta: { f: 3, s: 3, r: 3 }, sn: 3 }],
            ["fra", "Renault R35", 36, 3, 8, 12, 4, { t: 1, p: 1, ha: { f: 3, s: 3, r: 3 }, ta: { f: 3, s: 3, r: 3 }, bd: 3 }],
            ["fra", "Renault R40", 36, 3, 10, 12, 4, { t: 1, p: 1, ha: { f: 3, s: 3, r: 3 }, ta: { f: 3, s: 3, r: 3 } }],
            ["fra", "AMC 35", 38, 3, 16, 16, 5, { t: 1, p: 1, ha: { f: 2, s: 2, r: 2 }, ta: { f: 2, s: 2, r: 2 }, bd: 4 }],
            ["fra", "Char D2", 36, 4, 16, 16, 4, { t: 1, p: 1, ha: { f: 3, s: 3, r: 3 }, ta: { f: 3, s: 3, r: 3 } }],
            ["fra", "SOMUA S35", 35, 4, 16, 16, 4, { t: 1, p: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 3, s: 3, r: 3 } }],
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
            ["ita", "M11/39", 39, 3, 5, 7, 4, { r: 1, ha: { f: 3, s: 1, r: 0 }, ta: { f: 3, s: 3, r: 3 }, sg: { f: 8, r: 12, t: "p" } }],
            ["ita", "M13/40", 40, 3, 12, 14, 4, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 3, s: 3, r: 3 } }],
            ["ita", "M14/41", 41, 3, 12, 14, 4, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 3, s: 3, r: 3 } }],
            ["ita", "M15/42", 43, 4, 12, 14, 5, { t: 1, p: 1, ha: { f: 4, s: 2, r: 2 }, ta: { f: 4, s: 3, r: 3 } }],
            ["ita", "M26/40", 43, 5, 24, 16, 5, { t: 1, p: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 4, s: 3, r: 3 } }],
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
            ["chi", "M3 Stuart", 42, 3, 7, 10, 5, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 4, s: 3, r: 3 } }],
            ["usa", "M5 Stuart", 42, 3, 7, 10, 5, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 4, s: 3, r: 3 } }],
            ["uk", "M3 Stuart", 41, 3, 7, 10, 5, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 4, s: 3, r: 3 } }],
            ["ussr", "M3 Stuart", 41, 3, 7, 10, 5, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 4, s: 3, r: 3 }, bd: 4 }],
            ["uk", "M22 Locust", 42, 3, 7, 10, 7, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 0, r: 0 } }],
            ["usa", "M24 Chaffee", 44, 4, 24, 16, 5, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 3, s: 2, r: 2 } }],
            ["uk", "M24 Chaffee", 44, 4, 24, 16, 5, { t: 1, p: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 3, s: 2, r: 2 } }],
            ["usa", "M3 Lee", 41, 5, 7, 10, 5, { t: 1, p: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 4, s: 4, r: 4 }, sg: { f: 20, r: 12, t: "p" } }],
            ["uk", "M3 Lee", 41, 5, 7, 10, 5, { t: 1, p: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 4, s: 4, r: 4 }, sg: { f: 20, r: 12, t: "p" } }],
            ["uk", "M3 Grant", 41, 5, 7, 10, 5, { t: 1, p: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 4, s: 4, r: 4 }, sg: { f: 20, r: 12, t: "p" } }],
            ["ussr", "M3 Grant", 41, 5, 7, 10, 5, { t: 1, p: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 4, s: 4, r: 4 }, bd: 4, sg: { f: 20, r: 12, t: "p" } }],
            ["usa", "M4 Sherman", 42, 5, 24, 16, 5, { t: 1, p: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 5, s: 4, r: 4 } }],
            ["usa", "M4(105) Sherman", 42, 5, 32, 16, 5, { t: 1, g: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 5, s: 4, r: 4 }, sn: 2 }],
            ["usa", "M4(76) Sherman", 43, 5, 40, 24, 5, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 }, sn: 1 }],
            ["usa", "M4A3E2 Sherman", 44, 6, 24, 16, 4, { t: 1, p: 1, ha: { f: 7, s: 5, r: 5 }, ta: { f: 9, s: 9, r: 9 }, sn: 2 }],
            ["usa", "M4A3E8 Sherman", 44, 6, 40, 24, 4, { t: 1, p: 1, ha: { f: 7, s: 5, r: 5 }, ta: { f: 9, s: 9, r: 9 }, sn: 2 }],
            ["chi", "M4 Sherman", 43, 5, 24, 16, 5, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 } }],
            ["fra", "M4 Sherman", 43, 5, 24, 16, 5, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 } }],
            ["uk", "M4 Sherman", 42, 5, 24, 16, 5, { t: 1, p: 1, ha: { f: 4, s: 3, r: 3 }, ta: { f: 5, s: 4, r: 4 } }],
            ["uk", "M4(76) Sherman", 43, 5, 40, 24, 5, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 }, sn: 1 }],
            ["uk", "Sherman Firefly", 43, 5, 40, 24, 5, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 } }],
            ["ussr", "M4 Sherman", 43, 5, 24, 16, 5, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 } }],
            ["ussr", "M4(76) Sherman", 44, 5, 40, 24, 5, { t: 1, p: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 }, sn: 1 }],
            ["usa", "M26 Pershing", 44, 6, 48, 32, 5, { t: 1, p: 1, ha: { f: 5, s: 5, r: 5 }, ta: { f: 7, s: 5, r: 5 }, bd: 3 }],
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
            tank[:o].merge!({ j: 3, f: 18, u: 1, k: 1 })
            lu[:"#{tank[:c]}_#{sanitize(tank[:n])}"] = tank
          end
          lu
        end

        def sp_guns # rubocop:disable Metrics/PerceivedComplexity
          lu = {}
          key = %i[c n y s f r v o]
          [
            # Hungarian
            ["axm", "Fiat L3", 35, 3, 10, 8, 6, { r: 1, ha: { f: 1, s: 1, r: -1 } }],
            ["fra", "AMR 35 ZT3", 36, 3, 4, 12, 6, { t: 1, p: 1, ha: { f: 1, s: 1, r: 1 } }],
            ["ger", "PzKpfw II Flamm", 40, 3, 24, 1, 6, { i: 1, ha: { f: 3, s: 1, r: 1 }, e: 1 }],
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
            ["ita", "Sv da 47/32", 42, 3, 12, 14, 4, { t: 1, p: 1, ha: { f: 3, s: 1, r: -1 } }],
            ["ita", "Sv da 75/18", 42, 3, 16, 14, 5, { t: 1, g: 1, ha: { f: 3, s: 2, r: 2 } }],
            ["jap", "Type 97 Chi-Ha FT", 41, 3, 24, 1, 5, { i: 1, ha: { f: 2, s: 1, r: 1 }, e: 1, sn: 3 }],
            ["jap", "Type 1 Ho-Ni I", 42, 4, 16, 16, 5, { t: 1, g: 1, ha: { f: 2, s: 2, r: -1 } }],
            ["jap", "Type 1 Ho-Ni II", 43, 4, 32, 20, 5, { t: 1, g: 1, ha: { f: 2, s: 2, r: -1 } }],
            ["jap", "Type 1 Ho-Ni III", 44, 4, 32, 20, 4, { t: 1, p: 1, ha: { f: 2, s: 2, r: 1 } }],
            ["uk", "Cruiser Mk I CS", 38, 3, 24, 16, 5, { t: 1, g: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 }, bd: 3, s: 1 }],
            ["uk", "Cruiser Mk II CS", 40, 3, 24, 16, 4, { t: 1, g: 1, ha: { f: 2, s: 2, r: 2 }, ta: { f: 2, s: 2, r: 2 }, s: 1 }],
            ["uk", "Crusader I CS", 41, 4, 16, 12, 6, { t: 1, g: 1, ha: { f: 4, s: 4, r: 4 }, ta: { f: 4, s: 4, r: 4 }, bd: 3, s: 1 }],
            ["uk", "Crusader II CS", 42, 4, 16, 12, 6, { t: 1, g: 1, ha: { f: 4, s: 4, r: 4 }, ta: { f: 4, s: 4, r: 4 }, bd: 3, s: 1 }],
            ["uk", "Matilda II CS", 39, 5, 16, 12, 4, { t: 1, g: 1, ha: { f: 6, s: 5, r: 4 }, ta: { f: 5, s: 5, r: 5 }, bd: 3, s: 1 }],
            ["uk", "Matilda Frog", 44, 5, 24, 1, 4, { i: 1, ha: { f: 6, s: 5, r: 4 }, ta: { f: 5, s: 5, r: 5 }, e: 1 }],
            ["uk", "Valentine III CS", 40, 4, 16, 12, 5, { t: 1, g: 1, ha: { f: 5, s: 4, r: 4 }, ta: { f: 5, s: 4, r: 4 }, s: 1 }],
            ["uk", "Churchill Crocodile", 44, 6, 24, 16, 4, { j: 4, t: 1, p: 1, ha: { f: 9, s: 6, r: 4 }, ta: { f: 9, s: 6, r: 6 }, sn: 3, sg: { f: 24, r: 1, t: "ft" } }],
            ["usa", "M3A1 Stuart FT", 44, 3, 24, 1, 5, { i: 1, ha: { f: 4, s: 3, r: 3 }, e: 1 }],
            ["usa", "M4A3R5 Sherman", 44, 5, 24, 1, 5, { i: 1, ha: { f: 5, s: 3, r: 3 }, ta: { f: 6, s: 5, r: 5 }, e: 1, sn: 2 }],
            ["usa", "M10", 42, 5, 32, 20, 5, { t: 1, p: 1, ha: { f: 4, s: 2, r: 2 }, ta: { f: 4, s: 2, r: 2, t: -1 } }],
            ["usa", "M10A1", 43, 5, 32, 20, 6, { t: 1, p: 1, ha: { f: 4, s: 2, r: 2 }, ta: { f: 4, s: 2, r: 2, t: -1 } }],
            ["usa", "M18 Hellcat", 43, 4, 40, 24, 7, { t: 1, p: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 2, s: 1, r: 1, t: -1 } }],
            ["usa", "M8 Scott", 42, 4, 24, 20, 5, { t: 1, g: 1, ha: { f: 3, s: 2, r: 2 }, ta: { f: 3, s: 3, r: 3 } }],
            ["usa", "M36 Jackson", 44, 5, 48, 32, 5, { t: 1, p: 1, ha: { f: 4, s: 2, r: 2 }, ta: { f: 5, s: 3, r: 3, t: -1 } }],
            ["fra", "M10", 43, 5, 32, 20, 5, { t: 1, p: 1, ha: { f: 4, s: 2, r: 2 }, ta: { f: 4, s: 2, r: 2, t: -1 } }],
            ["uk", "M10 Achilles", 42, 5, 32, 20, 5, { t: 1, p: 1, ha: { f: 4, s: 2, r: 2 }, ta: { f: 4, s: 2, r: 2, t: -1 } }],
            ["uk", "M10 Achilles C", 43, 5, 40, 24, 5, { t: 1, p: 1, ha: { f: 4, s: 2, r: 2 }, ta: { f: 4, s: 2, r: 2, t: -1 } }],
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
            spg[:o][:b] = 4 if spg[:o][:i]
            spg[:o][:u] = 1 if spg[:o][:ta]
            spg[:o].merge!({ k: 1 })
            spg[:o].merge!({ j: 3, f: 18 }) unless spg[:o][:sg]
            spg[:o].delete(:j) if spg[:o][:i]
            lu[:"#{spg[:c]}_#{sanitize(spg[:n])}"] = spg
          end
          lu
        end

        def half_tracks
          # Usually carriers (or base), sometimes fully tracked, some infantry, some more for artillery
          lu = {}
          key = %i[c n y s f r v o]
          [
            ["fra", "Renault UE", 32, 3, 0, 0, 4, { r: 1, ha: { f: 0, s: 0, r: 0, t: -1 }, tr: 2, trg: 1 }],
            ["fra", "Lorraine 37L", 39, 3, 0, 0, 5, { r: 1, ha: { f: 0, s: 0, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["ger", "SdKfz 250/1", 41, 3, 8, 8, 6, { r: 1, ha: { f: 1, s: 0, r: 0, t: -1 }, tr: 2, trg: 1 }],
            ["ger", "SdKfz 250/7", 41, 3, 20, 16, 6, { t: 1, m: 3, e: 1, ha: { f: 1, s: 0, r: 0, t: -1 } }],
            ["ger", "SdKfz 250/8", 41, 3, 16, 16, 6, { t: 1, g: 1, ha: { f: 1, s: 0, r: 0, t: -1 } }],
            ["ger", "SdKfz 250/9", 41, 3, 4, 10, 6, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0, t: -1 } }],
            ["ger", "SdKfz 250/10", 41, 3, 8, 16, 6, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0, t: -1 } }],
            ["ger", "SdKfz 250/11", 41, 3, 8, 10, 6, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0, t: -1 } }],
            ["ger", "SdKfz 251/1", 39, 3, 8, 8, 5, { r: 1, ha: { f: 1, s: 0, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["ger", "SdKfz 251/9", 39, 3, 16, 16, 5, { t: 1, g: 1, ha: { f: 1, s: 0, r: 0, t: -1 } }],
            ["ger", "SdKfz 251/10", 39, 3, 8, 16, 5, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0, t: -1 } }],
            ["ger", "SdKfz 251/16", 39, 3, 24, 1, 5, { i: 1, ha: { f: 1, s: 0, r: 0, t: -1 } }],
            ["jap", "Type 98 So-Da", 41, 3, 0, 0, 5, { r: 1, ha: { f: 1, s: 1, r: 1, t: -1 }, tr: 3, trg: 1 }],
            ["jap", "Type 100 Te-Re", 40, 3, 0, 0, 5, { r: 1, ha: { f: 0, s: 0, r: 0, t: -1 }, tr: 1 }],
            ["jap", "Type 1 Ho-Ha", 44, 3, 4, 8, 6, { r: 1, ha: { f: 0, s: 0, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["uk", "Loyd Carrier", 39, 3, 0, 0, 6, { r: 1, ha: { f: 0, s: 0, r: 0, t: -1 }, tr: 2, trg: 1 }],
            ["uk", "Universal Carrier", 40, 3, 3, 6, 7, { r: 1, ha: { f: 0, s: 0, r: 0, t: -1 }, sn: 1, tr: 2, trg: 1 }],
            ["uk", "U Carrier 2Pdr", 41, 3, 10, 12, 7, { t: 1, p: 1, ha: { f: 0, s: 0, r: 0, t: -1 } }],
            ["uk", "U Carrier 6Pdr", 41, 3, 20, 16, 7, { t: 1, p: 1, ha: { f: 0, s: 0, r: 0, t: -1 } }],
            ["uk", "U Carrier Wasp", 41, 3, 24, 1, 7, { i: 1, ha: { f: 0, s: 0, r: 0, t: -1 } }],
            ["usa", "M2 Half-track", 41, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["usa", "M3 Half-track", 41, 3, 6, 8, 6, { r: 1, ha: { f: 1, s: 1, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["usa", "M3A1 Half-track", 42, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["uk", "M5 Half-track", 42, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["ussr", "M5 Half-track", 42, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["chi", "M5 Half-track", 42, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["ussr", "M9 Half-track", 41, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["fra", "M9 Half-track", 41, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["usa", "M2 Half-track", 41, 3, 10, 12, 6, { r: 1, ha: { f: 1, s: 1, r: 0, t: -1 }, tr: 3, trg: 1 }],
            ["usa", "LVT-1", 42, 4, 10, 12, 5, { r: 1, amp: 1, tr: 3, bd: 3 }],
            ["usa", "LVT-2", 42, 4, 7, 10, 5, { t: 1, p: 1, amp: 1, tr: 3, bd: 3 }],
            ["usa", "LVT(A)-1", 44, 4, 7, 10, 5, { u: 1, t: 1, g: 1, ha: { f: 3, s: 0, r: 0 }, ta: { f: 4, s: 3, r: 3 }, amp: 1, tr: 3, bd: 3 }],
            ["usa", "LVT(A)-4", 44, 4, 24, 20, 5, { u: 1, t: 1, g: 1, ha: { f: 3, s: 0, r: 0 }, ta: { f: 3, s: 2, r: 2, t: -1 }, amp: 1, tr: 3, bd: 3 }],
            ["usa", "LVT-1 Armor", 43, 4, 10, 12, 5, { r: 1, ha: { f: 1, s: 0, r: 0, t: -1 }, amp: 1, tr: 3, bd: 3 }],
            ["usa", "LVT-2 Armor", 43, 4, 7, 10, 5, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0, t: -1 }, amp: 1, tr: 3, bd: 3 }],
            ["usa", "M3 GMC", 42, 3, 24, 20, 6, { t: 1, g: 1, ha: { f: 1, s: 1, r: 0, t: -1 } }],
            ["usa", "T19 GMC", 42, 3, 40, 24, 6, { t: 1, g: 1, ha: { f: 1, s: 1, r: 0, t: -1 } }],
            ["uk", "T48 GMC", 42, 3, 20, 16, 6, { t: 1, p: 1, ha: { f: 1, s: 1, r: 0, t: -1 } }],
            ["ussr", "T48 GMC", 42, 3, 20, 16, 6, { t: 1, p: 1, ha: { f: 1, s: 1, r: 0, t: -1 } }],
            ["usa", "T19/M21 MMC", 42, 3, 20, 20, 6, { t: 1, m: 3, e: 1, ha: { f: 1, s: 1, r: 0, t: -1 } }],
          ].each do |unit|
            ht = { t: "ht", i: "ht" }
            unit.each_with_index do |v, i|
              ht[key[i]] = v
            end
            ht[:i] = "htgun" if ht[:o][:g]
            ht[:i] = "htat" if ht[:o][:p]
            ht[:i] = "htmtr" if ht[:o][:m]
            ht[:i] = "htft" if ht[:o][:i]
            ht[:i] += "-amp" if ht[:o][:amp]
            ht[:o].merge!({ k: 1 })
            ht[:o][:m] || ht[:o][:i] ? ht[:o].merge!({ b: 3 }) : ht[:o].merge!({ j: 3, f: 18 })
            lu[:"#{ht[:c]}_#{sanitize(ht[:n])}"] = ht
          end
          lu
        end

        def armored_cars
          # Except one half-track
          lu = {}
          key = %i[c n y s f r v o]
          [
            ["fra", "Schneider P16", 28, 3, 8, 12, 5, { t: 1, p: 1, ha: { f: 1, s: 1, r: 1 }, ta: { f: 1, s: 1, r: 1 }, tr: 1 }],
            ["fra", "White AM AC", 15, 3, 8, 12, 4, { t: 1, p: 1, ha: { f: 0, s: 0, r: 0 }, ta: { f: 0, s: 0, r: 0 }, tr: 1 }],
            ["fra", "Panhard 178", 37, 3, 4, 12, 5, { t: 1, p: 1, ha: { f: 2, s: 2, r: 2 }, ta: { f: 2, s: 2, r: 2 }, tr: 1 }],
            ["ger", "SdKfz 221", 35, 3, 8, 8, 5, { r: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 }, tr: 1 }],
            ["ger", "SdKfz 222", 37, 3, 3, 10, 5, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 }, tr: 1 }],
            ["ger", "SdKfz 234/1", 43, 3, 4, 10, 5, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 2, s: 0, r: 0 }, tr: 1 }],
            ["ger", "SdKfz 234/2", 43, 3, 24, 10, 5, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 3, s: 0, r: 0 }, tr: 1 }],
            ["ger", "SdKfz 234/3", 44, 3, 16, 16, 5, { t: 1, g: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 3, s: 0, r: 0 }, tr: 1 }],
            ["ger", "SdKfz 234/4", 44, 3, 32, 24, 5, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 3, s: 0, r: 0 }, tr: 1 }],
            ["ita", "Autoblinda 41", 41, 3, 3, 12, 4, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 }, tr: 1 }],
            ["jap", "Chiyoda AC", 31, 3, 4, 8, 4, { r: 1, ha: { f: 0, s: 0, r: 0 }, ta: { f: 0, s: 0, r: 0 }, tr: 1 }],
            ["jap", "Sumida Type 91", 33, 3, 4, 8, 3, { r: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 0, s: 0, r: 0 }, tr: 1 }],
            ["uk", "AEC AC I", 41, 3, 10, 12, 3, { t: 1, p: 1, ha: { f: 2, s: 2, r: 2 }, ta: { f: 5, s: 4, r: 4 }, tr: 1 }],
            ["uk", "AEC AC II", 42, 3, 20, 16, 4, { t: 1, p: 1, ha: { f: 2, s: 2, r: 2 }, ta: { f: 2, s: 2, r: 2 }, tr: 1 }],
            ["uk", "AEC AC II CS", 42, 3, 16, 12, 4, { t: 1, g: 1, ha: { f: 2, s: 2, r: 2 }, ta: { f: 2, s: 2, r: 2 }, tr: 1 }],
            ["uk", "Daimler AC", 41, 3, 10, 12, 4, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 }, tr: 1 }],
            ["uk", "Daimler AC CS", 41, 3, 16, 12, 4, { t: 1, g: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 }, tr: 1 }],
            ["uk", "Humber AC I", 40, 3, 12, 12, 4, { r: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 }, tr: 1 }],
            ["uk", "Humber AC IV", 42, 3, 24, 16, 4, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 }, tr: 1 }],
            ["uk", "T17E1 Staghound", 44, 3, 24, 16, 4, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 3, s: 1, r: 1 }, sn: 1, tr: 1 }],
            ["uk", "Humber LRC", 40, 3, 2, 8, 8, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 0, s: 0, r: 0 }, tr: 1 }],
            ["usa", "M3A1 Scout Car", 39, 3, 10, 12, 5, { r: 1, ha: { f: 1, s: 1, r: 1, t: -1 }, tr: 1 }],
            ["usa", "M8 Greyhound", 43, 3, 7, 10, 4, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 2, s: 2, r: 2, t: -1 }, bd: 3, tr: 1 }],
            ["usa", "M20 Greyhound", 43, 3, 10, 12, 4, { r: 1, ha: { f: 1, s: 0, r: 0, t: -1 }, tr: 1 }],
            ["chi", "M3A1 Scout Car", 39, 3, 10, 12, 5, { r: 1, ha: { f: 1, s: 1, r: 1, t: -1 }, tr: 1 }],
            ["fra", "M8 Greyhound", 43, 3, 7, 10, 4, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 2, s: 2, r: 2, t: -1 }, bd: 3, tr: 1 }],
            ["uk", "M3A1 Scout Car", 39, 3, 10, 12, 5, { r: 1, ha: { f: 1, s: 1, r: 1, t: -1 }, tr: 1 }],
            ["uk", "M8 Greyhound", 43, 3, 7, 10, 4, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0, t: -1 }, ta: { f: 2, s: 2, r: 2, t: -1 }, bd: 3, tr: 1 }],
            ["ussr", "M3A1 Scout Car", 39, 3, 10, 15, 5, { r: 1, ha: { f: 1, s: 1, r: 0, t: -1 }, tr: 1 }],
            ["ussr", "BA-10", 38, 3, 12, 16, 3, { t: 1, p: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 1, s: 1, r: 1 }, bd: 3, tr: 1 }],
            ["ussr", "BA-20", 36, 3, 4, 6, 5, { r: 1, ha: { f: 0, s: 0, r: 0 }, ta: { f: 0, s: 0, r: 0 }, tr: 1 }],
            ["ussr", "BA-64", 42, 3, 4, 6, 5, { r: 1, ha: { f: 1, s: 0, r: 0 }, ta: { f: 0, s: 0, r: 0 }, tr: 1 }],
          ].each do |unit|
            ac = { t: "ac", i: "ac" }
            unit.each_with_index do |v, i|
              ac[key[i]] = v
            end
            if ["M20 Greyhound", "M3A1 Scout Car"].include?(ac[:n])
              ac[:o].merge!({ j: 3, f: 18, uu: 1, w: 1 })
            else
              ac[:o].merge!({ j: 3, f: 18, u: 1, w: 1 })
            end
            if ac[:n] == "Schneider P16"
              ac[:o].delete(:w)
              ac[:o][:k] = 1
              ac[:i] = "acav"
            end
            lu[:"#{ac[:c]}_#{sanitize(ac[:n])}"] = ac
          end
          lu
        end

        def trucks
          lu = {}
          key = %i[c n i y s f r v o]
          [
            ["alm", "Horse", "cav", 0, 3, 0, 0, 7, { tr: 3 }],
            ["alm", "Sokol 1000", "cav-wheel", 33, 3, 0, 0, 6, { tr: 3 }],
            ["alm", "Polski Fiat 621", "truck", 35, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["axm", "Horse", "cav", 0, 3, 0, 0, 7, { tr: 3 }],
            ["chi", "Horse", "cav", 0, 3, 0, 0, 7, { tr: 3 }],
            ["fra", "Horse", "cav", 0, 3, 0, 0, 7, { tr: 3 }],
            ["fra", "Laffly S20", "truck", 37, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["fra", "Citroen U23", "truck", 35, 4, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ger", "Horse", "cav", 0, 3, 0, 0, 7, { tr: 3 }],
            ["ger", "BMW R75", "cav-wheel", 41, 3, 0, 0, 6, { tr: 3 }],
            ["ger", "Zündapp KS 750", "cav-wheel", 41, 3, 0, 0, 6, { sn: 1, tr: 3 }],
            ["ger", "BMW R17", "cav-wheel", 35, 3, 0, 0, 6, { tr: 3 }],
            ["ger", "Kettenkrad", "truck", 41, 2, 0, 0, 5, { tr: 1, trg: 1, k: 1 }],
            ["ger", "Maultier", "truck", 41, 3, 0, 0, 5, { tr: 3, trg: 1, k: 1 }],
            ["ger", "SdKfz 6", "truck", 39, 4, 0, 0, 5, { tr: 3, trg: 1, k: 1 }],
            ["ger", "SdKfz 7", "truck", 38, 3, 0, 0, 5, { tr: 2, trg: 1, k: 1 }],
            ["ger", "SdKfz 8", "truck", 37, 5, 0, 0, 5, { tr: 3, trg: 1, k: 1 }],
            ["ger", "SdKfz 9", "truck", 39, 5, 0, 0, 5, { tr: 3, trg: 1, k: 1 }],
            ["ger", "SdKfz 10", "truck", 38, 4, 0, 0, 5, { tr: 2, trg: 1, k: 1 }],
            ["ger", "SdKfz 11", "truck", 38, 4, 0, 0, 5, { tr: 2, trg: 1, k: 1 }],
            ["ger", "L3000", "truck", 38, 4, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ger", "Opel Blitz", "truck", 30, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ger", "BMW 325", "car", 36, 2, 0, 0, 5, { tr: 2, trg: 1 }],
            ["ger", "VW Kübelwagen", "car", 40, 2, 0, 0, 5, { sn: 1, tr: 1 }],
            ["ger", "m. E. Pkw", "car", 37, 2, 0, 0, 5, { tr: 2, trg: 1 }],
            ["ger", "s. E. Pkw", "truck", 38, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ger", "le. gl. Lkw", "truck", 37, 4, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ger", "L3000", "truck", 38, 4, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ita", "Alfa Romeo 430", "truck", 42, 4, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ita", "Alfa Romeo 500", "truck", 37, 4, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ita", "Alfa Romeo 800", "truck", 40, 5, 0, 0, 5, { tr: 3, trg: 1 }],
            ["jap", "Horse", "cav", 0, 3, 0, 0, 7, { tr: 3 }],
            ["jap", "Bicycle", "cav-wheel", 30, 3, 0, 0, 4, { w: 1, tr: 3 }],
            ["uk", "Horse", "cav", 0, 3, 0, 0, 7, { tr: 3 }],
            ["uk", "Bedford MW", "truck", 39, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["uk", "Bedford OY", "truck", 39, 4, 0, 0, 5, { tr: 3, trg: 1 }],
            ["uk", "Bedford QL", "truck", 41, 4, 0, 0, 5, { tr: 3, trg: 1 }],
            ["uk", "Ford F15", "truck", 39, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["uk", "Dodge D60", "truck", 39, 4, 0, 0, 5, { tr: 3, trg: 1 }],
            ["uk", "Chevy C30", "truck", 39, 4, 0, 0, 5, { tr: 3, trg: 1 }],
            ["uk", "Chevy C30 MG", "truck", 39, 4, 7, 10, 5, { uu: 1, r: 1, j: 3, f: 16, tr: 3, trg: 1 }],
            ["uk", "Chevy C30 AT", "truck", 39, 4, 7, 10, 5, { bw: 1, t: 1, p: 1, j: 3, f: 16, tr: 3, trg: 1 }],
            ["uk", "AEC Mk I Deacon", "truck", 42, 4, 20, 16, 5, { t: 1, p: 1, j: 3, f: 16, sn: 1 }],
            ["uk", "Dodge WC", "truck", 41, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["usa", "H-D WLA", "cav-wheel", 40, 3, 0, 0, 6, { tr: 3 }],
            ["usa", "Dodge VC", "truck", 40, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["usa", "Dodge WC", "truck", 41, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ussr", "Dodge WC", "truck", 42, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["fra", "Dodge WC", "truck", 41, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["uk", "Dodge WC", "truck", 41, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["usa", "GMC CCKW", "truck", 41, 4, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ussr", "Studebaker US6", "truck", 41, 4, 0, 0, 5, { sn: 1, tr: 3, trg: 1 }],
            ["usa", "Jeep", "car", 41, 2, 0, 0, 5, { tr: 1, trg: 1 }],
            ["uk", "Jeep", "car", 41, 2, 0, 0, 5, { tr: 1, trg: 1 }], # TODO: arm as needed, especially SAS
            ["ussr", "Jeep", "car", 41, 2, 0, 0, 5, { tr: 1, trg: 1 }],
            ["fra", "Jeep", "car", 41, 2, 0, 0, 5, { tr: 1, trg: 1 }],
            ["ussr", "Jeep", "car", 41, 2, 0, 0, 5, { tr: 1, trg: 1 }],
            ["usa", "Jeep .50 MG", "car", 41, 2, 10, 15, 5, { r: 1, j: 3, f: 16, trg: 1 }],
            ["uk", "Jeep MG", "car", 41, 2, 7, 10, 5, { r: 1, j: 3, f: 16, trg: 1 }],
            ["usa", "M6 GMC", "truck", 42, 3, 7, 10, 5, { t: 1, j: 3, f: 18, p: 1, bw: 1 }],
            ["usa", "GMC DUKW", "truck-amp", 42, 4, 0, 0, 5, { amp: 1, tr: 3 }],
            ["uk", "GMC DUKW", "truck-amp", 42, 4, 0, 0, 5, { amp: 1, tr: 3 }],
            ["ussr", "Horse", "cav", 0, 3, 0, 0, 7, { tr: 3 }],
            ["ussr", "PMZ-A-750", "cav-wheel", 34, 3, 0, 0, 5, { tr: 3 }],
            ["ussr", "Dnepr M-72", "cav-wheel", 42, 3, 0, 0, 6, { tr: 3 }],
            ["ussr", "GAZ-67", "car", 43, 2, 0, 0, 5, { tr: 1, trg: 1 }],
            ["ussr", "GAZ-AA", "truck", 32, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ussr", "GAZ-AAA", "truck", 36, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ussr", "GAZ-MM", "truck", 36, 3, 0, 0, 5, { tr: 3, trg: 1 }],
            ["ussr", "ZIS-5", "truck", 34, 3, 0, 0, 5, { tr: 3, trg: 1 }],
          ].each do |unit|
            truck = { t: "truck" }
            unit.each_with_index do |v, i|
              truck[key[i]] = v
            end
            truck[:o].merge!({ w: 1 }) if truck[:n] != "Horse" && !truck[:o][:k]
            truck[:t] = "cav" if %w[cav cav-wheel].include?(truck[:i])
            lu[:"#{truck[:c]}_#{sanitize(truck[:n])}"] = truck
          end
          lu
        end

        def other
          lu = {}
          key = %i[c n i y s f r v o]
          [
            ["ita", "Supply Dump", "supply", 0, 8, 0, 0, 0, {}],
          ].each do |unit|
            other = { t: "other" }
            unit.each_with_index do |v, i|
              other[key[i]] = v
            end
            lu[:"#{other[:c]}_#{sanitize(other[:n])}"] = other
          end
          lu
        end

        # rubocop:enable Metrics/PerceivedComplexity
        # rubocop:enable Metrics/MethodLength, Metrics/AbcSize, Metrics/CyclomaticComplexity
        # rubocop:enable Layout/LineLength
      end
    end
  end
end
