import { describe, expect, test, vi } from "vitest"
import { baseToHit, chance2D10, chanceD10x10 } from "../../utilities/utilities"
import { HexData } from "../Hex"
import { MapData } from "../Map"
import { baseTerrainType, Coordinate, unitStatus, weatherType, windType } from "../../utilities/commonTypes"
import Unit, { UnitData } from "../Unit"
import { ScenarioData } from "../Scenario"
import Game, { gamePhaseType } from "../Game"
import { ActionSelection, actionType, FireActionState, GameActionState } from "./gameActions"
import select from "./select"
import { fireHindrance, firepower, untargetedModifiers } from "./fire"
import Counter from "../Counter"
import IllegalActionError from "../actions/IllegalActionError"
import organizeStacks from "../support/organizeStacks"
import { testGCrew, testGGun, testGInf, testGLdr, testGMG, testGTruck, testRInf } from "./movement.test"

const defaultTestHexes: HexData[][] = [
  [{ t: "o" }, { t: "o" }, { t: "o", b: "w", be: [5] }, { t: "o" }, { t: "o" }],
  [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
  [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "b" }, { t: "o" }],
  [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "b" }, { t: "o" }],
  [
    { t: "o" },
    { t: "o", s: { d: [4, 6], t: "t" } },
    { t: "o", s: { d: [1, 5], t: "t" } },
    { t: "o" }, { t: "b" }
  ],
]

const mapTestData = (hexes: HexData[][]): MapData => {
  return {
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
    hexes: hexes,
  }
}

const testGFT: UnitData = {
  c: "ger", t: "sw", n: "Flamethrower", y: 15, i: "flamethrower", f: 24, r: 1, v: 0,
  o: { a: 1, i: 1, b: 4, e: 1 },
}

const testGSC: UnitData = {
  c: "ger", t: "sw", n: "Satchel Charge", y: 36, i: "explosive", f: 24, r: 1, v: 0,
  o: { x: 1, t: 1, e: 1 },
}

const testRTank: UnitData = {
  t: "tank", i: "tank", c: "ussr", n: "T-34 M40", y: 40, s: 5, f: 24, r: 22, v: 6,
  o: { t: 1, p: 1, ha: { f: 3, s: 3, r: 3 }, ta: { f: 3, s: 3, r: 3 }, j: 3, f: 18, u: 1, k: 1 },
}

const testRTruck: UnitData = {
  t: "truck", c: "ussr", n: "Studebaker US6", i: "truck", y: 41, s: 4, f: 0, r: 0, v: 5,
  o: { sn: 1, tr: 3, trg: 1, w: 1 },
}

const scenarioTestData = (hexes: HexData[][]): ScenarioData => {
  return {
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
        0: { list: [testGInf]}
      },
      map_data: mapTestData(hexes),
    }
  }
}

const createTestGame = (hexes: HexData[][] = defaultTestHexes): Game => {
  const game = new Game({
    id: 1,
    name: "test game", scenario: scenarioTestData(hexes),
    owner: "one", state: "needs_player", player_one: "one", player_two: "", current_player: "",
    metadata: { turn: 0 },
    suppress_network: true
  });

  game.setTurn(1)
  game.phase = gamePhaseType.Main
  game.setCurrentPlayer(2)
  return game
}

