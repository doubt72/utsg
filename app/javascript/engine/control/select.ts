import { Coordinate, CounterSelectionTarget } from "../../utilities/commonTypes"
import { hexDistance } from "../../utilities/utilities"
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
  counter.unit.select()
  callback()
}

export function clearUnrangedSelection(game: Game) {
  if (game?.gameState?.type !== stateType.Fire) { return }
  const init = game.fireState.initialSelection[0]
  const leadership = leadershipRange(game)
  for (const sel of game.gameState.selection) {
    if (leadership === false) {
      const child = init.counter.unit.children[0]
      if (sel.id !== init.id && (!child || child.id !== sel.id)) {
        sel.counter.unit.select()
        removeStateSelection(game, sel.x, sel.y, sel.id)
      }
    } else {
      if (hexDistance(new Coordinate(init.x, init.y), new Coordinate(sel.x, sel.y)) > leadership) {
        sel.counter.unit.select()
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

function selectable(map: Map, selection: CounterSelectionTarget): boolean {
  if (map.debug) { return true }
  const game = map.game
  if (!game) { return false }
  const target = selection.counter.unit as Unit
  if (target.isFeature) { return false }
  if (game.gameState) { return game.gameState.selectable(selection) }
  if (game.phase === gamePhaseType.Main) {
    const same = target.playerNation === game.currentPlayerNation
    if (!same && !game.gameState) { return false }
    return true
  }
  return false
}
