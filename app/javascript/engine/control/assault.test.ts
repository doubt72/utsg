import {
  baseTerrainType, Coordinate, hexOpenType, unitStatus
} from "../../utilities/commonTypes"
import Unit from "../Unit"
import { actionType, GameActionState, AssaultMoveActionState } from "../Game"
import { describe, expect, test } from "vitest"
import select from "./select"
import organizeStacks from "../support/organizeStacks"
import { openHexRotateOpen, openHexRotatePossible } from "./openHex"
import {
  createTestGame, testGCrew, testGGun, testGInf, testGLdr, testGMG, testGTank, testGTruck, testRInf, testWire
} from "./movement.test"
import { openHexAssaulting, showClearObstacles, showEntrench } from "./assault"
import Feature from "../Feature"

describe("assault movement tests", () => {
  test("along road", () => {
    const game = createTestGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.startAssault()

    const state = game.gameActionState as GameActionState

    expect(state.player).toBe(2)
    expect(state.currentAction).toBe(actionType.Assault)
    expect(state.selection[0].id).toBe("test1")

    const assault = state.assault as AssaultMoveActionState

    expect(assault.path[0].x).toBe(4)
    expect(assault.path[0].y).toBe(2)
    expect(assault.doneSelect).toBe(true)

    expect(openHexAssaulting(map, new Coordinate(4, 2), new Coordinate(0, 0))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(hexOpenType.All)

    game.assault(3, 2)
    expect(assault.path.length).toBe(2)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.finishAssault()
    const all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.status).toBe(unitStatus.Exhausted)
  })

  test("along road over water", () => {
    const game = createTestGame([
      [{ t: "o" }, { t: "o" }, { t: "w" }, { t: "o" }, { t: "o" }],
      [{ t: "o" }, { t: "o" }, { t: "w" }, { t: "o" }, { t: "o" }],
      [
        { t: "o", r: { d: [1, 4]} },
        { t: "o", r: { d: [1, 4]} },
        { t: "w", r: { d: [1, 4]} },
        { t: "o", r: { d: [1, 4]} },
        { t: "o", r: { d: [1, 4]} },
      ],
      [{ t: "o" }, { t: "o" }, { t: "w" }, { t: "f" }, { t: "o" }],
      [{ t: "o" }, { t: "o" }, { t: "w" }, { t: "o" }, { t: "o" }],
    ])
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 3
    unit.select()
    map.addCounter(new Coordinate(3, 2), unit)

    game.startAssault()

    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.assault(2, 2)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.finishAssault()
    const all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.status).toBe(unitStatus.Exhausted)
  })

  test("along railroad over water", () => {
    const game = createTestGame([
      [{ t: "o" }, { t: "o" }, { t: "w" }, { t: "o" }, { t: "o" }],
      [{ t: "o" }, { t: "o" }, { t: "w" }, { t: "o" }, { t: "o" }],
      [
        { t: "o", rr: { d: [[1, 4]]} },
        { t: "o", rr: { d: [[1, 4]]} },
        { t: "w", rr: { d: [[1, 4]]} },
        { t: "o", rr: { d: [[1, 4]]} },
        { t: "o", rr: { d: [[1, 4]]} },
      ],
      [{ t: "o" }, { t: "o" }, { t: "w" }, { t: "f" }, { t: "o" }],
      [{ t: "o" }, { t: "o" }, { t: "w" }, { t: "o" }, { t: "o" }],
    ])
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    map.addCounter(new Coordinate(3, 2), unit)

    game.startAssault()

    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.assault(2, 2)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.finishAssault()
    const all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.status).toBe(unitStatus.Exhausted)
  })

  test("tired assault", () => {
    const game = createTestGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.status = unitStatus.Tired
    unit.select()
    map.addCounter(new Coordinate(3, 2), unit)

    game.startAssault()

    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.All)

    game.assault(2, 2)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.finishAssault()
    let all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.status).toBe(unitStatus.Exhausted)

    game.executeUndo()
    all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.status).toBe(unitStatus.Tired)
  })

  test("multi-select", () => {
    const game = createTestGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.smokeCapable = false // any unit in stack is enough for smoke
    unit.select()
    const loc = new Coordinate(3, 2)
    map.addCounter(loc, unit)

    const unit2 = new Unit(testGInf)
    unit2.id = "test2"
    map.addCounter(loc, unit2)

    game.startAssault()

    const state = game.gameActionState as GameActionState
    const assault = state.assault as AssaultMoveActionState

    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(state.selection.length).toBe(2)
    expect(assault.doneSelect).toBe(false)

    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.All)

    game.assault(2, 2)
    expect(assault.doneSelect).toBe(true)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.finishAssault()

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Exhausted)
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("Rifle")
    expect(all[1].unit.status).toBe(unitStatus.Exhausted)
  })

  test ("can't assault overstack, can into enemy", () => {
    const game = createTestGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, unit)

    const unit2 = new Unit(testGInf)
    unit2.id = "test2"
    map.addCounter(loc, unit2)

    const unit3 = new Unit(testGInf)
    unit3.id = "test3"
    map.addCounter(new Coordinate(3, 3), unit3)

    const unit4 = new Unit(testRInf)
    unit4.id = "test4"
    map.addCounter(new Coordinate(3, 2), unit4)

    game.startAssault()

    const state = game.gameActionState as GameActionState
    const assault = state.assault as AssaultMoveActionState

    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(state.selection.length).toBe(2)
    expect(assault.doneSelect).toBe(false)

    expect(openHexAssaulting(map, loc, new Coordinate(3, 2))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, loc, new Coordinate(4, 3))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, loc, new Coordinate(3, 3))).toBe(hexOpenType.Closed)
  })

  test("multiselect with leader", () => {
    const game = createTestGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    const loc = new Coordinate(3, 2)
    map.addCounter(loc, unit)

    const unit2 = new Unit(testGLdr)
    unit2.id = "test2"
    map.addCounter(loc, unit2)

    game.startAssault()

    const state = game.gameActionState as GameActionState
    const assault = state.assault as AssaultMoveActionState

    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(state.selection.length).toBe(2)

    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.All)

    game.assault(2, 2)
    expect(assault.doneSelect).toBe(true)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.finishAssault()

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Exhausted)
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("Leader")
    expect(all[1].unit.status).toBe(unitStatus.Exhausted)
  })

  test("carrying sw", () => {
    const game = createTestGame()
    const map = game.scenario.map

    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    const loc = new Coordinate(3, 2)
    map.addCounter(loc, unit)

    const unit2 = new Unit(testGMG)
    unit2.id = "test2"
    map.addCounter(loc, unit2)
    organizeStacks(map)

    game.startAssault()

    const state = game.gameActionState as GameActionState
    const assault = state.assault as AssaultMoveActionState

    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.All)

    game.assault(2, 2)
    expect(assault.doneSelect).toBe(true)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.finishAssault()

    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Exhausted)
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("MG 08/15")
    expect(all[1].unit.status).toBe(unitStatus.Exhausted)

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Normal)
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("MG 08/15")
    expect(all[1].unit.status).toBe(unitStatus.Normal)
  })

  test("leader carrying sw", () => {
    const game = createTestGame()
    const map = game.scenario.map

    const loc = new Coordinate(3, 2)
    const unit = new Unit(testGLdr)
    unit.id = "test1"
    unit.select()
    map.addCounter(loc, unit)

    const unit2 = new Unit(testGMG)
    unit2.id = "test2"
    unit2.baseMovement = 0
    map.addCounter(loc, unit2)
    organizeStacks(map)

    game.startAssault()

    const state = game.gameActionState as GameActionState
    const assault = state.assault as AssaultMoveActionState

    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.All)

    game.assault(2, 2)
    expect(assault.doneSelect).toBe(true)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.finishAssault()

    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Leader")
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("MG 08/15")

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Leader")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("MG 08/15")
  })

  test("snow assault", () => {
    const game = createTestGame()
    const map = game.scenario.map
    map.baseTerrain = baseTerrainType.Snow
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.startAssault()

    const state = game.gameActionState as GameActionState
    const assault = state.assault as AssaultMoveActionState

    expect(openHexAssaulting(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(hexOpenType.All)

    game.assault(3, 2)
    expect(assault.path.length).toBe(2)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.finishAssault()
    const all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.status).toBe(unitStatus.Exhausted)
  })

  test("tank assault", () => {
    const game = createTestGame()
    const map = game.scenario.map
    const unit = new Unit(testGTank)
    unit.id = "test1"
    unit.facing = 1
    unit.turretFacing = 1
    unit.select()
    map.addCounter(new Coordinate(3, 2), unit)

    game.startAssault()

    const state = game.gameActionState as GameActionState
    const assault = state.assault as AssaultMoveActionState

    expect(assault.path[0].facing).toBe(1)
    expect(assault.path[0].turret).toBe(1)

    expect(openHexRotateOpen(map)).toBe(false)
    expect(openHexRotatePossible(map)).toBe(false)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(3, 1))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.assault(3, 1)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexAssaulting(map, new Coordinate(3, 1), new Coordinate(2, 1))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(3, 1), new Coordinate(4, 1))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(3, 1), new Coordinate(3, 2))).toBe(hexOpenType.Closed)

    game.assaultRotate(3, 1, 2)

    game.finishAssault()

    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(1)
    expect(all[0].marker.facing).toBe(3)
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(1)
    expect(all[1].unit.facing).toBe(3)
    expect(all[1].unit.turretFacing).toBe(2)
    expect(all[1].unit.status).toBe(unitStatus.Exhausted)

    game.executeUndo()
    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].marker.facing).toBe(1)
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.facing).toBe(1)
    expect(all[1].unit.turretFacing).toBe(1)
    expect(all[1].unit.status).toBe(unitStatus.Normal)
  })

  test("truck assault", () => {
    const game = createTestGame()
    const map = game.scenario.map
    const loc = new Coordinate(3, 2)

    const unit = new Unit(testGTruck)
    unit.id = "test1"
    unit.facing = 1
    unit.select()
    map.addCounter(loc, unit)

    const unit2 = new Unit(testGGun)
    unit2.id = "test2"
    unit2.facing = 4
    map.addCounter(loc, unit2)

    const unit3 = new Unit(testGCrew)
    unit3.id = "test3"
    map.addCounter(loc, unit3)

    organizeStacks(map)

    game.startAssault()

    const state = game.gameActionState as GameActionState
    const assault = state.assault as AssaultMoveActionState

    expect(assault.path[0].facing).toBe(1)

    expect(openHexRotateOpen(map)).toBe(false)
    expect(openHexRotatePossible(map)).toBe(false)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(3, 1))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.assault(3, 1)
    expect(openHexRotateOpen(map)).toBe(false)
    expect(openHexRotatePossible(map)).toBe(false)
    expect(openHexAssaulting(map, new Coordinate(3, 1), new Coordinate(2, 1))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(3, 1), new Coordinate(4, 1))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(3, 1), new Coordinate(3, 2))).toBe(hexOpenType.Closed)

    game.finishAssault()

    let all = map.allCounters
    expect(all.length).toBe(3)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(1)
    expect(all[0].unit.parent?.name).toBe(undefined)
    expect(all[0].unit.name).toBe("Opel Blitz")
    expect(all[0].unit.children.length).toBe(2)
    expect(all[0].unit.facing).toBe(3)
    expect(all[0].unit.status).toBe(unitStatus.Exhausted)
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(1)
    expect(all[1].unit.children.length).toBe(0)
    expect(all[1].unit.name).toBe("3.7cm Pak 36")
    expect(all[1].unit.parent?.name).toBe("Opel Blitz")
    expect(all[1].unit.facing).toBe(6)
    expect(all[1].unit.status).toBe(unitStatus.Exhausted)
    expect(all[2].hex?.x).toBe(3)
    expect(all[2].hex?.y).toBe(1)
    expect(all[2].unit.children.length).toBe(0)
    expect(all[2].unit.name).toBe("Crew")
    expect(all[2].unit.parent?.name).toBe("Opel Blitz")
    expect(all[2].unit.status).toBe(unitStatus.Exhausted)

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(3)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.parent?.name).toBe(undefined)
    expect(all[0].unit.name).toBe("Opel Blitz")
    expect(all[0].unit.children.length).toBe(2)
    expect(all[0].unit.facing).toBe(1)
    expect(all[0].unit.status).toBe(unitStatus.Normal)
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.children.length).toBe(0)
    expect(all[1].unit.name).toBe("3.7cm Pak 36")
    expect(all[1].unit.parent?.name).toBe("Opel Blitz")
    expect(all[1].unit.facing).toBe(4)
    expect(all[1].unit.status).toBe(unitStatus.Normal)
    expect(all[2].hex?.x).toBe(3)
    expect(all[2].hex?.y).toBe(2)
    expect(all[2].unit.children.length).toBe(0)
    expect(all[2].unit.name).toBe("Crew")
    expect(all[2].unit.parent?.name).toBe("Opel Blitz")
    expect(all[2].unit.status).toBe(unitStatus.Normal)
  })

  test("assaulting into wire", () => {
    const game = createTestGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    map.addCounter(new Coordinate(3, 2), unit)

    const feature = new Feature(testWire)
    feature.id = "wire"
    map.addCounter(new Coordinate(2, 2), feature)

    game.startAssault()

    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.All)

    game.assault(2, 2)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.finishAssault()

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].feature.name).toBe("Wire")
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].feature.name).toBe("Rifle")
  })

  test("assaulting out of wire", () => {
    const game = createTestGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    map.addCounter(new Coordinate(3, 2), unit)

    const feature = new Feature(testWire)
    feature.id = "wire"
    map.addCounter(new Coordinate(3, 2), feature)

    game.startAssault()

    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.All)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.All)

    game.assault(2, 2)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(2, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.finishAssault()

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].feature.name).toBe("Wire")
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].feature.name).toBe("Rifle")
    expect(all[1].unit.status).toBe(unitStatus.Exhausted)
  })

  test("clearing wire", () => {
    const game = createTestGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    map.addCounter(new Coordinate(3, 2), unit)

    const feature = new Feature(testWire)
    feature.id = "wire"
    map.addCounter(new Coordinate(3, 2), feature)

    game.startAssault()

    expect(showClearObstacles(game)).toBe(false)
    unit.engineer = true
    expect(showClearObstacles(game)).toBe(true)

    game.assaultClear()

    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.finishAssault()

    let all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].feature.name).toBe("Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Exhausted)

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].feature.name).toBe("Wire")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].feature.name).toBe("Rifle")
    expect(all[1].unit.status).toBe(unitStatus.Normal)
  })

  test("entrenching", () => {
    const game = createTestGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    map.addCounter(new Coordinate(3, 2), unit)

    game.startAssault()

    expect(showClearObstacles(game)).toBe(false)
    expect(showEntrench(game)).toBe(true)

    game.assaultEntrench()

    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)
    expect(openHexAssaulting(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.finishAssault()

    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].feature.name).toBe("Shell Scrape")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].feature.name).toBe("Rifle")
    expect(all[1].unit.status).toBe(unitStatus.Exhausted)

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].feature.name).toBe("Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Normal)
  })

  test("can't entrench in sand", () => {
    const game = createTestGame([
      [{ t: "s" }, { t: "s" }, { t: "s" }, { t: "s" }, { t: "s" }],
      [{ t: "s" }, { t: "s" }, { t: "s" }, { t: "s" }, { t: "s" }],
      [{ t: "s" }, { t: "s" }, { t: "s" }, { t: "s" }, { t: "s" }],
      [{ t: "s" }, { t: "s" }, { t: "s" }, { t: "s" }, { t: "s" }],
      [{ t: "s" }, { t: "s" }, { t: "s" }, { t: "s" }, { t: "s" }],
    ])
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    map.addCounter(new Coordinate(3, 2), unit)

    game.startAssault()

    expect(showClearObstacles(game)).toBe(false)
    expect(showEntrench(game)).toBe(false)
    
  })

  test("can't entrench in snow", () => {
    const game = createTestGame()
    const map = game.scenario.map
    map.baseTerrain = "s"
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    map.addCounter(new Coordinate(3, 2), unit)

    game.startAssault()

    expect(showClearObstacles(game)).toBe(false)
    expect(showEntrench(game)).toBe(false)
    
  })

  test("assaulting into mines", () => {
    // TODO: implement fire first
  })
});
