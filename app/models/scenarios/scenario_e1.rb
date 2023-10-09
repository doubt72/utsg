# frozen_string_literal: true

module Scenarios
  class ScenarioE1 < Base # rubocop:disable Metrics/ClassLength
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
          author: "Douglas Triggs",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
        }
      end

      def description
        [
          "A simple meeting engagement as German divisional reserves attempt
          to plug a gap in the German defenses by counterattacking a small
          Soviet breakthrough in the woods on the second day of the first
          Soviet Rzhev-Sychyovka offensive.",
        ]
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
      def allied_units # rubocop:disable Metrics/MethodLength
        {
          s: { list: [
            :ussr_leader_5_2,
            :ussr_leader_4_1,
            [8, :ussr_rifle_s],
            :ussr_lmg,
            :ussr_mmg,
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
          t2: { list: %i[
            ussr_assault_s
            ussr_militia_s
            ussr_assault_t
            ussr_rifle_t
            ussr_militia_t
            ussr_elite_crew
            ussr_ft
            ussr_mc
            ussr_ampulomet
            ussr_lm
            ussr_76_inf
            ussr_45_at
            ussr_57_at
            ussr_radio152
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end

      def axis_units # rubocop:disable Metrics/MethodLength
        {
          s: { list: [
            :ger_leader_6_2,
            :ger_leader_4_1,
            [6, :ger_rifle_s],
            [2, :ger_lmg],
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
          t2: { list: %i[
            ger_pioneer_s
            ger_conscript_s
            ger_pioneer_t
            ger_rifle_t
            ger_conscript_t
            ger_crew
            ger_hmg
            ger_ft
            ger_sc
            ger_panzerfaust
            ger_panzerschreck
            ger_mm
            ger_sig33_inf
            ger_28_at
            ger_88_at
            ger_radio105
          ].map { |u| Utility::Scenarios::Units.unit_definition(u) } },
        }
      end
    end
  end
end
