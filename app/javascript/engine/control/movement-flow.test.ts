import { Coordinate } from "../../utilities/commonTypes"
import Unit from "../Unit"
import { describe, expect, test } from "vitest"
import { showLaySmoke, showLoadMove, showDropMove, movementPastCost } from "./movement"
import {
  createBlankGame, testGGun, testGInf,
  testGLdr,
  testGMG,
} from "./testHelpers"
import MoveState from "./state/MoveState"
import actionsAvailable from "./actionsAvailable"
import select from "./select"
import StackingActionError from "../actions/StackingActionError"
import organizeStacks from "../support/organizeStacks"

describe("movement flow", () => {
  test("normal movement with smoke", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    map.addCounter(new Coordinate(4, 2), unit)
    map.select(unit)

    game.setGameState(new MoveState(game))

    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "cancel_action" },
      ]
    )

    expect(game.moveState.doneSelect).toBe(true)
    expect(game.moveState.smoke).toBe(false)
    expect(game.moveState.dropping).toBe(false)
    expect(game.moveState.loading).toBe(false)
    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(false)
    expect(showLoadMove(game)).toBe(false)

    game.moveState.move(3, 2)
    expect(movementPastCost(map, unit)).toBe(1)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.smokeToggle()
    expect(game.moveState.smoke).toBe(true)
    expect(showLaySmoke(game)).toBe(true)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to place smoke" },
        { type: "move_smoke_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.move(3, 3)
    expect(movementPastCost(map, unit)).toBe(3)
    expect(game.moveState.smoke).toBe(false)
    expect(showLaySmoke(game)).toBe(false)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.move(2, 2)
    expect(movementPastCost(map, unit)).toBe(4)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.finish()

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("Smoke")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(3)
  })

  test("moving two units", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const test1 = new Unit(testGInf)
    test1.id = "test1"
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, test1)
    const test2 = new Unit(testGInf)
    test2.id = "test2"
    map.addCounter(loc, test2)
    map.select(test1)

    game.setGameState(new MoveState(game))

    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select additional units or select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "cancel_action" },
      ]
    )

    expect(game.moveState.doneSelect).toBe(false)
    expect(game.moveState.smoke).toBe(false)
    expect(game.moveState.dropping).toBe(false)
    expect(game.moveState.loading).toBe(false)
    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(false)
    expect(showLoadMove(game)).toBe(false)

    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(test2.selected).toBe(true)
    expect(game.moveState.selection.length).toBe(2)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select additional units or select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "cancel_action" },
      ]
    )
    expect(game.moveState.doneSelect).toBe(false)

    game.moveState.move(3, 2)
    expect(movementPastCost(map, test1)).toBe(1)
    expect(game.moveState.doneSelect).toBe(true)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "move_shortdrop_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.dropToggle()
    expect(game.moveState.dropping).toBe(true)
    expect(showDropMove(game)).toBe(true)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select unit to drop off" },
        { type: "move_shortdrop_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(test2.dropSelected).toBe(true)
    expect(game.moveState.dropping).toBe(false)
    expect(showDropMove(game)).toBe(false)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.move(2, 2)
    expect(movementPastCost(map, test1)).toBe(2)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.finish()

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].unit.id).toBe("test2")
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[1].unit.id).toBe("test1")
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(2)
  })

  test("picking up a MG", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const test1 = new Unit(testGInf)
    test1.id = "test1"
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, test1)
    const test2 = new Unit(testGMG)
    test2.id = "test2"
    const loc2 = new Coordinate(3, 2)
    try {
      map.addCounter(loc2, test2)
    } catch(err) {
      // Warning expected for placing a unit by itself
      expect(err instanceof StackingActionError).toBe(true)
    }
    map.select(test1)

    game.setGameState(new MoveState(game))

    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "cancel_action" },
      ]
    )

    expect(game.moveState.doneSelect).toBe(true)
    expect(game.moveState.smoke).toBe(false)
    expect(game.moveState.dropping).toBe(false)
    expect(game.moveState.loading).toBe(false)
    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(false)
    expect(showLoadMove(game)).toBe(false)

    game.moveState.move(3, 2)
    expect(movementPastCost(map, test1)).toBe(1)
    expect(game.moveState.loading).toBe(false)
    expect(showLoadMove(game)).toBe(true)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "move_load_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.loadToggle()
    expect(test2.loadedSelected).toBe(true)
    expect(movementPastCost(map, test1)).toBe(3)
    expect(game.moveState.loading).toBe(false)
    expect(showLoadMove(game)).toBe(false)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.move(2, 2)
    expect(movementPastCost(map, test1)).toBe(4)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.finish()

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].unit.id).toBe("test1")
    expect(all[0].unit.children[0].id).toBe("test2")
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(2)
    expect(all[1].unit.id).toBe("test2")
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(2)
  })

  test("can't pick up activated MG", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const test1 = new Unit(testGInf)
    test1.id = "test1"
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, test1)
    const test2 = new Unit(testGMG)
    test2.id = "test2"
    test2.activate()
    const loc2 = new Coordinate(3, 2)
    try {
      map.addCounter(loc2, test2)
    } catch(err) {
      // Warning expected for placing a unit by itself
      expect(err instanceof StackingActionError).toBe(true)
    }
    map.select(test1)

    game.setGameState(new MoveState(game))

    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "cancel_action" },
      ]
    )

    expect(game.moveState.doneSelect).toBe(true)
    expect(game.moveState.smoke).toBe(false)
    expect(game.moveState.dropping).toBe(false)
    expect(game.moveState.loading).toBe(false)
    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(false)
    expect(showLoadMove(game)).toBe(false)

    game.moveState.move(3, 2)
    expect(movementPastCost(map, test1)).toBe(1)
    expect(game.moveState.loading).toBe(false)
    expect(showLoadMove(game)).toBe(false)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )
  })

  test("picking up one of two MGs", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const test1 = new Unit(testGInf)
    test1.id = "test1"
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, test1)
    const test2 = new Unit(testGMG)
    test2.id = "test2"
    const loc2 = new Coordinate(3, 2)
    try {
      map.addCounter(loc2, test2)
    } catch(err) {
      // Warning expected for placing a unit by itself
      expect(err instanceof StackingActionError).toBe(true)
    }
    const test3 = new Unit(testGMG)
    test3.id = "test3"
    try {
      map.addCounter(loc2, test3)
    } catch(err) {
      // Warning expected for placing a unit by itself
      expect(err instanceof StackingActionError).toBe(true)
    }
    map.select(test1)

    game.setGameState(new MoveState(game))

    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "cancel_action" },
      ]
    )

    expect(game.moveState.doneSelect).toBe(true)
    expect(game.moveState.smoke).toBe(false)
    expect(game.moveState.dropping).toBe(false)
    expect(game.moveState.loading).toBe(false)
    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(false)
    expect(showLoadMove(game)).toBe(false)

    game.moveState.move(3, 2)
    expect(movementPastCost(map, test1)).toBe(1)
    expect(game.moveState.loading).toBe(false)
    expect(showLoadMove(game)).toBe(true)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "move_load_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.loadToggle()
    expect(movementPastCost(map, test1)).toBe(1)
    expect(game.moveState.loading).toBe(true)
    expect(showLoadMove(game)).toBe(true)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select unit to be picked up" },
        { type: "move_load_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    select(map, {
      counter: map.countersAt(loc2)[0],
      target: { type: "map", xy: loc2 }
    }, () => {})
    expect(test2.loadedSelected).toBe(true)
    expect(movementPastCost(map, test1)).toBe(3)
    expect(game.moveState.loading).toBe(false)
    expect(showLoadMove(game)).toBe(false)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.move(2, 2)
    expect(movementPastCost(map, test1)).toBe(4)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.finish()

    const all = map.allCounters
    expect(all.length).toBe(3)
    expect(all[0].unit.id).toBe("test3")
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[1].unit.id).toBe("test1")
    expect(all[1].unit.children[0].id).toBe("test2")
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(2)
    expect(all[2].unit.id).toBe("test2")
    expect(all[2].hex?.x).toBe(2)
    expect(all[2].hex?.y).toBe(2)
  })

  test("one of two units picking up a MG", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const test1 = new Unit(testGInf)
    test1.id = "test1"
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, test1)
    const test2 = new Unit(testGInf).split()
    test2.id = "test2"
    map.addCounter(loc, test2)
    const test3 = new Unit(testGMG)
    test3.id = "test3"
    const loc2 = new Coordinate(3, 2)
    try {
      map.addCounter(loc2, test3)
    } catch(err) {
      // Warning expected for placing a unit by itself
      expect(err instanceof StackingActionError).toBe(true)
    }
    map.select(test1)

    game.setGameState(new MoveState(game))

    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select additional units or select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "cancel_action" },
      ]
    )

    expect(game.moveState.doneSelect).toBe(false)
    expect(game.moveState.smoke).toBe(false)
    expect(game.moveState.dropping).toBe(false)
    expect(game.moveState.loading).toBe(false)
    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(false)
    expect(showLoadMove(game)).toBe(false)

    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(test2.selected).toBe(true)
    expect(game.moveState.selection.length).toBe(2)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select additional units or select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "cancel_action" },
      ]
    )
    expect(game.moveState.doneSelect).toBe(false)

    game.moveState.move(3, 2)
    expect(movementPastCost(map, test1)).toBe(1)
    expect(game.moveState.loading).toBe(false)
    expect(showLoadMove(game)).toBe(true)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "move_shortdrop_toggle" },
        { type: "move_load_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.loadToggle()
    expect(movementPastCost(map, test1)).toBe(1)
    expect(game.moveState.loading).toBe(true)
    expect(showLoadMove(game)).toBe(true)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select unit to pick up unit" },
        { type: "move_load_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(test3.loadedSelected).toBe(true)
    expect(movementPastCost(map, test1)).toBe(3)
    expect(game.moveState.loading).toBe(false)
    expect(showLoadMove(game)).toBe(false)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_shortdrop_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.move(2, 2)
    expect(movementPastCost(map, test1)).toBe(4)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.finish()

    const all = map.allCounters
    expect(all.length).toBe(3)
    expect(all[0].unit.id).toBe("test1")
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(2)
    expect(all[1].unit.id).toBe("test2")
    expect(all[1].unit.children[0].id).toBe("test3")
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(2)
    expect(all[2].unit.id).toBe("test3")
    expect(all[2].hex?.x).toBe(2)
    expect(all[2].hex?.y).toBe(2)
  })

  test("picking up a MG (leader can't)", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const test1 = new Unit(testGInf)
    test1.id = "test1"
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, test1)
    const test2 = new Unit(testGLdr)
    test2.id = "test2"
    map.addCounter(loc, test2)
    const test3 = new Unit(testGMG)
    test3.id = "test3"
    const loc2 = new Coordinate(3, 2)
    try {
      map.addCounter(loc2, test3)
    } catch(err) {
      // Warning expected for placing a unit by itself
      expect(err instanceof StackingActionError).toBe(true)
    }
    map.select(test1)

    game.setGameState(new MoveState(game))

    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select additional units or select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "cancel_action" },
      ]
    )

    expect(game.moveState.doneSelect).toBe(false)
    expect(game.moveState.smoke).toBe(false)
    expect(game.moveState.dropping).toBe(false)
    expect(game.moveState.loading).toBe(false)
    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(false)
    expect(showLoadMove(game)).toBe(false)

    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(test2.selected).toBe(true)
    expect(game.moveState.selection.length).toBe(2)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select additional units or select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "cancel_action" },
      ]
    )
    expect(game.moveState.doneSelect).toBe(false)

    game.moveState.move(3, 2)
    expect(movementPastCost(map, test1)).toBe(1)
    expect(game.moveState.loading).toBe(false)
    expect(showLoadMove(game)).toBe(true)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "move_shortdrop_toggle" },
        { type: "move_load_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.loadToggle()
    expect(test3.loadedSelected).toBe(true)
    expect(movementPastCost(map, test1)).toBe(3)
    expect(game.moveState.loading).toBe(false)
    expect(showLoadMove(game)).toBe(false)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "move_shortdrop_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.move(2, 2)
    expect(movementPastCost(map, test1)).toBe(4)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_shortdrop_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.finish()

    const all = map.allCounters
    expect(all.length).toBe(3)
    expect(all[0].unit.id).toBe("test1")
    expect(all[0].unit.children[0].id).toBe("test3")
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(2)
    expect(all[1].unit.id).toBe("test3")
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(2)
    expect(all[2].unit.id).toBe("test2")
    expect(all[2].hex?.x).toBe(2)
    expect(all[2].hex?.y).toBe(2)
  })

  test("one of two units picking up one of two MGs", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const test1 = new Unit(testGInf)
    test1.id = "test1"
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, test1)
    const test2 = new Unit(testGInf).split()
    test2.id = "test2"
    map.addCounter(loc, test2)
    const test3 = new Unit(testGMG)
    test3.id = "test3"
    const loc2 = new Coordinate(3, 2)
    try {
      map.addCounter(loc2, test3)
    } catch(err) {
      // Warning expected for placing a unit by itself
      expect(err instanceof StackingActionError).toBe(true)
    }
    const test4 = new Unit(testGMG)
    test4.id = "test4"
    try {
      map.addCounter(loc2, test4)
    } catch(err) {
      // Warning expected for placing a unit by itself
      expect(err instanceof StackingActionError).toBe(true)
    }
    map.select(test1)

    game.setGameState(new MoveState(game))

    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select additional units or select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "cancel_action" },
      ]
    )

    expect(game.moveState.doneSelect).toBe(false)
    expect(game.moveState.smoke).toBe(false)
    expect(game.moveState.dropping).toBe(false)
    expect(game.moveState.loading).toBe(false)
    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(false)
    expect(showLoadMove(game)).toBe(false)

    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(test2.selected).toBe(true)
    expect(game.moveState.selection.length).toBe(2)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select additional units or select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "cancel_action" },
      ]
    )
    expect(game.moveState.doneSelect).toBe(false)

    game.moveState.move(3, 2)
    expect(movementPastCost(map, test1)).toBe(1)
    expect(game.moveState.doneSelect).toBe(true)
    expect(game.moveState.loading).toBe(false)
    expect(showLoadMove(game)).toBe(true)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "move_shortdrop_toggle" },
        { type: "move_load_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.loadToggle()
    expect(movementPastCost(map, test1)).toBe(1)
    expect(game.moveState.loading).toBe(true)
    expect(showLoadMove(game)).toBe(true)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select unit to pick up unit" },
        { type: "move_load_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(test2.loaderSelected).toBe(true)

    expect(movementPastCost(map, test1)).toBe(1)
    expect(game.moveState.loading).toBe(true)
    expect(showLoadMove(game)).toBe(true)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select unit to be picked up" },
        { type: "move_load_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    select(map, {
      counter: map.countersAt(loc2)[0],
      target: { type: "map", xy: loc2 }
    }, () => {})
    expect(test3.loadedSelected).toBe(true)
    expect(movementPastCost(map, test1)).toBe(3)
    expect(game.moveState.loading).toBe(false)
    expect(showLoadMove(game)).toBe(false)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_shortdrop_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.move(2, 2)
    expect(movementPastCost(map, test1)).toBe(4)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.finish()

    const all = map.allCounters
    expect(all.length).toBe(4)
    expect(all[0].unit.id).toBe("test4")
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[1].unit.id).toBe("test1")
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(2)
    expect(all[2].unit.id).toBe("test2")
    expect(all[2].unit.children[0].id).toBe("test3")
    expect(all[2].hex?.x).toBe(2)
    expect(all[2].hex?.y).toBe(2)
    expect(all[3].unit.id).toBe("test3")
    expect(all[3].hex?.x).toBe(2)
    expect(all[3].hex?.y).toBe(2)
  })

  test("manning a gun", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const test1 = new Unit(testGInf)
    test1.id = "test1"
    const loc = new Coordinate(4, 2)
    const test2 = new Unit(testGGun)
    test2.id = "test2"
    try {
      map.addCounter(loc, test2)
    } catch(err) {
      // Warning expected for placing a unit by itself
      expect(err instanceof StackingActionError).toBe(true)
    }
    map.addCounter(loc, test1)
    map.select(test1)

    game.setGameState(new MoveState(game))

    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "move_load_toggle" },
        { type: "cancel_action" },
      ]
    )

    expect(game.moveState.doneSelect).toBe(true)
    expect(game.moveState.smoke).toBe(false)
    expect(game.moveState.dropping).toBe(false)
    expect(game.moveState.loading).toBe(false)
    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(false)
    expect(showLoadMove(game)).toBe(true)

    game.moveState.loadToggle()
    expect(test2.loadedSelected).toBe(true)
    expect(game.moveState.loading).toBe(false)
    expect(showLoadMove(game)).toBe(false)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.finish()

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].unit.id).toBe("test1")
    expect(all[0].unit.children[0].id).toBe("test2")
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[1].unit.id).toBe("test2")
    expect(all[1].hex?.x).toBe(4)
    expect(all[1].hex?.y).toBe(2)
  })

  test("manning one of two guns", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const test1 = new Unit(testGInf)
    test1.id = "test1"
    const loc = new Coordinate(4, 2)
    const test2 = new Unit(testGGun)
    test2.id = "test2"
    try {
      map.addCounter(loc, test2)
    } catch(err) {
      // Warning expected for placing a unit by itself
      expect(err instanceof StackingActionError).toBe(true)
    }
    const test3 = new Unit(testGGun)
    test3.id = "test3"
    try {
      map.addCounter(loc, test3)
    } catch(err) {
      // Warning expected for placing a unit by itself
      expect(err instanceof StackingActionError).toBe(true)
    }
    map.addCounter(loc, test1)
    map.select(test1)

    game.setGameState(new MoveState(game))

    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "move_load_toggle" },
        { type: "cancel_action" },
      ]
    )

    expect(game.moveState.doneSelect).toBe(true)
    expect(game.moveState.smoke).toBe(false)
    expect(game.moveState.dropping).toBe(false)
    expect(game.moveState.loading).toBe(false)
    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(false)
    expect(showLoadMove(game)).toBe(true)

    game.moveState.loadToggle()
    expect(game.moveState.loading).toBe(true)
    expect(showLoadMove(game)).toBe(true)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select unit to be picked up" },
        { type: "move_load_toggle" },
        { type: "cancel_action" },
      ]
    )

    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(test2.loadedSelected).toBe(true)
    expect(game.moveState.loading).toBe(false)
    expect(showLoadMove(game)).toBe(false)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.finish()

    const all = map.allCounters
    expect(all.length).toBe(3)
    expect(all[0].unit.id).toBe("test3")
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[1].unit.id).toBe("test1")
    expect(all[1].unit.children[0].id).toBe("test2")
    expect(all[1].hex?.x).toBe(4)
    expect(all[1].hex?.y).toBe(2)
    expect(all[2].unit.id).toBe("test2")
    expect(all[2].hex?.x).toBe(4)
    expect(all[2].hex?.y).toBe(2)
  })

  test("one of two units cannot man guns", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const test1 = new Unit(testGInf)
    test1.id = "test1"
    const loc = new Coordinate(4, 2)
    const test2 = new Unit(testGInf).split()
    test2.id = "test2"
    const test3 = new Unit(testGGun)
    test3.id = "test3"
    try {
      map.addCounter(loc, test3)
    } catch(err) {
      // Warning expected for placing a unit by itself
      expect(err instanceof StackingActionError).toBe(true)
    }
    map.addCounter(loc, test1)
    map.addCounter(loc, test2)
    map.select(test1)

    game.setGameState(new MoveState(game))

    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select additional units or select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "move_load_toggle" },
        { type: "cancel_action" },
      ]
    )

    expect(game.moveState.doneSelect).toBe(false)
    expect(game.moveState.smoke).toBe(false)
    expect(game.moveState.dropping).toBe(false)
    expect(game.moveState.loading).toBe(false)
    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(false)
    expect(showLoadMove(game)).toBe(true)

    select(map, {
      counter: map.countersAt(loc)[2],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(test2.selected).toBe(true)
    expect(game.moveState.selection.length).toBe(2)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select additional units or select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "cancel_action" },
      ]
    )
  })

  test("dropping a MG", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const test1 = new Unit(testGInf)
    test1.id = "test1"
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, test1)
    const test2 = new Unit(testGMG)
    test2.id = "test2"
    map.addCounter(loc, test2)
    organizeStacks(map)
    map.select(test1)

    game.setGameState(new MoveState(game))

    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "move_shortdrop_toggle" },
        { type: "cancel_action" },
      ]
    )

    expect(game.moveState.doneSelect).toBe(true)
    expect(game.moveState.smoke).toBe(false)
    expect(game.moveState.dropping).toBe(false)
    expect(game.moveState.loading).toBe(false)
    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(true)
    expect(showLoadMove(game)).toBe(false)

    expect(test1.encumberedMovement(false)).toBe(3)

    game.moveState.dropToggle()
    expect(test2.dropSelected).toBe(true)
    expect(movementPastCost(map, test1)).toBe(1)
    expect(game.moveState.dropping).toBe(false)
    expect(showDropMove(game)).toBe(false)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.move(3, 2)
    expect(movementPastCost(map, test1)).toBe(2)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.finish()

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].unit.id).toBe("test2")
    expect(all[0].unit.isActivated).toBe(true)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[1].unit.id).toBe("test1")
    expect(all[1].unit.children.length).toBe(0)
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
  })

  test.only("dropping a MG or infantry", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const test1 = new Unit(testGInf)
    test1.id = "test1"
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, test1)
    const test2 = new Unit(testGInf).split()
    test2.id = "test2"
    map.addCounter(loc, test2)
    const test3 = new Unit(testGMG)
    test3.id = "test3"
    map.addCounter(loc, test3)
    organizeStacks(map)
    map.select(test1)

    game.setGameState(new MoveState(game))

    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select additional units or select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "cancel_action" },
      ]
    )

    expect(game.moveState.doneSelect).toBe(false)
    expect(game.moveState.smoke).toBe(false)
    expect(game.moveState.dropping).toBe(false)
    expect(game.moveState.loading).toBe(false)
    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(false)
    expect(showLoadMove(game)).toBe(false)

    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(test2.selected).toBe(true)
    expect(game.moveState.selection.length).toBe(3)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select additional units or select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "move_shortdrop_toggle" },
        { type: "cancel_action" },
      ]
    )
    expect(game.moveState.doneSelect).toBe(false)

    game.moveState.move(3, 2)
    expect(movementPastCost(map, test1)).toBe(1)
    expect(game.moveState.dropping).toBe(false)
    expect(showDropMove(game)).toBe(true)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select hex to move" },
        { type: "move_smoke_toggle" },
        { type: "move_shortdrop_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )

    game.moveState.dropToggle()
    expect(movementPastCost(map, test1)).toBe(1)
    expect(game.moveState.dropping).toBe(true)
    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select unit to drop off" },
        { type: "move_shortdrop_toggle" },
        { type: "move_finish" },
        { type: "move_undo" },
        { type: "cancel_action" },
      ]
    )
  })
});
