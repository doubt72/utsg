# frozen_string_literal: true

module Scenarios
  class ScenarioE1 < Base
    ID = "E1"
    NAME = "Infantry Meeting Engagement"
    ALLIES = ["ussr"].freeze
    AXIS = ["ger"].freeze

    class << self
      # TODO: documentation for field descriptions
      def generate
        {
          turns: 6,
          first_setup: :allies,
          first_move: :axis,
          date: "43/9/6",
          location: "Yartzevo, Russia",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        <<~TEXT
          A simple meeting engagement.
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
            "8:ussr-rifle-s",
            "ussr-mmg",
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
