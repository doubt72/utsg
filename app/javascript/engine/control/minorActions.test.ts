import { describe, expect, test, vi } from "vitest";
import { createBlankGame } from "./testHelpers";
import { checkPhase, gamePhaseType } from "../support/gamePhase";
import PrecipCheckState from "./state/PrecipCheckState";

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

  test("doesn't change from base on 'fail'", () => {
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
})