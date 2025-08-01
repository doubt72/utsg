import { Coordinate, CounterSelectionTarget, Direction, hexOpenType, unitStatus } from "../../../utilities/commonTypes";
import { hexDistance } from "../../../utilities/utilities";
import Counter from "../../Counter";
import Game from "../../Game";
import GameAction, { GameActionPath } from "../../GameAction";
import Unit from "../../Unit";
import { areaFire, canMultiSelectFire, inRange, leadershipRange, rapidFire, refreshTargetSelection, unTargetSelectExceptChain } from "../fire";
import { placeReactionFireGhosts, reactionFireHexes } from "../reactionFire";
import { clearUnrangedSelection, removeStateSelection } from "../select";
import BaseState, { StateSelection, stateType } from "./BaseState";

export default class FireState extends BaseState {
  initialSelection: StateSelection[];
  targetSelection: StateSelection[];
  path: GameActionPath[]; // For turret facing/changes:
  doneSelect: boolean;
  doneRotating: boolean;

  sponson: boolean;
  reaction: boolean;

  smoke: boolean;
  targetHexes: Coordinate[];

  constructor(game: Game, reaction: boolean) {
    super(game, stateType.Fire, reaction ? game.opponentPlayer : game.currentPlayer)
    this.reaction = reaction

    const selection = game.scenario.map.currentSelection[0]
    this.sponson = false
    if (this.reaction) {
      placeReactionFireGhosts(game)
    }
    if (selection.unit.sponson && (selection.unit.jammed || selection.unit.weaponDestroyed)) {
      this.sponson = false
    }
    const hex = selection.hex as Coordinate
    const loc = {
      x: hex.x, y: hex.y,
      facing: selection.unit.rotates ? selection.unit.facing : undefined,
      turret: selection.unit.turreted ? selection.unit.turretFacing : undefined,
    }
    this.selection = [{ x: loc.x, y: loc.y, id: selection.unit.id, counter: selection }]
    this.initialSelection = [{ x: loc.x, y: loc.y, id: selection.unit.id, counter: selection }]
    this.targetSelection = []
    this.path = [loc]
    this.doneSelect = !canMultiSelectFire(game, loc.x, loc.y, selection.unit)
    this.doneRotating = !selection.unit.turreted || this.sponson
    this.smoke = false
    this.targetHexes = []
    if (!this.doneSelect) {
      game.openOverlay = game.scenario.map.hexAt(hex)
    }
  }

  get intensiveFiring(): boolean {
    return this.selection[0].counter.unit.isActivated
  }

  get lastPath() { return this.path[this.path.length - 1] }

  openHex(x: number, y: number) {
    const last = this.lastPath as GameActionPath
    const from = new Coordinate(last.x, last.y)
    const to = new Coordinate(x, y)
    if (!this.doneSelect) {
      const leadership = leadershipRange(this.game)
      if (!leadership) {
        if (from.x === to.x && from.y === to.y) { return hexOpenType.Open }
      } else {
        if (hexDistance(from, to) <= leadership) { return hexOpenType.Open }
      }
    }
    if (inRange(this.game, to)) { return hexOpenType.Open }
    return hexOpenType.Closed
  }

  get rotateOpen(): boolean {
    return !this.doneRotating
  }

  get rotatePossible(): boolean {
    return !this.doneRotating
  }

  select(selection: CounterSelectionTarget, callback: () => void) {
    if (selection.target.type === "reinforcement") { return }
    const map = this.game.scenario.map
    const x = selection.target.xy.x
    const y = selection.target.xy.y
    const id = selection.counter.target.id
    const counter = map.unitAtId(new Coordinate(x, y), id) as Counter
    if (!this.doneRotating) { this.doneRotating = true }
    const selected = counter.unit.selected
    counter.unit.select()
    if (!this.doneSelect && this.samePlayer(counter.unit)) {
      if (selected) {
        removeStateSelection(this.game, x, y, counter.unit.id)
        clearUnrangedSelection(this.game)
      } else {
        this.selection?.push({
          x, y, id: counter.unit.id, counter: counter,
        })
      }
    } else {
      this.doneSelect = true
      counter.unit.select()
      const ts = counter.unit.targetSelected
      if (ts) {
        map.clearAllTargetSelections()
      } else {
        const rapid = rapidFire(this.game)
        if (rapid || areaFire(this.game)) {
          map.targetSelectAllAt(x, y, true, this.initialSelection[0].counter.unit.areaFire)
          if (rapid) {
            unTargetSelectExceptChain(this.game, x, y)
          } else {
            map.unTargetSelectAllExcept(x, y)
          }
        } else {
          counter.unit.targetSelect()
          map.clearOtherTargetSelections(x, y, counter.unit.id)
          if (!counter.unit.isVehicle) {
            map.targetSelectAllAt(x, y, false, false)
          }
        }
      }
      refreshTargetSelection(this.game)
    }
    callback()
  }

