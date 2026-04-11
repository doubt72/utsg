
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

radius = 50
distance = radius * 2
width = (radius * 2) / 0.866
height = radius * 2

File.open("hex-pattern.svg", "w") do |f|
  f.puts "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 #{width*1.5} #{height}\" width=\"#{width*1.5}\" height=\"#{height}\" >"
  f.puts "<rect x=\"0\" y=\"0\" width=\"#{width*1.5}\" height=\"#{height}\" fill=\"#EEE\" />"
  f.puts hex(width / 2, height / 2, radius, "#000", 2, "rgb(0,0,0,0)")
  0.upto(5) do |d|
    angle = 60 * d + 30
    x = cos(angle) * distance + width / 2
    y = sin(angle) * distance + height / 2
    f.puts hex(x, y, radius, "#000", 2, "rgb(0,0,0,0)")
  end

  0.upto(2) do |d|
    angle = 120 * d
    x = cos(angle) * radius / 0.866 + width / 2
    y = sin(angle) * radius / 0.866 + height / 2
    f.puts hex(x, y, radius, "#000", 2, "rgb(0,0,0,0)")
  end
  1.upto(2) do |d|
    angle = 120 * d
    x = cos(angle) * radius / 0.866 + width * 2
    y = sin(angle) * radius / 0.866 + height / 2
    f.puts hex(x, y, radius, "#000", 2, "rgb(0,0,0,0)")
  end
  f.puts "</svg>"
end

File.open("hex-pattern.xxx", "w") do |f|
  f.puts "      <rect x=\"0\" y=\"0\" width=\"#{width*1.5}\" height=\"#{height}\" fill=\"#EEE\" />"
  f.puts hex_react(width / 2, height / 2, radius, "#000", 2, "rgb(0,0,0,0)")
  0.upto(5) do |d|
    angle = 60 * d + 30
    x = cos(angle) * distance + width / 2
    y = sin(angle) * distance + height / 2
    f.puts hex_react(x, y, radius, "#000", 2, "rgb(0,0,0,0)")
  end

  0.upto(2) do |d|
    angle = 120 * d
    x = cos(angle) * radius / 0.866 + width / 2
    y = sin(angle) * radius / 0.866 + height / 2
    f.puts hex_react(x, y, radius, "#000", 2, "rgb(0,0,0,0)")
  end
  1.upto(2) do |d|
    angle = 120 * d
    x = cos(angle) * radius / 0.866 + width * 2
    y = sin(angle) * radius / 0.866 + height / 2
    f.puts hex_react(x, y, radius, "#000", 2, "rgb(0,0,0,0)")
  end
end

