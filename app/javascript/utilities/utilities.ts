import Feature from "../engine/Feature"
import Game from "../engine/Game"
import { ReinforcementItem } from "../engine/Scenario"
import Unit from "../engine/Unit"
import { Coordinate, Direction, featureType, Player } from "./commonTypes"

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

export function playerForNation(unit: Unit, game: Game): Player {
  return unit.playerNation === game.playerOneNation ? 1 : 2
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

export type DiceResult = {
  result: number,
  components: number[],
  type: string,
}

export function rolld6(): DiceResult {
  const roll = Math.floor(Math.random() * 6) + 1
  return { result: roll, components: [roll], type: "d6" }
}

export function rolld10(): DiceResult {
  const roll = Math.floor(Math.random() * 10) + 1
  return { result: roll, components: [roll], type: "d10" }
}

export function roll2d10(): DiceResult {
  const one = rolld10().result
  const two = rolld10().result
  return { result: one + two, components: [one, two], type: "2d10" }
}

export function rolld10x10(): DiceResult {
  const one = rolld10().result
  const two = rolld10().result
  return { result: one * two, components: [one, two], type: "d10x10" }
}

export function rollCC(fp: number): DiceResult {
  const one = rolld10().result
  const two = rolld10().result
  const result = (fp * 2 + one) * two
  return { result, components: [fp, one, two], type: "CC" }
}

export function otherPlayer(p: Player) {
  return p === 1 ? 2 : 1
}

export function baseToHit(fp: number): number {
  if (fp < 2) { return 18 }
  if (fp < 3) { return 17 }
  if (fp < 4) { return 16 }
  if (fp < 5) { return 15 }
  if (fp < 6) { return 14 }
  if (fp < 8) { return 13 }
  if (fp < 10) { return 12 }
  if (fp < 12) { return 11 }
  if (fp < 16) { return 10 }
  if (fp < 20) { return 9 }
  if (fp < 24) { return 8 }
  if (fp < 32) { return 7 }
  if (fp < 40) { return 6 }
  if (fp < 48) { return 5 }
  if (fp < 64) { return 4 }
  if (fp < 80) { return 3 }
  if (fp < 96) { return 2 }
  if (fp < 128) { return 1 }
  return 0
}

export function chanceCC(fp: number, player: string, max: number): [number, string][] {
  const checks: { [index: number]: number } = {}
  for (let i = 1; i <= 10; i++) {
    for (let j = 1; j <= 10; j++) {
      const check = (2 * fp + i) * j
      const succ = Math.floor(check / 80)
      const hits = succ > max ? max : succ
      checks[hits] = checks[hits] === undefined ? 1 : checks[hits] + 1
    }
  }
  const results = Object.keys(checks)
  const rc: [number, string][] = []
  for (const r of results) {
    const num = Number.parseInt(r)
    rc.push(
      [checks[num], `${player} player takes ${num > 0 ? r : "no"} ` +
        `hit${num !== 1 ? "s" : ""}${num === max ? " (all)" : ""}`]
    )
  }
  return rc.sort((a, b) => b[0] - a[0])
}

export function chance2D10(check: number): number {
  if (check > 19) { return 0 }
  if (check < 3) { return 99}
  return [97, 94, 90, 85, 79, 72, 64, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1][check - 3];
}

export function exact2D10(check: number): number {
  if (check > 20 || check < 2) { return 0 }
  return 10 - Math.abs(check - 11)
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
  if (roll > 8) { return roll - 5 }
  if (roll > 6) { return 3 }
  if (roll > 3) { return 2 }
  return 1
}

export function smokeRoll(roll: number): number {
  if (roll > 8) { return 4 }
  if (roll > 5) { return 3 }
  return 2
}

export function smokeReduceRoll(roll: number): number {
  if (roll > 8) { return 2 }
  if (roll > 2) { return 1 }
  return 0
}

export const initiativeRolls = [8, 11, 14, 16, 18, 19, 20]

export function initiativeThreshold(value: number): number {
  return [0, ...initiativeRolls][value] ?? 0
}

export function counterKey(c: Unit | Feature): string {
  let extra = c.type === "ldr" ? `${c.baseMorale}-${c.leadership}` : c.type
  const f = c as Feature
  const u = c as Unit
  if (c.name === "Crew") { extra = `${u.currentGunHandling}` }
  if (c.name === "Sniper") { extra = `${f.sniperRoll}` }
  return `${c.isFeature ? "feature" : c.nation}-${c.name.toLowerCase()}-${extra}`
}

export function sortReinforcementList(list: ReinforcementItem[]): ReinforcementItem[]  {
  const sortValues = (unit: Unit | Feature): number => {
    if (unit.isFeature && unit.type === featureType.Sniper) { return 16 }
    if (unit.isFeature && unit.type === featureType.Wire) { return 15 }
    if (unit.isFeature && unit.type === featureType.Mines) { return 14 }
    if (unit.isFeature) { return 13 }
    const u = unit as Unit
    return {
      ldr: 1, sqd: 2, tm: 3, sw: 4, gun: 5, tank: 6, spg: 7, ac: 8, ht: 9, truck: 10,
      cav: 11, other: 12,
    }[u.type]
  }

  return list.sort((a, b) => {
    let rc = sortValues(a.counter) - sortValues(b.counter)
    if (rc === 0 && !a.counter.isFeature) {
      const au = a.counter as Unit
      const bu = b.counter as Unit
      if (rc === 0) { rc = bu.size - au.size }
      if (rc === 0) { rc = bu.baseFirepower - au.baseFirepower}
      if (rc === 0) { rc = bu.closeCombatFirepower - au.closeCombatFirepower}
      if (rc === 0) { rc = bu.baseMorale - au.baseMorale }
      if (rc === 0) { rc = bu.leadership - au.leadership}
    }
    return rc
  })
}

export const stackLimit = 12
export const baseMorale = 15
export const baseRally = 12
export const titleName = "A Hex Too Far"
export const subtitleName = "Light Tactical Battle System"
export const serverVersion = "0.40"