  selectable(selection: CounterSelectionTarget): boolean {
    if (selection.target.type !== "map") { return false }
    const target = selection.counter.unit as Unit
    const same = this.samePlayer(target)
    const select = this.selection[0]
    const sc = select.counter
    const map = this.game.scenario.map
    const tc = map.findCounterById(target.id) as Counter
    if (same) {
      if (this.doneSelect) { return false }
      for (const s of this.initialSelection) {
        if (selection.counter.target.id === s.id) { return false }
      }
      const counter = map.unitAtId(selection.target.xy, selection.counter.target.id) as Counter
      if (!this.canBeMultiselected(counter)) { return false }
      if (sc.unit.canCarrySupport && tc.unit.incendiary) {
        this.game.addMessage("can't combine infantry and incendiary attacks")
        return false
      }
    } else {
      if (sc.unit.canCarrySupport && tc.unit.armored) {
        this.game.addMessage("light weapons can't damage armored units")
        return false
      }
      if (target.operated) {
        if (!target.parent || !this.samePlayer(target.parent)) {
          this.game.addMessage("can't target weapons, only operators")
          return false
        }
      }
    }
    return true
  }

  get activeCounters(): Counter[] {
    let rc: Counter[] = []
    const first = this.path[0]
    const map = this.game.scenario.map
    if (!this.doneSelect) {
      const leadership = leadershipRange(this.game)
      if (leadership === false) {
        rc = map.countersAt(new Coordinate(first.x, first.y))
      } else {
        const counters = map.allCounters
        for (const c of counters) {
          const hex = c.hex as Coordinate
          if (hexDistance(new Coordinate(hex.x, hex.y), new Coordinate(first.x, first.y)) <= leadership) {
            rc.push(c)
          }
        }
      }
    }
    if (!this.smoke) {
      for (let y = 0; y < map.height; y++) {
        for (let x = map.width - 1; x >= 0; x--) {
          let check = false
          const counters = map.countersAt(new Coordinate(x, y))
          if (this.openHex(x, y)) {
            for (const c of counters) {
              if (c.hasUnit && !this.samePlayer(c.unit)) {
                if (this.game.fireState.reaction) {
                  for (const h of reactionFireHexes(this.game)) {
                    if (h.x === x && h.y === y) { check = true }
                  }
                } else { check = true }
              }
            }
          }
          for (const sel of this.selection) {
            if (!this.doneRotating) { break }
            if (sel.x === x && sel.y === y) {
              check = true
              break
            }
          }
          if (check) { rc = rc.concat(counters) }
        }
      }
    }
    return rc
  }
  
  toHex(x: number, y: number) {
    if (this.selection[0].counter.unit.offBoard || this.smoke) {
      this.targetHexes = [new Coordinate(x, y)]
    }
  }
  
  rotate(dir: Direction) {
    const x = this.path[0].x
    const y = this.path[0].y
    const origDir = this.path[0].turret
    if (dir === origDir) {
      this.path = [this.path[0]]
    } else if (this.path.length > 1) {
      this.path[1].turret = dir
    } else {
      this.path.push({ x, y, turret: dir })
    }
  }
  
  sponsonToggle() {
    this.sponson = !this.sponson
    this.targetSelection = []
    this.targetHexes = []
    this.game.scenario.map.clearAllTargetSelections()
    if (this.sponson) {
      this.path = [this.path[0]]
      this.doneRotating = true
    } else {
      this.doneRotating = false
    }
  }
  
