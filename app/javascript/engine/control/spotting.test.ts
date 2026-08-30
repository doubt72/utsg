import { describe, expect, test, vi } from "vitest"
import { createFireGame, testGInf, testGRadio, testRInf } from "./testHelpers";
import Unit from "../Unit";
import { Coordinate } from "../../utilities/commonTypes";
import organizeStacks from "../support/organizeStacks";
import FireState from "./state/FireState";
import select from "./select";
import { rangeMultiplier } from "./fire";
import Game from "../Game";
import { StateSelection } from "./state/BaseState";
import Counter from "../Counter";

describe("spotting", () => {
  const makeAction = (game: Game, ids: string[]): StateSelection[] => {
    return ids.map(id => {
      const counter = game.findCounterById(id) as Counter
      const hex = counter.hex as Coordinate
      return { x: hex.x, y: hex.y, id, name: counter.unit.id, counter }
    })
  }

  test("firing radio adds spotting", () => {
    const game = createFireGame()
    const map = game.scenario.map
    const firing = new Unit(testGInf)
    firing.id = "firing1"
    const floc = new Coordinate(3, 2)
    map.addCounter(floc, firing)
    const firing2 = new Unit(testGRadio)
    firing2.id = "firing2"
    map.addCounter(floc, firing2)
    map.select(firing2)

    const target = new Unit(testRInf)
    target.id = "target1"
    const tloc = new Coordinate(4, 0)
    map.addCounter(tloc, target)
    organizeStacks(map)

    game.setGameState(new FireState(game, false))

    select(map, {
      counter: map.countersAt(tloc)[0],
      target: { type: "map", xy: tloc }
    }, () => {})
    expect(target.targetSelected).toBe(true)

    const mult = rangeMultiplier(
      map, makeAction(game, ["firing2"])[0].counter, tloc, false, false, false
    )
    expect(mult.mult).toBe(5)
    expect(mult.why.length).toBe(1)
    expect(mult.why[0]).toBe("- base multiplier 5 (radio)")

    const original = Math.random
    vi.spyOn(Math, "random").mockReturnValue(0.99)
    game.gameState?.finish()
    Math.random = original

    expect(game.actions[0].stringValue).toBe(
      "German Radio 10.5cm at D3 fired at Soviet Rifle at E1; targeting roll: target 10, " +
        "rolled 100 [d10x10: 10 x 10]: hit; infantry effect roll at E1: target 7, " +
        "rolled 20 [2d10: 10 + 10]: passed (critical)"
    )

    expect(firing2.spotting).toBe("A")
    expect(game.spottingStatus).toStrictEqual([{
      ref: "A", target: tloc, level: 1, unit: firing2,
    }])
  })

  test("firing tank adds spotting", () => {
    //
  })

  test("firing gun adds spotting", () => {
    //
  })

  test("firing sponson adds spotting", () => {
    //
  })

  test("firing crewed mortar adds spotting", () => {
    //
  })

  test("firing non-crewed mortar doesn't add spotting", () => {
    //
  })

  test("spotting improves targeting", () => {
    //
  })

  test("firing at new target doesn't improve targeting and resets spotting", () => {
    //
  })

  test("moving cancels spotting", () => {
    //
  })

  test("assault moving cancels spotting", () => {
    //
  })

  test("being displaced cancels spotting", () => {
    //
  })

  test("destroying vehicle cancels spotting", () => {
    //
  })

  test("abandoning vehicle cancels spotting", () => {
    //
  })

  test("turret jamming cancels spotting", () => {
    //
  })

  test("being immobilizes cancels sponson spotting", () => {
    //
  })

  test("being immobilizes cancels hull spotting", () => {
    //
  })

  test("turret jamming doesn't add turret spotting", () => {
    //
  })

  test("being immobilizes doesn't add sponson spotting", () => {
    //
  })

  test("being immobilizes doesn't add hull spotting", () => {
    //
  })

  test("jamming weapon cancels spotting", () => {
    //
  })

  test("destroying weapon cancels spotting", () => {
    //
  })

  test("breaking crew cancels spotting", () => {
    //
  })

  test("pinning crew cancels spotting", () => {
    //
  })
})
