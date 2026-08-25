import { Coordinate, hexOpenType } from "../../utilities/commonTypes"
import Unit from "../Unit"
import { describe, expect, test } from "vitest"
import { movementPastCost } from "./movement"
import {
  createBlankGame, testGMGDecoy, testGSqdDecoy, testMine, testWire,
} from "./testHelpers"
import MoveState from "./state/MoveState"
import actionsAvailable from "./actionsAvailable"
import StackingActionError from "../actions/StackingActionError"
import organizeStacks from "../support/organizeStacks"
import Feature from "../Feature"
import AssaultState from "./state/AssaultState"

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
      //
    })

    test("assault moving next to unobserved unit", () => {
      //
    })

    test("moving by unobserved unit", () => {
      //
    })

    test("unit routs by unobserved unit", () => {
      //
    })

    test("unobserved unit moves next to unit", () => {
      //
    })

    test("unobserved unit moves next to decoy", () => {
      //
    })

    test("fire misses unobserved unit", () => {
      //
    })

    test("fire hits unobserved unit", () => {
      // include MG
    })

    test("sniper misses unobserved unit", () => {
      //
    })

    test("sniper hits unobserved unit", () => {
      //
    })

    test("unobserved unit captures VP", () => {
      //
    })

    test("unobserved unit moves into mines", () => {
      //
    })

    test("blaze starts in hex", () => {
      // both decoy and not
    })
  })
});
