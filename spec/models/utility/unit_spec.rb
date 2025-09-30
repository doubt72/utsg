# frozen_string_literal: true

require "rails_helper"

# rubocop:disable Layout/LineLength
RSpec.describe Utility::Scenario::Units do
  let(:defs) { Utility::Scenario::Units.lookup_data }

  context "all units" do
    # This is extraordinarily pedandic, since it requires tests to change every
    # time any unit definition changes, but we're using it for major refactoring
    # and definition integrity

    # This is just for units.  Don't care at all about how markers change.
    context "squads" do
      context "allied minors" do
        it "has static definitions" do
          expect(defs[:alm_conscript_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "alm", n: "Conscript", y: 0, m: 2, f: 6, r: 3, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:alm_elite_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "alm", n: "Elite", y: 0, m: 4, f: 7, r: 5, v: 5, o: {
              a: 1, s: 1,
            },
          }
          expect(defs[:alm_engineer_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "alm", n: "Engineer", y: 0, m: 4, f: 8, r: 3, v: 5, o: {
              a: 1, s: 1, eng: 1,
            },
          }
          expect(defs[:alm_regular_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "alm", n: "Regular", y: 0, m: 3, f: 6, r: 4, v: 4,
          }
        end
      end

      context "axis minors" do
        it "has static definitions" do
          expect(defs[:axm_conscript_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "axm", n: "Conscript", y: 0, m: 2, f: 6, r: 3, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:axm_elite_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "axm", n: "Elite", y: 0, m: 4, f: 7, r: 5, v: 5, o: {
              a: 1, s: 1,
            },
          }
          expect(defs[:axm_engineer_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "axm", n: "Engineer", y: 0, m: 4, f: 8, r: 3, v: 5, o: {
              a: 1, s: 1, eng: 1,
            },
          }
          expect(defs[:axm_regular_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "axm", n: "Regular", y: 0, m: 3, f: 6, r: 4, v: 4,
          }
        end
      end

      context "china" do
        it "has static definitions" do
          expect(defs[:chi_conscript_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "chi", n: "Conscript", y: 0, m: 2, f: 4, r: 3, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:chi_elite_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "chi", n: "Elite", y: 0, m: 4, f: 6, r: 4, v: 5, o: {
              a: 1,
            },
          }
          expect(defs[:chi_regular_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "chi", n: "Regular", y: 0, m: 3, f: 5, r: 4, v: 4,
          }
        end
      end

      context "finland" do
        it "has static definitions" do
          expect(defs[:fin_conscript_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "fin", n: "Conscript", y: 0, m: 2, f: 6, r: 3, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:fin_elite_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "fin", n: "Elite", y: 0, m: 4, f: 7, r: 5, v: 5, o: {
              a: 1, s: 1,
            },
          }
          expect(defs[:fin_regular_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "fin", n: "Regular", y: 0, m: 3, f: 6, r: 4, v: 4,
          }
          expect(defs[:fin_sissi_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "fin", n: "Sissi", y: 0, m: 4, f: 7, r: 5, v: 5,
          }
        end
      end

      context "france" do
        it "has static definitions" do
          expect(defs[:fra_bar_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "fra", n: "BAR", y: 0, m: 3, f: 8, r: 4, v: 4, o: {
              a: 1, s: 1,
            },
          }
          expect(defs[:fra_chasseur_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "fra", n: "Chasseur", y: 0, m: 3, f: 6, r: 4, v: 5, o: {
              s: 1,
            },
          }
          expect(defs[:fra_colonial_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "fra", n: "Colonial", y: 0, m: 2, f: 6, r: 3, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:fra_free_french_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "fra", n: "Free French", y: 41, m: 3, f: 7, r: 5, v: 4,
          }
          expect(defs[:fra_genie_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "fra", n: "Génie", y: 0, m: 4, f: 8, r: 3, v: 5, o: {
              a: 1, s: 1, eng: 1,
            },
          }
          expect(defs[:fra_legionnaire_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "fra", n: "Legionnaire", y: 0, m: 4, f: 7, r: 5, v: 5, o: {
              s: 1,
            },
          }
          expect(defs[:fra_reservist_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "fra", n: "Reservist", y: 0, m: 2, f: 6, r: 4, v: 4,
          }
        end
      end

      context "german" do
        it "has static definitions" do
          expect(defs[:ger_conscript_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "ger", n: "Conscript", y: 0, m: 2, f: 6, r: 3, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:ger_fallschirmjager_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "ger", n: "Fallschirmjäger", y: 35, m: 4, f: 7, r: 4, v: 5, o: {
              a: 1, s: 1,
            },
          }
          expect(defs[:ger_gebirgsjager_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "ger", n: "Gebirgsjäger", y: 0, m: 4, f: 7, r: 4, v: 5, o: {
              a: 1, s: 1,
            },
          }
          expect(defs[:ger_pionier_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "ger", n: "Pionier", y: 0, m: 4, f: 9, r: 3, v: 5, o: {
              a: 1, s: 1, eng: 1,
            },
          }
          expect(defs[:ger_rifle_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "ger", n: "Rifle", y: 0, m: 3, f: 7, r: 5, v: 4, o: {
              s: 1,
            },
          }
          expect(defs[:ger_ss_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "ger", n: "SS", y: 34, m: 4, f: 8, r: 5, v: 5, o: {
              a: 1, s: 1,
            },
          }
          expect(defs[:ger_sturm_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "ger", n: "Sturm", y: 0, m: 4, f: 8, r: 4, v: 5, o: {
              a: 1, s: 1,
            },
          }
          expect(defs[:ger_volksgrenadier_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "ger", n: "Volksgrenadier", y: 44, m: 3, f: 7, r: 4, v: 4,
          }
        end
      end

      context "italy" do
        it "has static definitions" do
          expect(defs[:ita_alpini_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "ita", n: "Alpini", y: 0, m: 4, f: 7, r: 3, v: 5, o: {
              a: 1,
            },
          }
          expect(defs[:ita_bersaglieri_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "ita", n: "Bersaglieri", y: 0, m: 4, f: 6, r: 4, v: 5, o: {
              s: 1,
            },
          }
          expect(defs[:ita_blackshirt_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "ita", n: "Blackshirt", y: 23, m: 2, f: 5, r: 3, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:ita_fucilieri_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "ita", n: "Fucilieri", y: 0, m: 3, f: 6, r: 4, v: 4,
          }
          expect(defs[:ita_guastatori_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "ita", n: "Guastatori", y: 40, m: 4, f: 8, r: 2, v: 5, o: {
              a: 1, s: 1, eng: 1,
            },
          }
          expect(defs[:ita_paracadutisti_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "ita", n: "Paracadutisti", y: 40, m: 4, f: 6, r: 3, v: 5, o: {
              a: 1, s: 1,
            },
          }
        end
      end

      context "japan" do
        it "has static definitions" do
          expect(defs[:jap_a_division_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "jap", n: "A Division", y: 0, m: 4, f: 6, r: 4, v: 5, o: {
              a: 1,
            },
          }
          expect(defs[:jap_b_division_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "jap", n: "B Division", y: 0, m: 3, f: 6, r: 4, v: 4, o: {
              a: 1,
            },
          }
          expect(defs[:jap_betsudotai_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "jap", n: "Betsudotai", y: 0, m: 5, f: 7, r: 3, v: 5, o: {
              a: 1,
            },
          }
          expect(defs[:jap_conscript_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "jap", n: "Conscript", y: 0, m: 2, f: 5, r: 3, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:jap_konoehen_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "jap", n: "Konoehen", y: 0, m: 4, f: 6, r: 4, v: 5, o: {
              a: 1,
            },
          }
          expect(defs[:jap_snlf_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "jap", n: "SNLF", y: 0, m: 3, f: 6, r: 4, v: 4, o: {
              a: 1,
            },
          }
        end
      end

      context "united kingdom" do
        it "has static definitions" do
          expect(defs[:uk_airborne_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "uk", n: "Airborne", y: 42, m: 4, f: 8, r: 5, v: 5, o: {
              a: 1, s: 1,
            },
          }
          expect(defs[:uk_colonial_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "uk", n: "Colonial", y: 0, m: 2, f: 6, r: 3, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:uk_engineer_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "uk", n: "Engineer", y: 0, m: 4, f: 9, r: 5, v: 5, o: {
              a: 1, s: 1, eng: 1,
            },
          }
          expect(defs[:uk_guard_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "uk", n: "Guard", y: 0, m: 4, f: 7, r: 5, v: 5, o: {
              s: 1,
            },
          }
          expect(defs[:uk_gurkha_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "uk", n: "Gurkha", y: 0, m: 4, f: 7, r: 5, v: 5, o: {
              a: 1,
            },
          }
          expect(defs[:uk_indian_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "uk", n: "Indian", y: 0, m: 3, f: 6, r: 4, v: 4,
          }
          expect(defs[:uk_line_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "uk", n: "Line", y: 0, m: 3, f: 7, r: 4, v: 4, o: {
              s: 1,
            },
          }
          expect(defs[:uk_territorial_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "uk", n: "Territorial", y: 0, m: 2, f: 6, r: 3, v: 3, o: {
              bv: 3,
            },
          }
        end
      end

      context "united states" do
        it "has static definitions" do
          expect(defs[:usa_engineer_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "usa", n: "Engineer", y: 0, m: 4, f: 9, r: 3, v: 5, o: {
              a: 1, s: 1, eng: 1,
            },
          }
          expect(defs[:usa_garrison_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "usa", n: "Garrison", y: 0, m: 2, f: 6, r: 4, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:usa_green_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "usa", n: "Green", y: 0, m: 2, f: 6, r: 4, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:usa_marine_rifle_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "usa", n: "Marine Rifle", y: 0, m: 4, f: 7, r: 6, v: 5, o: {
              a: 1,
            },
          }
          expect(defs[:usa_paratroop_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "usa", n: "Paratroop", y: 43, m: 4, f: 8, r: 4, v: 5, o: {
              a: 1, s: 1,
            },
          }
          expect(defs[:usa_ranger_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "usa", n: "Ranger", y: 42, m: 4, f: 8, r: 4, v: 5, o: {
              a: 1, s: 1,
            },
          }
          expect(defs[:usa_rifle_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "usa", n: "Rifle", y: 0, m: 3, f: 7, r: 6, v: 4, o: {
              s: 1,
            },
          }
          expect(defs[:usa_veteran_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "usa", n: "Veteran", y: 0, m: 4, f: 7, r: 6, v: 4, o: {
              s: 1,
            },
          }
        end
      end

      context "soviet union" do
        it "has static definitions" do
          expect(defs[:ussr_assault_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "ussr", n: "Assault", y: 41, m: 4, f: 9, r: 2, v: 5, o: {
              a: 1, s: 1,
            },
          }
          expect(defs[:ussr_guards_rifle_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "ussr", n: "Guards Rifle", y: 41, m: 4, f: 7, r: 5, v: 5,
          }
          expect(defs[:ussr_guards_smg_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "ussr", n: "Guards SMG", y: 41, m: 4, f: 8, r: 3, v: 5, o: {
              a: 1,
            },
          }
          expect(defs[:ussr_militia_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "ussr", n: "Militia", y: 0, m: 2, f: 6, r: 2, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:ussr_rifle_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "ussr", n: "Rifle", y: 0, m: 3, f: 7, r: 3, v: 4,
          }
          expect(defs[:ussr_smg_s]).to be == {
            t: "sqd", i: "squad", s: 6, c: "ussr", n: "SMG", y: 0, m: 3, f: 7, r: 2, v: 4, o: {
              a: 1,
            },
          }
        end
      end
    end

    context "teams" do
      context "allied minors" do
        it "has static definitions" do
          expect(defs[:alm_conscript_t]).to be == {
            t: "tm", i: "team", s: 3, c: "alm", n: "Conscript", y: 0, m: 2, f: 3, r: 3, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:alm_crew_t]).to be == {
            c: "alm", t: "tm", n: "Crew", i: "crew", y: 0, m: 3, s: 3, f: 1, r: 1, v: 4, o: {
              cw: 1,
            },
          }
          expect(defs[:alm_elite_crew_t]).to be == {
            c: "alm", t: "tm", n: "Crew", i: "crew", y: 0, m: 4, s: 3, f: 1, r: 1, v: 5, o: {
              cw: 2,
            },
          }
          expect(defs[:alm_elite_t]).to be == {
            t: "tm", i: "team", s: 3, c: "alm", n: "Elite", y: 0, m: 4, f: 3, r: 5, v: 5,
          }
          expect(defs[:alm_engineer_t]).to be == {
            t: "tm", i: "team", s: 3, c: "alm", n: "Engineer", y: 0, m: 4, f: 4, r: 3, v: 5,
          }
          expect(defs[:alm_regular_t]).to be == {
            t: "tm", i: "team", s: 3, c: "alm", n: "Regular", y: 0, m: 3, f: 3, r: 4, v: 4,
          }
        end
      end

      context "axis minors" do
        it "has static definitions" do
          expect(defs[:axm_conscript_t]).to be == {
            t: "tm", i: "team", s: 3, c: "axm", n: "Conscript", y: 0, m: 2, f: 3, r: 3, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:axm_crew_t]).to be == {
            c: "axm", t: "tm", n: "Crew", i: "crew", y: 0, m: 3, s: 3, f: 1, r: 1, v: 4, o: {
              cw: 1,
            },
          }
          expect(defs[:axm_elite_crew_t]).to be == {
            c: "axm", t: "tm", n: "Crew", i: "crew", y: 0, m: 4, s: 3, f: 1, r: 1, v: 5, o: {
              cw: 2,
            },
          }
          expect(defs[:axm_elite_t]).to be == {
            t: "tm", i: "team", s: 3, c: "axm", n: "Elite", y: 0, m: 4, f: 3, r: 5, v: 5,
          }
          expect(defs[:axm_engineer_t]).to be == {
            t: "tm", i: "team", s: 3, c: "axm", n: "Engineer", y: 0, m: 4, f: 4, r: 3, v: 5,
          }
          expect(defs[:axm_regular_t]).to be == {
            t: "tm", i: "team", s: 3, c: "axm", n: "Regular", y: 0, m: 3, f: 3, r: 4, v: 4,
          }
        end
      end

      context "china" do
        it "has static definitions" do
          expect(defs[:chi_conscript_t]).to be == {
            t: "tm", i: "team", s: 3, c: "chi", n: "Conscript", y: 0, m: 2, f: 2, r: 3, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:chi_crew_t]).to be == {
            c: "chi", t: "tm", n: "Crew", i: "crew", y: 0, m: 3, s: 3, f: 1, r: 1, v: 4, o: {
              cw: 1,
            },
          }
          expect(defs[:chi_elite_crew_t]).to be == {
            c: "chi", t: "tm", n: "Crew", i: "crew", y: 0, m: 4, s: 3, f: 1, r: 1, v: 5, o: {
              cw: 2,
            },
          }
          expect(defs[:chi_elite_t]).to be == {
            t: "tm", i: "team", s: 3, c: "chi", n: "Elite", y: 0, m: 4, f: 3, r: 4, v: 5,
          }
          expect(defs[:chi_regular_t]).to be == {
            t: "tm", i: "team", s: 3, c: "chi", n: "Regular", y: 0, m: 3, f: 2, r: 4, v: 4,
          }
        end
      end

      context "finland" do
        it "has static definitions" do
          expect(defs[:fin_conscript_t]).to be == {
            t: "tm", i: "team", s: 3, c: "fin", n: "Conscript", y: 0, m: 2, f: 3, r: 3, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:fin_crew_t]).to be == {
            c: "fin", t: "tm", n: "Crew", i: "crew", y: 0, m: 3, s: 3, f: 1, r: 1, v: 4, o: {
              cw: 1,
            },
          }
          expect(defs[:fin_elite_crew_t]).to be == {
            c: "fin", t: "tm", n: "Crew", i: "crew", y: 0, m: 4, s: 3, f: 1, r: 1, v: 5, o: {
              cw: 2,
            },
          }
          expect(defs[:fin_elite_t]).to be == {
            t: "tm", i: "team", s: 3, c: "fin", n: "Elite", y: 0, m: 4, f: 3, r: 5, v: 5,
          }
          expect(defs[:fin_regular_t]).to be == {
            t: "tm", i: "team", s: 3, c: "fin", n: "Regular", y: 0, m: 3, f: 3, r: 4, v: 4,
          }
          expect(defs[:fin_sissi_t]).to be == {
            t: "tm", i: "team", s: 3, c: "fin", n: "Sissi", y: 0, m: 4, f: 3, r: 5, v: 5,
          }
        end
      end

      context "france" do
        it "has static definitions" do
          expect(defs[:fra_bar_t]).to be == {
            t: "tm", i: "team", s: 3, c: "fra", n: "BAR", y: 0, m: 3, f: 4, r: 4, v: 4,
          }
          expect(defs[:fra_chasseur_t]).to be == {
            t: "tm", i: "team", s: 3, c: "fra", n: "Chasseur", y: 0, m: 3, f: 3, r: 4, v: 5,
          }
          expect(defs[:fra_colonial_t]).to be == {
            t: "tm", i: "team", s: 3, c: "fra", n: "Colonial", y: 0, m: 2, f: 3, r: 3, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:fra_crew_t]).to be == {
            c: "fra", t: "tm", n: "Crew", i: "crew", y: 0, m: 3, s: 3, f: 1, r: 1, v: 4, o: {
              cw: 1,
            },
          }
          expect(defs[:fra_elite_crew_t]).to be == {
            c: "fra", t: "tm", n: "Crew", i: "crew", y: 0, m: 4, s: 3, f: 1, r: 1, v: 5, o: {
              cw: 2,
            },
          }
          expect(defs[:fra_free_french_t]).to be == {
            t: "tm", i: "team", s: 3, c: "fra", n: "Free French", y: 41, m: 3, f: 3, r: 5, v: 4,
          }
          expect(defs[:fra_genie_t]).to be == {
            t: "tm", i: "team", s: 3, c: "fra", n: "Génie", y: 0, m: 4, f: 4, r: 3, v: 5,
          }
          expect(defs[:fra_legionnaire_t]).to be == {
            t: "tm", i: "team", s: 3, c: "fra", n: "Legionnaire", y: 0, m: 4, f: 3, r: 5, v: 5,
          }
          expect(defs[:fra_reservist_t]).to be == {
            t: "tm", i: "team", s: 3, c: "fra", n: "Reservist", y: 0, m: 2, f: 3, r: 4, v: 4,
          }
        end
      end

      context "german" do
        it "has static definitions" do
          expect(defs[:ger_conscript_t]).to be == {
            t: "tm", i: "team", s: 3, c: "ger", n: "Conscript", y: 0, m: 2, f: 3, r: 3, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:ger_crew_t]).to be == {
            c: "ger", t: "tm", n: "Crew", i: "crew", y: 0, m: 3, s: 3, f: 1, r: 1, v: 4, o: {
              cw: 1,
            },
          }
          expect(defs[:ger_elite_crew_t]).to be == {
            c: "ger", t: "tm", n: "Crew", i: "crew", y: 0, m: 4, s: 3, f: 1, r: 1, v: 5, o: {
              cw: 2,
            },
          }
          expect(defs[:ger_fallschirmjager_t]).to be == {
            t: "tm", i: "team", s: 3, c: "ger", n: "Fallschirmjäger", y: 35, m: 4, f: 3, r: 4, v: 5,
          }
          expect(defs[:ger_gebirgsjager_t]).to be == {
            t: "tm", i: "team", s: 3, c: "ger", n: "Gebirgsjäger", y: 0, m: 4, f: 3, r: 4, v: 5,
          }
          expect(defs[:ger_pionier_t]).to be == {
            t: "tm", i: "team", s: 3, c: "ger", n: "Pionier", y: 0, m: 4, f: 4, r: 3, v: 5,
          }
          expect(defs[:ger_rifle_t]).to be == {
            t: "tm", i: "team", s: 3, c: "ger", n: "Rifle", y: 0, m: 3, f: 3, r: 5, v: 4,
          }
          expect(defs[:ger_ss_t]).to be == {
            t: "tm", i: "team", s: 3, c: "ger", n: "SS", y: 34, m: 4, f: 4, r: 5, v: 5,
          }
          expect(defs[:ger_sturm_t]).to be == {
            t: "tm", i: "team", s: 3, c: "ger", n: "Sturm", y: 0, m: 4, f: 4, r: 4, v: 5,
          }
          expect(defs[:ger_volksgrenadier_t]).to be == {
            t: "tm", i: "team", s: 3, c: "ger", n: "Volksgrenadier", y: 44, m: 3, f: 3, r: 4, v: 4,
          }
        end
      end

      context "italy" do
        it "has static definitions" do
          expect(defs[:ita_alpini_t]).to be == {
            t: "tm", i: "team", s: 3, c: "ita", n: "Alpini", y: 0, m: 4, f: 3, r: 3, v: 5,
          }
          expect(defs[:ita_bersaglieri_t]).to be == {
            t: "tm", i: "team", s: 3, c: "ita", n: "Bersaglieri", y: 0, m: 4, f: 3, r: 4, v: 5,
          }
          expect(defs[:ita_blackshirt_t]).to be == {
            t: "tm", i: "team", s: 3, c: "ita", n: "Blackshirt", y: 23, m: 2, f: 2, r: 3, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:ita_crew_t]).to be == {
            c: "ita", t: "tm", n: "Crew", i: "crew", y: 0, m: 3, s: 3, f: 1, r: 1, v: 4, o: {
              cw: 1,
            },
          }
          expect(defs[:ita_elite_crew_t]).to be == {
            c: "ita", t: "tm", n: "Crew", i: "crew", y: 0, m: 4, s: 3, f: 1, r: 1, v: 5, o: {
              cw: 2,
            },
          }
          expect(defs[:ita_fucilieri_t]).to be == {
            t: "tm", i: "team", s: 3, c: "ita", n: "Fucilieri", y: 0, m: 3, f: 3, r: 4, v: 4,
          }
          expect(defs[:ita_guastatori_t]).to be == {
            t: "tm", i: "team", s: 3, c: "ita", n: "Guastatori", y: 40, m: 4, f: 4, r: 2, v: 5,
          }
          expect(defs[:ita_paracadutisti_t]).to be == {
            t: "tm", i: "team", s: 3, c: "ita", n: "Paracadutisti", y: 40, m: 4, f: 3, r: 3, v: 5,
          }
        end
      end

      context "japan" do
        it "has static definitions" do
          expect(defs[:jap_a_division_t]).to be == {
            t: "tm", i: "team", s: 3, c: "jap", n: "A Division", y: 0, m: 4, f: 3, r: 4, v: 5,
          }
          expect(defs[:jap_b_division_t]).to be == {
            t: "tm", i: "team", s: 3, c: "jap", n: "B Division", y: 0, m: 3, f: 3, r: 4, v: 4,
          }
          expect(defs[:jap_betsudotai_t]).to be == {
            t: "tm", i: "team", s: 3, c: "jap", n: "Betsudotai", y: 0, m: 5, f: 3, r: 3, v: 5,
          }
          expect(defs[:jap_conscript_t]).to be == {
            t: "tm", i: "team", s: 3, c: "jap", n: "Conscript", y: 0, m: 2, f: 2, r: 3, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:jap_crew_t]).to be == {
            c: "jap", t: "tm", n: "Crew", i: "crew", y: 0, m: 3, s: 3, f: 1, r: 1, v: 4, o: {
              cw: 1,
            },
          }
          expect(defs[:jap_elite_crew_t]).to be == {
            c: "jap", t: "tm", n: "Crew", i: "crew", y: 0, m: 4, s: 3, f: 1, r: 1, v: 5, o: {
              cw: 2,
            },
          }
          expect(defs[:jap_konoehen_t]).to be == {
            t: "tm", i: "team", s: 3, c: "jap", n: "Konoehen", y: 0, m: 4, f: 3, r: 4, v: 5,
          }
          expect(defs[:jap_snlf_t]).to be == {
            t: "tm", i: "team", s: 3, c: "jap", n: "SNLF", y: 0, m: 3, f: 3, r: 4, v: 4,
          }
        end
      end

      context "united kingdom" do
        it "has static definitions" do
          expect(defs[:uk_airborne_t]).to be == {
            t: "tm", i: "team", s: 3, c: "uk", n: "Airborne", y: 42, m: 4, f: 4, r: 5, v: 5,
          }
          expect(defs[:uk_colonial_t]).to be == {
            t: "tm", i: "team", s: 3, c: "uk", n: "Colonial", y: 0, m: 2, f: 3, r: 3, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:uk_crew_t]).to be == {
            c: "uk", t: "tm", n: "Crew", i: "crew", y: 0, m: 3, s: 3, f: 1, r: 1, v: 4, o: {
              cw: 1,
            },
          }
          expect(defs[:uk_elite_crew_t]).to be == {
            c: "uk", t: "tm", n: "Crew", i: "crew", y: 0, m: 4, s: 3, f: 1, r: 1, v: 5, o: {
              cw: 2,
            },
          }
          expect(defs[:uk_engineer_t]).to be == {
            t: "tm", i: "team", s: 3, c: "uk", n: "Engineer", y: 0, m: 4, f: 4, r: 5, v: 5,
          }
          expect(defs[:uk_guard_t]).to be == {
            t: "tm", i: "team", s: 3, c: "uk", n: "Guard", y: 0, m: 4, f: 3, r: 5, v: 5,
          }
          expect(defs[:uk_gurkha_t]).to be == {
            t: "tm", i: "team", s: 3, c: "uk", n: "Gurkha", y: 0, m: 4, f: 3, r: 5, v: 5,
          }
          expect(defs[:uk_indian_t]).to be == {
            t: "tm", i: "team", s: 3, c: "uk", n: "Indian", y: 0, m: 3, f: 3, r: 4, v: 4,
          }
          expect(defs[:uk_line_t]).to be == {
            t: "tm", i: "team", s: 3, c: "uk", n: "Line", y: 0, m: 3, f: 3, r: 4, v: 4,
          }
          expect(defs[:uk_territorial_t]).to be == {
            t: "tm", i: "team", s: 3, c: "uk", n: "Territorial", y: 0, m: 2, f: 3, r: 3, v: 3, o: {
              bv: 3,
            },
          }
        end
      end

      context "united states" do
        it "has static definitions" do
          expect(defs[:usa_crew_t]).to be == {
            c: "usa", t: "tm", n: "Crew", i: "crew", y: 0, m: 3, s: 3, f: 1, r: 1, v: 4, o: {
              cw: 1,
            },
          }
          expect(defs[:usa_elite_crew_t]).to be == {
            c: "usa", t: "tm", n: "Crew", i: "crew", y: 0, m: 4, s: 3, f: 1, r: 1, v: 5, o: {
              cw: 2,
            },
          }
          expect(defs[:usa_engineer_t]).to be == {
            t: "tm", i: "team", s: 3, c: "usa", n: "Engineer", y: 0, m: 4, f: 4, r: 3, v: 5,
          }
          expect(defs[:usa_garrison_t]).to be == {
            t: "tm", i: "team", s: 3, c: "usa", n: "Garrison", y: 0, m: 2, f: 3, r: 4, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:usa_green_t]).to be == {
            t: "tm", i: "team", s: 3, c: "usa", n: "Green", y: 0, m: 2, f: 3, r: 4, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:usa_marine_rifle_t]).to be == {
            t: "tm", i: "team", s: 3, c: "usa", n: "Marine Rifle", y: 0, m: 4, f: 3, r: 6, v: 5,
          }
          expect(defs[:usa_paratroop_t]).to be == {
            t: "tm", i: "team", s: 3, c: "usa", n: "Paratroop", y: 43, m: 4, f: 4, r: 4, v: 5,
          }
          expect(defs[:usa_ranger_t]).to be == {
            t: "tm", i: "team", s: 3, c: "usa", n: "Ranger", y: 42, m: 4, f: 4, r: 4, v: 5,
          }
          expect(defs[:usa_rifle_t]).to be == {
            t: "tm", i: "team", s: 3, c: "usa", n: "Rifle", y: 0, m: 3, f: 3, r: 6, v: 4,
          }
          expect(defs[:usa_veteran_t]).to be == {
            t: "tm", i: "team", s: 3, c: "usa", n: "Veteran", y: 0, m: 4, f: 3, r: 6, v: 4,
          }
        end
      end

      context "soviet union" do
        it "has static definitions" do
          expect(defs[:ussr_assault_t]).to be == {
            t: "tm", i: "team", s: 3, c: "ussr", n: "Assault", y: 41, m: 4, f: 4, r: 2, v: 5,
          }
          expect(defs[:ussr_crew_t]).to be == {
            c: "ussr", t: "tm", n: "Crew", i: "crew", y: 0, m: 3, s: 3, f: 1, r: 1, v: 4, o: {
              cw: 1,
            },
          }
          expect(defs[:ussr_elite_crew_t]).to be == {
            c: "ussr", t: "tm", n: "Crew", i: "crew", y: 0, m: 4, s: 3, f: 1, r: 1, v: 5, o: {
              cw: 2,
            },
          }
          expect(defs[:ussr_guards_rifle_t]).to be == {
            t: "tm", i: "team", s: 3, c: "ussr", n: "Guards Rifle", y: 41, m: 4, f: 3, r: 5, v: 5,
          }
          expect(defs[:ussr_guards_smg_t]).to be == {
            t: "tm", i: "team", s: 3, c: "ussr", n: "Guards SMG", y: 41, m: 4, f: 4, r: 3, v: 5,
          }
          expect(defs[:ussr_militia_t]).to be == {
            t: "tm", i: "team", s: 3, c: "ussr", n: "Militia", y: 0, m: 2, f: 3, r: 2, v: 3, o: {
              bv: 3,
            },
          }
          expect(defs[:ussr_rifle_t]).to be == {
            t: "tm", i: "team", s: 3, c: "ussr", n: "Rifle", y: 0, m: 3, f: 3, r: 3, v: 4,
          }
          expect(defs[:ussr_smg_t]).to be == {
            t: "tm", i: "team", s: 3, c: "ussr", n: "SMG", y: 0, m: 3, f: 3, r: 2, v: 4,
          }
        end
      end
    end

    context "infantry weapons" do
      context "allied minors" do
        it "has static definitions" do
          expect(defs[:alm_81mm_mortar]).to be == {
            t: "sw", i: "mortar", c: "alm", n: "81mm Mortar", y: 27, f: 20, r: 17, v: -1, s: 1, o: {
              s: 1, m: 3, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:alm_boys_at_rifle]).to be == {
            t: "sw", i: "antitank", c: "alm", n: "Boys AT Rifle", y: 37, f: 3, r: 6, v: -1, s: 1, o: {
              j: 3, t: 1, p: 1,
            },
          }
          expect(defs[:alm_bren_lmg]).to be == {
            t: "sw", i: "mg", c: "alm", n: "Bren LMG", y: 35, f: 3, r: 6, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:alm_colt_m_29]).to be == {
            t: "sw", i: "mg", c: "alm", n: "Colt M/29", y: 17, f: 12, r: 12, v: -2, s: 1, o: {
              r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:alm_ft]).to be == {
            c: "alm", t: "sw", n: "Flamethrower", y: 15, i: "flamethrower", f: 24, r: 1, v: 0, s: 1, o: {
              a: 1, i: 1, b: 4, e: 1,
            },
          }
          expect(defs[:alm_m1915_chauchat]).to be == {
            t: "sw", i: "mg", c: "alm", n: "M1915 Chauchat", y: 15, f: 2, r: 5, v: 0, s: 1, o: {
              a: 1, r: 1, j: 4, f: 17, sn: 1,
            },
          }
          expect(defs[:alm_mg_08_15]).to be == {
            t: "sw", i: "mg", c: "alm", n: "MG 08/15", y: 24, f: 8, r: 12, v: -1, s: 1, o: {
              r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:alm_piat]).to be == {
            t: "sw", i: "rocket", c: "alm", n: "PIAT", y: 42, f: 8, r: 3, v: 0, s: 1, o: {
              b: 4, t: 1, p: 1,
            },
          }
          expect(defs[:alm_rkm_wz__28]).to be == {
            t: "sw", i: "mg", c: "alm", n: "rkm wz. 28", y: 28, f: 6, r: 6, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:alm_sc]).to be == {
            c: "alm", t: "sw", n: "Satchel Charge", y: 36, i: "explosive", f: 24, r: 1, v: 0, s: 1, o: {
              x: 1, t: 1, e: 1,
            },
          }
          expect(defs[:alm_vickers_mg]).to be == {
            t: "sw", i: "mg", c: "alm", n: "Vickers MG", y: 12, f: 6, r: 15, v: -1, s: 1, o: {
              r: 1, j: 2, f: 15,
            },
          }
          expect(defs[:alm_wz__35_at_rifle]).to be == {
            t: "sw", i: "antitank", c: "alm", n: "wz. 35 AT Rifle", y: 38, f: 3, r: 4, v: 0, s: 1, o: {
              j: 3, t: 1, p: 1,
            },
          }
          expect(defs[:alm_zb_vz__30]).to be == {
            t: "sw", i: "mg", c: "alm", n: "ZB vz. 30", y: 26, f: 4, r: 10, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
        end
      end

      context "axis minors" do
        it "has static definitions" do
          expect(defs[:axm_81mm_mortar]).to be == {
            t: "sw", i: "mortar", c: "axm", n: "81mm Mortar", y: 27, f: 20, r: 17, v: -1, s: 1, o: {
              s: 1, m: 3, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:axm_ft]).to be == {
            c: "axm", t: "sw", n: "Flamethrower", y: 15, i: "flamethrower", f: 24, r: 1, v: 0, s: 1, o: {
              a: 1, i: 1, b: 4, e: 1,
            },
          }
          expect(defs[:axm_mg_08_15]).to be == {
            t: "sw", i: "mg", c: "axm", n: "MG 08/15", y: 24, f: 8, r: 12, v: -1, s: 1, o: {
              r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:axm_mg_30]).to be == {
            t: "sw", i: "mg", c: "axm", n: "MG 30", y: 31, f: 4, r: 8, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:axm_mg_34]).to be == {
            t: "sw", i: "mg", c: "axm", n: "MG 34", y: 36, f: 5, r: 8, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:axm_mg_42]).to be == {
            t: "sw", i: "mg", c: "axm", n: "MG 42", y: 42, f: 8, r: 8, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:axm_s_18_100]).to be == {
            t: "sw", i: "antitank", c: "axm", n: "S-18/100", y: 34, f: 4, r: 6, v: -2, s: 1, o: {
              j: 3, t: 1, p: 1,
            },
          }
          expect(defs[:axm_sc]).to be == {
            c: "axm", t: "sw", n: "Satchel Charge", y: 36, i: "explosive", f: 24, r: 1, v: 0, s: 1, o: {
              x: 1, t: 1, e: 1,
            },
          }
          expect(defs[:axm_zb_vz__26]).to be == {
            t: "sw", i: "mg", c: "axm", n: "ZB vz. 26", y: 26, f: 4, r: 10, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:axm_zb_vz__30]).to be == {
            t: "sw", i: "mg", c: "axm", n: "ZB vz. 30", y: 26, f: 4, r: 10, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
        end
      end

      context "china" do
        it "has static definitions" do
          expect(defs[:chi_boys_at_rifle]).to be == {
            t: "sw", i: "antitank", c: "chi", n: "Boys AT Rifle", y: 44, f: 3, r: 6, v: -1, s: 1, o: {
              j: 3, t: 1, p: 1,
            },
          }
          expect(defs[:chi_bren_lmg]).to be == {
            t: "sw", i: "mg", c: "chi", n: "Bren LMG", y: 35, f: 3, r: 6, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:chi_czeck_lmg]).to be == {
            t: "sw", i: "mg", c: "chi", n: "Czeck LMG", y: 26, f: 4, r: 10, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:chi_dp_27]).to be == {
            t: "sw", i: "mg", c: "chi", n: "DP-27", y: 28, f: 4, r: 8, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:chi_fn_m1930]).to be == {
            t: "sw", i: "mg", c: "chi", n: "FN M1930", y: 30, f: 5, r: 8, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:chi_ft]).to be == {
            c: "chi", t: "sw", n: "Flamethrower", y: 15, i: "flamethrower", f: 24, r: 1, v: 0, s: 1, o: {
              a: 1, i: 1, b: 4, e: 1,
            },
          }
          expect(defs[:chi_m1915_hotchkiss]).to be == {
            t: "sw", i: "mg", c: "chi", n: "M1915 Hotchkiss", y: 14, f: 5, r: 10, v: -1, s: 1, o: {
              r: 1, j: 3, f: 16, sn: 1,
            },
          }
          expect(defs[:chi_m1_mortar]).to be == {
            t: "sw", i: "mortar", c: "chi", n: "M1 Mortar", y: 42, f: 20, r: 24, v: -2, s: 1, o: {
              s: 1, m: 3, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:chi_m1a1_bazooka]).to be == {
            t: "sw", i: "rocket", c: "chi", n: "M1A1 Bazooka", y: 43, f: 10, r: 4, v: 0, s: 1, o: {
              b: 4, t: 1, p: 1,
            },
          }
          expect(defs[:chi_m2_4_2inch_mortar]).to be == {
            t: "sw", i: "mortar", c: "chi", n: "M2 4.2inch Mortar", y: 43, f: 24, r: 28, v: 2, o: {
              sn: 2, s: 1, m: 5, c: 1, tow: 2, t: 1, b: 3, e: 1,
            }, s: 2,
          }
          expect(defs[:chi_type_31_mortar]).to be == {
            t: "sw", i: "mortar", c: "chi", n: "Type 31 Mortar", y: 42, f: 12, r: 16, v: -1, s: 1, o: {
              m: 2, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:chi_sc]).to be == {
            c: "chi", t: "sw", n: "Satchel Charge", y: 36, i: "explosive", f: 24, r: 1, v: 0, s: 1, o: {
              x: 1, t: 1, e: 1,
            },
          }
          expect(defs[:chi_type_15_mortar]).to be == {
            t: "sw", i: "mortar", c: "chi", n: "Type 15 Mortar", y: 33, f: 20, r: 24, v: -2, s: 1, o: {
              s: 1, m: 3, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:chi_type_20_mortar]).to be == {
            t: "sw", i: "mortar", c: "chi", n: "Type 20 Mortar", y: 27, f: 20, r: 17, v: -1, s: 1, o: {
              s: 1, m: 3, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:chi_type_24_maxim]).to be == {
            t: "sw", i: "mg", c: "chi", n: "Type 24 Maxim", y: 24, f: 8, r: 12, v: -1, s: 1, o: {
              r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:chi_type_triple_ten]).to be == {
            t: "sw", i: "mg", c: "chi", n: "Type Triple-Ten", y: 21, f: 12, r: 12, v: -2, s: 1, o: {
              r: 1, j: 3, f: 16,
            },
          }
        end
      end

      context "finland" do
        it "has static definitions" do
          expect(defs[:fin_14mm_pst_kiv_37]).to be == {
            t: "sw", i: "antitank", c: "fin", n: "14mm pst kiv/37", y: 37, f: 3, r: 6, v: -1, s: 1, o: {
              j: 3, sn: 1, t: 1, p: 1,
            },
          }
          expect(defs[:fin_81mm_tampella]).to be == {
            t: "sw", i: "mortar", c: "fin", n: "81mm Tampella", y: 27, f: 20, r: 17, v: -1, s: 1, o: {
              s: 1, m: 3, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:fin_8mm_pst_kiv_38]).to be == {
            t: "sw", i: "antitank", c: "fin", n: "8mm pst kiv/38", y: 38, f: 3, r: 4, v: 0, s: 1, o: {
              j: 3, t: 1, p: 1,
            },
          }
          expect(defs[:fin_dp_27]).to be == {
            t: "sw", i: "mg", c: "fin", n: "DP-27", y: 40, f: 4, r: 8, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:fin_ft]).to be == {
            c: "fin", t: "sw", n: "Flamethrower", y: 15, i: "flamethrower", f: 24, r: 1, v: 0, s: 1, o: {
              a: 1, i: 1, b: 4, e: 1,
            },
          }
          expect(defs[:fin_lahti_l_39]).to be == {
            t: "sw", i: "antitank", c: "fin", n: "Lahti L-39", y: 40, f: 4, r: 6, v: -2, s: 1, o: {
              j: 3, t: 1, p: 1,
            },
          }
          expect(defs[:fin_ls_26]).to be == {
            t: "sw", i: "mg", c: "fin", n: "LS/26", y: 30, f: 4, r: 5, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:fin_maxim_m_32_33]).to be == {
            t: "sw", i: "mg", c: "fin", n: "Maxim M/32-33", y: 33, f: 8, r: 12, v: -1, s: 1, o: {
              r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:fin_mc]).to be == {
            c: "fin", t: "sw", n: "Molotov Cocktail", y: 39, i: "explosive", f: 4, r: 1, v: 0, s: 1, o: {
              i: 1, x: 1, t: 1, sn: 1, e: 1,
            },
          }
          expect(defs[:fin_mg_08_15]).to be == {
            t: "sw", i: "mg", c: "fin", n: "MG 08/15", y: 24, f: 8, r: 12, v: -1, s: 1, o: {
              r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:fin_sc]).to be == {
            c: "fin", t: "sw", n: "Satchel Charge", y: 36, i: "explosive", f: 24, r: 1, v: 0, s: 1, o: {
              x: 1, t: 1, e: 1,
            },
          }
          expect(defs[:fin_vickers_mg]).to be == {
            t: "sw", i: "mg", c: "fin", n: "Vickers MG", y: 12, f: 6, r: 15, v: -1, s: 1, o: {
              r: 1, j: 2, f: 15,
            },
          }
        end
      end

      context "france" do
        it "has static definitions" do
          expect(defs[:fra_brandt_m1935]).to be == {
            t: "sw", i: "mortar", c: "fra", n: "Brandt M1935", y: 35, f: 20, r: 15, v: -1, s: 1, o: {
              m: 3, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:fra_brandt_m27_31]).to be == {
            t: "sw", i: "mortar", c: "fra", n: "Brandt M27/31", y: 27, f: 20, r: 17, v: -1, s: 1, o: {
              s: 1, m: 3, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:fra_bren_lmg]).to be == {
            t: "sw", i: "mg", c: "fra", n: "Bren LMG", y: 41, f: 3, r: 6, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:fra_fm_24_29]).to be == {
            t: "sw", i: "mg", c: "fra", n: "FM 24/29", y: 25, f: 3, r: 10, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:fra_ft]).to be == {
            c: "fra", t: "sw", n: "Flamethrower", y: 15, i: "flamethrower", f: 24, r: 1, v: 0, s: 1, o: {
              a: 1, i: 1, b: 4, e: 1,
            },
          }
          expect(defs[:fra_m1915_chauchat]).to be == {
            t: "sw", i: "mg", c: "fra", n: "M1915 Chauchat", y: 15, f: 2, r: 5, v: 0, s: 1, o: {
              a: 1, r: 1, j: 4, f: 17, sn: 1,
            },
          }
          expect(defs[:fra_m1915_hotchkiss]).to be == {
            t: "sw", i: "mg", c: "fra", n: "M1915 Hotchkiss", y: 14, f: 5, r: 10, v: -1, s: 1, o: {
              r: 1, j: 3, f: 16, sn: 1,
            },
          }
          expect(defs[:fra_m1917_fabry]).to be == {
            t: "sw", i: "mortar", c: "fra", n: "M1917 Fabry", y: 18, f: 48, r: 20, v: 1, o: {
              s: 1, m: 6, c: 1, tow: 3, t: 1, b: 3, e: 1,
            }, s: 3,
          }
          expect(defs[:fra_m1918_bar]).to be == {
            t: "sw", i: "mg", c: "fra", n: "M1918 BAR", y: 41, f: 5, r: 8, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:fra_piat]).to be == {
            t: "sw", i: "rocket", c: "fra", n: "PIAT", y: 42, f: 8, r: 3, v: 0, s: 1, o: {
              b: 4, t: 1, p: 1,
            },
          }
          expect(defs[:fra_radio_105mm]).to be == {
            t: "sw", i: "radio", c: "fra", n: "Radio 105mm", y: 13, f: 40, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:fra_radio_155mm]).to be == {
            t: "sw", i: "radio", c: "fra", n: "Radio 155mm", y: 17, f: 80, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:fra_sc]).to be == {
            c: "fra", t: "sw", n: "Satchel Charge", y: 36, i: "explosive", f: 24, r: 1, v: 0, s: 1, o: {
              x: 1, t: 1, e: 1,
            },
          }
        end
      end

      context "german" do
        it "has static definitions" do
          expect(defs[:ger_12cm_grw_42]).to be == {
            t: "sw", i: "mortar", c: "ger", n: "12cm GrW 42", y: 43, f: 32, r: 32, v: 2, o: {
              s: 1, m: 5, c: 1, tow: 2, t: 1, b: 3, e: 1,
            }, s: 2,
          }
          expect(defs[:ger_5cm_legrw_36]).to be == {
            t: "sw", i: "mortar", c: "ger", n: "5cm leGrW 36", y: 36, f: 8, r: 12, v: 0, s: 1, o: {
              m: 2, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:ger_8cm_grw_34]).to be == {
            t: "sw", i: "mortar", c: "ger", n: "8cm GrW 34", y: 37, f: 16, r: 17, v: -2, s: 1, o: {
              s: 1, m: 3, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:ger_ft]).to be == {
            c: "ger", t: "sw", n: "Flamethrower", y: 15, i: "flamethrower", f: 24, r: 1, v: 0, s: 1, o: {
              a: 1, i: 1, b: 4, e: 1,
            },
          }
          expect(defs[:ger_kz_8cm_grw_42]).to be == {
            t: "sw", i: "mortar", c: "ger", n: "kz 8cm GrW 42", y: 41, f: 16, r: 16, v: -1, s: 1, o: {
              s: 1, m: 3, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:ger_mg_08_15]).to be == {
            t: "sw", i: "mg", c: "ger", n: "MG 08/15", y: 17, f: 8, r: 12, v: -1, s: 1, o: {
              r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:ger_mg_34]).to be == {
            t: "sw", i: "mg", c: "ger", n: "MG 34", y: 36, f: 5, r: 8, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:ger_mg_42]).to be == {
            t: "sw", i: "mg", c: "ger", n: "MG 42", y: 42, f: 8, r: 8, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:ger_panzerfaust]).to be == {
            t: "sw", i: "rocket", c: "ger", n: "Panzerfaust", y: 43, f: 16, r: 1, v: 0, s: 1, o: {
              x: 1, t: 1, p: 1,
            },
          }
          expect(defs[:ger_panzerschreck]).to be == {
            t: "sw", i: "rocket", c: "ger", n: "Panzerschreck", y: 43, f: 12, r: 3, v: 0, s: 1, o: {
              b: 4, t: 1, p: 1,
            },
          }
          expect(defs[:ger_radio_10_5cm]).to be == {
            t: "sw", i: "radio", c: "ger", n: "Radio 10.5cm", y: 35, f: 40, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:ger_radio_15cm]).to be == {
            t: "sw", i: "radio", c: "ger", n: "Radio 15cm", y: 34, f: 64, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:ger_radio_17cm]).to be == {
            t: "sw", i: "radio", c: "ger", n: "Radio 17cm", y: 41, f: 80, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:ger_radio_21cm]).to be == {
            t: "sw", i: "radio", c: "ger", n: "Radio 21cm", y: 39, f: 96, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:ger_sc]).to be == {
            c: "ger", t: "sw", n: "Satchel Charge", y: 36, i: "explosive", f: 24, r: 1, v: 0, s: 1, o: {
              x: 1, t: 1, e: 1,
            },
          }
          expect(defs[:ger_mg_30t]).to be == {
            t: "sw", i: "mg", c: "ger", n: "MG 30(t)", y: 39, f: 4, r: 10, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
        end
      end

      context "italy" do
        it "has static definitions" do
          expect(defs[:ita_81_14_m35]).to be == {
            t: "sw", i: "mortar", c: "ita", n: "81/14 M35", y: 35, f: 20, r: 18, v: -1, s: 1, o: {
              s: 1, m: 3, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:ita_breda_30]).to be == {
            t: "sw", i: "mg", c: "ita", n: "Breda 30", y: 30, f: 3, r: 6, v: 0, s: 1, o: {
              r: 1, j: 4, f: 17,
            },
          }
          expect(defs[:ita_breda_m37]).to be == {
            t: "sw", i: "mg", c: "ita", n: "Breda M37", y: 37, f: 8, r: 10, v: -1, s: 1, o: {
              r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:ita_brixia_m35]).to be == {
            t: "sw", i: "mortar", c: "ita", n: "Brixia M35", y: 35, f: 8, r: 12, v: 0, s: 1, o: {
              m: 2, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:ita_fiat_revelli_1935]).to be == {
            t: "sw", i: "mg", c: "ita", n: "Fiat-Revelli 1935", y: 36, f: 4, r: 10, v: -1, s: 1, o: {
              r: 1, j: 4, f: 17, sn: 1,
            },
          }
          expect(defs[:ita_ft]).to be == {
            c: "ita", t: "sw", n: "Flamethrower", y: 15, i: "flamethrower", f: 24, r: 1, v: 0, s: 1, o: {
              a: 1, i: 1, b: 4, e: 1,
            },
          }
          expect(defs[:ita_radio_100mm]).to be == {
            t: "sw", i: "radio", c: "ita", n: "Radio 100mm", y: 14, f: 40, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:ita_radio_149mm]).to be == {
            t: "sw", i: "radio", c: "ita", n: "Radio 149mm", y: 14, f: 64, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:ita_radio_75mm]).to be == {
            t: "sw", i: "radio", c: "ita", n: "Radio 75mm", y: 37, f: 24, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:ita_sc]).to be == {
            c: "ita", t: "sw", n: "Satchel Charge", y: 36, i: "explosive", f: 24, r: 1, v: 0, s: 1, o: {
              x: 1, t: 1, e: 1,
            },
          }
        end
      end

      context "japan" do
        it "has static definitions" do
          expect(defs[:jap_ft]).to be == {
            c: "jap", t: "sw", n: "Flamethrower", y: 15, i: "flamethrower", f: 24, r: 1, v: 0, s: 1, o: {
              a: 1, i: 1, b: 4, e: 1,
            },
          }
          expect(defs[:jap_radio_10cm]).to be == {
            t: "sw", i: "radio", c: "jap", n: "Radio 10cm", y: 31, f: 40, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:jap_radio_15cm]).to be == {
            t: "sw", i: "radio", c: "jap", n: "Radio 15cm", y: 37, f: 64, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:jap_radio_7_5cm]).to be == {
            t: "sw", i: "radio", c: "jap", n: "Radio 7.5cm", y: 36, f: 24, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:jap_sc]).to be == {
            c: "jap", t: "sw", n: "Satchel Charge", y: 36, i: "explosive", f: 24, r: 1, v: 0, s: 1, o: {
              x: 1, t: 1, e: 1,
            },
          }
          expect(defs[:jap_type_10_gren_l]).to be == {
            t: "sw", i: "mortar", c: "jap", n: "Type 10 Gren.L", y: 21, f: 8, r: 7, v: 0, s: 1, o: {
              s: 1, m: 2, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:jap_type_11_lmg]).to be == {
            t: "sw", i: "mg", c: "jap", n: "Type 11 LMG", y: 22, f: 2, r: 6, v: 0, s: 1, o: {
              r: 1, j: 5, f: 17,
            },
          }
          expect(defs[:jap_type_3_hmg]).to be == {
            t: "sw", i: "mg", c: "jap", n: "Type 3 HMG", y: 14, f: 4, r: 10, v: -1, s: 1, o: {
              r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:jap_type_89_gren_l]).to be == {
            t: "sw", i: "mortar", c: "jap", n: "Type 89 Gren.L", y: 29, f: 8, r: 8, v: 0, s: 1, o: {
              s: 1, m: 2, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:jap_type_92_hmg]).to be == {
            t: "sw", i: "mg", c: "jap", n: "Type 92 HMG", y: 32, f: 8, r: 10, v: -2, s: 1, o: {
              r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:jap_type_94_90mm]).to be == {
            t: "sw", i: "mortar", c: "jap", n: "Type 94 90mm", y: 34, f: 20, r: 27, v: 2, o: {
              s: 1, m: 4, c: 1, tow: 2, t: 1, b: 3, e: 1,
            }, s: 2,
          }
          expect(defs[:jap_type_96_lmg]).to be == {
            t: "sw", i: "mg", c: "jap", n: "Type 96 LMG", y: 36, f: 4, r: 8, v: 0, s: 1, o: {
              a: 1, r: 1, j: 4, f: 17,
            },
          }
          expect(defs[:jap_type_97_81mm]).to be == {
            t: "sw", i: "mortar", c: "jap", n: "Type 97 81mm", y: 37, f: 20, r: 17, v: -2, s: 1, o: {
              s: 1, m: 3, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:jap_type_97_90mm]).to be == {
            t: "sw", i: "mortar", c: "jap", n: "Type 97 90mm", y: 37, f: 20, r: 27, v: -2, o: {
              s: 1, m: 4, t: 1, b: 3, e: 1,
            }, s: 1,
          }
          expect(defs[:jap_type_97_ac]).to be == {
            t: "sw", i: "antitank", c: "jap", n: "Type 97 AC", y: 35, f: 3, r: 5, v: -2, s: 1, o: {
              j: 3, t: 1, p: 1,
            },
          }
          expect(defs[:jap_type_99_lmg]).to be == {
            t: "sw", i: "mg", c: "jap", n: "Type 99 LMG", y: 39, f: 6, r: 8, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
        end
      end

      context "united kingdom" do
        it "has static definitions" do
          expect(defs[:uk_2inch_mortar]).to be == {
            t: "sw", i: "mortar", c: "uk", n: "2inch Mortar", y: 37, f: 10, r: 15, v: 0, s: 1, o: {
              m: 2, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:uk_boys_at_rifle]).to be == {
            t: "sw", i: "antitank", c: "uk", n: "Boys AT Rifle", y: 37, f: 3, r: 6, v: -1, s: 1, o: {
              j: 3, t: 1, p: 1,
            },
          }
          expect(defs[:uk_bren_lmg]).to be == {
            t: "sw", i: "mg", c: "uk", n: "Bren LMG", y: 35, f: 3, r: 6, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:uk_ft]).to be == {
            c: "uk", t: "sw", n: "Flamethrower", y: 15, i: "flamethrower", f: 24, r: 1, v: 0, s: 1, o: {
              a: 1, i: 1, b: 4, e: 1,
            },
          }
          expect(defs[:uk_lewis_gun]).to be == {
            t: "sw", i: "mg", c: "uk", n: "Lewis Gun", y: 14, f: 4, r: 8, v: 0, s: 1, o: {
              r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:uk_ml_3inch_mortar]).to be == {
            t: "sw", i: "mortar", c: "uk", n: "ML 3inch Mortar", y: 33, f: 20, r: 18, v: -1, s: 1, o: {
              s: 1, m: 3, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:uk_ml_4_2inch_mortar]).to be == {
            t: "sw", i: "mortar", c: "uk", n: "ML 4.2inch Mortar", y: 40, f: 24, r: 26, v: 2, o: {
              sn: 2, s: 1, m: 5, c: 1, tow: 2, t: 1, b: 3, e: 1,
            }, s: 2,
          }
          expect(defs[:uk_piat]).to be == {
            t: "sw", i: "rocket", c: "uk", n: "PIAT", y: 42, f: 8, r: 3, v: 0, s: 1, o: {
              b: 4, t: 1, p: 1,
            },
          }
          expect(defs[:uk_radio_114mm]).to be == {
            t: "sw", i: "radio", c: "uk", n: "Radio 114mm", y: 38, f: 48, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:uk_radio_140mm]).to be == {
            t: "sw", i: "radio", c: "uk", n: "Radio 140mm", y: 41, f: 64, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:uk_radio_152mm]).to be == {
            t: "sw", i: "radio", c: "uk", n: "Radio 152mm", y: 16, f: 64, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:uk_radio_183mm]).to be == {
            t: "sw", i: "radio", c: "uk", n: "Radio 183mm", y: 40, f: 96, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:uk_radio_88mm]).to be == {
            t: "sw", i: "radio", c: "uk", n: "Radio 88mm", y: 40, f: 32, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:uk_sc]).to be == {
            c: "uk", t: "sw", n: "Satchel Charge", y: 36, i: "explosive", f: 24, r: 1, v: 0, s: 1, o: {
              x: 1, t: 1, e: 1,
            },
          }
          expect(defs[:uk_vickers_mg]).to be == {
            t: "sw", i: "mg", c: "uk", n: "Vickers MG", y: 12, f: 6, r: 15, v: -1, s: 1, o: {
              r: 1, j: 2, f: 15,
            },
          }
        end
      end

      context "united states" do
        it "has static definitions" do
          expect(defs[:usa_ft]).to be == {
            c: "usa", t: "sw", n: "Flamethrower", y: 15, i: "flamethrower", f: 24, r: 1, v: 0, s: 1, o: {
              a: 1, i: 1, b: 4, e: 1,
            },
          }
          expect(defs[:usa_m1917_browning]).to be == {
            t: "sw", i: "mg", c: "usa", n: "M1917 Browning", y: 17, f: 12, r: 12, v: -2, s: 1, o: {
              r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:usa_m1918_bar]).to be == {
            t: "sw", i: "mg", c: "usa", n: "M1918 BAR", y: 18, f: 5, r: 8, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:usa_m1919_browning]).to be == {
            t: "sw", i: "mg", c: "usa", n: "M1919 Browning", y: 19, f: 8, r: 8, v: -1, s: 1, o: {
              r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:usa_m1_bazooka]).to be == {
            t: "sw", i: "rocket", c: "usa", n: "M1 Bazooka", y: 42, f: 8, r: 4, v: 0, s: 1, o: {
              b: 5, t: 1, p: 1,
            },
          }
          expect(defs[:usa_m1_mortar]).to be == {
            t: "sw", i: "mortar", c: "usa", n: "M1 Mortar", y: 35, f: 20, r: 24, v: -2, s: 1, o: {
              s: 1, m: 3, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:usa_m1a1_bazooka]).to be == {
            t: "sw", i: "rocket", c: "usa", n: "M1A1 Bazooka", y: 43, f: 10, r: 4, v: 0, s: 1, o: {
              b: 4, t: 1, p: 1,
            },
          }
          expect(defs[:usa_m2_4_2inch_mortar]).to be == {
            t: "sw", i: "mortar", c: "usa", n: "M2 4.2inch Mortar", y: 43, f: 24, r: 28, v: 2, o: {
              sn: 2, s: 1, m: 5, c: 1, tow: 2, t: 1, b: 3, e: 1,
            }, s: 2,
          }
          expect(defs[:usa_m2_browning]).to be == {
            t: "sw", i: "mg", c: "usa", n: "M2 Browning", y: 33, f: 20, r: 15, v: -2, s: 1, o: {
              r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:usa_m2_mortar]).to be == {
            t: "sw", i: "mortar", c: "usa", n: "M2 Mortar", y: 40, f: 12, r: 16, v: -1, s: 1, o: {
              m: 2, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:usa_m9_bazooka]).to be == {
            t: "sw", i: "rocket", c: "usa", n: "M9 Bazooka", y: 43, f: 10, r: 4, v: 0, s: 1, o: {
              b: 4, t: 1, p: 1,
            },
          }
          expect(defs[:usa_radio_105mm]).to be == {
            t: "sw", i: "radio", c: "usa", n: "Radio 105mm", y: 41, f: 40, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:usa_radio_155mm]).to be == {
            t: "sw", i: "radio", c: "usa", n: "Radio 155mm", y: 42, f: 80, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:usa_radio_75mm]).to be == {
            t: "sw", i: "radio", c: "usa", n: "Radio 75mm", y: 32, f: 24, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:usa_radio_8inch]).to be == {
            t: "sw", i: "radio", c: "usa", n: "Radio 8inch", y: 42, f: 96, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:usa_sc]).to be == {
            c: "usa", t: "sw", n: "Satchel Charge", y: 36, i: "explosive", f: 24, r: 1, v: 0, s: 1, o: {
              x: 1, t: 1, e: 1,
            },
          }
        end
      end

      context "soviet union" do
        it "has static definitions" do
          expect(defs[:ussr_120_pm_38]).to be == {
            t: "sw", i: "mortar", c: "ussr", n: "120-PM-38", y: 39, f: 32, r: 32, v: 2, o: {
              s: 1, m: 5, c: 1, tow: 2, t: 1, b: 3, e: 1,
            }, s: 2,
          }
          expect(defs[:ussr_82_bm_37]).to be == {
            t: "sw", i: "mortar", c: "ussr", n: "82-BM-37", y: 37, f: 20, r: 24, v: -2, s: 1, o: {
              s: 1, m: 3, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:ussr_82_pm_41]).to be == {
            t: "sw", i: "mortar", c: "ussr", n: "82-PM-41", y: 41, f: 20, r: 24, v: -2, s: 1, o: {
              s: 1, m: 3, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:ussr_ampulomet]).to be == {
            t: "sw", i: "rocket", c: "ussr", n: "Ampulomet", y: 41, f: 4, r: 6, v: -1, s: 1, o: {
              b: 5, i: 1, e: 1, t: 1,
            },
          }
          expect(defs[:ussr_dp_27]).to be == {
            t: "sw", i: "mg", c: "ussr", n: "DP-27", y: 28, f: 4, r: 8, v: 0, s: 1, o: {
              a: 1, r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:ussr_dshk]).to be == {
            t: "sw", i: "mg", c: "ussr", n: "DShK", y: 38, f: 24, r: 16, v: -2, s: 1, o: {
              r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:ussr_ft]).to be == {
            c: "ussr", t: "sw", n: "Flamethrower", y: 15, i: "flamethrower", f: 24, r: 1, v: 0, s: 1, o: {
              a: 1, i: 1, b: 4, e: 1,
            },
          }
          expect(defs[:ussr_mc]).to be == {
            c: "ussr", t: "sw", n: "Molotov Cocktail", y: 39, i: "explosive", f: 4, r: 1, v: 0, s: 1, o: {
              i: 1, x: 1, t: 1, sn: 1, e: 1,
            },
          }
          expect(defs[:ussr_pm_m1910]).to be == {
            t: "sw", i: "mg", c: "ussr", n: "PM M1910", y: 10, f: 6, r: 12, v: -2, s: 1, o: {
              r: 1, j: 3, f: 16,
            },
          }
          expect(defs[:ussr_radio_122mm]).to be == {
            t: "sw", i: "radio", c: "ussr", n: "Radio 122mm", y: 39, f: 48, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:ussr_radio_152mm]).to be == {
            t: "sw", i: "radio", c: "ussr", n: "Radio 152mm", y: 37, f: 64, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:ussr_radio_76mm]).to be == {
            t: "sw", i: "radio", c: "ussr", n: "Radio 76mm", y: 37, f: 24, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:ussr_radio_85mm]).to be == {
            t: "sw", i: "radio", c: "ussr", n: "Radio 85mm", y: 43, f: 32, r: 99, v: 0, s: 1, o: {
              s: 1, o: 1, j: 3, f: 18, e: 1,
            },
          }
          expect(defs[:ussr_rm_38]).to be == {
            t: "sw", i: "mortar", c: "ussr", n: "RM-38", y: 38, f: 8, r: 14, v: 0, s: 1, o: {
              m: 2, t: 1, b: 3, e: 1,
            },
          }
          expect(defs[:ussr_sc]).to be == {
            c: "ussr", t: "sw", n: "Satchel Charge", y: 36, i: "explosive", f: 24, r: 1, v: 0, s: 1, o: {
              x: 1, t: 1, e: 1,
            },
          }
          expect(defs[:ussr_sg_43]).to be == {
            t: "sw", i: "mg", c: "ussr", n: "SG-43", y: 43, f: 6, r: 10, v: -1, s: 1, o: {
              r: 1, j: 3, f: 16,
            },
          }
        end
      end
    end

    context "guns" do
      context "allied minors" do
        it "has static definitions" do
          expect(defs[:alm_75mm_gun]).to be == {
            t: "gun", i: "gun", v: 1, s: 3, c: "alm", n: "75mm Gun", y: 32, f: 16, r: 24, o: {
              tow: 3, t: 1, j: 3, f: 18, g: 1, s: 1, c: 1,
            },
          }
        end
      end

      context "axis minors" do
        it "has static definitions" do
          expect(defs[:axm_3_7cm_pak_36]).to be == {
            t: "gun", i: "atgun", v: 2, s: 2, c: "axm", n: "3.7cm Pak 36", y: 36, f: 8, r: 16, o: {
              tow: 2, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:axm_75mm_gun]).to be == {
            t: "gun", i: "gun", v: 1, s: 3, c: "axm", n: "75mm Gun", y: 32, f: 16, r: 24, o: {
              tow: 3, t: 1, j: 3, f: 18, g: 1, s: 1, c: 1,
            },
          }
        end
      end

      context "china" do
        it "has static definitions" do
          expect(defs[:chi_37mm_m3]).to be == {
            t: "gun", i: "atgun", v: 2, s: 2, c: "chi", n: "37mm M3", y: 42, f: 7, r: 12, o: {
              tow: 2, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:chi_45mm_19_k]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "chi", n: "45mm 19-K", y: 34, f: 12, r: 16, o: {
              tow: 2, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:chi_75mm_gun]).to be == {
            t: "gun", i: "gun", v: 1, s: 3, c: "chi", n: "75mm Gun", y: 32, f: 16, r: 24, o: {
              tow: 3, t: 1, j: 3, f: 18, g: 1, s: 1, c: 1,
            },
          }
          expect(defs[:chi_75mm_m1_pack]).to be == {
            t: "gun", i: "gun", v: 1, s: 3, c: "chi", n: "75mm M1 Pack", y: 42, f: 16, r: 20, o: {
              tow: 3, t: 1, j: 3, f: 18, g: 1, s: 1, c: 1,
            },
          }
          expect(defs[:chi_bofors_75mm]).to be == {
            t: "gun", i: "gun", v: 1, s: 3, c: "chi", n: "Bofors 75mm", y: 23, f: 16, r: 20, o: {
              tow: 3, t: 1, j: 3, f: 18, g: 1, s: 1, c: 1,
            },
          }
          expect(defs[:chi_type_30_at_gun]).to be == {
            t: "gun", i: "atgun", v: 2, s: 2, c: "chi", n: "Type 30 AT Gun", y: 36, f: 8, r: 16, o: {
              tow: 2, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
        end
      end

      context "finland" do
        it "has static definitions" do
          expect(defs[:fin_75mm_gun]).to be == {
            t: "gun", i: "gun", v: 1, s: 3, c: "fin", n: "75mm Gun", y: 32, f: 16, r: 24, o: {
              tow: 3, t: 1, j: 3, f: 18, g: 1, s: 1, c: 1,
            },
          }
        end
      end

      context "france" do
        it "has static definitions" do
          expect(defs[:fra_25mm_hotchkiss]).to be == {
            t: "gun", i: "atgun", v: 2, s: 2, c: "fra", n: "25mm Hotchkiss", y: 34, f: 4, r: 12, o: {
              sn: 1, tow: 2, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:fra_37mm_m1916]).to be == {
            t: "gun", i: "gun", v: 2, s: 2, c: "fra", n: "37mm M1916", y: 16, f: 6, r: 14, o: {
              tow: 2, t: 1, j: 3, f: 18, g: 1, s: 1, c: 1,
            },
          }
          expect(defs[:fra_47mm_atx]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "fra", n: "47mm ATX", y: 39, f: 16, r: 16, o: {
              tow: 2, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:fra_75mm_m1897]).to be == {
            t: "gun", i: "gun", v: 1, s: 3, c: "fra", n: "75mm M1897", y: 0, f: 16, r: 24, o: {
              tow: 3, t: 1, j: 3, f: 18, g: 1, s: 1, c: 1,
            },
          }
        end
      end

      context "german" do
        it "has static definitions" do
          expect(defs[:ger_12_8cm_pak_44]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "ger", n: "12.8cm Pak 44", y: 44, f: 96, r: 40, o: {
              y: 1, tow: 4, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:ger_15cm_sig_33]).to be == {
            t: "gun", i: "gun", v: 1, s: 3, c: "ger", n: "15cm sIG 33", y: 36, f: 48, r: 24, o: {
              tow: 3, t: 1, j: 3, f: 18, g: 1, s: 1, c: 1,
            },
          }
          expect(defs[:ger_10_5cm_gebh_40]).to be == {
            t: "gun", i: "gun", v: 1, s: 3, c: "ger", n: "10.5cm GebH 40", y: 42, f: 24, r: 32, o: {
              tow: 3, t: 1, j: 3, f: 18, g: 1, s: 1, c: 1, sn: 1,
            },
          }
          expect(defs[:ger_2_8cm_spzb_41]).to be == {
            t: "gun", i: "atgun", v: 2, s: 2, c: "ger", n: "2.8cm sPzB 41", y: 41, f: 8, r: 10, o: {
              tow: 2, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:ger_3_7cm_pak_36]).to be == {
            t: "gun", i: "atgun", v: 2, s: 2, c: "ger", n: "3.7cm Pak 36", y: 36, f: 8, r: 16, o: {
              tow: 2, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:ger_5cm_pak_38]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "ger", n: "5cm Pak 38", y: 40, f: 24, r: 16, o: {
              tow: 2, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:ger_7_5cm_leig_18]).to be == {
            t: "gun", i: "gun", v: 1, s: 3, c: "ger", n: "7.5cm leIG 18", y: 32, f: 16, r: 20, o: {
              tow: 3, t: 1, j: 3, f: 18, g: 1, s: 1, c: 1,
            },
          }
          expect(defs[:ger_7_5cm_gebg_36]).to be == {
            t: "gun", i: "gun", v: 1, s: 3, c: "ger", n: "7.5cm GebG 36", y: 38, f: 16, r: 20, o: {
              tow: 3, t: 1, j: 3, f: 18, g: 1, s: 1, c: 1,
            },
          }
          expect(defs[:ger_7_5cm_pak_40]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "ger", n: "7.5cm Pak 40", y: 42, f: 32, r: 24, o: {
              tow: 3, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:ger_7_5cm_pak_97_38]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "ger", n: "7.5cm Pak 97/38", y: 42, f: 24, r: 20, o: {
              sn: 1, tow: 3, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:ger_8_8cm_flak_36]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "ger", n: "8.8cm Flak 36", y: 36, f: 48, r: 30, o: {
              y: 1, tow: 4, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:ger_8_8cm_pak_43]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "ger", n: "8.8cm Pak 43", y: 43, f: 64, r: 32, o: {
              y: 1, tow: 4, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:ger_8_8cm_pak_43_41]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "ger", n: "8.8cm Pak 43/41", y: 43, f: 64, r: 32, o: {
              sn: 1, tow: 4, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
        end
      end

      context "italy" do
        it "has static definitions" do
          expect(defs[:ita_cannone_da_47_32]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "ita", n: "Cannone da 47/32", y: 35, f: 12, r: 16, o: {
              sn: 2, tow: 2, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:ita_cannone_da_47_40]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "ita", n: "Cannone da 47/40", y: 38, f: 16, r: 16, o: {
              sn: 2, tow: 2, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:ita_cannone_da_65_17]).to be == {
            t: "gun", i: "gun", v: 1, s: 3, c: "ita", n: "Cannone da 65/17", y: 13, f: 12, r: 20, o: {
              sn: 2, tow: 3, t: 1, j: 3, f: 18, g: 1, s: 1, c: 1,
            },
          }
          expect(defs[:ita_cannone_da_75_46]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "ita", n: "Cannone da 75/46", y: 34, f: 32, r: 24, o: {
              sn: 2, tow: 3, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:ita_cannone_da_90_53]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "ita", n: "Cannone da 90/53", y: 39, f: 48, r: 32, o: {
              sn: 2, tow: 4, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:ita_obice_da_100_17]).to be == {
            t: "gun", i: "gun", v: 1, s: 3, c: "ita", n: "Obice da 100/17", y: 14, f: 24, r: 32, o: {
              tow: 3, t: 1, j: 3, f: 18, g: 1, s: 1, c: 1,
            },
          }
          expect(defs[:ita_obice_da_75_18]).to be == {
            t: "gun", i: "gun", v: 1, s: 3, c: "ita", n: "Obice da 75/18", y: 34, f: 16, r: 24, o: {
              tow: 3, t: 1, j: 3, f: 18, g: 1, s: 1, c: 1,
            },
          }
        end
      end

      context "japan" do
        it "has static definitions" do
          expect(defs[:jap_37mm_type_1]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "jap", n: "37mm Type 1", y: 41, f: 10, r: 16, o: {
              tow: 2, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:jap_37mm_type_94]).to be == {
            t: "gun", i: "atgun", v: 2, s: 2, c: "jap", n: "37mm Type 94", y: 36, f: 8, r: 14, o: {
              tow: 2, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:jap_47mm_type_1]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "jap", n: "47mm Type 1", y: 42, f: 16, r: 16, o: {
              tow: 2, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:jap_70mm_type_92]).to be == {
            t: "gun", i: "gun", v: 2, s: 2, c: "jap", n: "70mm Type 92", y: 32, f: 16, r: 16, o: {
              tow: 2, t: 1, j: 3, f: 18, g: 1, s: 1, c: 1,
            },
          }
          expect(defs[:jap_75mm_type_90]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "jap", n: "75mm Type 90", y: 42, f: 32, r: 20, o: {
              tow: 3, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
        end
      end

      context "united kingdom" do
        it "has static definitions" do
          expect(defs[:uk_qf_17_pounder]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "uk", n: "QF 17-Pounder", y: 43, f: 48, r: 24, o: {
              tow: 4, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:uk_qf_25_pounder]).to be == {
            t: "gun", i: "gun", v: 1, s: 3, c: "uk", n: "QF 25-Pounder", y: 40, f: 20, r: 32, o: {
              tow: 3, t: 1, j: 3, f: 18, g: 1, s: 1, c: 1,
            },
          }
          expect(defs[:uk_qf_25pdr_short]).to be == {
            t: "gun", i: "gun", v: 1, s: 3, c: "uk", n: "QF 25Pdr Short", y: 43, f: 20, r: 20, o: {
              tow: 3, t: 1, j: 3, f: 18, g: 1, s: 1, c: 1,
            },
          }
          expect(defs[:uk_qf_2_pounder]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "uk", n: "QF 2-Pounder", y: 36, f: 10, r: 12, o: {
              tow: 2, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:uk_qf_4_5inch]).to be == {
            t: "gun", i: "gun", v: 1, s: 3, c: "uk", n: "QF 4.5inch", y: 8, f: 32, r: 24, o: {
              tow: 3, t: 1, j: 3, f: 18, g: 1, s: 1, c: 1,
            },
          }
          expect(defs[:uk_qf_6pdr_mk_ii]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "uk", n: "QF 6Pdr Mk II", y: 41, f: 20, r: 16, o: {
              tow: 3, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:uk_qf_6pdr_mk_iv]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "uk", n: "QF 6Pdr Mk IV", y: 41, f: 24, r: 20, o: {
              tow: 3, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
        end
      end

      context "united states" do
        it "has static definitions" do
          expect(defs[:usa_37mm_m3]).to be == {
            t: "gun", i: "atgun", v: 2, s: 2, c: "usa", n: "37mm M3", y: 38, f: 7, r: 12, o: {
              tow: 2, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:usa_3inch_m5]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "usa", n: "3inch M5", y: 43, f: 40, r: 24, o: {
              tow: 3, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:usa_57mm_m1]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "usa", n: "57mm M1", y: 42, f: 20, r: 16, o: {
              tow: 2, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:usa_57mm_m1a2]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "usa", n: "57mm M1A2", y: 43, f: 20, r: 16, o: {
              tow: 2, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:usa_75mm_m1897]).to be == {
            t: "gun", i: "gun", v: 1, s: 3, c: "usa", n: "75mm M1897", y: 40, f: 16, r: 24, o: {
              tow: 3, t: 1, j: 3, f: 18, g: 1, s: 1, c: 1,
            },
          }
          expect(defs[:usa_75mm_m1_pack]).to be == {
            t: "gun", i: "gun", v: 1, s: 3, c: "usa", n: "75mm M1 Pack", y: 27, f: 16, r: 20, o: {
              tow: 3, t: 1, j: 3, f: 18, g: 1, s: 1, c: 1,
            },
          }
        end
      end

      context "soviet union" do
        it "has static definitions" do
          expect(defs[:ussr_100mm_bs_3]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "ussr", n: "100mm BS-3", y: 44, f: 64, r: 30, o: {
              tow: 4, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:ussr_45mm_19_k]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "ussr", n: "45mm 19-K", y: 34, f: 12, r: 16, o: {
              tow: 2, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:ussr_45mm_53_k]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "ussr", n: "45mm 53-K", y: 37, f: 12, r: 16, o: {
              tow: 2, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:ussr_45mm_m_42]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "ussr", n: "45mm M-42", y: 42, f: 16, r: 16, o: {
              tow: 2, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:ussr_57mm_zis_2]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "ussr", n: "57mm ZiS-2", y: 41, f: 24, r: 20, o: {
              tow: 2, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:ussr_76mm_f_22]).to be == {
            t: "gun", i: "atgun", v: 1, s: 3, c: "ussr", n: "76mm F-22", y: 37, f: 32, r: 24, o: {
              tow: 3, t: 1, j: 3, f: 18, p: 1, c: 1,
            },
          }
          expect(defs[:ussr_76mm_zis_3]).to be == {
            t: "gun", i: "gun", v: 1, s: 3, c: "ussr", n: "76mm ZiS-3", y: 28, f: 16, r: 28, o: {
              tow: 3, t: 1, j: 3, f: 18, g: 1, s: 1, c: 1,
            },
          }
        end
      end
    end

    context "tanks" do
      context "allied minors" do
        it "has static definitions" do
          # NOP
        end
      end

      context "axis minors" do
        it "has static definitions" do
          expect(defs[:axm_38m_toldi_i]).to be == {
            t: "tank", i: "tank", c: "axm", n: "38M Toldi I", y: 39, s: 3, f: 3, r: 8, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 1, r: 0,
              }, ta: {
                f: 1, s: 1, r: 0,
              }, bd: 4, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:axm_42m_toldi_ii]).to be == {
            t: "tank", i: "tank", c: "axm", n: "42M Toldi II", y: 42, s: 3, f: 3, r: 8, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 2, s: 1, r: 1,
              }, ta: {
                f: 2, s: 1, r: 1,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:axm_42m_toldi_iia]).to be == {
            t: "tank", i: "tank", c: "axm", n: "42M Toldi IIA", y: 43, s: 3, f: 8, r: 12, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 1, r: 1,
              }, ta: {
                f: 3, s: 1, r: 1,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:axm_r_2]).to be == {
            t: "tank", i: "tank", c: "axm", n: "R-2", y: 38, s: 3, f: 8, r: 12, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 2, s: 1, r: 1,
              }, ta: {
                f: 2, s: 1, r: 2,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:axm_t_3]).to be == {
            t: "tank", i: "tank", c: "axm", n: "T-3", y: 42, s: 4, f: 16, r: 16, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 4, s: 4, r: 4,
              }, ta: {
                f: 4, s: 4, r: 4,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:axm_t_38]).to be == {
            t: "tank", i: "tank", c: "axm", n: "T-38", y: 40, s: 3, f: 8, r: 14, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 1, r: 1,
              }, ta: {
                f: 4, s: 1, r: 1,
              }, sn: 1, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:axm_t_4]).to be == {
            t: "tank", i: "tank", c: "axm", n: "T-4", y: 43, s: 4, f: 32, r: 20, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 6, s: 3, r: 2,
              }, ta: {
                f: 4, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
        end
      end

      context "china" do
        it "has static definitions" do
          expect(defs[:chi_m3_stuart]).to be == {
            t: "tank", i: "tank", c: "chi", n: "M3 Stuart", y: 42, s: 3, f: 7, r: 10, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 2, r: 2,
              }, ta: {
                f: 4, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:chi_m4_sherman]).to be == {
            t: "tank", i: "tank", c: "chi", n: "M4 Sherman", y: 43, s: 5, f: 24, r: 16, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 5, s: 3, r: 3,
              }, ta: {
                f: 6, s: 5, r: 5,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:chi_t_26]).to be == {
            t: "tank", i: "tank", c: "chi", n: "T-26", y: 38, s: 3, f: 12, r: 16, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 1, r: 1,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:chi_vickers_6_ton]).to be == {
            t: "tank", i: "tank", c: "chi", n: "Vickers 6-Ton", y: 34, s: 3, f: 8, r: 8, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 1, r: 1,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
        end
      end

      context "finland" do
        it "has static definitions" do
          # NOP
        end
      end

      context "france" do
        it "has static definitions" do
          expect(defs[:fra_amc_35]).to be == {
            t: "tank", i: "tank", c: "fra", n: "AMC 35", y: 38, s: 3, f: 16, r: 16, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 2, s: 2, r: 2,
              }, ta: {
                f: 2, s: 2, r: 2,
              }, bd: 4, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:fra_amr_33]).to be == {
            t: "tank", i: "tank", c: "fra", n: "AMR 33", y: 33, s: 3, f: 4, r: 8, v: 6, o: {
              r: 1, ha: {
                f: 1, s: 1, r: 1,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:fra_amr_35_13_2mg]).to be == {
            t: "tank", i: "tank", c: "fra", n: "AMR 35 (13.2MG)", y: 36, s: 3, f: 10, r: 12, v: 6, o: {
              r: 1, ha: {
                f: 1, s: 1, r: 1,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, sn: 2, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:fra_amr_35_7_5mg]).to be == {
            t: "tank", i: "tank", c: "fra", n: "AMR 35 (7.5MG)", y: 36, s: 3, f: 4, r: 8, v: 6, o: {
              r: 1, ha: {
                f: 1, s: 1, r: 1,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, sn: 1, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:fra_amr_35_zt2]).to be == {
            t: "tank", i: "tank", c: "fra", n: "AMR 35 ZT2", y: 36, s: 3, f: 4, r: 12, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 1, r: 1,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:fra_char_b1]).to be == {
            t: "tank", i: "tank", c: "fra", n: "Char B1", y: 35, s: 5, f: 10, r: 12, v: 3, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 3, r: 3,
              }, ta: {
                f: 3, s: 3, r: 3,
              }, sg: {
                f: 20, r: 12, t: "p",
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:fra_char_b1_bis]).to be == {
            t: "tank", i: "tank", c: "fra", n: "Char B1 bis", y: 37, s: 5, f: 12, r: 12, v: 3, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 4, r: 4,
              }, ta: {
                f: 3, s: 3, r: 3,
              }, sg: {
                f: 20, r: 12, t: "p",
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:fra_char_d2]).to be == {
            t: "tank", i: "tank", c: "fra", n: "Char D2", y: 36, s: 4, f: 16, r: 16, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 3, r: 3,
              }, ta: {
                f: 3, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:fra_fcm_36]).to be == {
            t: "tank", i: "tank", c: "fra", n: "FCM 36", y: 38, s: 3, f: 8, r: 12, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 3, r: 3,
              }, ta: {
                f: 3, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:fra_hotchkiss_h35]).to be == {
            t: "tank", i: "tank", c: "fra", n: "Hotchkiss H35", y: 36, s: 3, f: 8, r: 12, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 3, r: 3,
              }, ta: {
                f: 3, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:fra_hotchkiss_h35_39]).to be == {
            t: "tank", i: "tank", c: "fra", n: "Hotchkiss H35/39", y: 39, s: 3, f: 10, r: 12, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 3, r: 3,
              }, ta: {
                f: 3, s: 3, r: 3,
              }, sn: 3, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:fra_m4_sherman]).to be == {
            t: "tank", i: "tank", c: "fra", n: "M4 Sherman", y: 43, s: 5, f: 24, r: 16, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 5, s: 3, r: 3,
              }, ta: {
                f: 6, s: 5, r: 5,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:fra_renault_r35]).to be == {
            t: "tank", i: "tank", c: "fra", n: "Renault R35", y: 36, s: 3, f: 8, r: 12, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 3, r: 3,
              }, ta: {
                f: 3, s: 3, r: 3,
              }, bd: 3, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:fra_renault_r40]).to be == {
            t: "tank", i: "tank", c: "fra", n: "Renault R40", y: 36, s: 3, f: 10, r: 12, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 3, r: 3,
              }, ta: {
                f: 3, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:fra_somua_s35]).to be == {
            t: "tank", i: "tank", c: "fra", n: "SOMUA S35", y: 35, s: 4, f: 16, r: 16, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 3, r: 3,
              }, ta: {
                f: 3, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
        end
      end

      context "german" do
        it "has static definitions" do
          expect(defs[:ger_panther_a_g]).to be == {
            t: "tank", i: "tank", c: "ger", n: "Panther A/G", y: 43, s: 6, f: 40, r: 32, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 6, s: 3, r: 3,
              }, ta: {
                f: 7, s: 4, r: 4,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_panther_d]).to be == {
            t: "tank", i: "tank", c: "ger", n: "Panther D", y: 43, s: 6, f: 40, r: 32, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 6, s: 3, r: 3,
              }, ta: {
                f: 7, s: 4, r: 4,
              }, bd: 3, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_pzkpfw_35t]).to be == {
            t: "tank", i: "tank", c: "ger", n: "PzKpfw 35(t)", y: 38, s: 3, f: 8, r: 12, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 2, s: 1, r: 1,
              }, ta: {
                f: 2, s: 1, r: 2,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_pzkpfw_38t_a_d]).to be == {
            t: "tank", i: "tank", c: "ger", n: "PzKpfw 38(t) A/D", y: 39, s: 3, f: 8, r: 14, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 2, s: 1, r: 1,
              }, ta: {
                f: 2, s: 1, r: 1,
              }, sn: 1, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_pzkpfw_38t_e_g]).to be == {
            t: "tank", i: "tank", c: "ger", n: "PzKpfw 38(t) E/G", y: 40, s: 3, f: 8, r: 14, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 1, r: 1,
              }, ta: {
                f: 4, s: 1, r: 1,
              }, sn: 1, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_pzkpfw_i]).to be == {
            t: "tank", i: "tank", c: "ger", n: "PzKpfw I", y: 34, s: 3, f: 8, r: 8, v: 5, o: {
              r: 1, ha: {
                f: 1, s: 1, r: 1,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_pzkpfw_ii_a_e]).to be == {
            t: "tank", i: "tank", c: "ger", n: "PzKpfw II-A/E", y: 37, s: 3, f: 3, r: 10, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 1, r: 1,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_pzkpfw_ii_f]).to be == {
            t: "tank", i: "tank", c: "ger", n: "PzKpfw II-F", y: 41, s: 3, f: 3, r: 10, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 1, r: 1,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_pzkpfw_ii_luchs]).to be == {
            t: "tank", i: "tank", c: "ger", n: "PzKpfw II Luchs", y: 43, s: 3, f: 4, r: 10, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 2, r: 2,
              }, ta: {
                f: 2, s: 2, r: 2,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_pzkpfw_iii__39]).to be == {
            t: "tank", i: "tank", c: "ger", n: "PzKpfw III ('39)", y: 39, s: 4, f: 8, r: 14, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 3, r: 3,
              }, ta: {
                f: 3, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_pzkpfw_iii__40]).to be == {
            t: "tank", i: "tank", c: "ger", n: "PzKpfw III ('40)", y: 40, s: 4, f: 16, r: 16, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 3, r: 3,
              }, ta: {
                f: 3, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_pzkpfw_iii_j]).to be == {
            t: "tank", i: "tank", c: "ger", n: "PzKpfw III-J", y: 41, s: 4, f: 16, r: 16, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 4, r: 4,
              }, ta: {
                f: 4, s: 4, r: 4,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_pzkpfw_iii_l]).to be == {
            t: "tank", i: "tank", c: "ger", n: "PzKpfw III-L", y: 41, s: 4, f: 24, r: 20, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 4, r: 4,
              }, ta: {
                f: 4, s: 4, r: 4,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_pzkpfw_iii_n]).to be == {
            t: "tank", i: "tank", c: "ger", n: "PzKpfw III-N", y: 42, s: 4, f: 16, r: 16, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 4, s: 4, r: 4,
              }, ta: {
                f: 4, s: 4, r: 4,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_pzkpfw_iv_a]).to be == {
            t: "tank", i: "tank", c: "ger", n: "PzKpfw IV-A", y: 39, s: 4, f: 16, r: 16, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 1, s: 1, r: 1,
              }, ta: {
                f: 2, s: 1, r: 1,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_pzkpfw_iv_b_c]).to be == {
            t: "tank", i: "tank", c: "ger", n: "PzKpfw IV-B/C", y: 39, s: 4, f: 16, r: 16, v: 6, o: {
              t: 1, g: 1, ha: {
                f: 3, s: 1, r: 1,
              }, ta: {
                f: 3, s: 1, r: 1,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_pzkpfw_iv_d]).to be == {
            t: "tank", i: "tank", c: "ger", n: "PzKpfw IV-D", y: 39, s: 4, f: 16, r: 16, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 3, s: 2, r: 2,
              }, ta: {
                f: 3, s: 2, r: 2,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_pzkpfw_iv_e]).to be == {
            t: "tank", i: "tank", c: "ger", n: "PzKpfw IV-E", y: 40, s: 4, f: 16, r: 16, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 4, s: 3, r: 2,
              }, ta: {
                f: 3, s: 2, r: 2,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_pzkpfw_iv_f1]).to be == {
            t: "tank", i: "tank", c: "ger", n: "PzKpfw IV-F1", y: 41, s: 4, f: 16, r: 16, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 4, s: 3, r: 2,
              }, ta: {
                f: 4, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_pzkpfw_iv_f2]).to be == {
            t: "tank", i: "tank", c: "ger", n: "PzKpfw IV-F2", y: 42, s: 4, f: 32, r: 20, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 3, r: 2,
              }, ta: {
                f: 4, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_pzkpfw_iv_g]).to be == {
            t: "tank", i: "tank", c: "ger", n: "PzKpfw IV-G", y: 43, s: 4, f: 32, r: 20, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 6, s: 3, r: 2,
              }, ta: {
                f: 4, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_pzkpfw_iv_h_j]).to be == {
            t: "tank", i: "tank", c: "ger", n: "PzKpfw IV-H/J", y: 43, s: 5, f: 32, r: 24, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 6, s: 3, r: 2,
              }, ta: {
                f: 4, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_tiger_i]).to be == {
            t: "tank", i: "tank", c: "ger", n: "Tiger I", y: 42, s: 7, f: 48, r: 32, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 7, s: 4, r: 4,
              }, ta: {
                f: 8, s: 6, r: 6,
              }, bd: 3, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ger_tiger_ii]).to be == {
            t: "tank", i: "tank", c: "ger", n: "Tiger II", y: 44, s: 8, f: 64, r: 32, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 9, s: 6, r: 6,
              }, ta: {
                f: 9, s: 6, r: 6,
              }, bd: 4, j: 3, f: 18, u: 1, k: 1,
            },
          }
        end
      end

      context "italy" do
        it "has static definitions" do
          expect(defs[:ita_l5_30]).to be == {
            t: "tank", i: "tank", c: "ita", n: "L5/30", y: 30, s: 3, f: 10, r: 8, v: 4, o: {
              r: 1, ha: {
                f: 1, s: 1, r: 0,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ita_l6_40]).to be == {
            t: "tank", i: "tank", c: "ita", n: "L6/40", y: 40, s: 3, f: 3, r: 12, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 1, r: 0,
              }, ta: {
                f: 3, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ita_m11_39]).to be == {
            t: "tank", i: "tank", c: "ita", n: "M11/39", y: 39, s: 3, f: 5, r: 7, v: 4, o: {
              r: 1, ha: {
                f: 3, s: 1, r: 0,
              }, ta: {
                f: 3, s: 3, r: 3,
              }, sg: {
                f: 8, r: 12, t: "p",
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ita_m13_40]).to be == {
            t: "tank", i: "tank", c: "ita", n: "M13/40", y: 40, s: 3, f: 12, r: 14, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 2, r: 2,
              }, ta: {
                f: 3, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ita_m14_41]).to be == {
            t: "tank", i: "tank", c: "ita", n: "M14/41", y: 41, s: 3, f: 12, r: 14, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 2, r: 2,
              }, ta: {
                f: 3, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ita_m15_42]).to be == {
            t: "tank", i: "tank", c: "ita", n: "M15/42", y: 43, s: 4, f: 12, r: 14, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 2, r: 2,
              }, ta: {
                f: 4, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ita_m26_40]).to be == {
            t: "tank", i: "tank", c: "ita", n: "M26/40", y: 43, s: 5, f: 24, r: 16, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 3, r: 3,
              }, ta: {
                f: 4, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
        end
      end

      context "japan" do
        it "has static definitions" do
          expect(defs[:jap_type_2_ka_mi]).to be == {
            t: "tank", i: "tank-amp", c: "jap", n: "Type 2 Ka-Mi", y: 41, s: 3, f: 8, r: 14, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 0, s: 0, r: 0,
              }, amp: 1, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:jap_type_89_i_go]).to be == {
            t: "tank", i: "tank", c: "jap", n: "Type 89 I-Go", y: 31, s: 3, f: 10, r: 12, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 1, s: 0, r: 0,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:jap_type_94]).to be == {
            t: "tank", i: "tank", c: "jap", n: "Type 94", y: 34, s: 3, f: 4, r: 8, v: 4, o: {
              r: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 1, s: 0, r: 0,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:jap_type_95_ha_go]).to be == {
            t: "tank", i: "tank", c: "jap", n: "Type 95 Ha-Go", y: 33, s: 3, f: 4, r: 12, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 1, r: 1,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:jap_type_97_chi_ha]).to be == {
            t: "tank", i: "tank", c: "jap", n: "Type 97 Chi-Ha", y: 38, s: 3, f: 10, r: 12, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 2, s: 1, r: 1,
              }, ta: {
                f: 2, s: 1, r: 1,
              }, sn: 1, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:jap_type_97_kai]).to be == {
            t: "tank", i: "tank", c: "jap", n: "Type 97 Kai", y: 39, s: 4, f: 16, r: 14, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 2, s: 2, r: 2,
              }, ta: {
                f: 3, s: 2, r: 2,
              }, sn: 1, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:jap_type_97_te_ke]).to be == {
            t: "tank", i: "tank", c: "jap", n: "Type 97 Te-Ke", y: 38, s: 3, f: 8, r: 12, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:jap_type_97_te_ke_mg]).to be == {
            t: "tank", i: "tank", c: "jap", n: "Type 97 Te-Ke MG", y: 30, s: 3, f: 4, r: 8, v: 4, o: {
              r: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, sn: 2, j: 3, f: 18, u: 1, k: 1,
            },
          }
        end
      end

      context "united kingdom" do
        it "has static definitions" do
          expect(defs[:uk_centaur]).to be == {
            t: "tank", i: "tank", c: "uk", n: "Centaur", y: 44, s: 5, f: 24, r: 16, v: 7, o: {
              t: 1, p: 1, ha: {
                f: 5, s: 3, r: 3,
              }, ta: {
                f: 6, s: 4, r: 4,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_challenger]).to be == {
            t: "tank", i: "tank", c: "uk", n: "Challenger", y: 44, s: 5, f: 48, r: 32, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 5, s: 3, r: 3,
              }, ta: {
                f: 5, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_churchill_i_ii]).to be == {
            t: "tank", i: "tank", c: "uk", n: "Churchill I-II", y: 41, s: 6, f: 10, r: 12, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 7, s: 5, r: 4,
              }, ta: {
                f: 6, s: 5, r: 5,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_churchill_iii_iv]).to be == {
            t: "tank", i: "tank", c: "uk", n: "Churchill III-IV", y: 42, s: 6, f: 20, r: 16, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 7, s: 5, r: 4,
              }, ta: {
                f: 6, s: 5, r: 5,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_churchill_v_vi]).to be == {
            t: "tank", i: "tank", c: "uk", n: "Churchill V-VI", y: 43, s: 6, f: 24, r: 16, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 7, s: 5, r: 4,
              }, ta: {
                f: 6, s: 5, r: 5,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_churchill_vii_viii]).to be == {
            t: "tank", i: "tank", c: "uk", n: "Churchill VII-VIII", y: 44, s: 6, f: 24, r: 16, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 9, s: 6, r: 4,
              }, ta: {
                f: 9, s: 6, r: 6,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_comet]).to be == {
            t: "tank", i: "tank", c: "uk", n: "Comet", y: 44, s: 6, f: 40, r: 28, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 5, s: 3, r: 3,
              }, ta: {
                f: 7, s: 4, r: 4,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_cromwell]).to be == {
            t: "tank", i: "tank", c: "uk", n: "Cromwell", y: 44, s: 5, f: 24, r: 16, v: 7, o: {
              t: 1, p: 1, ha: {
                f: 5, s: 3, r: 3,
              }, ta: {
                f: 6, s: 4, r: 4,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_cruiser_mk_i]).to be == {
            t: "tank", i: "tank", c: "uk", n: "Cruiser Mk I", y: 38, s: 3, f: 10, r: 12, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 1, r: 1,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, bd: 3, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_cruiser_mk_ii]).to be == {
            t: "tank", i: "tank", c: "uk", n: "Cruiser Mk II", y: 40, s: 3, f: 10, r: 12, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 2, s: 2, r: 2,
              }, ta: {
                f: 2, s: 2, r: 2,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_cruiser_mk_iii]).to be == {
            t: "tank", i: "tank", c: "uk", n: "Cruiser Mk III", y: 40, s: 3, f: 10, r: 12, v: 7, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 1, r: 1,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, bd: 3, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_cruiser_mk_iv]).to be == {
            t: "tank", i: "tank", c: "uk", n: "Cruiser Mk IV", y: 40, s: 3, f: 10, r: 12, v: 7, o: {
              t: 1, p: 1, ha: {
                f: 2, s: 2, r: 2,
              }, ta: {
                f: 2, s: 2, r: 2,
              }, bd: 3, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_crusader_i]).to be == {
            t: "tank", i: "tank", c: "uk", n: "Crusader I", y: 41, s: 4, f: 10, r: 12, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 3, r: 3,
              }, ta: {
                f: 3, s: 3, r: 3,
              }, bd: 3, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_crusader_ii]).to be == {
            t: "tank", i: "tank", c: "uk", n: "Crusader II", y: 41, s: 4, f: 10, r: 12, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 3, r: 3,
              }, ta: {
                f: 4, s: 3, r: 3,
              }, bd: 3, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_crusader_iii]).to be == {
            t: "tank", i: "tank", c: "uk", n: "Crusader III", y: 42, s: 4, f: 20, r: 16, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 3, r: 3,
              }, ta: {
                f: 4, s: 3, r: 3,
              }, bd: 3, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_light_tank_mk_vi]).to be == {
            t: "tank", i: "tank", c: "uk", n: "Light Tank Mk VI", y: 36, s: 3, f: 8, r: 12, v: 6, o: {
              r: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, sn: 1, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_m22_locust]).to be == {
            t: "tank", i: "tank", c: "uk", n: "M22 Locust", y: 42, s: 3, f: 7, r: 10, v: 7, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 1, s: 0, r: 0,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_m24_chaffee]).to be == {
            t: "tank", i: "tank", c: "uk", n: "M24 Chaffee", y: 44, s: 4, f: 24, r: 16, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 2, r: 2,
              }, ta: {
                f: 3, s: 2, r: 2,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_m3_grant]).to be == {
            t: "tank", i: "tank", c: "uk", n: "M3 Grant", y: 41, s: 5, f: 7, r: 10, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 3, r: 3,
              }, ta: {
                f: 4, s: 4, r: 4,
              }, sg: {
                f: 20, r: 12, t: "p",
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_m3_lee]).to be == {
            t: "tank", i: "tank", c: "uk", n: "M3 Lee", y: 41, s: 5, f: 7, r: 10, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 3, r: 3,
              }, ta: {
                f: 4, s: 4, r: 4,
              }, sg: {
                f: 20, r: 12, t: "p",
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_m3_stuart]).to be == {
            t: "tank", i: "tank", c: "uk", n: "M3 Stuart", y: 41, s: 3, f: 7, r: 10, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 2, r: 2,
              }, ta: {
                f: 4, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_m476_sherman]).to be == {
            t: "tank", i: "tank", c: "uk", n: "M4(76) Sherman", y: 43, s: 5, f: 40, r: 24, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 5, s: 3, r: 3,
              }, ta: {
                f: 6, s: 5, r: 5,
              }, sn: 1, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_m4_sherman]).to be == {
            t: "tank", i: "tank", c: "uk", n: "M4 Sherman", y: 42, s: 5, f: 24, r: 16, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 3, r: 3,
              }, ta: {
                f: 5, s: 4, r: 4,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_matilda_i]).to be == {
            t: "tank", i: "tank", c: "uk", n: "Matilda I", y: 38, s: 3, f: 8, r: 12, v: 3, o: {
              r: 1, ha: {
                f: 4, s: 2, r: 2,
              }, ta: {
                f: 4, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_matilda_ii]).to be == {
            t: "tank", i: "tank", c: "uk", n: "Matilda II", y: 39, s: 5, f: 10, r: 12, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 6, s: 5, r: 4,
              }, ta: {
                f: 5, s: 5, r: 5,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_sherman_firefly]).to be == {
            t: "tank", i: "tank", c: "uk", n: "Sherman Firefly", y: 43, s: 5, f: 40, r: 24, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 5, s: 3, r: 3,
              }, ta: {
                f: 6, s: 5, r: 5,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_tetrarch]).to be == {
            t: "tank", i: "tank", c: "uk", n: "Tetrarch", y: 38, s: 3, f: 10, r: 12, v: 7, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_valentine_i_vii]).to be == {
            t: "tank", i: "tank", c: "uk", n: "Valentine I-VII", y: 40, s: 4, f: 10, r: 12, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 5, s: 4, r: 4,
              }, ta: {
                f: 5, s: 4, r: 4,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:uk_valentine_ix_x]).to be == {
            t: "tank", i: "tank", c: "uk", n: "Valentine IX-X", y: 43, s: 4, f: 20, r: 16, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 5, s: 4, r: 4,
              }, ta: {
                f: 5, s: 4, r: 4,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
        end
      end

      context "united states" do
        it "has static definitions" do
          expect(defs[:usa_m24_chaffee]).to be == {
            t: "tank", i: "tank", c: "usa", n: "M24 Chaffee", y: 44, s: 4, f: 24, r: 16, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 2, r: 2,
              }, ta: {
                f: 3, s: 2, r: 2,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:usa_m26_pershing]).to be == {
            t: "tank", i: "tank", c: "usa", n: "M26 Pershing", y: 44, s: 6, f: 48, r: 32, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 5, s: 5, r: 5,
              }, ta: {
                f: 7, s: 5, r: 5,
              }, bd: 3, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:usa_m2a4]).to be == {
            t: "tank", i: "tank", c: "usa", n: "M2A4", y: 35, s: 3, f: 6, r: 8, v: 7, o: {
              t: 1, p: 1, ha: {
                f: 2, s: 2, r: 2,
              }, ta: {
                f: 2, s: 2, r: 2,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:usa_m3_lee]).to be == {
            t: "tank", i: "tank", c: "usa", n: "M3 Lee", y: 41, s: 5, f: 7, r: 10, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 3, r: 3,
              }, ta: {
                f: 4, s: 4, r: 4,
              }, sg: {
                f: 20, r: 12, t: "p",
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:usa_m3_stuart]).to be == {
            t: "tank", i: "tank", c: "usa", n: "M3 Stuart", y: 41, s: 3, f: 7, r: 10, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 2, r: 2,
              }, ta: {
                f: 4, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:usa_m4105_sherman]).to be == {
            t: "tank", i: "tank", c: "usa", n: "M4(105) Sherman", y: 42, s: 5, f: 32, r: 16, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 4, s: 3, r: 3,
              }, ta: {
                f: 5, s: 4, r: 4,
              }, sn: 2, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:usa_m476_sherman]).to be == {
            t: "tank", i: "tank", c: "usa", n: "M4(76) Sherman", y: 43, s: 5, f: 40, r: 24, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 5, s: 3, r: 3,
              }, ta: {
                f: 6, s: 5, r: 5,
              }, sn: 1, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:usa_m4_sherman]).to be == {
            t: "tank", i: "tank", c: "usa", n: "M4 Sherman", y: 42, s: 5, f: 24, r: 16, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 3, r: 3,
              }, ta: {
                f: 5, s: 4, r: 4,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:usa_m4a3e2_sherman]).to be == {
            t: "tank", i: "tank", c: "usa", n: "M4A3E2 Sherman", y: 44, s: 6, f: 24, r: 16, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 7, s: 5, r: 5,
              }, ta: {
                f: 9, s: 9, r: 9,
              }, sn: 2, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:usa_m4a3e8_sherman]).to be == {
            t: "tank", i: "tank", c: "usa", n: "M4A3E8 Sherman", y: 44, s: 6, f: 40, r: 24, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 7, s: 5, r: 5,
              }, ta: {
                f: 9, s: 9, r: 9,
              }, sn: 2, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:usa_m5_stuart]).to be == {
            t: "tank", i: "tank", c: "usa", n: "M5 Stuart", y: 42, s: 3, f: 7, r: 10, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 2, r: 2,
              }, ta: {
                f: 4, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
        end
      end

      context "soviet union" do
        it "has static definitions" do
          expect(defs[:ussr_bt_5]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "BT-5", y: 32, s: 3, f: 12, r: 16, v: 9, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 1, r: 1,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_bt_7]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "BT-7", y: 35, s: 3, f: 12, r: 16, v: 9, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 1, r: 1,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_churchill_ii]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "Churchill II", y: 41, s: 6, f: 10, r: 12, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 7, s: 5, r: 4,
              }, ta: {
                f: 6, s: 5, r: 5,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_churchill_iii]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "Churchill III", y: 42, s: 6, f: 20, r: 16, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 7, s: 5, r: 4,
              }, ta: {
                f: 6, s: 5, r: 5,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_is_2]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "IS-2", y: 44, s: 6, f: 96, r: 32, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 7, s: 6, r: 6,
              }, ta: {
                f: 8, s: 6, r: 6,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_kv_1_m39]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "KV-1 M39", y: 39, s: 6, f: 24, r: 22, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 5, s: 3, r: 3,
              }, ta: {
                f: 4, s: 3, r: 3,
              }, bd: 4, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_kv_1_m40]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "KV-1 M40", y: 40, s: 6, f: 24, r: 22, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 5, s: 4, r: 4,
              }, ta: {
                f: 6, s: 4, r: 4,
              }, bd: 3, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_kv_1_m41]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "KV-1 M41", y: 41, s: 6, f: 24, r: 22, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 6, s: 4, r: 4,
              }, ta: {
                f: 6, s: 4, r: 4,
              }, bd: 3, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_kv_1_m42]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "KV-1 M42", y: 42, s: 6, f: 32, r: 24, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 8, s: 5, r: 5,
              }, ta: {
                f: 8, s: 5, r: 5,
              }, bd: 3, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_kv_1s]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "KV-1S", y: 42, s: 6, f: 32, r: 24, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 6, s: 4, r: 4,
              }, ta: {
                f: 6, s: 4, r: 4,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_kv_2]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "KV-2", y: 40, s: 7, f: 64, r: 32, v: 4, o: {
              t: 1, g: 1, ha: {
                f: 7, s: 4, r: 4,
              }, ta: {
                f: 7, s: 4, r: 4,
              }, bd: 3, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_kv_85]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "KV-85", y: 43, s: 6, f: 48, r: 28, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 7, s: 4, r: 4,
              }, ta: {
                f: 7, s: 4, r: 4,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_m3_grant]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "M3 Grant", y: 41, s: 5, f: 7, r: 10, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 3, r: 3,
              }, ta: {
                f: 4, s: 4, r: 4,
              }, bd: 4, sg: {
                f: 20, r: 12, t: "p",
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_m3_stuart]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "M3 Stuart", y: 41, s: 3, f: 7, r: 10, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 2, r: 2,
              }, ta: {
                f: 4, s: 3, r: 3,
              }, bd: 4, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_m476_sherman]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "M4(76) Sherman", y: 44, s: 5, f: 40, r: 24, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 5, s: 3, r: 3,
              }, ta: {
                f: 6, s: 5, r: 5,
              }, sn: 1, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_m4_sherman]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "M4 Sherman", y: 43, s: 5, f: 24, r: 16, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 5, s: 3, r: 3,
              }, ta: {
                f: 6, s: 5, r: 5,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_matilda_ii]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "Matilda II", y: 41, s: 5, f: 10, r: 12, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 6, s: 5, r: 4,
              }, ta: {
                f: 5, s: 5, r: 5,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_t_26_m38]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "T-26 M38", y: 38, s: 3, f: 12, r: 16, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 1, r: 1,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_t_26_m39]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "T-26 M39", y: 39, s: 3, f: 12, r: 16, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 2, s: 1, r: 1,
              }, ta: {
                f: 2, s: 1, r: 1,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_t_34_85]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "T-34-85", y: 43, s: 5, f: 48, r: 28, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 3, r: 3,
              }, ta: {
                f: 6, s: 4, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_t_34_85_m44]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "T-34-85 M44", y: 44, s: 5, f: 48, r: 28, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 3, r: 3,
              }, ta: {
                f: 8, s: 4, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_t_34_m40]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "T-34 M40", y: 40, s: 5, f: 24, r: 22, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 3, r: 3,
              }, ta: {
                f: 3, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_t_34_m41]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "T-34 M41", y: 41, s: 5, f: 32, r: 24, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 3, r: 3,
              }, ta: {
                f: 4, s: 4, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_t_34_m42_m43]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "T-34 M42/M43", y: 42, s: 5, f: 32, r: 24, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 3, r: 3,
              }, ta: {
                f: 6, s: 4, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_t_70]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "T-70", y: 42, s: 3, f: 12, r: 16, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 3, r: 3,
              }, ta: {
                f: 4, s: 3, r: 3,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:ussr_valentine]).to be == {
            t: "tank", i: "tank", c: "ussr", n: "Valentine", y: 41, s: 4, f: 10, r: 12, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 5, s: 4, r: 4,
              }, ta: {
                f: 5, s: 4, r: 4,
              }, j: 3, f: 18, u: 1, k: 1,
            },
          }
        end
      end
    end

    context "self-propelled guns" do
      context "allied minors" do
        it "has static definitions" do
          # NOP
        end
      end

      context "axis minors" do
        it "has static definitions" do
          expect(defs[:axm_fiat_l3]).to be == {
            t: "spg", c: "axm", n: "Fiat L3", y: 35, s: 3, f: 10, r: 8, v: 6, o: {
              r: 1, ha: {
                f: 1, s: 1, r: -1,
              }, k: 1, j: 3, f: 18,
            }, i: "spgmg",
          }
        end
      end

      context "china" do
        it "has static definitions" do
          # NOP
        end
      end

      context "finland" do
        it "has static definitions" do
          # NOP
        end
      end

      context "france" do
        it "has static definitions" do
          expect(defs[:fra_amr_35_zt3]).to be == {
            t: "spg", c: "fra", n: "AMR 35 ZT3", y: 36, s: 3, f: 4, r: 12, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 1, r: 1,
              }, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:fra_m10]).to be == {
            t: "spg", c: "fra", n: "M10", y: 43, s: 5, f: 32, r: 20, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 2, r: 2,
              }, ta: {
                f: 4, s: 2, r: 2, t: -1,
              }, u: 1, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
        end
      end

      context "german" do
        it "has static definitions" do
          expect(defs[:ger_elefant]).to be == {
            t: "spg", c: "ger", n: "Elefant", y: 42, s: 8, f: 64, r: 32, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 9, s: 3, r: 3,
              }, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:ger_hetzer]).to be == {
            t: "spg", c: "ger", n: "Hetzer", y: 44, s: 4, f: 40, r: 32, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 2, r: 2,
              }, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:ger_jagdpanther]).to be == {
            t: "spg", c: "ger", n: "Jagdpanther", y: 44, s: 6, f: 64, r: 32, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 6, s: 4, r: 3,
              }, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:ger_jagdpanzer_iv]).to be == {
            t: "spg", c: "ger", n: "Jagdpanzer IV", y: 43, s: 5, f: 40, r: 32, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 6, s: 3, r: 2,
              }, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:ger_jagdtiger]).to be == {
            t: "spg", c: "ger", n: "Jagdtiger", y: 44, s: 8, f: 96, r: 40, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 9, s: 6, r: 6,
              }, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:ger_marder_i]).to be == {
            t: "spg", c: "ger", n: "Marder I", y: 42, s: 3, f: 32, r: 24, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 1, r: -1,
              }, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:ger_marder_ii]).to be == {
            t: "spg", c: "ger", n: "Marder II", y: 42, s: 3, f: 32, r: 24, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 1, r: -1,
              }, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:ger_marder_iii]).to be == {
            t: "spg", c: "ger", n: "Marder III", y: 42, s: 3, f: 16, r: 16, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 4, s: 1, r: -1,
              }, k: 1, j: 3, f: 18,
            }, i: "spg",
          }
          expect(defs[:ger_marder_iii_h_m]).to be == {
            t: "spg", c: "ger", n: "Marder III-H/M", y: 43, s: 3, f: 32, r: 24, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 1, r: -1,
              }, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:ger_nashorn]).to be == {
            t: "spg", c: "ger", n: "Nashorn", y: 42, s: 5, f: 64, r: 32, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 1, r: -1,
              }, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:ger_panzerjager_i]).to be == {
            t: "spg", c: "ger", n: "Panzerjäger I", y: 40, s: 3, f: 12, r: 16, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 1, r: -1,
              }, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:ger_pzkpfw_ii_flamm]).to be == {
            t: "spg", c: "ger", n: "PzKpfw II Flamm", y: 40, s: 3, f: 24, r: 1, v: 6, o: {
              i: 1, ha: {
                f: 3, s: 1, r: 1,
              }, e: 1, b: 4, k: 1, f: 18,
            }, i: "spft",
          }
          expect(defs[:ger_sdkfz_166]).to be == {
            t: "spg", c: "ger", n: "SdKfz 166", y: 42, s: 5, f: 64, r: 20, v: 4, o: {
              t: 1, g: 1, ha: {
                f: 7, s: 1, r: 1,
              }, k: 1, j: 3, f: 18,
            }, i: "spg",
          }
          expect(defs[:ger_stug_iii_a]).to be == {
            t: "spg", c: "ger", n: "StuG III-A", y: 40, s: 4, f: 16, r: 16, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 4, s: 1, r: 1,
              }, bd: 3, k: 1, j: 3, f: 18,
            }, i: "spg",
          }
          expect(defs[:ger_stug_iii_b_e]).to be == {
            t: "spg", c: "ger", n: "StuG III-B/E", y: 40, s: 4, f: 16, r: 16, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 4, s: 1, r: 1,
              }, k: 1, j: 3, f: 18,
            }, i: "spg",
          }
          expect(defs[:ger_stug_iii_f_g]).to be == {
            t: "spg", c: "ger", n: "StuG III-F/G", y: 42, s: 4, f: 32, r: 24, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 6, s: 1, r: 1,
              }, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:ger_stug_iv]).to be == {
            t: "spg", c: "ger", n: "StuG IV", y: 43, s: 4, f: 32, r: 24, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 6, s: 1, r: 1,
              }, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:ger_stuh_42]).to be == {
            t: "spg", c: "ger", n: "StuH 42", y: 42, s: 4, f: 32, r: 24, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 6, s: 1, r: 1,
              }, k: 1, j: 3, f: 18,
            }, i: "spg",
          }
        end
      end

      context "italy" do
        it "has static definitions" do
          expect(defs[:ita_l3_33]).to be == {
            t: "spg", c: "ita", n: "L3/33", y: 33, s: 3, f: 3, r: 6, v: 6, o: {
              r: 1, ha: {
                f: 1, s: 1, r: -1,
              }, k: 1, j: 3, f: 18,
            }, i: "spgmg",
          }
          expect(defs[:ita_l3_35]).to be == {
            t: "spg", c: "ita", n: "L3/35", y: 35, s: 3, f: 10, r: 8, v: 6, o: {
              r: 1, ha: {
                f: 1, s: 1, r: -1,
              }, k: 1, j: 3, f: 18,
            }, i: "spgmg",
          }
          expect(defs[:ita_l3_38]).to be == {
            t: "spg", c: "ita", n: "L3/38", y: 38, s: 3, f: 10, r: 10, v: 6, o: {
              r: 1, ha: {
                f: 1, s: 1, r: -1,
              }, k: 1, j: 3, f: 18,
            }, i: "spgmg",
          }
          expect(defs[:ita_sv_da_47_32]).to be == {
            t: "spg", c: "ita", n: "Sv da 47/32", y: 42, s: 3, f: 12, r: 14, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 1, r: -1,
              }, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:ita_sv_da_75_18]).to be == {
            t: "spg", c: "ita", n: "Sv da 75/18", y: 42, s: 3, f: 16, r: 14, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 3, s: 2, r: 2,
              }, k: 1, j: 3, f: 18,
            }, i: "spg",
          }
        end
      end

      context "japan" do
        it "has static definitions" do
          expect(defs[:jap_type_1_ho_ni_i]).to be == {
            t: "spg", c: "jap", n: "Type 1 Ho-Ni I", y: 42, s: 4, f: 16, r: 16, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 2, s: 2, r: -1,
              }, k: 1, j: 3, f: 18,
            }, i: "spg",
          }
          expect(defs[:jap_type_1_ho_ni_ii]).to be == {
            t: "spg", c: "jap", n: "Type 1 Ho-Ni II", y: 43, s: 4, f: 32, r: 20, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 2, s: 2, r: -1,
              }, k: 1, j: 3, f: 18,
            }, i: "spg",
          }
          expect(defs[:jap_type_1_ho_ni_iii]).to be == {
            t: "spg", c: "jap", n: "Type 1 Ho-Ni III", y: 44, s: 4, f: 32, r: 20, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 2, s: 2, r: 1,
              }, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:jap_type_97_chi_ha_ft]).to be == {
            t: "spg", c: "jap", n: "Type 97 Chi-Ha FT", y: 41, s: 3, f: 24, r: 1, v: 5, o: {
              i: 1, ha: {
                f: 2, s: 1, r: 1,
              }, e: 1, sn: 3, b: 4, k: 1, f: 18,
            }, i: "spft",
          }
        end
      end

      context "united kingdom" do
        it "has static definitions" do
          expect(defs[:uk_churchill_crocodile]).to be == {
            t: "spg", c: "uk", n: "Churchill Crocodile", y: 44, s: 6, f: 24, r: 16, v: 4, o: {
              j: 4, t: 1, p: 1, ha: {
                f: 9, s: 6, r: 4,
              }, ta: {
                f: 9, s: 6, r: 6,
              }, sn: 3, sg: {
                f: 24, r: 1, t: "ft",
              }, u: 1, k: 1,
            }, i: "spft",
          }
          expect(defs[:uk_cruiser_mk_i_cs]).to be == {
            t: "spg", c: "uk", n: "Cruiser Mk I CS", y: 38, s: 3, f: 24, r: 16, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 1, s: 1, r: 1,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, bd: 3, s: 1, u: 1, k: 1, j: 3, f: 18,
            }, i: "spg",
          }
          expect(defs[:uk_cruiser_mk_ii_cs]).to be == {
            t: "spg", c: "uk", n: "Cruiser Mk II CS", y: 40, s: 3, f: 24, r: 16, v: 4, o: {
              t: 1, g: 1, ha: {
                f: 2, s: 2, r: 2,
              }, ta: {
                f: 2, s: 2, r: 2,
              }, s: 1, u: 1, k: 1, j: 3, f: 18,
            }, i: "spg",
          }
          expect(defs[:uk_crusader_i_cs]).to be == {
            t: "spg", c: "uk", n: "Crusader I CS", y: 41, s: 4, f: 16, r: 12, v: 6, o: {
              t: 1, g: 1, ha: {
                f: 4, s: 4, r: 4,
              }, ta: {
                f: 4, s: 4, r: 4,
              }, bd: 3, s: 1, u: 1, k: 1, j: 3, f: 18,
            }, i: "spg",
          }
          expect(defs[:uk_crusader_ii_cs]).to be == {
            t: "spg", c: "uk", n: "Crusader II CS", y: 42, s: 4, f: 16, r: 12, v: 6, o: {
              t: 1, g: 1, ha: {
                f: 4, s: 4, r: 4,
              }, ta: {
                f: 4, s: 4, r: 4,
              }, bd: 3, s: 1, u: 1, k: 1, j: 3, f: 18,
            }, i: "spg",
          }
          expect(defs[:uk_m10_achilles]).to be == {
            t: "spg", c: "uk", n: "M10 Achilles", y: 42, s: 5, f: 32, r: 20, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 2, r: 2,
              }, ta: {
                f: 4, s: 2, r: 2, t: -1,
              }, u: 1, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:uk_m10_achilles_c]).to be == {
            t: "spg", c: "uk", n: "M10 Achilles C", y: 43, s: 5, f: 40, r: 24, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 2, r: 2,
              }, ta: {
                f: 4, s: 2, r: 2, t: -1,
              }, u: 1, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:uk_matilda_frog]).to be == {
            t: "spg", c: "uk", n: "Matilda Frog", y: 44, s: 5, f: 24, r: 1, v: 4, o: {
              i: 1, ha: {
                f: 6, s: 5, r: 4,
              }, ta: {
                f: 5, s: 5, r: 5,
              }, e: 1, b: 4, u: 1, k: 1, f: 18,
            }, i: "spft",
          }
          expect(defs[:uk_matilda_ii_cs]).to be == {
            t: "spg", c: "uk", n: "Matilda II CS", y: 39, s: 5, f: 16, r: 12, v: 4, o: {
              t: 1, g: 1, ha: {
                f: 6, s: 5, r: 4,
              }, ta: {
                f: 5, s: 5, r: 5,
              }, bd: 3, s: 1, u: 1, k: 1, j: 3, f: 18,
            }, i: "spg",
          }
          expect(defs[:uk_valentine_iii_cs]).to be == {
            t: "spg", c: "uk", n: "Valentine III CS", y: 40, s: 4, f: 16, r: 12, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 5, s: 4, r: 4,
              }, ta: {
                f: 5, s: 4, r: 4,
              }, s: 1, u: 1, k: 1, j: 3, f: 18,
            }, i: "spg",
          }
        end
      end

      context "united states" do
        it "has static definitions" do
          expect(defs[:usa_m10]).to be == {
            t: "spg", c: "usa", n: "M10", y: 42, s: 5, f: 32, r: 20, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 2, r: 2,
              }, ta: {
                f: 4, s: 2, r: 2, t: -1,
              }, u: 1, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:usa_m10a1]).to be == {
            t: "spg", c: "usa", n: "M10A1", y: 43, s: 5, f: 32, r: 20, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 2, r: 2,
              }, ta: {
                f: 4, s: 2, r: 2, t: -1,
              }, u: 1, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:usa_m18_hellcat]).to be == {
            t: "spg", c: "usa", n: "M18 Hellcat", y: 43, s: 4, f: 40, r: 24, v: 7, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 1, r: 1,
              }, ta: {
                f: 2, s: 1, r: 1, t: -1,
              }, u: 1, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:usa_m36_jackson]).to be == {
            t: "spg", c: "usa", n: "M36 Jackson", y: 44, s: 5, f: 48, r: 32, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 4, s: 2, r: 2,
              }, ta: {
                f: 5, s: 3, r: 3, t: -1,
              }, u: 1, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:usa_m3a1_stuart_ft]).to be == {
            t: "spg", c: "usa", n: "M3A1 Stuart FT", y: 44, s: 3, f: 24, r: 1, v: 5, o: {
              i: 1, ha: {
                f: 4, s: 3, r: 3,
              }, e: 1, b: 4, k: 1, f: 18,
            }, i: "spft",
          }
          expect(defs[:usa_m4a3r5_sherman]).to be == {
            t: "spg", c: "usa", n: "M4A3R5 Sherman", y: 44, s: 5, f: 24, r: 1, v: 5, o: {
              i: 1, ha: {
                f: 5, s: 3, r: 3,
              }, ta: {
                f: 6, s: 5, r: 5,
              }, e: 1, sn: 2, b: 4, u: 1, k: 1, f: 18,
            }, i: "spft",
          }
          expect(defs[:usa_m8_scott]).to be == {
            t: "spg", c: "usa", n: "M8 Scott", y: 42, s: 4, f: 24, r: 20, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 3, s: 2, r: 2,
              }, ta: {
                f: 3, s: 3, r: 3,
              }, u: 1, k: 1, j: 3, f: 18,
            }, i: "spg",
          }
        end
      end

      context "soviet union" do
        it "has static definitions" do
          expect(defs[:ussr_isu_122]).to be == {
            t: "spg", c: "ussr", n: "ISU-122", y: 44, s: 6, f: 96, r: 32, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 8, s: 6, r: 6,
              }, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:ussr_isu_152]).to be == {
            t: "spg", c: "ussr", n: "ISU-152", y: 43, s: 7, f: 64, r: 32, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 8, s: 6, r: 6,
              }, k: 1, j: 3, f: 18,
            }, i: "spg",
          }
          expect(defs[:ussr_su_100]).to be == {
            t: "spg", c: "ussr", n: "SU-100", y: 44, s: 5, f: 80, r: 30, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 5, s: 3, r: 3,
              }, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
          expect(defs[:ussr_su_122]).to be == {
            t: "spg", c: "ussr", n: "SU-122", y: 42, s: 5, f: 40, r: 30, v: 6, o: {
              t: 1, g: 1, ha: {
                f: 3, s: 3, r: 3,
              }, k: 1, j: 3, f: 18,
            }, i: "spg",
          }
          expect(defs[:ussr_su_152]).to be == {
            t: "spg", c: "ussr", n: "SU-152", y: 43, s: 6, f: 64, r: 32, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 5, s: 4, r: 3,
              }, k: 1, j: 3, f: 18,
            }, i: "spg",
          }
          expect(defs[:ussr_su_76]).to be == {
            t: "spg", c: "ussr", n: "SU-76", y: 42, s: 3, f: 16, r: 22, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 3, s: 1, r: 1,
              }, bd: 4, k: 1, j: 3, f: 18,
            }, i: "spg",
          }
          expect(defs[:ussr_su_76m]).to be == {
            t: "spg", c: "ussr", n: "SU-76M", y: 42, s: 3, f: 16, r: 22, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 3, s: 1, r: -1,
              }, k: 1, j: 3, f: 18,
            }, i: "spg",
          }
          expect(defs[:ussr_su_85]).to be == {
            t: "spg", c: "ussr", n: "SU-85", y: 43, s: 5, f: 48, r: 28, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 3, s: 3, r: 3,
              }, k: 1, j: 3, f: 18,
            }, i: "spat",
          }
        end
      end
    end

    context "armored cars" do
      context "allied minors" do
        it "has static definitions" do
          # NOP
        end
      end

      context "axis minors" do
        it "has static definitions" do
          # NOP
        end
      end

      context "china" do
        it "has static definitions" do
          expect(defs[:chi_m3a1_scout_car]).to be == {
            t: "ac", i: "ac", c: "chi", n: "M3A1 Scout Car", y: 39, s: 3, f: 10, r: 12, v: 5, o: {
              r: 1, ha: {
                f: 1, s: 1, r: 1, t: -1,
              }, tr: 1, j: 3, f: 18, uu: 1, w: 1,
            },
          }
        end
      end

      context "finland" do
        it "has static definitions" do
          # NOP
        end
      end

      context "france" do
        it "has static definitions" do
          expect(defs[:fra_m8_greyhound]).to be == {
            t: "ac", i: "ac", c: "fra", n: "M8 Greyhound", y: 43, s: 3, f: 7, r: 10, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 2, s: 2, r: 2, t: -1,
              }, bd: 3, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
          expect(defs[:fra_panhard_178]).to be == {
            t: "ac", i: "ac", c: "fra", n: "Panhard 178", y: 37, s: 3, f: 4, r: 12, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 2, s: 2, r: 2,
              }, ta: {
                f: 2, s: 2, r: 2,
              }, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
          expect(defs[:fra_schneider_p16]).to be == {
            t: "ac", i: "acav", c: "fra", n: "Schneider P16", y: 28, s: 3, f: 8, r: 12, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 1, r: 1,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, tr: 1, j: 3, f: 18, u: 1, k: 1,
            },
          }
          expect(defs[:fra_white_am_ac]).to be == {
            t: "ac", i: "ac", c: "fra", n: "White AM AC", y: 15, s: 3, f: 8, r: 12, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 0, s: 0, r: 0,
              }, ta: {
                f: 0, s: 0, r: 0,
              }, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
        end
      end

      context "german" do
        it "has static definitions" do
          expect(defs[:ger_sdkfz_221]).to be == {
            t: "ac", i: "ac", c: "ger", n: "SdKfz 221", y: 35, s: 3, f: 8, r: 8, v: 5, o: {
              r: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
          expect(defs[:ger_sdkfz_222]).to be == {
            t: "ac", i: "ac", c: "ger", n: "SdKfz 222", y: 37, s: 3, f: 3, r: 10, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
          expect(defs[:ger_sdkfz_234_1]).to be == {
            t: "ac", i: "ac", c: "ger", n: "SdKfz 234/1", y: 43, s: 3, f: 4, r: 10, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 2, s: 0, r: 0,
              }, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
          expect(defs[:ger_sdkfz_234_2]).to be == {
            t: "ac", i: "ac", c: "ger", n: "SdKfz 234/2", y: 43, s: 3, f: 24, r: 10, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 3, s: 0, r: 0,
              }, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
          expect(defs[:ger_sdkfz_234_3]).to be == {
            t: "ac", i: "ac", c: "ger", n: "SdKfz 234/3", y: 44, s: 3, f: 16, r: 16, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 3, s: 0, r: 0,
              }, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
          expect(defs[:ger_sdkfz_234_4]).to be == {
            t: "ac", i: "ac", c: "ger", n: "SdKfz 234/4", y: 44, s: 3, f: 32, r: 24, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 3, s: 0, r: 0,
              }, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
        end
      end

      context "italy" do
        it "has static definitions" do
          expect(defs[:ita_autoblinda_41]).to be == {
            t: "ac", i: "ac", c: "ita", n: "Autoblinda 41", y: 41, s: 3, f: 3, r: 12, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
        end
      end

      context "japan" do
        it "has static definitions" do
          expect(defs[:jap_chiyoda_ac]).to be == {
            t: "ac", i: "ac", c: "jap", n: "Chiyoda AC", y: 31, s: 3, f: 4, r: 8, v: 4, o: {
              r: 1, ha: {
                f: 0, s: 0, r: 0,
              }, ta: {
                f: 0, s: 0, r: 0,
              }, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
          expect(defs[:jap_sumida_type_91]).to be == {
            t: "ac", i: "ac", c: "jap", n: "Sumida Type 91", y: 33, s: 3, f: 4, r: 8, v: 3, o: {
              r: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 0, s: 0, r: 0,
              }, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
        end
      end

      context "united kingdom" do
        it "has static definitions" do
          expect(defs[:uk_aec_ac_i]).to be == {
            t: "ac", i: "ac", c: "uk", n: "AEC AC I", y: 41, s: 3, f: 10, r: 12, v: 3, o: {
              t: 1, p: 1, ha: {
                f: 2, s: 2, r: 2,
              }, ta: {
                f: 5, s: 4, r: 4,
              }, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
          expect(defs[:uk_aec_ac_ii]).to be == {
            t: "ac", i: "ac", c: "uk", n: "AEC AC II", y: 42, s: 3, f: 20, r: 16, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 2, s: 2, r: 2,
              }, ta: {
                f: 2, s: 2, r: 2,
              }, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
          expect(defs[:uk_aec_ac_ii_cs]).to be == {
            t: "ac", i: "ac", c: "uk", n: "AEC AC II CS", y: 42, s: 3, f: 16, r: 12, v: 4, o: {
              t: 1, g: 1, ha: {
                f: 2, s: 2, r: 2,
              }, ta: {
                f: 2, s: 2, r: 2,
              }, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
          expect(defs[:uk_daimler_ac]).to be == {
            t: "ac", i: "ac", c: "uk", n: "Daimler AC", y: 41, s: 3, f: 10, r: 12, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
          expect(defs[:uk_daimler_ac_cs]).to be == {
            t: "ac", i: "ac", c: "uk", n: "Daimler AC CS", y: 41, s: 3, f: 16, r: 12, v: 4, o: {
              t: 1, g: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
          expect(defs[:uk_humber_ac_i]).to be == {
            t: "ac", i: "ac", c: "uk", n: "Humber AC I", y: 40, s: 3, f: 12, r: 12, v: 4, o: {
              r: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
          expect(defs[:uk_humber_ac_iv]).to be == {
            t: "ac", i: "ac", c: "uk", n: "Humber AC IV", y: 42, s: 3, f: 24, r: 16, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
          expect(defs[:uk_humber_lrc]).to be == {
            t: "ac", i: "ac", c: "uk", n: "Humber LRC", y: 40, s: 3, f: 2, r: 8, v: 8, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 0, s: 0, r: 0,
              }, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
          expect(defs[:uk_m3a1_scout_car]).to be == {
            t: "ac", i: "ac", c: "uk", n: "M3A1 Scout Car", y: 39, s: 3, f: 10, r: 12, v: 5, o: {
              r: 1, ha: {
                f: 1, s: 1, r: 1, t: -1,
              }, tr: 1, j: 3, f: 18, uu: 1, w: 1,
            },
          }
          expect(defs[:uk_m8_greyhound]).to be == {
            t: "ac", i: "ac", c: "uk", n: "M8 Greyhound", y: 43, s: 3, f: 7, r: 10, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0, t: -1,
              }, ta: {
                f: 2, s: 2, r: 2, t: -1,
              }, bd: 3, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
          expect(defs[:uk_t17e1_staghound]).to be == {
            t: "ac", i: "ac", c: "uk", n: "T17E1 Staghound", y: 44, s: 3, f: 24, r: 16, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 3, s: 1, r: 1,
              }, sn: 1, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
        end
      end

      context "united states" do
        it "has static definitions" do
          expect(defs[:usa_m20_greyhound]).to be == {
            t: "ac", i: "ac", c: "usa", n: "M20 Greyhound", y: 43, s: 3, f: 10, r: 12, v: 4, o: {
              r: 1, ha: {
                f: 1, s: 0, r: 0, t: -1,
              }, tr: 1, j: 3, f: 18, uu: 1, w: 1,
            },
          }
          expect(defs[:usa_m3a1_scout_car]).to be == {
            t: "ac", i: "ac", c: "usa", n: "M3A1 Scout Car", y: 39, s: 3, f: 10, r: 12, v: 5, o: {
              r: 1, ha: {
                f: 1, s: 1, r: 1, t: -1,
              }, tr: 1, j: 3, f: 18, uu: 1, w: 1,
            },
          }
          expect(defs[:usa_m8_greyhound]).to be == {
            t: "ac", i: "ac", c: "usa", n: "M8 Greyhound", y: 43, s: 3, f: 7, r: 10, v: 4, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 2, s: 2, r: 2, t: -1,
              }, bd: 3, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
        end
      end

      context "soviet union" do
        it "has static definitions" do
          expect(defs[:ussr_ba_10]).to be == {
            t: "ac", i: "ac", c: "ussr", n: "BA-10", y: 38, s: 3, f: 12, r: 16, v: 3, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 1, s: 1, r: 1,
              }, bd: 3, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
          expect(defs[:ussr_ba_20]).to be == {
            t: "ac", i: "ac", c: "ussr", n: "BA-20", y: 36, s: 3, f: 4, r: 6, v: 5, o: {
              r: 1, ha: {
                f: 0, s: 0, r: 0,
              }, ta: {
                f: 0, s: 0, r: 0,
              }, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
          expect(defs[:ussr_ba_64]).to be == {
            t: "ac", i: "ac", c: "ussr", n: "BA-64", y: 42, s: 3, f: 4, r: 6, v: 5, o: {
              r: 1, ha: {
                f: 1, s: 0, r: 0,
              }, ta: {
                f: 0, s: 0, r: 0,
              }, tr: 1, j: 3, f: 18, u: 1, w: 1,
            },
          }
          expect(defs[:ussr_m3a1_scout_car]).to be == {
            t: "ac", i: "ac", c: "ussr", n: "M3A1 Scout Car", y: 39, s: 3, f: 10, r: 15, v: 5, o: {
              r: 1, ha: {
                f: 1, s: 1, r: 0, t: -1,
              }, tr: 1, j: 3, f: 18, uu: 1, w: 1,
            },
          }
        end
      end
    end

    context "half-tracks" do
      context "allied minors" do
        it "has static definitions" do
          # NOP
        end
      end

      context "axis minors" do
        it "has static definitions" do
          # NOP
        end
      end

      context "china" do
        it "has static definitions" do
          expect(defs[:chi_m5_half_track]).to be == {
            t: "ht", i: "ht", c: "chi", n: "M5 Half-track", y: 42, s: 3, f: 10, r: 12, v: 6, o: {
              r: 1, ha: {
                f: 1, s: 1, r: 0, t: -1,
              }, tr: 3, trg: 1, k: 1, j: 3, f: 18,
            },
          }
        end
      end

      context "finland" do
        it "has static definitions" do
          # NOP
        end
      end

      context "france" do
        it "has static definitions" do
          expect(defs[:fra_lorraine_37l]).to be == {
            t: "ht", i: "ht", c: "fra", n: "Lorraine 37L", y: 39, s: 3, f: 0, r: 0, v: 5, o: {
              r: 1, ha: {
                f: 0, s: 0, r: 0, t: -1,
              }, tr: 3, trg: 1, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:fra_m9_half_track]).to be == {
            t: "ht", i: "ht", c: "fra", n: "M9 Half-track", y: 41, s: 3, f: 10, r: 12, v: 6, o: {
              r: 1, ha: {
                f: 1, s: 1, r: 0, t: -1,
              }, tr: 3, trg: 1, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:fra_renault_ue]).to be == {
            t: "ht", i: "ht", c: "fra", n: "Renault UE", y: 32, s: 3, f: 0, r: 0, v: 4, o: {
              r: 1, ha: {
                f: 0, s: 0, r: 0, t: -1,
              }, tr: 2, trg: 1, k: 1, j: 3, f: 18,
            },
          }
        end
      end

      context "german" do
        it "has static definitions" do
          expect(defs[:ger_sdkfz_250_1]).to be == {
            t: "ht", i: "ht", c: "ger", n: "SdKfz 250/1", y: 41, s: 3, f: 8, r: 8, v: 6, o: {
              r: 1, ha: {
                f: 1, s: 0, r: 0, t: -1,
              }, tr: 2, trg: 1, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:ger_sdkfz_250_10]).to be == {
            t: "ht", i: "htat", c: "ger", n: "SdKfz 250/10", y: 41, s: 3, f: 8, r: 16, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0, t: -1,
              }, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:ger_sdkfz_250_11]).to be == {
            t: "ht", i: "htat", c: "ger", n: "SdKfz 250/11", y: 41, s: 3, f: 8, r: 10, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0, t: -1,
              }, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:ger_sdkfz_250_7]).to be == {
            t: "ht", i: "htmtr", c: "ger", n: "SdKfz 250/7", y: 41, s: 3, f: 20, r: 16, v: 6, o: {
              t: 1, m: 3, e: 1, ha: {
                f: 1, s: 0, r: 0, t: -1,
              }, k: 1, b: 3,
            },
          }
          expect(defs[:ger_sdkfz_250_8]).to be == {
            t: "ht", i: "htgun", c: "ger", n: "SdKfz 250/8", y: 41, s: 3, f: 16, r: 16, v: 6, o: {
              t: 1, g: 1, ha: {
                f: 1, s: 0, r: 0, t: -1,
              }, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:ger_sdkfz_250_9]).to be == {
            t: "ht", i: "htat", c: "ger", n: "SdKfz 250/9", y: 41, s: 3, f: 4, r: 10, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0, t: -1,
              }, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:ger_sdkfz_251_1]).to be == {
            t: "ht", i: "ht", c: "ger", n: "SdKfz 251/1", y: 39, s: 3, f: 8, r: 8, v: 5, o: {
              r: 1, ha: {
                f: 1, s: 0, r: 0, t: -1,
              }, tr: 3, trg: 1, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:ger_sdkfz_251_10]).to be == {
            t: "ht", i: "htat", c: "ger", n: "SdKfz 251/10", y: 39, s: 3, f: 8, r: 16, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0, t: -1,
              }, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:ger_sdkfz_251_16]).to be == {
            t: "ht", i: "htft", c: "ger", n: "SdKfz 251/16", y: 39, s: 3, f: 24, r: 1, v: 5, o: {
              i: 1, ha: {
                f: 1, s: 0, r: 0, t: -1,
              }, k: 1, b: 3,
            },
          }
          expect(defs[:ger_sdkfz_251_9]).to be == {
            t: "ht", i: "htgun", c: "ger", n: "SdKfz 251/9", y: 39, s: 3, f: 16, r: 16, v: 5, o: {
              t: 1, g: 1, ha: {
                f: 1, s: 0, r: 0, t: -1,
              }, k: 1, j: 3, f: 18,
            },
          }
        end
      end

      context "italy" do
        it "has static definitions" do
          # NOP
        end
      end

      context "japan" do
        it "has static definitions" do
          expect(defs[:jap_type_100_te_re]).to be == {
            t: "ht", i: "ht", c: "jap", n: "Type 100 Te-Re", y: 40, s: 3, f: 0, r: 0, v: 5, o: {
              r: 1, ha: {
                f: 0, s: 0, r: 0, t: -1,
              }, tr: 1, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:jap_type_1_ho_ha]).to be == {
            t: "ht", i: "ht", c: "jap", n: "Type 1 Ho-Ha", y: 44, s: 3, f: 4, r: 8, v: 6, o: {
              r: 1, ha: {
                f: 0, s: 0, r: 0, t: -1,
              }, tr: 3, trg: 1, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:jap_type_98_so_da]).to be == {
            t: "ht", i: "ht", c: "jap", n: "Type 98 So-Da", y: 41, s: 3, f: 0, r: 0, v: 5, o: {
              r: 1, ha: {
                f: 1, s: 1, r: 1, t: -1,
              }, tr: 3, trg: 1, k: 1, j: 3, f: 18,
            },
          }
        end
      end

      context "united kingdom" do
        it "has static definitions" do
          expect(defs[:uk_loyd_carrier]).to be == {
            t: "ht", i: "ht", c: "uk", n: "Loyd Carrier", y: 39, s: 3, f: 0, r: 0, v: 6, o: {
              r: 1, ha: {
                f: 0, s: 0, r: 0, t: -1,
              }, tr: 2, trg: 1, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:uk_m5_half_track]).to be == {
            t: "ht", i: "ht", c: "uk", n: "M5 Half-track", y: 42, s: 3, f: 10, r: 12, v: 6, o: {
              r: 1, ha: {
                f: 1, s: 1, r: 0, t: -1,
              }, tr: 3, trg: 1, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:uk_t48_gmc]).to be == {
            t: "ht", i: "htat", c: "uk", n: "T48 GMC", y: 42, s: 3, f: 20, r: 16, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 1, r: 0, t: -1,
              }, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:uk_u_carrier_2pdr]).to be == {
            t: "ht", i: "htat", c: "uk", n: "U Carrier 2Pdr", y: 41, s: 3, f: 10, r: 12, v: 7, o: {
              t: 1, p: 1, ha: {
                f: 0, s: 0, r: 0, t: -1,
              }, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:uk_u_carrier_6pdr]).to be == {
            t: "ht", i: "htat", c: "uk", n: "U Carrier 6Pdr", y: 41, s: 3, f: 20, r: 16, v: 7, o: {
              t: 1, p: 1, ha: {
                f: 0, s: 0, r: 0, t: -1,
              }, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:uk_u_carrier_wasp]).to be == {
            t: "ht", i: "htft", c: "uk", n: "U Carrier Wasp", y: 41, s: 3, f: 24, r: 1, v: 7, o: {
              i: 1, ha: {
                f: 0, s: 0, r: 0, t: -1,
              }, k: 1, b: 3,
            },
          }
          expect(defs[:uk_universal_carrier]).to be == {
            t: "ht", i: "ht", c: "uk", n: "Universal Carrier", y: 40, s: 3, f: 3, r: 6, v: 7, o: {
              r: 1, ha: {
                f: 0, s: 0, r: 0, t: -1,
              }, sn: 1, tr: 2, trg: 1, k: 1, j: 3, f: 18,
            },
          }
        end
      end

      context "united states" do
        it "has static definitions" do
          expect(defs[:usa_lvt_1]).to be == {
            t: "ht", i: "ht-amp", c: "usa", n: "LVT-1", y: 42, s: 4, f: 10, r: 12, v: 5, o: {
              r: 1, amp: 1, tr: 3, bd: 3, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:usa_lvt_1_armor]).to be == {
            t: "ht", i: "ht-amp", c: "usa", n: "LVT-1 Armor", y: 43, s: 4, f: 10, r: 12, v: 5, o: {
              r: 1, ha: {
                f: 1, s: 0, r: 0, t: -1,
              }, amp: 1, tr: 3, bd: 3, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:usa_lvt_2]).to be == {
            t: "ht", i: "htat-amp", c: "usa", n: "LVT-2", y: 42, s: 4, f: 7, r: 10, v: 5, o: {
              t: 1, p: 1, amp: 1, tr: 3, bd: 3, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:usa_lvt_2_armor]).to be == {
            t: "ht", i: "htat-amp", c: "usa", n: "LVT-2 Armor", y: 43, s: 4, f: 7, r: 10, v: 5, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 0, r: 0, t: -1,
              }, amp: 1, tr: 3, bd: 3, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:usa_lvta_1]).to be == {
            t: "ht", i: "htgun-amp", c: "usa", n: "LVT(A)-1", y: 44, s: 4, f: 7, r: 10, v: 5, o: {
              u: 1, t: 1, g: 1, ha: {
                f: 3, s: 0, r: 0,
              }, ta: {
                f: 4, s: 3, r: 3,
              }, amp: 1, tr: 3, bd: 3, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:usa_lvta_4]).to be == {
            t: "ht", i: "htgun-amp", c: "usa", n: "LVT(A)-4", y: 44, s: 4, f: 24, r: 20, v: 5, o: {
              u: 1, t: 1, g: 1, ha: {
                f: 3, s: 0, r: 0,
              }, ta: {
                f: 3, s: 2, r: 2, t: -1,
              }, amp: 1, tr: 3, bd: 3, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:usa_m2_half_track]).to be == {
            t: "ht", i: "ht", c: "usa", n: "M2 Half-track", y: 41, s: 3, f: 10, r: 12, v: 6, o: {
              r: 1, ha: {
                f: 1, s: 1, r: 0, t: -1,
              }, tr: 3, trg: 1, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:usa_m3_gmc]).to be == {
            t: "ht", i: "htgun", c: "usa", n: "M3 GMC", y: 42, s: 3, f: 24, r: 20, v: 6, o: {
              t: 1, g: 1, ha: {
                f: 1, s: 1, r: 0, t: -1,
              }, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:usa_m3_half_track]).to be == {
            t: "ht", i: "ht", c: "usa", n: "M3 Half-track", y: 41, s: 3, f: 6, r: 8, v: 6, o: {
              r: 1, ha: {
                f: 1, s: 1, r: 0, t: -1,
              }, tr: 3, trg: 1, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:usa_m3a1_half_track]).to be == {
            t: "ht", i: "ht", c: "usa", n: "M3A1 Half-track", y: 42, s: 3, f: 10, r: 12, v: 6, o: {
              r: 1, ha: {
                f: 1, s: 1, r: 0, t: -1,
              }, tr: 3, trg: 1, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:usa_t19_gmc]).to be == {
            t: "ht", i: "htgun", c: "usa", n: "T19 GMC", y: 42, s: 3, f: 40, r: 24, v: 6, o: {
              t: 1, g: 1, ha: {
                f: 1, s: 1, r: 0, t: -1,
              }, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:usa_t19_m21_mmc]).to be == {
            t: "ht", i: "htmtr", c: "usa", n: "T19/M21 MMC", y: 42, s: 3, f: 20, r: 20, v: 6, o: {
              t: 1, m: 3, e: 1, ha: {
                f: 1, s: 1, r: 0, t: -1,
              }, k: 1, b: 3,
            },
          }
        end
      end

      context "soviet union" do
        it "has static definitions" do
          expect(defs[:ussr_m5_half_track]).to be == {
            t: "ht", i: "ht", c: "ussr", n: "M5 Half-track", y: 42, s: 3, f: 10, r: 12, v: 6, o: {
              r: 1, ha: {
                f: 1, s: 1, r: 0, t: -1,
              }, tr: 3, trg: 1, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:ussr_m9_half_track]).to be == {
            t: "ht", i: "ht", c: "ussr", n: "M9 Half-track", y: 41, s: 3, f: 10, r: 12, v: 6, o: {
              r: 1, ha: {
                f: 1, s: 1, r: 0, t: -1,
              }, tr: 3, trg: 1, k: 1, j: 3, f: 18,
            },
          }
          expect(defs[:ussr_t48_gmc]).to be == {
            t: "ht", i: "htat", c: "ussr", n: "T48 GMC", y: 42, s: 3, f: 20, r: 16, v: 6, o: {
              t: 1, p: 1, ha: {
                f: 1, s: 1, r: 0, t: -1,
              }, k: 1, j: 3, f: 18,
            },
          }
        end
      end
    end

    context "truck" do
      context "allied minors" do
        it "has static definitions" do
          expect(defs[:alm_polski_fiat_621]).to be == {
            t: "truck", c: "alm", n: "Polski Fiat 621", i: "truck", y: 35, s: 3, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
        end
      end

      context "axis minors" do
        it "has static definitions" do
          # NOP
        end
      end

      context "china" do
        it "has static definitions" do
          # NOP
        end
      end

      context "finland" do
        it "has static definitions" do
          # NOP
        end
      end

      context "france" do
        it "has static definitions" do
          expect(defs[:fra_citroen_u23]).to be == {
            t: "truck", c: "fra", n: "Citroen U23", i: "truck", y: 35, s: 4, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:fra_dodge_wc]).to be == {
            t: "truck", c: "fra", n: "Dodge WC", i: "truck", y: 41, s: 3, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:fra_jeep]).to be == {
            t: "truck", c: "fra", n: "Jeep", i: "car", y: 41, s: 2, f: 0, r: 0, v: 5, o: {
              tr: 1, trg: 1, w: 1,
            },
          }
          expect(defs[:fra_laffly_s20]).to be == {
            t: "truck", c: "fra", n: "Laffly S20", i: "truck", y: 37, s: 3, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
        end
      end

      context "german" do
        it "has static definitions" do
          expect(defs[:ger_bmw_325]).to be == {
            t: "truck", c: "ger", n: "BMW 325", i: "car", y: 36, s: 2, f: 0, r: 0, v: 5, o: {
              tr: 2, trg: 1, w: 1,
            },
          }
          expect(defs[:ger_kettenkrad]).to be == {
            t: "truck", c: "ger", n: "Kettenkrad", i: "truck", y: 41, s: 2, f: 0, r: 0, v: 5, o: {
              tr: 1, trg: 1, k: 1,
            },
          }
          expect(defs[:ger_l3000]).to be == {
            t: "truck", c: "ger", n: "L3000", i: "truck", y: 38, s: 4, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:ger_le__gl__lkw]).to be == {
            t: "truck", c: "ger", n: "le. gl. Lkw", i: "truck", y: 37, s: 4, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:ger_m__e__pkw]).to be == {
            t: "truck", c: "ger", n: "m. E. Pkw", i: "car", y: 37, s: 2, f: 0, r: 0, v: 5, o: {
              tr: 2, trg: 1, w: 1,
            },
          }
          expect(defs[:ger_maultier]).to be == {
            t: "truck", c: "ger", n: "Maultier", i: "truck", y: 41, s: 3, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, k: 1,
            },
          }
          expect(defs[:ger_opel_blitz]).to be == {
            t: "truck", c: "ger", n: "Opel Blitz", i: "truck", y: 30, s: 3, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:ger_s__e__pkw]).to be == {
            t: "truck", c: "ger", n: "s. E. Pkw", i: "truck", y: 38, s: 3, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:ger_sdkfz_10]).to be == {
            t: "truck", c: "ger", n: "SdKfz 10", i: "truck", y: 38, s: 4, f: 0, r: 0, v: 5, o: {
              tr: 2, trg: 1, k: 1,
            },
          }
          expect(defs[:ger_sdkfz_11]).to be == {
            t: "truck", c: "ger", n: "SdKfz 11", i: "truck", y: 38, s: 4, f: 0, r: 0, v: 5, o: {
              tr: 2, trg: 1, k: 1,
            },
          }
          expect(defs[:ger_sdkfz_6]).to be == {
            t: "truck", c: "ger", n: "SdKfz 6", i: "truck", y: 39, s: 4, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, k: 1,
            },
          }
          expect(defs[:ger_sdkfz_7]).to be == {
            t: "truck", c: "ger", n: "SdKfz 7", i: "truck", y: 38, s: 3, f: 0, r: 0, v: 5, o: {
              tr: 2, trg: 1, k: 1,
            },
          }
          expect(defs[:ger_sdkfz_8]).to be == {
            t: "truck", c: "ger", n: "SdKfz 8", i: "truck", y: 37, s: 5, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, k: 1,
            },
          }
          expect(defs[:ger_sdkfz_9]).to be == {
            t: "truck", c: "ger", n: "SdKfz 9", i: "truck", y: 39, s: 5, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, k: 1,
            },
          }
          expect(defs[:ger_vw_kubelwagen]).to be == {
            t: "truck", c: "ger", n: "VW Kübelwagen", i: "car", y: 40, s: 2, f: 0, r: 0, v: 5, o: {
              sn: 1, tr: 1, w: 1,
            },
          }
        end
      end

      context "italy" do
        it "has static definitions" do
          expect(defs[:ita_alfa_romeo_430]).to be == {
            t: "truck", c: "ita", n: "Alfa Romeo 430", i: "truck", y: 42, s: 4, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:ita_alfa_romeo_500]).to be == {
            t: "truck", c: "ita", n: "Alfa Romeo 500", i: "truck", y: 37, s: 4, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:ita_alfa_romeo_800]).to be == {
            t: "truck", c: "ita", n: "Alfa Romeo 800", i: "truck", y: 40, s: 5, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
        end
      end

      context "japan" do
        it "has static definitions" do
          # NOP
        end
      end

      context "united kingdom" do
        it "has static definitions" do
          expect(defs[:uk_aec_mk_i_deacon]).to be == {
            t: "truck", c: "uk", n: "AEC Mk I Deacon", i: "truck", y: 42, s: 4, f: 20, r: 16, v: 5, o: {
              t: 1, p: 1, j: 3, f: 16, sn: 1, w: 1,
            },
          }
          expect(defs[:uk_bedford_mw]).to be == {
            t: "truck", c: "uk", n: "Bedford MW", i: "truck", y: 39, s: 3, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:uk_bedford_oy]).to be == {
            t: "truck", c: "uk", n: "Bedford OY", i: "truck", y: 39, s: 4, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:uk_bedford_ql]).to be == {
            t: "truck", c: "uk", n: "Bedford QL", i: "truck", y: 41, s: 4, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:uk_chevy_c30]).to be == {
            t: "truck", c: "uk", n: "Chevy C30", i: "truck", y: 39, s: 4, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:uk_chevy_c30_at]).to be == {
            t: "truck", c: "uk", n: "Chevy C30 AT", i: "truck", y: 39, s: 4, f: 7, r: 10, v: 5, o: {
              bw: 1, t: 1, p: 1, j: 3, f: 16, tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:uk_chevy_c30_mg]).to be == {
            t: "truck", c: "uk", n: "Chevy C30 MG", i: "truck", y: 39, s: 4, f: 7, r: 10, v: 5, o: {
              uu: 1, r: 1, j: 3, f: 16, tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:uk_dodge_d60]).to be == {
            t: "truck", c: "uk", n: "Dodge D60", i: "truck", y: 39, s: 4, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:uk_dodge_wc]).to be == {
            t: "truck", c: "uk", n: "Dodge WC", i: "truck", y: 41, s: 3, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:uk_ford_f15]).to be == {
            t: "truck", c: "uk", n: "Ford F15", i: "truck", y: 39, s: 3, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:uk_gmc_dukw]).to be == {
            t: "truck", c: "uk", n: "GMC DUKW", i: "truck-amp", y: 42, s: 4, f: 0, r: 0, v: 5, o: {
              amp: 1, tr: 3, w: 1,
            },
          }
          expect(defs[:uk_jeep]).to be == {
            t: "truck", c: "uk", n: "Jeep", i: "car", y: 41, s: 2, f: 0, r: 0, v: 5, o: {
              tr: 1, trg: 1, w: 1,
            },
          }
          expect(defs[:uk_jeep_mg]).to be == {
            t: "truck", c: "uk", n: "Jeep MG", i: "car", y: 41, s: 2, f: 7, r: 10, v: 5, o: {
              r: 1, j: 3, f: 16, trg: 1, w: 1,
            },
          }
        end
      end

      context "united states" do
        it "has static definitions" do
          expect(defs[:usa_dodge_vc]).to be == {
            t: "truck", c: "usa", n: "Dodge VC", i: "truck", y: 40, s: 3, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:usa_dodge_wc]).to be == {
            t: "truck", c: "usa", n: "Dodge WC", i: "truck", y: 41, s: 3, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:usa_gmc_cckw]).to be == {
            t: "truck", c: "usa", n: "GMC CCKW", i: "truck", y: 41, s: 4, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:usa_gmc_dukw]).to be == {
            t: "truck", c: "usa", n: "GMC DUKW", i: "truck-amp", y: 42, s: 4, f: 0, r: 0, v: 5, o: {
              amp: 1, tr: 3, w: 1,
            },
          }
          expect(defs[:usa_jeep]).to be == {
            t: "truck", c: "usa", n: "Jeep", i: "car", y: 41, s: 2, f: 0, r: 0, v: 5, o: {
              tr: 1, trg: 1, w: 1,
            },
          }
          expect(defs[:usa_jeep__50_mg]).to be == {
            t: "truck", c: "usa", n: "Jeep .50 MG", i: "car", y: 41, s: 2, f: 10, r: 15, v: 5, o: {
              r: 1, j: 3, f: 16, trg: 1, w: 1,
            },
          }
          expect(defs[:usa_m6_gmc]).to be == {
            t: "truck", c: "usa", n: "M6 GMC", i: "truck", y: 42, s: 3, f: 7, r: 10, v: 5, o: {
              t: 1, j: 3, f: 18, p: 1, bw: 1, w: 1,
            },
          }
        end
      end

      context "soviet union" do
        it "has static definitions" do
          expect(defs[:ussr_dodge_wc]).to be == {
            t: "truck", c: "ussr", n: "Dodge WC", i: "truck", y: 42, s: 3, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:ussr_gaz_67]).to be == {
            t: "truck", c: "ussr", n: "GAZ-67", i: "car", y: 43, s: 2, f: 0, r: 0, v: 5, o: {
              tr: 1, trg: 1, w: 1,
            },
          }
          expect(defs[:ussr_gaz_aa]).to be == {
            t: "truck", c: "ussr", n: "GAZ-AA", i: "truck", y: 32, s: 3, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:ussr_gaz_aaa]).to be == {
            t: "truck", c: "ussr", n: "GAZ-AAA", i: "truck", y: 36, s: 3, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:ussr_gaz_mm]).to be == {
            t: "truck", c: "ussr", n: "GAZ-MM", i: "truck", y: 36, s: 3, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:ussr_jeep]).to be == {
            t: "truck", c: "ussr", n: "Jeep", i: "car", y: 41, s: 2, f: 0, r: 0, v: 5, o: {
              tr: 1, trg: 1, w: 1,
            },
          }
          expect(defs[:ussr_studebaker_us6]).to be == {
            t: "truck", c: "ussr", n: "Studebaker US6", i: "truck", y: 41, s: 4, f: 0, r: 0, v: 5, o: {
              sn: 1, tr: 3, trg: 1, w: 1,
            },
          }
          expect(defs[:ussr_zis_5]).to be == {
            t: "truck", c: "ussr", n: "ZIS-5", i: "truck", y: 34, s: 3, f: 0, r: 0, v: 5, o: {
              tr: 3, trg: 1, w: 1,
            },
          }
        end
      end
    end

    context "cavalry" do
      context "allied minors" do
        it "has static definitions" do
          expect(defs[:alm_horse]).to be == {
            t: "cav", c: "alm", n: "Horse", i: "cav", y: 0, s: 3, f: 0, r: 0, v: 7, o: {
              tr: 3,
            },
          }
          expect(defs[:alm_sokol_1000]).to be == {
            t: "cav", c: "alm", n: "Sokol 1000", i: "cav-wheel", y: 33, s: 3, f: 0, r: 0, v: 6, o: {
              tr: 3, w: 1,
            },
          }
        end
      end

      context "axis minors" do
        it "has static definitions" do
          expect(defs[:axm_horse]).to be == {
            t: "cav", c: "axm", n: "Horse", i: "cav", y: 0, s: 3, f: 0, r: 0, v: 7, o: {
              tr: 3,
            },
          }
        end
      end

      context "china" do
        it "has static definitions" do
          expect(defs[:chi_horse]).to be == {
            t: "cav", c: "chi", n: "Horse", i: "cav", y: 0, s: 3, f: 0, r: 0, v: 7, o: {
              tr: 3,
            },
          }
        end
      end

      context "finland" do
        it "has static definitions" do
          # NOP
        end
      end

      context "france" do
        it "has static definitions" do
          expect(defs[:fra_horse]).to be == {
            t: "cav", c: "fra", n: "Horse", i: "cav", y: 0, s: 3, f: 0, r: 0, v: 7, o: {
              tr: 3,
            },
          }
        end
      end

      context "german" do
        it "has static definitions" do
          expect(defs[:ger_bmw_r17]).to be == {
            t: "cav", c: "ger", n: "BMW R17", i: "cav-wheel", y: 35, s: 3, f: 0, r: 0, v: 6, o: {
              tr: 3, w: 1,
            },
          }
          expect(defs[:ger_bmw_r75]).to be == {
            t: "cav", c: "ger", n: "BMW R75", i: "cav-wheel", y: 41, s: 3, f: 0, r: 0, v: 6, o: {
              tr: 3, w: 1,
            },
          }
          expect(defs[:ger_horse]).to be == {
            t: "cav", c: "ger", n: "Horse", i: "cav", y: 0, s: 3, f: 0, r: 0, v: 7, o: {
              tr: 3,
            },
          }
          expect(defs[:ger_zundapp_ks_750]).to be == {
            t: "cav", c: "ger", n: "Zündapp KS 750", i: "cav-wheel", y: 41, s: 3, f: 0, r: 0, v: 6, o: {
              sn: 1, tr: 3, w: 1,
            },
          }
        end
      end

      context "italy" do
        it "has static definitions" do
          # NOP
        end
      end

      context "japan" do
        it "has static definitions" do
          expect(defs[:jap_bicycle]).to be == {
            t: "cav", c: "jap", n: "Bicycle", i: "cav-wheel", y: 30, s: 3, f: 0, r: 0, v: 4, o: {
              w: 1, tr: 3,
            },
          }
          expect(defs[:jap_horse]).to be == {
            t: "cav", c: "jap", n: "Horse", i: "cav", y: 0, s: 3, f: 0, r: 0, v: 7, o: {
              tr: 3,
            },
          }
        end
      end

      context "united kingdom" do
        it "has static definitions" do
          expect(defs[:uk_horse]).to be == {
            t: "cav", c: "uk", n: "Horse", i: "cav", y: 0, s: 3, f: 0, r: 0, v: 7, o: {
              tr: 3,
            },
          }
        end
      end

      context "united states" do
        it "has static definitions" do
          expect(defs[:usa_h_d_wla]).to be == {
            t: "cav", c: "usa", n: "H-D WLA", i: "cav-wheel", y: 40, s: 3, f: 0, r: 0, v: 6, o: {
              tr: 3, w: 1,
            },
          }
        end
      end

      context "soviet union" do
        it "has static definitions" do
          expect(defs[:ussr_dnepr_m_72]).to be == {
            t: "cav", c: "ussr", n: "Dnepr M-72", i: "cav-wheel", y: 42, s: 3, f: 0, r: 0, v: 6, o: {
              tr: 3, w: 1,
            },
          }
          expect(defs[:ussr_horse]).to be == {
            t: "cav", c: "ussr", n: "Horse", i: "cav", y: 0, s: 3, f: 0, r: 0, v: 7, o: {
              tr: 3,
            },
          }
          expect(defs[:ussr_pmz_a_750]).to be == {
            t: "cav", c: "ussr", n: "PMZ-A-750", i: "cav-wheel", y: 34, s: 3, f: 0, r: 0, v: 5, o: {
              tr: 3, w: 1,
            },
          }
        end
      end
    end
  end
end
# rubocop:enable Layout/LineLength
