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
header2 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">'
# header += '<rect width="100" height="100" style="fill:rgba(0,0,0,0.2);" />'
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

def write_text(cx, cy, size, text, file, color = "#000", rotate = "")
  file.puts "<text x=\"#{cx}\" y=\"#{cy}\" #{rotate}" +
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

def write_ellipse(cx, cy, rx, ry, file, fill=true, color="#000")
  string = "<ellipse cx=\"#{cx}\" cy=\"#{cy}\" rx=\"#{rx}\" ry=\"#{ry}\""
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

def write_path_dash(path, file, line=6, color = "#000")
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
  file.puts string + '" style="fill:rgba(0,0,0,0);stroke-width:' + line.to_s +
    ";stroke:#{color};\" stroke-dasharray=\"3 6\" />"
end

File.open('leader.svg', 'w') do |file|
  file.puts header
  write_path([
    ["M", 10, 55], ["A", [40, 45], 0, [0, 1], [90, 55]], ["L", 10, 55],
    ["A", [45, 50], 0, [0, 1], [90, 55]],
  ], file, true)
  write_path([
    ["M", 77.5, 55], ["A", [27.5, 35], 0, [0, 1], [22.5, 55]],
  ], file, false)
  write_path([["M", 40, 40], ["L", 50, 50], ["L", 60, 40]], file, true, 3, "#DDD")
  # path = []
  # 0.upto(6) do |n|
  #   x = Math.sin(n * 144.0 / 180 * Math::PI) * -16 + 50
  #   y = Math.cos(n * 144.0 / 180 * Math::PI) * -16 + 35
  #   path.push([n == 0 ? "M" : "L", x, y])
  # end
  # write_path(path, file, true, 3, "#FFF")
  file.puts footer
end

# File.open('leader.svg', 'w') do |file|
#   file.puts header
#   path = []
#   0.upto(6) do |n|
#     x = Math.sin(n * 144.0 / 180 * Math::PI) * -30 + 50
#     y = Math.cos(n * 144.0 / 180 * Math::PI) * -30 + 50
#     path.push([n == 0 ? "M" : "L", x, y])
#   end
#   write_path(path, file)
#   path = []
#   0.upto(7) do |n|
#     x = Math.cos(n / 3.0 * Math::PI) * -45 + 50
#     y = Math.sin(n / 3.0 * Math::PI) * -45 + 50
#     path.push([n == 0 ? "M" : "L", x, y])
#   end
#   write_path(path, file, false)
#   # write_path([["M", 20, 15], ["L", 80, 45]], file, false)
#   # write_path([["M", 20, 35], ["L", 80, 65]], file, false)
#   # write_path([["M", 20, 55], ["L", 80, 85]], file, false)
#   # helmet_paths.each do |path|
#   #   write_path(scale_path(path, 0, 0, 1), file)
#   # end
#   file.puts footer
# end

File.open('crew.svg', 'w') do |file|
  file.puts header
  write_path([
    ["M", 10, 90], ["L", 10, 30], ["L", 90, 30], ["L", 90, 90], ["L", 10, 90], ["L", 10, 30],
  ], file, false)
  write_path([["M", 10, 90], ["L", 90, 30]], file, false)
  write_path([["M", 10, 30], ["L", 90, 90]], file, false)
  write_circle(50, 16, 10, file, false)
  write_text(50, 88, 1.33, "WPN", file)
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