describe("fire tests", () => {
  describe("probability checks", () => {
    test("chance2D10", () => {
      expect(chance2D10(0)).toBe(99)
      expect(chance2D10(3)).toBe(97)
      expect(chance2D10(18)).toBe(3)
      expect(chance2D10(19)).toBe(1)
      expect(chance2D10(20)).toBe(0)
      expect(chance2D10(25)).toBe(0)
    })

    test("chanceD10x10", () => {
      expect(chanceD10x10(0)).toBe(100)
      expect(chanceD10x10(1)).toBe(99)
      expect(chanceD10x10(2)).toBe(97)
      expect(chanceD10x10(23)).toBe(52)
      expect(chanceD10x10(24)).toBe(48)
      expect(chanceD10x10(89)).toBe(3)
      expect(chanceD10x10(90)).toBe(1)
      expect(chanceD10x10(99)).toBe(1)
      expect(chanceD10x10(100)).toBe(0)
      expect(chanceD10x10(111)).toBe(0)
    })
  })

  const makeAction = (game: Game, ids: string[]): ActionSelection[] => {
    return ids.map(id => {
      const counter = game.findCounterById(id) as Counter
      const hex = counter.hex as Coordinate
      return { x: hex.x, y: hex.y, id, counter }
    })
  }

  describe("fire action", () => {
    test("can fire", () => {
      const game = createTestGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)

      game.startFire()

      const state = game.gameActionState as GameActionState
      expect(state.currentAction).toBe(actionType.Fire)
      expect(state.selection[0].id).toBe("firing1")

      const fire = state.fire as FireActionState
      expect(fire.doneSelect).toBe(true)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false)
      expect(fp.fp).toBe(7)
      expect(baseToHit(fp.fp)).toBe(15)
      expect(fireHindrance(game, makeAction(game, ["firing1"]), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, ["firing1"]), makeAction(game, ["target1"]), false
      )
      expect(mods.mod).toBe(0)
      expect(mods.why.length).toBe(0)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.finishFire()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ id: "target1", from: [floc], to: tloc }]
      )

      try {
        game.executeUndo()
      } catch(err) {
        // Can't roll back a smoke roll
        expect(err instanceof IllegalActionError).toBe(true)
      }
    })

    test("fire2", () => {
      const game = createTestGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 2)
      map.addCounter(tloc, target)

      game.startFire()

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false)
      expect(fp.fp).toBe(7)
      expect(baseToHit(fp.fp)).toBe(15)
      expect(fireHindrance(game, makeAction(game, ["firing1"]), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, ["firing1"]), makeAction(game, ["target1"]), false
      )
      expect(mods.mod).toBe(-1)
      expect(mods.why.length).toBe(1)
      expect(mods.why[0]).toBe("- minus 1 for adjacent")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.finishFire()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ id: "target1", from: [floc], to: tloc }]
      )
    })

    test("fire3", () => {
      const game = createTestGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 4)
      map.addCounter(tloc, target)

      game.startFire()

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false)
      expect(fp.fp).toBe(7)
      expect(baseToHit(fp.fp)).toBe(15)
      expect(fireHindrance(game, makeAction(game, ["firing1"]), tloc)).toBe(2)
      const mods = untargetedModifiers(
        game, makeAction(game, ["firing1"]), makeAction(game, ["target1"]), false
      )
      expect(mods.mod).toBe(0)
      expect(mods.why.length).toBe(0)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.finishFire()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ id: "target1", from: [floc], to: tloc }]
      )
    })

    test("fire4", () => {
      const game = createTestGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(2, 4)
      map.addCounter(tloc, target)

      game.startFire()

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false)
      expect(fp.fp).toBe(7)
      expect(baseToHit(fp.fp)).toBe(15)
      expect(fireHindrance(game, makeAction(game, ["firing1"]), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, ["firing1"]), makeAction(game, ["target1"]), false
      )
      expect(mods.mod).toBe(0)
      expect(mods.why.length).toBe(0)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.finishFire()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ id: "target1", from: [floc], to: tloc }]
      )
    })

    test("fire5", () => {
      const game = createTestGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(0, 2)
      map.addCounter(tloc, target)

      game.startFire()

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false)
      expect(fp.fp).toBe(7)
      expect(baseToHit(fp.fp)).toBe(15)
      expect(fireHindrance(game, makeAction(game, ["firing1"]), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, ["firing1"]), makeAction(game, ["target1"]), false
      )
      expect(mods.mod).toBe(1)
      expect(mods.why.length).toBe(1)
      expect(mods.why[0]).toBe("- plus 1 for more than half range")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.finishFire()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ id: "target1", from: [floc], to: tloc }]
      )
    })

    test("fire6", () => {
      const game = createTestGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(2, 0)
      map.addCounter(tloc, target)

      game.startFire()

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false)
      expect(fp.fp).toBe(7)
      expect(baseToHit(fp.fp)).toBe(15)
      expect(fireHindrance(game, makeAction(game, ["firing1"]), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, ["firing1"]), makeAction(game, ["target1"]), false
      )
      expect(mods.mod).toBe(0)
      expect(mods.why.length).toBe(0)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.finishFire()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ id: "target1", from: [floc], to: tloc }]
      )
    })

    test("doesn't multiselection without leader", () => {
      const game = createTestGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGInf)
      firing2.id = "firing2"
      map.addCounter(floc, firing2)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.startFire()

      const state = game.gameActionState as GameActionState
      const fire = state.fire as FireActionState
      expect(fire.doneSelect).toBe(true)

      select(map, {
        counter: map.countersAt(floc)[1],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(firing2.selected).toBe(false)
    })

    test("multiselect with leader", () => {
      const game = createTestGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGInf)
      firing2.id = "firing2"
      map.addCounter(floc, firing2)
      const firing3 = new Unit(testGLdr)
      firing3.id = "firing3"
      map.addCounter(floc, firing3)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.startFire()

      const state = game.gameActionState as GameActionState
      const fire = state.fire as FireActionState
      expect(fire.doneSelect).toBe(false)

      let fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false)
      expect(fp.fp).toBe(9)

      select(map, {
        counter: map.countersAt(floc)[1],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing2.selected).toBe(false)
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc)[2],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing3.selected).toBe(true)
      expect(fire.doneSelect).toBe(false)

      fp = firepower(game, makeAction(game, ["firing1", "firing3"]), target, tloc, false)
      expect(fp.fp).toBe(9)

      select(map, {
        counter: map.countersAt(floc)[1],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing2.selected).toBe(true)
      expect(fire.doneSelect).toBe(false)

      fp = firepower(game, makeAction(game, ["firing1", "firing3", "firing2"]), target, tloc, false)
      expect(fp.fp).toBe(18)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      expect(baseToHit(fp.fp)).toBe(11)
      expect(fireHindrance(game, makeAction(game, ["firing1"]), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, ["firing1"]), makeAction(game, ["target1"]), false
      )
      expect(mods.mod).toBe(0)
      expect(mods.why.length).toBe(0)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.finishFire()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ id: "target1", from: [floc], to: tloc }]
      )
    })

    test("manning infantry can't be added to fire group", () => {
      const game = createTestGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGLdr)
      firing2.id = "firing2"
      map.addCounter(floc, firing2)
      const firing3 = new Unit(testGCrew)
      firing3.id = "firing3"
      const floc2 = new Coordinate(4, 2)
      map.addCounter(floc2, firing3)
      const firing4 = new Unit(testGGun)
      firing4.id = "firing4"
      map.addCounter(floc2, firing4)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)
      organizeStacks(map)

      expect(firing4.parent).toBe(firing3)

      game.startFire()

      const state = game.gameActionState as GameActionState
      const fire = state.fire as FireActionState
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc)[1],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing2.selected).toBe(true)
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc2)[0],
        target: { type: "map", xy: floc2 }
      }, () => {})
      select(map, {
        counter: map.countersAt(floc2)[1],
        target: { type: "map", xy: floc2 }
      }, () => {})
      expect(firing3.selected).toBe(false)
      expect(firing4.selected).toBe(false)
      expect(fire.doneSelect).toBe(false)
    })

    test("can't combine vehicle with group", () => {
      const game = createTestGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGLdr)
      firing2.id = "firing2"
      map.addCounter(floc, firing2)
      const firing3 = new Unit(testGTruck)
      firing3.id = "firing3"
      const floc2 = new Coordinate(4, 2)
      map.addCounter(floc2, firing3)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.startFire()

      const state = game.gameActionState as GameActionState
      const fire = state.fire as FireActionState
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc)[1],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing2.selected).toBe(true)
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc2)[0],
        target: { type: "map", xy: floc2 }
      }, () => {})
      expect(firing3.selected).toBe(false)
      expect(fire.doneSelect).toBe(false)
    })

    test("can't combine flamethrower with group", () => {
      const game = createTestGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGFT)
      firing2.id = "firing2"
      map.addCounter(floc, firing2)
      const firing3 = new Unit(testGLdr)
      firing3.id = "firing3"
      map.addCounter(floc, firing3)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.startFire()

      const state = game.gameActionState as GameActionState
      const fire = state.fire as FireActionState
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc)[2],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing3.selected).toBe(true)
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc)[1],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing2.selected).toBe(false)
      expect(fire.doneSelect).toBe(false)
    })

    test("can't combine satchel charge with group", () => {
      const game = createTestGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGSC)
      firing2.id = "firing2"
      map.addCounter(floc, firing2)
      const firing3 = new Unit(testGLdr)
      firing3.id = "firing3"
      map.addCounter(floc, firing3)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.startFire()

      const state = game.gameActionState as GameActionState
      const fire = state.fire as FireActionState
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc)[2],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing3.selected).toBe(true)
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc)[1],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing2.selected).toBe(false)
      expect(fire.doneSelect).toBe(false)
    })

    test("mg with pinned unit can't fire", () => {
      const game = createTestGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.status = unitStatus.Pinned
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGMG)
      firing2.id = "firing2"
      map.addCounter(floc, firing2)
      const firing3 = new Unit(testGLdr)
      firing3.id = "firing3"
      firing3.select()
      map.addCounter(floc, firing3)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.startFire()

      const state = game.gameActionState as GameActionState
      const fire = state.fire as FireActionState
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc)[0],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing.selected).toBe(false)
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc)[1],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing2.selected).toBe(false)
      expect(fire.doneSelect).toBe(false)
    })

    test("mg with broken unit can't fire", () => {
      const game = createTestGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.status = unitStatus.Broken
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGMG)
      firing2.id = "firing2"
      map.addCounter(floc, firing2)
      const firing3 = new Unit(testGLdr)
      firing3.id = "firing3"
      firing3.select()
      map.addCounter(floc, firing3)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.startFire()

      const state = game.gameActionState as GameActionState
      const fire = state.fire as FireActionState
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc)[0],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing.selected).toBe(false)
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc)[1],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing2.selected).toBe(false)
      expect(fire.doneSelect).toBe(false)
    })

    test("multiselect multiple hexes", () => {
      const game = createTestGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGLdr)
      firing2.id = "firing2"
      map.addCounter(floc, firing2)
      const firing3 = new Unit(testGInf)
      firing3.id = "firing3"
      const floc2 = new Coordinate(4, 2)
      map.addCounter(floc2, firing3)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.startFire()

      const state = game.gameActionState as GameActionState
      const fire = state.fire as FireActionState
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc)[1],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing2.selected).toBe(true)
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc2)[0],
        target: { type: "map", xy: floc2 }
      }, () => {})
      expect(firing3.selected).toBe(true)
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      const firingIDs = ["firing1", "firing2", "firing3"]
      const fp = firepower(game, makeAction(game, firingIDs), target, tloc, false)
      expect(fp.fp).toBe(16)
      expect(baseToHit(fp.fp)).toBe(11)
      expect(fireHindrance(game, makeAction(game, firingIDs), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, firingIDs), makeAction(game, ["target1"]), false
      )
      expect(mods.mod).toBe(0)
      expect(mods.why.length).toBe(0)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.finishFire()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ id: "target1", from: [floc, floc2], to: tloc }]
      )
    })

    test("infantry fire can't target armored", () => {
      const game = createTestGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRTank)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)

      game.startFire()

      const state = game.gameActionState as GameActionState
      expect(state.currentAction).toBe(actionType.Fire)
      expect(state.selection[0].id).toBe("firing1")

      const fire = state.fire as FireActionState
      expect(fire.doneSelect).toBe(true)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(false)
    })

    test("attack against unarmored vehicle", () => {
      const game = createTestGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRTruck)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)

      game.startFire()

      const state = game.gameActionState as GameActionState
      expect(state.currentAction).toBe(actionType.Fire)
      expect(state.selection[0].id).toBe("firing1")

      const fire = state.fire as FireActionState
      expect(fire.doneSelect).toBe(true)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false)
      expect(fp.fp).toBe(7)
      expect(baseToHit(fp.fp)).toBe(15)
      expect(fireHindrance(game, makeAction(game, ["firing1"]), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, ["firing1"]), makeAction(game, ["target1"]), false
      )
      expect(mods.mod).toBe(0)
      expect(mods.why.length).toBe(0)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.finishFire()
      Math.random = original

      expect(game.eliminatedUnits[0].id).toBe("target1")
    })

    test("can combine unit and carried mg", () => {
      const game = createTestGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGMG)
      firing2.id = "firing2"
      map.addCounter(floc, firing2)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.startFire()

      const state = game.gameActionState as GameActionState
      const fire = state.fire as FireActionState
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc)[1],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing2.selected).toBe(true)
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      const firingIDs = ["firing1", "firing2"]
      const fp = firepower(game, makeAction(game, firingIDs), target, tloc, false)
      expect(fp.fp).toBe(17)
      expect(baseToHit(fp.fp)).toBe(11)
      expect(fireHindrance(game, makeAction(game, firingIDs), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, firingIDs), makeAction(game, ["target1"]), false
      )
      expect(mods.mod).toBe(0)
      expect(mods.why.length).toBe(0)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.finishFire()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ id: "target1", from: [floc], to: tloc }]
      )
    })

    test("rapid fire", () => {
      const game = createTestGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGMG)
      firing2.id = "firing2"
      firing2.select()
      map.addCounter(floc, firing2)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)
      const target2 = new Unit(testRInf)
      target2.id = "target2"
      const tloc2 = new Coordinate(3, 0)
      map.addCounter(tloc2, target2)
      organizeStacks(map)

      game.startFire()

      const state = game.gameActionState as GameActionState
      const fire = state.fire as FireActionState
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      select(map, {
        counter: map.countersAt(tloc2)[0],
        target: { type: "map", xy: tloc2 }
      }, () => {})
      expect(target2.targetSelected).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing2"]), target, tloc, false)
      expect(fp.fp).toBe(10)
      expect(baseToHit(fp.fp)).toBe(13)
      expect(fireHindrance(game, makeAction(game, ["firing2"]), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, ["firing2"]), makeAction(game, ["target1", "target2"]), false
      )
      expect(mods.mod).toBe(2)
      expect(mods.why.length).toBe(1)
      expect(mods.why[0]).toBe("- plus 2 for rapid fire")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.finishFire()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [
          { id: "target1", from: [floc], to: tloc },
          { id: "target2", from: [floc], to: tloc2 },
        ]
      )
    })

    test("rapid group fire", () => {
      const game = createTestGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGMG)
      firing2.id = "firing2"
      firing2.select()
      map.addCounter(floc, firing2)
      const firing3 = new Unit(testGLdr)
      firing3.id = "firing3"
      map.addCounter(floc, firing3)
      const firing4 = new Unit(testGInf)
      firing4.id = "firing4"
      const floc2 = new Coordinate(4, 2)
      map.addCounter(floc2, firing4)
      const firing5 = new Unit(testGMG)
      firing5.id = "firing5"
      map.addCounter(floc2, firing5)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)
      const target2 = new Unit(testRInf)
      target2.id = "target2"
      const tloc2 = new Coordinate(3, 0)
      map.addCounter(tloc2, target2)
      organizeStacks(map)

      game.startFire()

      const state = game.gameActionState as GameActionState
      const fire = state.fire as FireActionState
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc)[2],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing3.selected).toBe(true)
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc2)[1],
        target: { type: "map", xy: floc2 }
      }, () => {})
      expect(firing5.selected).toBe(true)
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      select(map, {
        counter: map.countersAt(tloc2)[0],
        target: { type: "map", xy: tloc2 }
      }, () => {})
      expect(target2.targetSelected).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing2", "firing5"]), target, tloc, false)
      expect(fp.fp).toBe(22)
      expect(baseToHit(fp.fp)).toBe(10)
      expect(fireHindrance(game, makeAction(game, ["firing2", "firing5"]), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, ["firing2", "firing5"]), makeAction(game, ["target1", "target2"]), false
      )
      expect(mods.mod).toBe(2)
      expect(mods.why.length).toBe(1)
      expect(mods.why[0]).toBe("- plus 2 for rapid fire")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.finishFire()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [
          { id: "target1", from: [floc, floc2], to: tloc },
          { id: "target2", from: [floc, floc2], to: tloc2 },
        ]
      )
    })

    test("rapid fire can't target armored", () => {
      const game = createTestGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGMG)
      firing2.id = "firing2"
      firing2.select()
      map.addCounter(floc, firing2)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)
      const target2 = new Unit(testRTank)
      target2.id = "target2"
      const tloc2 = new Coordinate(3, 0)
      map.addCounter(tloc2, target2)
      organizeStacks(map)

      game.startFire()

      const state = game.gameActionState as GameActionState
      const fire = state.fire as FireActionState
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      select(map, {
        counter: map.countersAt(tloc2)[0],
        target: { type: "map", xy: tloc2 }
      }, () => {})
      expect(target2.targetSelected).toBe(false)
    })

    test("can fire opponent's weapon", () => {
      const game = createTestGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGMG)
      firing2.nation = "ussr"
      firing2.id = "firing2"
      map.addCounter(floc, firing2)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.startFire()

      const state = game.gameActionState as GameActionState
      const fire = state.fire as FireActionState
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc)[1],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing2.selected).toBe(true)
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      const firingIDs = ["firing1", "firing2"]
      const fp = firepower(game, makeAction(game, firingIDs), target, tloc, false)
      expect(fp.fp).toBe(17)
      expect(baseToHit(fp.fp)).toBe(11)
      expect(fireHindrance(game, makeAction(game, firingIDs), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, firingIDs), makeAction(game, ["target1"]), false
      )
      expect(mods.mod).toBe(0)
      expect(mods.why.length).toBe(0)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.finishFire()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ id: "target1", from: [floc], to: tloc }]
      )
    })

    test("area fire", () => {
    })

    test("offboard artillery", () => {
    })

    test("single shot", () => {
    })

    test("incendiary", () => {
    })

    test("smoke", () => {
    })

    test("ranged fire", () => {
    })

    test("gun can't fire if crewed is", () => {
    })

    test("ranged fire", () => {
    })

    test("ranged fire against infantry", () => {
    })

    test("ranged fire against armored vehicle", () => {
    })

    test("ranged fire against unarmored vehicle", () => {
    })

    test("ranged fire after moving turret", () => {
    })

    test("vehicle machine gun", () => {
    })

    test("can't fire infantry from tranpsort", () => {
    })

    test("can't fire support weapon from tranpsort", () => {
    })

    test("firing with sponson", () => {
    })
  })
})
