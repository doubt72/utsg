require "pnm"

image = PNM.read("camo-source.ppm")

# width = image.width
# height = image.height

# color1 = 0
# color2 = 0
# color3 = 0
# color4 = 0
# other = 0

# image.pixels.each do |row|
#   row.each do |pixel|
#     if pixel[0] == 168
#       color1 += 1
#     elsif pixel[0] == 130
#       color2 += 1
#     elsif pixel[0] == 105
#       color3 += 1
#     elsif pixel[0] == 74
#       color4 += 1
#     else
#       puts "#{pixel}"
#       other += 1
#     end
#   end
# end

# puts "color 1: #{color1}"
# puts "color 2: #{color2}"
# puts "color 3: #{color3}"
# puts "color 4: #{color4}"
# puts "other  : #{other}"

def color_grass(from)
  return "#776" if from == 74
  return "#897" if from == 105
  return "#A97" if from == 130
  "#BB9"
end

def color_urban(from)
  return "#4A5A42" if from == 74
  return "#696960" if from == 105
  return "#828174" if from == 130
  "#A8A695"
  # return "#444" if from == 74
  # return "#7F7F70" if from == 105
  # return "#AA8" if from == 130
  # "#C7C7C5"
end

def color_desert(from)
  return "#6A3E21" if from == 74
  return "#A74" if from == 105
  return "#BEB188" if from == 130
  "#DFCDB1"
end

def color_mud(from)
  return "#963" if from == 74
  return "#997" if from == 105
  return "#C96" if from == 130
  "#CB9"
end

def color_snow(from)
  return "#AAA" if from == 74
  return "#CCC" if from == 105
  return "#DDD" if from == 130
  "#FFF"
end

def color(from)
  color_desert(from)
end

def sin(x)
  Math.sin(x * Math::PI / 180)
end

def cos(x)
  Math.cos(x * Math::PI / 180)
end

def hex(x, y, radius, line, width, fill)
  points = []
  0.upto(5) do |p|
    angle = 60 * p
    points.push("#{cos(angle) * radius + x},#{sin(angle) * radius + y}")
  end
  "<polygon points=\"#{points.join(" ")}\" style=\"stroke:#{line};stroke-width:#{width};fill:#{fill};\" />"
end

def hex_react(x, y, radius, line, width, fill)
  points = []
  0.upto(5) do |p|
    angle = 60 * p
    points.push("#{cos(angle) * radius + x},#{sin(angle) * radius + y}")
  end
  "      <polygon points=\"#{points.join(" ")}\" style={{ stroke: \"#{line}\", strokeWidth: #{width}, fill: \"#{fill}\" }} />"
end

def num_to_index(n)
  return 1 if n == 74
  return 2 if n == 105
  return 3 if n == 130
  4
end

pixels = image.pixels

types = [
  ["grass", color_grass(74), color_grass(105), color_grass(130), color_grass(168)],
  ["urban", color_urban(74), color_urban(105), color_urban(130), color_urban(168)],
  ["desert", color_desert(74), color_desert(105), color_desert(130), color_desert(168)],
  ["snow", color_snow(74), color_snow(105), color_snow(130), color_snow(168)],
  ["mud", color_mud(74), color_mud(105), color_mud(130), color_mud(168)],
]

types.each do |type|
  File.open("camo-#{type[0]}.svg", "w") do |f|
    f.puts '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 610 500" width="3660" height="3000" >'
    f.puts '<rect x="0" y="0" width="1500" height="1000" fill="#000" />'
    0.upto(150) do |x|
      0.upto(100) do |y|
        color = type[num_to_index(pixels[y*4 + x%2*2][x*4][0])]
        f.puts hex(x*4.2, y*5.0 + x%2*2.5, 2.557, "#000", 0, color)
      end
    end

    0.upto(150) do |x|
      0.upto(100) do |y|
        color = type[num_to_index(pixels[y*4 + x%2*2][x*4 + 2][0])]
        f.puts hex(x*4.2 + 2.1, y*5.0 + x%2*2.5, 2.45, color, 0.33, "rgba(0,0,0,0)")
      end
    end
    f.puts "</svg>"
  end
end

types.each do |type|
  File.open("camo-#{type[0]}.tsx", "w") do |f|
    f.puts '      <rect x="0" y="0" width="1500" height="1000" fill="#000" />'
    0.upto(150) do |x|
      0.upto(100) do |y|
        color = type[num_to_index(pixels[y*4 + x%2*2][x*4][0])]
        f.puts hex_react(x*4.2, y*5.0 + x%2*2.5, 2.557, "#000", 0, color)
      end
    end

    0.upto(150) do |x|
      0.upto(100) do |y|
        color = type[num_to_index(pixels[y*4 + x%2*2][x*4 + 2][0])]
        f.puts hex_react(x*4.2 + 2.1, y*5.0 + x%2*2.5, 2.45, color, 0.33, "rgba(0,0,0,0)")
      end
    end
  end
end

