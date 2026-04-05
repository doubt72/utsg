import { describe, expect, test } from "vitest";
import { createBlankGame, testGInf, testGMG } from "./testHelpers";
import { Coordinate, unitStatus, unitType } from "../../utilities/commonTypes";
import Unit from "../Unit";
import { stateType } from "./state/BaseState";
import select from "./select";
import organizeStacks from "../support/organizeStacks";

describe("squad splitting/joining", () => {
  test("can split squads", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "uf-101"
    unit.select()
    unit.setStatus(unitStatus.Activated)
    const loc = new Coordinate(1, 1)
    map.addCounter(loc, unit)

    game.split()

    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(1)
    expect(all[0].hex?.y).toBe(1)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.type).toBe(unitType.Team)
    expect(all[0].unit.isActivated).toBe(true)
    expect(all[1].unit.name).toBe("Rifle")
    expect(all[1].unit.type).toBe(unitType.Team)
    expect(all[1].unit.isActivated).toBe(true)

    expect(game.lastAction?.stringValue).toBe("German player split Rifle squad into two teams at B2")

    game.executeUndo(false)

    all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(1)
    expect(all[0].hex?.y).toBe(1)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.type).toBe(unitType.Squad)
    expect(all[0].unit.isActivated).toBe(true)
  })

  test("can join squads", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "uf-101"
    unit.select()
    unit.setStatus(unitStatus.Activated)
    const loc = new Coordinate(1, 1)
    map.addCounter(loc, unit)

    game.split()

    expect(map.currentSelection.length).toBe(0)
    const counters = map.countersAt(loc)
    counters[0].unit.select()
    expect(map.currentSelection.length).toBe(1)

    game.join()
    expect(game.gameState?.type).toBe(stateType.SquadJoin)
    expect(counters[0].unit.loaderSelected).toBe(true)
    expect(map.currentSelection.length).toBe(0)

    select(map, {
      counter: counters[1],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(counters[1].unit.selected).toBe(true)
    game.join()

    let all = map.allCounters
    expect(all.length).toBe(1)
    expect(all[0].hex?.x).toBe(1)
    expect(all[0].hex?.y).toBe(1)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.type).toBe(unitType.Squad)
    expect(all[0].unit.isActivated).toBe(true)

    expect(game.lastAction?.stringValue).toBe("German player joined two Rifle teams into a squad at B2")

    game.executeUndo(false)

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].hex?.x).toBe(1)
    expect(all[0].hex?.y).toBe(1)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.type).toBe(unitType.Team)
    expect(all[0].unit.isActivated).toBe(true)
    expect(all[1].unit.name).toBe("Rifle")
    expect(all[1].unit.type).toBe(unitType.Team)
    expect(all[1].unit.isActivated).toBe(true)
  })

  test("can split squads with weapon", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "uf-101"
    unit.select()
    unit.setStatus(unitStatus.Activated)
    const loc = new Coordinate(1, 1)
    map.addCounter(loc, unit)
    const unit2 = new Unit(testGMG)
    unit2.id = "uf-102"
    map.addCounter(loc, unit2)
    organizeStacks(map)

    game.split()

    let all = map.allCounters
    expect(all.length).toBe(3)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.type).toBe(unitType.Team)
    expect(all[0].unit.isActivated).toBe(true)
    expect(all[0].unit.children[0].id).toBe(all[1].unit.id)
    expect(all[1].unit.name).toBe("MG 08/15")
    expect(all[1].unit.parent?.id).toBe(all[0].unit.id)
    expect(all[2].unit.name).toBe("Rifle")
    expect(all[2].unit.type).toBe(unitType.Team)
    expect(all[2].unit.isActivated).toBe(true)

    expect(game.lastAction?.stringValue).toBe("German player split Rifle squad into two teams at B2")

    game.executeUndo(false)

    all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.type).toBe(unitType.Squad)
    expect(all[0].unit.isActivated).toBe(true)
    expect(all[0].unit.children[0].id).toBe(all[1].unit.id)
    expect(all[1].unit.name).toBe("MG 08/15")
    expect(all[1].unit.parent?.id).toBe(all[0].unit.id)
  })

  test("can join squads with weapon", () => {
    const game = createBlankGame()
    const map = game.scenario.map
    const unit = new Unit(testGInf)
    unit.id = "uf-101"
    unit.select()
    unit.setStatus(unitStatus.Activated)
    const loc = new Coordinate(1, 1)
    map.addCounter(loc, unit)

    game.split()

    const unit2 = new Unit(testGMG)
    unit2.id = "uf-102"
    map.addCounter(loc, unit2)
    organizeStacks(map)

    expect(map.currentSelection.length).toBe(0)
    const counters = map.countersAt(loc)
    counters[0].unit.select()
    expect(map.currentSelection.length).toBe(1)

    game.join()
    expect(game.gameState?.type).toBe(stateType.SquadJoin)
    expect(counters[0].unit.loaderSelected).toBe(true)
    expect(map.currentSelection.length).toBe(0)

    select(map, {
      counter: counters[1],
      target: { type: "map", xy: loc }
    }, () => {})
    expect(counters[1].unit.selected).toBe(true)
    game.join()

    let all = map.allCounters
    expect(all.length).toBe(2)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.type).toBe(unitType.Squad)
    expect(all[0].unit.isActivated).toBe(true)
    expect(all[0].unit.children[0].id).toBe(all[1].unit.id)
    expect(all[1].unit.name).toBe("MG 08/15")
    expect(all[1].unit.parent?.id).toBe(all[0].unit.id)

    expect(game.lastAction?.stringValue).toBe("German player joined two Rifle teams into a squad at B2")

    game.executeUndo(false)

    all = map.allCounters
    expect(all.length).toBe(3)
    expect(all[0].unit.name).toBe("Rifle")
    expect(all[0].unit.type).toBe(unitType.Team)
    expect(all[0].unit.isActivated).toBe(true)
    expect(all[1].unit.name).toBe("Rifle")
    expect(all[1].unit.type).toBe(unitType.Team)
    expect(all[1].unit.isActivated).toBe(true)
    expect(all[1].unit.children[0].id).toBe(all[2].unit.id)
    expect(all[2].unit.name).toBe("MG 08/15")
    expect(all[2].unit.parent?.id).toBe(all[1].unit.id)
  })
})