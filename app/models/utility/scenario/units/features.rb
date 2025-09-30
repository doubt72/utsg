# frozen_string_literal: true

module Utility
  class Scenario
    module Units
      module Features
        class << self
          # rubocop:disable Metrics/MethodLength
          def features
            {
              # There's a range here:
              smoke2: { ft: 1, n: "Smoke", t: "smoke", i: "smoke", h: 2 },
              rubble: {
                ft: 1, n: "Rubble", t: "rubble", i: "rubble", v: "A", d: 3, o: { los: 1, vi: 1 },
              },
              roadblock: {
                ft: 1, n: "Road Block", t: "roadblock", i: "roadblock", f: 0, r: 0, v: 0,
                o: { vi: 1 }, h: 1,
              },
              tanktrap: {
                ft: 1, n: "Hedgehog", t: "roadblock", i: "tanktrap", f: 0, r: 0, v: 0,
                o: { vi: 1 }, h: 1,
              },
              blaze: { ft: 1, n: "Blaze", t: "fire", i: "fire", o: { los: 1, ai: 1 } },
              wire: { ft: 1, n: "Wire", t: "wire", i: "wire", f: "½", r: 0, v: "A" },
              # There's a range here
              mines8: {
                ft: 1, n: "Minefield", t: "mines", i: "mines", f: 8, r: 0, v: "A", o: { g: 1 },
              },
              ap_mines8: { ft: 1, n: "AP Minefield", t: "mines", i: "mines", f: 8, r: 0, v: "A" },
              at_mines8: {
                ft: 1, n: "AT Minefield", t: "mines", i: "mines", f: 8, r: 0, v: "A", o: { p: 1 },
              },
              shell_scrape: { ft: 1, n: "Shell Scrape", t: "foxhole", i: "foxhole", d: 1 },
              foxhole: { ft: 1, n: "Foxhole", t: "foxhole", i: "foxhole", d: 2 },
              trench: { ft: 1, n: "Trench", t: "foxhole", i: "foxhole", d: 3 },
              pillbox: {
                ft: 1, n: "Pillbox", t: "bunker", i: "bunker", o: { da: { f: 4, s: 4, r: 1 } },
              },
              bunker: {
                ft: 1, n: "Bunker", t: "bunker", i: "bunker", o: { da: { f: 5, s: 5, r: 1 } },
              },
              sniper2: { ft: 1, n: "Sniper", t: "sniper", f: 0, r: 0, v: 0, o: { q: 2 } },
              sniper3: { ft: 1, n: "Sniper", t: "sniper", f: 0, r: 0, v: 0, o: { q: 3 } },
              sniper4: { ft: 1, n: "Sniper", t: "sniper", f: 0, r: 0, v: 0, o: { q: 4 } },
              sniper5: { ft: 1, n: "Sniper", t: "sniper", f: 0, r: 0, v: 0, o: { q: 5 } },
              sniper6: { ft: 1, n: "Sniper", t: "sniper", f: 0, r: 0, v: 0, o: { q: 6 } },
              sniper7: { ft: 1, n: "Sniper", t: "sniper", f: 0, r: 0, v: 0, o: { q: 7 } },
            }
          end
          # rubocop:enable Metrics/MethodLength
        end
      end
    end
  end
end
