import { Coordinate, Direction } from "./commonTypes"

export function alliedCodeToName(code: string): string {
  const lookup = [
    { name: "Soviet", code: "ussr" },
    { name: "American", code: "usa" },
    { name: "British", code: "uk" },
    { name: "French", code: "fra" },
    { name: "Allied", code: "alm" },
  ]

  for (const rec of lookup) {
    if (rec.code === code) {
      return rec.name
    }
  }

  return "Unknown"
}

export function axisCodeToName(code: string): string {
  const lookup = [
    { name: "German", code: "ger" },
    { name: "Italian", code: "ita" },
    { name: "Japanese", code: "jap" },
    { name: "Finnish", code: "fin" },
    { name: "Axis", code: "axm" },
  ]

  for (const rec of lookup) {
    if (rec.code === code) {
      return rec.name
    }
  }

  return "Unknown"
}

export function getFormattedDate(date: Date): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"    
  ]
  
  return `${months[date.getMonth() - 1]} ${date.getDate()}, ${date.getFullYear()}`
}

export function normalDir(dir: number): Direction {
  if (dir > 6) { return dir - 6 as Direction }
  if (dir < 1) { return dir + 6 as Direction }
  return dir as Direction
}

export function coordinateToLable(loc: Coordinate): string {
  // handle up to 52 for now, easy to extend if we need it, but at 1" hexes,
  // 52 would be a somewhat ludicrous seven 8.5x11" pages wide
  const letters = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
  ]
  letters.forEach(l => letters.push(l + l))
  return `${letters[loc.x]}${loc.y + 1}`
}

// This is the format we get from the backend, in UTC
export function nowUTCString(): string {
  // TODO: maybe move this to utilities
  const date = new Date()
  const year = date.getUTCFullYear()
  const mon = ("0" + date.getUTCMonth()).slice(-2)
  const day = ("0" + date.getUTCDate()).slice(-2)
  const hour = ("0" + date.getUTCHours()).slice(-2)
  const min = ("0" + date.getUTCMinutes()).slice(-2)
  const sec = ("0" + date.getUTCSeconds()).slice(-2)
  return `${year}-${mon}-${day}T${hour}:${min}:${sec}Z`
}