File.open('tank-amp.svg', 'w') do |file|
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
  y1 = 90
  y2 = 80
  write_path([
    ["M", 15, y2], ["C", [22, y2], [18, y1], [25, y1]], ["C", [32, y1], [28, y2], [35, y2]],
    ["C", [42, y2], [38, y1], [45, y1]], ["C", [52, y1], [48, y2], [55, y2]],
    ["C", [62, y2], [58, y1], [65, y1]], ["C", [72, y1], [68, y2], [75, y2]],
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

File.open('spgmg.svg', 'w') do |file|
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
  write_circle(45, 50, 8, file, false)
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

File.open('spft.svg', 'w') do |file|
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
  write_path([
    ["M", 37.5, 98], ["L", 37.5, 42.5], ["A", [7.5, 7.5], 0, [0, 1], [52.5, 42.5]], ["L", 52.5, 47.5]
  ], file, false)
  file.puts footer
end

File.open('ac.svg', 'w') do |file|
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

File.open('ht.svg', 'w') do |file|
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
  write_path([["M", 75, 98], ["L", 15, 3]], file, false)
  file.puts footer
end

File.open('htgun.svg', 'w') do |file|
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
  write_path([["M", 75, 98], ["L", 15, 3]], file, false)
  write_circle(45, 50, 8, file)
  file.puts footer
end

File.open('htat.svg', 'w') do |file|
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
  write_path([["M", 75, 98], ["L", 15, 3]], file, false)
  write_path([["M", 35, 98], ["L", 45, 80], ["L", 55, 98]], file, false)
  file.puts footer
end

File.open('htmtr.svg', 'w') do |file|
  file.puts header
  write_path([
    ["M", 15, 3], ["L", 15, 98], ["L", 75, 98], ["L", 75, 3], ["L", 15, 3], ["L", 15, 98],
  ], file, false)
  write_path([["M", 35, 20], ["L", 45, 8], ["L", 55, 20]], file, false)
  write_path([["M", 45, 42], ["L", 45, 8]], file, false)
  write_path([
    ["M", 30, 42.5], ["A", [15, 15], 0, [0, 1], [60, 42.5]],
    ["L", 60, 57.5], ["A", [15, 15], 0, [0, 1], [30, 57.5]], ["L", 30, 42.5],
  ], file, false)
  write_path([["M", 15, 98], ["L", 75, 3]], file, false)
  write_path([["M", 75, 98], ["L", 15, 3]], file, false)
  write_circle(45, 50, 8, file, false)
  file.puts footer
end

File.open('htft.svg', 'w') do |file|
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
  write_path([["M", 75, 98], ["L", 15, 3]], file, false)
  write_path([
    ["M", 37.5, 98], ["L", 37.5, 42.5], ["A", [7.5, 7.5], 0, [0, 1], [52.5, 42.5]], ["L", 52.5, 47.5]
  ], file, false)
  file.puts footer
end

File.open('wreck.svg', 'w') do |file|
  file.puts header
  write_path([
    ["M", 15, 10], ["L", 15, 98], ["L", 75, 98], ["L", 75, 10], ["L", 15, 10], ["L", 15, 98],
  ], file, false, 3, "#C00")
  write_path([
    ["M", 37.5, 70], ["C", [32.6, 70], [15, 60], [45, 30]], ["C", [45, 50], [61, 42], [61, 60]],
    ["C", [61, 70], [55, 70], [52.5, 70]], ["C", [54, 67], [60, 55], [45, 45]],
    ["C", [45, 55], [36, 53], [35, 60]], ["C", [34, 65], [35, 67.5], [37.5, 70]],
    ["C", [32.6, 70], [15, 60], [45, 30]],
  ], file, false, 3, "#C00")
  write_text(95.5, 55, 1.9, "WRECK", file, "#C00", rotate='transform="rotate(270 95 54)" ')
  file.puts footer
end

File.open('tracked-hull.svg', 'w') do |file|
  file.puts header2
  write_path([
    ["M", 65, 35], ["L", 75, 25], ["A", [15, 15], 0, [0, 1], [85, 20]],
    ["L", 115, 20], ["A", [15, 15], 0, [0, 1], [125, 25]], ["L", 135, 35],
    ["L", 135, 165], ["L", 125, 175], ["A", [15, 15], 0, [0, 1], [115, 180]],
    ["L", 85, 180], ["A", [15, 15], 0, [0, 1], [75, 175]], ["L", 65, 165],
    ["L", 65, 35], ["L", 75, 25]
  ], file, false, 4.5)
  write_path([["M", 100, 55], ["L", 100, 30]], file, false)
  write_path([["M", 85, 45], ["L", 100, 30], ["L", 115, 45]], file, false)
  write_path([
    ["M", 135, 20], ["L", 160, 20], ["L", 160, 180], ["L", 135, 180], ["L", 135, 20], ["L", 160, 20]
  ], file, false, 4.5)
  write_path([
    ["M", 65, 20], ["L", 40, 20], ["L", 40, 180], ["L", 65, 180], ["L", 65, 20], ["L", 40, 20]
  ], file, false, 4.5)
  0.upto(10) do |i|
    beg = 28.75
    diff = 14.25
    write_path([["M", 40, beg+i*diff], ["L", 65, beg+i*diff]], file, false)
    write_path([["M", 135, beg+i*diff], ["L", 160, beg+i*diff]], file, false)
  end
  file.puts footer
end

File.open('wheeled-hull.svg', 'w') do |file|
  file.puts header2
  write_path([
    ["M", 60, 40], ["A", [20, 20], 0, [0, 1], [80, 20]],
    ["L", 120, 20], ["A", [20, 20], 0, [0, 1], [140, 40]],
    ["L", 140, 160], ["A", [20, 20], 0, [0, 1], [120, 180]],
    ["L", 80, 180], ["A", [20, 20], 0, [0, 1], [60, 160]],
    ["L", 60, 40], ["A", [20, 20], 0, [0, 1], [80, 20]],
  ], file, false, 4.5)
  write_path([["M", 100, 55], ["L", 100, 30]], file, false)
  write_path([["M", 85, 45], ["L", 100, 30], ["L", 115, 45]], file, false)
  [
    [60, -8, 38], [140, 8, 38],
    [60, -8, 96], [140, 8, 96],
    [60, -8, 130], [140, 8, 130],
  ].each do |set|
    x = set[0]
    dx = set[1]
    y = set[2]
    write_path([
      ["M", x, y], ["A", [8, 8], 0, [0, dx > 0 ? 1 : 0], [x+dx, y+8]],
      ["L", x+dx, y+24], ["A", [8, 8], 0, [0, dx > 0 ? 1 : 0], [x, y+32]],
    ], file, true)
  end
  file.puts footer
end

File.open('fire.svg', 'w') do |file|
  file.puts header
  write_path([
    ["M", 35, 90], ["C", [25.2, 90], [-10, 70], [50, 10]], ["C", [50, 50], [82, 34], [82, 70]],
    ["C", [82, 90], [70, 90], [65, 90]], ["C", [68, 84], [80, 60], [50, 40]],
    ["C", [50, 60], [32, 56], [30, 70]], ["C", [28, 80], [30, 85], [35, 90]],
    ["C", [25.2, 90], [-10, 70], [50, 10]],
  ], file, false, 3, "#C00")
  file.puts footer
end

File.open('smoke.svg', 'w') do |file|
  file.puts header
  write_path([
    ["M", 10, 25], ["A", [10, 10], 0, [0, 1], [30, 20]], ["A", [10, 10], 0, [0, 1], [50, 15]],
    ["A", [10, 10], 0, [0, 1], [70, 20]], ["A", [10, 10], 0, [0, 1], [90, 25]],
    ["M", 20, 40], ["A", [10, 10], 0, [0, 1], [40, 35]], ["A", [10, 10], 0, [0, 1], [60, 35]],
    ["A", [10, 10], 0, [0, 1], [80, 40]],
    ["M", 10, 60], ["A", [10, 10], 0, [0, 1], [30, 55]], ["A", [10, 10], 0, [0, 1], [50, 50]],
    ["A", [10, 10], 0, [0, 1], [70, 55]], ["A", [10, 10], 0, [0, 1], [90, 60]],
    ["M", 20, 75], ["A", [10, 10], 0, [0, 1], [40, 70]], ["A", [10, 10], 0, [0, 1], [60, 70]],
    ["A", [10, 10], 0, [0, 1], [80, 75]],
    ["M", 30, 90], ["A", [10, 10], 0, [0, 1], [50, 85]], ["A", [10, 10], 0, [0, 1], [70, 90]],
  ], file, false)
  file.puts footer
end

File.open('wire.svg', 'w') do |file|
  file.puts header
  path = [
    ["M", 14, 90], ["A", [40, 40], 0, [0, 0], [65, 50]], ["A", [25, 40], 0, [0, 0], [35, 10]],
    ["A", [25, 40], 0, [0, 0], [15, 50]], ["A", [30, 40], 0, [0, 0], [75, 50]],

    ["A", [25, 40], 0, [0, 0], [45, 10]], ["A", [25, 40], 0, [0, 0], [25, 50]],
    ["A", [30, 40], 0, [0, 0], [85, 50]],
    
    ["A", [25, 40], 0, [0, 0], [55, 10]], ["A", [25, 40], 0, [0, 0], [35, 50]],
    ["A", [40, 40], 0, [0, 0], [86, 90]],
  ]
  write_path(path, file, false)
  write_path_dash(path, file)
  file.puts footer
end

File.open('mines.svg', 'w') do |file|
  file.puts header
  write_ellipse(50, 42.5, 40, 16, file, false)
  write_path([
    ["M", 90, 42.5], ["L", 90, 57.5], ["A", [40, 16], 0, [0, 1], 10, 57.5], ["L", 10, 42.5],
  ], file, false)
  write_ellipse(50, 42.5, 25, 10, file, false)
  write_ellipse(50, 42.5, 7.5, 3, file, true)
  file.puts footer
end

File.open('foxhole.svg', 'w') do |file|
  file.puts header
  write_ellipse(50, 50, 45, 16, file, true, "#AAA")
  write_ellipse(50, 50, 45, 16, file, false)
  # write_path([
  #   ["M", 5, 50], ["A", [45, 20], 0, [0, 0], 95, 50], ["L", 5, 50],
  # ], file, true)
  file.puts footer
end

File.open('bunker.svg', 'w') do |file|
  file.puts header
  path = []
  0.upto(6) do |i|
    x0 = 50 + 48 * Math.sin((i-0.5)/3.0 * Math::PI)
    x1 = 50 + 48 * Math.sin((i+0.5)/3.0 * Math::PI)
    x2 = 50 + 48 * Math.sin((i+1.5)/3.0 * Math::PI)
    y0 = 50 + 48 * Math.cos((i-0.5)/3.0 * Math::PI)
    y1 = 50 + 48 * Math.cos((i+0.5)/3.0 * Math::PI)
    y2 = 50 + 48 * Math.cos((i+1.5)/3.0 * Math::PI)
    path.push(["M", (x0+x1*2)/3, (y0+y1*2)/3])
    path.push(["L", x1, y1])
    path.push(["L", (x1*2+x2)/3, (y1*2+y2)/3])
  end
  write_path(path, file, false, 6)
  write_path([
    ["M", 50, 50],
    ["L", 50, 2.5],
  ], file, false)

  # write_path([
  #   ["M", 5, 70], ["L", 30, 30], ["L", 70, 30], ["L", 95, 70], ["L", 5, 70], ["L", 30, 30],
  #   ["M", 40, 45], ["L", 60, 45]
  # ], file, false)
  file.puts footer
end

# File.open('test.svg', 'w') do |file|
#   file.puts header
#   path = []
#   letter = "M"
#   radius = 2.0
#   0.upto(8) do |n|
#     path.push([
#       letter,
#       ((radius * Math.cos(n/4.0 * Math::PI) + 2) * 100).to_i / 100.0,
#       ((radius * Math.sin(n/4.0 * Math::PI) + 2) * 100).to_i / 100.0
#     ])
#     letter = "L"
#     path.push([
#       "L",
#       ((radius*0.75 * Math.cos((n/4.0 + 1/8.0) * Math::PI) + 2) * 100).to_i / 100.0,
#       ((radius*0.75 * Math.sin((n/4.0 + 1/8.0) * Math::PI) + 2) * 100).to_i / 100.0
#     ])
#   end
#   write_path(path, file)
#   file.puts footer
# end

