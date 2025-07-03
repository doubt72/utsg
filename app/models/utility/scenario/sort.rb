# frozen_string_literal: true

module Utility
  class Scenario
    module Sort
      def sort(scenarios, sort, dir) # rubocop:disable Metrics/MethodLength
        case sort
        when "d"
          sort_date(scenarios, dir)
        when "m"
          sort_mapsize(scenarios, dir)
        when "u"
          sort_unitsize(scenarios, dir)
        when "r"
          sort_rating(scenarios, dir)
        when "b"
          sort_balance(scenarios, dir)
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
        all_units(scenario).reduce(0) { |cnt, u| cnt + (u[0].to_i.positive? ? u[0].to_i : 1) }
      end

      def average(averages, counts, id)
        count = counts[id].to_f + 1
        (averages[id].to_f * (count - 1) / count) + (4 / count)
      end

      def sort_rating(scenarios, dir) # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
        counts = Rating.all.group(:scenario).count
        averages = Rating.all.group(:scenario).average(:rating)
        if dir == "asc"
          scenarios.sort do |a, b|
            ratio = average(averages, counts, b[:id]) <=> average(averages, counts, a[:id])
            ratio.zero? ? a[:id] <=> b[:id] : ratio
          end
        else
          scenarios.sort do |a, b|
            ratio = average(averages, counts, a[:id]) <=> average(averages, counts, b[:id])
            ratio.zero? ? b[:id] <=> a[:id] : ratio
          end
        end
      end

      def balance(ones, twos, id)
        one = ones[id].to_f + 1
        ((one / (one + twos[id].to_f + 1)) - 0.5).abs
      end

      def sort_balance(scenarios, dir) # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
        p1 = Game.where("player_one_id = winner_id").group(:scenario).count
        p2 = Game.where("player_two_id = winner_id").group(:scenario).count
        if dir == "asc"
          scenarios.sort do |a, b|
            ratio = balance(p1, p2, a[:id]) <=> balance(p1, p2, b[:id])
            ratio.zero? ? a[:id] <=> b[:id] : ratio
          end
        else
          scenarios.sort do |a, b|
            ratio = balance(p1, p2, b[:id]) <=> balance(p1, p2, a[:id])
            ratio.zero? ? b[:id] <=> a[:id] : ratio
          end
        end
      end
    end
  end
end
