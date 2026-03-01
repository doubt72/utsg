import { describe, expect, test } from "vitest";
import Unit from "../Unit";
import FireDisplaceState from "./state/FireDisplaceState";
import { stateType } from "./state/BaseState";
import organizeStacks from "../support/organizeStacks";
import { createBlankGame, createTestGame, testGCrew, testGGun, testGInf, testGTank, testRInf } from "./testHelpers";
import { Coordinate, hexOpenType } from "../../utilities/commonTypes";

describe("precipitation", () => {
  test("unit displace by fire", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test"
    const loc = new Coordinate(1, 1)
    map.addCounter(loc, unit)

    const stack1 = new Unit(testGInf)
    stack1.id = "stack1"
    const stackLoc = new Coordinate(0, 1)
    map.addCounter(stackLoc, stack1)
    const stack2 = new Unit(testGInf)
    stack2.id = "stack2"
    map.addCounter(stackLoc, stack2)

    const enemy = new Unit(testRInf)
    enemy.id = "enemy"
    const enemyLoc = new Coordinate(2, 1)
    map.addCounter(enemyLoc, enemy)

    const fireLoc = new Coordinate(1, 0)
    map.addFire(fireLoc)
    expect(game.fireDisplaceNeeded.length).toBe(0)

    map.addFire(loc)
    expect(game.fireDisplaceNeeded.length).toBe(1)

    game.gameState = new FireDisplaceState(game)
    expect(game.gameState.player).toBe(2)
    expect(game.gameState.type).toBe(stateType.FireDisplace)
    expect(game.gameState.selection[0].id).toBe("test")
    expect(game.fireDisplaceState.availableHexes.length).toBe(3)

    expect(game.gameState.openHex(loc.x, loc.y)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(fireLoc.x, fireLoc.y)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(stackLoc.x, stackLoc.y)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(4, 4)).toBe(hexOpenType.Closed)

    const escapeLoc = new Coordinate(2, 0)
    expect(game.gameState.openHex(escapeLoc.x, escapeLoc.y)).toBe(hexOpenType.Open)

    expect(game.fireDisplaceState.path[0].x).toBe(loc.x)
    expect(game.fireDisplaceState.path[0].y).toBe(loc.y)

    game.fireDisplaceState.move(escapeLoc.x, escapeLoc.y)
    expect(game.moveState.path.length).toBe(2)
    expect(game.fireDisplaceState.path[1].x).toBe(escapeLoc.x)
    expect(game.fireDisplaceState.path[1].y).toBe(escapeLoc.y)

    game.gameState.finish()

    let counters = map.countersAt(loc)
    expect(counters.length).toBe(1)
    expect(counters[0].unit.name).toBe("Blaze")

    counters = map.countersAt(escapeLoc)
    expect(counters.length).toBe(1)
    expect(counters[0].unit.name).toBe("Rifle")

    const action = game.actions[0]
    expect(action.type).toBe("fire_displace")
    expect(action.stringValue).toBe("German Rifle at B2 is displaced by fire to C1")

    action.undo()

    counters = map.countersAt(loc)
    expect(counters.length).toBe(2)
    expect(counters[0].unit.name).toBe("Rifle")
    expect(counters[1].unit.name).toBe("Blaze")

    expect(game.eliminatedUnits.length).toBe(0)
  })

  test("unit displacing with illegal terrain", () => {
    const game = createTestGame([
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o", h: 1, be: [4], b: "c" }, { t: "o" }, { t: "w" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
      ]
    )
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test"
    const loc = new Coordinate(1, 1)
    map.addCounter(loc, unit)

    map.addFire(loc)
    expect(game.fireDisplaceNeeded.length).toBe(1)

    game.gameState = new FireDisplaceState(game)
    expect(game.gameState.player).toBe(2)
    expect(game.gameState.type).toBe(stateType.FireDisplace)
    expect(game.gameState.selection[0].id).toBe("test")

    expect(game.gameState.openHex(loc.x, loc.y)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(2, 1)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(0, 1)).toBe(hexOpenType.Closed)
  })

  test("vehicle displacing with illegal terrain", () => {
    const game = createTestGame([
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o", be: [4], b: "w" }, { t: "o" }, { t: "f" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
      ]
    )
    const map = game.scenario.map
    const unit = new Unit(testGTank)
    unit.id = "test"
    const loc = new Coordinate(1, 1)
    map.addCounter(loc, unit)

    map.addFire(loc)

    expect(game.fireDisplaceNeeded.length).toBe(1)

    game.gameState = new FireDisplaceState(game)
    expect(game.gameState.player).toBe(2)
    expect(game.gameState.type).toBe(stateType.FireDisplace)
    expect(game.gameState.selection[0].id).toBe("test")

    expect(game.gameState.openHex(loc.x, loc.y)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(2, 1)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(0, 1)).toBe(hexOpenType.Closed)
    expect(game.gameState.openHex(1, 2)).toBe(hexOpenType.Open)
  })

  test("unit manning gun displaced", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const unit1 = new Unit(testGCrew)
    unit1.id = "inf"
    const loc = new Coordinate(1, 1)
    map.addCounter(loc, unit1)
    const unit2 = new Unit(testGGun)
    unit2.id = "art"
    map.addCounter(loc, unit2)
    organizeStacks(map)

    map.addFire(loc)
    expect(game.fireDisplaceNeeded.length).toBe(1)

    game.gameState = new FireDisplaceState(game)

    const escapeLoc = new Coordinate(0, 2)
    game.fireDisplaceState.move(escapeLoc.x, escapeLoc.y)

    game.gameState.finish()

    let counters = map.countersAt(loc)
    expect(counters.length).toBe(2)
    expect(counters[0].unit.name).toBe("3.7cm Pak 36")
    expect(counters[1].unit.name).toBe("Blaze")

    counters = map.countersAt(escapeLoc)
    expect(counters.length).toBe(1)
    expect(counters[0].unit.name).toBe("Crew")

    const action = game.actions[0]
    expect(action.type).toBe("fire_displace")
    expect(action.stringValue).toBe("German Crew at B2 is displaced by fire to A3, 3.7cm Pak 36 dropped")

    action.undo()

    counters = map.countersAt(loc)
    expect(counters.length).toBe(3)
    expect(counters[0].unit.name).toBe("Crew")
    expect(counters[1].unit.name).toBe("3.7cm Pak 36")
    expect(counters[2].unit.name).toBe("Blaze")

    expect(game.eliminatedUnits.length).toBe(0)
  })

  test("can reset move", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test"
    const loc = new Coordinate(0, 0)
    map.addCounter(loc, unit)

    map.addFire(loc)

    game.gameState = new FireDisplaceState(game)

    const escapeLoc = new Coordinate(0, 1)
    game.fireDisplaceState.move(escapeLoc.x, escapeLoc.y)

    expect(game.moveState.path.length).toBe(2)

    game.fireDisplaceState.cancel()

    expect(game.moveState.path.length).toBe(1)
  })

  test("eliminate unit in fire", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test"
    const loc = new Coordinate(0, 0)
    map.addCounter(loc, unit)

    map.addFire(new Coordinate(0, 1))
    map.addFire(loc)
    expect(game.fireDisplaceNeeded.length).toBe(1)

    game.gameState = new FireDisplaceState(game)
    expect(game.fireDisplaceState.availableHexes.length).toBe(1)

    game.gameState.finish()
    expect(game.actions.length).toBe(0)

    game.fireDisplaceState.remove = true
    game.gameState.finish()

    let counters = map.countersAt(loc)
    expect(counters.length).toBe(1)
    expect(counters[0].unit.name).toBe("Blaze")

    expect(game.eliminatedUnits.length).toBe(1)
    expect(game.eliminatedUnits[0].name).toBe("Rifle")

    const action = game.actions[0]
    expect(action.type).toBe("fire_displace")
    expect(action.stringValue).toBe("German Rifle at A1 is displaced by fire and is eliminated")

    action.undo()

    counters = map.countersAt(loc)
    expect(counters.length).toBe(2)
    expect(counters[0].unit.name).toBe("Rifle")
    expect(counters[1].unit.name).toBe("Blaze")

    expect(game.eliminatedUnits.length).toBe(0)
  })

  test("eliminate unit in fire that can't displace", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "test"
    const loc = new Coordinate(0, 0)
    map.addCounter(loc, unit)

    map.addFire(new Coordinate(0, 1))

    const enemy = new Unit(testRInf)
    enemy.id = "enemy"
    map.addCounter(new Coordinate(1, 0), enemy)

    map.addFire(loc)
    expect(game.fireDisplaceNeeded.length).toBe(1)

    game.gameState = new FireDisplaceState(game)
    expect(game.fireDisplaceState.availableHexes.length).toBe(0)

    game.gameState.finish()

    const counters = map.countersAt(loc)
    expect(counters.length).toBe(1)
    expect(counters[0].unit.name).toBe("Blaze")

    expect(game.eliminatedUnits.length).toBe(1)
    expect(game.eliminatedUnits[0].name).toBe("Rifle")
  })
})