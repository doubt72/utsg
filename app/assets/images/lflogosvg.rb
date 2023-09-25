font = "Play"

# This code is faintly ugly, but whatever.  Generates a logo in SVG
# at arbitrary sizes in color and reverse/greyscale

puts "<!DOCTYPE html>"
puts "<html>"
puts "<head>"
puts "  <link href=\"https://fonts.googleapis.com/css?family=#{font}\" " +
     "rel=\"stylesheet\">"
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

color_source = [
  {
    top: 'hsl(15, 60%, 40%)',
    middle: 'hsl(200, 60%, 22%)',
    bottom: 'hsl(200, 60%, 32%)',
    line: 'hsl(60, 80%, 80%)',
    text: 'hsl(60, 80%, 80%)',
    background: 'hsl(0, 0%, 0%)'
  },
  {
    top: 'hsl(15, 0%, 60%)',
    middle: 'hsl(200, 0%, 78%)',
    bottom: 'hsl(200, 0%, 68%)',
    line: 'hsl(60, 0%, 20%)',
    text: 'hsl(60, 0%, 20%)',
    background: 'hsl(0, 0%, 100%)'
  }
]

0.upto(1) do |version|
  ref_colors = color_source[version]

  hex_size = [size(60)]
  x = [size(120)]
  y = [size(120)]
  color = [ref_colors[:top]]
  1.upto(6) do |n|
    hex_size.push(size(30))
    angle = 60 * n
    offset = size(60 * sin(60) * (1 + explode * 1.3333))
    xloc = size(120 * cos(60) * (1 + explode) + 120)
    yloc = size(120 * sin(60) * (1 + explode) + 120)
    x.push(sin(angle) * offset + xloc)
    y.push(cos(angle) * offset + yloc)
    color.push(ref_colors[:middle])
  end
  hex_size.push(size(60))
  x.push(size(240 * cos(60) * (1 + explode) + 120))
  y.push(size(240 * sin(60) * (1 + explode) + 120))
  color.push(ref_colors[:bottom])

  puts "<svg width=\"#{size(880)}\" height=\"#{size(480)}\">"
  puts "  <rect width=\"#{size(880)}\" height=\"#{size(480)}\" " +
       "style=\"fill:#{ref_colors[:background]};stroke-width:1;stroke:#000;\" />"

  0.upto(hex_size.length - 1) do |n|
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
       "x1=\"#{size(120 - cos(60) * 100)}\" " +
       "y1=\"#{size(120 - sin(60) * 100)}\" " +
       "x2=\"#{size(120 + cos(60) * 380)}\" " +
       "y2=\"#{size(120 + sin(60) * 380)}\" " +
       "style=\"stroke:#{ref_colors[:line]};stroke-width:#{line_size(4)}px\" />"

  puts "  <line " +
       "x1=\"#{size(120 + cos(60) * 100)}\" " +
       "y1=\"#{size(120 - sin(60) * 100)}\" " +
       "x2=\"#{size(120 - cos(60) * 100)}\" " +
       "y2=\"#{size(120 + sin(60) * 100)}\" " +
       "style=\"stroke:#{ref_colors[:line]};stroke-width:#{line_size(4)}px\" />"

  puts "  <line " +
       "x1=\"#{size(20)}\" y1=\"#{size(120)}\" " +
       "x2=\"#{size(220)}\" y2=\"#{size(120)}\" " +
       "style=\"stroke:#{ref_colors[:line]};stroke-width:#{line_size(4)}px\" />"

  puts "  <text " +
       "x=\"#{size(120 + cos(60) * 118)}\" " +
       "y=\"#{size(120 + sin(60) * 118)}\" " +
       "style=\"fill:#{ref_colors[:text]};" +
       "font-family:'#{font}';font-size:#{size(128)}px;\">LENSFLARE</text>" 

  puts "  <text " +
       "x=\"#{size(115 + cos(60) * 246)}\" " +
       "y=\"#{size(120 + sin(60) * 246)}\" " +
       "style=\"fill:#{ref_colors[:text]};" +
       "font-family:'#{font}';font-size:#{size(128)}px;\">GAMES</text>" 

  puts "  <text " +
       "x=\"#{size(550 + cos(60) * 246)}\" " +
       "y=\"#{size(120 + sin(60) * 246)}\" " +
       "style=\"fill:#{ref_colors[:text]};" +
       "font-family:'#{font}';font-size:#{size(32)}px;\">LLC</text>" 

  puts "</svg>"
end
puts "</body>"
puts "</html>"
