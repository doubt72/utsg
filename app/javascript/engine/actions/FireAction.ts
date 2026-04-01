import { Coordinate, featureType, sponsonType } from "../../utilities/commonTypes";
import {
  baseToHit, coordinateToLabel, driftRoll, hexDistance, roll2d10, rolld10, rolld10x10,
  rolld6, smokeRoll, otherPlayer
} from "../../utilities/utilities";
import {
  armorAtArc, armorHitModifiers, fireHindrance, firepower, rangeMultiplier, untargetedModifiers
} from "../control/fire";
import { StateSelection } from "../control/state/BaseState";
import Counter from "../Counter";
import Feature from "../Feature";
import Game from "../Game";
import {
  GameActionPath, GameActionUnit, GameActionData, GameActionDiceResult, GameActionFireData,
} from "../GameAction";
import { sortStacks } from "../support/organizeStacks";
import Unit from "../Unit";
import BaseAction from "./BaseAction";
import MoveAction from "./MoveAction";

type FireActionActor = {
  x: number, y: number, counter: Counter, sponson?: boolean, wire?: boolean
}
export default class FireAction extends BaseAction {
  origin: GameActionUnit[];
  path: GameActionPath[];
  target: GameActionUnit[];
  fireHex: GameActionFireData;
  diceResults: GameActionDiceResult[];

  intensive: boolean;
  reaction: boolean;
  moveSeq: number | undefined

  constructor(data: GameActionData, game: Game, index: number, intensive: boolean, reaction: boolean) {
    super(data, game, index)

    this.validate(data.data.origin)
    this.validate(data.data.path)
    this.validate(data.data.target)
    this.validate(data.data.fire_data)
    this.validate(data.data.dice_result)
    this.intensive = intensive
    this.reaction = reaction

    // Validate will already error out if data is missing, but the linter can't tell
    this.origin = data.data.origin as GameActionUnit[]
    this.path = data.data.path as GameActionPath[]
    this.target = data.data.target as GameActionUnit[]
    this.fireHex = data.data.fire_data as GameActionFireData
    this.diceResults = data.data.dice_result as GameActionDiceResult[]
    this.moveSeq = data.data.fire_data?.moveSeq
  }

  get type(): string {
    return this.reaction ? (this.intensive ? "reaction_intensive_fire" : "reaction_fire") :
      (this.intensive ? "intensive_fire" : "fire")
  }

