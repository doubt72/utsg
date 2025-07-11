import { Coordinate, hexOpenType, unitStatus } from "../../utilities/commonTypes"
import Unit from "../Unit"
import { describe, expect, test } from "vitest"
import {
  openHexMovement, showLaySmoke, showLoadMove, showDropMove, mapSelectMovement
} from "./movement"
import select from "./select"
import { addActionType } from "../GameAction"
import WarningActionError from "../actions/WarningActionError"
import organizeStacks from "../support/organizeStacks"
import { createTestGame, testGCrew, testGGun, testGInf, testGLdr, testGMG } from "./movement.test"
import { actionType, GameActionState, MoveActionState } from "./gameActions"

describe("rush tests", () => {
  test("rush along road", () => {
    const game = createTestGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 3
    unit.status = unitStatus.Activated
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.startMove()

    const state = game.gameActionState as GameActionState

    expect(state.player).toBe(2)
    expect(state.currentAction).toBe(actionType.Move)
    expect(state.selection[0].id).toBe("test1")

    expect(mapSelectMovement(game, false)).toBe(1)
    expect(mapSelectMovement(game, true)).toBe(2)

    const move = state.move as MoveActionState

    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(hexOpenType.All)

    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(false)
    expect(showLoadMove(game)).toBe(false)

    game.move(3, 2)
    expect(move.path.length).toBe(2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.move(2, 2)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(hexOpenType.Closed)

    game.finishMove()
    let all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.status).toBe(unitStatus.Exhausted)

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.status).toBe(unitStatus.Activated)
  })

  test("can't rush when sw reduces move to zero", () => {
    const game = createTestGame()
    const map = game.scenario.map

    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 3
    unit.status = unitStatus.Activated
    unit.select()
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, unit)

    const unit2 = new Unit(testGMG)
    unit2.id = "test2"
    map.addCounter(loc, unit2)
    organizeStacks(map)

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(state.selection.length).toBe(2)

    expect(move.doneSelect).toBe(true)

    expect(mapSelectMovement(game, false)).toBe(0)
    expect(mapSelectMovement(game, true)).toBe(0)

    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)
  })

  test("smoke", () => {
    const game = createTestGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.status = unitStatus.Activated
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.startMove()
    game.placeSmokeToggle()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(move.doneSelect).toBe(true)
    expect(move.placingSmoke).toBe(true)
    expect(move.droppingMove).toBe(false)
    expect(move.loadingMove).toBe(false)

    expect(mapSelectMovement(game, false)).toBe(2)
    expect(mapSelectMovement(game, true)).toBe(3)

    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(0, 0))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(2)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(2)

    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(false)
    expect(showLoadMove(game)).toBe(false)

    expect(move.addActions.length).toBe(0)
    game.move(3, 3)
    expect(move.addActions.length).toBe(1)
    expect(map.units[3][3].filter(u => u.ghost).length).toBe(1)
    expect(move.path.length).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.placeSmokeToggle()
    expect(showLaySmoke(game)).toBe(false)
    expect(move.placingSmoke).toBe(false)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.finishMove()
    expect(map.units[3][3].filter(u => u.ghost).length).toBe(0)

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(3)
    expect(all[1].feature.name).toBe("Smoke")
  })

  test("multi-select", () => {
    const game = createTestGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 3
    unit.status = unitStatus.Activated
    unit.select()
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, unit)

    const unit2 = new Unit(testGInf)
    unit2.id = "test2"
    unit2.status = unitStatus.Tired
    map.addCounter(loc, unit2)

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(state.selection.length).toBe(2)
    expect(move.doneSelect).toBe(false)

    expect(mapSelectMovement(game, false)).toBe(1)
    expect(mapSelectMovement(game, true)).toBe(2)

    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(hexOpenType.All)

    game.move(3, 2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.move(2, 2)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(hexOpenType.Closed)

    game.finishMove()

    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Exhausted)
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("Rifle")
    expect(all[1].unit.status).toBe(unitStatus.Exhausted)

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Tired)
    expect(all[1].hex?.x).toBe(4)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("Rifle")
    expect(all[1].unit.status).toBe(unitStatus.Activated)
  })

  test("multi-select drop-off", () => {
    const game = createTestGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 3
    unit.smokeCapable = false // any unit in stack is enough for smoke
    unit.status = unitStatus.Activated
    unit.select()
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, unit)

    const unit2 = new Unit(testGInf)
    unit2.id = "test2"
    unit2.baseMovement = 3
    map.addCounter(loc, unit2)

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(move.doneSelect).toBe(false)
    expect(move.placingSmoke).toBe(false)
    expect(move.droppingMove).toBe(false)
    expect(move.loadingMove).toBe(false)

    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(state.selection.length).toBe(2)
    expect(move.doneSelect).toBe(false)

    expect(mapSelectMovement(game, false)).toBe(1)
    expect(mapSelectMovement(game, true)).toBe(2)

    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(hexOpenType.All)

    move.droppingMove = true
    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    move.droppingMove = false
    expect(move.addActions.length).toBe(1)

    game.move(3, 2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.move(2, 2)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(hexOpenType.Closed)

    game.finishMove()

    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Exhausted)
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("Rifle")
    expect(all[1].unit.status).toBe(unitStatus.Exhausted)

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Normal)
    expect(all[1].hex?.x).toBe(4)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("Rifle")
    expect(all[1].unit.status).toBe(unitStatus.Activated)
  })

  test("multiselect with leader", () => {
    const game = createTestGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.status = unitStatus.Activated
    unit.select()
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, unit)

    const unit2 = new Unit(testGLdr)
    unit2.id = "test2"
    map.addCounter(loc, unit2)

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(state.selection.length).toBe(2)

    expect(mapSelectMovement(game, false)).toBe(3)
    expect(mapSelectMovement(game, true)).toBe(4)

    expect(openHexMovement(map, loc, new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, loc, new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, loc, new Coordinate(3, 3))).toBe(2)

    game.move(3, 2)
    expect(move.path.length).toBe(2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(2)

    // Check if dropping leader reduces total movement
    move.addActions.push({ x: 3, y: 2, type: addActionType.Drop, cost: 0, id: "test2" })
    expect(mapSelectMovement(game, false)).toBe(2)
    expect(mapSelectMovement(game, true)).toBe(3)
    // Undo
    move.addActions.pop()

    game.move(2, 2)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(1)

    game.move(1, 2)
    expect(openHexMovement(map, new Coordinate(1, 2), new Coordinate(0, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(1, 2), new Coordinate(0, 3))).toBe(hexOpenType.Closed)

    game.move(0, 2)
    expect(openHexMovement(map, new Coordinate(0, 2), new Coordinate(1, 2))).toBe(hexOpenType.Closed)
    expect(showDropMove(game)).toBe(false)

    game.finishMove()

    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(0)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Exhausted)
    expect(all[1].hex?.x).toBe(0)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("Leader")
    expect(all[1].unit.status).toBe(unitStatus.Exhausted)

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Activated)
    expect(all[1].hex?.x).toBe(4)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("Leader")
    expect(all[1].unit.status).toBe(unitStatus.Normal)
  })

  test("cannot pick up sw", () => {
    const game = createTestGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.status = unitStatus.Activated
    unit.select()
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, unit)

    const unit2 = new Unit(testGMG)
    unit2.id = "test2"
    try {
      map.addCounter(new Coordinate(3, 2), unit2)
    } catch(err) {
      // Warning expected for placing a unit by itself
      expect(err instanceof WarningActionError).toBe(true)
    }

    game.startMove()

    expect(showLoadMove(game)).toBe(false)

    game.move(3, 2)
    expect(showLoadMove(game)).toBe(false)
  })

  test("leader carrying sw", () => {
    const game = createTestGame()
    const map = game.scenario.map

    const unit = new Unit(testGLdr)
    unit.id = "test1"
    unit.status = unitStatus.Activated
    unit.select()
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, unit)

    const unit2 = new Unit(testGMG)
    unit2.id = "test2"
    unit2.status = unitStatus.Activated
    map.addCounter(loc, unit2)
    organizeStacks(map)
    expect(unit.children.length).toBe(0)

    map.units[2][4].reverse()
    unit2.baseMovement = 0
    organizeStacks(map)
    expect(unit.children.length).toBe(1)

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(state.selection.length).toBe(2)

    expect(move.doneSelect).toBe(true)

    expect(mapSelectMovement(game, false)).toBe(1)
    expect(mapSelectMovement(game, true)).toBe(2)

    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(hexOpenType.All)

    game.move(3, 2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.move(2, 2)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(hexOpenType.Closed)

    game.finishMove()

    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Leader")
    expect(all[0].unit.status).toBe(unitStatus.Exhausted)
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("MG 08/15")
    expect(all[1].unit.status).toBe(unitStatus.Exhausted)

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Leader")
    expect(all[0].unit.status).toBe(unitStatus.Activated)
    expect(all[1].hex?.x).toBe(4)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("MG 08/15")
    expect(all[1].unit.status).toBe(unitStatus.Activated)
  })

  test("drop sw", () => {
    const game = createTestGame()
    const map = game.scenario.map

    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.status = unitStatus.Activated
    unit.select()
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, unit)

    const unit2 = new Unit(testGMG)
    unit2.id = "test2"
    map.addCounter(loc, unit2)
    organizeStacks(map)

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(mapSelectMovement(game, false)).toBe(1)
    expect(mapSelectMovement(game, true)).toBe(2)

    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(hexOpenType.All)

    // Testing drop at initial location and other locations
    move.droppingMove = true
    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    move.droppingMove = false
    expect(move.addActions.length).toBe(1)

    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.finishMove()

    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.parent?.name).toBe(undefined)
    expect(all[0].unit.name).toBe("MG 08/15")
    expect(all[0].unit.status).toBe(unitStatus.Exhausted)
    expect(all[1].hex?.x).toBe(4)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.children.length).toBe(0)
    expect(all[1].unit.name).toBe("Rifle")
    expect(all[1].unit.status).toBe(unitStatus.Exhausted)

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Activated)
    expect(all[1].hex?.x).toBe(4)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.parent?.name).toBe("Rifle")
    expect(all[1].unit.name).toBe("MG 08/15")
    expect(all[1].unit.status).toBe(unitStatus.Normal)
  })

  test("can't pick up gun", () => {
    const game = createTestGame()
    const map = game.scenario.map
    const unit = new Unit(testGCrew)
    unit.id = "test1"
    unit.status = unitStatus.Activated
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    const unit2 = new Unit(testGGun)
    unit2.id = "test2"
    unit2.facing = 1
    try {
      map.addCounter(new Coordinate(3, 2), unit2)
    } catch(err) {
      // Warning expected for placing a unit by itself
      expect(err instanceof WarningActionError).toBe(true)
    }

    game.startMove()

    expect(showLoadMove(game)).toBe(false)

    // Can't load after moving
    game.move(3, 2)
    expect(showLoadMove(game)).toBe(false)
  })

  test("can't pick up gun even from same hex", () => {
    const game = createTestGame()
    const map = game.scenario.map
    const unit = new Unit(testGCrew)
    unit.status = unitStatus.Activated
    const loc = new Coordinate(3, 2)

    const unit2 = new Unit(testGGun)
    unit2.id = "test2"
    unit2.facing = 1
    try {
      map.addCounter(loc, unit2)
    } catch(err) {
      // Warning expected for placing a unit by itself
      expect(err instanceof WarningActionError).toBe(true)
    }

    unit.id = "test1"
    unit.select()
    map.addCounter(loc, unit)

    game.startMove()

    expect(showLoadMove(game)).toBe(false)
  })
});