  smokeToggle() {
    this.smoke = !this.smoke
    this.targetHexes = []
    this.targetSelection = []
    this.game.scenario.map.clearAllTargetSelections()
  }

  finish() {
    const type = this.reaction ?
      (this.intensiveFiring ? "reaction_intensive_fire" : "reaction_fire" ) :
      (this.intensiveFiring ? "intensive_fire" : "fire" )
    const action = new GameAction({
      user: this.reaction ? this.game.opponentUser : this.game.currentUser,
      player: this.player,
      data: {
        action: type, old_initiative: this.game.initiative,
        path: this.path,
        origin: this.selection.map(s => {
          return {
            x: s.x, y: s.y, id: s.counter.unit.id, status: s.counter.unit.status,
            sponson: this.sponson,
            wire: this.game.scenario.map.wireAt(new Coordinate(s.x, s.y))
          }
        }),
        target: this.targetSelection.map(t => {
          return { x: t.x, y: t.y, id: t.counter.unit.id, status: t.counter.unit.status }
        }),
        fire_data: {
          start: this.targetHexes.map(h => {
            return { x: h.x, y: h.y, smoke: this.smoke }
          }),
          final: []
        },
        dice_result: [],
      }
    }, this.game)
    this.execute(action)
  }

  samePlayer(target: Unit) {
    if (this.reaction) {
      return target.playerNation !== this.game.currentPlayerNation
    }
    return target.playerNation === this.game.currentPlayerNation
  }
  
  canBeMultiselected(counter: Counter): boolean {
    if (counter.unit.isBroken) {
      this.game.addMessage("cannot fire a broken unit")
      return false
    }
    if (counter.unit.isExhausted) {
      this.game.addMessage("cannot fire an exhausted unit")
      return false
    }
    const status = this.initialSelection[0].counter.unit.status
    if (counter.unit.isActivated && status !== unitStatus.Activated) {
      this.game.addMessage("cannot fire an activated unit")
      return false
    }
    if (counter.unit.parent) {
      if (counter.unit.parent.isBroken) {
        this.game.addMessage("cannot fire a unit if parent is broken")
        return false
      }
      if (counter.unit.parent.isExhausted) {
        this.game.addMessage("cannot fire a unit if parent is exhausted")
        return false
      }
      if (counter.unit.parent.pinned) {
        this.game.addMessage("cannot fire a unit if parent is pinned")
        return false
      }
    }
    if (counter.unit.targetedRange || counter.unit.offBoard) {
      this.game.addMessage("targeted weapons cannot fire with other units")
      return false
    }
    if (counter.unit.isVehicle) {
      this.game.addMessage("vehicles cannot fire with other units")
      return false
    }
    if (counter.parent && counter.parent.unit.isVehicle) {
      this.game.addMessage("unit being transported cannot fire with other units")
      return false
    }
    if (counter.unit.operated && counter.parent?.parent && counter.parent.parent.unit.isVehicle) {
      this.game.addMessage("unit being transported cannot fire with other units")
      return false
    }
    const next = counter.children[0]
    if (next && next?.unit.crewed) {
      this.game.addMessage("unit manning a crewed weapon cannot fire with other units")
      return false
    }
    const init = this.initialSelection[0]
    if (counter.parent && counter.parent?.unit.id === init.counter.unit.id) {
      return true
    }
    const coord = counter.hex as Coordinate
    if (counter.unit.leader && coord.x === init.x && coord.y === init.y) {
      return true
    }
    const leadership = leadershipRange(this.game)
    if (init.counter.unit.uncrewedSW && init.counter.unit.parent &&
        init.counter.unit.parent.id === counter.unit.id) {
      return true
    }
    if (leadership === false) {
      this.game.addMessage("can't combine fire of units without a leader")
      return false
    } else {
      const distance = hexDistance(new Coordinate(init.x, init.y), new Coordinate(coord.x, coord.y))
      if (distance > leadership) {
        this.game.addMessage("unit outside of leadership range")
        return false
      } else {
        return true
      }
    }
  }
}
