import { getAPI } from "../utilities/network";
import Game, { GameData } from "./Game";
import GameAction from "./GameAction";
import { copyGameData, GameReplayState, setGameData } from "./support/gameReplay";

export default class GameReplay {
  game: Game;
  currentIndex: number = -1;

  replayState: GameReplayState[] = []

  constructor(data: GameData, callback: () => void) {
    data.suppress_network = true
    this.game = new Game(data, () => {})
    this.game.suppressAnimations = true

    this.loadAllActions(callback)
  }

  loadAllActions(callback: () => void) {
    getAPI(`/api/v1/game_actions?game_id=${this.game.id}`, {
      ok: response => response.json().then(json => {
        for (let i = 0; i < json.length; i++) {
          const action = new GameAction(json[i], this.game, i)
          this.game.executeAction(action, true)
          this.replayState.push(
            copyGameData(this.game, action.data.sequence as number, !!action.data.undone)
          )
        }
        this.game.replay = true
        const counters = this.game.scenario.map.allCounters
        for (const c of counters) {
          if (c.unit.lastSelected) { c.unit.lastSelect() }
        }
        this.currentIndex = json.length - 1
        this.game.replayIndex = this.currentIndex
        callback()
      })
    })
  }

  get currentSequence(): number {
    if (this.currentIndex < 0) { return -1 }
    return this.replayState[this.currentIndex].sequence
  }

  rollback() {
    while (this.currentIndex > 0) {
      const state = this.replayState[--this.currentIndex]
      if (state.undone) { continue }
      setGameData(this.game, state)
      this.game.replayIndex = this.currentIndex
      break
    }
  }

  rollForward() {
    while (this.currentIndex < this.replayState.length - 1) {
      const state = this.replayState[++this.currentIndex]
      if (state.undone) { continue }
      setGameData(this.game, state)
      this.game.replayIndex = this.currentIndex
      break
    }
  }

  setSequence(sequence: number) {
    for (let i = this.replayState.length - 1; i >= 0; i--) {
      const state = this.replayState[i]
      if (state.sequence == sequence) {
        if (!state.undone) {
          setGameData(this.game, state)
          this.currentIndex = i
          this.game.replayIndex = this.currentIndex
        }
        break
      }
    }
  }

  get firstIndex(): boolean {
    return this.currentIndex === 0
  }

  get lastIndex(): boolean {
    return this.currentIndex === this.replayState.length - 1
  }
}
