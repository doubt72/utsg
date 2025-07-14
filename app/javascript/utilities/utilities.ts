import { Coordinate, Direction, Player } from "./commonTypes"

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
  if (dir > 6.5) { return dir - 6 as Direction }
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

export function coordinateToLabel(loc: Coordinate): string {
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

export function togglePlayer(p: Player) {
  return p === 1 ? 2 : 1
}

export function baseToHit(fp: number): number {
  if (fp <= 1) { return 20 }
  if (fp <= 2) { return 19 }
  if (fp <= 3) { return 18 }
  if (fp <= 4) { return 17 }
  if (fp <= 5) { return 16 }
  if (fp <= 6) { return 15 }
  if (fp <= 8) { return 14 }
  if (fp <= 10) { return 13 }
  if (fp <= 12) { return 12 }
  if (fp <= 16) { return 11 }
  if (fp <= 20) { return 10 }
  if (fp <= 24) { return 9 }
  if (fp <= 32) { return 8 }
  if (fp <= 40) { return 7 }
  if (fp <= 48) { return 6 }
  if (fp <= 64) { return 5 }
  if (fp <= 80) { return 4 }
  if (fp <= 96) { return 3 }
  if (fp <= 128) { return 2 }
  return 2
}

export function chance2D10(check: number): number {
  if (check > 19) { return 0 }
  if (check < 3) { return 99}
  return [97, 94, 90, 85, 79, 72, 64, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1][check - 3];
}

export function chanceD10x10(check: number): number {
  if (check > 99) { return 0 }
  if (check < 1) { return 100 }
  return [
    99, 97, 95, 92, 90, 86, 84, 80, 77, 73, 73, 69, 69, 67, 65, 62, 62, 58, 58, 54, 52, 52, 52, 48,
    47, 47, 45, 43, 43, 39, 39, 37, 37, 37, 35, 32, 32, 32, 32, 28, 28, 26, 26, 26, 24, 24, 24, 22,
    21, 19, 19, 19, 19, 17, 17, 15, 15, 15, 15, 13, 13, 13, 11, 10, 10, 10, 10, 10, 10, 8, 8, 6, 6,
    6, 6, 6, 6, 6, 6, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ][check - 1];
}

export function driftRoll(roll: number): number {
  if (roll > 6) { return roll - 3 }
  if (roll > 4) { return 3 }
  if (roll > 2) { return 2 }
  return 1
}

export function smokeRoll(roll: number): number {
  if (roll > 9) { return 4 }
  if (roll > 7) { return 3 }
  if (roll > 4) { return 2 }
  return 1
}

export const initiativeRolls = [8, 11, 14, 16, 18, 19, 20]

export function initiativeThreshold(value: number): number {
  return [0, ...initiativeRolls][value] ?? 0
}

export const stackLimit = 12
export const baseMorale = 15
export const titleName = "A Hex Too Far"
export const subtitleName = "Light Tactical Battle System"
