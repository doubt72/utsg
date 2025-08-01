import { describe, expect, test, vi } from "vitest"
import { baseToHit, chance2D10, chanceD10x10 } from "../../utilities/utilities"
import { Coordinate, featureType, sponsonType, unitStatus } from "../../utilities/commonTypes"
import Unit from "../Unit"
import Game from "../Game"
import select from "./select"
import {
  armorHitModifiers, fireHindrance, firepower, moraleModifiers, rangeMultiplier, untargetedModifiers
} from "./fire"
import Counter from "../Counter"
import IllegalActionError from "../actions/IllegalActionError"
import organizeStacks from "../support/organizeStacks"
import { GameActionDiceResult, GameActionPath } from "../GameAction"
import Feature from "../Feature"
import {
  createFireGame, testGAC, testGCrew, testGFT, testGGun, testGInf, testGLdr, testGMC, testGMG,
  testGMortar, testGRadio, testGSC, testGTank, testGTruck, testITank, testPill, testRInf, testRTank,
  testRTruck, testWire
} from "./testHelpers"
import FireState from "./state/FireState"
import { StateSelection, stateType } from "./state/BaseState"

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

  const makeAction = (game: Game, ids: string[]): StateSelection[] => {
    return ids.map(id => {
      const counter = game.findCounterById(id) as Counter
      const hex = counter.hex as Coordinate
      return { x: hex.x, y: hex.y, id, counter }
    })
  }

  describe("fire action", () => {
    test("can fire", () => {
      const game = createFireGame()
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

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.type).toBe(stateType.Fire)
      expect(fire.selection[0].id).toBe("firing1")

      expect(fire.doneSelect).toBe(true)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false, [false])
      expect(fp.fp).toBe(7)
      expect(baseToHit(fp.fp)).toBe(15)
      expect(fireHindrance(game, makeAction(game, ["firing1"]), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, ["firing1"]), makeAction(game, ["target1"]),
        game.fireState.path as GameActionPath[]
      )
      expect(mods.mod).toBe(0)
      expect(mods.why.length).toBe(0)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ unit: target, from: [floc], to: tloc, incendiary: false }]
      )

      expect(firing.isActivated).toBe(true)

      try {
        game.executeUndo()
      } catch(err) {
        // Can't roll back a smoke roll
        expect(err instanceof IllegalActionError).toBe(true)
      }
    })

    test("fire2", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRInf)
      target.id = "target1"
      target.pinned = true
      const tloc = new Coordinate(4, 2)
      map.addCounter(tloc, target)

      game.gameState = new FireState(game, false)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false, [false])
      expect(fp.fp).toBe(7)
      expect(baseToHit(fp.fp)).toBe(15)
      expect(fireHindrance(game, makeAction(game, ["firing1"]), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, ["firing1"]), makeAction(game, ["target1"]),
        game.fireState.path as GameActionPath[]
      )
      expect(mods.mod).toBe(-1)
      expect(mods.why.length).toBe(1)
      expect(mods.why[0]).toBe("- minus 1 for adjacent")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ unit: target, from: [floc], to: tloc, incendiary: false }]
      )
    })

    test("fire3", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRInf)
      target.id = "target1"
      target.status = unitStatus.Activated
      const tloc = new Coordinate(4, 4)
      map.addCounter(tloc, target)

      game.gameState = new FireState(game, false)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false, [false])
      expect(fp.fp).toBe(7)
      expect(baseToHit(fp.fp)).toBe(15)
      expect(fireHindrance(game, makeAction(game, ["firing1"]), tloc)).toBe(2)
      const mods = untargetedModifiers(
        game, makeAction(game, ["firing1"]), makeAction(game, ["target1"]),
        game.fireState.path as GameActionPath[]
      )
      expect(mods.mod).toBe(0)
      expect(mods.why.length).toBe(0)

      const mc = moraleModifiers(game, target, [floc], tloc, false)
      expect(mc.mod).toBe(-3)
      expect(mc.why.length).toBe(1)
      expect(mc.why[0]).toBe("- minus morale 3")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ unit: target, from: [floc], to: tloc, incendiary: false }]
      )
    })

    test("fire4", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRInf)
      target.id = "target1"
      target.status = unitStatus.Exhausted
      const tloc = new Coordinate(2, 4)
      map.addCounter(tloc, target)

      game.gameState = new FireState(game, false)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false, [false])
      expect(fp.fp).toBe(7)
      expect(baseToHit(fp.fp)).toBe(15)
      expect(fireHindrance(game, makeAction(game, ["firing1"]), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, ["firing1"]), makeAction(game, ["target1"]),
        game.fireState.path as GameActionPath[]
      )
      expect(mods.mod).toBe(0)
      expect(mods.why.length).toBe(0)

      const mc = moraleModifiers(game, target, [floc], tloc, false)
      expect(mc.mod).toBe(-6)
      expect(mc.why.length).toBe(2)
      expect(mc.why[0]).toBe("- minus morale 3")
      expect(mc.why[1]).toBe("- minus cover 3")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ unit: target, from: [floc], to: tloc, incendiary: false }]
      )
    })

    test("fire5", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRInf)
      target.id = "target1"
      target.status = unitStatus.Tired
      const tloc = new Coordinate(0, 2)
      map.addCounter(tloc, target)

      game.gameState = new FireState(game, false)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false, [false])
      expect(fp.fp).toBe(7)
      expect(baseToHit(fp.fp)).toBe(15)
      expect(fireHindrance(game, makeAction(game, ["firing1"]), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, ["firing1"]), makeAction(game, ["target1"]),
        game.fireState.path as GameActionPath[]
      )
      expect(mods.mod).toBe(1)
      expect(mods.why.length).toBe(1)
      expect(mods.why[0]).toBe("- plus 1 for more than half range")

      const mc = moraleModifiers(game, target, [floc], tloc, false)
      expect(mc.mod).toBe(-4)
      expect(mc.why.length).toBe(2)
      expect(mc.why[0]).toBe("- minus morale 3")
      expect(mc.why[1]).toBe("- minus cover 1")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ unit: target, from: [floc], to: tloc, incendiary: false }]
      )
    })

    test("fire6", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRInf)
      target.id = "target1"
      target.status = unitStatus.Broken
      const tloc = new Coordinate(2, 0)
      map.addCounter(tloc, target)

      game.gameState = new FireState(game, false)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false, [false])
      expect(fp.fp).toBe(7)
      expect(baseToHit(fp.fp)).toBe(15)
      expect(fireHindrance(game, makeAction(game, ["firing1"]), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, ["firing1"]), makeAction(game, ["target1"]),
        game.fireState.path as GameActionPath[]
      )
      expect(mods.mod).toBe(0)
      expect(mods.why.length).toBe(0)

      const mc = moraleModifiers(game, target, [floc], tloc, false)
      expect(mc.mod).toBe(-2)
      expect(mc.why.length).toBe(2)
      expect(mc.why[0]).toBe("- minus morale 1")
      expect(mc.why[1]).toBe("- minus cover 1")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ unit: target, from: [floc], to: tloc, incendiary: false }]
      )
    })

    test("wall flip", () => {
      const game = createFireGame([
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o", b: "w", be: [2] }, { t: "o" }, { t: "o" }],
        [{ t: "f" }, { t: "o" }, { t: "o" }, { t: "b" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "b" }, { t: "o" }],
        [
          { t: "o" },
          { t: "o", s: { d: [4, 6], t: "t" } },
          { t: "o", s: { d: [1, 5], t: "t" } },
          { t: "o" }, { t: "b" }
        ],
      ])
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

      game.gameState = new FireState(game, false)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false, [false])
      expect(fp.fp).toBe(7)
      expect(baseToHit(fp.fp)).toBe(15)
      expect(fireHindrance(game, makeAction(game, ["firing1"]), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, ["firing1"]), makeAction(game, ["target1"]),
        game.fireState.path as GameActionPath[]
      )
      expect(mods.mod).toBe(0)
      expect(mods.why.length).toBe(0)

      const mc = moraleModifiers(game, target, [floc], tloc, false)
      expect(mc.mod).toBe(-4)
      expect(mc.why.length).toBe(2)
      expect(mc.why[0]).toBe("- minus morale 3")
      expect(mc.why[1]).toBe("- minus cover 1")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ unit: target, from: [floc], to: tloc, incendiary: false }]
      )
    })

    test("bunker", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(0, 4)
      map.addCounter(tloc, target)
      const pill = new Feature(testPill)
      pill.id = "pillbox"
      map.addCounter(tloc, pill)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      select(map, {
        counter: map.countersAt(tloc)[1],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false, [false])
      expect(fp.fp).toBe(7)
      expect(baseToHit(fp.fp)).toBe(15)
      expect(fireHindrance(game, makeAction(game, ["firing1"]), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, ["firing1"]), makeAction(game, ["target1"]),
        game.fireState.path as GameActionPath[]
      )
      expect(mods.mod).toBe(1)
      expect(mods.why.length).toBe(1)
      expect(mods.why[0]).toBe("- plus 1 for more than half range")

      const mc = moraleModifiers(game, target, [floc], tloc, false)
      expect(mc.mod).toBe(-7)
      expect(mc.why.length).toBe(2)
      expect(mc.why[0]).toBe("- minus morale 3")
      expect(mc.why[1]).toBe("- minus cover 4")

      pill.facing = 3

      const mc2 = moraleModifiers(game, target, [floc], tloc, false)
      expect(mc2.mod).toBe(-4)
      expect(mc2.why.length).toBe(2)
      expect(mc2.why[0]).toBe("- minus morale 3")
      expect(mc2.why[1]).toBe("- minus cover 1")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ unit: target, from: [floc], to: tloc, incendiary: false }]
      )
    })

    test("doesn't multiselection without leader", () => {
      const game = createFireGame()
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

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.doneSelect).toBe(true)

      select(map, {
        counter: map.countersAt(floc)[1],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(firing2.selected).toBe(false)
    })

    test("multiselect with leader", () => {
      const game = createFireGame()
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

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.doneSelect).toBe(false)

      let fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false, [false])
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

      fp = firepower(game, makeAction(game, ["firing1", "firing3"]), target, tloc, false, [false])
      expect(fp.fp).toBe(9)

      select(map, {
        counter: map.countersAt(floc)[1],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing2.selected).toBe(true)
      expect(fire.doneSelect).toBe(false)

      fp = firepower(game, makeAction(game, ["firing1", "firing3", "firing2"]), target, tloc, false, [false])
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
        game, makeAction(game, ["firing1"]), makeAction(game, ["target1"]),
        game.fireState.path as GameActionPath[]
      )
      expect(mods.mod).toBe(0)
      expect(mods.why.length).toBe(0)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ unit: target, from: [floc], to: tloc, incendiary: false }]
      )
    })

    test("manning infantry can't be added to fire group", () => {
      const game = createFireGame()
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

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
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
      const game = createFireGame()
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

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
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
      const game = createFireGame()
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

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
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
      const game = createFireGame()
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

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
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
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.pinned = true
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

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc)[0],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing.selected).toBe(true)
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc)[1],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing2.selected).toBe(false)
      expect(fire.doneSelect).toBe(false)
    })

    test("mg with broken unit can't fire", () => {
      const game = createFireGame()
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

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
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

    test("can't add activated units when not activated", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.status = unitStatus.Activated
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGMG)
      firing2.id = "firing2"
      firing2.status = unitStatus.Activated
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

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
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

    test("can add activated units when activated (intensive fire)", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.status = unitStatus.Activated
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGMG)
      firing2.id = "firing2"
      firing2.status = unitStatus.Activated
      map.addCounter(floc, firing2)
      const firing3 = new Unit(testGLdr)
      firing3.id = "firing3"
      firing3.status = unitStatus.Activated
      firing3.select()
      map.addCounter(floc, firing3)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc)[0],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing.selected).toBe(true)
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc)[1],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing2.selected).toBe(true)
      expect(fire.doneSelect).toBe(false)
    })

    test("can't add exhausted units", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.status = unitStatus.Exhausted
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGMG)
      firing2.id = "firing2"
      firing2.status = unitStatus.Exhausted
      map.addCounter(floc, firing2)
      const firing3 = new Unit(testGLdr)
      firing3.id = "firing3"
      firing3.status = unitStatus.Activated
      firing3.select()
      map.addCounter(floc, firing3)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
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
      const game = createFireGame()
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

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
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
      const fp = firepower(game, makeAction(game, firingIDs), target, tloc, false, [false])
      expect(fp.fp).toBe(16)
      expect(baseToHit(fp.fp)).toBe(11)
      expect(fireHindrance(game, makeAction(game, firingIDs), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, firingIDs), makeAction(game, ["target1"]),
        game.fireState.path as GameActionPath[]
      )
      expect(mods.mod).toBe(0)
      expect(mods.why.length).toBe(0)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ unit: target, from: [floc, floc2], to: tloc, incendiary: false }]
      )

      expect(firing.isActivated).toBe(true)
      expect(firing2.isActivated).toBe(true)
      expect(firing3.isActivated).toBe(true)
    })

    test("infantry fire can't target armored", () => {
      const game = createFireGame()
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

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.type).toBe(stateType.Fire)
      expect(fire.selection[0].id).toBe("firing1")

      expect(fire.doneSelect).toBe(true)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(false)
    })

    test("attack against unarmored vehicle", () => {
      const game = createFireGame()
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

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.type).toBe(stateType.Fire)
      expect(fire.selection[0].id).toBe("firing1")

      expect(fire.doneSelect).toBe(true)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false, [false])
      expect(fp.fp).toBe(7)
      expect(baseToHit(fp.fp)).toBe(15)
      expect(fireHindrance(game, makeAction(game, ["firing1"]), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, ["firing1"]), makeAction(game, ["target1"]),
        game.fireState.path as GameActionPath[]
      )
      expect(mods.mod).toBe(0)
      expect(mods.why.length).toBe(0)

      expect(game.playerTwoScore).toBe(10)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(target.isWreck).toBe(true)
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[0].description).toBe(
        "hit roll (2d10): target 15, rolled 20: hit, Studebaker US6 destroyed"
      )
      expect(game.playerTwoScore).toBe(14)
    })

    test("can combine unit and carried mg", () => {
      const game = createFireGame()
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

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
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
      const fp = firepower(game, makeAction(game, firingIDs), target, tloc, false, [false])
      expect(fp.fp).toBe(17)
      expect(baseToHit(fp.fp)).toBe(11)
      expect(fireHindrance(game, makeAction(game, firingIDs), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, firingIDs), makeAction(game, ["target1"]),
        game.fireState.path as GameActionPath[]
      )
      expect(mods.mod).toBe(0)
      expect(mods.why.length).toBe(0)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ unit: target, from: [floc], to: tloc, incendiary: false }]
      )
    })

    test("rapid fire", () => {
      const game = createFireGame()
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

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
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

      const fp = firepower(game, makeAction(game, ["firing2"]), target, tloc, false, [false])
      expect(fp.fp).toBe(10)
      expect(baseToHit(fp.fp)).toBe(13)
      expect(fireHindrance(game, makeAction(game, ["firing2"]), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, ["firing2"]), makeAction(game, ["target1", "target2"]),
        game.fireState.path as GameActionPath[]
      )
      expect(mods.mod).toBe(1)
      expect(mods.why.length).toBe(1)
      expect(mods.why[0]).toBe("- plus 1 for rapid fire")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [
          { unit: target, from: [floc], to: tloc, incendiary: false },
          { unit: target2, from: [floc], to: tloc2, incendiary: false },
        ]
      )
    })

    test("rapid group fire", () => {
      const game = createFireGame()
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

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
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

      const fp = firepower(game, makeAction(game, ["firing2", "firing5"]), target, tloc, false, [false])
      expect(fp.fp).toBe(22)
      expect(baseToHit(fp.fp)).toBe(10)
      expect(fireHindrance(game, makeAction(game, ["firing2", "firing5"]), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, ["firing2", "firing5"]), makeAction(game, ["target1", "target2"]),
        game.fireState.path as GameActionPath[]
      )
      expect(mods.mod).toBe(1)
      expect(mods.why.length).toBe(1)
      expect(mods.why[0]).toBe("- plus 1 for rapid fire")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [
          { unit: target, from: [floc, floc2], to: tloc, incendiary: false },
          { unit: target2, from: [floc, floc2], to: tloc2, incendiary: false },
        ]
      )
    })

    test("rapid fire can't target armored", () => {
      const game = createFireGame()
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

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
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
      const game = createFireGame()
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

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
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
      const fp = firepower(game, makeAction(game, firingIDs), target, tloc, false, [false])
      expect(fp.fp).toBe(17)
      expect(baseToHit(fp.fp)).toBe(11)
      expect(fireHindrance(game, makeAction(game, firingIDs), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, firingIDs), makeAction(game, ["target1"]),
        game.fireState.path as GameActionPath[]
      )
      expect(mods.mod).toBe(0)
      expect(mods.why.length).toBe(0)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ unit: target, from: [floc], to: tloc, incendiary: false }]
      )
    })

    test("breakdown roll", () => {
      const game = createFireGame()
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
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.01)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([])
      expect(firing2.jammed).toBe(true)
    })

    test("area fire (tie, immobilized vehicle)", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGMortar)
      firing2.id = "firing2"
      firing2.select()
      map.addCounter(floc, firing2)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)
      const target2 = new Unit(testRInf)
      target2.id = "target2"
      map.addCounter(tloc, target2)
      const target3 = new Unit(testRTank)
      target3.id = "target3"
      map.addCounter(tloc, target3)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.doneSelect).toBe(true)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(target2.targetSelected).toBe(true)
      expect(target3.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing2"]), target, tloc, false, [false])
      expect(fp.fp).toBe(8)
      expect(fp.why.length).toBe(1)
      expect(baseToHit(fp.fp)).toBe(14)

      const fp2 = firepower(game, makeAction(game, ["firing2"]), target3, tloc, false, [false])
      expect(fp2.fp).toBe(4)
      expect(fp2.why.length).toBe(2)
      expect(fp2.why[1]).toBe("- halved: high-explosive vs. armor")
      expect(baseToHit(fp2.fp)).toBe(17)

      const mult = rangeMultiplier(map, makeAction(game, ["firing2"])[0].counter, tloc, false, false)
      expect(mult.mult).toBe(3)
      expect(mult.why.length).toBe(1)

      expect(fireHindrance(game, makeAction(game, ["firing1"]), tloc)).toBe(0)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([
        { unit: target, from: [floc], to: tloc, incendiary: false },
        { unit: target2, from: [floc], to: tloc, incendiary: false },
      ])
      expect(target3.immobilized).toBe(true)
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[2].description).toBe(
        "penetration roll for T-34 M40 (2d10): target 20, rolled 20: tie, vehicle immobilized"
      )
    })

    test("area fire (miss)", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGMortar)
      firing2.baseFirepower /= 2
      firing2.id = "firing2"
      firing2.select()
      map.addCounter(floc, firing2)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)
      const target2 = new Unit(testRInf)
      target2.id = "target2"
      map.addCounter(tloc, target2)
      const target3 = new Unit(testRTank)
      target3.id = "target3"
      map.addCounter(tloc, target3)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.doneSelect).toBe(true)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(target2.targetSelected).toBe(true)
      expect(target3.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing2"]), target, tloc, false, [false])
      expect(fp.fp).toBe(4)
      expect(fp.why.length).toBe(1)
      expect(baseToHit(fp.fp)).toBe(17)

      const fp2 = firepower(game, makeAction(game, ["firing2"]), target3, tloc, false, [false])
      expect(fp2.fp).toBe(2)
      expect(fp2.why.length).toBe(2)
      expect(fp2.why[1]).toBe("- halved: high-explosive vs. armor")
      expect(baseToHit(fp2.fp)).toBe(19)

      const mult = rangeMultiplier(map, makeAction(game, ["firing2"])[0].counter, tloc, false, false)
      expect(mult.mult).toBe(3)
      expect(mult.why.length).toBe(1)

      expect(fireHindrance(game, makeAction(game, ["firing1"]), tloc)).toBe(0)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([
        { unit: target, from: [floc], to: tloc, incendiary: false },
        { unit: target2, from: [floc], to: tloc, incendiary: false },
      ])
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[2].description).toBe(
        "penetration roll for T-34 M40 (2d10): target 22, rolled 20: failed"
      )
    })

    test("offboard artillery", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGRadio)
      firing2.id = "firing2"
      firing2.select()
      map.addCounter(floc, firing2)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)
      const target2 = new Unit(testRInf)
      target2.id = "target2"
      map.addCounter(tloc, target2)
      const target3 = new Unit(testRTank)
      target3.id = "target3"
      map.addCounter(tloc, target3)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.doneSelect).toBe(true)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(target2.targetSelected).toBe(true)
      expect(target3.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing2"]), target, tloc, false, [false])
      expect(fp.fp).toBe(24)
      expect(fp.why.length).toBe(1)
      expect(baseToHit(fp.fp)).toBe(9)

      const fp2 = firepower(game, makeAction(game, ["firing2"]), target3, tloc, false, [false])
      expect(fp2.fp).toBe(12)
      expect(fp2.why.length).toBe(2)
      expect(fp2.why[1]).toBe("- halved: high-explosive vs. armor")
      expect(baseToHit(fp2.fp)).toBe(12)

      const mult = rangeMultiplier(map, makeAction(game, ["firing2"])[0].counter, tloc, false, false)
      expect(mult.mult).toBe(4)
      expect(mult.why.length).toBe(1)

      expect(fireHindrance(game, makeAction(game, ["firing1"]), tloc)).toBe(0)
      expect(game.playerTwoScore).toBe(10)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([
        { unit: target, from: [floc], to: tloc, incendiary: false },
        { unit: target2, from: [floc], to: tloc, incendiary: false },
      ])
      expect(target3.isWreck).toBe(true)
      expect(game.playerTwoScore).toBe(15)
    })

    test("offboard artillery miss", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGRadio)
      firing2.id = "firing2"
      firing2.select()
      map.addCounter(floc, firing2)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 2)
      map.addCounter(tloc, target)
      const target2 = new Unit(testRInf)
      target2.id = "target2"
      map.addCounter(tloc, target2)
      const target3 = new Unit(testRTank)
      target3.id = "target3"
      map.addCounter(tloc, target3)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.doneSelect).toBe(true)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(target2.targetSelected).toBe(true)
      expect(target3.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing2"]), target, tloc, false, [false])
      expect(fp.fp).toBe(24)
      expect(fp.why.length).toBe(1)
      expect(baseToHit(fp.fp)).toBe(9)

      const fp2 = firepower(game, makeAction(game, ["firing2"]), target3, tloc, false, [false])
      expect(fp2.fp).toBe(12)
      expect(fp2.why.length).toBe(2)
      expect(fp2.why[1]).toBe("- halved: high-explosive vs. armor")
      expect(baseToHit(fp2.fp)).toBe(12)

      const mult = rangeMultiplier(map, makeAction(game, ["firing2"])[0].counter, tloc, false, false)
      expect(mult.mult).toBe(4)
      expect(mult.why.length).toBe(1)

      expect(fireHindrance(game, makeAction(game, ["firing1"]), tloc)).toBe(0)
      expect(game.playerTwoScore).toBe(10)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.01)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([])
      expect(target3.isWreck).toBe(false)
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[0].description).toBe(
        "targeting roll (d10x10): target 4, rolled 1: miss, drifts, firing weapon broken"
      )
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[1].description).toBe(
        "direction roll (d6): 1"
      )
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[2].description).toBe(
        "distance roll (d10): 1 for 1 hexes, drifted to D3"
      )
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[3].description).toBe(
        "infantry effect roll (2d10): target 9, rolled 2: failed"
      )

      const all = map.allUnits
      expect(all.length).toBe(5)
      expect(all[0].unit.id).toBe("target1")
      expect(all[1].unit.id).toBe("target2")
      expect(all[2].unit.id).toBe("target3")
      expect(all[3].unit.id).toBe("firing1")
      expect(all[4].unit.id).toBe("firing2")
      expect(all[4].unit.jammed).toBe(true)
    })

    test("offboard artillery hex", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGRadio)
      firing2.id = "firing2"
      firing2.select()
      map.addCounter(floc, firing2)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      game.fireState.toHex(4, 2)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.01)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([])
      expect(game.lastAction?.stringValue).toBe(
        "German Radio 10.5cm at D3 fired at E3; targeting roll (d10x10): target 4, rolled 1: miss, " +
        "drifts, firing weapon broken; direction roll (d6): 1; distance roll (d10): 1 for 1 hexes, " +
        "drifted to D3; infantry effect roll (2d10): target 9, rolled 2: failed"
      )

      const all = map.allUnits
      expect(all.length).toBe(2)
      expect(all[0].unit.id).toBe("firing1")
      expect(all[1].unit.id).toBe("firing2")
    })

    test("offboard artillery firing smoke", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGRadio)
      firing2.id = "firing2"
      firing2.select()
      map.addCounter(floc, firing2)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      game.fireState.smokeToggle()
      game.fireState.toHex(4, 2)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.01)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([])
      expect(game.lastAction?.stringValue).toBe(
        "German Radio 10.5cm at D3 fired smoke at E3; targeting roll (d10x10): target 4, rolled 1: miss, " +
        "drifts, firing weapon broken; direction roll (d6): 1; distance roll (d10): 1 for 1 hexes, " +
        "drifted to D3; smoke roll (d10): rolled 1, smoke level 1"
      )

      const all = map.allCounters
      expect(all.length).toBe(3)
      expect(all[0].unit.id).toBe("0-smoke")
      expect(all[0].hex?.x).toBe(3)
      expect(all[0].hex?.y).toBe(2)
      expect(all[1].unit.id).toBe("firing1")
      expect(all[2].unit.id).toBe("firing2")
    })

    test("mortar firing smoke", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGMortar)
      firing2.id = "firing2"
      firing2.select()
      map.addCounter(floc, firing2)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      game.fireState.smokeToggle()
      game.fireState.toHex(0, 2)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([])
      expect(game.lastAction?.stringValue).toBe(
        "German 5cm leGrW 36 at D3 fired smoke at A3; targeting roll (d10x10): target 9, rolled 100: hit; " +
        "smoke roll (d10): rolled 10, smoke level 4"
      )

      const all = map.allCounters
      expect(all.length).toBe(3)
      expect(all[0].unit.id).toBe("firing1")
      expect(all[1].unit.id).toBe("firing2")
      expect(all[2].unit.id).toBe("0-smoke")
      expect(all[2].hex?.x).toBe(0)
      expect(all[2].hex?.y).toBe(2)
    })

    test("gun firing smoke", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGGun)
      firing2.id = "firing2"
      firing2.select()
      map.addCounter(floc, firing2)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      game.fireState.smokeToggle()
      game.fireState.toHex(0, 2)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([])
      expect(game.lastAction?.stringValue).toBe(
        "German 3.7cm Pak 36 at D3 fired smoke at A3; targeting roll (d10x10): target 12, rolled 100: hit; " +
        "smoke roll (d10): rolled 10, smoke level 4"
      )

      const all = map.allCounters
      expect(all.length).toBe(3)
      expect(all[0].unit.id).toBe("firing1")
      expect(all[0].unit.status).toBe(unitStatus.Activated)
      expect(all[1].unit.id).toBe("firing2")
      expect(all[1].unit.status).toBe(unitStatus.Activated)
      expect(all[2].unit.id).toBe("0-smoke")
      expect(all[2].hex?.x).toBe(0)
      expect(all[2].hex?.y).toBe(2)
    })

    test("gun firing smoke miss", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGGun)
      firing2.id = "firing2"
      firing2.select()
      map.addCounter(floc, firing2)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      game.fireState.smokeToggle()
      game.fireState.toHex(0, 2)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.01)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([])
      expect(game.lastAction?.stringValue).toBe(
        "German 3.7cm Pak 36 at D3 fired smoke at A3; targeting roll (d10x10): target 12, rolled 1: miss, " +
        "firing weapon broken"
      )

      const all = map.allCounters
      expect(all.length).toBe(2)
      expect(all[0].unit.id).toBe("firing1")
      expect(all[1].unit.id).toBe("firing2")
    })

    test("single shot", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGSC)
      firing2.id = "firing2"
      firing2.select()
      map.addCounter(floc, firing2)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 2)
      map.addCounter(tloc, target)
      const target2 = new Unit(testRInf)
      target2.id = "target2"
      map.addCounter(tloc, target2)
      const target3 = new Unit(testRTank)
      target3.id = "target3"
      map.addCounter(tloc, target3)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.doneSelect).toBe(true)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(target2.targetSelected).toBe(true)
      expect(target3.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing2"]), target, tloc, false, [false])
      expect(fp.fp).toBe(24)
      expect(fp.why.length).toBe(1)
      expect(baseToHit(fp.fp)).toBe(9)

      const fp2 = firepower(game, makeAction(game, ["firing2"]), target3, tloc, false, [false])
      expect(fp2.fp).toBe(12)
      expect(fp2.why.length).toBe(2)
      expect(fp2.why[1]).toBe("- halved: high-explosive vs. armor")
      expect(baseToHit(fp2.fp)).toBe(12)

      const mult = rangeMultiplier(map, makeAction(game, ["firing2"])[0].counter, tloc, false, false)
      expect(mult.mult).toBe(3)
      expect(mult.why.length).toBe(1)
      const mods = armorHitModifiers(game, firing2, target3, floc, tloc, false)
      expect(mods.mod).toBe(-1)
      expect(mods.why.length).toBe(1)
      expect(mods.why[0]).toBe("- minus 1 for point-blank range")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([
        { unit: target, from: [floc], to: tloc, incendiary: false },
        { unit: target2, from: [floc], to: tloc, incendiary: false },
      ])
      expect(target3.isWreck).toBe(true)
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[2].description).toBe(
        "penetration roll for T-34 M40 (2d10): target 15, rolled 20: succeeded, vehicle destroyed"
      )

      const all = map.allUnits
      expect(all.length).toBe(4)
      expect(all[0].unit.id).toBe("target1")
      expect(all[1].unit.id).toBe("target2")
      expect(all[2].unit.id).toBe("target3")
      expect(all[3].unit.id).toBe("firing1")
      expect(all[3].children.length).toBe(0)

      expect(game.eliminatedUnits[0].id).toBe("firing2")
      expect((game.eliminatedUnits[0] as Unit).parent).toBe(undefined)
    })

    test("incendiary", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGFT)
      firing2.id = "firing2"
      firing2.select()
      map.addCounter(floc, firing2)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 2)
      map.addCounter(tloc, target)
      const target2 = new Unit(testRInf)
      target2.id = "target2"
      map.addCounter(tloc, target2)
      const target3 = new Unit(testRTank)
      target3.id = "target3"
      map.addCounter(tloc, target3)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.doneSelect).toBe(true)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(target2.targetSelected).toBe(true)
      expect(target3.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing2"]), target, tloc, false, [false])
      expect(fp.fp).toBe(24)
      expect(fp.why.length).toBe(1)
      expect(baseToHit(fp.fp)).toBe(9)

      const fp2 = firepower(game, makeAction(game, ["firing2"]), target3, tloc, false, [false])
      expect(fp2.fp).toBe(24)
      expect(fp2.why.length).toBe(1)
      expect(baseToHit(fp2.fp)).toBe(9)

      const mult = rangeMultiplier(map, makeAction(game, ["firing2"])[0].counter, tloc, false, false)
      expect(mult.mult).toBe(3)
      expect(mult.why.length).toBe(1)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([
        { unit: target, from: [floc], to: tloc, incendiary: true },
        { unit: target2, from: [floc], to: tloc, incendiary: true },
      ])
      expect(target3.isWreck).toBe(true)
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[1].description).toBe(
        "penetration roll for T-34 M40 (2d10): target 9, rolled 20: succeeded, vehicle destroyed"
      )
    })

    test("incendiary breaks", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGFT)
      firing2.id = "firing2"
      firing2.select()
      map.addCounter(floc, firing2)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 2)
      map.addCounter(tloc, target)
      const target2 = new Unit(testRInf)
      target2.id = "target2"
      map.addCounter(tloc, target2)
      const target3 = new Unit(testRTank)
      target3.id = "target3"
      map.addCounter(tloc, target3)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.doneSelect).toBe(true)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(target2.targetSelected).toBe(true)
      expect(target3.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing2"]), target, tloc, false, [false])
      expect(fp.fp).toBe(24)
      expect(fp.why.length).toBe(1)
      expect(baseToHit(fp.fp)).toBe(9)

      const fp2 = firepower(game, makeAction(game, ["firing2"]), target3, tloc, false, [false])
      expect(fp2.fp).toBe(24)
      expect(fp2.why.length).toBe(1)
      expect(baseToHit(fp2.fp)).toBe(9)

      const mult = rangeMultiplier(map, makeAction(game, ["firing2"])[0].counter, tloc, false, false)
      expect(mult.mult).toBe(3)
      expect(mult.why.length).toBe(1)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.01)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([
        { unit: firing, from: [], to: floc, incendiary: true },
      ])
      expect(target3.isWreck).toBe(false)
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[0].description).toBe(
        "hit roll (2d10): target 9, rolled 2: miss, Flamethrower destroyed"
      )

      const all = map.allUnits
      expect(all.length).toBe(4)
      expect(all[0].unit.id).toBe("target1")
      expect(all[1].unit.id).toBe("target2")
      expect(all[2].unit.id).toBe("target3")
      expect(all[3].unit.id).toBe("firing1")
      expect(all[3].children.length).toBe(0)

      expect(game.eliminatedUnits[0].id).toBe("firing2")
      expect((game.eliminatedUnits[0] as Unit).parent).toBe(undefined)
    })

    test("targeted incendiary single shot", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGMC)
      firing2.id = "firing2"
      firing2.select()
      map.addCounter(floc, firing2)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 2)
      map.addCounter(tloc, target)
      const target2 = new Unit(testRInf)
      target2.id = "target2"
      map.addCounter(tloc, target2)
      const target3 = new Unit(testRTank)
      target3.id = "target3"
      map.addCounter(tloc, target3)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.doneSelect).toBe(true)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(target2.targetSelected).toBe(true)
      expect(target3.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing2"]), target, tloc, false, [false])
      expect(fp.fp).toBe(4)
      expect(fp.why.length).toBe(1)
      expect(baseToHit(fp.fp)).toBe(17)

      const fp2 = firepower(game, makeAction(game, ["firing2"]), target3, tloc, false, [false])
      expect(fp2.fp).toBe(4)
      expect(fp2.why.length).toBe(1)
      expect(baseToHit(fp2.fp)).toBe(17)

      const mult = rangeMultiplier(map, makeAction(game, ["firing2"])[0].counter, tloc, false, false)
      expect(mult.mult).toBe(3)
      expect(mult.why.length).toBe(1)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([
        { unit: target, from: [floc], to: tloc, incendiary: true },
        { unit: target2, from: [floc], to: tloc, incendiary: true },
      ])
      expect(target3.isWreck).toBe(true)
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[2].description).toBe(
        "penetration roll for T-34 M40 (2d10): target 17, rolled 20: succeeded, vehicle destroyed"
      )

      const all = map.allUnits
      expect(all.length).toBe(4)
      expect(all[0].unit.id).toBe("target1")
      expect(all[1].unit.id).toBe("target2")
      expect(all[2].unit.id).toBe("target3")
      expect(all[3].unit.id).toBe("firing1")
      expect(all[3].children.length).toBe(0)

      expect(game.eliminatedUnits[0].id).toBe("firing2")
      expect((game.eliminatedUnits[0] as Unit).parent).toBe(undefined)
    })

    test("destroying vehicle breaks children", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGTruck)
      firing.id = "firing1"
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGGun)
      firing2.id = "firing2"
      map.addCounter(floc, firing2)
      const firing3 = new Unit(testGInf)
      firing3.id = "firing3"
      map.addCounter(floc, firing3)
      const firing4 = new Unit(testGMG)
      firing4.id = "firing4"
      map.addCounter(floc, firing4)
      organizeStacks(map)

      map.eliminateCounter(floc, "firing1")

      const all = map.allUnits
      expect(all.length).toBe(3)
      expect(all[0].unit.id).toBe("firing2")
      expect(all[0].unit.jammed).toBe(false)
      expect(all[0].unit.status).toBe(unitStatus.Normal)
      expect(all[0].unit.parent).toBe(undefined)
      expect(all[1].unit.id).toBe("firing3")
      expect(all[1].unit.status).toBe(unitStatus.Broken)
      expect(all[0].unit.parent).toBe(undefined)
      expect(all[2].unit.id).toBe("firing4")
      expect(all[2].unit.jammed).toBe(false)
      expect(all[2].unit.status).toBe(unitStatus.Normal)
      expect(all[0].unit.parent).toBe(undefined)

      expect(game.eliminatedUnits[0].id).toBe("firing1")
      expect((game.eliminatedUnits[0] as Unit).children.length).toBe(0)
    })

    test("eliminated infantry drops weapon", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGMC)
      firing2.id = "firing2"
      map.addCounter(floc, firing2)
      organizeStacks(map)

      map.eliminateCounter(floc, "firing1")

      const all = map.allUnits
      expect(all.length).toBe(1)
      expect(all[0].unit.id).toBe("firing2")
      expect(all[0].unit.jammed).toBe(false)
      expect(all[0].unit.status).toBe(unitStatus.Normal)
      expect(all[0].unit.parent).toBe(undefined)

      expect(game.eliminatedUnits[0].id).toBe("firing1")
      expect((game.eliminatedUnits[0] as Unit).children.length).toBe(0)
    })

    test("ranged vehicle breakdown roll", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGTank)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRTank)
      target.id = "target1"
      const tloc = new Coordinate(4, 2)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.01)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([])
      expect(target.isWreck).toBe(false)
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[0].description).toBe(
        "targeting roll (d10x10): target 3, rolled 1: miss, firing weapon broken"
      )

      const all = map.allUnits
      expect(all.length).toBe(2)
      expect(all[0].unit.id).toBe("target1") // Wreck
      expect(all[1].unit.id).toBe("firing1")
      expect(all[1].unit.jammed).toBe(true)
      expect(all[1].unit.weaponDestroyed).toBe(false)

      expect(game.eliminatedUnits.length).toBe(0)
    })

    test("ranged vehicle breakdown destroys roll", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGTank)
      firing.id = "firing1"
      firing.breakDestroysWeapon = true
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRTank)
      target.id = "target1"
      const tloc = new Coordinate(4, 2)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.01)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([])
      expect(target.isWreck).toBe(false)
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[0].description).toBe(
        "targeting roll (d10x10): target 3, rolled 1: miss, firing weapon destroyed"
      )

      const all = map.allUnits
      expect(all.length).toBe(2)
      expect(all[0].unit.id).toBe("target1") // Wreck
      expect(all[1].unit.id).toBe("firing1")
      expect(all[1].unit.jammed).toBe(false)
      expect(all[1].unit.weaponDestroyed).toBe(true)

      expect(game.eliminatedUnits.length).toBe(0)
    })

    test("ranged fire against infantry", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGTank)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 2)
      map.addCounter(tloc, target)
      const target2 = new Unit(testRInf)
      target2.id = "target2"
      map.addCounter(tloc, target2)
      const target3 = new Unit(testRTank)
      target3.id = "target3"
      map.addCounter(tloc, target3)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.doneSelect).toBe(true)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(target2.targetSelected).toBe(true)
      expect(target3.targetSelected).toBe(false)
      expect(fire.doneSelect).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false, [false])
      expect(fp.fp).toBe(4)
      expect(fp.why.length).toBe(2)
      expect(fp.why[1]).toBe("- halved: antitank vs. soft target")
      expect(baseToHit(fp.fp)).toBe(17)

      const mult = rangeMultiplier(map, makeAction(game, ["firing1"])[0].counter, tloc, false, false)
      expect(mult.mult).toBe(3)
      expect(mult.why.length).toBe(1)
      const mods = armorHitModifiers(game, firing, target3, floc, tloc, false)
      expect(mods.mod).toBe(-1)
      expect(mods.why.length).toBe(1)
      expect(mods.why[0]).toBe("- minus 1 for point-blank range")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([
        { unit: target, from: [floc], to: tloc, incendiary: false },
        { unit: target2, from: [floc], to: tloc, incendiary: false },
      ])
      expect(target3.isWreck).toBe(false)
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[1].description).toBe(
        "roll for effect (2d10): target 17, rolled 20: hit"
      )

      const all = map.allUnits
      expect(all.length).toBe(4)
      expect(all[0].unit.id).toBe("target1")
      expect(all[1].unit.id).toBe("target2")
      expect(all[2].unit.id).toBe("target3")
      expect(all[3].unit.id).toBe("firing1")

      expect(game.eliminatedUnits.length).toBe(0)
    })

    test("ranged fire against armored vehicle", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGTank)
      firing.id = "firing1"
      firing.turretFacing = 4
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRTank)
      target.id = "target1"
      const tloc = new Coordinate(4, 2)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.doneSelect).toBe(true)

      game.fireState.rotate(1)
      game.fireState.rotate(4) // rotate to original rotation

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false, [false])
      expect(fp.fp).toBe(8)
      expect(fp.why.length).toBe(1)
      expect(baseToHit(fp.fp)).toBe(14)

      const mult = rangeMultiplier(map, makeAction(game, ["firing1"])[0].counter, tloc, false, false)
      expect(mult.mult).toBe(3)
      expect(mult.why.length).toBe(1)
      const mods = armorHitModifiers(game, firing, target, floc, tloc, false)
      expect(mods.mod).toBe(-1)
      expect(mods.why.length).toBe(1)
      expect(mods.why[0]).toBe("- minus 1 for point-blank range")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([])
      expect(target.isWreck).toBe(true)
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[0].description).toBe(
        "targeting roll (d10x10): target 3, rolled 100: hit"
      )
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[2].description).toBe(
        "penetration roll (2d10): target 16, rolled 20: succeeded, vehicle destroyed"
      )

      const all = map.allUnits
      expect(all.length).toBe(2)
      expect(all[0].unit.id).toBe("target1") // Wreck
      expect(all[1].unit.id).toBe("firing1")

      expect(game.eliminatedUnits.length).toBe(0)
    })

    test("ranged fire against unarmored vehicle", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGTank)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRTruck)
      target.id = "target1"
      const tloc = new Coordinate(4, 2)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.doneSelect).toBe(true)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      const mult = rangeMultiplier(map, makeAction(game, ["firing1"])[0].counter, tloc, false, false)
      expect(mult.mult).toBe(3)
      expect(mult.why.length).toBe(1)
      const mods = armorHitModifiers(game, firing, target, floc, tloc, false)
      expect(mods.mod).toBe(-1)
      expect(mods.why.length).toBe(1)
      expect(mods.why[0]).toBe("- minus 1 for point-blank range")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([])
      expect(target.isWreck).toBe(true)
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[0].description).toBe(
        "targeting roll (d10x10): target 3, rolled 100: hit, vehicle destroyed"
      )

      const all = map.allUnits
      expect(all.length).toBe(2)
      expect(all[0].unit.id).toBe("target1") // Wreck
      expect(all[1].unit.id).toBe("firing1")

      expect(game.eliminatedUnits.length).toBe(0)
    })

    test("ranged fire after moving turret", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGTank)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRTank)
      target.id = "target1"
      const tloc = new Coordinate(4, 2)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.doneSelect).toBe(true)
      game.fireState.rotate(4)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false, [false])
      expect(fp.fp).toBe(8)
      expect(fp.why.length).toBe(1)
      expect(baseToHit(fp.fp)).toBe(14)

      const mult = rangeMultiplier(map, makeAction(game, ["firing1"])[0].counter, tloc, false, true)
      expect(mult.mult).toBe(4)
      expect(mult.why.length).toBe(2)
      expect(mult.why[1]).toBe("- plus 1 for moving the turret")
      const mods = armorHitModifiers(game, firing, target, floc, tloc, false)
      expect(mods.mod).toBe(-1)
      expect(mods.why.length).toBe(1)
      expect(mods.why[0]).toBe("- minus 1 for point-blank range")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([])
      expect(target.isWreck).toBe(true)
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[0].description).toBe(
        "targeting roll (d10x10): target 4, rolled 100: hit"
      )

      const all = map.allUnits
      expect(all.length).toBe(2)
      expect(all[0].unit.id).toBe("target1") // Wreck
      expect(all[1].unit.id).toBe("firing1")

      expect(game.eliminatedUnits.length).toBe(0)
    })

    test("vehicle machine gun", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGAC)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 2)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.doneSelect).toBe(true)
      game.fireState.rotate(4)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false, [false])
      expect(fp.fp).toBe(8)
      expect(fp.why.length).toBe(1)
      expect(baseToHit(fp.fp)).toBe(14)
      const mods = untargetedModifiers(
        game, makeAction(game, ["firing1"]), makeAction(game, ["target1"]),
        game.fireState.path as GameActionPath[]
      )
      expect(mods.mod).toBe(0)
      expect(mods.why.length).toBe(2)
      expect(mods.why[0]).toBe("- minus 1 for adjacent")
      expect(mods.why[1]).toBe("- plus 1 for moving the turret")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([
        { unit: target, from: [floc], to: tloc, incendiary: false },
      ])
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[0].description).toBe(
        "hit roll (2d10): target 14, rolled 20: hit"
      )

      const all = map.allUnits
      expect(all.length).toBe(2)
      expect(all[0].unit.id).toBe("target1")
      expect(all[1].unit.id).toBe("firing1")

      expect(game.eliminatedUnits.length).toBe(0)
    })

    test("can't fire from tranpsort", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGTruck)
      firing2.id = "firing2"
      map.addCounter(floc, firing2)
      const firing3 = new Unit(testGGun)
      firing3.id = "firing3"
      map.addCounter(floc, firing3)
      const firing4 = new Unit(testGInf)
      firing4.id = "firing4"
      map.addCounter(floc, firing4)
      const firing5 = new Unit(testGMG)
      firing5.id = "firing5"
      map.addCounter(floc, firing5)
      const firing6 = new Unit(testGLdr)
      firing6.id = "firing6"
      firing6.select()
      map.addCounter(floc, firing6)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.doneSelect).toBe(false)

      select(map, {
        counter: map.countersAt(floc)[1],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing2.selected).toBe(false)
      expect(game.messageQueue[0]).toBe("vehicles cannot fire with other units")

      select(map, {
        counter: map.countersAt(floc)[2],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing3.selected).toBe(false)
      expect(game.messageQueue[1]).toBe("targeted weapons cannot fire with other units")

      select(map, {
        counter: map.countersAt(floc)[3],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing4.selected).toBe(false)
      expect(game.messageQueue[2]).toBe("unit being transported cannot fire with other units")

      select(map, {
        counter: map.countersAt(floc)[4],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing5.selected).toBe(false)
      expect(game.messageQueue[3]).toBe("unit being transported cannot fire with other units")
    })

    test("firing with sponson", () => {
      const game = createFireGame()
      expect(game.scenario.axisFactions).toStrictEqual(["ger"])
      game.scenario.axisFactions = ["ita"]
      expect(game.scenario.axisFactions).toStrictEqual(["ita"])
      const map = game.scenario.map
      const firing = new Unit(testITank)
      firing.id = "firing1"
      firing.facing = 4
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRTank)
      target.id = "target1"
      const tloc = new Coordinate(4, 2)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      game.fireState.sponsonToggle()

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, true, [false])
      expect(fp.fp).toBe(8)
      expect(fp.why.length).toBe(1)
      expect(baseToHit(fp.fp)).toBe(14)

      const mult = rangeMultiplier(map, makeAction(game, ["firing1"])[0].counter, tloc, true, false)
      expect(mult.mult).toBe(3)
      expect(mult.why.length).toBe(1)
      const mods = armorHitModifiers(game, firing, target, floc, tloc, false)
      expect(mods.mod).toBe(-1)
      expect(mods.why.length).toBe(1)
      expect(mods.why[0]).toBe("- minus 1 for point-blank range")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([])
      expect(target.isWreck).toBe(true)
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[0].description).toBe(
        "targeting roll (d10x10): target 3, rolled 100: hit"
      )
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[1].description).toBe(
        "hit location roll (d10): 10 (hull)"
      )
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[2].description).toBe(
        "penetration roll (2d10): target 16, rolled 20: succeeded, vehicle destroyed"
      )

      const all = map.allUnits
      expect(all.length).toBe(2)
      expect(all[0].unit.id).toBe("target1") // Wreck
      expect(all[1].unit.id).toBe("firing1")

      expect(game.eliminatedUnits.length).toBe(0)
    })

    test("sponson breakdown roll", () => {
      const game = createFireGame()
      expect(game.scenario.axisFactions).toStrictEqual(["ger"])
      game.scenario.axisFactions = ["ita"]
      expect(game.scenario.axisFactions).toStrictEqual(["ita"])
      const map = game.scenario.map
      const firing = new Unit(testITank)
      firing.id = "firing1"
      firing.facing = 4
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRTank)
      target.id = "target1"
      const tloc = new Coordinate(4, 2)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      game.fireState.sponsonToggle()

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, true, [false])
      expect(fp.fp).toBe(8)
      expect(fp.why.length).toBe(1)
      expect(baseToHit(fp.fp)).toBe(14)

      const mult = rangeMultiplier(map, makeAction(game, ["firing1"])[0].counter, tloc, true, false)
      expect(mult.mult).toBe(3)
      expect(mult.why.length).toBe(1)
      const mods = armorHitModifiers(game, firing, target, floc, tloc, false)
      expect(mods.mod).toBe(-1)
      expect(mods.why.length).toBe(1)
      expect(mods.why[0]).toBe("- minus 1 for point-blank range")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.01)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([])
      expect(target.isWreck).toBe(false)
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[0].description).toBe(
        "targeting roll (d10x10): target 3, rolled 1: miss, firing weapon broken"
      )

      const all = map.allUnits
      expect(all.length).toBe(2)
      expect(all[0].unit.id).toBe("target1")
      expect(all[1].unit.id).toBe("firing1")
      expect(all[1].unit.sponsonJammed).toBe(true)
      expect(all[1].unit.sponsonDestroyed).toBe(false)
    })

    test("sponson breakdown destroy roll", () => {
      const game = createFireGame()
      expect(game.scenario.axisFactions).toStrictEqual(["ger"])
      game.scenario.axisFactions = ["ita"]
      expect(game.scenario.axisFactions).toStrictEqual(["ita"])
      const map = game.scenario.map
      const firing = new Unit(testITank)
      firing.id = "firing1"
      firing.facing = 4
      firing.sponson = { firepower: 24, range: 1, type: sponsonType.Flame }
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testGInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 2)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      game.fireState.sponsonToggle()

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, true, [false])
      expect(fp.fp).toBe(24)
      expect(fp.why.length).toBe(1)
      expect(baseToHit(fp.fp)).toBe(9)

      const mult = rangeMultiplier(map, makeAction(game, ["firing1"])[0].counter, tloc, true, false)
      expect(mult.mult).toBe(3)
      expect(mult.why.length).toBe(1)
      const mods = armorHitModifiers(game, firing, target, floc, tloc, false)
      expect(mods.mod).toBe(-1)
      expect(mods.why.length).toBe(1)
      expect(mods.why[0]).toBe("- minus 1 for point-blank range")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.01)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([])
      expect(target.isWreck).toBe(false)
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[0].description).toBe(
        "hit roll (2d10): target 8, rolled 2: miss, firing weapon destroyed"
      )

      const all = map.allUnits
      expect(all.length).toBe(2)
      expect(all[0].unit.id).toBe("target1")
      expect(all[1].unit.id).toBe("firing1")
      expect(all[1].unit.sponsonJammed).toBe(false)
      expect(all[1].unit.sponsonDestroyed).toBe(true)
    })

    test("firing from wire", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGTank)
      firing.id = "firing1"
      firing.turretFacing = 4
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const wire = new Feature(testWire)
      wire.id = "wire1"
      map.addCounter(floc, wire)

      const target = new Unit(testRTank)
      target.id = "target1"
      const tloc = new Coordinate(4, 2)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false, [true])
      expect(fp.fp).toBe(4)
      expect(fp.why.length).toBe(1)
      expect(baseToHit(fp.fp)).toBe(17)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([])
      expect(target.isWreck).toBe(true)
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[0].description).toBe(
        "targeting roll (d10x10): target 3, rolled 100: hit"
      )
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[2].description).toBe(
        "penetration roll (2d10): target 19, rolled 20: succeeded, vehicle destroyed"
      )

      const all = map.allUnits
      expect(all.length).toBe(2)
      expect(all[0].unit.id).toBe("target1") // Wreck
      expect(all[1].unit.id).toBe("firing1")

      expect(game.eliminatedUnits.length).toBe(0)
    })

    test("intensive infantry fire", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.status = unitStatus.Activated
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)
      const firing2 = new Unit(testGMG)
      firing2.id = "firing2"
      firing2.status = unitStatus.Activated
      map.addCounter(floc, firing2)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
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
      const fp = firepower(game, makeAction(game, firingIDs), target, tloc, false, [false])
      expect(fp.fp).toBe(17)
      expect(baseToHit(fp.fp)).toBe(11)
      expect(fireHindrance(game, makeAction(game, firingIDs), tloc)).toBe(0)
      const mods = untargetedModifiers(
        game, makeAction(game, firingIDs), makeAction(game, ["target1"]),
        game.fireState.path as GameActionPath[]
      )
      expect(mods.mod).toBe(2)
      expect(mods.why.length).toBe(1)
      expect(mods.why[0]).toBe("- plus 2 intensive fire")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual(
        [{ unit: target, from: [floc], to: tloc, incendiary: false }]
      )

      const all = map.allUnits
      expect(all.length).toBe(3)
      expect(all[0].unit.id).toBe("target1")
      expect(all[1].unit.id).toBe("firing1")
      expect(all[1].unit.status).toBe(unitStatus.Exhausted)
      expect(all[2].unit.id).toBe("firing2")
      expect(all[2].unit.status).toBe(unitStatus.Exhausted)

      expect(game.eliminatedUnits.length).toBe(0)
    })

    test("intensive ranged fire", () => {
      const game = createFireGame()
      const map = game.scenario.map
      const firing = new Unit(testGTank)
      firing.id = "firing1"
      firing.turretFacing = 4
      firing.status = unitStatus.Activated
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRTank)
      target.id = "target1"
      const tloc = new Coordinate(4, 2)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      const fire = game.gameState as FireState
      expect(fire.doneSelect).toBe(true)

      game.fireState.rotate(1)
      game.fireState.rotate(4) // rotate to original rotation

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)
      expect(fire.doneSelect).toBe(true)

      const fp = firepower(game, makeAction(game, ["firing1"]), target, tloc, false, [false])
      expect(fp.fp).toBe(8)
      expect(fp.why.length).toBe(1)
      expect(baseToHit(fp.fp)).toBe(14)

      const mult = rangeMultiplier(map, makeAction(game, ["firing1"])[0].counter, tloc, false, false)
      expect(mult.mult).toBe(4)
      expect(mult.why.length).toBe(2)
      expect(mult.why[1]).toBe("- plus 1 for intensive fire")
      const mods = armorHitModifiers(game, firing, target, floc, tloc, false)
      expect(mods.mod).toBe(-1)
      expect(mods.why.length).toBe(1)
      expect(mods.why[0]).toBe("- minus 1 for point-blank range")

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.moraleChecksNeeded).toStrictEqual([])
      expect(target.isWreck).toBe(true)
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[0].description).toBe(
        "targeting roll (d10x10): target 4, rolled 100: hit"
      )
      expect((game.lastAction?.data.dice_result as GameActionDiceResult[])[2].description).toBe(
        "penetration roll (2d10): target 16, rolled 20: succeeded, vehicle destroyed"
      )

      const all = map.allUnits
      expect(all.length).toBe(2)
      expect(all[0].unit.id).toBe("target1") // Wreck
      expect(all[1].unit.id).toBe("firing1")
      expect(all[1].unit.status).toBe(unitStatus.Exhausted)

      expect(game.eliminatedUnits.length).toBe(0)
    })

    test("infantry fire triggers sniper", () => {
      const game = createFireGame()
      game.alliedSniper = new Feature({
        t: featureType.Sniper, n: "Sniper", i: "sniper", f: 3, o: { q: 1 }, ft: 1
      })
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

      game.gameState = new FireState(game, false)

      select(map, {
        counter: map.countersAt(floc)[1],
        target: { type: "map", xy: floc }
      }, () => {})
      expect(firing2.selected).toBe(true)

      select(map, {
        counter: map.countersAt(floc2)[0],
        target: { type: "map", xy: floc2 }
      }, () => {})
      expect(firing3.selected).toBe(true)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.sniperNeeded).toStrictEqual([
        {unit: firing, loc: floc }, { unit: firing2, loc: floc }, { unit: firing3, loc: floc2 }
      ])
    })

    test("same nation sniper doesn't trigger", () => {
      const game = createFireGame()
      game.axisSniper = new Feature({
        t: featureType.Sniper, n: "Sniper", i: "sniper", f: 3, o: { q: 1 }, ft: 1
      })
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
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.sniperNeeded).toStrictEqual([])
    })

    test("vehicle doesn't trigger sniper", () => {
      const game = createFireGame()
      game.alliedSniper = new Feature({
        t: featureType.Sniper, n: "Sniper", i: "sniper", f: 3, o: { q: 1 }, ft: 1
      })
      const map = game.scenario.map
      const firing = new Unit(testGTank)
      firing.id = "firing1"
      firing.select()
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      const target = new Unit(testRInf)
      target.id = "target1"
      const tloc = new Coordinate(4, 0)
      map.addCounter(tloc, target)
      organizeStacks(map)

      game.gameState = new FireState(game, false)

      select(map, {
        counter: map.countersAt(tloc)[0],
        target: { type: "map", xy: tloc }
      }, () => {})
      expect(target.targetSelected).toBe(true)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState.finish()
      Math.random = original

      expect(game.sniperNeeded).toStrictEqual([])
    })
  })
})
