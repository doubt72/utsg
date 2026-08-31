import { Coordinate } from "../../utilities/commonTypes"
import Game, { SpottingStatus } from "../Game"
import Unit from "../Unit"

export function addSpotting(
  game: Game, loc: Coordinate, unit: Unit, sponson: boolean, ref?: string
) {
  let letter = ref ? ref : nextLetter(game.spottingStatus.map(s => s.ref))
  if (!sponson && unit.spotting) {
    letter = unit.spotting
  } else if (sponson && unit.sponsonSpotting) {
    letter = unit.sponsonSpotting
  }
  for (const s of game.spottingStatus) {
    if (s.ref === letter) {
      if (loc.x === s.target.x && loc.y === s.target.y) {
        s.level = 2
      } else {
        s.level = 1
        s.target = loc
      }
      return
    }
  }
  game.spottingStatus.push({ ref: letter, target: loc, level: 1, unit, sponson })
  if (sponson) {
    unit.sponsonSpotting = letter
  } else {
    unit.spotting = letter
  }
}

export function removeSpotting(game: Game, ref: string) {
  game.spottingStatus = game.spottingStatus.filter(s => {
    const remove = s.ref === ref
    if (remove) {
      if (s.sponson) {
        s.unit.sponsonSpotting = undefined
      } else {
        s.unit.spotting = undefined
      }
    }
    return !remove
  })
}

export function dataForSpotting(game: Game, ref: string): SpottingStatus | undefined {
  for (const s of game.spottingStatus) {
    if (s.ref === ref) { return s }
  }
  return undefined
}

function nextLetter(used: string[]): string {
  // Again, probably not more than 52 targeted weapons in a scenario
  const letters = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
  ]
  for (const l of letters) {
    if (!used.includes(l)) { return l }
  }
  return "whoops"
}