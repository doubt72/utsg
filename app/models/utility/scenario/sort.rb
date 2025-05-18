# frozen_string_literal: true

module Utility
  class Scenario
    module Sort
      def sort(scenarios, sort, dir)
        case sort
        when "d"
          sort_date(scenarios, dir)
        when "m"
          sort_mapsize(scenarios, dir)
        when "u"
          sort_unitsize(scenarios, dir)
        else
          sort_id(scenarios, dir)
        end
      end

      def sort_id(scenarios, dir)
        if dir == "asc"
          scenarios.sort { |a, b| a[:id] <=> b[:id] }
        else
          scenarios.sort { |a, b| b[:id] <=> a[:id] }
        end
      end

      def sort_date(scenarios, dir)
        if dir == "asc"
          scenarios.sort { |a, b| a[:date] <=> b[:date] }
        else
          scenarios.sort { |a, b| b[:date] <=> a[:date] }
        end
      end

      def sort_mapsize(scenarios, dir)
        if dir == "asc"
          scenarios.sort { |a, b| map_size(a) <=> map_size(b) }
        else
          scenarios.sort { |a, b| map_size(b) <=> map_size(a) }
        end
      end

      def map_size(scenario)
        x, y = scenario[:layout]
        x + y
      end

      def sort_unitsize(scenarios, dir)
        if dir == "asc"
          scenarios.sort { |a, b| unit_count(a) <=> unit_count(b) }
        else
          scenarios.sort { |a, b| unit_count(b) <=> unit_count(a) }
        end
      end

      def unit_count(scenario)
        all_units(scenario).length
      end
    end
  end
end
