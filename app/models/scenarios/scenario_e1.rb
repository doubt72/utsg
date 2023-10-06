# frozen_string_literal: true

module Scenarios
  class ScenarioE1 < Base
    ID = "E1"
    NAME = "Lost in the Woods"
    ALLIES = ["ussr"].freeze
    AXIS = ["ger"].freeze

    class << self
      # TODO: documentation for field descriptions
      def generate
        {
          turns: 6,
          first_setup: 1,
          first_move: 2,
          date: [1942, 7, 31],
          location: "Rzhev, Russia",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        <<~TEXT
          A simple meeting engagement as german troops counterattack a Russian breakthrough
          in the woods near Rzhev.
        TEXT
      end

      # TODO: documentation for map definitions
      def map_data
        {
          orientation: "x+",
          hexes:,
        }
      end

      def hexes
        hexes = []
        10.times do
          row = []
          12.times do |x|
            hex = { t: "o" }
            hex[:f] = ["xs"] if x < 4
            hex[:f] = ["as"] if x > 5
            row.push(hex)
          end
          hexes.push(row)
        end
        hexes
      end

      # TODO: documentation for unit definitions
      def allied_units
        {
          s: [
            "ussr-leader-5-2",
            "ussr-leader-4-1",
            "9:ussr-rifle-s",
            "ussr-lmg",
          ],
        }
      end

      def axis_units
        {
          s: [
            "ger-leader-6-2",
            "ger-leader-4-1",
            "6:ger-rifle-s",
            "2:ger-lmg",
          ],
        }
      end
    end
  end
end
