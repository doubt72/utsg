import { describe, expect, test, vi } from "vitest";
import { createBlankGame, testFire, testGInf, testSmoke } from "./testHelpers";
import { checkPhase, gamePhaseType } from "../support/gamePhase";
import PrecipCheckState from "./state/PrecipCheckState";
import SmokeCheckState from "./state/SmokeCheckState";
import { Coordinate, featureType, unitStatus, windType } from "../../utilities/commonTypes";
import Feature from "../Feature";
import FireCheckState from "./state/FireCheckState";
import Unit from "../Unit";

describe("precipitation", () => {
  test("skips no chance", () => {
    const game = createBlankGame()
    const map = game.scenario.map

    expect(map.anyPrecip()).toBe(false)

    game.phase = gamePhaseType.PrepPrecip
    checkPhase(game, false)
    expect(game.phase).toBe(gamePhaseType.Main)
    expect(game.actions[game.actions.length - 2].stringValue).toBe(
      "no precipitation in game.scenario, skipping check"
    )
  })

  test("changes weather to precip", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    map.precipChance = 3

    expect(map.anyPrecip()).toBe(true)
    expect(map.currentWeather).toBe(map.baseWeather)

    game.gameState = new PrecipCheckState(game)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    game.precipCheckState.finish()
    Math.random = original

    expect(map.currentWeather).toBe(map.precip)
    expect(game.lastAction?.stringValue).toBe(
      "checking for precipitation, rolled (d10), precipitation on 3 or less, got 1: this turn it will be raining"
    )
  })

  test("changes weather to no precip", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    map.precipChance = 3
    map.currentWeather = map.precip

    expect(map.anyPrecip()).toBe(true)
    expect(map.currentWeather).toBe(map.precip)

    game.gameState = new PrecipCheckState(game)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.precipCheckState.finish()
    Math.random = original

    expect(map.currentWeather).toBe(map.baseWeather)
    expect(game.lastAction?.stringValue).toBe(
      "checking for precipitation, rolled (d10), precipitation on 3 or less, got 10: this turn it will be clear"
    )
  })

  test("doesn't change weather from base on 'fail'", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    map.precipChance = 3

    expect(map.anyPrecip()).toBe(true)
    expect(map.currentWeather).toBe(map.baseWeather)

    game.gameState = new PrecipCheckState(game)

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.precipCheckState.finish()
    Math.random = original

    expect(map.currentWeather).toBe(map.baseWeather)
    expect(game.lastAction?.stringValue).toBe(
      "checking for precipitation, rolled (d10), precipitation on 3 or less, got 10: this turn it will be clear"
    )
  })

  test("status updates", () => {
    const game = createBlankGame()
    const map = game.scenario.map

    const unit1 = new Unit(testGInf)
    unit1.id = "test1"
    unit1.status = unitStatus.Activated
    const loc = new Coordinate(0,0)
    map.addCounter(loc, unit1)
    const unit2 = new Unit(testGInf)
    unit2.id = "test2"
    unit2.status = unitStatus.Exhausted
    map.addCounter(loc, unit2)

    game.phase = gamePhaseType.CleanupStatus

    checkPhase(game, false)

    let units = map.countersAt(loc)
    expect(units.length).toBe(2)
    expect(units[0].unit.status).toBe(unitStatus.Normal)
    expect(units[1].unit.status).toBe(unitStatus.Tired)

    const action = game.actions[0]
    expect(action.type).toBe("status_update")
    expect(action.stringValue).toBe(
      "update all unit statuses, activated units lose activated status, " +
        "exhausted units become tired"
    )

    action.undo()

    units = map.countersAt(loc)
    expect(units.length).toBe(2)
    expect(units[0].unit.status).toBe(unitStatus.Activated)
    expect(units[1].unit.status).toBe(unitStatus.Exhausted)
  })

  test("smoke disperses", () => {
    const game = createBlankGame()
    const map = game.scenario.map

    const smoke = new Feature(testSmoke)
    smoke.id = "smoke"
    const loc = new Coordinate(0,0)
    map.addCounter(loc, smoke)

    game.checkForSmoke(false)
    expect(game.smokeCheckNeeded.length).toBe(1)
    const state = game.gameState as SmokeCheckState

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    state.finish()
    Math.random = original

    expect(game.smokeCheckNeeded.length).toBe(0)
    const units = map.countersAt(loc)
    expect(units.length).toBe(0)

    const action = game.actions[0]
    expect(action.type).toBe("smoke_check")
    expect(action.stringValue).toBe(
      "smoke dispersion check for A1: dissipates on 2 or less, rolled 1, smoke dissipates"
    )
  })

  test("smoke doesn't disperse", () => {
    const game = createBlankGame()
    const map = game.scenario.map

    const smoke = new Feature(testSmoke)
    smoke.id = "smoke"
    const loc = new Coordinate(0,0)
    map.addCounter(loc, smoke)

    game.checkForSmoke(false)
    expect(game.smokeCheckNeeded.length).toBe(1)
    const state = game.gameState as SmokeCheckState

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    state.finish()
    Math.random = original

    expect(game.smokeCheckNeeded.length).toBe(0)
    const units = map.countersAt(loc)
    expect(units.length).toBe(1)
    expect(units[0].feature.type).toBe(featureType.Smoke)

    const action = game.actions[0]
    expect(action.type).toBe("smoke_check")
    expect(action.stringValue).toBe(
      "smoke dispersion check for A1: dissipates on 2 or less, rolled 10, no effect"
    )
  })

  test("fire goes out", () => {
    const game = createBlankGame()
    const map = game.scenario.map

    const smoke = new Feature(testFire)
    smoke.id = "fire"
    const loc = new Coordinate(0,0)
    map.addCounter(loc, smoke)

    game.checkForFire(false)
    expect(game.fireOutCheckNeeded.length).toBe(1)
    const state = game.gameState as FireCheckState

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    state.finish()
    Math.random = original

    expect(game.fireOutCheckNeeded.length).toBe(0)
    const units = map.countersAt(loc)
    expect(units.length).toBe(0)

    const action = game.actions[0]
    expect(action.type).toBe("fire_out_check")
    expect(action.stringValue).toBe(
      "fire extinguish check for A1: fire goes out on 1 or less, rolled 1, fire goes out"
    )
  })

  test("fire doesn't go out", () => {
    const game = createBlankGame()
    const map = game.scenario.map

    const smoke = new Feature(testFire)
    smoke.id = "fire"
    const loc = new Coordinate(0,0)
    map.addCounter(loc, smoke)

    game.checkForFire(false)
    expect(game.fireOutCheckNeeded.length).toBe(1)
    const state = game.gameState as FireCheckState

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    state.finish()
    Math.random = original

    expect(game.fireOutCheckNeeded.length).toBe(0)
    const units = map.countersAt(loc)
    expect(units.length).toBe(1)
    expect(units[0].feature.type).toBe(featureType.Fire)

    const action = game.actions[0]
    expect(action.type).toBe("fire_out_check")
    expect(action.stringValue).toBe(
      "fire extinguish check for A1: fire goes out on 1 or less, rolled 10, no effect"
    )
  })

  test("fire spreads", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    map.windSpeed = windType.Moderate
    map.windDirection = 4

    const smoke = new Feature(testFire)
    smoke.id = "fire"
    const loc = new Coordinate(0,0)
    map.addCounter(loc, smoke)

    game.checkForFire(false)
    game.fireOutCheckNeeded = []
    expect(game.fireSpreadCheckNeeded.length).toBe(1)
    const state = game.gameState as FireCheckState

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    state.finish()
    Math.random = original

    expect(game.fireSpreadCheckNeeded.length).toBe(0)
    let units = map.countersAt(loc)
    expect(units.length).toBe(1)
    expect(units[0].feature.type).toBe(featureType.Fire)
    units = map.countersAt(new Coordinate(1, 0))
    expect(units.length).toBe(1)
    expect(units[0].feature.type).toBe(featureType.Fire)

    const action = game.actions[0]
    expect(action.type).toBe("fire_spread_check")
    expect(action.stringValue).toBe(
      "fire spread check for A1: fire spreads on 2 or less, rolled 1, fire spreads"
    )
  })

  test("fire doesn't spread", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    map.windSpeed = windType.Moderate
    map.windDirection = 4

    const smoke = new Feature(testFire)
    smoke.id = "fire"
    const loc = new Coordinate(0,0)
    map.addCounter(loc, smoke)

    game.checkForFire(false)
    game.fireOutCheckNeeded = []
    expect(game.fireSpreadCheckNeeded.length).toBe(1)
    const state = game.gameState as FireCheckState

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    state.finish()
    Math.random = original

    expect(game.fireSpreadCheckNeeded.length).toBe(0)
    let units = map.countersAt(loc)
    expect(units.length).toBe(1)
    expect(units[0].feature.type).toBe(featureType.Fire)
    units = map.countersAt(new Coordinate(1, 0))
    expect(units.length).toBe(0)

    const action = game.actions[0]
    expect(action.type).toBe("fire_spread_check")
    expect(action.stringValue).toBe(
      "fire spread check for A1: fire spreads on 2 or less, rolled 10, no effect"
    )
  })

  test("fire doesn't spread off map", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    map.windSpeed = windType.Moderate
    map.windDirection = 1

    const smoke = new Feature(testFire)
    smoke.id = "fire"
    const loc = new Coordinate(0,0)
    map.addCounter(loc, smoke)

    game.checkForFire(false)
    game.fireOutCheckNeeded = []
    expect(game.fireSpreadCheckNeeded.length).toBe(0)
  })
})