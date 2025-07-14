import { Coordinate } from "../../utilities/commonTypes";
import {
  baseToHit, coordinateToLabel, hexDistance, roll2d10, rolld10, rolld10x10
} from "../../utilities/utilities";
import {
  armorAtArc, armorHitModifiers, fireHindrance, firepower, rangeMultiplier, untargetedModifiers
} from "../control/fire";
import { ActionSelection } from "../control/gameActions";
import Counter from "../Counter";
import Game from "../Game";
import {
  GameActionPath, GameActionUnit, GameActionData, GameActionDiceResult,
} from "../GameAction";
import { sortStacks } from "../support/organizeStacks";
import BaseAction from "./BaseAction";
import IllegalActionError from "./IllegalActionError";

type FireActionActor = {
  counter: Counter, sponson?: boolean,
}
export default class FireAction extends BaseAction {
  origin: GameActionUnit[];
  path: GameActionPath[];
  target: GameActionUnit[];
  diceResults: GameActionDiceResult[];

  intensive: boolean;

  constructor(data: GameActionData, game: Game, index: number, intensive: boolean) {
    super(data, game, index)

    this.validate(data.data.origin)
    this.validate(data.data.path)
    this.validate(data.data.target)
    this.validate(data.data.dice_result)
    this.intensive = intensive

    // Validate will already error out if data is missing, but the linter can't tell
    this.origin = data.data.origin as GameActionUnit[]
    this.path = data.data.path as GameActionPath[]
    this.target = data.data.target as GameActionUnit[]
    this.diceResults = data.data.dice_result as GameActionDiceResult[]
  }

  get type(): string { return this.intensive ? "fire" : "intensive_fire" }

  get stringValue(): string {
    return ""
  }

  get undoPossible() {
    return false
  }

  convertAToA(actor: FireActionActor[]): ActionSelection[] {
    return actor.map(a => {
      const hex = a.counter.hex as Coordinate
      return { x: hex.x, y: hex.y, id: a.counter.unit.id, counter: a.counter }
    })
  }

  mutateGame(): void {
    // Generate dice on the fly if we need them; this will be sent to the
    // backend after being executed, so we can do this just-in-time if this is
    // the first time this has been run.  If this is already set, 
    const needDice = this.diceResults.length > 0
    let diceIndex = 0

    const map = this.game.scenario.map
    const firing: FireActionActor[] = this.origin.map(o => {
      return { counter: this.game.findCounterById(o.id) as Counter, sponson: o.sponson }
    })
    const targets: FireActionActor[] = this.target.map(t => {
      return { counter: this.game.findCounterById(t.id) as Counter }
    })
    const firing0 = firing[0].counter
    const target0 = targets[0].counter
    const to = target0.hex as Coordinate
    const sponson = !!firing[0].sponson
    const fp = firepower(this.game, this.convertAToA(firing), target0.unit, to, sponson)
    if (firing0.unit.targetedRange) {
      const rotated = this.path.length > 1
      const from = firing0.hex as Coordinate
      const mult = rangeMultiplier(map, firing0, to, sponson, rotated)
      const range = hexDistance(from, to)
      const hindrance = fireHindrance(this.game, this.convertAToA(firing), to)
      const targetCheck = (range + hindrance) * mult.mult
      if (needDice) { this.diceResults.push({ result: rolld10x10(), type: "d10x10" }) }
      const targetRoll = this.diceResults[diceIndex++]
      if (needDice) {
        targetRoll.description = `targeting roll (d10x10): needed ${targetCheck}, got ${targetRoll.result}: `
      }
      if (targetRoll.result > targetCheck) {
        if (needDice) { targetRoll.description += "hit" }
        if (target0.unit.isVehicle && !target0.unit.armored) {
          map.eliminateCounter(to, target0.unit.id)
          if (needDice) { targetRoll.description += ", vehicle destroyed" }
        } else if (target0.unit.isVehicle) {
          let turretHit = false
          if (target0.unit.turreted) {
            if (needDice) { this.diceResults.push({ result: rolld10(), type: "d10" }) }
            const location = this.diceResults[diceIndex++]
            if (location.result < 4) { turretHit = true }
            if (needDice) {
              location.description = `hit location roll (d10): ${location.result} (${ turretHit ? "turret" : "hull" })`
            }
          }
          const baseHit = baseToHit(fp.fp)
          const armor = armorAtArc(this.game, target0.unit, from, to, turretHit)
          const mods = armorHitModifiers(this.game, firing0.unit, target0.unit, from, to, turretHit)
          const hitCheck = baseHit + armor + mods.mod
          if (armor >= 0) {
            if (needDice) { this.diceResults.push({ result: roll2d10(), type: "2d10" }) }
            const hitRoll = this.diceResults[diceIndex++]
            if (needDice) {
              hitRoll.description = `penetration roll (2d10): needed ${hitCheck}, got ${hitRoll.result}: `
            }
            if (hitRoll.result > hitCheck) {
              map.eliminateCounter(to, target0.unit.id)
              if (needDice) { hitRoll.description += "succeeded, vehicle destroyed" }
            } else if (needDice) { hitRoll.description += "failed" }
          } else {
            map.eliminateCounter(to, target0.unit.id)
            targetRoll.description += ", no armor on side hit, vehicle destroyed"
          }
        } else {
          const hitCheck = baseToHit(fp.fp)
          if (needDice) { this.diceResults.push({ result: roll2d10(), type: "2d10" }) }
          const hitRoll = this.diceResults[diceIndex++]
          if (needDice) {
            hitRoll.description = `roll for effect (2d10): needed ${hitCheck}, got ${hitRoll.result}: `
          }
          if (hitRoll.result > hitCheck) {
            targets.forEach(t => this.game.moraleChecksNeeded.push(t.counter.unit.id))
            if (needDice) { hitRoll.description += "hit"}
          } else if (needDice) { hitRoll.description += "miss"}
        }
      } else if (needDice) { targetRoll.description += "miss" }
    } else {
      const basehit = baseToHit(fp.fp)
      const mods = untargetedModifiers(this.game, this.convertAToA(firing), this.convertAToA(targets), false)
      const coords: Coordinate[] = []
      for (const t of targets) {
        for (const c of coords) {
          const hex = t.counter.hex as Coordinate
          if (c.x !== hex.x || c.y !== hex.y) { coords.push(hex)}
        }
      }
      for (const c of coords) {
        const hindrance = fireHindrance(this.game, this.convertAToA(firing), c)
        const hitCheck = basehit + mods.mod + hindrance
        if (needDice) { this.diceResults.push({ result: roll2d10(), type: "2d10" }) }
        const hitRoll = this.diceResults[diceIndex++]
        if (needDice) {
          hitRoll.description = `hit roll ${
            coords.length > 1 ? `for ${coordinateToLabel(c)} ` : ""
          }(2d10): needed ${hitCheck}, got ${hitRoll.result}: `
        }
        if (hitRoll.result > hitCheck) {
          targets.forEach(t => {
            const hex = t.counter.hex as Coordinate
            if (hex.x === c.x && hex.y === c.y) { this.game.moraleChecksNeeded.push(t.counter.unit.id) }
          })
          if (needDice) { hitRoll.description += "hit" }
        } else if (needDice) { hitRoll.description += "miss" }
      }
    }
    if (needDice) { this.data.dice_result = this.diceResults }
    sortStacks(map)
    this.game.updateInitiative(2)
  }

  undo(): void {
    throw new IllegalActionError("internal error undoing fire action")
  }
}
