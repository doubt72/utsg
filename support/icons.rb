helmet_paths = [
  [
    ['M', 14, 50],
    ['C', [22, 38], [74, 38], [86, 50]],
    ['C', [86, 0], [14, 0], [14, 50]],
  ],
  [
    ['M', 20, 52],
    ['C', [24, 43], [72, 43], [80, 52]],
    ['C', [80, 100], [20, 100], [20, 52]],
  ],
]

header = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
# header += '<rect width="100" height="100" style="fill:rgba(0,0,0,0.1);" />'
footer = '</svg>'

def scale_path(path, xoffset, yoffset, scale)
  path.map do |section|
    if ["M", "L"].include?(section[0])
      [section[0], section[1]*scale + xoffset, section[2]*scale + yoffset]
    else
      section.map do |segment|
        if segment == "C"
          "C"
        else
          [segment[0]*scale + xoffset, segment[1]*scale + yoffset]
        end
      end
    end
  end
end

def write_text(cx, cy, size, text, file, color = "#000")
  file.puts "<text x=\"#{cx}\" y=\"#{cy}\" " +
    "style=\"fill:#{color};font-size:#{size}em;font-family:monospace;" +
    "text-anchor:middle;\">#{text}</text>"
end


def write_circle(cx, cy, radius, file, fill=true, color="#000")
  string = "<circle cx=\"#{cx}\" cy=\"#{cy}\" r=\"#{radius}\""
  if fill
    file.puts string + " style=\"fill:#{color};\" />"
  else
    file.puts string + " style=\"fill:rgba(0,0,0,0);stroke-width:3;stroke:#{color};\" />"
  end
end

def write_path(path, file, fill=true, line=3, color = "#000")
  string = '<path d="'
  string += path.map do |section|
    section.map do |segment|
      if segment.is_a? Array
        segment.map { |n| n.to_s }.join(',')
      else
        segment
      end
    end.join(' ')
  end.join(' ')
  if fill
    file.puts string + "\" style=\"fill:#{color};\" />"
  else
    file.puts string + '" style="fill:rgba(0,0,0,0);stroke-width:' + line.to_s +
      ";stroke:#{color};\" />"
  end
end

File.open('leader.svg', 'w') do |file|
  file.puts header
  # write_path([["M", 20, 15], ["L", 80, 45]], file, false)
  # write_path([["M", 20, 35], ["L", 80, 65]], file, false)
  # write_path([["M", 20, 55], ["L", 80, 85]], file, false)
  path = []
  0.upto(6) do |n|
    x = Math.sin(n * 144.0 / 180 * Math::PI) * -30 + 50
    y = Math.cos(n * 144.0 / 180 * Math::PI) * -30 + 50
    path.push([n == 0 ? "M" : "L", x, y])
  end
  write_path(path, file)
  path = []
  0.upto(7) do |n|
    x = Math.cos(n / 3.0 * Math::PI) * -45 + 50
    y = Math.sin(n / 3.0 * Math::PI) * -45 + 50
    path.push([n == 0 ? "M" : "L", x, y])
  end
  write_path(path, file, false)
  # helmet_paths.each do |path|
  #   write_path(scale_path(path, 0, 0, 1), file)
  # end
  file.puts footer
end

File.open('crew.svg', 'w') do |file|
  file.puts header
  write_path([
    ["M", 10, 90], ["L", 10, 30], ["L", 90, 30], ["L", 90, 90], ["L", 10, 90], ["L", 10, 30],
  ], file, false)
  write_path([["M", 10, 90], ["L", 90, 30]], file, false)
  write_path([["M", 10, 30], ["L", 90, 90]], file, false)
  write_circle(50, 16, 10, file, false)
  write_text(50, 87, 1.5, "WPN", file)
  # helmet_paths.each do |path|
  #   write_path(scale_path(path, 0, 0, 0.625), file)
  # end
  # helmet_paths.each do |path|
  #   write_path(scale_path(path, 37.5, 37.5, 0.625), file)
  # end
  file.puts footer
end

File.open('team.svg', 'w') do |file|
  file.puts header
  write_path([
    ["M", 10, 90], ["L", 10, 30], ["L", 90, 30], ["L", 90, 90], ["L", 10, 90], ["L", 10, 30],
  ], file, false)
  write_path([["M", 10, 90], ["L", 90, 30]], file, false)
  write_path([["M", 10, 30], ["L", 90, 90]], file, false)
  write_circle(50, 16, 10, file, false)
  # helmet_paths.each do |path|
  #   write_path(scale_path(path, 0, -2.5, 0.575), file)
  # end
  # helmet_paths.each do |path|
  #   write_path(scale_path(path, 40, 21.25, 0.575), file)
  # end
  # helmet_paths.each do |path|
  #   write_path(scale_path(path, 0, 45, 0.575), file)
  # end
  file.puts footer
