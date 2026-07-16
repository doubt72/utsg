require 'json'

json = File.read(ARGV[0])
data = JSON.parse(json)

metadata = data["metadata"]
mapdata = metadata["map_data"]

puts <<EOF
# frozen_string_literal: true

module Scenarios
  class Scenario#{data["id"]} < Base
    ID = "#{data["id"]}"
    NAME = "#{data["name"]}"
    ALLIES = #{data["allies"]}.freeze
    AXIS = #{data["axis"]}.freeze
    STATUS = "#{data["status"]}"
    VERSION = "#{data["version"]}"

    DATE = #{metadata["date"]}.freeze
    LAYOUT = #{mapdata["layout"]}.freeze

    ALLIED_UNITS = {
EOF

def units(units)
  units.each_key do |key|
    puts <<EOF
      "#{key}": { list: [
EOF
    units[key]["list"].each do |unit|
      if (unit["x"].to_i < 1)
        puts "        :#{unit["id"]},"
      else
        puts "        [#{unit["x"]}, :#{unit["id"]}],"
      end
    end
    puts <<EOF
      ] },
EOF
  end
end

units(metadata["allied_units"])

puts <<EOF
    }.freeze

    AXIS_UNITS = {
EOF

units(metadata["axis_units"])

puts <<EOF
    }.freeze

    class << self
      def generate
        {
          turns: #{metadata["turns"]},
          first_deploy: #{metadata["first_deploy"]},
          first_action: #{metadata["first_action"]},
          date:,
          location: "#{metadata["location"]}",
          author: "#{metadata["author"]}",
          description:,
          map_data:,
          allied_units:,
          axis_units:,
EOF
if metadata["special_rules"] && metadata["special_rules"].length > 0
  puts <<EOF
          special_rules: #{metadata["special_rules"]},
EOF
end
puts <<EOF
        }
      end

      def description
        [
EOF

metadata["description"].each do |para|
  puts "          \"#{para}\","
end

puts <<EOF
        ]
      end

      def map_data
        {
          start_weather: "#{mapdata["start_weather"]}",
          base_weather: "#{mapdata["base_weather"]}",
          precip: #{mapdata["precip"]},
          wind: #{mapdata["wind"]},
          hexes:,
          layout:,
          allied_dir: #{mapdata["allied_dir"]},
          axis_dir: #{mapdata["axis_dir"]},
          victory_hexes: [
EOF
print "            "
print mapdata["victory_hexes"].map { |v| "#{v}" }.join(", ")
print ",\n"

allied_setup = "#{mapdata["allied_setup"]}".gsub("=>", ' => ').gsub("{","{ ").gsub("}"," }")
axis_setup = "#{mapdata["axis_setup"]}".gsub("=>", ' => ').gsub("{","{ ").gsub("}"," }")

puts <<EOF
          ],
          allied_setup: #{allied_setup},
          axis_setup: #{axis_setup},
EOF
if mapdata["base_terrain"] != "g"
  puts <<EOF
          base_terrain: "#{mapdata["base_terrain"]}",
EOF
end
puts <<EOF
        }
      end

      def hexes
        [
EOF

mapdata["hexes"].each do |row|
  puts "          ["
  row.each do |hex|
    text = "            #{hex},"
    puts text.gsub(/"([A-Za-z]*)"=>/, '\1: ').gsub("{","{ ").gsub("}"," }")
  end
  puts "          ],"
end

puts <<EOF
        ]
      end
    end
  end
end
EOF
