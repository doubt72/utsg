import { Coordinate, Player, unitType } from "../../utilities/commonTypes"
import { roll2d10, sortReinforcementList } from "../../utilities/utilities"
import Game from "../Game"
import GameAction, { GameActionDiceResult, GameActionUnit } from "../GameAction"
import Hex from "../Hex"
import Unit from "../Unit"
import { deployHex } from "./deploy"
import { moraleModifiers } from "./fire"

export function randomDrop(game: Game) {
  const map = game.scenario.map
  const reinf = game.availableReinforcements(game.currentPlayer)[game.turn]
  const sorted = [...sortReinforcementList(Object.values(reinf))]
  const uTarget: GameActionUnit[] = []
  const units: Unit[] = []
  const wTarget: GameActionUnit[] = []
  const dice: GameActionDiceResult[] = []
  let total = 0
  for (const r of sorted) {
    const u = r.counter as Unit
    const count = u.type === unitType.Squad ? r.x * 2 : r.x
    total += count
    for (let i = 0; i < count; i++) {
      while(uTarget.length + wTarget.length < total) {
        if (![unitType.Leader, unitType.Squad, unitType.SupportWeapon].includes(u.type)) {
          // Currently only leaders, squads, and unmanned infantry weapons are supported
          throw "unsupported unit type for random drop"
        }
        if (u.canCarrySupport) {
          const x = Math.floor(Math.random() * map.width)
          const y = Math.floor(Math.random() * map.height)
          const loc = new Coordinate(x, y)
          const hex = map.hexAt(loc) as Hex
          if (!hex.terrain.move && !hex.road && !hex.railroad) { continue }
          if (!map.alliedSetupHexes || !map.axisSetupHexes) { break } // shouldn't ever happen
          const hexes = game.currentPlayer === 1 ? map.alliedSetupHexes[game.turn] : map.axisSetupHexes[game.turn]
          if (!deployHex(hexes, x, y)) { continue }
          if (map.victoryAt(loc) !== false) { continue }
          let check = false
          for (const t of uTarget) {
            if (t.x === x && t.y === y) {
              check = true
              break
            }
          }
          if (check) { continue }
          for (const c of map.countersAt(loc)) {
            if (c.hasUnit && c.unit.playerNation !== game.currentPlayerNation) {
              check = true
              break
            }
          }
          if (check) { continue }
          for (const h of map.hexNeighbors(loc)) {
            if (h) {
              for (const c of map.countersAt(h.coord)) {
                if (c.hasUnit && c.unit.playerNation !== game.currentPlayerNation) {
                  check = true
                  break
                }
              }
            }
            if (check) { break }
          }
          if (check) { continue }
          const mod = moraleModifiers(game, u, [], loc, false).mod - 2
          uTarget.push({ x, y, id: u.id, name: u.name, status: u.status, mod })
          units.push(u)
          dice.push({ result: roll2d10() })
          break
        } else {
          const tIndex = Math.floor(Math.random() * uTarget.length)
          const target = uTarget[tIndex]
          const ut = units[tIndex]
          if (!u.offBoard && ut.type === unitType.Leader) { continue }
          const weapon = { x: target.x, y: target.y, id: u.id, name: u.name, status: u.status }
          let check = false
          for (const w of wTarget) {
            if (w.x === weapon.x && w.y === weapon.y) {
              check = true
              break
            }
          }
          if (check) { continue }
          wTarget.push(weapon)
          break
        }
      }
    }
  }
  const action = new GameAction({
    user: game.currentUser, player: game.currentPlayer,
    data: {
      action: "random_drop", old_initiative: game.initiative,
      target: uTarget.concat(wTarget),
      dice_result: dice,
    }
  }, game)
  game.executeAction(action, false)
}

export function isRandomDrop(game: Game): boolean {
  return isRandomDropFor(game, game.turn, game.currentPlayer)
}

export function isRandomDropFor(game: Game, turn: number, player: Player): boolean {
  for (const sr of game.scenario.specialRules) {
    const lu = randomDropLookup(sr)
    if (lu) {
      if (lu[0] === player && lu[1] === turn) { return true }
      if (lu[0] === player && lu[1] === 0 && turn === 1) { return true }
    }
  }
  return false
}

export function randomDropLookup(rule: string): [Player, number] | false {
  if (!rule.includes("random_drop")) { return false }
  const player = rule.includes("allied") ? 1 : 2
  const turn = Number(rule.substring(player === 1 ? 19 : 17))
  return [player, turn]
}
