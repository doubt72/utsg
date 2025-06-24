# font = "Play"
font = "Special Elite"

# This code is faintly ugly, but whatever.  Generates a logo in SVG
# at arbitrary sizes in color and reverse/greyscale

puts "<!DOCTYPE html>"
puts "<html>"
puts "<head>"
puts "  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />"
puts "  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin=\"anonymous\" />"
puts "  <link href=\"https://fonts.googleapis.com/css2?family=Special+Elite%26display=swap\" rel=\"stylesheet\" />"
puts "</head>"
puts "<body>"

explode = 0.1
def sin(x)
  Math.sin(x * Math::PI / 180)
end

def cos(x)
  Math.cos(x * Math::PI / 180)
end

def size_factor
  880
end

def size(x)
  x * size_factor / 880.0
end

def line_size(x)
  factor = 880.0 / size_factor
  x / factor <= 1 ? 1 : x / factor
end

hex_colors = %w(#450 #CE7 #450 #CE7)
text_colors = %w(#CE7 #000 #CE7 #000)
letters = %w(S T B O)

hex_size = []
x = []
y = []
color = []
0.upto(3) do |n|
  hex_size.push(size(90))
  x.push(size(97 + n*140))
  y.push(size(82))
end

puts "<svg width=\"1200\" height=\"320\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 #{size(614)} #{size(164)}\">"

0.upto(hex_size.length - 1) do |n|
  points = []
  0.upto(5) do |p|
    angle = 60 * p + 30
    points.push("#{((sin(angle) * hex_size[n] + x[n]) * 10).to_i/10.0}," +
                "#{((cos(angle) * hex_size[n] + y[n]) * 10).to_i/10.0}")
  end
  puts "<polygon points=\"#{points.join(" ")}\" " +
    "style=\"fill:#{hex_colors[n]};stroke-width:10;stroke:#450\" />"
  puts "<text " +
    "x=\"#{x[n]-43}\" " +
    "y=\"#{y[n]+55}\" " +
    "style=\"fill:#{text_colors[n]};" +
    "font-family:'#{font}';font-size:#{size(150)}px;\">#{letters[n]}</text>"
end

puts "</svg>"
puts "</body>"
puts "</html>"
