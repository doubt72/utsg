import { Coordinate, featureType, hexOpenType, windType } from "../../utilities/commonTypes"
import Unit from "../Unit"
import { describe, expect, test, vi } from "vitest"
import { movementPastCost } from "./movement"
import {
  createBlankGame, testFire, testGInf, testGMGDecoy, testGSqdDecoy, testMine, testRInf, testRSqdDecoy, testWire,
} from "./testHelpers"
import MoveState from "./state/MoveState"
import actionsAvailable from "./actionsAvailable"
import StackingActionError from "../actions/StackingActionError"
import organizeStacks from "../support/organizeStacks"
import Feature from "../Feature"
import AssaultState from "./state/AssaultState"
import FireState from "./state/FireState"
import select from "./select"
import SniperState from "./state/SniperState"
import FireCheckState from "./state/FireCheckState"
import RoutState from "./state/RoutState"

describe("decoy", () => {
  describe("decoy actions", () => {
    test("movement", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      map.victoryHexes.push({x: 1, y: 2, player: 1})

      const mines = new Feature(testMine)
      mines.id = "mines"
      map.addCounter(new Coordinate(2, 1), mines)
      const wire = new Feature(testWire)
      wire.id = "wire"
      map.addCounter(new Coordinate(2, 3), wire)

      const decoy = new Unit(testGSqdDecoy)
      decoy.id = "decoy"
      map.addCounter(new Coordinate(2, 2), decoy)
      map.select(decoy)

      expect(actionsAvailable(game, "two")).toStrictEqual(
        [
          { type: "move" },
          { type: "assault_move" },
          { type: "unselect" },
        ]
      )

      game.setGameState(new MoveState(game))

      expect(actionsAvailable(game, "two")).toStrictEqual(
        [
          { type: "none", message: "select hex to move" },
          { type: "cancel_action" },
        ]
      )

      expect(game.moveState.openHex(3, 2)).toBe(1)
      expect(game.moveState.openHex(1, 2)).toBe(hexOpenType.Closed)
      expect(game.moveState.openHex(2, 1)).toBe(hexOpenType.Closed)
      expect(game.moveState.openHex(2, 3)).toBe(hexOpenType.All)

      game.moveState.move(3, 2)
      expect(movementPastCost(map, decoy)).toBe(1)
      expect(actionsAvailable(game, "two")).toStrictEqual(
        [
          { type: "none", message: "select hex to move" },
          { type: "move_finish" },
          { type: "move_undo" },
          { type: "cancel_action" },
        ]
      )
      expect(game.moveState.openHex(4, 2)).toBe(1)
      expect(game.moveState.openHex(2, 1)).toBe(hexOpenType.Closed)
      expect(game.moveState.openHex(2, 3)).toBe(hexOpenType.All)
    })

    test("movement with weapons", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      map.victoryHexes.push({x: 1, y: 2, player: 1})

      const decoy = new Unit(testGSqdDecoy)
      decoy.id = "decoy"
      map.addCounter(new Coordinate(2, 2), decoy)
      const decoy2 = new Unit(testGMGDecoy)
      decoy2.id = "decoy2"
      map.addCounter(new Coordinate(2, 2), decoy2)
      organizeStacks(map)
      map.select(decoy)

      expect(actionsAvailable(game, "two")).toStrictEqual(
        [
          { type: "move" },
          { type: "assault_move" },
          { type: "unselect" },
        ]
      )
      expect(decoy.children[0].name).toBe("weapon")

      game.setGameState(new MoveState(game))

      expect(actionsAvailable(game, "two")).toStrictEqual(
        [
          { type: "none", message: "select hex to move" },
          { type: "cancel_action" },
        ]
      )

      game.moveState.move(3, 2)
      expect(movementPastCost(map, decoy)).toBe(1)
      expect(actionsAvailable(game, "two")).toStrictEqual(
        [
          { type: "none", message: "select hex to move" },
          { type: "move_finish" },
          { type: "move_undo" },
          { type: "cancel_action" },
        ]
      )
    })

    test("movement with weapons 2", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      map.victoryHexes.push({x: 1, y: 2, player: 1})

      const decoy = new Unit(testGSqdDecoy)
      decoy.id = "decoy"
      map.addCounter(new Coordinate(2, 2), decoy)
      const decoy2 = new Unit(testGMGDecoy)
      decoy2.id = "decoy2"
      try {
        map.addCounter(new Coordinate(3, 2), decoy2)
      } catch(err) {
        // Warning expected for placing a unit by itself
        expect(err instanceof StackingActionError).toBe(true)
      }
      organizeStacks(map)
      map.select(decoy)

      expect(actionsAvailable(game, "two")).toStrictEqual(
        [
          { type: "move" },
          { type: "assault_move" },
          { type: "unselect" },
        ]
      )

      game.setGameState(new MoveState(game))

      expect(actionsAvailable(game, "two")).toStrictEqual(
        [
          { type: "none", message: "select hex to move" },
          { type: "cancel_action" },
        ]
      )

      game.moveState.move(3, 2)
      expect(movementPastCost(map, decoy)).toBe(1)
      expect(actionsAvailable(game, "two")).toStrictEqual(
        [
          { type: "none", message: "select hex to move" },
          { type: "move_finish" },
          { type: "move_undo" },
          { type: "cancel_action" },
        ]
      )
    })

    test("assault", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      map.victoryHexes.push({x: 1, y: 2, player: 1})

      const mines = new Feature(testMine)
      mines.id = "mines"
      map.addCounter(new Coordinate(2, 1), mines)
      const wire = new Feature(testWire)
      wire.id = "wire"
      map.addCounter(new Coordinate(2, 3), wire)

      const decoy = new Unit(testGSqdDecoy)
      decoy.id = "decoy"
      map.addCounter(new Coordinate(2, 2), decoy)
      map.select(decoy)

      expect(actionsAvailable(game, "two")).toStrictEqual(
        [
          { type: "move" },
          { type: "assault_move" },
          { type: "unselect" },
        ]
      )

      game.setGameState(new AssaultState(game))

      expect(actionsAvailable(game, "two")).toStrictEqual(
        [
          { type: "none", message: "select hex to move" },
          { type: "cancel_action" },
        ]
      )

      expect(game.assaultState.openHex(3, 2)).toBe(hexOpenType.All)
      expect(game.assaultState.openHex(1, 2)).toBe(hexOpenType.Closed)
      expect(game.assaultState.openHex(2, 1)).toBe(hexOpenType.All)
      expect(game.assaultState.openHex(2, 3)).toBe(hexOpenType.All)

      game.assaultState.move(3, 2)
      expect(movementPastCost(map, decoy)).toBe(1)
      expect(actionsAvailable(game, "two")).toStrictEqual(
        [
          { type: "none", message: "select hex to move" },
          { type: "assault_move_finish" },
          { type: "cancel_action" },
        ]
      )
    })
  })

  describe("units observed", () => {
    test("observing decoy removes decoy", () => {
      const game = createBlankGame()
      game.scenario.map.victoryHexes = []
      const map = game.scenario.map

      const decoy = new Unit(testRSqdDecoy)
      decoy.id = "decoy"
      map.addCounter(new Coordinate(4, 2), decoy)

      const unit = new Unit(testGInf)
      unit.id = "unit"
      map.addCounter(new Coordinate(2, 2), unit)
      map.select(unit)

      game.setGameState(new MoveState(game))
      game.moveState.move(3, 2)
      game.gameState?.finish()

      expect(game.actions[0].stringValue).toBe("German Rifle moved from C3 to D3")
      expect(game.actions[1].stringValue).toBe("Soviet decoy squad removed at E3")

      expect(map.allCounters.length).toBe(1)
      expect(map.allCounters[0].unit.name).toBe("Rifle")
      expect(game.eliminatedUnits.length).toBe(1)
      expect(game.eliminatedUnits[0].name).toBe("squad")
      expect(game.playerOneScore).toBe(0)
      expect(game.playerTwoScore).toBe(0)
    })

    test("moving next to friendly unit has no effect", () => {
      const game = createBlankGame()
      game.scenario.map.victoryHexes = []
      const map = game.scenario.map

      const decoy = new Unit(testGSqdDecoy)
      decoy.id = "decoy"
      map.addCounter(new Coordinate(4, 2), decoy)

      const unit = new Unit(testGInf)
      unit.id = "unit"
      map.addCounter(new Coordinate(2, 2), unit)
      map.select(unit)

      game.setGameState(new MoveState(game))
      game.moveState.move(3, 2)
      game.gameState?.finish()

      expect(game.actions.length).toBe(1)
      expect(game.actions[0].stringValue).toBe("German Rifle moved from C3 to D3")

      expect(map.allCounters.length).toBe(2)
      expect(map.allCounters[0].unit.name).toBe("squad")
      expect(map.allCounters[1].unit.name).toBe("Rifle")
      expect(game.eliminatedUnits.length).toBe(0)
    })

    test("moving by unobserved unit", () => {
      const game = createBlankGame()
      game.scenario.map.victoryHexes = []
      const map = game.scenario.map

      const enemy = new Unit(testRInf)
      enemy.id = "enemy"
      enemy.observed = false
      map.addCounter(new Coordinate(4, 2), enemy)

      const unit = new Unit(testGInf)
      unit.id = "unit"
      map.addCounter(new Coordinate(2, 2), unit)
      map.select(unit)

      game.setGameState(new MoveState(game))
      game.moveState.move(3, 2)
      game.gameState?.finish()

      expect(game.actions[0].stringValue).toBe("German Rifle moved from C3 to D3")
      expect(game.actions[1].stringValue).toBe("Soviet unit Rifle observed at E3")

      expect(map.allCounters.length).toBe(2)
      expect(map.allCounters[0].unit.name).toBe("Rifle")
      expect(map.allCounters[0].unit.observed).toBe(true)
      expect(map.allCounters[1].unit.name).toBe("Rifle")
      expect(map.allCounters[1].unit.observed).toBe(true)
      expect(game.eliminatedUnits.length).toBe(0)
    })

    test("assault moving next to unobserved unit", () => {
      const game = createBlankGame()
      game.scenario.map.victoryHexes = []
      const map = game.scenario.map

      const enemy = new Unit(testRInf)
      enemy.id = "enemy"
      enemy.observed = false
      map.addCounter(new Coordinate(4, 2), enemy)

      const unit = new Unit(testGInf)
      unit.id = "unit"
      map.addCounter(new Coordinate(2, 2), unit)
      map.select(unit)

      game.setGameState(new AssaultState(game))
      game.assaultState.move(3, 2)
      game.gameState?.finish()

      expect(game.actions[0].stringValue).toBe("German Rifle assault moved from C3 to D3")
      expect(game.actions[1].stringValue).toBe("Soviet unit Rifle observed at E3")

      expect(map.allCounters.length).toBe(2)
      expect(map.allCounters[0].unit.name).toBe("Rifle")
      expect(map.allCounters[0].unit.observed).toBe(true)
      expect(map.allCounters[1].unit.name).toBe("Rifle")
      expect(map.allCounters[1].unit.observed).toBe(true)
      expect(game.eliminatedUnits.length).toBe(0)
    })

    test("unit routs by unobserved unit", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      const unit = new Unit(testGInf)
      unit.break(game)
      unit.id = "test1"
      const loc = new Coordinate(0, 2)
      game.routNeeded.push({ unit, loc })
      map.addCounter(loc, unit)
      organizeStacks(map)

      const enemy = new Unit(testRSqdDecoy)
      enemy.id = "decoy"
      enemy.observed = false
      map.addCounter(new Coordinate(4, 1), enemy)

      game.setGameState(new RoutState(game, true))
      game.routState.finishXY(4, 2)

      expect(game.actions[0].stringValue).toBe("German Rifle at A3 routs  to E3")
      expect(game.actions[1].stringValue).toBe("Soviet decoy squad removed at E2")
    })

    test("unobserved unit moves next to unit", () => {
      const game = createBlankGame()
      game.scenario.map.victoryHexes = []
      const map = game.scenario.map

      const enemy = new Unit(testRInf)
      enemy.id = "enemy"
      map.addCounter(new Coordinate(4, 2), enemy)

      const unit = new Unit(testGInf)
      unit.id = "unit"
      unit.observed = false
      map.addCounter(new Coordinate(2, 2), unit)
      map.select(unit)

      game.setGameState(new MoveState(game))
      game.moveState.move(3, 2)
      game.gameState?.finish()

      expect(game.actions[0].stringValue).toBe("German squad moved from C3 to D3")
      expect(game.actions[1].stringValue).toBe("German unit Rifle observed at D3")

      expect(map.allCounters.length).toBe(2)
      expect(map.allCounters[0].unit.name).toBe("Rifle")
      expect(map.allCounters[0].unit.observed).toBe(true)
      expect(map.allCounters[1].unit.name).toBe("Rifle")
      expect(map.allCounters[1].unit.observed).toBe(true)
      expect(game.eliminatedUnits.length).toBe(0)
    })

    test("unobserved unit moves next to decoy", () => {
      const game = createBlankGame()
      game.scenario.map.victoryHexes = []
      const map = game.scenario.map

      const decoy = new Unit(testRSqdDecoy)
      decoy.id = "decoy"
      map.addCounter(new Coordinate(4, 2), decoy)

      const unit = new Unit(testGInf)
      unit.id = "unit"
      unit.observed = false
      map.addCounter(new Coordinate(2, 2), unit)
      map.select(unit)

      game.setGameState(new MoveState(game))
      game.moveState.move(3, 2)
      game.gameState?.finish()

      expect(game.actions[0].stringValue).toBe("German squad moved from C3 to D3")
      expect(game.actions[1].stringValue).toBe("Soviet decoy squad removed at E3")
      expect(game.actions[2].stringValue).toBe("German unit Rifle observed at D3")

      expect(map.allCounters.length).toBe(1)
      expect(map.allCounters[0].unit.name).toBe("Rifle")
      expect(game.eliminatedUnits.length).toBe(1)
      expect(game.eliminatedUnits[0].name).toBe("squad")
      expect(game.playerOneScore).toBe(0)
      expect(game.playerTwoScore).toBe(0)
    })

    test("unobserved unit fires", () => {
      const game = createBlankGame()
      game.scenario.map.victoryHexes = []
      const map = game.scenario.map

      const enemy = new Unit(testRInf)
      enemy.id = "enemy"
      const eloc = new Coordinate(4, 2)
      map.addCounter(eloc, enemy)

      const unit = new Unit(testGInf)
      unit.id = "unit"
      unit.observed = false
      map.addCounter(new Coordinate(2, 2), unit)
      map.select(unit)

      game.setGameState(new FireState(game, false))
      select(map, {
        counter: map.countersAt(eloc)[0],
        target: { type: "map", xy: eloc }
      }, () => {})
      expect(enemy.targetSelected).toBe(true)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.01)
      game.gameState?.finish()
      Math.random = original

      expect(game.actions[0].stringValue).toBe(
        "German squad at C3 fired at Soviet Rifle at E3; target 12, rolled 2 [2d10: 1 + 1]: miss"
      )
      expect(game.actions[1].stringValue).toBe("German unit Rifle observed at C3")

      expect(map.allCounters.length).toBe(2)
      expect(map.allCounters[0].unit.name).toBe("Rifle")
      expect(map.allCounters[0].unit.observed).toBe(true)
      expect(map.allCounters[1].unit.name).toBe("Rifle")
      expect(map.allCounters[1].unit.observed).toBe(true)
      expect(game.eliminatedUnits.length).toBe(0)
    })

    test("fire misses unobserved unit", () => {
      const game = createBlankGame()
      game.scenario.map.victoryHexes = []
      const map = game.scenario.map

      const enemy = new Unit(testRInf)
      enemy.id = "enemy"
      enemy.observed = false
      const eloc = new Coordinate(4, 2)
      map.addCounter(eloc, enemy)

      const unit = new Unit(testGInf)
      unit.id = "unit"
      map.addCounter(new Coordinate(2, 2), unit)
      map.select(unit)

      game.setGameState(new FireState(game, false))
      select(map, {
        counter: map.countersAt(eloc)[0],
        target: { type: "map", xy: eloc }
      }, () => {})
      expect(enemy.targetSelected).toBe(true)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.01)
      game.gameState?.finish()
      Math.random = original

      expect(game.actions.length).toBe(1)
      expect(game.actions[0].stringValue).toBe(
        "German Rifle at C3 fired at Soviet squad at E3; target 12, rolled 2 [2d10: 1 + 1]: miss"
      )

      expect(map.allCounters.length).toBe(2)
      expect(map.allCounters[0].unit.observed).toBe(false)
      expect(map.allCounters[1].unit.observed).toBe(true)
      expect(game.eliminatedUnits.length).toBe(0)
    })

    test("fire hits unobserved unit", () => {
      const game = createBlankGame()
      game.scenario.map.victoryHexes = []
      const map = game.scenario.map

      const enemy = new Unit(testRInf)
      enemy.id = "enemy"
      enemy.observed = false
      const eloc = new Coordinate(4, 2)
      map.addCounter(eloc, enemy)

      const unit = new Unit(testGInf)
      unit.id = "unit"
      map.addCounter(new Coordinate(2, 2), unit)
      map.select(unit)

      game.setGameState(new FireState(game, false))
      select(map, {
        counter: map.countersAt(eloc)[0],
        target: { type: "map", xy: eloc }
      }, () => {})
      expect(enemy.targetSelected).toBe(true)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState?.finish()
      Math.random = original

      expect(game.actions[0].stringValue).toBe(
        "German Rifle at C3 fired at Soviet squad at E3; target 12, rolled 20 [2d10: 10 + 10]: critical hit"
      )
      expect(game.actions[1].stringValue).toBe("Soviet unit Rifle observed at E3")

      expect(map.allCounters.length).toBe(2)
      expect(map.allCounters[0].unit.observed).toBe(true)
      expect(map.allCounters[1].unit.observed).toBe(true)
      expect(game.eliminatedUnits.length).toBe(0)
    })

    test("sniper misses unobserved unit", () => {
      const game = createBlankGame()
      game.alliedSniper = new Feature({
        id: "sniper-3", t: featureType.Sniper, n: "Sniper", i: "sniper", f: 0, o: { q: 3 }, ft: 1
      })
      const map = game.scenario.map
      const firing = new Unit(testGInf)
      firing.id = "firing1"
      firing.observed = false
      map.select(firing)
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, firing)

      game.sniperNeeded = [{unit: firing, loc: floc }]

      game.setGameState(new SniperState(game))

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState?.finish()
      Math.random = original

      expect(game.actions.length).toBe(1)
      expect(game.actions[0].stringValue).toBe(
        "Soviet sniper check: target 3, rolled 20 [2d10: 10 + 10], no effect"
      )

      expect(map.allCounters.length).toBe(1)
      expect(map.allCounters[0].unit.name).toBe("Rifle")
      expect(map.allCounters[0].unit.observed).toBe(false)
    })

    test("sniper hits decoy", () => {
      const game = createBlankGame()
      game.alliedSniper = new Feature({
        id: "sniper-3", t: featureType.Sniper, n: "Sniper", i: "sniper", f: 0, o: { q: 3 }, ft: 1
      })
      const map = game.scenario.map
      const decoy = new Unit(testGSqdDecoy)
      decoy.id = "decoy"
      decoy.observed = false
      map.select(decoy)
      const floc = new Coordinate(3, 2)
      map.addCounter(floc, decoy)

      game.sniperNeeded = [{unit: decoy, loc: floc }]

      game.setGameState(new SniperState(game))

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.01)
      game.gameState?.finish()
      Math.random = original

      expect(game.actions[0].stringValue).toBe(
        "Soviet sniper check: target 3, rolled 2 [2d10: 1 + 1], sniper hit"
      )
      expect(game.actions[1].stringValue).toBe("German decoy squad removed at D3")

      expect(map.allCounters.length).toBe(0)
      expect(game.moraleChecksNeeded.length === 0)
    })

    test("unobserved unit captures VP", () => {
      const game = createBlankGame()
      game.scenario.map.victoryHexes = []
      const map = game.scenario.map

      map.victoryHexes.push({x: 3, y: 2, player: 1})

      const unit = new Unit(testGInf)
      unit.id = "unit"
      unit.observed = false
      map.addCounter(new Coordinate(2, 2), unit)
      map.select(unit)

      game.setGameState(new MoveState(game))
      game.moveState.move(3, 2)
      game.gameState?.finish()

      expect(game.actions[0].stringValue).toBe("German squad moved from C3 to D3")
      expect(game.actions[1].stringValue).toBe("German unit Rifle observed at D3")
    })

    test("unobserved unit moves into mines", () => {
      const game = createBlankGame()
      game.scenario.map.victoryHexes = []
      const map = game.scenario.map

      const mine = new Feature(testMine)
      mine.id = "mine"
      map.addCounter(new Coordinate(3, 2), mine)

      const unit = new Unit(testGInf)
      unit.id = "unit"
      unit.observed = false
      map.addCounter(new Coordinate(2, 2), unit)
      map.select(unit)

      game.setGameState(new MoveState(game))
      game.moveState.move(3, 2)
      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState?.finish()
      Math.random = original

      expect(game.actions[0].stringValue).toBe(
        "German squad moved from C3 to D3, mine roll (2d10): target 12, rolled 20 [2d10: 10 + 10], hit"
      )
      expect(game.actions[1].stringValue).toBe("German unit Rifle observed at D3")
    })

    test("blaze starts in hex", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      map.windSpeed = windType.Moderate
      map.windDirection = 4

      const fire = new Feature(testFire)
      fire.id = "fire"
      const loc = new Coordinate(0,0)
      map.addCounter(loc, fire)

      const decoy = new Unit(testRSqdDecoy)
      decoy.id = "decoy"
      map.addCounter(new Coordinate(1,0), decoy)

      game.addFireCheckState()

      const state = game.gameState as FireCheckState

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      state.finish()

      expect(game.actions[0].stringValue).toBe(
        "fire extinguish check for A1: fire goes out on 1 or less, rolled 10 [d10], no effect"
      )

      game.addFireCheckState()

      vi.spyOn(Math, "random").mockReturnValue(0.01)
      state.finish()
      Math.random = original

      expect(game.actions[1].stringValue).toBe(
        "fire spread check for A1: fire spreads on 2 or less, rolled 1 [d10], fire spreads"
      )
      expect(game.actions[2].stringValue).toBe("Soviet decoy squad removed at B1")
    })
  })
});
