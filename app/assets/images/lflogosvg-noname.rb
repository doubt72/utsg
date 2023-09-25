# This code is faintly ugly, but whatever.  Generates a logo in SVG
# at arbitrary sizes in color and reverse/greyscale

puts "<!DOCTYPE html>"
puts "<html>"
puts "<body>"

explode = 0.1
def sin(x)
  Math.sin(x * Math::PI / 180)
end

def cos(x)
  Math.cos(x * Math::PI / 180)
end

def size_factor
  152
end

def padding
  10
end

def transparent
  false
end

def size(x)
  x * size_factor / (190.0 + padding * 2)
end

def line_size(x)
  factor = (190.0 + padding * 2) / size_factor
  x / factor <= 1 ? 1 : x / factor
end

color_source = [
  {
    top: 'hsl(15, 60%, 40%)',
    middle: 'hsl(200, 60%, 22%)',
    bottom: 'hsl(200, 60%, 32%)',
    line: 'hsl(60, 80%, 80%)',
    background: 'hsl(0, 0%, 0%)'
  },
  {
    top: 'hsl(15, 0%, 60%)',
    middle: 'hsl(200, 0%, 78%)',
    bottom: 'hsl(200, 0%, 68%)',
    line: 'hsl(60, 0%, 20%)',
    background: 'hsl(0, 0%, 100%)'
  }
]

0.upto(1) do |version|
  ref_colors = color_source[version]

  hex_size = [size(60)]
  x = [size(90 + padding)]
  y = [size(78 + padding)]
  color = [ref_colors[:top]]
  hex_size.push(size(60))
  x.push(size(70 * cos(60) * (1 + explode) + 90 + padding))
  y.push(size(70 * sin(60) * (1 + explode) + 78 + padding))
  color.push(ref_colors[:bottom])

  puts "<svg width=\"#{size(190 + padding * 2)}\" " +
       "height=\"#{size(196 + padding * 2)}\">"
  if (!transparent)
    puts "  <rect width=\"#{size(190 + padding * 2)}\" " +
         "height=\"#{size(196 + padding * 2)}\" " +
         "style=\"fill:#{ref_colors[:background]};stroke-width:1;stroke:#000;\" />"
  end

  (hex_size.length - 1).downto(0) do |n|
    points = []
    0.upto(5) do |p|
      angle = 60 * p + 30
      points.push("#{sin(angle) * hex_size[n] + x[n]}," +
                  "#{cos(angle) * hex_size[n] + y[n]}")
    end
    puts "  <polygon points=\"#{points.join(" ")}\" " +
         "style=\"fill:#{color[n]};\" />"
  end

  puts "  <line " +
       "x1=\"#{size(90 + padding - cos(60) * 90)}\" " +
       "y1=\"#{size(78 + padding - sin(60) * 90)}\" " +
       "x2=\"#{size(90 + padding + cos(60) * 135)}\" " +
       "y2=\"#{size(78 + padding + sin(60) * 135)}\" " +
       "style=\"stroke:#{ref_colors[:line]};stroke-width:#{line_size(4)}px\" />"

  puts "  <line " +
       "x1=\"#{size(90 + padding + cos(60) * 90)}\" " +
       "y1=\"#{size(78 + padding - sin(60) * 90)}\" " +
       "x2=\"#{size(90 + padding - cos(60) * 90)}\" " +
       "y2=\"#{size(78 + padding + sin(60) * 90)}\" " +
       "style=\"stroke:#{ref_colors[:line]};stroke-width:#{line_size(4)}px\" />"

  puts "  <line " +
       "x1=\"#{size(0 + padding)}\" y1=\"#{size(78 + padding)}\" " +
       "x2=\"#{size(180 + padding)}\" y2=\"#{size(78 + padding)}\" " +
       "style=\"stroke:#{ref_colors[:line]};stroke-width:#{line_size(4)}px\" />"

  puts "</svg>"
end
puts "</body>"
puts "</html>"
