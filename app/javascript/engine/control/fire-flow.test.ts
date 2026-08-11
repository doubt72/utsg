import { describe, expect, test } from "vitest";
import { createBlankGame, testGInf, testGLdr, testGTank, testRInf } from "./testHelpers";
import Unit from "../Unit";
import FireState from "./state/FireState";
import { Coordinate } from "../../utilities/commonTypes";
import actionsAvailable from "./actionsAvailable";
import select, { selectable } from "./select";

describe("fire flow", () => {
  test("addtional units for infantry fire", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const target1 = new Unit(testRInf)
    target1.id = "target1"
    const tloc1 = new Coordinate(2, 2)
    map.addCounter(tloc1, target1)

    const target2 = new Unit(testRInf)
    target2.id = "target2"
    const tloc2 = new Coordinate(3, 1)
    map.addCounter(tloc2, target2)

    const fire1 = new Unit(testGInf)
    fire1.id = "fire1"
    const floc1 = new Coordinate(3, 2)
    map.addCounter(floc1, fire1)
    const fire2 = new Unit(testGLdr)
    fire2.id = "fire2"
    map.addCounter(floc1, fire2)

    const fire3 = new Unit(testGInf)
    fire3.id = "fire3"
    const floc2 = new Coordinate(4, 1)
    map.addCounter(floc2, fire3)
    map.select(fire1)

    game.setGameState(new FireState(game, false))

    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select fire group or target" },
        { type: "cancel_action" },
      ]
    )
    expect(game.fireState.doneSelect).toBe(false)

    select(map, {
      counter: map.countersAt(tloc1)[0],
      target: { type: "map", xy: tloc1 }
    }, () => {})
    expect(target1.targetSelected).toBe(true)

    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select fire group or target" },
        { type: "fire_finish" },
        { type: "cancel_action" },
      ]
    )
    expect(game.fireState.doneSelect).toBe(false)

    select(map, {
      counter: map.countersAt(tloc2)[0],
      target: { type: "map", xy: tloc2 }
    }, () => {})
    expect(target1.targetSelected).toBe(false)
    expect(target2.targetSelected).toBe(true)

    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select fire group or target" },
        { type: "fire_finish" },
        { type: "cancel_action" },
      ]
    )
    expect(game.fireState.doneSelect).toBe(false)

    expect(selectable(map, {
      counter: map.countersAt(floc2)[0],
      target: { type: "map", xy: floc2 }
    })).toBe(false)
    expect(game.messageQueue.length).toBe(1)
    expect(game.messageQueue[0]).toBe("can't combine fire of units without a leader")
    expect(fire1.selected).toBe(true)
    expect(fire2.selected).toBe(false)
    expect(fire3.selected).toBe(false)
    expect(target1.targetSelected).toBe(false)
    expect(target2.targetSelected).toBe(true)

    select(map, {
      counter: map.countersAt(floc1)[1],
      target: { type: "map", xy: floc1 }
    }, () => {})
    expect(fire1.selected).toBe(true)
    expect(fire2.selected).toBe(true)
    expect(fire3.selected).toBe(false)
    expect(target1.targetSelected).toBe(false)
    expect(target2.targetSelected).toBe(true)

    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select fire group or target" },
        { type: "fire_finish" },
        { type: "cancel_action" },
      ]
    )
    expect(game.fireState.doneSelect).toBe(false)

    select(map, {
      counter: map.countersAt(floc2)[0],
      target: { type: "map", xy: floc2 }
    }, () => {})
    expect(fire1.selected).toBe(true)
    expect(fire2.selected).toBe(true)
    expect(fire3.selected).toBe(true)
    expect(target1.targetSelected).toBe(false)
    expect(target2.targetSelected).toBe(true)

    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select fire group or target" },
        { type: "fire_finish" },
        { type: "cancel_action" },
      ]
    )
    expect(game.fireState.doneSelect).toBe(false)

    select(map, {
      counter: map.countersAt(tloc1)[0],
      target: { type: "map", xy: tloc1 }
    }, () => {})
    expect(fire1.selected).toBe(true)
    expect(fire2.selected).toBe(true)
    expect(fire3.selected).toBe(true)
    expect(target1.targetSelected).toBe(true)
    expect(target2.targetSelected).toBe(false)

    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select fire group or target" },
        { type: "fire_finish" },
        { type: "cancel_action" },
      ]
    )
    expect(game.fireState.doneSelect).toBe(false)

    expect(selectable(map, {
      counter: map.countersAt(floc1)[0],
      target: { type: "map", xy: floc1 }
    })).toBe(false)
    expect(game.messageQueue.length).toBe(2)
    expect(game.messageQueue[1]).toBe("initial selection must be in fire group")
  })

  test("can't unselect/select different ranged firing unit", () => {

  })

  test("can select additional MG for multi-fire (with leader)", () => {

  })

  test("can't select additional infantry for multi-fire (with leader)", () => {

  })

  test("changing turret direction clears target", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const target = new Unit(testRInf)
    target.id = "target"
    const tloc = new Coordinate(2, 2)
    map.addCounter(tloc, target)

    const fire = new Unit(testGTank)
    fire.id = "fire"
    fire.facing = 1
    const floc = new Coordinate(3, 2)
    map.addCounter(floc, fire)
    map.select(fire)

    game.setGameState(new FireState(game, false))

    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select target" },
        { type: "cancel_action" },
      ]
    )
    expect(game.fireState.doneSelect).toBe(true)
    expect(game.fireState.rotateOpen).toBe(true)
    expect(game.fireState.rotatePossible).toBe(true)

    select(map, {
      counter: map.countersAt(tloc)[0],
      target: { type: "map", xy: tloc }
    }, () => {})
    expect(target.targetSelected).toBe(true)
    expect(game.fireState.rotateOpen).toBe(true)
    expect(game.fireState.rotatePossible).toBe(true)

    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select target" },
        { type: "fire_finish" },
        { type: "cancel_action" },
      ]
    )

    game.fireState.rotate(2)
    expect(target.targetSelected).toBe(false)
    expect(game.fireState.rotateOpen).toBe(true)
    expect(game.fireState.rotatePossible).toBe(true)

    expect(actionsAvailable(game, "two")).toStrictEqual(
      [
        { type: "none", message: "select target" },
        { type: "cancel_action" },
      ]
    )
  })
})