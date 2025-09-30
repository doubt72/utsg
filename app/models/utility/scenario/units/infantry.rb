# frozen_string_literal: true

module Utility
  class Scenario
    module Units
      module Infantry # rubocop:disable Metrics/ModuleLength
        class << self
          # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
          def infantry
            leaders.merge(squads_and_teams).merge(crews)
          end

          # These are purely generated
          def leaders
            # Currently 6-2, 5-2, 6-1, 5-1, 4-1, 3-1
            i = "leader"
            y = 0
            s = f = r = 1
            lu = {}
            Units.all_factions.each do |nation|
              [6, 5, 4, 3].each do |m|
                [2, 1].each do |l|
                  next if l == 2 && m < 5

                  lu[:"#{nation}_leader_#{m}_#{l}"] = {
                    c: nation, t: "ldr", n: "Leader", i:, y:, m:, s:, f:, r:, v: 6, o: { l: },
                  }
                end
              end
            end
            lu
          end

          # These are fairly arbitrary and may change
          def squads_and_teams
            lu = {}
            key = %i[c n y m f r v o]
            [
              ["alm", "Engineer", 0, 4, 8, 3, 5, { a: 1, s: 1, eng: 1 }],
              ["alm", "Elite", 0, 4, 7, 5, 5, { a: 1, s: 1 }],
              ["alm", "Regular", 0, 3, 6, 4, 4, {}],
              ["alm", "Conscript", 0, 2, 6, 3, 3, {}],

              ["axm", "Engineer", 0, 4, 8, 3, 5, { a: 1, s: 1, eng: 1 }],
              ["axm", "Elite", 0, 4, 7, 5, 5, { a: 1, s: 1 }],
              ["axm", "Regular", 0, 3, 6, 4, 4, {}],
              ["axm", "Conscript", 0, 2, 6, 3, 3, {}],

              ["chi", "Elite", 0, 4, 6, 4, 5, { a: 1 }],
              ["chi", "Regular", 0, 3, 5, 4, 4, {}],
              ["chi", "Conscript", 0, 2, 4, 3, 3, {}],

              ["fin", "Elite", 0, 4, 7, 5, 5, { a: 1, s: 1 }],
              ["fin", "Regular", 0, 3, 6, 4, 4, {}],
              ["fin", "Conscript", 0, 2, 6, 3, 3, {}],
              ["fin", "Sissi", 0, 4, 7, 5, 5, {}],

              ["fra", "Génie", 0, 4, 8, 3, 5, { a: 1, s: 1, eng: 1 }],
              ["fra", "BAR", 0, 3, 8, 4, 4, { a: 1, s: 1 }],
              ["fra", "Legionnaire", 0, 4, 7, 5, 5, { s: 1 }],
              ["fra", "Chasseur", 0, 3, 6, 4, 5, { s: 1 }],
              ["fra", "Reservist", 0, 2, 6, 4, 4, {}],
              ["fra", "Colonial", 0, 2, 6, 3, 3, {}],
              ["fra", "Free French", 41, 3, 7, 5, 4, {}],

              ["ger", "Pionier", 0, 4, 9, 3, 5, { a: 1, s: 1, eng: 1 }],
              ["ger", "SS", 34, 4, 8, 5, 5, { a: 1, s: 1 }],
              ["ger", "Fallschirmjäger", 35, 4, 7, 4, 5, { a: 1, s: 1 }],
              ["ger", "Gebirgsjäger", 0, 4, 7, 4, 5, { a: 1, s: 1 }],
              ["ger", "Sturm", 0, 4, 8, 4, 5, { a: 1, s: 1 }],
              ["ger", "Rifle", 0, 3, 7, 5, 4, { s: 1 }],
              ["ger", "Volksgrenadier", 44, 3, 7, 4, 4, {}],
              ["ger", "Conscript", 0, 2, 6, 3, 3, {}],

              ["ita", "Guastatori", 40, 4, 8, 2, 5, { a: 1, s: 1, eng: 1 }],
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

              ["uk", "Engineer", 0, 4, 9, 5, 5, { a: 1, s: 1, eng: 1 }],
              ["uk", "Airborne", 42, 4, 8, 5, 5, { a: 1, s: 1 }],
              ["uk", "Gurkha", 0, 4, 7, 5, 5, { a: 1 }],
              ["uk", "Guard", 0, 4, 7, 5, 5, { s: 1 }],
              ["uk", "Line", 0, 3, 7, 4, 4, { s: 1 }],
              ["uk", "Indian", 0, 3, 6, 4, 4, {}],
              ["uk", "Territorial", 0, 2, 6, 3, 3, {}],
              ["uk", "Colonial", 0, 2, 6, 3, 3, {}],

              ["usa", "Engineer", 0, 4, 9, 3, 5, { a: 1, s: 1, eng: 1 }],
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

              squad[:o][:bv] = squad[:v] if squad[:v] < 4
              team[:o] = team[:v] < 4 ? { bv: team[:v] } : {}
              team[:f] = team[:f] / 2

              squad.delete(:o) if squad[:o] == {}
              team.delete(:o) if team[:o] == {}

              name = "#{team[:c]}_#{Units.sanitize(team[:n])}"
              lu[:"#{name}_s"] = squad
              lu[:"#{name}_t"] = team
            end
            lu
          end

          # Also purely generated
          def crews
            lu = {}
            Units.all_factions.each do |c|
              t = "tm"
              lu[:"#{c}_elite_crew_t"] = {
                c:, t:, n: "Crew", i: "crew", y: 0, m: 4, s: 3, f: 1, r: 1, v: 5, o: { cw: 2 },
              }
              lu[:"#{c}_crew_t"] = {
                c:, t:, n: "Crew", i: "crew", y: 0, m: 3, s: 3, f: 1, r: 1, v: 4, o: { cw: 1 },
              }
            end
            lu
          end
          # rubocop:enable Metrics/MethodLength, Metrics/AbcSize
        end
      end
    end
  end
end
