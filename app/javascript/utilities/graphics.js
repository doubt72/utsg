const counterRed = "#E00"
const markerYellow = "#EE0"

const xCorner = (map, x, i) => {
  return x - map.radius * Math.cos((i-0.5)/3 * Math.PI)
}

const yCorner = (map, y, i) => {
  return y - map.radius * Math.sin((i-0.5)/3 * Math.PI)
}

const baseHexCoords = (map, x, y) => {
  return [0, 1, 2, 3, 4, 5, 6].map(i => {
    return `${xCorner(map, x, i)},${yCorner(map, y, i)}`
  }).join(" ")
}

const baseCounterPath = (x, y) => {
  const corner = 4
  return [
    "M", x+corner, y,
    "L", x+80-corner, y, "A", corner, corner, 0, 0, 1, x+80, y+corner,
    "L", x+80, y+80-corner, "A", corner, corner, 0, 0, 1, x+80-corner, y+80,
    "L", x+corner, y+80, "A", corner, corner, 0, 0, 1, x, y+80-corner,
    "L", x, y+corner, "A", corner, corner, 0, 0, 1, x+corner, y,
  ].join(" ")
}

const roundedRectangle = (x, y, width, height) => {
  const corner = 10
  return [
    "M", x+corner, y,
    "L", x+width-corner, y, "A", corner, corner, 0, 0, 1, x+width, y+corner,
    "L", x+width, y+height-corner, "A", corner, corner, 0, 0, 1, x+width-corner, y+height,
    "L", x+corner, y+height, "A", corner, corner, 0, 0, 1, x, y+height-corner,
    "L", x, y+corner, "A", corner, corner, 0, 0, 1, x+corner, y,
  ].join(" ")
}

export {
  counterRed, markerYellow,
  baseHexCoords, baseCounterPath, roundedRectangle
}
