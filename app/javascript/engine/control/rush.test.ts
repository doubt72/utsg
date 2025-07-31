import { Coordinate, hexOpenType, unitStatus } from "../../utilities/commonTypes"
import Unit from "../Unit"
import { describe, expect, test } from "vitest"
import { showLaySmoke, showLoadMove, showDropMove, mapSelectMovement } from "./movement"
import select from "./select"
import { gameActionAddActionType } from "../GameAction"
import WarningActionError from "../actions/WarningActionError"
import organizeStacks from "../support/organizeStacks"
import { createMoveGame, testGCrew, testGGun, testGInf, testGLdr, testGMG } from "./testHelpers"
import MoveState from "./state/MoveState"
import { stateType } from "./state/BaseState"

describe("rush tests", () => {
  test("rush along road", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 3
    unit.status = unitStatus.Activated
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.gameState = new MoveState(game)

    expect(game.gameState.player).toBe(2)
    expect(game.gameState.type).toBe(stateType.Move)
    expect(game.gameState.selection[0].id).toBe("test1")

    expect(mapSelectMovement(game, false)).toBe(1)
    expect(mapSelectMovement(game, true)).toBe(2)
    expect(game.gameState.openHex(3, 2)).toBe(1)
    expect(game.gameState.openHex(4, 3)).toBe(1)
    expect(game.gameState.openHex(3, 3)).toBe(hexOpenType.All)

    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(false)
    expect(showLoadMove(game)).toBe(false)

    game.moveState.move(3, 2)
    expect(game.moveState.path.length).toBe(2)
    expect(game.gameState.openHex(2, 2)).toBe(1)
    expect(game.gameState.openHex(2, 3)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(3, 3)).toBe(hexOpenType.Closed)

    game.moveState.move(2, 2)
    expect(game.gameState.openHex(1, 2)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(1, 3)).toBe(hexOpenType.Closed)

    game.gameState.finish()
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
    const game = createMoveGame()
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

    game.gameState = new MoveState(game)

    expect(game.moveState.selection.length).toBe(2)

    expect(game.moveState.doneSelect).toBe(true)

    expect(mapSelectMovement(game, false)).toBe(0)
    expect(mapSelectMovement(game, true)).toBe(0)

    expect(game.gameState.openHex(3, 2)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(4, 3)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(3, 3)).toBe(hexOpenType.Closed)
  })

  test("smoke", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.status = unitStatus.Activated
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.gameState = new MoveState(game)
    game.moveState.smokeToggle()

    expect(game.moveState.doneSelect).toBe(true)
    expect(game.moveState.smoke).toBe(true)
    expect(game.moveState.dropping).toBe(false)
    expect(game.moveState.loading).toBe(false)

    expect(mapSelectMovement(game, false)).toBe(2)
    expect(mapSelectMovement(game, true)).toBe(3)

    expect(game.gameState.openHex(0, 0)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(4, 2)).toBe(1)
    expect(game.gameState.openHex(3, 2)).toBe(2)
    expect(game.gameState.openHex(3, 3)).toBe(2)

    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(false)
    expect(showLoadMove(game)).toBe(false)

    expect(game.moveState.addActions.length).toBe(0)
    game.moveState.move(3, 3)
    expect(game.moveState.addActions.length).toBe(1)
    expect(map.units[3][3].filter(u => u.ghost).length).toBe(1)
    expect(game.moveState.path.length).toBe(1)
    expect(game.gameState.openHex(4, 2)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(3, 2)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(3, 3)).toBe(hexOpenType.Closed)

    game.moveState.smokeToggle()
    expect(showLaySmoke(game)).toBe(false)
    expect(game.moveState.smoke).toBe(false)
    expect(game.gameState.openHex(3, 2)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(4, 3)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(3, 3)).toBe(hexOpenType.Closed)

    game.gameState.finish()
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
    const game = createMoveGame()
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

    game.gameState = new MoveState(game)

    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(game.gameState.selection.length).toBe(2)
    expect(game.moveState.doneSelect).toBe(false)

    expect(mapSelectMovement(game, false)).toBe(1)
    expect(mapSelectMovement(game, true)).toBe(2)

    expect(game.gameState.openHex(3, 2)).toBe(1)
    expect(game.gameState.openHex(4, 3)).toBe(1)
    expect(game.gameState.openHex(3, 3)).toBe(hexOpenType.All)

    game.moveState.move(3, 2)
    expect(game.gameState.openHex(2, 2)).toBe(1)
    expect(game.gameState.openHex(2, 3)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(3, 3)).toBe(hexOpenType.Closed)

    game.moveState.move(2, 2)
    expect(game.gameState.openHex(1, 2)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(1, 3)).toBe(hexOpenType.Closed)

    game.gameState.finish()

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
    const game = createMoveGame()
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

    game.gameState = new MoveState(game)

    expect(game.moveState.doneSelect).toBe(false)
    expect(game.moveState.smoke).toBe(false)
    expect(game.moveState.dropping).toBe(false)
    expect(game.moveState.loading).toBe(false)

    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(game.gameState.selection.length).toBe(2)
    expect(game.moveState.doneSelect).toBe(false)

    expect(mapSelectMovement(game, false)).toBe(1)
    expect(mapSelectMovement(game, true)).toBe(2)

    expect(game.gameState.openHex(3, 2)).toBe(1)
    expect(game.gameState.openHex(4, 3)).toBe(1)
    expect(game.gameState.openHex(3, 3)).toBe(hexOpenType.All)

    game.moveState.dropping = true
    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    game.moveState.dropping = false
    expect(game.moveState.addActions.length).toBe(1)

    game.moveState.move(3, 2)
    expect(game.gameState.openHex(2, 2)).toBe(1)
    expect(game.gameState.openHex(2, 3)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(3, 3)).toBe(hexOpenType.Closed)

    game.moveState.move(2, 2)
    expect(game.gameState.openHex(1, 2)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(1, 3)).toBe(hexOpenType.Closed)

    game.gameState.finish()

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
    const game = createMoveGame()
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

    game.gameState = new MoveState(game)

    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(game.gameState.selection.length).toBe(2)

    expect(mapSelectMovement(game, false)).toBe(3)
    expect(mapSelectMovement(game, true)).toBe(4)

    expect(game.gameState.openHex(3, 2)).toBe(1)
    expect(game.gameState.openHex(4, 3)).toBe(1)
    expect(game.gameState.openHex(3, 3)).toBe(2)

    game.moveState.move(3, 2)
    expect(game.moveState.path.length).toBe(2)
    expect(game.gameState.openHex(2, 2)).toBe(1)
    expect(game.gameState.openHex(2, 3)).toBe(1)
    expect(game.gameState.openHex(3, 3)).toBe(2)

    // Check if dropping leader reduces total movement
    game.moveState.addActions.push(
      { x: 3, y: 2, type: gameActionAddActionType.Drop, cost: 0, id: "test2", index: 0 }
    )
    expect(mapSelectMovement(game, false)).toBe(2)
    expect(mapSelectMovement(game, true)).toBe(3)
    // Undo
    game.moveState.addActions.pop()

    game.moveState.move(2, 2)
    expect(game.gameState.openHex(1, 2)).toBe(1)
    expect(game.gameState.openHex(1, 3)).toBe(1)

    game.moveState.move(1, 2)
    expect(game.gameState.openHex(0, 2)).toBe(1)
    expect(game.gameState.openHex(0, 3)).toBe(hexOpenType.Closed)

    game.moveState.move(0, 2)
    expect(game.gameState.openHex(1, 2)).toBe(hexOpenType.Closed)
    expect(showDropMove(game)).toBe(false)

    game.gameState.finish()

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
    const game = createMoveGame()
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

    game.gameState = new MoveState(game)

    expect(showLoadMove(game)).toBe(false)

    game.moveState.move(3, 2)
    expect(showLoadMove(game)).toBe(false)
  })

  test("leader carrying sw", () => {
    const game = createMoveGame()
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

    game.gameState = new MoveState(game)

    expect(game.gameState.selection.length).toBe(2)

    expect(game.moveState.doneSelect).toBe(true)

    expect(mapSelectMovement(game, false)).toBe(1)
    expect(mapSelectMovement(game, true)).toBe(2)

    expect(game.gameState.openHex(3, 2)).toBe(1)
    expect(game.gameState.openHex(4, 3)).toBe(1)
    expect(game.gameState.openHex(3, 3)).toBe(hexOpenType.All)

    game.moveState.move(3, 2)
    expect(game.gameState.openHex(2, 2)).toBe(1)
    expect(game.gameState.openHex(2, 3)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(3, 3)).toBe(hexOpenType.Closed)

    game.moveState.move(2, 2)
    expect(game.gameState.openHex(1, 2)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(1, 3)).toBe(hexOpenType.Closed)

    game.gameState.finish()

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
    const game = createMoveGame()
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

    game.gameState = new MoveState(game)

    expect(mapSelectMovement(game, false)).toBe(1)
    expect(mapSelectMovement(game, true)).toBe(2)

    expect(game.gameState.openHex(3, 2)).toBe(1)
    expect(game.gameState.openHex(4, 3)).toBe(1)
    expect(game.gameState.openHex(3, 3)).toBe(hexOpenType.All)

    // Testing drop at initial location and other locations
    game.moveState.dropping = true
    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    game.moveState.dropping = false
    expect(game.moveState.addActions.length).toBe(1)

    expect(game.gameState.openHex(3, 2)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(4, 3)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(3, 3)).toBe(hexOpenType.Closed)

    game.gameState.finish()

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
    const game = createMoveGame()
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

    game.gameState = new MoveState(game)

    expect(showLoadMove(game)).toBe(false)

    // Can't load after moving
    game.moveState.move(3, 2)
    expect(showLoadMove(game)).toBe(false)
  })

  test("can't pick up gun even from same hex", () => {
    const game = createMoveGame()
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

    game.gameState = new MoveState(game)

    expect(showLoadMove(game)).toBe(false)
  })
});
