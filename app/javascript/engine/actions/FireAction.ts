import { Coordinate, unitStatus } from "../../utilities/commonTypes";
import {
  baseToHit, coordinateToLabel, hexDistance, roll2d10, rolld10, rolld10x10,
  togglePlayer
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
import Unit from "../Unit";
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
    const rc: string[] = []
    let coords = [new Coordinate(this.origin[0].x, this.origin[0].y)]
    let part = ""
    for (const o of this.origin) {
      let check = false
      for (const c of coords) {
        if (o.x === c.x && o.y === c.y) { check = true }
      }
      if (!check) { coords.push(new Coordinate(o.x, o.y)) }
    }
    for (let i = 0; i < coords.length; i++) {
      const c = coords[i]
      const names = this.origin.filter(o => o.x === c.x && o.y === c.y).map(o => {
        const unit = this.game.findUnitById(o.id) as Unit
        return unit.name
      })
      if (i > 0) { part += "and " }
      part += `${ this.game.nationNameForPlayer(this.player) } ${names.join(", ")}`
      part += ` at ${coordinateToLabel(c)} `
      if (i === coords.length - 1) { part += "fired at " }
    }
    coords = [new Coordinate(this.target[0].x, this.target[0].y)]
    for (const t of this.target) {
      let check = false
      for (const c of coords) {
        if (t.x === c.x && t.y === c.y) { check = true }
      }
      if (!check) { coords.push(new Coordinate(t.x, t.y)) }
    }
    for (const c of coords) {
      const names = this.target.filter(t => t.x === c.x && t.y === c.y).map(t => {
        const unit = this.game.findUnitById(t.id) as Unit
        return unit.name
      })
      part += `${ this.game.nationNameForPlayer(togglePlayer(this.player)) } ${names.join(", ")}`
      part += ` at ${coordinateToLabel(c)}`
    }
    rc.push(part)
    this.diceResults.forEach(dr => rc.push(dr.description as string))
    return rc.join("; ")
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
    // the first time this has been run.
    const needDice = this.diceResults.length === 0
    let diceIndex = 0
    const map = this.game.scenario.map
    const firing: FireActionActor[] = this.origin.map(o => {
      return { counter: this.game.findCounterById(o.id) as Counter, sponson: o.sponson }
    })
    const targets: FireActionActor[] = this.target.map(t => {
      return { counter: this.game.findCounterById(t.id) as Counter }
    })
    const firing0 = firing[0].counter
    if (this.path.length > 1) {
      firing0.unit.turretFacing = this.path[1].turret ?? 1
    }
    const target0 = targets[0].counter
    const to = target0.hex as Coordinate
    const sponson = !!firing[0].sponson
    let fp = firepower(this.game, this.convertAToA(firing), target0.unit, to, sponson)
    if (firing0.unit.targetedRange || firing0.unit.offBoard) {
      const rotated = this.path.length > 1
      const from = firing0.hex as Coordinate
      const mult = rangeMultiplier(map, firing0, to, sponson, rotated)
      const range = hexDistance(from, to)
      const hindrance = fireHindrance(this.game, this.convertAToA(firing), to)
      const targetCheck = (range + hindrance) * mult.mult
      if (needDice) { this.diceResults.push({ result: rolld10x10(), type: "d10x10" }) }
      const targetRoll = this.diceResults[diceIndex++]
      if (needDice) {
        targetRoll.description = `targeting roll (d10x10): target ${targetCheck}, rolled ${targetRoll.result}: `
      }
      if (targetRoll.result > targetCheck) {
        if (needDice) { targetRoll.description += "hit" }
        if (firing0.unit.areaFire) {
          let infantry = false
          let unit = target0.unit
          for (const t of targets) {
            if (t.counter.unit.canCarrySupport) {
              infantry = true
              unit = t.counter.unit
            }
          }
          if (infantry) {
            fp = firepower(this.game, this.convertAToA(firing), unit, to, sponson)
            let hitCheck = baseToHit(fp.fp)
            if (hitCheck < 2) { hitCheck = 2 }
            if (needDice) { this.diceResults.push({ result: roll2d10(), type: "2d10" }) }
            const hitRoll = this.diceResults[diceIndex++]
            if (needDice) {
              hitRoll.description = `infantry effect roll (2d10): target ${hitCheck}, rolled ${hitRoll.result}: `
            }
            if (hitRoll.result > hitCheck) {
              if (needDice) { hitRoll.description += "succeeded" }
              for (const t of targets) {
                if (t.counter.unit.canCarrySupport) {
                  this.game.moraleChecksNeeded.push({unit: t.counter.unit, from: [from], to })
                }
              }
            } else if (needDice) { hitRoll.description += "failed" }
          }
          for (const t of targets) {
            if (t.counter.unit.canCarrySupport) { continue }
            if (t.counter.unit.isVehicle && (!t.counter.unit.armored || t.counter.unit.topOpen)) {
              t.counter.unit.status = unitStatus.Wreck
              if (needDice) { targetRoll.description += `, ${t.counter.unit.name} destroyed` }
            } else if (t.counter.unit.isVehicle) {
              fp = firepower(this.game, this.convertAToA(firing), t.counter.unit, to, sponson)
              const baseHit = baseToHit(fp.fp)
              const armor = t.counter.unit.lowestArmor
              let hitCheck = baseHit + armor
              if (hitCheck < 2) { hitCheck = 2 }
              if (needDice) { this.diceResults.push({ result: roll2d10(), type: "2d10" }) }
              const hitRoll = this.diceResults[diceIndex++]
              if (needDice) {
                hitRoll.description = `penetration roll ${
                  targets.length > 1 ? `for ${t.counter.unit.name} ` : ""
                }(2d10): target ${hitCheck}, rolled ${hitRoll.result}: `
              }
              if (hitRoll.result > hitCheck) {
                t.counter.unit.status = unitStatus.Wreck
                if (needDice) { hitRoll.description += "succeeded, vehicle destroyed" }
              } else if (hitRoll.result === hitCheck) {
                t.counter.unit.immobilized = true
                if (needDice) { hitRoll.description += "tie, vehicle immobilized" }
              }else if (needDice) { hitRoll.description += "failed" }
            }
          }
        } else if (target0.unit.isVehicle && !target0.unit.armored) {
          target0.unit.status = unitStatus.Wreck
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
          let hitCheck = baseHit + armor + mods.mod
          if (hitCheck < 2) { hitCheck = 2 }
          if (armor >= 0) {
            if (needDice) { this.diceResults.push({ result: roll2d10(), type: "2d10" }) }
            const hitRoll = this.diceResults[diceIndex++]
            if (needDice) {
              hitRoll.description = `penetration roll (2d10): target ${hitCheck}, rolled ${hitRoll.result}: `
            }
            if (hitRoll.result > hitCheck) {
              target0.unit.status = unitStatus.Wreck
              if (needDice) { hitRoll.description += "succeeded, vehicle destroyed" }
            } else if (hitRoll.result === hitCheck) {
              if (turretHit) {
                if (needDice) { hitRoll.description += "tie, turret jammed" }
                target0.unit.turretJammed = true
              } else {
                if (needDice) { hitRoll.description += "tie, vehicle immobilized" }
                target0.unit.immobilized = true
              }
            } else if (needDice) { hitRoll.description += "failed" }
          } else {
            target0.unit.status = unitStatus.Wreck
            targetRoll.description += ", no armor on hit side, vehicle destroyed"
          }
        } else {
          let hitCheck = baseToHit(fp.fp)
          if (hitCheck < 2) { hitCheck = 2 }
          if (needDice) { this.diceResults.push({ result: roll2d10(), type: "2d10" }) }
          const hitRoll = this.diceResults[diceIndex++]
          if (needDice) {
            hitRoll.description = `roll for effect (2d10): target ${hitCheck}, rolled ${hitRoll.result}: `
          }
          if (hitRoll.result > hitCheck) {
            targets.forEach(t => this.game.moraleChecksNeeded.push(
              { unit: t.counter.unit, from: [from], to  }))
            if (needDice) { hitRoll.description += "hit"}
          } else if (needDice) { hitRoll.description += "miss"}
        }
      } else if (needDice) { targetRoll.description += "miss" }
      if (firing0.unit.breakWeaponRoll && targetRoll.result <= firing0.unit.breakWeaponRoll) {
        if (firing0.unit.isVehicle) {
          if (sponson) {
            firing0.unit.sponsonJammed = true
            if (firing0.unit.breakDestroysSponson) {
              if (needDice) { targetRoll.description += ", firing weapon destroyed" }
              firing0.unit.sponsonDestroyed = true
            } else {
              if (needDice) { targetRoll.description += ", firing weapon broken" }
            }
          } else {
            firing0.unit.jammed = true
            if (firing0.unit.breakDestroysWeapon) {
              if (needDice) { targetRoll.description += ", firing weapon destroyed" }
              firing0.unit.weaponDestroyed = true
            } else {
              if (needDice) { targetRoll.description += ", firing weapon broken" }
            }
          }
        } else if (firing0.unit.breakDestroysWeapon) {
          map.eliminateCounter(from, firing0.unit.id)
          if (needDice) { targetRoll.description += ", firing weapon destroyed" }
        } else {
          firing0.unit.jammed = true
          if (needDice) { targetRoll.description += ", firing weapon broken" }
        }
      }
    } else {
      const basehit = baseToHit(fp.fp)
      const mods = untargetedModifiers(this.game, this.convertAToA(firing), this.convertAToA(targets))
      const coords: Coordinate[] = []
      for (const t of targets) {
        let check = false
        const hex = t.counter.hex as Coordinate
        for (const c of coords) {
          if (c.x === hex.x && c.y === hex.y) { check = true }
        }
        if (!check) { coords.push(hex) }
      }
      const fcoords: Coordinate[] = []
      for (const f of firing) {
        let check = false
        const hex = f.counter.hex as Coordinate
        for (const c of fcoords) {
          if (c.x === hex.x && c.y === hex.y) { check = true }
        }
        if (!check) { fcoords.push(hex) }
      }
      for (const c of coords) {
        const hindrance = fireHindrance(this.game, this.convertAToA(firing), c)
        let hitCheck = basehit + mods.mod + hindrance
        if (hitCheck < 2) { hitCheck = 2 }
        if (needDice) { this.diceResults.push({ result: roll2d10(), type: "2d10" }) }
        const hitRoll = this.diceResults[diceIndex++]
        if (needDice) {
          hitRoll.description = `hit roll ${
            coords.length > 1 ? `for ${coordinateToLabel(c)} ` : ""
          }(2d10): target ${hitCheck}, rolled ${hitRoll.result}: `
        }
        if (hitRoll.result > hitCheck) {
          if (needDice) { hitRoll.description += "hit" }
          targets.forEach(t => {
            const hex = t.counter.hex as Coordinate
            if (hex.x === c.x && hex.y === c.y) {
              if (t.counter.unit.isVehicle && !t.counter.unit.armored) {
                t.counter.unit.status = unitStatus.Wreck
                if (needDice) { hitRoll.description += `, ${t.counter.unit.name} destroyed` }
              } else {
                this.game.moraleChecksNeeded.push({ unit: t.counter.unit, from: fcoords, to: c })
              }
            }
          })
        } else if (needDice) { hitRoll.description += "miss" }
        for (const f of firing) {
          if (f.counter.unit.breakWeaponRoll && hitRoll.result <= f.counter.unit.breakWeaponRoll) {
            if (f.counter.unit.isVehicle) {
              if (sponson) {
                f.counter.unit.sponsonJammed = true
                if (f.counter.unit.breakDestroysSponson) {
                  if (needDice) { hitRoll.description += ", firing weapon destroyed" }
                } else {
                  if (needDice) { hitRoll.description += ", firing weapon broken" }
                }
              } else {
                f.counter.unit.jammed = true
                if (f.counter.unit.breakDestroysWeapon) {
                  if (needDice) { hitRoll.description += ", firing weapon destroyed" }
                } else {
                  if (needDice) { hitRoll.description += ", firing weapon broken" }
                }
              }
            } else if (f.counter.unit.breakDestroysWeapon) {
              const hex = f.counter.hex as Coordinate
              map.eliminateCounter(hex, f.counter.unit.id)
              if (needDice) { hitRoll.description += `, ${f.counter.unit.name} destroyed` }
            } else {
              f.counter.unit.jammed = true
              if (needDice) { hitRoll.description += `, ${f.counter.unit.name} broken` }
            }
          }
        }
      }
    }
    for (const o of this.origin) {
      const counter = map.findCounterById(o.id) as Counter
      if (!counter.unit.jammed || counter.unit.isVehicle) { counter.unit.status = unitStatus.Activated }
    }
    if (firing0.unit.crewed && firing0.unit.parent) {
      firing0.unit.parent.status = unitStatus.Activated
    }
    if (needDice) { this.data.dice_result = this.diceResults }
    sortStacks(map)
    this.game.updateInitiative(2)
  }

  undo(): void {
    throw new IllegalActionError("internal error undoing fire action")
  }
}
