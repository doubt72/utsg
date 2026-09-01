import { Coordinate, featureType, sponsonType } from "../../utilities/commonTypes";
import { failRedColorMarker, formatCoordinate, formatDieResult, formatNation, formatTarget, parseColorMarkers, passBlueColorMarker } from "../../utilities/graphics";
import {
  baseToHit, driftRoll, hexDistance, roll2d10, rolld10, rolld10x10,
  rolld6, smokeRoll, otherPlayer,
  playerForNation,
  critHitDiff
} from "../../utilities/utilities";
import {
  armorAtArc, armorHitModifiers, fireHindrance, firepower, fireStartTarget, rangeMultiplier, untargetedModifiers
} from "../control/fire";
import { rollbackAddActions } from "../control/movement";
import { addSpotting, removeSpotting } from "../control/spotting";
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

function critHit(roll: number, check: number): boolean {
  return roll >= check + critHitDiff && roll > 12
}

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

  formatUnit(unit: Unit): string {
    const player = playerForNation(unit, this.game)
    return formatNation(this.game, player, unit.name)
  }

  get htmlValue(): string {
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
        return formatNation(this.game, this.player, o.name)
      })
      if (i > 0) { part += "and " }
      part += `${ formatNation(this.game, this.player) } ${names.join(", ")}`
      part += ` at ${formatCoordinate(c)} `
      if (i === coords.length - 1) {
        part += `fired ${this.origin[i].sponson ? "hull gun " : ""}${smoke ? "smoke ": "" }at `
      }
    }
    if (this.target.length > 0 && !smoke) {
      coords = [new Coordinate(this.target[0].x, this.target[0].y)]
      for (const t of this.target) {
        let check = false
        for (const c of coords) {
          if (t.x === c.x && t.y === c.y) { check = true }
        }
        if (!check) { coords.push(new Coordinate(t.x, t.y)) }
      }
      part += coords.map(c => {
        let rc = ""
        const names = this.target.filter(t => t.x === c.x && t.y === c.y).map(t => {
          return formatNation(this.game, otherPlayer(this.player), t.name)
        })
        rc += `${ formatNation(this.game, otherPlayer(this.player)) } ${names.join(", ")}`
        rc += ` at ${formatCoordinate(c)}`
        return rc
      }).join(", ")
    } else {
      const loc = this.fireHex.start[0]
      part += formatCoordinate(new Coordinate(loc.x, loc.y))
    }
    rc.push(part)
    this.diceResults.forEach(dr => rc.push(dr.description as string))
    return parseColorMarkers(rc.join("; "))
  }

  get undoPossible() {
    return false
  }

  convertAToA(actor: FireActionActor[]): StateSelection[] {
    return actor.map(a => {
      return { x: a.x, y: a.y, id: a.counter.unit.id, name: a.counter.unit.name, counter: a.counter }
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
    const u0 = firing0.unit
    if (this.path.length > 1) {
      u0.turretFacing = this.path[1].turret ?? 1
    }
    const target0 = targets[0]?.counter
    let to = new Coordinate(-1, -1)
    let fp = { fp: 0, why: [] as string[] }
    const sponson = !!firing[0].sponson
    const wire = !!firing[0].wire
    let smoke = false
    if (target0) {
      to = new Coordinate(targets[0].x, targets[0].y)
      smoke = this.fireHex.start[0].smoke
      fp = firepower(this.game, this.convertAToA(firing), target0.unit, to, sponson, [wire])
    } else {
      const hex = this.fireHex.start[0] as { x: number, y: number, smoke: boolean }
      smoke = hex.smoke
      to = new Coordinate(hex.x, hex.y)
    }
    if (u0.crewed && u0.parent) {
      u0.parent.activate()
    }
    // Also generate final target hexes
    this.fireHex.final = this.fireHex.start
    const tRange = sponson ? u0.sponson?.type !== sponsonType.Flame : u0.targetedRange
    const oBoard = u0.offBoard
    let fsHexes: { x: number, y: number, vehicle?: Unit }[] = []
    if (u0.areaFire || oBoard) {
      fsHexes = [{ x: to.x, y: to.y }]
    }
    let incendiary = false
    if (u0.incendiary || u0.sponson?.type === sponsonType.Flame) {
      incendiary = true
    }
    let spotting = false
    if (u0.offBoard || u0.crewed ||
        (sponson && u0.sponson?.type !== sponsonType.Flame) ||
        (!sponson && u0.isVehicle && u0.targetedRange)) {
      spotting = true
      if (u0.isVehicle) {
        if (sponson && u0.isImmobilized) { spotting = false }
        if (!u0.turreted && u0.isImmobilized) { spotting = false }
        if (!sponson && u0.isTurretJammed) { spotting = false }
      }
    }
    if (tRange || oBoard) {
      const rotated = this.path.length > 1
      const from = firing0.hex as Coordinate
      const mult = rangeMultiplier(this.map, firing0, to, sponson, rotated, this.reaction)
      const range = hexDistance(from, to)
      const hindrance = fireHindrance(this.game, this.convertAToA(firing), to)
      const targetCheck = (range + hindrance) * mult.mult
      if (needDice) { this.diceResults.push({ result: rolld10x10() }) }
      const targetRoll = this.diceResults[diceIndex++]
      if (needDice) {
        targetRoll.description = `targeting roll: target ${formatTarget(targetCheck)}, ` +
          `rolled ${formatDieResult(targetRoll.result)}: `
      }
      if (targetRoll.result.result > targetCheck || oBoard) {
        let dHexes = [to]
        fsHexes = []
        if (targetRoll.result.result <= targetCheck && oBoard) {
          anims.push({ loc: to, type: "miss" })
          if (needDice) {
            targetRoll.description += `<span style="color: ${failRedColorMarker()};">miss</span>, ` +
              `<span style="color: ${passBlueColorMarker()};">drifts</span>`
            this.diceResults.push({ result: rolld6() })
            this.diceResults.push({ result: rolld10() })
          }
          const dirRoll = this.diceResults[diceIndex++]
          const drift = this.diceResults[diceIndex++]
          const dist = driftRoll(drift.result.result)
          if (needDice) {
            dirRoll.description = `direction roll: ${formatDieResult(dirRoll.result)}`
            drift.description = `distance roll: ${formatDieResult(drift.result)} for ${formatTarget(dist)} hexes`
          }
          const loc = this.map.driftHex(to, dirRoll.result.result, dist)
          this.fireHex.final = [{ x: loc.x, y: loc.y, smoke }]
          if (this.data.fire_data) { this.data.fire_data.drift = true }
          if (loc.x < 0 || loc.y < 0 || loc.x >= this.map.width || loc.y >= this.map.height) {
            dHexes = []
            drift.description += ", drifted off map"
          } else {
            anims.push({ loc: loc, type: "drift" })
            dHexes = [loc]
            for (const h of this.map.hexNeighbors(loc)) { if (h) { dHexes.push(h.coord)} }
            drift.description += `, drifted to ${formatCoordinate(loc)}`
            let hit = false
            for (const d of dHexes) {
              this.game.observeNeeded.push(d)
              fsHexes.push({ x: d.x, y: d.y })
              if (this.map.countersAt(d).filter(c => c.hasUnit).length > 0) { hit = true }
            }
            if (!hit && !smoke) {
              drift.description += ", no units hit"
            }
          }
        } else {
          if (needDice) { targetRoll.description += `<span style="color: ${failRedColorMarker()};">hit</span>` }
          anims.push({ loc: to, type: "hit" })
          if (oBoard) {
            for (const h of this.map.hexNeighbors(to)) { if (h) { dHexes.push(h.coord)} }
          }
          for (const d of dHexes) {
            this.game.observeNeeded.push(d)
            if (u0.areaFire || oBoard) {
              fsHexes.push({ x: d.x, y: d.y })
            }
          }
        }
        if (u0.areaFire || smoke) {
          if (smoke) {
            for (const d of dHexes) {
              if (needDice) { this.diceResults.push({ result: rolld10() }) }
              const smokeDice = this.diceResults[diceIndex++]
              const smokeValue = smokeRoll(smokeDice.result.result)
              if (needDice) {
                smokeDice.description = `smoke roll${dHexes.length > 1 ? ` for ${formatCoordinate(d)}` : ""}: ` +
                  `rolled ${formatDieResult(smokeDice.result)}, ` +
                  `smoke level ${formatTarget(smokeValue)}`
              }
              this.map.addCounter(d, new Feature(
                {
                  ft: 1, t: featureType.Smoke, n: "Smoke", i: "smoke", h: smokeValue,
                  id: `${this.index}-smoke-${d.x}-${d.y}`
                }
              ))
              anims.push({ loc: d, type: "smoke" })
            }
          } else {
            for (const d of dHexes) {
              const dTargets = this.map.countersAt(d).filter(c => c.hasUnit).map(u => {
                return { x: d.x, y: d.y, counter: u }
              })
              if (dTargets.length < 1) { continue }
              const dTarget0 = dTargets[0]?.counter ?? target0
              let infantry = false
              let unit = dTarget0?.unit
              for (const t of dTargets) {
                if (t.counter.unit.canCarrySupport) {
                  infantry = true
                  unit = t.counter.unit
                }
              }
              if (infantry) {
                fp = firepower(this.game, this.convertAToA(firing), unit, d, sponson, [wire])
                let hitCheck = baseToHit(fp.fp)
                if (hitCheck < 2) { hitCheck = 2 }
                if (needDice) { this.diceResults.push({ result: roll2d10() }) }
                const hitRoll = this.diceResults[diceIndex++]
                if (needDice) {
                  hitRoll.description =
                    `infantry effect roll${dHexes.length > 1 ? ` at ${formatCoordinate(d)}` : ""}: target ${formatTarget(hitCheck)}, rolled ${formatDieResult(hitRoll.result)}: `
                }
                if (hitRoll.result.result > hitCheck) {
                  const critical = critHit(hitRoll.result.result, hitCheck)
                  if (needDice) { hitRoll.description += `<span style="color: ${failRedColorMarker()};">${
                    critical ? "passed (critical)" : "passed"
                  }</span>` }
                  for (const t of dTargets) {
                    if (t.counter.unit.canCarrySupport) {
                      this.game.moraleChecksNeeded.push({
                        unit: t.counter.unit, from: [from], to: d, incendiary: u0.incendiary,
                        critical,
                      })
                    }
                  }
                  anims.push({ loc: d, type: critical ? "criteffect" : "effect" })
                } else {
                  if (needDice) {
                    hitRoll.description += `<span style="color: ${passBlueColorMarker()};">no effect</span>`
                  }
                  anims.push({ loc: d, type: "noeffect" })
                }
              }
              for (const t of dTargets) {
                if (t.counter.unit.canCarrySupport) { continue }
                if (t.counter.unit.isWreck) { continue }
                if (t.counter.unit.isVehicle && (!t.counter.unit.armored || t.counter.unit.topOpen)) {
                  for (const f of fsHexes) {
                    if (f.x === d.x && f.y === d.y) { f.vehicle = t.counter.unit }
                  }
                  const hex = t.counter.hex as Coordinate
                  if (hex.x != d.x || hex.y !== d.y) {
                    rollbackAddActions(this.map, hex, d, t.counter.unit.id)
                  }
                  if (needDice) { targetRoll.description += `, ${this.formatUnit(t.counter.unit)} destroyed` }
                  t.counter.unit.wreck(this.game)
                  anims.push({ loc: d, type: "wreck" })
                } else if (t.counter.unit.isVehicle) {
                  const fwire = firing.map(f => f.wire ?? false)
                  fp = firepower(this.game, this.convertAToA(firing), t.counter.unit, d, sponson, fwire)
                  const baseHit = baseToHit(fp.fp)
                  const armor = u0.incendiary ? 0 : t.counter.unit.lowestArmor
                  let hitCheck = baseHit + armor
                  if (hitCheck < 2) { hitCheck = 2 }
                  if (needDice) { this.diceResults.push({ result: roll2d10() }) }
                  const hitRoll = this.diceResults[diceIndex++]
                  if (needDice) {
                    hitRoll.description = `penetration roll${
                      dTargets.length > 1 ? ` for ${this.formatUnit(t.counter.unit)}`: ""
                    }${
                      dHexes.length > 1 ? ` at ${formatCoordinate(d)}` : ""
                    }: target ${formatTarget(hitCheck)}, rolled ${formatDieResult(hitRoll.result)}: `
                  }
                  if (hitRoll.result.result > hitCheck) {
                    for (const f of fsHexes) {
                      if (f.x === d.x && f.y === d.y) { f.vehicle = t.counter.unit }
                    }
                    const hex = t.counter.hex as Coordinate
                    if (hex.x != d.x || hex.y !== d.y) {
                      rollbackAddActions(this.map, hex, d, t.counter.unit.id)
                    }
                    if (needDice) {
                      hitRoll.description += `<span style="color: ${failRedColorMarker()};">passed</span>, vehicle destroyed`
                    }
                    t.counter.unit.wreck(this.game)
                    anims.push({ loc: d, type: "wreck" })
                  } else if (hitRoll.result.result === hitCheck && !u0.incendiary) {
                    if (needDice) {
                      hitRoll.description += `<span style="color: ${failRedColorMarker()};">tie</span>, vehicle immobilized`
                    }
                    const hex = t.counter.hex as Coordinate
                    if (hex.x != d.x || hex.y !== d.y) {
                      rollbackAddActions(this.map, hex, d, t.counter.unit.id)
                      if (needDice) { hitRoll.description += `, move short at ${formatCoordinate(d)}` }
                    }
                    t.counter.unit.immobilize(this.map)
                    anims.push({ loc: d, type: "immobilized" })
                  } else {
                    if (needDice) {
                      hitRoll.description += `<span style="color: ${passBlueColorMarker()};">failed</span>`
                    }
                    anims.push({ loc: d, type: "nowreck" })
                  }
                }
              }
            }
          }
        } else if (target0.unit.isVehicle && !target0.unit.armored) {
          fsHexes = [{ x: dHexes[0].x, y: dHexes[0].y, vehicle: target0.unit }]
          const hex = target0.hex as Coordinate
          if (hex.x != dHexes[0].x || hex.y !== dHexes[0].y) {
            rollbackAddActions(this.map, hex, dHexes[0], target0.unit.id)
          }
          if (needDice) { targetRoll.description += ", vehicle destroyed" }
          target0.unit.wreck(this.game)
          anims.push({ loc: dHexes[0], type: "wreck" })
        } else if (target0.unit.isVehicle) {
          let turretHit = false
          if (target0.unit.turreted) {
            if (needDice) { this.diceResults.push({ result: rolld10() }) }
            const location = this.diceResults[diceIndex++]
            if (location.result.result < 4) { turretHit = true }
            if (needDice) {
              location.description = `hit location roll: ${formatDieResult(location.result)} ` +
                `(${ turretHit ? "turret" : "hull" })`
            }
          }
          const baseHit = baseToHit(fp.fp)
          const clone = target0.unit.clone()
          clone.facing = target0.unit.facing
          clone.turretFacing = target0.unit.turretFacing
          if (this.moveSeq) {
            const action = this.game.findActionBySequence(this.moveSeq) as MoveAction
            if (action) {
              for (const p of action.path) {
                if (p.x === dHexes[0].x && p.y === dHexes[0].y) {
                  if (p.facing) { clone.facing = p.facing }
                  if (p.turret && clone.turreted) { clone.turretFacing = p.turret }
                  break
                }
              }
            }
          }
          const [arc, armor] = armorAtArc(this.game, clone, from, to, turretHit)
          const mods = armorHitModifiers(this.game, u0, clone, from, to, turretHit)
          let hitCheck = baseHit + armor + mods.mod
          if (hitCheck < 2) { hitCheck = 2 }
          if (armor >= 0) {
            if (needDice) { this.diceResults.push({ result: roll2d10() }) }
            const hitRoll = this.diceResults[diceIndex++]
            if (needDice) {
              hitRoll.description = `penetration roll (${arc}): target ${formatTarget(hitCheck)}, ` +
                `rolled ${formatDieResult(hitRoll.result)}: `
            }
            if (hitRoll.result.result > hitCheck) {
              fsHexes = [{ x: dHexes[0].x, y: dHexes[0].y, vehicle: target0.unit }]
              const hex = target0.hex as Coordinate
              if (hex.x != dHexes[0].x || hex.y !== dHexes[0].y) {
                rollbackAddActions(this.map, hex, dHexes[0], target0.unit.id)
              }
              if (needDice) {
                hitRoll.description += `<span style="color: ${failRedColorMarker()};">passed</span>, vehicle destroyed`
              }
              target0.unit.wreck(this.game)
              anims.push({ loc: dHexes[0], type: "wreck" })
            } else if (hitRoll.result.result === hitCheck) {
              if (turretHit) {
                if (needDice) {
                  hitRoll.description += `<span style="color: ${failRedColorMarker()};">tie</span>, turret jammed`
                }
                target0.unit.jamTurret(this.game)
                anims.push({ loc: dHexes[0], type: "turret" })
              } else {
                if (needDice) {
                  hitRoll.description += `<span style="color: ${failRedColorMarker()};">tie</span>, vehicle immobilized`
                }
                const hex = target0.hex as Coordinate
                if (hex.x != dHexes[0].x || hex.y !== dHexes[0].y) {
                  rollbackAddActions(this.map, hex, dHexes[0], target0.unit.id)
                  target0.unit.facing = clone.facing
                  if (target0.unit.turreted) { target0.unit.turretFacing = clone.turretFacing }
                  if (needDice) { hitRoll.description += `, move short at ${formatCoordinate(dHexes[0])}` }
                }
                target0.unit.immobilize(this.map)
                anims.push({ loc: dHexes[0], type: "immobilized" })
              }
            } else {
              if (needDice) {
                hitRoll.description += `<span style="color: ${passBlueColorMarker()};">failed</span>`
              }
              anims.push({ loc: dHexes[0], type: "nowreck" })
            }
          } else {
            fsHexes = [{ x: dHexes[0].x, y: dHexes[0].y, vehicle: target0.unit }]
            const hex = target0.hex as Coordinate
            if (hex.x != dHexes[0].x || hex.y !== dHexes[0].y) {
              rollbackAddActions(this.map, hex, dHexes[0], target0.unit.id)
            }
            targetRoll.description += ", no armor on hit side, vehicle destroyed"
            target0.unit.wreck(this.game)
            anims.push({ loc: dHexes[0], type: "wreck" })
          }
        } else {
          let hitCheck = baseToHit(fp.fp)
          if (hitCheck < 2) { hitCheck = 2 }
          if (needDice) { this.diceResults.push({ result: roll2d10() }) }
          const hitRoll = this.diceResults[diceIndex++]
          if (needDice) {
            hitRoll.description =
              `roll for effect: target ${formatTarget(hitCheck)}, rolled ${formatDieResult(hitRoll.result)}: `
          }
          if (hitRoll.result.result > hitCheck) {
            const critical = critHit(hitRoll.result.result, hitCheck)
            targets.forEach(t => this.game.moraleChecksNeeded.push(
              { unit: t.counter.unit, from: [from], to, incendiary: target0.unit.incendiary, critical }))
            if (needDice) { hitRoll.description += `<span style="color: ${failRedColorMarker()};">${
              critical ? "passed (critical)" : "passed"
            }</span>` }
            anims.push({ loc: dHexes[0], type: critical ? "criteffect" : "effect" })
          } else {
            if (needDice) {
              hitRoll.description += `<span style="color: ${passBlueColorMarker()};">no effect</span>`
            }
            anims.push({ loc: dHexes[0], type: "noeffect" })
          }
        }
      } else {
        if (needDice) { targetRoll.description += "miss" }
        anims.push({ loc: to, type: "miss" })
      }
      const breakmod = 0 + (this.intensive ? 1 : 0) +
        (u0.parent && u0.nation !== u0.parent.nation ? 1 : 0)
      if (u0.breakWeaponRoll && targetRoll.result.result <= u0.breakWeaponRoll + breakmod) {
        if (u0.isVehicle) {
          if (sponson) {
            if (u0.breakDestroysSponson) {
              if (needDice) {
                targetRoll.description += `, firing weapon <span style="color: ${failRedColorMarker()};">destroyed</span>`
              }
              if (u0.sponsonSpotting) { removeSpotting(this.game, u0.sponsonSpotting) }
              spotting = false
              u0.sponsonDestroyed = true
              anims.push({ loc: from, type: "destroyed" })
            } else {
              if (needDice) {
                targetRoll.description += `, firing weapon <span style="color: ${failRedColorMarker()};">broken</span>`
              }
              u0.sponsonJammed = true
              if (u0.sponsonSpotting) { removeSpotting(this.game, u0.sponsonSpotting) }
              spotting = false
              anims.push({ loc: from, type: "jammed" })
            }
          } else {
            if (u0.breakDestroysWeapon) {
              if (needDice) {
                targetRoll.description += `, firing weapon <span style="color: ${failRedColorMarker()};">destroyed</span>`
              }
              u0.weaponDestroyed = true
              if (u0.spotting) { removeSpotting(this.game, u0.spotting) }
              spotting = false
              anims.push({ loc: from, type: "destroyed" })
            } else {
              if (needDice) {
                targetRoll.description += `, firing weapon <span style="color: ${failRedColorMarker()};">broken</span>`
              }
              u0.jammed = true
              if (u0.spotting) { removeSpotting(this.game, u0.spotting) }
              spotting = false
              anims.push({ loc: from, type: "jammed" })
            }
          }
        } else if (u0.breakDestroysWeapon ||
                   (u0.parent && u0.nation !== u0.parent.nation)) {
          if (u0.incendiary && u0.parent) {
            this.game.moraleChecksNeeded.push({
              unit: u0.parent, from: [], to, incendiary: true, critical: false,
            })
          }
          this.map.eliminateCounter(from, u0.id)
          if (needDice) {
            targetRoll.description += `, firing weapon <span style="color: ${failRedColorMarker()};">destroyed</span>`
          }
          if (u0.spotting) { removeSpotting(this.game, u0.spotting) }
          spotting = false
          anims.push({ loc: from, type: "destroyed" })
        } else {
          u0.jammed = true
          if (needDice) {
            targetRoll.description += `, firing weapon <span style="color: ${failRedColorMarker()};">broken</span>`
          }
          if (u0.spotting) { removeSpotting(this.game, u0.spotting) }
          spotting = false
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
        if (needDice) { this.diceResults.push({ result: roll2d10() }) }
        const hitRoll = this.diceResults[diceIndex++]
        if (needDice) {
          hitRoll.description = `${
            coords.length > 1 ? `at ${formatCoordinate(c)}: ` : ""
          }target ${formatTarget(hitCheck)}, rolled ${formatDieResult(hitRoll.result)}: `
        }
        if (hitRoll.result.result > hitCheck) {
          this.game.observeNeeded.push(c)
          const critical = critHit(hitRoll.result.result, hitCheck)
          let critMessage = false
          targets.forEach(t => {
            if (t.x === c.x && t.y === c.y) {
              if (!(t.counter.unit.isVehicle && !t.counter.unit.armored) &&
                  !(t.counter.unit.isVehicle && u0.incendiary)) {
                if (critical) { critMessage = true }
              }
            }
          })
          if (needDice) {
            hitRoll.description += `<span style="color: ${failRedColorMarker()};">${
              critMessage ? "critical hit": "hit"
            }</span>`
          }
          targets.forEach(t => {
            if (t.x === c.x && t.y === c.y) {
              if (t.counter.unit.isVehicle && !t.counter.unit.armored) {
                fsHexes = [{ x: t.x, y: t.y, vehicle: t.counter.unit }]
                const hex = t.counter.hex as Coordinate
                if (hex.x != t.x || hex.y !== t.y) {
                  rollbackAddActions(this.map, hex, new Coordinate(t.x, t.y), t.counter.unit.id)
                }
                if (needDice) { hitRoll.description += `, ${this.formatUnit(t.counter.unit)} destroyed` }
                t.counter.unit.wreck(this.game)
                anims.push({ loc: c, type: "wreck" })
              } else if (t.counter.unit.isVehicle && u0.incendiary) {
                fp = firepower(this.game, this.convertAToA(firing), t.counter.unit, to, false, [wire])
                let hitCheck = baseToHit(fp.fp)
                if (hitCheck < 2) { hitCheck = 2 }
                if (needDice) { this.diceResults.push({ result: roll2d10() }) }
                const hitRoll = this.diceResults[diceIndex++]
                if (needDice) {
                  hitRoll.description = `penetration roll${
                    targets.length > 1 ? ` for ${this.formatUnit(t.counter.unit)}` : ""
                  }: target ${formatTarget(hitCheck)}, rolled ${formatDieResult(hitRoll.result)}: `
                }
                if (hitRoll.result.result > hitCheck) {
                  fsHexes = [{ x: t.x, y: t.y, vehicle: t.counter.unit }]
                  const hex = t.counter.hex as Coordinate
                  if (hex.x != t.x || hex.y !== t.y) {
                    rollbackAddActions(this.map, hex, new Coordinate(t.x, t.y), t.counter.unit.id)
                  }
                  if (needDice) {
                    hitRoll.description += `<span style="color: ${failRedColorMarker()};">passed</span>, vehicle destroyed`
                  }
                  t.counter.unit.wreck(this.game)
                  anims.push({ loc: c, type: "wreck" })
                } else {
                  if (needDice) { hitRoll.description += `<span style="color: ${passBlueColorMarker()};">failed</span>` }
                  anims.push({ loc: c, type: "nowreck" })
                }
              } else {
                this.game.moraleChecksNeeded.push({
                  unit: t.counter.unit, from: fcoords, to: c, incendiary: u0.incendiary, critical
                })
              }
            }
          })
          anims.push({ loc: c, type: critMessage ? "crit" : "hit" })
        } else {
          if (needDice) { hitRoll.description += `<span style="color: ${passBlueColorMarker()};">miss</span>` }
          anims.push({ loc: c, type: "miss" })
        }
        for (const f of firing) {
          const from = new Coordinate(f.x, f.y)
          const breakmod = 0 + (this.intensive ? 1 : 0) +
            (f.counter.unit.parent && f.counter.unit.nation !== f.counter.unit.parent.nation ? 1 : 0)
          if (f.counter.unit.breakWeaponRoll && hitRoll.result.result <= f.counter.unit.breakWeaponRoll + breakmod) {
            if (f.counter.unit.isVehicle) {
              if (sponson) {
                if (f.counter.unit.breakDestroysSponson) {
                  f.counter.unit.sponsonDestroyed = true
                  if (needDice) {
                    hitRoll.description += `, firing weapon <span style="color: ${failRedColorMarker()};">destroyed</span>`
                  }
                  if (u0.sponsonSpotting) { removeSpotting(this.game, u0.sponsonSpotting) }
                  anims.push({ loc: from, type: "destroyed" })
                } else {
                  f.counter.unit.sponsonJammed = true
                  if (needDice) {
                    hitRoll.description += `, firing weapon <span style="color: ${failRedColorMarker()};">broken</span>`
                  }
                  if (u0.sponsonSpotting) { removeSpotting(this.game, u0.sponsonSpotting) }
                  anims.push({ loc: from, type: "jammed" })
                }
              } else {
                if (f.counter.unit.breakDestroysWeapon) {
                  f.counter.unit.weaponDestroyed = true
                  if (needDice) {
                    hitRoll.description += `, firing weapon <span style="color: ${failRedColorMarker()};">destroyed</span>`
                  }
                  if (u0.spotting) { removeSpotting(this.game, u0.spotting) }
                  anims.push({ loc: from, type: "destroyed" })
                } else {
                  f.counter.unit.jammed = true
                  if (needDice) {
                    hitRoll.description += `, firing weapon <span style="color: ${failRedColorMarker()};">broken</span>`
                  }
                  if (u0.spotting) { removeSpotting(this.game, u0.spotting) }
                  anims.push({ loc: from, type: "jammed" })
                }
              }
            } else if (f.counter.unit.breakDestroysWeapon ||
                       (u0.parent && u0.nation !== u0.parent.nation)) {
              const hex = new Coordinate(f.x, f.y)
              if (f.counter.unit.incendiary && f.counter.unit.parent) {
                this.game.moraleChecksNeeded.push({
                  unit: f.counter.unit.parent, from: [], to: hex, incendiary: true, critical: false,
                })
              }
              this.map.eliminateCounter(hex, f.counter.unit.id)
              if (needDice) {
                hitRoll.description += `, ${this.formatUnit(f.counter.unit)} ` +
                  `<span style="color: ${failRedColorMarker()};">destroyed</span>`
              }
              if (u0.spotting) { removeSpotting(this.game, u0.spotting) }
              anims.push({ loc: from, type: "destroyed" })
            } else {
              f.counter.unit.jammed = true
              f.counter.unit.resetStatus()
              if (needDice) {
                hitRoll.description += `, ${this.formatUnit(f.counter.unit)} ` +
                  `<span style="color: ${failRedColorMarker()};">broken</span>`
              }

              if (u0.spotting) { removeSpotting(this.game, u0.spotting) }
              anims.push({ loc: from, type: "jammed" })
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
    if (this.player === 1 ? this.game.axisSniper : this.game.alliedSniper) {
      this.origin.forEach(o => {
        const unit = this.game.findUnitById(o.id)
        if (unit?.canCarrySupport) { this.game.addSniper( { unit, loc: new Coordinate(o.x, o.y) }) }
      })
    }
    if (!smoke) {
      for (const f of fsHexes) {
        if (f.x >= 0 && f.x < this.map.width && f.y >= 0 && f.y < this.map.height) {
          const vehicle_incendiary = f.vehicle !== undefined &&
            (f.vehicle.incendiary || f.vehicle.sponson?.type === sponsonType.Flame)
          const loc = new Coordinate(f.x, f.y)
          const crew = f.vehicle && ["tank", "spg"].includes(target0.unit.type) && !target0.unit.isAbandoned
          if (crew) {
            this.game.addFireCheck({
              loc, vehicle: true, incendiary, vehicle_incendiary, tank: true,
              nation: target0.unit.nation, player_nation: target0.unit.playerNation
            })
          } else if (fireStartTarget(
                      this.map, loc, f.vehicle !== undefined, incendiary,
                      vehicle_incendiary) > 1) {
            this.game.addFireCheck({
              loc, vehicle: f.vehicle !== undefined, incendiary, vehicle_incendiary,
            })
          }
        }
      }
    }
    if (spotting) { addSpotting(this.game, to, u0, sponson) }
    sortStacks(this.map)
    this.game.updateInitiative(2)
    if (this.game.moraleChecksNeeded.length > 0) {
      if (this.reaction && this.moveSeq) {
        this.game.shortCheckNeeded = {
          hit: true, short: false, ids: [], coords: [new Coordinate(this.target[0].x, this.target[0].y)]
        }
      }
      let check = false
      for (const mc of this.game.moraleChecksNeeded) {
        if (mc.unit.playerNation !== this.game.currentPlayerNation) { check = true }
      }
      if (check) { this.game.togglePlayer() }
    } else if (!this.reaction || this.game.sniperNeeded.length < 1) {
      this.game.resetCurrentPlayer()
    }
    this.game.addActionAnimations(anims)
  }
}
