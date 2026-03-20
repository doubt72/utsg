import { describe, expect, test, vi } from "vitest";
import { createBlankGame, testFire, testGInf, testSmoke } from "./testHelpers";
import { checkPhase, gamePhaseType } from "../support/gamePhase";
import PrecipCheckState from "./state/PrecipCheckState";
import SmokeCheckState from "./state/SmokeCheckState";
import { Coordinate, featureType, unitStatus, windType } from "../../utilities/commonTypes";
import Feature from "../Feature";
import FireCheckState from "./state/FireCheckState";
import Unit from "../Unit";
import WeatherState from "./state/WeatherState";
import BaseAction from "../actions/BaseAction";

describe("minor actions", () => {
  test("skips no chance", () => {
    const game = createBlankGame()
    const map = game.scenario.map

    expect(map.anyPrecip()).toBe(false)

    game.phase = gamePhaseType.PrepPrecip
    checkPhase(game, false)
    expect(game.phase).toBe(gamePhaseType.Main)
    expect(game.actions[game.actions.length - 2].stringValue).toBe(
      "no precipitation in scenario, skipping check"
    )
  })

  test("changes weather to precip", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    map.precipChance = 3

    expect(map.anyPrecip()).toBe(true)
    expect(map.currentWeather).toBe(map.baseWeather)

    game.setGameState(new PrecipCheckState(game))

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

    game.setGameState(new PrecipCheckState(game))

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

    game.setGameState(new PrecipCheckState(game))

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
    game.initiative = -5

    const unit1 = new Unit(testGInf)
    unit1.id = "test1"
    unit1.status = unitStatus.Activated
    unit1.pinned = true
    const loc = new Coordinate(0,0)
    map.addCounter(loc, unit1)
    const unit2 = new Unit(testGInf)
    unit2.id = "test2"
    unit2.status = unitStatus.Exhausted
    map.addCounter(loc, unit2)

    game.phase = gamePhaseType.CleanupStatus

    checkPhase(game, false)

    const units = map.countersAt(loc)
    expect(units.length).toBe(2)
    expect(units[0].unit.status).toBe(unitStatus.Normal)
    expect(units[0].unit.pinned).toBe(false)
    expect(units[1].unit.status).toBe(unitStatus.Tired)

    const action = game.actions[0]
    expect(action.type).toBe("status_update")
    expect(action.data.target?.length).toBe(3)
    expect(action.stringValue).toBe(
      "update all unit statuses: remove all pinned, routed, tired, and activated markers; exhausted units become tired"
    )
    expect(game.initiative).toBe(-3)
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
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    state.finish()
    Math.random = original

    expect(game.smokeCheckNeeded.length).toBe(0)
    const units = map.countersAt(loc)
    expect(units.length).toBe(0)

    const action = game.actions[0]
    expect(action.type).toBe("smoke_check")
    expect(action.stringValue).toBe(
      "smoke dispersion check for A1: rolled 10, reduces smoke by 3, smoke eliminated"
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
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    state.finish()
    Math.random = original

    expect(game.smokeCheckNeeded.length).toBe(0)
    const units = map.countersAt(loc)
    expect(units.length).toBe(1)
    expect(units[0].feature.type).toBe(featureType.Smoke)
    expect(units[0].feature.hindrance).toBe(1)

    const action = game.actions[0]
    expect(action.type).toBe("smoke_check")
    expect(action.stringValue).toBe(
      "smoke dispersion check for A1: rolled 1, reduces smoke by 1"
    )
  })

  test("smoke doesn't get checked twice", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    map.windSpeed = windType.Calm
    map.windDirection = 4

    const smoke1 = new Feature(testSmoke)
    smoke1.id = "smoke1"
    const loc1 = new Coordinate(0,0)
    map.addCounter(loc1, smoke1)
    const smoke2 = new Feature(testSmoke)
    smoke2.id = "smoke2"
    const loc2 = new Coordinate(0,1)
    map.addCounter(loc2, smoke2)

    game.checkForSmoke(false)
    expect(game.smokeCheckNeeded.length).toBe(2)
    const state = game.gameState as SmokeCheckState

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    state.finish()

    game.checkForSmoke(false)
    expect(game.smokeCheckNeeded.length).toBe(1)
    state.finish()

    game.checkForSmoke(false)
    expect(game.smokeCheckNeeded.length).toBe(0)

    Math.random = original

    let units = map.countersAt(loc1)
    expect(units.length).toBe(1)
    expect(units[0].feature.type).toBe(featureType.Smoke)
    expect(units[0].feature.hindrance).toBe(1)
    units = map.countersAt(loc2)
    expect(units.length).toBe(1)
    expect(units[0].feature.type).toBe(featureType.Smoke)
    expect(units[0].feature.hindrance).toBe(1)
    units = map.countersAt(new Coordinate(1, 1))
  })

  test("fire goes out", () => {
    const game = createBlankGame()
    const map = game.scenario.map

    const fire = new Feature(testFire)
    fire.id = "fire"
    const loc = new Coordinate(0,0)
    map.addCounter(loc, fire)

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

    const fire = new Feature(testFire)
    fire.id = "fire"
    const loc = new Coordinate(0,0)
    map.addCounter(loc, fire)

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

    const fire = new Feature(testFire)
    fire.id = "fire"
    const loc = new Coordinate(0,0)
    map.addCounter(loc, fire)

    game.checkForFire(false)
    expect(game.fireOutCheckNeeded.length).toBe(1)
    expect(game.fireSpreadCheckNeeded.length).toBe(0)

    const state = game.gameState as FireCheckState

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    state.finish()

    let action = game.actions[0]
    expect(action.type).toBe("fire_out_check")
    expect(action.stringValue).toBe(
      "fire extinguish check for A1: fire goes out on 1 or less, rolled 10, no effect"
    )
    expect(game.actions.length).toBe(1)

    game.checkForFire(false)
    expect(game.fireOutCheckNeeded.length).toBe(0)
    expect(game.fireSpreadCheckNeeded.length).toBe(1)

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

    action = game.actions[1]
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

    const fire = new Feature(testFire)
    fire.id = "fire"
    const loc = new Coordinate(0,0)
    map.addCounter(loc, fire)

    game.checkForFire(false)
    expect(game.fireOutCheckNeeded.length).toBe(1)
    expect(game.fireSpreadCheckNeeded.length).toBe(0)
    const state = game.gameState as FireCheckState

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    state.finish()

    let action = game.lastAction as BaseAction
    expect(action.type).toBe("fire_out_check")
    expect(action.stringValue).toBe(
      "fire extinguish check for A1: fire goes out on 1 or less, rolled 10, no effect"
    )
    expect(game.actions.length).toBe(1)

    game.checkForFire(false)
    expect(game.fireOutCheckNeeded.length).toBe(0)
    expect(game.fireSpreadCheckNeeded.length).toBe(1)

    state.finish()
    Math.random = original

    expect(game.fireSpreadCheckNeeded.length).toBe(0)
    let units = map.countersAt(loc)
    expect(units.length).toBe(1)
    expect(units[0].feature.type).toBe(featureType.Fire)
    units = map.countersAt(new Coordinate(1, 0))
    expect(units.length).toBe(0)

    action = game.actions[1]
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

    const fire = new Feature(testFire)
    fire.id = "fire"
    const loc = new Coordinate(0,0)
    map.addCounter(loc, fire)

    game.checkForFire(false)
    game.fireOutCheckNeeded = []
    expect(game.fireSpreadCheckNeeded.length).toBe(0)
  })

  test("fire doesn't get checked twice", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    map.windSpeed = windType.Moderate
    map.windDirection = 4

    const fire1 = new Feature(testFire)
    fire1.id = "fire1"
    const loc1 = new Coordinate(0,0)
    map.addCounter(loc1, fire1)
    const fire2 = new Feature(testFire)
    fire2.id = "fire2"
    const loc2 = new Coordinate(0,1)
    map.addCounter(loc2, fire2)

    game.checkForFire(false)
    expect(game.fireOutCheckNeeded.length).toBe(2)
    expect(game.fireSpreadCheckNeeded.length).toBe(0)
    const state = game.gameState as FireCheckState

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    state.finish()

    game.checkForFire(false)
    expect(game.fireOutCheckNeeded.length).toBe(1)
    expect(game.fireSpreadCheckNeeded.length).toBe(1)
    state.finish()

    game.checkForFire(false)
    expect(game.fireOutCheckNeeded.length).toBe(0)
    expect(game.fireSpreadCheckNeeded.length).toBe(2)
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    state.finish()

    game.checkForFire(false)
    expect(game.fireOutCheckNeeded.length).toBe(0)
    expect(game.fireSpreadCheckNeeded.length).toBe(1)
    state.finish()

    Math.random = original

    expect(game.fireSpreadCheckNeeded.length).toBe(0)
    expect(game.fireSpreadCheckNeeded.length).toBe(0)

    let units = map.countersAt(loc1)
    expect(units.length).toBe(1)
    expect(units[0].feature.type).toBe(featureType.Fire)
    units = map.countersAt(new Coordinate(1, 0))
    expect(units.length).toBe(1)
    expect(units[0].feature.type).toBe(featureType.Fire)
    units = map.countersAt(loc2)
    expect(units.length).toBe(1)
    expect(units[0].feature.type).toBe(featureType.Fire)
    units = map.countersAt(new Coordinate(1, 1))
    expect(units.length).toBe(1)
    expect(units[0].feature.type).toBe(featureType.Fire)
  })

  test("variable wind changes", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    map.windVariable = true
    map.windDirection = 1
    map.windSpeed = windType.Strong

    game.checkForWind(false)
    const state = game.gameState as WeatherState

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.01)
    state.finish()
    state.finish()
    Math.random = original

    expect(map.windDirection).toBe(6)
    expect(map.windSpeed).toBe(windType.Moderate)
  })

  test("variable wind doesn't change", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    map.windVariable = true
    map.windDirection = 1
    map.windSpeed = windType.Strong

    game.checkForWind(false)
    const state = game.gameState as WeatherState

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.5)
    state.finish()
    state.finish()
    Math.random = original

    expect(map.windDirection).toBe(1)
    expect(map.windSpeed).toBe(windType.Strong)
  })

  test("running checkForWind doesn't do checks twice", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    map.windVariable = true
    map.windDirection = 1
    map.windSpeed = windType.Strong

    game.checkForWind(false)
    expect(game.checkWindDirection).toBe(true)
    expect(game.checkWindSpeed).toBe(true)

    const state = game.gameState as WeatherState
    state.finish()

    game.checkForWind(false)
    expect(game.checkWindDirection).toBe(false)
    expect(game.checkWindSpeed).toBe(true)

    state.finish()

    game.checkForWind(false)
    expect(game.checkWindDirection).toBe(false)
    expect(game.checkWindSpeed).toBe(false)
  })
})