end

File.open('squad.svg', 'w') do |file|
  file.puts header
  write_path([
    ["M", 10, 90], ["L", 10, 30], ["L", 90, 30], ["L", 90, 90], ["L", 10, 90], ["L", 10, 30],
  ], file, false)
  write_path([["M", 10, 90], ["L", 90, 30]], file, false)
  write_path([["M", 10, 30], ["L", 90, 90]], file, false)
  write_circle(50, 16, 12, file)
  # helmet_paths.each do |path|
  #   write_path(scale_path(path, -2.5, -2.5, 0.45), file)
  # end
  # helmet_paths.each do |path|
  #   write_path(scale_path(path, 27.5, 17.5, 0.45), file)
  # end
  # helmet_paths.each do |path|
  #   write_path(scale_path(path, 57.5, -2.5, 0.45), file)
  # end
  # helmet_paths.each do |path|
  #   write_path(scale_path(path, -2.5, 37.5, 0.45), file)
  # end
  # helmet_paths.each do |path|
  #   write_path(scale_path(path, 27.5, 57.5, 0.45), file)
  # end
  # helmet_paths.each do |path|
  #   write_path(scale_path(path, 57.5, 37.5, 0.45), file)
  # end
  file.puts footer
end

File.open('mg.svg', 'w') do |file|
  file.puts header
  write_path([["M", 50, 80], ["L", 50, 20]], file, false)
  write_path([["M", 35, 40], ["L", 50, 20], ["L", 65, 40]], file, false)
  write_path([["M", 35, 80], ["L", 65, 80]], file, false)
  file.puts footer
end

File.open('flamethrower.svg', 'w') do |file|
  file.puts header
  write_path([
    ["M", 40, 80], ["L", 40, 30], ["A", [10, 10], 0, [0, 1], [60, 30]], ["L", 60, 40]
  ], file, false)
  write_path([["M", 30, 80], ["L", 60, 80]], file, false)
  file.puts footer
end

File.open('explosive.svg', 'w') do |file|
  file.puts header
  sqrt = 30/Math.sqrt(2)
  write_path([["M", 50, 30], ["L", 50, 45]], file, false)
  write_path([["M", 50 + sqrt, 60 - sqrt], ["L", 50 + sqrt/2, 60 - sqrt/2]], file, false)
  write_path([["M", 50 - sqrt, 60 - sqrt], ["L", 50 - sqrt/2, 60 - sqrt/2]], file, false)
  write_circle(50, 60, 15, file, false)
  file.puts footer
end

File.open('rocket.svg', 'w') do |file|
  file.puts header
  write_path([["M", 35, 30], ["L", 50, 10], ["L", 65, 30]], file, false)
  write_path([["M", 35, 45], ["L", 50, 25], ["L", 65, 45]], file, false)
  write_path([["M", 50, 25], ["L", 50, 70], ["L", 65, 90]], file, false)
  write_path([["M", 50, 70], ["L", 35, 90]], file, false)
  file.puts footer
end

File.open('antitank.svg', 'w') do |file|
  file.puts header
  write_path([["M", 50, 10], ["L", 50, 70], ["L", 65, 90]], file, false)
  write_path([["M", 50, 70], ["L", 35, 90]], file, false)
  file.puts footer
end

File.open('mortar.svg', 'w') do |file|
  file.puts header
  write_path([["M", 50, 70], ["L", 50, 20]], file, false)
  write_path([["M", 35, 40], ["L", 50, 20], ["L", 65, 40]], file, false)
  write_circle(50, 78, 8, file, false)
  file.puts footer
end

File.open('gun.svg', 'w') do |file|
  file.puts header
  write_path([["M", 50, 10], ["L", 50, 74]], file, false)
  write_circle(50, 82, 8, file, false)
  write_path([["M", 65, 30], ["L", 65, 65]], file, false)
  write_path([["M", 35, 30], ["L", 35, 65]], file, false)
  file.puts footer
end

File.open('atgun.svg', 'w') do |file|
  file.puts header
  write_path([["M", 50, 10], ["L", 50, 70], ["L", 65, 90]], file, false)
  write_path([["M", 50, 70], ["L", 35, 90]], file, false)
  write_path([["M", 65, 30], ["L", 65, 65]], file, false)
  write_path([["M", 35, 30], ["L", 35, 65]], file, false)
  file.puts footer
end

