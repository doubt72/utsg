import { describe, expect, test, vi } from "vitest";
import {
  createBlankGame, createMoveGame, testGGun, testGInf, testGLdr, testGMG, testRInf, testWire
} from "./testHelpers";
import { baseTerrainType, Coordinate } from "../../utilities/commonTypes";
import Unit from "../Unit";
import { findRoutPathTree, routEnds, routPaths } from "./rout";
import Feature from "../Feature";
import organizeStacks from "../support/organizeStacks";
import IllegalActionError from "../actions/IllegalActionError";
import RoutState, { RoutPathTree } from "./state/RoutState";
import RoutAllState from "./state/RoutAllState";
import RoutCheckState from "./state/RoutCheckState";
import RouteMoveAction from "../actions/RoutMoveAction";
import { routHelpText } from "../support/help";
import { deHTML } from "../../utilities/graphics";

describe("routing", () => {
  describe("rout trees", () => {
    test("map edge rout path", () => {
      const game = createBlankGame()
      const unit = new Unit(testGInf)
      unit.break()
      
      expect(findRoutPathTree(game, new Coordinate(4, 2), 4, 2, unit)).toBe(false)
    })

    test("units blocking rout path", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      const unit = new Unit(testGInf)
      unit.break()

      const blocking = new Unit(testRInf)
      map.addCounter(new Coordinate(4, 2), blocking)
      const blocking2 = new Unit(testRInf)
      map.addCounter(new Coordinate(3, 1), blocking2)
      const blocking3 = new Unit(testRInf)
      map.addCounter(new Coordinate(3, 3), blocking3)
      
      expect(findRoutPathTree(game, new Coordinate(3, 2), 4, 2, unit)).toBe(false)
    })

    test("single rout path", () => {
      const game = createBlankGame()
      const unit = new Unit(testGInf)
      unit.break()

      expect(unit.currentMovement).toBe(4)
      
      expect(findRoutPathTree(game, new Coordinate(0, 2), 4, 2, unit)).toStrictEqual({
        x: 0, y: 2, children: [{
          x: 1, y: 2, children: [{
            x: 2, y: 2, children: [{
              x: 3, y: 2, children: [{
                x: 4, y: 2, children: [],
              }]
            }]
          }]
        }]
      })
    })

    test("path when blocked", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      const unit = new Unit(testGInf)
      unit.break()

      const blocking = new Unit(testRInf)
      map.addCounter(new Coordinate(1, 2), blocking)
      
      expect(findRoutPathTree(game, new Coordinate(0, 2), 4, 2, unit)).toStrictEqual({
        x: 0, y: 2, children: [{
          x: 0, y: 1, children: [{
            x: 1, y: 1, children: [{
              x: 2, y: 1, children: [{
                x: 3, y: 1, children: [],
              }]
            }]
          }]
        }, {
          x: 0, y: 3, children: [{
            x: 1, y: 3, children: [{
              x: 2, y: 3, children: [{
                x: 3, y: 3, children: []
              }]
            }]
          }]
        }]
      })
    })

    test("path not blocked by friendly unit", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      const unit = new Unit(testGInf)
      unit.break()

      const blocking = new Unit(testGInf)
      map.addCounter(new Coordinate(1, 2), blocking)
      
      expect(findRoutPathTree(game, new Coordinate(0, 2), 4, 2, unit)).toStrictEqual({
        x: 0, y: 2, children: [{
          x: 1, y: 2, children: [{
            x: 2, y: 2, children: [{
              x: 3, y: 2, children: [{
                x: 4, y: 2, children: [],
              }]
            }]
          }]
        }]
      })
    })

    test("path when blocked by friendly units", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      const unit = new Unit(testGInf)
      unit.break()

      const blocking = new Unit(testGInf)
      map.addCounter(new Coordinate(1, 2), blocking)
      const blocking2 = new Unit(testGInf)
      map.addCounter(new Coordinate(1, 2), blocking2)
      
      expect(findRoutPathTree(game, new Coordinate(0, 2), 4, 2, unit)).toStrictEqual({
        x: 0, y: 2, children: [{
          x: 0, y: 1, children: [{
            x: 1, y: 1, children: [{
              x: 2, y: 1, children: [{
                x: 3, y: 1, children: [],
              }]
            }]
          }]
        }, {
          x: 0, y: 3, children: [{
            x: 1, y: 3, children: [{
              x: 2, y: 3, children: [{
                x: 3, y: 3, children: []
              }]
            }]
          }]
        }]
      })
    })

    test("path when blocked by wire", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      const unit = new Unit(testGInf)
      unit.break()

      const blocking = new Feature(testWire)
      map.addCounter(new Coordinate(1, 2), blocking)
      
      expect(findRoutPathTree(game, new Coordinate(0, 2), 4, 2, unit)).toStrictEqual({
        x: 0, y: 2, children: [{
          x: 0, y: 1, children: [{
            x: 1, y: 1, children: [{
              x: 2, y: 1, children: [{
                x: 3, y: 1, children: [],
              }]
            }]
          }]
        }, {
          x: 0, y: 3, children: [{
            x: 1, y: 3, children: [{
              x: 2, y: 3, children: [{
                x: 3, y: 3, children: []
              }]
            }]
          }]
        }]
      })
    })

    test("path from wire", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      const unit = new Unit(testGInf)
      unit.break()

      const blocking = new Feature(testWire)
      map.addCounter(new Coordinate(0, 2), blocking)
      
      expect(findRoutPathTree(game, new Coordinate(0, 2), 4, 2, unit)).toStrictEqual({
        x: 0, y: 2, children: [{
          x: 1, y: 2, children: []
        }]
      })
    })

    test("path for different side", () => {
      const game = createBlankGame()
      game.scenario.map.axisDir = 2.5
      const unit = new Unit(testGInf)
      unit.brokenMovement = 2
      unit.break()
      expect(unit.currentMovement).toBe(2)

      const root = new Coordinate(2, 0)
      const tree = findRoutPathTree(game, root, 2, 2, unit) as RoutPathTree
      expect(routPaths(tree)).toStrictEqual([
        [root, new Coordinate(2, 1), new Coordinate(3,2)],
        [root, new Coordinate(2, 1), new Coordinate(2,2)],
        [root, new Coordinate(1, 1), new Coordinate(2,2)],
        [root, new Coordinate(1, 1), new Coordinate(1,2)],
      ])
    })

    test("path for different side with blocker", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      game.scenario.map.axisDir = 2.5
      const unit = new Unit(testGInf)
      unit.brokenMovement = 2
      unit.break()
      expect(unit.currentMovement).toBe(2)

      const notBlocking = new Unit(testGInf)
      map.addCounter(new Coordinate(2, 1), notBlocking)
      const blocking = new Unit(testRInf)
      map.addCounter(new Coordinate(1, 1), blocking)

      const root = new Coordinate(2, 0)
      const tree = findRoutPathTree(game, root, 2, 2, unit) as RoutPathTree
      expect(routPaths(tree)).toStrictEqual([
        [root, new Coordinate(2, 1), new Coordinate(3,2)],
        [root, new Coordinate(2, 1), new Coordinate(2,2)],
      ])
    })

    test("path for terrain hindrance", () => {
      const game = createBlankGame([
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "b" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
      ])
      game.scenario.map.axisDir = 2.5
      const unit = new Unit(testGInf)
      unit.brokenMovement = 2
      unit.break()
      expect(unit.currentMovement).toBe(2)

      const root = new Coordinate(2, 0)
      const tree = findRoutPathTree(game, root, 2, 2, unit) as RoutPathTree
      expect(routPaths(tree)).toStrictEqual([
        [root, new Coordinate(2, 1)],
        [root, new Coordinate(1, 1), new Coordinate(2,2)],
        [root, new Coordinate(1, 1), new Coordinate(1,2)],
      ])
    })

    test("endpoints for different side", () => {
      const game = createBlankGame()
      game.scenario.map.axisDir = 2.5
      const unit = new Unit(testGInf)
      unit.brokenMovement = 2
      unit.break()
      expect(unit.currentMovement).toBe(2)

      const root = new Coordinate(2, 0)
      const tree = findRoutPathTree(game, root, 2, 2, unit) as RoutPathTree
      expect(routEnds(tree)).toStrictEqual([
        new Coordinate(3,2), new Coordinate(2,2), new Coordinate(1,2),
      ])
    })

    test("rout offmap has no path", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      const unit = new Unit(testGInf)
      unit.break()
      unit.id = "test1"
      const loc = new Coordinate(4, 2)
      map.addCounter(loc, unit)
      game.routNeeded.push({ unit, loc })
      organizeStacks(map)

      game.setGameState(new RoutState(game, true))
      expect(game.routState.routPathTree).toBe(false)
      game.routState.finish()
      expect(game.initiative).toBe(-1)

      const all = map.allCounters
      expect(all.length).toBe(0)
    })

    test("complete rout action", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      const unit = new Unit(testGInf)
      unit.break()
      unit.id = "test1"
      const loc = new Coordinate(0, 2)
      game.routNeeded.push({ unit, loc })
      map.addCounter(loc, unit)
      organizeStacks(map)

      game.setGameState(new RoutState(game, true))
      const tree = game.routState.routPathTree as RoutPathTree
      expect(routEnds(tree)).toStrictEqual([new Coordinate(4, 2)])

      expect(game.initiative).toBe(0)
      game.routState.finishXY(4, 2)
      expect(game.initiative).toBe(-1)

      let all = map.allCounters
      expect(all.length).toBe(1)
      expect(all[0].hex?.x).toBe(4)
      expect(all[0].hex?.y).toBe(2)
      expect(all[0].unit.routed).toBe(true)

      game.executeUndo(false)
      expect(game.initiative).toBe(0)
      all = map.allCounters
      expect(all.length).toBe(1)
      expect(all[0].hex?.x).toBe(0)
      expect(all[0].hex?.y).toBe(2)
      expect(all[0].unit.routed).toBe(false)
    })

    test("complete self rout action", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      const unit = new Unit(testGInf)
      unit.break()
      unit.id = "test1"
      const loc = new Coordinate(0, 2)
      map.addCounter(loc, unit)
      map.select(unit)
      organizeStacks(map)

      game.setGameState(new RoutState(game, true))
      const tree = game.routState.routPathTree as RoutPathTree
      expect(routEnds(tree)).toStrictEqual([new Coordinate(4, 2)])

      expect(game.initiative).toBe(0)
      game.routState.finishXY(4, 2)
      expect(game.initiative).toBe(-1)

      let all = map.allCounters
      expect(all.length).toBe(1)
      expect(all[0].hex?.x).toBe(4)
      expect(all[0].hex?.y).toBe(2)
      expect(all[0].unit.routed).toBe(true)

      game.executeUndo(false)
      expect(game.initiative).toBe(0)
      all = map.allCounters
      expect(all.length).toBe(1)
      expect(all[0].hex?.x).toBe(0)
      expect(all[0].hex?.y).toBe(2)
      expect(all[0].unit.routed).toBe(false)
    })

    test("rout along road in snow", () => {
      const game = createMoveGame()
      const map = game.scenario.map
      map.baseTerrain = baseTerrainType.Snow
      const unit = new Unit(testGInf)
      unit.break()
      unit.id = "test1"
      const loc = new Coordinate(0, 2)
      map.addCounter(loc, unit)
      map.select(unit)
      organizeStacks(map)

      game.setGameState(new RoutState(game, true))
      const tree = game.routState.routPathTree as RoutPathTree
      expect(routEnds(tree)).toStrictEqual([new Coordinate(4, 2)])

      expect(game.initiative).toBe(0)
      game.routState.finishXY(4, 2)
      expect(game.initiative).toBe(-1)

      const all = map.allCounters
      expect(all.length).toBe(1)
      expect(all[0].hex?.x).toBe(4)
      expect(all[0].hex?.y).toBe(2)
      expect(all[0].unit.routed).toBe(true)
    })

    test("rout switches value of VP", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      const unit = new Unit(testGInf)
      unit.break()
      unit.id = "test1"
      const loc = new Coordinate(0, 2)
      map.addCounter(loc, unit)
      const unit2 = new Unit(testRInf)
      unit2.id = "test2"
      map.addCounter(loc, unit2)
      map.select(unit)
      organizeStacks(map)

      const loc2 = new Coordinate(1, 2)
      const loc3 = new Coordinate(2, 2)
      const loc4 = new Coordinate(3, 2)
      const end = new Coordinate(4, 2)
      map.victoryHexes.push({ x: loc.x, y: loc.y, player: 2 })
      expect(map.victoryAt(loc)).toBe(2)

      game.setGameState(new RoutState(game, true))
      const tree = game.routState.routPathTree as RoutPathTree
      expect(routEnds(tree)).toStrictEqual([new Coordinate(4, 2)])

      game.routState.finishXY(end.x, end.y)
      expect(map.victoryAt(loc)).toBe(1)

      game.executeUndo(false)

      const action = game.actions[0] as RouteMoveAction
      expect(action.path[0].x).toBe(loc.x)
      expect(action.path[0].y).toBe(loc.y)
      expect(action.path[1].x).toBe(loc2.x)
      expect(action.path[1].y).toBe(loc2.y)
      expect(action.path[2].x).toBe(loc3.x)
      expect(action.path[2].y).toBe(loc3.y)
      expect(action.path[3].x).toBe(loc4.x)
      expect(action.path[3].y).toBe(loc4.y)
      expect(action.path[4].x).toBe(end.x)
      expect(action.path[4].y).toBe(end.y)
      expect(map.victoryAt(loc)).toBe(2)
    })

    test("rout doesn't switch value of VP if still contested", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      const unit = new Unit(testGInf)
      unit.break()
      unit.id = "test1"
      const loc = new Coordinate(0, 2)
      map.addCounter(loc, unit)
      const unit2 = new Unit(testGInf)
      unit2.break()
      unit2.id = "test2"
      map.addCounter(loc, unit2)
      const unit3 = new Unit(testRInf)
      unit3.id = "test3"
      map.addCounter(loc, unit3)
      map.select(unit)
      organizeStacks(map)

      map.victoryHexes.push({ x: loc.x, y: loc.y, player: 2 })
      expect(map.victoryAt(loc)).toBe(2)

      game.setGameState(new RoutState(game, true))
      const end = new Coordinate(4, 2)
      game.routState.finishXY(end.x, end.y)
      expect(map.victoryAt(loc)).toBe(2)
    })

    test("rout drops weapon", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      const unit = new Unit(testGInf)
      unit.break()
      unit.id = "test1"
      const loc = new Coordinate(0, 2)
      game.routNeeded.push({ unit, loc })
      map.addCounter(loc, unit)
      const unit2 = new Unit(testGMG)
      unit2.id = "test2"
      map.addCounter(loc, unit2)
      organizeStacks(map)

      game.setGameState(new RoutState(game, true))
      const tree = game.routState.routPathTree as RoutPathTree
      expect(routEnds(tree)).toStrictEqual([new Coordinate(4, 2)])

      game.routState.finishXY(4, 2)

      let all = map.allCounters
      expect(all.length).toBe(2)
      expect(all[0].hex?.x).toBe(4)
      expect(all[0].hex?.y).toBe(2)
      expect(all[0].unit.name).toBe("Rifle")
      expect(all[0].unit.routed).toBe(true)
      expect(all[0].unit.children.length).toBe(0)
      expect(all[1].hex?.x).toBe(0)
      expect(all[1].hex?.y).toBe(2)
      expect(all[1].unit.name).toBe("MG 08/15")
      expect(all[1].unit.parent?.name).toBe(undefined)

      game.executeUndo(false)
      all = map.allCounters
      expect(all.length).toBe(2)
      expect(all[0].hex?.x).toBe(0)
      expect(all[0].hex?.y).toBe(2)
      expect(all[0].unit.name).toBe("Rifle")
      expect(all[0].unit.routed).toBe(false)
      expect(all[0].unit.children.length).toBe(1)
      expect(all[1].hex?.x).toBe(0)
      expect(all[1].hex?.y).toBe(2)
      expect(all[1].unit.name).toBe("MG 08/15")
      expect(all[1].unit.parent?.name).toBe("Rifle")
    })

    test("rout drops weapon with facing", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      const unit = new Unit(testGInf)
      unit.break()
      unit.id = "test1"
      const loc = new Coordinate(0, 2)
      game.routNeeded.push({ unit, loc })
      map.addCounter(loc, unit)
      const unit2 = new Unit(testGGun)
      unit2.id = "test2"
      unit2.facing = 4
      map.addCounter(loc, unit2)
      organizeStacks(map)

      game.setGameState(new RoutState(game, true))
      const tree = game.routState.routPathTree as RoutPathTree
      expect(routEnds(tree)).toStrictEqual([new Coordinate(4, 2)])

      game.routState.finishXY(4, 2)

      let all = map.allCounters
      expect(all.length).toBe(2)
      expect(all[0].hex?.x).toBe(4)
      expect(all[0].hex?.y).toBe(2)
      expect(all[0].unit.name).toBe("Rifle")
      expect(all[0].unit.routed).toBe(true)
      expect(all[0].unit.children.length).toBe(0)
      expect(all[1].hex?.x).toBe(0)
      expect(all[1].hex?.y).toBe(2)
      expect(all[1].unit.name).toBe("3.7cm Pak 36")
      expect(all[1].unit.facing).toBe(4)
      expect(all[1].unit.parent?.name).toBe(undefined)

      game.executeUndo(false)
      all = map.allCounters
      expect(all.length).toBe(2)
      expect(all[0].hex?.x).toBe(0)
      expect(all[0].hex?.y).toBe(2)
      expect(all[0].unit.name).toBe("Rifle")
      expect(all[0].unit.routed).toBe(false)
      expect(all[0].unit.children.length).toBe(1)
      expect(all[1].hex?.x).toBe(0)
      expect(all[1].hex?.y).toBe(2)
      expect(all[1].unit.name).toBe("3.7cm Pak 36")
      expect(all[1].unit.facing).toBe(4)
      expect(all[1].unit.parent?.name).toBe("Rifle")
    })

    test("check and involuntary rout action", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      const unit = new Unit(testRInf)
      unit.break()
      unit.id = "test1"
      const loc = new Coordinate(4, 2)
      map.addCounter(loc, unit)
      organizeStacks(map)

      expect(game.initiative).toBe(0)
      game.setGameState(new RoutAllState(game))
      expect(game.routCheckNeeded.length).toBe(0)
      game.gameState?.finish()
      expect(game.routCheckNeeded.length).toBe(1)
      expect(game.initiative).toBe(-3)

      game.setGameState(new RoutCheckState(game))
      expect(game.gameState?.selection[0]?.id).toBe(unit.id)

      expect(routHelpText(game, loc, unit)).toStrictEqual([
        "rout check roll:",
        "- base of 15",
        "- minus 2 for rout check",
        "- minus morale 1",
        "",
        "target to avoid rout: 12 (45%)",
        "target to rally: 24 (0%)",
        "- rout check plus 10",
        "",
        "[hold down shift to hide]",
      ])

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.01)
      game.gameState?.finish()
      Math.random = original
      expect(game.routNeeded[0].unit.name).toBe("Rifle")

      map.select(unit)
      game.setGameState(new RoutState(game, false))
      const tree = game.routState.routPathTree as RoutPathTree
      expect(routEnds(tree)).toStrictEqual([new Coordinate(0, 2)])

      expect(game.initiative).toBe(-3)
      game.routState.finishXY(0, 2)
      expect(game.routNeeded.length).toBe(0)
      expect(game.initiative).toBe(-3)

      const all = map.allCounters
      expect(all.length).toBe(1)
      expect(all[0].hex?.x).toBe(0)
      expect(all[0].hex?.y).toBe(2)
      expect(all[0].unit.routed).toBe(true)

      try {
        game.executeUndo(false)
      } catch(err) {
        // Can't roll involuntary rout
        expect(err instanceof IllegalActionError).toBe(true)
      }
    })

    test("high enough rout check rallies", () => {
      const game = createMoveGame()
      game.setCurrentPlayer(1)
      const map = game.scenario.map
      const unit = new Unit(testGLdr)
      unit.break()
      unit.id = "test1"
      const loc = new Coordinate(3, 3)
      map.addCounter(loc, unit)
      organizeStacks(map)

      game.setGameState(new RoutAllState(game))
      expect(game.routCheckNeeded.length).toBe(0)
      game.gameState?.finish()
      expect(game.routCheckNeeded.length).toBe(1)

      game.setGameState(new RoutCheckState(game))
      expect(game.gameState?.selection[0]?.id).toBe(unit.id)

      expect(routHelpText(game, loc, unit)).toStrictEqual([
        "rout check roll:",
        "- base of 15",
        "- minus 2 for rout check",
        "- minus morale 4",
        "- minus cover 2",
        "",
        "target to avoid rout: 7 (85%)",
        "target to rally: 19 (3%)",
        "- rout check plus 10",
        "",
        "[hold down shift to hide]",
      ])

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.99)
      game.gameState?.finish()
      Math.random = original

      expect(game.routNeeded.length).toBe(0)

      expect(deHTML(game.lastAction?.stringValue as string)).toBe(
        "German Leader rout morale check at D4: target 7, rolled 20 [2d10: 10 + 10], critical success, unit rallies"
      )
    })

    test("multiple rout all decreases rally threshold on rout checks", () => {
      const game = createMoveGame()
      const map = game.scenario.map
      const unit = new Unit(testRInf)
      unit.break()
      unit.id = "test1"
      const loc = new Coordinate(3, 3)
      map.addCounter(loc, unit)
      organizeStacks(map)

      game.setGameState(new RoutAllState(game)) // 0
      game.gameState?.finish()

      game.setGameState(new RoutCheckState(game))

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.7)
      game.gameState?.finish()

      game.setGameState(new RoutAllState(game)) // 1
      game.gameState?.finish()

      game.setGameState(new RoutCheckState(game))
      game.gameState?.finish()

      game.setGameState(new RoutAllState(game)) // 2
      game.gameState?.finish()

      game.setGameState(new RoutCheckState(game))
      game.gameState?.finish()

      game.setGameState(new RoutAllState(game)) // 3
      game.gameState?.finish()

      game.setGameState(new RoutCheckState(game))

      expect(routHelpText(game, loc, unit)).toStrictEqual([
        "rout check roll:",
        "- base of 15",
        "- minus 2 for rout check",
        "- minus morale 1",
        "- minus cover 2",
        "",
        "target to avoid rout: 10 (64%)",
        "target to rally: 16 (15%)",
        "- plus 12 minus 6 for previous attempts",
        "",
        "[hold down shift to hide]",
      ])

      vi.spyOn(Math, "random").mockReturnValue(0.7)
      game.gameState?.finish()
      Math.random = original

      expect(game.routNeeded.length).toBe(0)

      expect(deHTML(game.lastAction?.stringValue as string)).toBe(
        "Soviet Rifle rout morale check at D4: target 10, rolled 16 [2d10: 8 + 8], critical success, unit rallies"
      )
    })

    test("rally threshold doesn't go below fail threshold", () => {
      const game = createMoveGame()
      const map = game.scenario.map
      const unit = new Unit(testRInf)
      unit.break()
      unit.id = "test1"
      const loc = new Coordinate(3, 3)
      map.addCounter(loc, unit)
      organizeStacks(map)

      game.setGameState(new RoutAllState(game)) // 0
      game.gameState?.finish()
      game.togglePlayer()
      game.setGameState(new RoutAllState(game)) // 1
      game.gameState?.finish()
      game.togglePlayer()
      game.setGameState(new RoutAllState(game)) // 2
      game.gameState?.finish()
      game.togglePlayer()
      game.setGameState(new RoutAllState(game)) // 3
      game.gameState?.finish()
      game.togglePlayer()
      game.setGameState(new RoutAllState(game)) // 4
      game.gameState?.finish()
      game.togglePlayer()
      game.setGameState(new RoutAllState(game)) // 5
      game.gameState?.finish()
      game.togglePlayer()
      game.setGameState(new RoutAllState(game)) // 6
      game.gameState?.finish()

      game.setGameState(new RoutCheckState(game))

      expect(routHelpText(game, loc, unit)).toStrictEqual([
        "rout check roll:",
        "- base of 15",
        "- minus 2 for rout check",
        "- minus morale 1",
        "- minus cover 2",
        "",
        "target to avoid rout: 10 (64%)",
        "target to rally: 10 (64%)",
        "- plus 12 minus 12 for previous attempts",
        "",
        "[hold down shift to hide]",
      ])
    })

    test("check and involuntary rout action off board", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      const unit = new Unit(testRInf)
      unit.id = "test1"
      unit.break()
      const loc = new Coordinate(0, 2)
      map.addCounter(loc, unit)
      map.select(unit)
      organizeStacks(map)

      game.setGameState(new RoutAllState(game))
      expect(game.routCheckNeeded.length).toBe(0)
      game.gameState?.finish()
      expect(game.routCheckNeeded.length).toBe(1)

      game.setGameState(new RoutCheckState(game))
      expect(game.gameState?.selection[0]?.id).toBe(unit.id)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.01)
      game.gameState?.finish()
      Math.random = original
      expect(game.routNeeded[0].unit.name).toBe("Rifle")

      map.select(unit)
      game.setGameState(new RoutState(game, false))
      expect(game.routState.routPathTree).toBe(false)

      game.routState.finishXY()
      expect(game.routNeeded.length).toBe(0)

      const all = map.allCounters
      expect(all.length).toBe(0)
      expect(game.eliminatedUnits[0].name).toBe("Rifle")
    })
  })
})