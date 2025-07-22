import {
  baseTerrainType, Coordinate, featureType, hexOpenType, markerType, unitStatus,
} from "../../utilities/commonTypes"
import Unit from "../Unit"
import { describe, expect, test, vi } from "vitest"
import {
  openHexMovement, showLaySmoke, showLoadMove, showDropMove, mapSelectMovement, movementPastCost
} from "./movement"
import select from "./select"
import { addActionType } from "../GameAction"
import WarningActionError from "../actions/WarningActionError"
import organizeStacks from "../support/organizeStacks"
import IllegalActionError from "../actions/IllegalActionError"
import { openHexRotateOpen, openHexRotatePossible } from "./openHex"
import { actionType, GameActionState, MoveActionState } from "./gameActions"
import {
  createMoveGame, testGCrew, testGGun, testGInf, testGLdr, testGMG, testGTank, testGTruck, testMine,
  testMineAP, testMineAT, testRInf, testWire
} from "./testHelpers"
import Feature from "../Feature"

describe("movement tests", () => {
  test("movement along road", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 3
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.startMove()

    const state = game.gameActionState as GameActionState

    expect(state.player).toBe(2)
    expect(state.currentAction).toBe(actionType.Move)
    expect(state.selection[0].id).toBe("test1")

    const move = state.move as MoveActionState

    expect(move.path[0].x).toBe(4)
    expect(move.path[0].y).toBe(2)
    expect(move.doneSelect).toBe(true)
    expect(move.placingSmoke).toBe(false)
    expect(move.droppingMove).toBe(false)
    expect(move.loadingMove).toBe(false)

    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(0, 0))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(2)

    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(false)
    expect(showLoadMove(game)).toBe(false)

    game.move(3, 2)
    expect(move.path.length).toBe(2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(2)

    game.move(2, 2)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(1)

    game.move(1, 2)
    expect(openHexMovement(map, new Coordinate(1, 2), new Coordinate(0, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(1, 2), new Coordinate(0, 3))).toBe(hexOpenType.Closed)

    game.finishMove()
    const all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(1)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.status).toBe(unitStatus.Activated)
  })

  test("movement along path", () => {
    const game = createMoveGame([
      [{ t: "o" }, { t: "o" }, { t: "o", b: "f", be: [4] }, { t: "o" }, { t: "o" }],
      [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
      [
        { t: "o", r: { d: [1, 4], t: "p" } },
        { t: "o", r: { d: [1, 4], t: "p" } },
        { t: "o", r: { d: [1, 4], t: "p" } },
        { t: "f", r: { d: [1, 4], t: "p" } },
        { t: "o", r: { d: [1, 4], t: "p" } },
      ],
      [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "f" }, { t: "o" }],
      [
        { t: "o" },
        { t: "o", s: { d: [4, 6], t: "t" } },
        { t: "o", s: { d: [1, 5], t: "t" } },
        { t: "o" }, { t: "o" }
      ],
    ])
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 3
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.startMove()

    const state = game.gameActionState as GameActionState

    expect(state.player).toBe(2)
    expect(state.currentAction).toBe(actionType.Move)
    expect(state.selection[0].id).toBe("test1")

    const move = state.move as MoveActionState

    expect(move.path[0].x).toBe(4)
    expect(move.path[0].y).toBe(2)
    expect(move.doneSelect).toBe(true)
    expect(move.placingSmoke).toBe(false)
    expect(move.droppingMove).toBe(false)
    expect(move.loadingMove).toBe(false)

    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(0, 0))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(2)

    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(false)
    expect(showLoadMove(game)).toBe(false)

    game.move(3, 2)
    expect(move.path.length).toBe(2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(2)

    game.move(2, 2)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(1)

    game.move(1, 2)
    expect(openHexMovement(map, new Coordinate(1, 2), new Coordinate(0, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(1, 2), new Coordinate(0, 3))).toBe(hexOpenType.Closed)

    game.finishMove()
    const all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(1)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.status).toBe(unitStatus.Activated)
  })

  test("movement along road over river", () => {
    const game = createMoveGame([
      [{ t: "o" }, { t: "o" }, { t: "o", s: { d: [3, 5] } }, { t: "o" }, { t: "o" }],
      [{ t: "o" }, { t: "o" }, { t: "o", s: { d: [2, 6] } }, { t: "o" }, { t: "o" }],
      [
        { t: "o", r: { d: [1, 4]} },
        { t: "o", r: { d: [1, 4]} },
        { t: "o", s: { d: [3, 5] }, r: { d: [1, 4]} },
        { t: "o", r: { d: [1, 4]} },
        { t: "o", r: { d: [1, 4]} },
      ],
      [{ t: "o" }, { t: "o" }, { t: "o", s: { d: [2, 6] } }, { t: "f" }, { t: "o" }],
      [{ t: "o" }, { t: "o" }, { t: "o", s: { d: [3, 5] } }, { t: "o" }, { t: "o" }],
    ])
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 3
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.startMove()

    const state = game.gameActionState as GameActionState

    const move = state.move as MoveActionState

    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(0, 0))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(2)

    game.move(3, 2)
    expect(move.path.length).toBe(2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(2)

    game.move(2, 2)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(hexOpenType.Closed)

    game.move(1, 2)
    expect(openHexMovement(map, new Coordinate(1, 2), new Coordinate(0, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(1, 2), new Coordinate(0, 3))).toBe(hexOpenType.Closed)

    game.finishMove()
    const  all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(1)
    expect(all[0].hex?.y).toBe(2)
  })

  test("movement along road over water", () => {
    const game = createMoveGame([
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
    map.addCounter(new Coordinate(4, 2), unit)

    game.startMove()

    const state = game.gameActionState as GameActionState

    const move = state.move as MoveActionState

    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(0, 0))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(2)

    game.move(3, 2)
    expect(move.path.length).toBe(2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(2)

    game.move(2, 2)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(1)

    game.move(1, 2)
    expect(openHexMovement(map, new Coordinate(1, 2), new Coordinate(0, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(1, 2), new Coordinate(0, 3))).toBe(hexOpenType.Closed)

    game.finishMove()
    const  all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(1)
    expect(all[0].hex?.y).toBe(2)
  })

  test("movement along railroad over river", () => {
    const game = createMoveGame([
      [{ t: "o" }, { t: "o" }, { t: "o", s: { d: [3, 5] } }, { t: "o" }, { t: "o" }],
      [{ t: "o" }, { t: "o" }, { t: "o", s: { d: [2, 6] } }, { t: "o" }, { t: "o" }],
      [
        { t: "o", rr: { d: [[1, 4]]} },
        { t: "o", rr: { d: [[1, 4]]} },
        { t: "o", s: { d: [3, 5] }, rr: { d: [[1, 4]]} },
        { t: "o", rr: { d: [[1, 4]]} },
        { t: "o", rr: { d: [[1, 4]]} },
      ],
      [{ t: "o" }, { t: "o" }, { t: "o", s: { d: [2, 6] } }, { t: "f" }, { t: "o" }],
      [{ t: "o" }, { t: "o" }, { t: "o", s: { d: [3, 5] } }, { t: "o" }, { t: "o" }],
    ])
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 5
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.startMove()

    const state = game.gameActionState as GameActionState

    const move = state.move as MoveActionState

    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(0, 0))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(2)

    game.move(3, 2)
    expect(move.path.length).toBe(2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(2)

    game.move(2, 2)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(2)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(2)

    game.move(1, 2)
    expect(openHexMovement(map, new Coordinate(1, 2), new Coordinate(0, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(1, 2), new Coordinate(0, 3))).toBe(hexOpenType.Closed)

    game.finishMove()
    const  all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(1)
    expect(all[0].hex?.y).toBe(2)
  })

  test("movement along railroad over water", () => {
    const game = createMoveGame([
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
    map.addCounter(new Coordinate(4, 2), unit)

    game.startMove()

    const state = game.gameActionState as GameActionState

    const move = state.move as MoveActionState

    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(0, 0))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(2)

    game.move(3, 2)
    expect(move.path.length).toBe(2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(2)

    game.move(2, 2)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(1)

    game.move(1, 2)
    expect(openHexMovement(map, new Coordinate(1, 2), new Coordinate(0, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(1, 2), new Coordinate(0, 3))).toBe(hexOpenType.Closed)

    game.finishMove()
    const  all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(1)
    expect(all[0].hex?.y).toBe(2)
  })

  test("tired movement", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.status = unitStatus.Pinned
    expect(unit.baseMovement).toBe(4)
    expect(unit.currentMovement).toBe(0)
    unit.status = unitStatus.Tired
    expect(unit.currentMovement).toBe(2)
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.startMove()

    const state = game.gameActionState as GameActionState

    const move = state.move as MoveActionState

    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(0, 0))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(2)

    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(false)
    expect(showLoadMove(game)).toBe(false)

    game.move(3, 2)
    expect(move.path.length).toBe(2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.move(2, 2)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(hexOpenType.Closed)

    game.move(1, 2)
    expect(openHexMovement(map, new Coordinate(1, 2), new Coordinate(0, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(1, 2), new Coordinate(0, 3))).toBe(hexOpenType.Closed)

    game.finishMove()
    let all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(1)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.status).toBe(unitStatus.Activated)

    game.executeUndo()
    all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.status).toBe(unitStatus.Tired)
  })

  test("smoke", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 3
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
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.placeSmokeToggle()
    expect(showLaySmoke(game)).toBe(true)
    expect(move.placingSmoke).toBe(false)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(1)
    // Laying smoke cancels road bonus
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.move(3, 2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)
    expect(showLaySmoke(game)).toBe(false)

    game.finishMove()
    expect(map.units[3][3].filter(u => u.ghost).length).toBe(0)

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(3)
    expect(all[1].feature.name).toBe("Smoke")

    try {
      game.executeUndo()
    } catch(err) {
      // Can't roll back a smoke roll
      expect(err instanceof IllegalActionError).toBe(true)
    }
  })

  test("multi-select", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 3
    unit.smokeCapable = false // any unit in stack is enough for smoke
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

    expect(mapSelectMovement(game, false)).toBe(3)
    expect(mapSelectMovement(game, true)).toBe(4)

    expect(openHexMovement(map, loc, new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, loc, new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, loc, new Coordinate(3, 3))).toBe(2)
    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(false)
    expect(showLoadMove(game)).toBe(false)

    game.move(3, 2)
    expect(move.doneSelect).toBe(true)
    expect(move.path.length).toBe(2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(2)
    expect(showDropMove(game)).toBe(true)

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

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(0)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Activated)
    expect(all[1].hex?.x).toBe(0)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("Rifle")
    expect(all[1].unit.status).toBe(unitStatus.Activated)
  })

  test ("can't move overstack or into enemy", () => {
    const game = createMoveGame()
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

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(state.selection.length).toBe(2)
    expect(move.doneSelect).toBe(false)

    expect(openHexMovement(map, loc, new Coordinate(3, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, loc, new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, loc, new Coordinate(3, 3))).toBe(hexOpenType.Closed)
  })

  test("multi-select drop-off", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 3
    unit.smokeCapable = false // any unit in stack is enough for smoke
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

    expect(mapSelectMovement(game, false)).toBe(3)
    expect(mapSelectMovement(game, true)).toBe(4)

    expect(openHexMovement(map, loc, new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, loc, new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, loc, new Coordinate(3, 3))).toBe(2)
    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(false)
    expect(showLoadMove(game)).toBe(false)

    game.move(3, 2)
    expect(move.doneSelect).toBe(true)
    expect(move.path.length).toBe(2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(2)
    expect(showDropMove(game)).toBe(true)

    move.droppingMove = true
    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    move.droppingMove = false
    expect(move.addActions.length).toBe(1)

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
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Activated)
    expect(all[1].hex?.x).toBe(0)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("Rifle")
    expect(all[1].unit.status).toBe(unitStatus.Activated)

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[1].hex?.x).toBe(4)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("Rifle")
  })

  test("multiselect with leader", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 2
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
    move.addActions.push({ x: 3, y: 2, type: addActionType.Drop, cost: 0, id: "test2", index: 2 })
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

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(0)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Activated)
    expect(all[1].hex?.x).toBe(0)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("Leader")
    expect(all[1].unit.status).toBe(unitStatus.Activated)
  })

  test("carrying sw", () => {
    const game = createMoveGame()
    const map = game.scenario.map

    const unit = new Unit(testGInf)
    unit.id = "test1"
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

    expect(mapSelectMovement(game, false)).toBe(3)
    expect(mapSelectMovement(game, true)).toBe(4)

    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(2)

    expect(showLaySmoke(game)).toBe(true)
    expect(showDropMove(game)).toBe(true)
    expect(showLoadMove(game)).toBe(false)

    game.move(3, 2)
    expect(move.path.length).toBe(2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(2)

    game.move(2, 2)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(1)

    game.move(1, 2)
    expect(openHexMovement(map, new Coordinate(1, 2), new Coordinate(0, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(1, 2), new Coordinate(0, 3))).toBe(hexOpenType.Closed)

    game.finishMove()

    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(1)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Activated)
    expect(all[1].hex?.x).toBe(1)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("MG 08/15")
    expect(all[1].unit.status).toBe(unitStatus.Activated)

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Normal)
    expect(all[1].hex?.x).toBe(4)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("MG 08/15")
    expect(all[1].unit.status).toBe(unitStatus.Normal)
  })

  test("pick up sw", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
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

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(showLoadMove(game)).toBe(false)

    game.move(3, 2)
    expect(showLoadMove(game)).toBe(true)
    move.loadingMove = true
    select(map, {
      counter: map.countersAt(new Coordinate(3, 2))[0],
      target: { type: "map", xy: new Coordinate(3, 2) }
    }, () => {})
    expect(move.addActions.length).toBe(1)
    expect(move.addActions[0].cost).toBe(2)
    expect(move.addActions[0].id).toBe("test2")
    expect(move.addActions[0].parent_id).toBe("test1")
    move.loadingMove = false

    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.move(2, 2)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(hexOpenType.Closed)

    game.finishMove()

    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Activated)
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.parent?.name).toBe("Rifle")
    expect(all[1].unit.name).toBe("MG 08/15")
    expect(all[1].unit.status).toBe(unitStatus.Activated)

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(0)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Normal)
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.parent?.name).toBe(undefined)
    expect(all[1].unit.name).toBe("MG 08/15")
    expect(all[1].unit.status).toBe(unitStatus.Normal)
  })

  test("leader carrying sw", () => {
    const game = createMoveGame()
    const map = game.scenario.map

    const unit = new Unit(testGLdr)
    unit.id = "test1"
    unit.baseMovement = 5
    unit.select()
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, unit)

    const unit2 = new Unit(testGMG)
    unit2.id = "test2"
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

    expect(mapSelectMovement(game, false)).toBe(3)
    expect(mapSelectMovement(game, true)).toBe(4)

    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(2)

    game.move(3, 2)
    expect(move.path.length).toBe(2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(2)

    game.move(2, 2)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(1)

    game.move(1, 2)
    expect(openHexMovement(map, new Coordinate(1, 2), new Coordinate(0, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(1, 2), new Coordinate(0, 3))).toBe(hexOpenType.Closed)

    game.finishMove()

    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(1)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Leader")
    expect(all[1].hex?.x).toBe(1)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("MG 08/15")

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Leader")
    expect(all[1].hex?.x).toBe(4)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("MG 08/15")
  })

  test("leader may not pick up encumbered sw", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGLdr)
    unit.id = "test1"
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

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(showLoadMove(game)).toBe(false)

    game.move(3, 2)
    expect(showLoadMove(game)).toBe(false)
    move.loadingMove = true
    select(map, {
      counter: map.countersAt(new Coordinate(3, 2))[0],
      target: { type: "map", xy: new Coordinate(3, 2) }
    }, () => {})
    expect(move.addActions.length).toBe(0)
    move.loadingMove = false
  })

  test("drop sw", () => {
    const game = createMoveGame()
    const map = game.scenario.map

    const unit = new Unit(testGInf)
    unit.id = "test1"
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

    expect(mapSelectMovement(game, false)).toBe(3)
    expect(mapSelectMovement(game, true)).toBe(4)

    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(2)

    // Testing drop at initial location and other locations
    move.droppingMove = true
    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    move.droppingMove = false
    expect(move.addActions.length).toBe(1)
    expect(map.units[2][4].filter(u => u.ghost).length).toBe(0)
    map.clearGhosts()

    // Reset to allow dropping at a different location
    move.addActions.pop()
    unit2.select()
    unit2.dropSelect()

    game.move(3, 2)

    move.droppingMove = true
    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    move.droppingMove = false

    expect(map.units[2][3].filter(u => u.ghost).length).toBe(1)

    expect(mapSelectMovement(game, false)).toBe(3)
    expect(mapSelectMovement(game, true)).toBe(3)

    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.move(2, 2)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(hexOpenType.Closed)

    game.finishMove()

    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.parent?.name).toBe(undefined)
    expect(all[0].unit.name).toBe("MG 08/15")
    expect(all[0].unit.status).toBe(unitStatus.Activated)
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.children.length).toBe(0)
    expect(all[1].unit.name).toBe("Rifle")
    expect(all[1].unit.status).toBe(unitStatus.Activated)

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.status).toBe(unitStatus.Normal)
    expect(all[1].hex?.x).toBe(4)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.parent?.name).toBe("Rifle")
    expect(all[1].unit.name).toBe("MG 08/15")
    expect(all[1].unit.status).toBe(unitStatus.Normal)
  })

  test("move gun", () => {
    const game = createMoveGame()
    const map = game.scenario.map

    const loc = new Coordinate(3, 2)
    const unit = new Unit(testGCrew)
    unit.id = "test1"
    unit.select()
    map.addCounter(loc, unit)

    const unit2 = new Unit(testGGun)
    unit2.id = "test2"
    unit2.facing = 1
    map.addCounter(loc, unit2)
    organizeStacks(map)

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(state.selection.length).toBe(2)
    expect(move.doneSelect).toBe(true)
    expect(move.path[0].facing).toBe(1)

    expect(mapSelectMovement(game, false)).toBe(2)
    expect(mapSelectMovement(game, true)).toBe(2)

    expect(showLaySmoke(game)).toBe(false)
    expect(showDropMove(game)).toBe(true)
    expect(showLoadMove(game)).toBe(false)

    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(4, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.move(2, 2)

    expect(move.path.length).toBe(2)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(3, 2))).toBe(hexOpenType.Open)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.moveRotate(2, 2, 2)
    expect(move.path.length).toBe(3)
    expect(move.path[2].facing).toBe(2)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(false)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.finishMove()

    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Crew")
    expect(all[0].unit.status).toBe(unitStatus.Activated)
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("3.7cm Pak 36")
    expect(all[1].unit.status).toBe(unitStatus.Activated)

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Crew")
    expect(all[0].unit.status).toBe(unitStatus.Normal)
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("3.7cm Pak 36")
    expect(all[1].unit.status).toBe(unitStatus.Normal)
  })

  test("move gun into trees", () => {
    const game = createMoveGame()
    const map = game.scenario.map

    const loc = new Coordinate(3, 2)
    const unit = new Unit(testGCrew)
    unit.id = "test1"
    unit.select()
    map.addCounter(loc, unit)

    const unit2 = new Unit(testGGun)
    unit2.id = "test2"
    unit2.facing = 2
    map.addCounter(loc, unit2)
    organizeStacks(map)

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(state.selection.length).toBe(2)
    expect(move.doneSelect).toBe(true)
    expect(move.path[0].facing).toBe(2)

    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(4, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 1))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(2)

    game.move(3, 3)

    expect(move.path.length).toBe(2)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(false)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(3, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.finishMove()

    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(3)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Crew")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(3)
    expect(all[1].unit.name).toBe("3.7cm Pak 36")

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Crew")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("3.7cm Pak 36")
  })

  test("move gun into all move trees", () => {
    const game = createMoveGame()
    const map = game.scenario.map

    const loc = new Coordinate(3, 2)
    const unit = new Unit(testGCrew)
    unit.id = "test1"
    unit.select()
    map.addCounter(loc, unit)

    const unit2 = new Unit(testGGun)
    unit2.id = "test2"
    unit2.facing = 2
    unit2.baseMovement = 1
    map.addCounter(loc, unit2)
    organizeStacks(map)

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(state.selection.length).toBe(2)
    expect(move.doneSelect).toBe(true)
    expect(move.path[0].facing).toBe(2)

    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(4, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 1))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.All)

    game.move(3, 3)

    expect(move.path.length).toBe(2)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(false)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(3, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.finishMove()

    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(3)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Crew")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(3)
    expect(all[1].unit.name).toBe("3.7cm Pak 36")

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Crew")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("3.7cm Pak 36")
  })

  test("can't pick up gun", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGCrew)
    unit.id = "test1"
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

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(showLoadMove(game)).toBe(false)

    // Can't load after moving
    game.move(3, 2)
    expect(showLoadMove(game)).toBe(false)
    move.loadingMove = true
    select(map, {
      counter: map.countersAt(new Coordinate(3, 2))[0],
      target: { type: "map", xy: new Coordinate(3, 2) }
    }, () => {})
    expect(move.addActions.length).toBe(0)
  })

  test("pick up gun", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGCrew)
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

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(showLoadMove(game)).toBe(true)
    move.loadingMove = true
    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(move.addActions.length).toBe(1)
    move.loadingMove = false

    expect(showLoadMove(game)).toBe(false)

    expect(openHexMovement(map, loc, new Coordinate(2, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, loc, new Coordinate(4, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, loc, new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.finishMove()

    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Crew")
    expect(all[0].unit.status).toBe(unitStatus.Activated)
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.parent?.name).toBe("Crew")
    expect(all[1].unit.name).toBe("3.7cm Pak 36")
    expect(all[1].unit.status).toBe(unitStatus.Activated)

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.parent?.name).toBe(undefined)
    expect(all[0].unit.name).toBe("3.7cm Pak 36")
    expect(all[0].unit.status).toBe(unitStatus.Normal)
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.children.length).toBe(0)
    expect(all[1].unit.name).toBe("Crew")
    expect(all[1].unit.status).toBe(unitStatus.Normal)
  })

  test("drop gun", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const loc = new Coordinate(3, 2)

    const unit = new Unit(testGCrew)
    unit.id = "test1"
    unit.select()
    map.addCounter(loc, unit)

    const unit2 = new Unit(testGGun)
    unit2.id = "test2"
    unit2.facing = 1
    map.addCounter(loc, unit2)
    organizeStacks(map)

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    move.droppingMove = true
    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    move.droppingMove = false
    expect(move.addActions.length).toBe(1)

    expect(map.units[2][3].filter(u => u.ghost).length).toBe(0)

    expect(mapSelectMovement(game, false)).toBe(2)
    expect(mapSelectMovement(game, true)).toBe(2)

    expect(openHexMovement(map, loc, new Coordinate(2, 2))).toBe(1)
    expect(openHexMovement(map, loc, new Coordinate(2, 3))).toBe(1)
    expect(openHexMovement(map, loc, new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.move(2, 2)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(hexOpenType.Closed)

    game.finishMove()

    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.parent?.name).toBe(undefined)
    expect(all[0].unit.name).toBe("3.7cm Pak 36")
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.children.length).toBe(0)
    expect(all[1].unit.name).toBe("Crew")

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Crew")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.parent?.name).toBe("Crew")
    expect(all[1].unit.name).toBe("3.7cm Pak 36")
  })

  test("picking up opponenet sw", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, unit)

    const unit2 = new Unit(testGMG)
    unit2.nation = "ussr"
    unit2.id = "test2"
    try {
      map.addCounter(new Coordinate(3, 2), unit2)
    } catch(err) {
      // Warning expected for placing a unit by itself
      expect(err instanceof WarningActionError).toBe(true)
    }

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(showLoadMove(game)).toBe(false)

    game.move(3, 2)
    expect(showLoadMove(game)).toBe(true)
    move.loadingMove = true
    select(map, {
      counter: map.countersAt(new Coordinate(3, 2))[0],
      target: { type: "map", xy: new Coordinate(3, 2) }
    }, () => {})
    expect(move.addActions.length).toBe(1)
    expect(move.addActions[0].cost).toBe(2)
    expect(move.addActions[0].id).toBe("test2")
    expect(move.addActions[0].parent_id).toBe("test1")
    move.loadingMove = false

    game.finishMove()

    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.parent?.name).toBe("Rifle")
    expect(all[1].unit.name).toBe("MG 08/15")

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(0)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.parent?.name).toBe(undefined)
    expect(all[1].unit.name).toBe("MG 08/15")
  })

  test("picking up opponenet gun", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGCrew)
    const loc = new Coordinate(3, 2)

    const unit2 = new Unit(testGGun)
    unit2.id = "test2"
    unit2.nation = "ussr"
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

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(showLoadMove(game)).toBe(true)
    move.loadingMove = true
    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(move.addActions.length).toBe(1)
    move.loadingMove = false

    expect(showLoadMove(game)).toBe(false)

    expect(openHexMovement(map, loc, new Coordinate(2, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, loc, new Coordinate(4, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, loc, new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.finishMove()

    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Crew")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.parent?.name).toBe("Crew")
    expect(all[1].unit.name).toBe("3.7cm Pak 36")

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.parent?.name).toBe(undefined)
    expect(all[0].unit.name).toBe("3.7cm Pak 36")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.children.length).toBe(0)
    expect(all[1].unit.name).toBe("Crew")
  })

  test("snow movement", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    map.baseTerrain = baseTerrainType.Snow
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 3
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(2)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(3)

    game.move(3, 2)
    expect(move.path.length).toBe(2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.move(2, 2)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 3))).toBe(hexOpenType.Closed)

    game.move(1, 2)
    expect(openHexMovement(map, new Coordinate(1, 2), new Coordinate(0, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(1, 2), new Coordinate(0, 3))).toBe(hexOpenType.Closed)

    game.finishMove()
    const all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(1)
    expect(all[0].hex?.y).toBe(2)
  })

  test("stream movement", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const loc = new Coordinate(3, 4)
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    map.addCounter(loc, unit)

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(openHexMovement(map, loc, new Coordinate(4, 4))).toBe(1)
    expect(openHexMovement(map, loc, new Coordinate(2, 4))).toBe(2)
    expect(openHexMovement(map, loc, new Coordinate(2, 3))).toBe(1)

    game.move(2, 4)
    expect(move.path.length).toBe(2)
    expect(openHexMovement(map, new Coordinate(2, 4), new Coordinate(1, 4))).toBe(1)
    expect(openHexMovement(map, new Coordinate(2, 4), new Coordinate(3, 4))).toBe(hexOpenType.Open)
    expect(openHexMovement(map, new Coordinate(2, 4), new Coordinate(2, 3))).toBe(2)

    game.move(1, 4)
    expect(openHexMovement(map, new Coordinate(1, 4), new Coordinate(2, 4))).toBe(hexOpenType.Open)
    expect(openHexMovement(map, new Coordinate(1, 4), new Coordinate(1, 3))).toBe(hexOpenType.Closed)

    game.finishMove()
    const all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(1)
    expect(all[0].hex?.y).toBe(4)
  })

  test("fence movement", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const loc = new Coordinate(3, 0)
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.baseMovement = 3
    unit.select()
    map.addCounter(loc, unit)

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(openHexMovement(map, loc, new Coordinate(4, 0))).toBe(1)
    expect(openHexMovement(map, loc, new Coordinate(2, 0))).toBe(2)
    expect(openHexMovement(map, loc, new Coordinate(3, 1))).toBe(1)

    game.move(2, 0)
    expect(move.path.length).toBe(2)
    expect(openHexMovement(map, new Coordinate(2, 0), new Coordinate(1, 0))).toBe(1)
    expect(openHexMovement(map, new Coordinate(2, 0), new Coordinate(3, 0))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(2, 0), new Coordinate(2, 1))).toBe(1)

    game.move(1, 0)
    expect(openHexMovement(map, new Coordinate(1, 0), new Coordinate(1, 0))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(1, 0), new Coordinate(1, 1))).toBe(hexOpenType.Closed)

    game.finishMove()
    const all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(1)
    expect(all[0].hex?.y).toBe(0)
  })

  test("tank movement", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGTank)
    unit.id = "test1"
    unit.facing = 1
    unit.turretFacing = 1
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(mapSelectMovement(game, false)).toBe(5)
    expect(mapSelectMovement(game, true)).toBe(6)

    expect(move.path[0].facing).toBe(1)
    expect(move.path[0].turret).toBe(1)

    expect(showLaySmoke(game)).toBe(false)
    expect(showDropMove(game)).toBe(false)
    expect(showLoadMove(game)).toBe(false)

    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(0, 0))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(hexOpenType.Closed)

    game.move(3, 2)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(4, 2))).toBe(hexOpenType.Open)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.moveRotate(3, 2, 2)
    expect(move.path.length).toBe(3)
    expect(move.path[2].facing).toBe(2)
    expect(move.path[2].turret).toBe(2)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(4, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 1))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.move(2, 1)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(2, 1), new Coordinate(2, 0))).toBe(1)
    expect(openHexMovement(map, new Coordinate(2, 1), new Coordinate(3, 2))).toBe(hexOpenType.Open)
    expect(openHexMovement(map, new Coordinate(2, 1), new Coordinate(2, 1))).toBe(hexOpenType.Closed)

    move.rotatingTurret = true
    game.moveRotate(2, 1, 6)
    move.rotatingTurret = false
    expect(move.path.length).toBe(4)
    expect(move.path[3].facing).toBe(2)
    expect(move.path[3].turret).toBe(6)

    game.moveRotate(2, 1, 1)
    expect(move.path.length).toBe(5)
    expect(move.path[4].facing).toBe(1)
    expect(move.path[4].turret).toBe(5)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(2, 1), new Coordinate(1, 1))).toBe(1)
    expect(openHexMovement(map, new Coordinate(2, 1), new Coordinate(3, 1))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(2, 1), new Coordinate(3, 2))).toBe(hexOpenType.Closed)

    game.move(1, 1)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(false)
    expect(openHexMovement(map, new Coordinate(1, 1), new Coordinate(0, 1))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(1, 1), new Coordinate(2, 1))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(1, 1), new Coordinate(2, 2))).toBe(hexOpenType.Closed)

    game.finishMove()
    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(1)
    expect(all[0].hex?.y).toBe(1)
    expect(all[0].marker.facing).toBe(1)
    expect(all[1].hex?.x).toBe(1)
    expect(all[1].hex?.y).toBe(1)
    expect(all[1].unit.facing).toBe(1)
    expect(all[1].unit.turretFacing).toBe(5)
    expect(all[1].unit.status).toBe(unitStatus.Activated)

    game.executeUndo()
    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].marker.facing).toBe(1)
    expect(all[1].hex?.x).toBe(4)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.facing).toBe(1)
    expect(all[1].unit.turretFacing).toBe(1)
    expect(all[1].unit.status).toBe(unitStatus.Normal)
  })

  test("truck movement", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const loc = new Coordinate(4, 2)

    const unit = new Unit(testGTruck)
    unit.id = "test1"
    unit.facing = 1
    unit.baseMovement = 3
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

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(mapSelectMovement(game, false)).toBe(3)
    expect(mapSelectMovement(game, true)).toBe(3)
    expect(showLaySmoke(game)).toBe(false)
    expect(showDropMove(game)).toBe(true)
    expect(showLoadMove(game)).toBe(false)

    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, loc, new Coordinate(3, 2))).toBe(0.5)
    expect(openHexMovement(map, loc, new Coordinate(2, 3))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, loc, new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.move(3, 2)
    expect(movementPastCost(map, unit)).toBe(0.5)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(0.5)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.moveRotate(3, 2, 2)
    expect(movementPastCost(map, unit)).toBe(1.5)
    expect(move.path.length).toBe(3)
    expect(move.path[2].facing).toBe(2)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 1))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.Closed)

    game.move(2, 1)
    expect(movementPastCost(map, unit)).toBe(2.5)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(false)
    expect(openHexMovement(map, new Coordinate(2, 1), new Coordinate(1, 1))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(2, 1), new Coordinate(2, 0))).toBe(hexOpenType.Closed)

    game.finishMove()

    let all = map.allCounters
    expect(all.length).toBe(3)
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(1)
    expect(all[0].unit.parent?.name).toBe(undefined)
    expect(all[0].unit.name).toBe("Opel Blitz")
    expect(all[0].unit.children.length).toBe(2)
    expect(all[0].unit.facing).toBe(2)
    expect(all[0].unit.status).toBe(unitStatus.Activated)
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(1)
    expect(all[1].unit.children.length).toBe(0)
    expect(all[1].unit.name).toBe("3.7cm Pak 36")
    expect(all[1].unit.parent?.name).toBe("Opel Blitz")
    expect(all[1].unit.facing).toBe(5)
    expect(all[1].unit.status).toBe(unitStatus.Activated)
    expect(all[2].hex?.x).toBe(2)
    expect(all[2].hex?.y).toBe(1)
    expect(all[2].unit.children.length).toBe(0)
    expect(all[2].unit.name).toBe("Crew")
    expect(all[2].unit.parent?.name).toBe("Opel Blitz")
    expect(all[2].unit.status).toBe(unitStatus.Activated)

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(3)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.parent?.name).toBe(undefined)
    expect(all[0].unit.name).toBe("Opel Blitz")
    expect(all[0].unit.children.length).toBe(2)
    expect(all[0].unit.facing).toBe(1)
    expect(all[0].unit.status).toBe(unitStatus.Normal)
    expect(all[1].hex?.x).toBe(4)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.children.length).toBe(0)
    expect(all[1].unit.name).toBe("3.7cm Pak 36")
    expect(all[1].unit.parent?.name).toBe("Opel Blitz")
    expect(all[1].unit.facing).toBe(4)
    expect(all[1].unit.status).toBe(unitStatus.Normal)
    expect(all[2].hex?.x).toBe(4)
    expect(all[2].hex?.y).toBe(2)
    expect(all[2].unit.children.length).toBe(0)
    expect(all[2].unit.name).toBe("Crew")
    expect(all[2].unit.parent?.name).toBe("Opel Blitz")
    expect(all[2].unit.status).toBe(unitStatus.Normal)
  })

  test("truck dropping gun pre-turn", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const loc = new Coordinate(4, 2)

    const unit = new Unit(testGTruck)
    unit.id = "test1"
    unit.facing = 1
    unit.baseMovement = 4
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

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(mapSelectMovement(game, false)).toBe(4)
    expect(mapSelectMovement(game, true)).toBe(4)

    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, loc, new Coordinate(3, 2))).toBe(0.5)
    expect(openHexMovement(map, loc, new Coordinate(2, 3))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, loc, new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.move(3, 2)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(0.5)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    move.droppingMove = true
    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    move.droppingMove = false
    expect(move.addActions.length).toBe(1)
    expect(move.addActions[0].facing).toBe(4)
    expect(move.addActions[0].cost).toBe(1)
    expect(map.units[2][3].filter(u => u.ghost).length).toBe(1)

    game.moveRotate(3, 2, 2)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 1))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.Closed)

    game.move(2, 1)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(false)
    expect(openHexMovement(map, new Coordinate(2, 1), new Coordinate(1, 1))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(2, 1), new Coordinate(2, 0))).toBe(hexOpenType.Closed)

    game.finishMove()

    let all = map.allCounters
    expect(all.length).toBe(3)
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(1)
    expect(all[0].unit.parent?.name).toBe(undefined)
    expect(all[0].unit.name).toBe("Opel Blitz")
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.facing).toBe(2)
    expect(all[0].unit.status).toBe(unitStatus.Activated)
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(1)
    expect(all[1].unit.children.length).toBe(0)
    expect(all[1].unit.name).toBe("Crew")
    expect(all[1].unit.parent?.name).toBe("Opel Blitz")
    expect(all[1].unit.status).toBe(unitStatus.Activated)
    expect(all[2].hex?.x).toBe(3)
    expect(all[2].hex?.y).toBe(2)
    expect(all[2].unit.children.length).toBe(0)
    expect(all[2].unit.name).toBe("3.7cm Pak 36")
    expect(all[2].unit.parent).toBe(undefined)
    expect(all[2].unit.facing).toBe(4)
    expect(all[2].unit.status).toBe(unitStatus.Activated)

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(3)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.parent?.name).toBe(undefined)
    expect(all[0].unit.name).toBe("Opel Blitz")
    expect(all[0].unit.children.length).toBe(2)
    expect(all[0].unit.facing).toBe(1)
    expect(all[0].unit.status).toBe(unitStatus.Normal)
    expect(all[1].hex?.x).toBe(4)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.children.length).toBe(0)
    expect(all[1].unit.name).toBe("3.7cm Pak 36")
    expect(all[1].unit.parent?.name).toBe("Opel Blitz")
    expect(all[1].unit.facing).toBe(4)
    expect(all[1].unit.status).toBe(unitStatus.Normal)
    expect(all[2].hex?.x).toBe(4)
    expect(all[2].hex?.y).toBe(2)
    expect(all[2].unit.children.length).toBe(0)
    expect(all[2].unit.name).toBe("Crew")
    expect(all[2].unit.parent?.name).toBe("Opel Blitz")
    expect(all[2].unit.status).toBe(unitStatus.Normal)
  })

  test("truck dropping gun post-turn", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const loc = new Coordinate(4, 2)

    const unit = new Unit(testGTruck)
    unit.id = "test1"
    unit.facing = 1
    unit.baseMovement = 3
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

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(mapSelectMovement(game, false)).toBe(3)
    expect(mapSelectMovement(game, true)).toBe(3)

    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, loc, new Coordinate(3, 2))).toBe(0.5)
    expect(openHexMovement(map, loc, new Coordinate(2, 3))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, loc, new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.move(3, 2)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(0.5)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.moveRotate(3, 2, 2)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 1))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.Closed)

    move.droppingMove = true
    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    move.droppingMove = false
    expect(move.addActions.length).toBe(1)
    expect(move.addActions[0].facing).toBe(5)
    expect(move.addActions[0].cost).toBe(1)
    expect(map.units[2][3].filter(u => u.ghost).length).toBe(1)

    game.move(2, 1)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(false)
    expect(openHexMovement(map, new Coordinate(2, 1), new Coordinate(1, 1))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(2, 1), new Coordinate(2, 0))).toBe(hexOpenType.Closed)

    game.finishMove()

    let all = map.allCounters
    expect(all.length).toBe(3)
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(1)
    expect(all[0].unit.parent?.name).toBe(undefined)
    expect(all[0].unit.name).toBe("Opel Blitz")
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.facing).toBe(2)
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(1)
    expect(all[1].unit.children.length).toBe(0)
    expect(all[1].unit.name).toBe("Crew")
    expect(all[1].unit.parent?.name).toBe("Opel Blitz")
    expect(all[2].hex?.x).toBe(3)
    expect(all[2].hex?.y).toBe(2)
    expect(all[2].unit.children.length).toBe(0)
    expect(all[2].unit.name).toBe("3.7cm Pak 36")
    expect(all[2].unit.parent).toBe(undefined)
    expect(all[2].unit.facing).toBe(5)

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(3)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.parent?.name).toBe(undefined)
    expect(all[0].unit.name).toBe("Opel Blitz")
    expect(all[0].unit.children.length).toBe(2)
    expect(all[0].unit.facing).toBe(1)
    expect(all[1].hex?.x).toBe(4)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.children.length).toBe(0)
    expect(all[1].unit.name).toBe("3.7cm Pak 36")
    expect(all[1].unit.parent?.name).toBe("Opel Blitz")
    expect(all[1].unit.facing).toBe(4)
    expect(all[2].hex?.x).toBe(4)
    expect(all[2].hex?.y).toBe(2)
    expect(all[2].unit.children.length).toBe(0)
    expect(all[2].unit.name).toBe("Crew")
    expect(all[2].unit.parent?.name).toBe("Opel Blitz")
  })

  test("truck dropping infantry", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const loc = new Coordinate(4, 2)

    const unit = new Unit(testGTruck)
    unit.id = "test1"
    unit.facing = 1
    unit.baseMovement = 3
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

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(mapSelectMovement(game, false)).toBe(3)
    expect(mapSelectMovement(game, true)).toBe(3)

    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, loc, new Coordinate(3, 2))).toBe(0.5)
    expect(openHexMovement(map, loc, new Coordinate(2, 3))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, loc, new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.move(3, 2)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(0.5)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.moveRotate(3, 2, 2)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 1))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.Closed)

    move.droppingMove = true
    select(map, {
      counter: map.countersAt(loc)[2],
      target: { type: "map", xy: loc }
    }, () => {})
    move.droppingMove = false
    expect(move.addActions.length).toBe(1)
    expect(move.addActions[0].facing).toBe(undefined)
    expect(move.addActions[0].cost).toBe(1)
    expect(map.units[2][3].filter(u => u.ghost).length).toBe(1)

    game.move(2, 1)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(false)
    expect(openHexMovement(map, new Coordinate(2, 1), new Coordinate(1, 1))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(2, 1), new Coordinate(2, 0))).toBe(hexOpenType.Closed)

    game.finishMove()

    let all = map.allCounters
    expect(all.length).toBe(3)
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(1)
    expect(all[0].unit.parent?.name).toBe(undefined)
    expect(all[0].unit.name).toBe("Opel Blitz")
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.facing).toBe(2)
    expect(all[0].unit.status).toBe(unitStatus.Activated)
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(1)
    expect(all[1].unit.children.length).toBe(0)
    expect(all[1].unit.name).toBe("3.7cm Pak 36")
    expect(all[1].unit.parent?.name).toBe("Opel Blitz")
    expect(all[1].unit.facing).toBe(5)
    expect(all[1].unit.status).toBe(unitStatus.Activated)
    expect(all[2].hex?.x).toBe(3)
    expect(all[2].hex?.y).toBe(2)
    expect(all[2].unit.children.length).toBe(0)
    expect(all[2].unit.name).toBe("Crew")
    expect(all[2].unit.parent).toBe(undefined)
    expect(all[2].unit.status).toBe(unitStatus.Activated)

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(3)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.parent?.name).toBe(undefined)
    expect(all[0].unit.name).toBe("Opel Blitz")
    expect(all[0].unit.children.length).toBe(2)
    expect(all[0].unit.facing).toBe(1)
    expect(all[0].unit.status).toBe(unitStatus.Normal)
    expect(all[1].hex?.x).toBe(4)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.children.length).toBe(0)
    expect(all[1].unit.name).toBe("3.7cm Pak 36")
    expect(all[1].unit.parent?.name).toBe("Opel Blitz")
    expect(all[1].unit.facing).toBe(4)
    expect(all[1].unit.status).toBe(unitStatus.Normal)
    expect(all[2].hex?.x).toBe(4)
    expect(all[2].hex?.y).toBe(2)
    expect(all[2].unit.children.length).toBe(0)
    expect(all[2].unit.name).toBe("Crew")
    expect(all[2].unit.parent?.name).toBe("Opel Blitz")
    expect(all[2].unit.status).toBe(unitStatus.Normal)
  })

  test("truck loading gun", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const loc = new Coordinate(4, 2)

    const unit = new Unit(testGTruck)
    unit.id = "test1"
    unit.facing = 1
    unit.baseMovement = 4
    unit.select()

    const unit2 = new Unit(testGGun)
    unit2.id = "test2"
    unit2.facing = 1

    const unit3 = new Unit(testGCrew)
    unit3.id = "test3"

    try {
      map.addCounter(loc, unit2)
    } catch(err) {
      // Warning expected for placing a unit by itself
      expect(err instanceof WarningActionError).toBe(true)
    }
    map.addCounter(loc, unit)
    map.addCounter(loc, unit3)

    organizeStacks(map)

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(mapSelectMovement(game, false)).toBe(4)
    expect(mapSelectMovement(game, true)).toBe(4)

    move.loadingMove = true
    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc }
    }, () => {})
    move.loadingMove = false
    expect(move.addActions.length).toBe(1)
    expect(move.addActions[0].facing).toBe(1)
    expect(move.addActions[0].cost).toBe(1)

    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, loc, new Coordinate(3, 2))).toBe(0.5)
    expect(openHexMovement(map, loc, new Coordinate(2, 3))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, loc, new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.move(3, 2)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(0.5)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.moveRotate(3, 2, 2)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 1))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.Closed)

    game.move(2, 1)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(false)
    expect(openHexMovement(map, new Coordinate(2, 1), new Coordinate(1, 1))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(2, 1), new Coordinate(2, 0))).toBe(hexOpenType.Closed)

    game.finishMove()

    let all = map.allCounters
    expect(all.length).toBe(3)
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(1)
    expect(all[0].unit.parent?.name).toBe(undefined)
    expect(all[0].unit.name).toBe("Opel Blitz")
    expect(all[0].unit.children.length).toBe(2)
    expect(all[0].unit.facing).toBe(2)
    expect(all[0].unit.status).toBe(unitStatus.Activated)
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(1)
    expect(all[1].unit.children.length).toBe(0)
    expect(all[1].unit.name).toBe("3.7cm Pak 36")
    expect(all[1].unit.parent?.name).toBe("Opel Blitz")
    expect(all[1].unit.facing).toBe(5)
    expect(all[1].unit.status).toBe(unitStatus.Activated)
    expect(all[2].hex?.x).toBe(2)
    expect(all[2].hex?.y).toBe(1)
    expect(all[2].unit.children.length).toBe(0)
    expect(all[2].unit.name).toBe("Crew")
    expect(all[2].unit.parent?.name).toBe("Opel Blitz")
    expect(all[2].unit.status).toBe(unitStatus.Activated)

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(3)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.parent?.name).toBe(undefined)
    expect(all[0].unit.name).toBe("3.7cm Pak 36")
    expect(all[0].unit.children.length).toBe(0)
    expect(all[0].unit.facing).toBe(1)
    expect(all[0].unit.status).toBe(unitStatus.Normal)
    expect(all[1].hex?.x).toBe(4)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.children.length).toBe(1)
    expect(all[1].unit.name).toBe("Opel Blitz")
    expect(all[1].unit.parent).toBe(undefined)
    expect(all[1].unit.facing).toBe(1)
    expect(all[1].unit.status).toBe(unitStatus.Normal)
    expect(all[2].hex?.x).toBe(4)
    expect(all[2].hex?.y).toBe(2)
    expect(all[2].unit.children.length).toBe(0)
    expect(all[2].unit.name).toBe("Crew")
    expect(all[2].unit.parent?.name).toBe("Opel Blitz")
    expect(all[2].unit.status).toBe(unitStatus.Normal)
  })

  test("truck loading infantry", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const loc = new Coordinate(4, 2)

    const unit = new Unit(testGTruck)
    unit.id = "test1"
    unit.facing = 1
    unit.baseMovement = 4
    unit.select()

    const unit2 = new Unit(testGGun)
    unit2.id = "test2"
    unit2.facing = 1

    const unit3 = new Unit(testGCrew)
    unit3.id = "test3"

    map.addCounter(loc, unit3)
    map.addCounter(loc, unit)
    map.addCounter(loc, unit2)

    organizeStacks(map)

    game.startMove()

    const state = game.gameActionState as GameActionState
    const move = state.move as MoveActionState

    expect(mapSelectMovement(game, false)).toBe(4)
    expect(mapSelectMovement(game, true)).toBe(4)

    move.loadingMove = true
    select(map, {
      counter: map.countersAt(loc)[0],
      target: { type: "map", xy: loc }
    }, () => {})
    move.loadingMove = false
    expect(move.addActions.length).toBe(1)
    expect(move.addActions[0].facing).toBe(undefined)
    expect(move.addActions[0].cost).toBe(1)

    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, loc, new Coordinate(3, 2))).toBe(0.5)
    expect(openHexMovement(map, loc, new Coordinate(2, 3))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, loc, new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.move(3, 2)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(0.5)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.moveRotate(3, 2, 2)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 1))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.Closed)

    game.move(2, 1)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexRotatePossible(map)).toBe(false)
    expect(openHexMovement(map, new Coordinate(2, 1), new Coordinate(1, 1))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(2, 1), new Coordinate(2, 0))).toBe(hexOpenType.Closed)

    game.finishMove()

    let all = map.allCounters
    expect(all.length).toBe(3)
    expect(all[0].hex?.x).toBe(2)
    expect(all[0].hex?.y).toBe(1)
    expect(all[0].unit.parent?.name).toBe(undefined)
    expect(all[0].unit.name).toBe("Opel Blitz")
    expect(all[0].unit.children.length).toBe(2)
    expect(all[0].unit.facing).toBe(2)
    expect(all[0].unit.status).toBe(unitStatus.Activated)
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(1)
    expect(all[1].unit.children.length).toBe(0)
    expect(all[1].unit.name).toBe("3.7cm Pak 36")
    expect(all[1].unit.parent?.name).toBe("Opel Blitz")
    expect(all[1].unit.facing).toBe(5)
    expect(all[1].unit.status).toBe(unitStatus.Activated)
    expect(all[2].hex?.x).toBe(2)
    expect(all[2].hex?.y).toBe(1)
    expect(all[2].unit.children.length).toBe(0)
    expect(all[2].unit.name).toBe("Crew")
    expect(all[2].unit.parent?.name).toBe("Opel Blitz")
    expect(all[2].unit.status).toBe(unitStatus.Activated)

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(3)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.parent?.name).toBe(undefined)
    expect(all[0].unit.name).toBe("Crew")
    expect(all[0].unit.children.length).toBe(0)
    expect(all[0].unit.facing).toBe(1)
    expect(all[0].unit.status).toBe(unitStatus.Normal)
    expect(all[1].hex?.x).toBe(4)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.children.length).toBe(1)
    expect(all[1].unit.name).toBe("Opel Blitz")
    expect(all[1].unit.parent).toBe(undefined)
    expect(all[1].unit.facing).toBe(1)
    expect(all[1].unit.status).toBe(unitStatus.Normal)
    expect(all[2].hex?.x).toBe(4)
    expect(all[2].hex?.y).toBe(2)
    expect(all[2].unit.children.length).toBe(0)
    expect(all[2].unit.name).toBe("3.7cm Pak 36")
    expect(all[2].unit.parent?.name).toBe("Opel Blitz")
    expect(all[2].unit.status).toBe(unitStatus.Normal)
  })

  test("moving into wire", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    const feature = new Feature(testWire)
    feature.id = "wire"
    map.addCounter(new Coordinate(3, 2), feature)

    game.startMove()

    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(2)

    game.move(3, 2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.finishMove()
    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].feature.name).toBe("Wire")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].feature.name).toBe("Rifle")
  })

  test("moving out of wire", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    const feature = new Feature(testWire)
    feature.id = "wire"
    map.addCounter(new Coordinate(4, 2), feature)

    game.startMove()

    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(hexOpenType.All)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(hexOpenType.All)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 3))).toBe(hexOpenType.All)

    game.move(3, 2)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.finishMove()
    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].feature.name).toBe("Wire")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].feature.name).toBe("Rifle")
  })

  test("moving into mines", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, unit)

    const feature = new Feature(testMine)
    feature.id = "mine"
    const tloc = new Coordinate(3, 2)
    map.addCounter(tloc, feature)

    game.startMove()

    expect(openHexMovement(map, floc, new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, floc, new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, floc, new Coordinate(3, 3))).toBe(2)

    game.move(3, 2)
    expect(openHexMovement(map, tloc, new Coordinate(2, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, tloc, new Coordinate(2, 3))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, tloc, new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.finishMove()
    Math.random = original

    expect(game.moraleChecksNeeded).toStrictEqual([
      { unit: unit, from: [tloc], to: tloc, incendiary: true },
    ])

    expect(game.lastAction?.stringValue).toBe(
      "German Rifle moves from E3 to D3, mine roll (2d10): target 14, rolled 20, hit"
    )

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].feature.name).toBe("Minefield")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("Rifle")

    try {
      game.executeUndo()
    } catch(err) {
      // Can't roll back a mine roll
      expect(err instanceof IllegalActionError).toBe(true)
    }
  })

  test("moving into AT mines", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, unit)

    const feature = new Feature(testMineAP)
    feature.id = "mine"
    const tloc = new Coordinate(3, 2)
    map.addCounter(tloc, feature)

    game.startMove()

    expect(openHexMovement(map, floc, new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, floc, new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, floc, new Coordinate(3, 3))).toBe(2)

    game.move(3, 2)
    expect(openHexMovement(map, tloc, new Coordinate(2, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, tloc, new Coordinate(2, 3))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, tloc, new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.finishMove()
    Math.random = original

    expect(game.moraleChecksNeeded).toStrictEqual([
      { unit: unit, from: [tloc], to: tloc, incendiary: true },
    ])

    expect(game.lastAction?.stringValue).toBe(
      "German Rifle moves from E3 to D3, mine roll (2d10): target 14, rolled 20, hit"
    )

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].feature.name).toBe("AP Minefield")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("Rifle")

    try {
      game.executeUndo()
    } catch(err) {
      // Can't roll back a mine roll
      expect(err instanceof IllegalActionError).toBe(true)
    }
  })

  test("moving into AT mines", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, unit)

    const feature = new Feature(testMineAT)
    feature.id = "mine"
    const tloc = new Coordinate(3, 2)
    map.addCounter(tloc, feature)

    game.startMove()

    expect(openHexMovement(map, floc, new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, floc, new Coordinate(4, 3))).toBe(1)
    expect(openHexMovement(map, floc, new Coordinate(3, 3))).toBe(2)

    game.move(3, 2)
    expect(openHexMovement(map, tloc, new Coordinate(2, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, tloc, new Coordinate(2, 3))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, tloc, new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.finishMove()
    Math.random = original

    expect(game.moraleChecksNeeded).toStrictEqual([])

    expect(game.lastAction?.stringValue).toBe(
      "German Rifle moves from E3 to D3, AT mines have no effect"
    )

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].feature.name).toBe("AT Minefield")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("Rifle")

    game.executeUndo()
  })

  test("vehicle moving into mines", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGTank)
    unit.id = "test1"
    unit.select()
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, unit)

    const feature = new Feature(testMine)
    feature.id = "mine"
    const tloc = new Coordinate(3, 2)
    map.addCounter(tloc, feature)

    game.startMove()

    expect(openHexMovement(map, floc, new Coordinate(3, 2))).toBe(1)

    game.move(3, 2)
    expect(openHexMovement(map, tloc, new Coordinate(2, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, tloc, new Coordinate(4, 2))).toBe(hexOpenType.Closed)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.finishMove()
    Math.random = original

    expect(game.moraleChecksNeeded).toStrictEqual([])
    expect(unit.isWreck).toBe(true)

    expect(game.lastAction?.stringValue).toBe(
      "German PzKpfw 35(t) moves from E3 to D3, mine roll (2d10): target 15, rolled 20, vehicle destroyed"
    )

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].feature.name).toBe("Minefield")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("PzKpfw 35(t)")

    try {
      game.executeUndo()
    } catch(err) {
      // Can't roll back a mine roll
      expect(err instanceof IllegalActionError).toBe(true)
    }
  })

  test("vehicle moving into AP mines", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGTank)
    unit.id = "test1"
    unit.select()
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, unit)

    const feature = new Feature(testMineAP)
    feature.id = "mine"
    const tloc = new Coordinate(3, 2)
    map.addCounter(tloc, feature)

    game.startMove()

    expect(openHexMovement(map, floc, new Coordinate(3, 2))).toBe(1)

    game.move(3, 2)
    expect(openHexMovement(map, tloc, new Coordinate(2, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, tloc, new Coordinate(4, 2))).toBe(hexOpenType.Closed)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.finishMove()
    Math.random = original

    expect(game.moraleChecksNeeded).toStrictEqual([])
    expect(unit.isWreck).toBe(false)

    expect(game.lastAction?.stringValue).toBe(
      "German PzKpfw 35(t) moves from E3 to D3, AP mines have no effect"
    )

    const all = map.allCounters
    expect(all.length).toBe(3)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].feature.name).toBe("AP Minefield")
    expect(all[1].marker.type).toBe(markerType.TrackedHull)
    expect(all[2].hex?.x).toBe(3)
    expect(all[2].hex?.y).toBe(2)
    expect(all[2].unit.name).toBe("PzKpfw 35(t)")

    try {
      game.executeUndo()
    } catch(err) {
      // Can't roll back a mine roll
      expect(err instanceof IllegalActionError).toBe(true)
    }
  })

  test("vehicle moving into AT mines", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    const unit = new Unit(testGTank)
    unit.id = "test1"
    unit.select()
    const floc = new Coordinate(4, 2)
    map.addCounter(floc, unit)

    const feature = new Feature(testMineAT)
    feature.id = "mine"
    const tloc = new Coordinate(3, 2)
    map.addCounter(tloc, feature)

    game.startMove()

    expect(openHexMovement(map, floc, new Coordinate(3, 2))).toBe(1)

    game.move(3, 2)
    expect(openHexMovement(map, tloc, new Coordinate(2, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, tloc, new Coordinate(4, 2))).toBe(hexOpenType.Closed)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.finishMove()
    Math.random = original

    expect(game.moraleChecksNeeded).toStrictEqual([])
    expect(unit.isWreck).toBe(true)

    expect(game.lastAction?.stringValue).toBe(
      "German PzKpfw 35(t) moves from E3 to D3, mine roll (2d10): target 15, rolled 20, vehicle destroyed"
    )

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].feature.name).toBe("AT Minefield")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("PzKpfw 35(t)")

    try {
      game.executeUndo()
    } catch(err) {
      // Can't roll back a mine roll
      expect(err instanceof IllegalActionError).toBe(true)
    }
  })

  test("movement triggers sniper", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    game.alliedSniper = new Feature({
      t: featureType.Sniper, n: "Sniper", i: "sniper", f: 8, o: { q: 3 }, ft: 1
    })
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, unit)
    const unit2 = new Unit(testGInf)
    unit2.id = "test2"
    unit2.baseMovement = 3
    map.addCounter(loc, unit2)

    game.startMove()

    const state = game.gameActionState as GameActionState

    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(state.selection.length).toBe(2)

    game.move(3, 2)
    game.move(2, 2)
    game.move(1, 2)
    game.move(0, 2)
    game.finishMove()

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(0)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[1].hex?.x).toBe(0)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("Rifle")

    const loc2 = new Coordinate(0, 2)
    expect(game.sniperNeeded).toStrictEqual([
      { unit, loc: loc2 }, { unit: unit2, loc: loc2 }
    ])
  })

  test("same nation sniper move doesn't trigger", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    game.axisSniper = new Feature({
      t: featureType.Sniper, n: "Sniper", i: "sniper", f: 3, o: { q: 1 }, ft: 1
    })
    const unit = new Unit(testGInf)
    unit.id = "test1"
    unit.select()
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, unit)
    const unit2 = new Unit(testGInf)
    unit2.id = "test2"
    unit2.baseMovement = 3
    map.addCounter(loc, unit2)

    game.startMove()

    const state = game.gameActionState as GameActionState

    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(state.selection.length).toBe(2)

    game.move(3, 2)
    game.move(2, 2)
    game.move(1, 2)
    game.move(0, 2)
    game.finishMove()

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(0)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[1].hex?.x).toBe(0)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("Rifle")

    expect(game.sniperNeeded).toStrictEqual([])
  })

  test("vehicle move doesn't trigger sniper", () => {
    const game = createMoveGame()
    const map = game.scenario.map
    game.alliedSniper = new Feature({
      t: featureType.Sniper, n: "Sniper", i: "sniper", f: 3, o: { q: 1 }, ft: 1
    })
    const unit = new Unit(testGTank)
    unit.id = "test1"
    unit.select()
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, unit)

    game.startMove()
    game.move(3, 2)
    game.move(2, 2)
    game.move(1, 2)
    game.move(0, 2)
    game.finishMove()

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(0)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].hasMarker).toBe(true)
    expect(all[1].hex?.x).toBe(0)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("PzKpfw 35(t)")

    expect(game.sniperNeeded).toStrictEqual([])
  })
});