File.open('radio.svg', 'w') do |file|
  file.puts header
  write_path([
    ["M", 20, 40], ["L", 30, 30], ["L", 40, 40], ["L", 50, 30], ["L", 60, 40],
    ["L", 70, 30], ["L", 80, 40],
  ], file, false)
  write_path([["M", 50, 30], ["L", 50, 80]], file, false)
  file.puts footer
end

File.open('tank.svg', 'w') do |file|
  file.puts header
  write_path([
    ["M", 15, 3], ["L", 15, 98], ["L", 75, 98], ["L", 75, 3], ["L", 15, 3], ["L", 15, 98],
  ], file, false)
  write_path([["M", 35, 15], ["L", 45, 3], ["L", 55, 15]], file, false, 2)
  write_path([["M", 45, 20], ["L", 45, 3]], file, false, 2)
  write_path([
    ["M", 30, 42.5], ["A", [15, 15], 0, [0, 1], [60, 42.5]],
    ["L", 60, 57.5], ["A", [15, 15], 0, [0, 1], [30, 57.5]], ["L", 30, 42.5],
  ], file, false)
  file.puts footer
end

File.open('spg.svg', 'w') do |file|
  file.puts header
  write_path([
    ["M", 15, 3], ["L", 15, 98], ["L", 75, 98], ["L", 75, 3], ["L", 15, 3], ["L", 15, 98],
  ], file, false)
  write_path([["M", 35, 15], ["L", 45, 3], ["L", 55, 15]], file, false, 2)
  write_path([["M", 45, 20], ["L", 45, 3]], file, false, 2)
  write_path([
    ["M", 30, 42.5], ["A", [15, 15], 0, [0, 1], [60, 42.5]],
    ["L", 60, 57.5], ["A", [15, 15], 0, [0, 1], [30, 57.5]], ["L", 30, 42.5],
  ], file, false)
  write_circle(45, 50, 8, file)
  file.puts footer
end

File.open('spat.svg', 'w') do |file|
  file.puts header
  write_path([
    ["M", 15, 3], ["L", 15, 98], ["L", 75, 98], ["L", 75, 3], ["L", 15, 3], ["L", 15, 98],
  ], file, false)
  write_path([["M", 35, 15], ["L", 45, 3], ["L", 55, 15]], file, false, 2)
  write_path([["M", 45, 20], ["L", 45, 3]], file, false, 2)
  write_path([
    ["M", 30, 42.5], ["A", [15, 15], 0, [0, 1], [60, 42.5]],
    ["L", 60, 57.5], ["A", [15, 15], 0, [0, 1], [30, 57.5]], ["L", 30, 42.5],
  ], file, false)
  write_path([["M", 15, 98], ["L", 45, 50], ["L", 75, 98]], file, false)
  file.puts footer
end

File.open('car.svg', 'w') do |file|
  file.puts header
  write_path([
    ["M", 15, 3], ["L", 15, 98], ["L", 75, 98], ["L", 75, 3], ["L", 15, 3], ["L", 15, 98],
  ], file, false)
  write_path([["M", 35, 15], ["L", 45, 3], ["L", 55, 15]], file, false, 2)
  write_path([["M", 45, 20], ["L", 45, 3]], file, false, 2)
  write_path([
    ["M", 30, 42.5], ["A", [15, 15], 0, [0, 1], [60, 42.5]],
    ["L", 60, 57.5], ["A", [15, 15], 0, [0, 1], [30, 57.5]], ["L", 30, 42.5],
  ], file, false)
  write_path([["M", 15, 98], ["L", 75, 3]], file, false)
  write_circle(58, 89.5, 5, file, false)
  write_circle(45, 89.5, 5, file, false)
  write_circle(32, 89.5, 5, file, false)
  file.puts footer
end

File.open('wreck.svg', 'w') do |file|
  file.puts header
  write_path([
    ["M", 20, 10], ["L", 20, 98], ["L", 80, 98], ["L", 80, 10], ["L", 20, 10], ["L", 20, 98],
  ], file, false, 3, "red")
  write_path([
    ["M", 42.5, 60], ["C", [37.6, 60], [20, 50], [50, 20]], ["C", [50, 40], [66, 32], [66, 50]],
    ["C", [66, 60], [60, 60], [57.5, 60]], ["C", [59, 57], [65, 45], [50, 35]],
    ["C", [50, 45], [41, 43], [40, 50]], ["C", [39, 55], [40, 57.5], [42.5, 60]],
    ["C", [37.6, 60], [20, 50], [50, 20]],
  ], file, false, 3, "red")
  write_text(50, 93, 2.5, "WRECK", file, "#000")
  file.puts footer
end

