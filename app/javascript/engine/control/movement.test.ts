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
      [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
      [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
      [
        { t: "o", r: { d: [1, 4] } },
        { t: "o", r: { d: [1, 4] } },
        { t: "o", r: { d: [1, 4] } },
        { t: "o", r: { d: [1, 4] } },
        { t: "o", r: { d: [1, 4] } },
      ],
      [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "f" }, { t: "o" }],
      [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
    ],
  }

  const ginf: UnitData = {
    c: "ger", f: 7, i: "squad", m: 3, n: "Rifle", o: {s: 1}, r: 5, s: 6, t: "sqd", v: 4, y: 0, x: 3
  }
  const gldr: UnitData = {
    c: "ger", t: "ldr", n: "Leader", i: "leader", y: 0, m: 6, s: 1, f: 1, r: 1, v: 6, o: {l: 2}
  }
  const gmg: UnitData = {
    c: "ger", t: "sw", i: "mg", n: "MG 08/15", y: 23, f: 10, r: 12, v: -1, o: {r: 1, j: 3}
  }
  // const rinf: UnitData = {
  //   c: "ussr", f: 8, i: "squad", m: 4, n: "Guards SMG", o: {a: 1}, r: 3, s: 6, t: "sqd", v: 5, y: 41
  // }
  // const rcrew: UnitData = {
  //   c: "ussr", t: "tm", n: "Crew", i: "crew", y: 0, m: 4, s: 3, f: 1, r: 1, v: 5, o: {cw: 2}
  // }
  // const rgun: UnitData = {
  //   c: "ussr", f: 16, i: "gun", n: "76mm M1927", o: {t: 1, j: 3, g: 1, s: 1, c: 1, tow: 3}, r: 16,
  //   t: "gun", v: 1, y: 28
  // }
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

    game.move(3, 2)

    move.droppingMove = true
    select(map, {
      counter: map.countersAt(loc)[1],
      target: { type: "map", xy: loc }
    }, () => {})
    move.droppingMove = false

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
    
  })

  test("turn gun", () => {
    
  })

  test("pick up gun", () => {
    
  })

  test("drop gun", () => {
    
  })

  test("stream movement", () => {

  })

  test("fence movement", () => {
    
  })

  test("snow movement", () => {
    
  })

  // TODO: tank movement/turrets
  // TODO: all the truck movement/loading/etc
});
