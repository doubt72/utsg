# font = "Play"
font = "Special Elite"

# This code is faintly ugly, but whatever.  Generates a logo in SVG

puts "<!DOCTYPE html>"
puts "<html>"
puts "<body>"

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

opacity = [1.0, 0.8, 0.6, 0.4]

hex_size = []
x = []
y = []
hex_size.push(size(90))
x.push(size(100))
y.push(size(100))

width = 200
height = 200

puts "<svg width=\"600\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 #{size(width)} #{size(height)}\">"

puts "<rect x=\"0\" y=\"0\" width=\"#{size(width)}\" height=\"#{size(height)}\" style=\"fill: #DDD;\" />"
(hex_size.length - 1).downto(0) do |n|
  points = []
  0.upto(5) do |p|
    angle = 60 * p + 30
    points.push("#{((cos(angle + 15) * hex_size[n] + x[n]) * 10).to_i/10.0}," +
                "#{((sin(angle + 15) * hex_size[n] + y[n]) * 10).to_i/10.0}")
  end
  b = 255 - 255 * opacity[n] ** 1.5
  rb = 255 - 70 * opacity[n]
  g = 255 - 18 * opacity[n]
  line = "rgb(#{b},#{b},#{b})"
  fill = "rgb(#{g},#{g},#{rb})"
  puts "<polygon points=\"#{points.join(" ")}\" style=\"stroke:#{line};stroke-width:8;fill:#{fill};\" />"
end

acen = 100
awid = 25

shift = 0
alef = 10 + shift
amid = 60 + shift
arig = 135 + shift

style = "fill:#670;stroke-width:8;stroke:#000"
path = [
  "M", alef, acen - awid, "L", amid, acen - awid, "L", amid, acen - (arig - amid)*0.67,
  "L", arig, acen, "L", amid, acen + (arig - amid)*0.67, "L", amid, acen + awid, "L", alef, acen + awid,
  "z"
].map { |n| n.to_s }.join(" ")

puts "<path d=\"#{path}\" style=\"#{style}\" />"

puts "</svg>"
puts "</body>"
puts "</html>"
