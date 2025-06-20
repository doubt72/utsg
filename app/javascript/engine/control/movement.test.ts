import { MapData } from "../Map"
import { baseTerrainType, Coordinate, hexOpenType, weatherType, windType } from "../../utilities/commonTypes"
import { ScenarioData } from "../Scenario"
import Unit, { UnitData } from "../Unit"
import Game, { actionType, GameActionState, gamePhaseType, MoveActionState } from "../Game"
import { describe, expect, test } from "vitest"
import { openHexMovement, showLaySmoke, showLoadMove, showDropMove, mapSelectMovement } from "./movement"
import select from "./select"
import { addActionType } from "../GameAction"
import WarningActionError from "../actions/WarningActionError"
import organizeStacks from "../support/organizeStacks"
import { openHexRotateOpen as openHexShowRotate, openHexRotatePossible as openHexRotateOpen } from "./openHex"

describe("action integration test", () => {
  const mapData: MapData = {
    layout: [ 5, 5, "x" ],
    allied_dir: 4, axis_dir: 1,
    victory_hexes: [[0, 0, 2], [4, 4, 1]],
    allied_setup: { 0: [[0, "*"]] },
    axis_setup: { 0: [[4, "*"]] },
    base_terrain: baseTerrainType.Grass,
    night: false,
    start_weather: weatherType.Dry,
    base_weather: weatherType.Dry,
    precip: [0, weatherType.Rain],
    wind: [windType.Calm, 3, false],
    hexes: [
      [{ t: "o" }, { t: "o" }, { t: "o", b: "f", be: [4] }, { t: "o" }, { t: "o" }],
      [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
      [
        { t: "o", r: { d: [1, 4]} },
        { t: "o", r: { d: [1, 4]} },
        { t: "o", r: { d: [1, 4]} },
        { t: "o", r: { d: [1, 4]} },
        { t: "o", r: { d: [1, 4]} },
      ],
      [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "f" }, { t: "o" }],
      [
        { t: "o" },
        { t: "o", s: { d: [4, 6], t: "t" } },
        { t: "o", s: { d: [1, 5], t: "t" } },
        { t: "o" }, { t: "o" }
      ],
    ],
  }

  const ginf: UnitData = {
    c: "ger", f: 7, i: "squad", m: 3, n: "Rifle", o: {s: 1}, r: 5, s: 6, t: "sqd", v: 4, y: 0
  }
  const gldr: UnitData = {
    c: "ger", t: "ldr", n: "Leader", i: "leader", y: 0, m: 6, s: 1, f: 1, r: 1, v: 6, o: {l: 2}
  }
  const gmg: UnitData = {
    c: "ger", t: "sw", i: "mg", n: "MG 08/15", y: 23, f: 10, r: 12, v: -1, o: {r: 1, j: 3}
  }
  const gcrew: UnitData = {
    c: "ger", t: "tm", n: "Crew", i: "crew", y: 0, m: 4, s: 3, f: 1, r: 1, v: 5, o: {cw: 2}
  }
  const ggun: UnitData = {
    c: "ger", f: 8, i: "gun", n: "3.7cm Pak 36", o: {t: 1, j: 3, p: 1, c: 1, f: 18, tow: 2}, r: 16,
    t: "gun", v: 2, y: 36
  }
  const gtank: UnitData = {
    t: "tank", i: "tank", c: "ger", n: "PzKpfw 35(t)", y: 38, s: 3, f: 8, r: 12, v: 5,
    o: { t: 1, p: 1, ha: { f: 2, s: 1, r: 1, }, ta: { f: 2, s: 1, r: 2, }, j: 3, f: 18, u: 1, k: 1 },
  };
  // const wire: FeatureData = { ft: 1, n: "Wire", t: "wire", i: "wire", f: "½", r: 0, v: "A" }

  const scenarioData: ScenarioData = {
    id: "1", name: "test scenario", status: "b", allies: ["ussr"], axis: ["ger"],
    metadata: {
      author: "The Establishment",
      description: ["This is a test scenario"],
      date: [1944, 6, 5],
      location: "anywhere",
      turns: 5,
      first_deploy: 2,
      first_action: 1,
      allied_units: {
        0: { list: []}
      },
      axis_units: {
        0: { list: [ginf]}
      },
      map_data: mapData,
    }
  }

  const createGame = (): Game => {
    const game = new Game({
      id: 1,
      name: "test game", scenario: scenarioData,
      owner: "one", state: "needs_player", player_one: "one", player_two: "", current_player: "",
      metadata: { turn: 0 },
      suppress_network: true
    });

    game.turn = 1
    game.phase = gamePhaseType.Main
    game.currentPlayer = 2
    return game
  }

  test("movement along road", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(ginf)
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
  })

  test("smoke", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(ginf)
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
    expect(map.ghosts[3][3].length).toBe(1)
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
    expect(map.ghosts[3][3].length).toBe(0)

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(3)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[1].hex?.x).toBe(3)
    expect(all[1].hex?.y).toBe(3)
    expect(all[1].feature.name).toBe("Smoke")
  })

  test("multi-select", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(ginf)
    unit.id = "test1"
    unit.baseMovement = 3
    unit.smokeCapable = false // any unit in stack is enough for smoke
    unit.select()
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, unit)

    const unit2 = new Unit(ginf)
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
    expect(all[1].hex?.x).toBe(0)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("Rifle")
  })

  test("multi-select drop-off", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(ginf)
    unit.id = "test1"
    unit.baseMovement = 3
    unit.smokeCapable = false // any unit in stack is enough for smoke
    unit.select()
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, unit)

    const unit2 = new Unit(ginf)
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
    expect(all[1].hex?.x).toBe(0)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("Rifle")

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
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(ginf)
    unit.id = "test1"
    unit.baseMovement = 2
    unit.select()
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, unit)

    const unit2 = new Unit(gldr)
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

    const all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(0)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[1].hex?.x).toBe(0)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("Leader")
  })

  test("carrying sw", () => {
    const game = createGame()
    const map = game.scenario.map

    const unit = new Unit(ginf)
    unit.id = "test1"
    unit.select()
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, unit)

    const unit2 = new Unit(gmg)
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
    expect(all[1].hex?.x).toBe(1)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("MG 08/15")

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[1].hex?.x).toBe(4)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.name).toBe("MG 08/15")
  })

  test("pick up sw", () => {
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(ginf)
    unit.id = "test1"
    unit.select()
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, unit)

    const unit2 = new Unit(gmg)
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
    expect(all[1].hex?.x).toBe(2)
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

  test("drop sw", () => {
    const game = createGame()
    const map = game.scenario.map

    const unit = new Unit(ginf)
    unit.id = "test1"
    unit.select()
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, unit)

    const unit2 = new Unit(gmg)
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
    expect(map.ghosts[2][4].length).toBe(0)
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

    expect(map.ghosts[2][3].length).toBe(1)

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
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.children.length).toBe(0)
    expect(all[1].unit.name).toBe("Rifle")

    game.executeUndo()

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(4)
    expect(all[0].hex?.y).toBe(2)
    expect(all[0].unit.children.length).toBe(1)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[1].hex?.x).toBe(4)
    expect(all[1].hex?.y).toBe(2)
    expect(all[1].unit.parent?.name).toBe("Rifle")
    expect(all[1].unit.name).toBe("MG 08/15")
  })

  test("move gun", () => {
    const game = createGame()
    const map = game.scenario.map

    const loc = new Coordinate(3, 2)
    const unit = new Unit(gcrew)
    unit.id = "test1"
    unit.select()
    map.addCounter(loc, unit)

    const unit2 = new Unit(ggun)
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

    expect(openHexShowRotate(map)).toBe(true)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(4, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.move(2, 2)

    expect(move.path.length).toBe(2)
    expect(openHexShowRotate(map)).toBe(true)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(1, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(3, 2))).toBe(hexOpenType.Open)
    expect(openHexMovement(map, new Coordinate(2, 2), new Coordinate(2, 3))).toBe(hexOpenType.Closed)

    game.moveRotate(2, 2, 2)
    expect(move.path.length).toBe(3)
    expect(move.path[2].facing).toBe(2)
    expect(openHexShowRotate(map)).toBe(true)
    expect(openHexRotateOpen(map)).toBe(false)
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
    expect(all[1].hex?.x).toBe(2)
    expect(all[1].hex?.y).toBe(2)
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

  test("move gun into trees", () => {
    const game = createGame()
    const map = game.scenario.map

    const loc = new Coordinate(3, 2)
    const unit = new Unit(gcrew)
    unit.id = "test1"
    unit.select()
    map.addCounter(loc, unit)

    const unit2 = new Unit(ggun)
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

    expect(openHexShowRotate(map)).toBe(true)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(4, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 1))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(2)

    game.move(3, 3)

    expect(move.path.length).toBe(2)
    expect(openHexShowRotate(map)).toBe(true)
    expect(openHexRotateOpen(map)).toBe(false)
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
    const game = createGame()
    const map = game.scenario.map

    const loc = new Coordinate(3, 2)
    const unit = new Unit(gcrew)
    unit.id = "test1"
    unit.select()
    map.addCounter(loc, unit)

    const unit2 = new Unit(ggun)
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

    expect(openHexShowRotate(map)).toBe(true)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(4, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 1))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.All)

    game.move(3, 3)

    expect(move.path.length).toBe(2)
    expect(openHexShowRotate(map)).toBe(true)
    expect(openHexRotateOpen(map)).toBe(false)
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
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(gcrew)
    unit.id = "test1"
    unit.select()
    map.addCounter(new Coordinate(4, 2), unit)

    const unit2 = new Unit(ggun)
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
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(gcrew)
    const loc = new Coordinate(3, 2)

    const unit2 = new Unit(ggun)
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

  test("drop gun", () => {
    const game = createGame()
    const map = game.scenario.map
    const loc = new Coordinate(3, 2)

    const unit = new Unit(gcrew)
    unit.id = "test1"
    unit.select()
    map.addCounter(loc, unit)

    const unit2 = new Unit(ggun)
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

    expect(map.ghosts[2][3].length).toBe(0)

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
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(ginf)
    unit.id = "test1"
    unit.select()
    const loc = new Coordinate(4, 2)
    map.addCounter(loc, unit)

    const unit2 = new Unit(gmg)
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
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(gcrew)
    const loc = new Coordinate(3, 2)

    const unit2 = new Unit(ggun)
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
    const game = createGame()
    const map = game.scenario.map
    map.baseTerrain = baseTerrainType.Snow
    const unit = new Unit(ginf)
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
    const game = createGame()
    const map = game.scenario.map
    const loc = new Coordinate(3, 4)
    const unit = new Unit(ginf)
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
    const game = createGame()
    const map = game.scenario.map
    const loc = new Coordinate(3, 0)
    const unit = new Unit(ginf)
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
    const game = createGame()
    const map = game.scenario.map
    const unit = new Unit(gtank)
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

    expect(openHexShowRotate(map)).toBe(true)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(0, 0))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(3, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(4, 2), new Coordinate(4, 3))).toBe(hexOpenType.Closed)

    game.move(3, 2)
    expect(openHexShowRotate(map)).toBe(true)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(4, 2))).toBe(hexOpenType.Open)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.moveRotate(3, 2, 2)
    expect(move.path.length).toBe(3)
    expect(move.path[2].facing).toBe(2)
    expect(move.path[2].turret).toBe(2)
    expect(openHexShowRotate(map)).toBe(true)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(4, 2))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(2, 1))).toBe(1)
    expect(openHexMovement(map, new Coordinate(3, 2), new Coordinate(3, 3))).toBe(hexOpenType.Closed)

    game.move(2, 1)
    expect(openHexShowRotate(map)).toBe(true)
    expect(openHexRotateOpen(map)).toBe(true)
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
    expect(openHexShowRotate(map)).toBe(true)
    expect(openHexRotateOpen(map)).toBe(true)
    expect(openHexMovement(map, new Coordinate(2, 1), new Coordinate(1, 1))).toBe(1)
    expect(openHexMovement(map, new Coordinate(2, 1), new Coordinate(3, 1))).toBe(hexOpenType.Closed)
    expect(openHexMovement(map, new Coordinate(2, 1), new Coordinate(3, 2))).toBe(hexOpenType.Closed)

    game.move(1, 1)
    expect(openHexShowRotate(map)).toBe(true)
    expect(openHexRotateOpen(map)).toBe(false)
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
  })

  // TODO: all the truck/wheeled movement/loading/etc
  // TODO: wire/mines/engineering
});
