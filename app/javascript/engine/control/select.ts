import { Coordinate, CounterSelectionTarget } from "../../utilities/commonTypes"
import { hexDistance } from "../../utilities/utilities"
import DeployAction from "../actions/DeployAction"
import Counter from "../Counter"
import Game from "../Game"
import Map from "../Map"
import { gamePhaseType } from "../support/gamePhase"
import Unit from "../Unit"
import { leadershipRange } from "./fire"
import { stateType } from "./state/BaseState"

export default function select(
  map: Map, selection: CounterSelectionTarget, callback: () => void
) {
  const game = map.game
  if (selection.target.type === "reinforcement") { return }
  if (!selectable(map, selection)) { return }
  if (game?.gameState) { return game.gameState.select(selection, callback) }
  const x = selection.target.xy.x
  const y = selection.target.xy.y
  const id = selection.counter.target.id
  const counter = map.unitAtId(new Coordinate(x, y), id) as Counter
  map.clearOtherSelections(x, y, id)
  map.select(counter.unit)
  callback()
}

export function clearUnrangedSelection(game: Game) {
  if (game?.gameState?.type !== stateType.Fire) { return }
  const map = game.scenario.map
  const init = game.fireState.initialSelection[0]
  const leadership = leadershipRange(game)
  for (const sel of game.gameState.selection) {
    if (leadership === false) {
      const child = init.counter.unit.children[0]
      if (sel.id !== init.id && (!child || child.id !== sel.id)) {
        map.select(sel.counter.unit)
        removeStateSelection(game, sel.x, sel.y, sel.id)
      }
    } else {
      if (hexDistance(new Coordinate(init.x, init.y), new Coordinate(sel.x, sel.y)) > leadership) {
        map.select(sel.counter.unit)
        removeStateSelection(game, sel.x, sel.y, sel.id)
      }
    }
  }
}

export function removeStateSelection(game: Game, x: number, y: number, id: string) {
  if (game?.gameState?.selection) {
    const selection = game.gameState.selection.filter(s =>
      s.x !== x || s.y !== y || s.id !== id
    )
    game.gameState.selection = selection
  } else if (game.gameState) {
    const selection = game.gameState.selection.filter(s =>
      s.x !== x || s.y !== y || s.id !== id
    )
    game.gameState.selection = selection
  }
}

export function selectable(map: Map, selection: CounterSelectionTarget): boolean {
  if (map.debug) { return true }
  const game = map.game
  if (!game) { return false }
  const target = selection.counter.unit as Unit
  if (target.isFeature) { return false }
  if (game.gameState) { return game.gameState.selectable(selection) }
  const same = target.playerNation === game.currentPlayerNation
  if (game.phase === gamePhaseType.Main) {
    if (!same && !game.gameState) {
      if (game.playerOneName === game.playerTwoName) {
        game.addMessage("can't activate non-active player units")
      } else {
        game.addMessage("can't activate opponent's units")
      }
      return false
    }
    if (target.parent && target.parent.playerNation !== game.currentPlayerNation) { return false }
    return true
  } else if (game.phase === gamePhaseType.Deploy) {
    if (same && deployedThisTurn(game, target.id)) { return true }
    if (same) {
      game.addMessage("unit not deployed this turn")
    }
  }
  return false
}

function deployedThisTurn(game: Game, id: string): boolean {
  for (let i = game.lastActionIndex; i >= 0; i--) {
    const action = game.actions[i] as DeployAction
    if (action.undone) { continue }
    if (action.type === "phase") { break }
    if (action.type === "deploy" && id === action.rId) { return true }
  }
  return false
}
