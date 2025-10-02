import { describe, expect, test } from "vitest";
import Game, { gamePhaseType } from "./Game";
import { ScenarioData } from "./Scenario";
import { MapData } from "./Map";
import { Coordinate, baseTerrainType, weatherType, windType } from "../utilities/commonTypes";
import { UnitData } from "./Unit";
import GameAction, { GameActionData } from "./GameAction";
import { FeatureData } from "./Feature";

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
      [{ t: "o" }, { t: "f" }, { t: "o" }, { t: "o" }, { t: "o" }],
      [{ t: "o" }, { t: "f" }, { t: "f" }, { t: "f" }, { t: "o" }],
      [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "f" }, { t: "o" }],
      [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
    ],
  }

  const ginf: UnitData = {
    c: "ger", f: 7, i: "squad", m: 3, n: "Rifle", o: {s: 1}, r: 5, s: 6, t: "sqd", v: 4, y: 0, x: 3
  }
  const rinf: UnitData = {
    c: "ussr", f: 8, i: "squad", m: 4, n: "Guards SMG", o: {a: 1}, r: 3, s: 6, t: "sqd", v: 5, y: 41
  }
  const rcrew: UnitData = {
    c: "ussr", t: "tm", n: "Crew", i: "crew", y: 0, m: 4, s: 3, f: 1, r: 1, v: 5, o: {cw: 2}
  }
  const rmg: UnitData = {
    c: "ussr", t: "sw", i: "mg", n: "DShK", y: 38, f: 14, r: 15, v: -2, o: {r: 1, j: 3}
  }
  const rgun: UnitData = {
    c: "ussr", f: 16, i: "gun", n: "76mm ZiS-3", o: {t: 1, j: 3, g: 1, s: 1, c: 1, tow: 3}, r: 16,
    t: "gun", v: 1, y: 28
  }
  const rldr: UnitData = {
    c: "ussr", t: "ldr", n: "Leader", i: "leader", y: 0, m: 6, s: 1, f: 1, r: 1, v: 6, o: {l: 2}
  }
  const wire: FeatureData = { ft: 1, n: "Wire", t: "wire", i: "wire", f: "½", r: 0, v: "A" }

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
        0: { list: [rinf, rcrew, rmg, rldr, rgun]}
      },
      axis_units: {
        0: { list: [ginf, wire]}
      },
      map_data: mapData,
    }
  };

  const game = new Game({
    id: 1,
    name: "test game", scenario: scenarioData,
    owner: "one", state: "needs_player", player_one: "one", player_two: "", current_player: "",
    metadata: { turn: 0 },
    suppress_network: true
  });

  test("validation", () => {
    const actionData = { user: "two", player: 1, data: { action: "deploy", old_initiative: game.initiative } }

    expect(() => new GameAction(actionData, game, 0).actionClass).toThrowError('Bad data for action')
  })

  test("sequence", () => {
    let index = 0
    let currentActionData: GameActionData = {
      user: "one", player: 1, data: { action: "create", old_initiative: game.initiative },
    }
    game.executeAction(new GameAction(currentActionData, game, index++), false)

    expect(game.playerOneName).toBe("one")
    expect(game.playerTwoName).toBe("")
    expect(game.state).toBe("needs_player")
    currentActionData = { user: "one", player: 1, data: { action: "join", old_initiative: game.initiative } }
    game.executeAction(new GameAction(currentActionData, game, index++), false)
    expect(game.playerOneName).toBe("one")
    expect(game.state).toBe("needs_player")

    expect(game.playerTwoName).toBe("")
    currentActionData = { user: "two", player: 2, data: { action: "join", old_initiative: game.initiative } }
    game.executeAction(new GameAction(currentActionData, game, index++), false)
    expect(game.playerTwoName).toBe("two")
    expect(game.state).toBe("ready")

    currentActionData = { user: "two", player: 2, data: { action: "leave", old_initiative: game.initiative } }
    game.executeAction(new GameAction(currentActionData, game, index++), false)
    expect(game.playerTwoName).toBe("")
    expect(game.state).toBe("needs_player")

    currentActionData = { user: "two", player: 2, data: { action: "join", old_initiative: game.initiative } }
    game.executeAction(new GameAction(currentActionData, game, index++), false)
    expect(game.playerTwoName).toBe("two")
    expect(game.state).toBe("ready")

    currentActionData = { user: "one", player: 1, data: { action: "start", old_initiative: game.initiative } }
    game.executeAction(new GameAction(currentActionData, game, index++), false)
    expect(game.state).toBe("in_progress")

    currentActionData = {
      user: "two", player: 2,
      data: {
        action: "phase", old_initiative: game.initiative,
        phase_data: {
          old_turn: 0, new_turn: 0, old_phase: gamePhaseType.Deployment, new_phase: gamePhaseType.Deployment,
          new_player: 2,
        },
      },
    }
    game.executeAction(new GameAction(currentActionData, game, index++), false)
    expect(game.lastAction?.stringValue).toBe("game started, begin German deployment")
    expect(game.lastAction?.undoPossible).toBe(false)

    expect(game.scenario.axisReinforcements[0][0].x).toBe(3)
    expect(game.scenario.axisReinforcements[0][0].used).toBe(0)
    currentActionData = {
      user: "two", player: 2, data: {
        action: "deploy", old_initiative: game.initiative,
        path: [ { x: 4, y: 3, facing: 1 }],
        deploy: [ { turn: 0, index: 0, id: `uf-${game.actions.length}` } ],
      }
    }
    game.executeAction(new GameAction(currentActionData, game, index++), false)
    expect(game.scenario.axisReinforcements[0][0].used).toBe(1)
    expect(game.scenario.map.countersAt(new Coordinate(4, 3))[0].unit.name).toBe("Rifle")
    expect(game.actions[index - 1].stringValue).toBe("deployed German unit: Rifle to E4")

    expect(game.undoPossible).toBe(true)
    expect(game.actions.length).toBe(index)
    expect(game.lastActionIndex).toBe(index - 1)
    game.executeUndo()
    expect(game.scenario.axisReinforcements[0][0].used).toBe(0)
    expect(game.scenario.map.countersAt(new Coordinate(4, 3)).length).toBe(0)
    // Undone actions are just marked as undone
    expect(game.actions.length).toBe(index)
    // Otherwise actions are treated sort of as a stack, with lastActionIndex as the
    // "execution" pointer
    expect(game.lastActionIndex).toBe(index - 2)
    expect(game.actions[index - 1].stringValue).toBe("deployed German unit: Rifle to E4 [cancelled]")

    // Loading an undone action doesn't execute or increment last action
    currentActionData = {
      undone: true, user: "two", player: 2, data: {
        action: "deploy", old_initiative: game.initiative,
        path: [ { x: 4, y: 3, facing: 1 }],
        deploy: [ { turn: 0, index: 0, id: `uf-${game.actions.length}` } ],
      }
    }
    game.executeAction(new GameAction(currentActionData, game, index++), false)
    expect(game.scenario.axisReinforcements[0][0].used).toBe(0)
    expect(game.scenario.map.countersAt(new Coordinate(4, 3)).length).toBe(0)
    expect(game.actions.length).toBe(index)
    expect(game.lastActionIndex).toBe(index - 3)

    currentActionData = {
      user: "two", player: 2, data: {
        action: "deploy", old_initiative: game.initiative,
        path: [ { x: 4, y: 4, facing: 1 }],
        deploy: [ { turn: 0, index: 0, id: `uf-${game.actions.length}` } ],
      }
    }
    game.executeAction(new GameAction(currentActionData, game, index++), false)
    expect(game.scenario.axisReinforcements[0][0].used).toBe(1)
    expect(game.scenario.map.countersAt(new Coordinate(4, 4))[0].unit.name).toBe("Rifle")

    // Same unit, same spot
    game.executeAction(new GameAction(currentActionData, game, index++), false)
    expect(game.scenario.axisReinforcements[0][0].used).toBe(2)
    expect(game.scenario.map.countersAt(new Coordinate(4, 4)).length).toBe(2)
    expect(game.scenario.map.countersAt(new Coordinate(4, 4))[0].unit.name).toBe("Rifle")
    expect(game.scenario.map.countersAt(new Coordinate(4, 4))[1].unit.name).toBe("Rifle")

    currentActionData = {
      user: "two", player: 2, data: {
        action: "deploy", old_initiative: game.initiative,
        path: [ { x: 4, y: 3, facing: 1 }],
        deploy: [ { turn: 0, index: 0, id: `uf-${game.actions.length}` } ],
      }
    }
    game.executeAction(new GameAction(currentActionData, game, index++), false)
    expect(game.scenario.axisReinforcements[0][0].used).toBe(3)
    expect(game.scenario.map.countersAt(new Coordinate(4, 3))[0].unit.name).toBe("Rifle")

    // Should trigger phase end
    expect(game.actions.length).toBe(index)
    expect(game.lastActionIndex).toBe(index - 1)
    currentActionData = {
      user: "two", player: 2, data: {
        action: "deploy", old_initiative: game.initiative,
        path: [ { x: 4, y: 1, facing: 1 }],
        deploy: [ { turn: 0, index: 1, id: `uf-${game.actions.length}` } ],
      }
    }
    game.executeAction(new GameAction(currentActionData, game, index++), false)
    expect(game.scenario.axisReinforcements[0][1].used).toBe(1)
    expect(game.scenario.map.countersAt(new Coordinate(4, 3))[0].unit.name).toBe("Rifle")

    expect(game.lastAction?.stringValue).toBe("German deployment done, begin Soviet deployment")

    index++
    expect(game.actions.length).toBe(index)
    expect(game.lastActionIndex).toBe(index - 1)
    expect(game.currentPlayer).toBe(1)

    game.executeUndo()
    expect(game.actions.length).toBe(index)
    expect(game.lastActionIndex).toBe(index - 3)
    expect(game.currentPlayer).toBe(2)
    expect(game.lastAction?.stringValue).toBe("deployed German unit: Rifle to E4")
    expect(game.actions[game.actions.length-2].stringValue).toBe("deployed German unit: Wire to E2 [cancelled]")
    expect(game.actions[game.actions.length-1].stringValue).toBe(
      "German deployment done, begin Soviet deployment [cancelled]"
    )

    index++
    game.executeAction(new GameAction(currentActionData, game, index++), false)
    expect(game.actions.length).toBe(index)
    expect(game.lastActionIndex).toBe(index - 1)
    expect(game.currentPlayer).toBe(1)
    expect(game.lastAction?.stringValue).toBe("German deployment done, begin Soviet deployment")

    // { list: [rinf, rcrew, rmg, rldr, rgun]}

    currentActionData = {
      user: "one", player: 1, data: {
        action: "deploy", old_initiative: game.initiative,
        path: [ { x: 0, y: 0, facing: 1 }],
        deploy: [ { turn: 0, index: 0, id: `uf-${game.actions.length}` } ],
      }
    }
    game.executeAction(new GameAction(currentActionData, game, index++), false)
    expect(game.actions.length).toBe(index)
    expect(game.lastAction?.stringValue).toBe("deployed Soviet unit: Guards SMG to A1")

    currentActionData = {
      user: "one", player: 1, data: {
        action: "deploy", old_initiative: game.initiative,
        path: [ { x: 0, y: 1, facing: 1 }],
        deploy: [ { turn: 0, index: 1, id: `uf-${game.actions.length}` } ],
      }
    }
    game.executeAction(new GameAction(currentActionData, game, index++), false)
    expect(game.actions.length).toBe(index)
    expect(game.lastAction?.stringValue).toBe("deployed Soviet unit: Crew to A2")

    currentActionData = {
      user: "one", player: 1, data: {
        action: "deploy", old_initiative: game.initiative,
        path: [ { x: 0, y: 2, facing: 1 }],
        deploy: [ { turn: 0, index: 2, id: `uf-${game.actions.length}` } ],
      }
    }
    game.executeAction(new GameAction(currentActionData, game, index++), false)
    expect(game.actions.length).toBe(index)
    expect(game.lastAction?.stringValue).toBe("deployed Soviet unit: DShK to A3")

    currentActionData = {
      user: "one", player: 1, data: {
        action: "deploy", old_initiative: game.initiative,
        path: [ { x: 0, y: 3, facing: 1 }],
        deploy: [ { turn: 0, index: 3, id: `uf-${game.actions.length}` } ],
      }
    }
    game.executeAction(new GameAction(currentActionData, game, index++), false)
    expect(game.actions.length).toBe(index)
    expect(game.lastAction?.stringValue).toBe("deployed Soviet unit: Leader to A4")

    currentActionData = {
      user: "one", player: 1, data: {
        action: "deploy", old_initiative: game.initiative,
        path: [ { x: 0, y: 4, facing: 1 }],
        deploy: [ { turn: 0, index: 4, id: `uf-${game.actions.length}` } ],
      }
    }
    game.executeAction(new GameAction(currentActionData, game, index++), false)
    index += 9
    expect(game.actions.length).toBe(index)
    expect(game.currentPlayer).toBe(1)
    expect(game.actions[index - 7].stringValue).toBe("Soviet deployment done, begin German deployment")
    expect(game.actions[index - 6].stringValue).toBe("no units to deploy, skipping phase")
    expect(game.actions[index - 3].stringValue).toBe("Soviet rally phase done, begin German rally phase")
    expect(game.actions[index - 2].stringValue).toBe("no broken units or jammed weapons, skipping phase")
    expect(game.lastAction?.stringValue).toBe("rally phase done, begin main phase")
  })
});
