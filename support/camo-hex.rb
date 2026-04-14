require "pnm"

image = PNM.read("camo-source.pgm")

def color1; 255; end
def color2; 152; end
def color3; 93; end
def color4; 69; end

def color_grass(from)
  return "#776" if from == color1
  return "#897" if from == color2
  return "#A97" if from == color3
  "#BB9"
end

def color_urban(from)
  return "#4A5A42" if from == color1
  return "#696960" if from == color2
  return "#828174" if from == color3
  "#A8A695"
  # return "#444" if from == color1
  # return "#7F7F70" if from == color2
  # return "#AA8" if from == color3
  # "#C7C7C5"
end

def color_desert(from)
  return "#6A3E21" if from == color1
  return "#A74" if from == color2
  return "#BEB188" if from == color3
  "#DFCDB1"
end

def color_mud(from)
  return "#963" if from == color1
  return "#997" if from == color2
  return "#C96" if from == color3
  "#CB9"
end

def color_snow(from)
  return "#AAA" if from == color1
  return "#CCC" if from == color2
  return "#DDD" if from == color3
  "#FFF"
end

def sin(x)
  Math.sin(x * Math::PI / 180)
end

def cos(x)
  Math.cos(x * Math::PI / 180)
end

def round(x)
  (x * 100.0).floor / 100.0
end

def hex(x, y, radius, line, width, fill)
  points = []
  0.upto(5) do |p|
    angle = 60 * p
    points.push("#{cos(angle) * radius + x},#{sin(angle) * radius + y}")
  end
  "<polygon points=\"#{points.join(" ")}\" style=\"stroke:#{line};stroke-width:#{width};fill:#{fill};\" />"
end

def hex_react(x, y, radius, name)
  points = []
  0.upto(5) do |p|
    angle = 60 * p
    points.push("#{round(cos(angle) * radius + x)},#{round(sin(angle) * radius + y)}")
  end
  "      <polygon className=\"#{name}\" points=\"#{points.join(" ")}\" />"
end

def hex_coords(x, y, radius, num)
  points = []
  0.upto(5) do |p|
    angle = 60 * p
    points.push("#{round(cos(angle) * radius + x)},#{round(sin(angle) * radius + y)}")
  end
  "      [#{num}, \"#{points.join(" ")}\"],"
end

def num_to_index(n)
  return 1 if n == color1
  return 2 if n == color2
  return 3 if n == color3
  4
end

pixels = image.pixels

types = [
  ["grass", color_grass(color1), color_grass(color2), color_grass(color3), color_grass(color4)],
  ["urban", color_urban(color1), color_urban(color2), color_urban(color3), color_urban(color4)],
  ["desert", color_desert(color1), color_desert(color2), color_desert(color3), color_desert(color4)],
  ["snow", color_snow(color1), color_snow(color2), color_snow(color3), color_snow(color4)],
  ["mud", color_mud(color1), color_mud(color2), color_mud(color3), color_mud(color4)],
]

hex_factor = 0.866

image_size = 120
x_size = 40 # divisible by 120, not more than half
y_size = 20 # divisible by 120, not more than half
x_multiplier = image_size / x_size
y_multiplier = image_size / y_size
radius = 10
small_radius = radius * 0.933 / hex_factor
outline_radius = radius * 0.9 / hex_factor
width = round(radius*2 * x_size / hex_factor * 0.75)
height = round(radius*2 * y_size)
line_width = (radius - small_radius)*2

types.each do |type|
  File.open("camo-#{type[0]}.svg", "w") do |f|
    f.puts "<svg style=\"margin: 1em;\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 #{width} #{height}\" width=\"#{width}\" height=\"#{height}\" >"
    f.puts "<rect x=\"0\" y=\"0\" width=\"#{width}\" height=\"#{height}\" fill=\"#000\" />"
    0.upto(x_size) do |x|
      0.upto(y_size) do |y|
        xx = x % (image_size/x_multiplier)
        yy = y % (image_size/y_multiplier)
        color = type[num_to_index(pixels[yy*y_multiplier + xx%2*x_multiplier/2][xx*x_multiplier])]
        f.puts hex(x*radius*2*hex_factor, y*radius*2 + x%2*radius, small_radius, "#000", 0, color)
      end
    end

    -1.upto(x_size) do |x|
      -1.upto(y_size) do |y|
        xx = x % (image_size/x_multiplier)
        yy = y % (image_size/y_multiplier)
        color = type[num_to_index(pixels[yy*y_multiplier + xx%2*x_multiplier/2][xx*x_multiplier + x_multiplier/2])]
        f.puts hex(x*radius*2*hex_factor + radius, y*radius*2 + x%2*radius, outline_radius, color, line_width, "rgba(0,0,0,0)")
      end
    end
    f.puts "</svg>"
  end
end

# types.each do |type|
  # File.open("camo-#{type[0]}.xxx", "w") do |f|
  File.open("camo-coords.xxx", "w") do |f|
    # f.puts "    <pattern id=\"camo-#{type[0]}-bg\" width=\"#{width}\" height=\"#{height}\" patternUnits=\"userSpaceOnUse\" >"
    # f.puts "      <rect x=\"0\" y=\"0\" width=\"#{width}\" height=\"#{height}\" fill=\"#000\" />"
    0.upto(x_size) do |x|
      0.upto(y_size) do |y|
        xx = x % (image_size/x_multiplier)
        yy = y % (image_size/y_multiplier)
        num = num_to_index(pixels[yy*y_multiplier + xx%2*x_multiplier/2][xx*x_multiplier])
        # color = type[num]
        f.puts hex_coords(x*radius*2*hex_factor, y*radius*2 + x%2*radius, small_radius, num)
        # f.puts hex_react(x*radius*2*hex_factor, y*radius*2 + x%2*radius, small_radius, "camo-#{type[0]}#{num}")
      end
    end

    f.puts ""

    -1.upto(x_size) do |x|
      -1.upto(y_size) do |y|
        xx = x % (image_size/x_multiplier)
        yy = y % (image_size/y_multiplier)
        num = num_to_index(pixels[yy*y_multiplier + xx%2*x_multiplier/2][xx*x_multiplier + x_multiplier/2])
        # color = type[num]
        f.puts hex_coords(x*radius*2*hex_factor + radius, y*radius*2 + x%2*radius, small_radius, num)
        # f.puts hex_react(x*radius*2*hex_factor + radius, y*radius*2 + x%2*radius, small_radius, "camo-#{type[0]}-line#{num}")
      end
    end
    # f.puts "    </pattern>"
  end
# end
