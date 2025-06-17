import { Coordinate, Direction } from "./commonTypes"

export function alliedCodeToName(code: string): string {
  const lookup = [
    { name: "Soviet", code: "ussr" },
    { name: "American", code: "usa" },
    { name: "Brazilian", code: "bra" },
    { name: "British", code: "uk" },
    { name: "Canadian", code: "can" },
    { name: "Australian", code: "aus" },
    { name: "New Zealand", code: "nz" },
    { name: "Indian", code: "ind" },
    { name: "South African", code: "sa" },
    { name: "French", code: "fra" },
    { name: "Free French", code: "frf" },
    { name: "Chinese", code: "chi" },
    { name: "Polish", code: "pol" },
    { name: "Greek", code: "gre" },
    { name: "Norwegian", code: "nor" },
    { name: "Belgian", code: "bel" },
    { name: "Dutch", code: "dut" },
    { name: "Yugoslavian", code: "yug" },
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
    { name: "Hungarian", code: "hun" },
    { name: "Bulgarian", code: "bul" },
    { name: "Romanian", code: "rom" },
    { name: "Slovakian", code: "slo" },
    { name: "Croatian", code: "cro" },
  ]

  for (const rec of lookup) {
    if (rec.code === code) {
      return rec.name
    }
  }

  return "Unknown"
}

export function getFormattedDate(date: [number, number, number]): string {
  const [year, month, day] = date
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"    
  ]
  
  return `${months[month - 1]} ${day}, ${year}`
}

export function normalDir(dir: number): Direction {
  if (dir > 6) { return dir - 6 as Direction }
  if (dir < 1) { return dir + 6 as Direction }
  return dir as Direction
}

export function hexDistance(hex0: Coordinate, hex1: Coordinate): number {
  // Transform X into axial coordinates
  const x00 = hex0.x - Math.floor(hex0.y / 2);
  const x11 = hex1.x - Math.floor(hex1.y / 2);
  // Add a cubic component
  const z0 = -x00 - hex0.y;
  const z1 = -x11 - hex1.y;
  // And now things are simple
  return Math.max(Math.abs(x00 - x11), Math.abs(hex0.y - hex1.y), Math.abs(z0 - z1));
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

export function rolld10(): number {
  return Math.floor(Math.random() * 10) + 1
}

export function roll2d10(): number {
  return rolld10() + rolld10()
}

export function rolld10x10(): number {
  return rolld10() * rolld10()
}

export function smokeRoll(roll: number): number {
  if (roll > 9) { return 4 }
  if (roll > 7) { return 3 }
  if (roll > 4) { return 2 }
  return 1
}

export const stackLimit = 15
