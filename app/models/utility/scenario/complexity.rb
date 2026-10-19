# frozen_string_literal: true

module Utility
  class Scenario
    module Complexity # rubocop:disable Metrics/ModuleLength
      # rubocop:disable Metrics/MethodLength
      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/PerceivedComplexity
      # rubocop:disable Metrics/CyclomaticComplexity
      def complexity(scenario)
        metadata = scenario[:metadata] || {}
        map = metadata[:map_data] || {}

        points = (metadata[:turns] || 0) * 5
        multiplier = 1

        points += (map[:victory_hexes]&.length || 0) * 5
        layout = map[:layout] || [0, 0]
        points += Math.sqrt((layout[0]**2) + (layout[1]**2)) * 2
        units = []
        second = false
        metadata[:allied_units]&.each_value do |data|
          multiplier *= 1.1 if second
          data[:list].each do |u|
            units.push(u)
          end
          second = true
        end
        second = false
        metadata[:axis_units]&.each_value do |data|
          multiplier *= 1.1 if second
          data[:list].each do |u|
            units.push(u)
          end
          second = true
        end
        init_data = false
        metadata[:init_allied_units]&.each do |data|
          init_data = true
          units.push(data[:data])
        end
        metadata[:init_axis_units]&.each do |data|
          init_data = true
          units.push(data[:data])
        end
        max = 1
        units.each do |u| # rubocop:disable Metrics/BlockLength
          count = u[:x] || 1
          if u[:ft]
            if u[:t] == "sniper"
              multiplier *= 1.333
            elsif %w[wire mines roadblock].include?(u[:t])
              points += 5 * count
              max = 1.667
            elsif u[:t] == "bunker"
              points += 3 * count
              max = 1.2
            else
              points += 1 * count
              max = 1.1
            end
          elsif !u[:mk]
            vehicle = u[:o][:k] || u[:o][:w]
            incendiary = u[:o] && (u[:o][:i] || (u[:o][:sg] && u[:o][:sg][:t] == "ft"))
            armored = u[:o] && u[:o][:ha] && !(u[:o][:ha][:r].negative? ||
              (u[:o][:ta] && (u[:o][:ta][:r].negative? || !u[:o][:ta][:t].nil?)))
            offboard = u[:o] && u[:o][:o]
            mortar = u[:o] && u[:o][:m]
            crewed = u[:o] && u[:o][:c]
            decoy = u[:d]
            if vehicle && incendiary
              points += 9 * count
              max = 1.667
            elsif (vehicle && !armored) || incendiary || offboard
              points += 5 * count
              max = 1.5
            elsif vehicle || mortar || crewed || decoy
              points += 3 * count
              max = 1.2
            else
              points += 1 * count
              max = 1
            end
          end
        end
        multiplier *= max
        multiplier *= 1.1 if (map[:wind] || [0, 0, false])[2]
        multiplier *= 1.2 if (map[:precip] || [0])[0].positive?
        multiplier *= 1.1 if map[:night]
        multiplier *= 1.1 if map[:base_weather] != "dry"
        multiplier *= 1.2 if init_data
        multiplier *= 1.333 if %w[m s].include?(map[:base_terrain])
        vcheck = false
        map[:hexes]&.each do |row|
          row.each do |col|
            if col[:h] && col[:h] != 0
              vcheck = true
              break
            end
          end
          break if vcheck
        end
        multiplier *= 1.333 if vcheck
        metadata[:special_rules]&.each do |rule|
          if %w[allied_escape axis_escape axis_cave_movement axis_suicide].include?(rule)
            multiplier *= 1.667
          elsif rule.to_s.include?("random_drop")
            multiplier *= 1.5
          elsif %w[
            allied_hidden_units axis_hidden_units allied_ignore_snow axis_ignore_snow axis_bonzai
          ].include?(rule)
            multiplier *= 1.333
          else
            multiplier *= 1.2
          end
        end

        (((points * multiplier / 50.0)**0.333) * 2.4) - 2.1
      end
      # rubocop:enable Metrics/MethodLength
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/PerceivedComplexity
      # rubocop:enable Metrics/CyclomaticComplexity
    end
  end
end