  get stringValue(): string {
    const rc: string[] = []
    const smoke = this.fireHex.start[0].smoke
    let coords = [new Coordinate(this.origin[0].x, this.origin[0].y)]
    let part = this.reaction ? "reaction fire: " : ""
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
      if (i === coords.length - 1) { part += `fired ${smoke ? "smoke ": "" }at ` }
    }
    if (this.target.length > 0) {
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
        part += `${ this.game.nationNameForPlayer(otherPlayer(this.player)) } ${names.join(", ")}`
        part += ` at ${coordinateToLabel(c)}`
      }
    } else {
      const loc = this.fireHex.start[0]
      part += coordinateToLabel(new Coordinate(loc.x, loc.y))
    }
    rc.push(part)
    this.diceResults.forEach(dr => rc.push(dr.description as string))
    return rc.join("; ")
  }

  get undoPossible() {
    return false
  }

  convertAToA(actor: FireActionActor[]): StateSelection[] {
    return actor.map(a => {
      return { x: a.x, y: a.y, id: a.counter.unit.id, counter: a.counter }
    })
  }

  // TODO: this is a mess.  Probably worth refactoring.  Someday.  Though it's
  // mostly a lot of special cases; it'd only be slightly simpler if abstracted,
  // albeit much more comprehensible.  It's probably not quite well-tested
  // enough to do haphazardly, and also not quite well-tested enough to be sure
  // the current version is particularly close to bug-free, but is already
  // well-tested enough to be possible with moderate care.
  mutateGame(): void {
    const anims = []
    // Generate dice on the fly if we need them; this will be sent to the
    // backend after being executed, so we can do this just-in-time if this is
    // the first time this has been run.
    const needDice = this.diceResults.length === 0
    let diceIndex = 0
    const firing: FireActionActor[] = this.origin.map(o => {
      return {
        x: o.x, y: o.y, counter: this.game.findCounterById(o.id) as Counter,
        sponson: o.sponson, wire: o.wire
      }
    })
    const targets: FireActionActor[] = this.target.map(t => {
      return { x: t.x, y: t.y, counter: this.game.findCounterById(t.id) as Counter }
    })
    const firing0 = firing[0].counter
    let fireStart = false
    let fireStartVehicle: Unit | undefined = undefined
    let fireStartIncendiary = false
    let fireStartVehicleIncendiary = false
    if (this.path.length > 1) {
      firing0.unit.turretFacing = this.path[1].turret ?? 1
    }
    const target0 = targets[0]?.counter
    let to = new Coordinate(-1, -1)
    let fp = { fp: 0, why: [] as string[] }
    const sponson = !!firing[0].sponson
    const wire = !!firing[0].wire
    let smoke = false
    if (target0) {
      to = new Coordinate(targets[0].x, targets[0].y)
      fp = firepower(this.game, this.convertAToA(firing), target0.unit, to, sponson, [wire])
    } else {
      const hex = this.fireHex.start[0] as { x: number, y: number, smoke: boolean }
      smoke = hex.smoke
      to = new Coordinate(hex.x, hex.y)
    }
    if (firing0.unit.crewed && firing0.unit.parent) {
      firing0.unit.parent.activate()
    }
    if (firing0.unit.incendiary || firing0.unit.sponson?.type === sponsonType.Flame) {
      fireStartIncendiary = true
    }
    // Also generate final target hexes
    this.fireHex.final = this.fireHex.start
    const tRange = sponson ? firing0.unit.sponson?.type !== sponsonType.Flame : firing0.unit.targetedRange
    const oBoard = firing0.unit.offBoard
    if (firing0.unit.areaFire || oBoard) {
      fireStart = true
    }
    const fireStartHex = new Coordinate(to.x, to.y)
    if (tRange || oBoard) {
      const rotated = this.path.length > 1
      const from = firing0.hex as Coordinate
      const mult = rangeMultiplier(this.map, firing0, to, sponson, rotated, this.reaction)
      const range = hexDistance(from, to)
      const hindrance = fireHindrance(this.game, this.convertAToA(firing), to)
      const targetCheck = (range + hindrance) * mult.mult
      if (needDice) { this.diceResults.push({ result: rolld10x10(), type: "d10x10" }) }
      const targetRoll = this.diceResults[diceIndex++]
      if (needDice) {
        targetRoll.description = `targeting roll (d10x10): target ${targetCheck}, rolled ${targetRoll.result}: `
      }
      if (targetRoll.result > targetCheck || oBoard) {
        let dTo = to
        let dTargets = targets
        if (targetRoll.result <= targetCheck && oBoard) {
          if (needDice) {
            targetRoll.description += "miss, drifts"
            this.diceResults.push({ result: rolld6(), type: "d6" })
            this.diceResults.push({ result: rolld10(), type: "d10" })
          }
          const dirRoll = this.diceResults[diceIndex++]
          const drift = this.diceResults[diceIndex++]
          const dist = driftRoll(drift.result)
          if (needDice) {
            dirRoll.description = `direction roll (d6): ${dirRoll.result}`
            drift.description = `distance roll (d10): ${drift.result} for ${dist} hexes`
          }
          const loc = this.map.driftHex(to, dirRoll.result, dist)
          anims.push({ loc: to, type: "drift" })
          if (loc !== false) {
            dTo = loc
            drift.description += `, drifted to ${coordinateToLabel(loc)}`
            fireStartHex.x = loc.x
            fireStartHex.y = loc.y
            this.fireHex.final = [{ x: loc.x, y: loc.y, smoke }]
            dTargets = this.map.countersAt(loc).filter(c => c.hasUnit).map(u => {
              return { x: loc.x, y: loc.y, counter: u }
            })
            if (dTargets.length < 1 && !smoke) {
              drift.description += ", no units in hex"
            }
          } else {
            dTargets = []
            drift.description += ", drifted off map"
            fireStart = false
          }
        } else {
          if (needDice) { targetRoll.description += "hit" }
          anims.push({ loc: to, type: "hit" })
        }
        if (firing0.unit.areaFire || smoke) {
          if (smoke) {
            if (needDice) { this.diceResults.push({ result: rolld10(), type: "d10" }) }
            const smokeDice = this.diceResults[diceIndex++]
            const smokeValue = smokeRoll(smokeDice.result)
            if (needDice) {
              smokeDice.description = `smoke roll (d10): rolled ${smokeDice.result}, smoke level ${smokeValue}`
            }
            this.map.addCounter(dTo, new Feature(
              { ft: 1, t: featureType.Smoke, n: "Smoke", i: "smoke", h: smokeValue, id: `${this.index}-smoke` }
            ))
            anims.push({ loc: dTo, type: "smoke" })
          } else {
            const dTarget0 = dTargets[0]?.counter ?? target0
            let infantry = false
            let unit = dTarget0.unit
            for (const t of dTargets) {
              if (t.counter.unit.canCarrySupport) {
                infantry = true
                unit = t.counter.unit
              }
            }
            if (infantry) {
              fp = firepower(this.game, this.convertAToA(firing), unit, dTo, sponson, [wire])
              let hitCheck = baseToHit(fp.fp)
              if (hitCheck < 2) { hitCheck = 2 }
              if (needDice) { this.diceResults.push({ result: roll2d10(), type: "2d10" }) }
              const hitRoll = this.diceResults[diceIndex++]
              if (needDice) {
                hitRoll.description = `infantry effect roll (2d10): target ${hitCheck}, rolled ${hitRoll.result}: `
              }
              if (hitRoll.result > hitCheck) {
                if (needDice) { hitRoll.description += "succeeded" }
                for (const t of dTargets) {
                  if (t.counter.unit.canCarrySupport) {
                    this.game.moraleChecksNeeded.push({
                      unit: t.counter.unit, from: [from], to: dTo, incendiary: firing0.unit.incendiary
                    })
                  }
                }
                anims.push({ loc: dTo, type: "effect" })
              } else if (needDice) {
                hitRoll.description += "failed"
                anims.push({ loc: dTo, type: "noeffect" })
              }
            }
            for (const t of dTargets) {
              if (t.counter.unit.canCarrySupport) { continue }
              if (t.counter.unit.isVehicle && (!t.counter.unit.armored || t.counter.unit.topOpen)) {
                t.counter.unit.wreck(this.game)
                fireStartVehicle = t.counter.unit
                const hex = t.counter.hex as Coordinate
                if (hex.x != dTo.x || hex.y !== dTo.y) {
                  this.map.moveUnit(hex, dTo, t.counter.unit.id)
                }
                if (needDice) { targetRoll.description += `, ${t.counter.unit.name} destroyed` }
                anims.push({ loc: dTo, type: "wreck" })
              } else if (t.counter.unit.isVehicle) {
                const fwire = firing.map(f => f.wire ?? false)
                fp = firepower(this.game, this.convertAToA(firing), t.counter.unit, dTo, sponson, fwire)
                const baseHit = baseToHit(fp.fp)
                const armor = firing0.unit.incendiary ? 0 : t.counter.unit.lowestArmor
                let hitCheck = baseHit + armor
                if (hitCheck < 2) { hitCheck = 2 }
                if (needDice) { this.diceResults.push({ result: roll2d10(), type: "2d10" }) }
                const hitRoll = this.diceResults[diceIndex++]
                if (needDice) {
                  hitRoll.description = `penetration roll ${
                    dTargets.length > 1 ? `for ${t.counter.unit.name} ` : ""
                  }(2d10): target ${hitCheck}, rolled ${hitRoll.result}: `
                }
                if (hitRoll.result > hitCheck) {
                  t.counter.unit.wreck(this.game)
                  fireStartVehicle = t.counter.unit
                  const hex = t.counter.hex as Coordinate
                  if (hex.x != dTo.x || hex.y !== dTo.y) {
                    this.map.moveUnit(hex, dTo, t.counter.unit.id)
                  }
                  if (needDice) { hitRoll.description += "succeeded, vehicle destroyed" }
                  anims.push({ loc: dTo, type: "wreck" })
                } else if (hitRoll.result === hitCheck && !firing0.unit.incendiary) {
                  t.counter.unit.immobilized = true
                  if (needDice) { hitRoll.description += "tie, vehicle immobilized" }
                  const hex = t.counter.hex as Coordinate
                  if (hex.x != dTo.x || hex.y !== dTo.y) {
                    this.map.moveUnit(hex, dTo, t.counter.unit.id)
                    if (needDice) { hitRoll.description += `, move short at ${coordinateToLabel(dTo)}` }
                  }
                  anims.push({ loc: dTo, type: "immobilized" })
                } else if (needDice) {
                  hitRoll.description += "failed"
                  anims.push({ loc: dTo, type: "nowreck" })
                }
              }
            }
          }
        } else if (target0.unit.isVehicle && !target0.unit.armored) {
          target0.unit.wreck(this.game)
          fireStart = true
          fireStartVehicle = target0.unit
          const hex = target0.hex as Coordinate
          if (hex.x != dTo.x || hex.y !== dTo.y) {
            this.map.moveUnit(hex, dTo, target0.unit.id)
          }
          if (needDice) { targetRoll.description += ", vehicle destroyed" }
          anims.push({ loc: dTo, type: "wreck" })
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
          const clone = target0.unit.clone()
          if (this.moveSeq) {
            const action = this.game.findActionBySequence(this.moveSeq) as MoveAction
            if (action) {
              for (const p of action.path) {
                if (p.x === dTo.x && p.y === dTo.y) {
                  if (p.facing) { clone.facing = p.facing }
                  if (p.turret && clone.turreted) { clone.turretFacing = p.turret }
                  break
                }
              }
            }
          }
          const [arc, armor] = armorAtArc(this.game, clone, from, to, turretHit)
          const mods = armorHitModifiers(this.game, firing0.unit, clone, from, to, turretHit)
          let hitCheck = baseHit + armor + mods.mod
          if (hitCheck < 2) { hitCheck = 2 }
          if (armor >= 0) {
            if (needDice) { this.diceResults.push({ result: roll2d10(), type: "2d10" }) }
            const hitRoll = this.diceResults[diceIndex++]
            if (needDice) {
              hitRoll.description = `penetration roll (${arc}) (2d10): target ${hitCheck}, rolled ${hitRoll.result}: `
            }
            if (hitRoll.result > hitCheck) {
              target0.unit.wreck(this.game)
              fireStart = true
              fireStartVehicle = target0.unit
              const hex = target0.hex as Coordinate
              if (hex.x != dTo.x || hex.y !== dTo.y) {
                this.map.moveUnit(hex, dTo, target0.unit.id)
              }
              if (needDice) { hitRoll.description += "succeeded, vehicle destroyed" }
              anims.push({ loc: dTo, type: "wreck" })
            } else if (hitRoll.result === hitCheck) {
              if (turretHit) {
                if (needDice) { hitRoll.description += "tie, turret jammed" }
                target0.unit.turretJammed = true
                anims.push({ loc: dTo, type: "turret" })
              } else {
                if (needDice) { hitRoll.description += "tie, vehicle immobilized" }
                const hex = target0.hex as Coordinate
                if (hex.x != dTo.x || hex.y !== dTo.y) {
                  this.map.moveUnit(hex, dTo, target0.unit.id)
                  target0.unit.facing = clone.facing
                  if (target0.unit.turreted) { target0.unit.turretFacing = clone.turretFacing }
                  if (needDice) { hitRoll.description += `, move short at ${coordinateToLabel(dTo)}` }
                }
                target0.unit.immobilized = true
                anims.push({ loc: dTo, type: "immobilized" })
              }
            } else if (needDice) {
              hitRoll.description += "failed"
              anims.push({ loc: dTo, type: "nowreck" })
            }
          } else {
            target0.unit.wreck(this.game)
            fireStart = true
            fireStartVehicle = target0.unit
            const hex = target0.hex as Coordinate
            if (hex.x != dTo.x || hex.y !== dTo.y) {
              this.map.moveUnit(hex, dTo, target0.unit.id)
            }
            targetRoll.description += ", no armor on hit side, vehicle destroyed"
            anims.push({ loc: dTo, type: "wreck" })
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
              { unit: t.counter.unit, from: [from], to, incendiary: target0.unit.incendiary }))
            if (needDice) { hitRoll.description += "hit"}
            anims.push({ loc: dTo, type: "effect" })
          } else {
            if (needDice) { hitRoll.description += "miss" }
            anims.push({ loc: dTo, type: "noeffect" })
          }
        }
      } else {
        if (needDice) { targetRoll.description += "miss" }
        anims.push({ loc: to, type: "miss" })
      }
      const breakmod = 0 + (this.intensive ? 1 : 0) +
        (firing0.unit.parent && firing0.unit.nation !== firing0.unit.parent.nation ? 1 : 0)
      if (firing0.unit.breakWeaponRoll && targetRoll.result <= firing0.unit.breakWeaponRoll + breakmod) {
        if (firing0.unit.isVehicle) {
          if (sponson) {
            if (firing0.unit.breakDestroysSponson) {
              if (needDice) { targetRoll.description += ", firing weapon destroyed" }
              firing0.unit.sponsonDestroyed = true
              anims.push({ loc: from, type: "destroyed" })
            } else {
              if (needDice) { targetRoll.description += ", firing weapon broken" }
              firing0.unit.sponsonJammed = true
              anims.push({ loc: from, type: "jammed" })
            }
          } else {
            if (firing0.unit.breakDestroysWeapon) {
              if (needDice) { targetRoll.description += ", firing weapon destroyed" }
              firing0.unit.weaponDestroyed = true
              anims.push({ loc: from, type: "destroyed" })
            } else {
              if (needDice) { targetRoll.description += ", firing weapon broken" }
              firing0.unit.jammed = true
              anims.push({ loc: from, type: "jammed" })
            }
          }
        } else if (firing0.unit.breakDestroysWeapon ||
                   (firing0.unit.parent && firing0.unit.nation !== firing0.unit.parent.nation)) {
          if (firing0.unit.incendiary && firing0.unit.parent) {
            this.game.moraleChecksNeeded.push({
              unit: firing0.unit.parent, from: [], to, incendiary: true
            })
          }
          this.map.eliminateCounter(from, firing0.unit.id)
          if (needDice) { targetRoll.description += ", firing weapon destroyed" }
          anims.push({ loc: from, type: "destroyed" })
        } else {
          firing0.unit.jammed = true
          if (needDice) { targetRoll.description += ", firing weapon broken" }
          anims.push({ loc: from, type: "jammed" })
        }
      }
    } else {
      const basehit = baseToHit(fp.fp)
      const mods = untargetedModifiers(
        this.game, this.convertAToA(firing), this.convertAToA(targets), this.path, this.reaction
      )
      const coords: Coordinate[] = []
      for (const t of targets) {
        let check = false
        for (const c of coords) {
          if (c.x === t.x && c.y === t.y) { check = true }
        }
        if (!check) { coords.push(new Coordinate(t.x, t.y)) }
      }
      const fcoords: Coordinate[] = []
      for (const f of firing) {
        let check = false
        for (const c of fcoords) {
          if (c.x === f.x && c.y === f.y) { check = true }
        }
        if (!check) { fcoords.push(new Coordinate(f.x, f.y)) }
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
          anims.push({ loc: to, type: "hit" })
          targets.forEach(t => {
            if (t.x === c.x && t.y === c.y) {
              if (t.counter.unit.isVehicle && !t.counter.unit.armored) {
                t.counter.unit.wreck(this.game)
                fireStart = true
                fireStartVehicle = t.counter.unit
                const hex = t.counter.hex as Coordinate
                if (hex.x != t.x || hex.y !== t.y) {
                  this.map.moveUnit(hex, new Coordinate(t.x, t.y), t.counter.unit.id)
                }
                if (needDice) { hitRoll.description += `, ${t.counter.unit.name} destroyed` }
                anims.push({ loc: to, type: "wreck" })
              } else if (t.counter.unit.isVehicle && firing0.unit.incendiary) {
                fp = firepower(this.game, this.convertAToA(firing), t.counter.unit, to, false, [wire])
                let hitCheck = baseToHit(fp.fp)
                if (hitCheck < 2) { hitCheck = 2 }
                if (needDice) { this.diceResults.push({ result: roll2d10(), type: "2d10" }) }
                const hitRoll = this.diceResults[diceIndex++]
                if (needDice) {
                  hitRoll.description = `penetration roll ${
                    targets.length > 1 ? `for ${t.counter.unit.name} ` : ""
                  }(2d10): target ${hitCheck}, rolled ${hitRoll.result}: `
                }
                if (hitRoll.result > hitCheck) {
                  t.counter.unit.wreck(this.game)
                  fireStart = true
                  fireStartVehicle = t.counter.unit
                  const hex = t.counter.hex as Coordinate
                  if (hex.x != t.x || hex.y !== t.y) {
                    this.map.moveUnit(hex, new Coordinate(t.x, t.y), t.counter.unit.id)
                  }
                  if (needDice) { hitRoll.description += "succeeded, vehicle destroyed" }
                  anims.push({ loc: to, type: "wreck" })
                } else {
                  if (needDice) { hitRoll.description += "failed" }
                  anims.push({ loc: to, type: "nowreck" })
                }
              } else {
                this.game.moraleChecksNeeded.push({
                  unit: t.counter.unit, from: fcoords, to: c, incendiary: firing0.unit.incendiary
                })
              }
            }
          })
        } else {
          if (needDice) { hitRoll.description += "miss" }
          anims.push({ loc: to, type: "miss" })
        }
        for (const f of firing) {
          const breakmod = 0 + (this.intensive ? 1 : 0) +
            (f.counter.unit.parent && f.counter.unit.nation !== f.counter.unit.parent.nation ? 1 : 0)
          if (f.counter.unit.breakWeaponRoll && hitRoll.result <= f.counter.unit.breakWeaponRoll + breakmod) {
            if (f.counter.unit.isVehicle) {
              if (sponson) {
                if (f.counter.unit.breakDestroysSponson) {
                  f.counter.unit.sponsonDestroyed = true
                  if (needDice) { hitRoll.description += ", firing weapon destroyed" }
                  anims.push({ loc: to, type: "destroyed" })
                } else {
                  f.counter.unit.sponsonJammed = true
                  if (needDice) { hitRoll.description += ", firing weapon broken" }
                  anims.push({ loc: to, type: "jammed" })
                }
              } else {
                if (f.counter.unit.breakDestroysWeapon) {
                  f.counter.unit.weaponDestroyed = true
                  if (needDice) { hitRoll.description += ", firing weapon destroyed" }
                  anims.push({ loc: to, type: "destroyed" })
                } else {
                  f.counter.unit.jammed = true
                  if (needDice) { hitRoll.description += ", firing weapon broken" }
                  anims.push({ loc: to, type: "jammed" })
                }
              }
            } else if (f.counter.unit.breakDestroysWeapon ||
                       (firing0.unit.parent && firing0.unit.nation !== firing0.unit.parent.nation)) {
              const hex = new Coordinate(f.x, f.y)
              if (f.counter.unit.incendiary && f.counter.unit.parent) {
                this.game.moraleChecksNeeded.push({
                  unit: f.counter.unit.parent, from: [], to: hex, incendiary: true
                })
              }
              this.map.eliminateCounter(hex, f.counter.unit.id)
              if (needDice) { hitRoll.description += `, ${f.counter.unit.name} destroyed` }
              anims.push({ loc: to, type: "destroyed" })
            } else {
              f.counter.unit.jammed = true
              f.counter.unit.resetStatus()
              if (needDice) { hitRoll.description += `, ${f.counter.unit.name} broken` }
              anims.push({ loc: to, type: "jammed" })
            }
          }
        }
      }
    }
    for (const o of this.origin) {
      const counter = this.map.findCounterById(o.id)
      if (counter) {
        if (counter.unit.operated && !counter.unit.jammed) {
          this.intensive ? counter.unit.exhaust() : counter.unit.activate()
        }
        if (!counter.unit.operated) {
          this.intensive ? counter.unit.exhaust() : counter.unit.activate()
        }
        if (counter.unit.singleFire) {
          const hex = new Coordinate(o.x, o.y)
          this.map.eliminateCounter(hex, counter.unit.id)
        }
      }
    }
    if (needDice) { this.data.dice_result = this.diceResults }
    if (this.player === 1 ? this.game.axisSniper : this.game.alliedSniper && !this.reaction) {
      this.origin.forEach(o => {
        const unit = this.game.findUnitById(o.id)
        if (unit?.canCarrySupport) { this.game.addSniper( { unit, loc: new Coordinate(o.x, o.y) }) }
      })
    }
    if (fireStartVehicle && (fireStartVehicle.incendiary ||
        fireStartVehicle.sponson?.type === sponsonType.Flame)) {
      fireStartVehicleIncendiary = true
    }
    if (fireStart && !smoke) {
      this.game.fireStartCheckNeeded = {
        loc: fireStartHex, vehicle: fireStartVehicle !== undefined,
        incendiary: fireStartIncendiary,
        vehicle_incendiary: fireStartVehicleIncendiary,
      }
    }
    sortStacks(this.map)
    this.game.updateInitiative(2)
    if (this.game.moraleChecksNeeded.length > 0) {
      this.game.togglePlayer()
    } else {
      this.game.resetCurrentPlayer()
    }
    this.game.addActionAnimations(anims)
  }
}
