import { describe, expect, test, vi } from "vitest";
import { createBlankGame, testGGun, testGInf, testGMG, testRInf, testWire } from "./testHelpers";
import { Coordinate, unitStatus } from "../../utilities/commonTypes";
import Unit from "../Unit";
import { findRoutPathTree, routEnds, routPaths } from "./rout";
import Feature from "../Feature";
import organizeStacks from "../support/organizeStacks";
import IllegalActionError from "../actions/IllegalActionError";
import RoutState, { RoutPathTree } from "./state/RoutState";
import RoutAllState from "./state/RoutAllState";
import RoutCheckState from "./state/RoutCheckState";

describe("rout tests", () => {
  describe("rout trees", () => {
    test("map edge rout path", () => {
      const game = createBlankGame()
      const unit = new Unit(testGInf)
      unit.status = unitStatus.Broken
      
      expect(findRoutPathTree(game, new Coordinate(4, 2), 4, 2, unit)).toBe(false)
    })

    test("units blocking rout path", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      const unit = new Unit(testGInf)
      unit.status = unitStatus.Broken

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
      unit.status = unitStatus.Broken

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
      unit.status = unitStatus.Broken

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
      unit.status = unitStatus.Broken

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
      unit.status = unitStatus.Broken

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
      unit.status = unitStatus.Broken

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
      unit.status = unitStatus.Broken

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
      unit.status = unitStatus.Broken
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
      unit.status = unitStatus.Broken
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
      unit.status = unitStatus.Broken
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
      unit.status = unitStatus.Broken
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
      unit.status = unitStatus.Broken
      unit.id = "test1"
      const loc = new Coordinate(4, 2)
      map.addCounter(loc, unit)
      game.routNeeded.push({ unit, loc })
      organizeStacks(map)

      game.gameState = new RoutState(game, true)
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
      unit.status = unitStatus.Broken
      unit.id = "test1"
      const loc = new Coordinate(0, 2)
      game.routNeeded.push({ unit, loc })
      map.addCounter(loc, unit)
      organizeStacks(map)

      game.gameState = new RoutState(game, true)
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

      game.executeUndo()
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
      unit.status = unitStatus.Broken
      unit.id = "test1"
      unit.select()
      const loc = new Coordinate(0, 2)
      map.addCounter(loc, unit)
      organizeStacks(map)

      game.gameState = new RoutState(game, true)
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

      game.executeUndo()
      expect(game.initiative).toBe(0)
      all = map.allCounters
      expect(all.length).toBe(1)
      expect(all[0].hex?.x).toBe(0)
      expect(all[0].hex?.y).toBe(2)
      expect(all[0].unit.routed).toBe(false)
    })

    test("rout drops weapon", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      const unit = new Unit(testGInf)
      unit.status = unitStatus.Broken
      unit.id = "test1"
      const loc = new Coordinate(0, 2)
      game.routNeeded.push({ unit, loc })
      map.addCounter(loc, unit)
      const unit2 = new Unit(testGMG)
      unit2.id = "test2"
      map.addCounter(loc, unit2)
      organizeStacks(map)

      game.gameState = new RoutState(game, true)
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

      game.executeUndo()
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
      unit.status = unitStatus.Broken
      unit.id = "test1"
      const loc = new Coordinate(0, 2)
      game.routNeeded.push({ unit, loc })
      map.addCounter(loc, unit)
      const unit2 = new Unit(testGGun)
      unit2.id = "test2"
      unit2.facing = 4
      map.addCounter(loc, unit2)
      organizeStacks(map)

      game.gameState = new RoutState(game, true)
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

      game.executeUndo()
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
      unit.status = unitStatus.Broken
      unit.id = "test1"
      const loc = new Coordinate(4, 2)
      map.addCounter(loc, unit)
      organizeStacks(map)

      expect(game.initiative).toBe(0)
      game.gameState = new RoutAllState(game)
      expect(game.routCheckNeeded.length).toBe(0)
      game.gameState.finish()
      expect(game.routCheckNeeded.length).toBe(1)
      expect(game.initiative).toBe(-3)

      game.gameState = new RoutCheckState(game)
      expect(game.gameState.selection[0]?.id).toBe(unit.id)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.01)
      game.gameState.finish()
      Math.random = original
      expect(game.routNeeded[0].unit.name).toBe("Rifle")

      unit.select()
      game.gameState = new RoutState(game, false)
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
        game.executeUndo()
      } catch(err) {
        // Can't roll involuntary rout
        expect(err instanceof IllegalActionError).toBe(true)
      }
    })

    test("check and involuntary rout action off board", () => {
      const game = createBlankGame()
      const map = game.scenario.map
      const unit = new Unit(testRInf)
      unit.id = "test1"
      unit.status = unitStatus.Broken
      unit.select()
      const loc = new Coordinate(0, 2)
      map.addCounter(loc, unit)
      organizeStacks(map)

      game.gameState = new RoutAllState(game)
      expect(game.routCheckNeeded.length).toBe(0)
      game.gameState.finish()
      expect(game.routCheckNeeded.length).toBe(1)

      game.gameState = new RoutCheckState(game)
      expect(game.gameState.selection[0]?.id).toBe(unit.id)

      const original = Math.random
      vi.spyOn(Math, "random").mockReturnValue(0.01)
      game.gameState.finish()
      Math.random = original
      expect(game.routNeeded[0].unit.name).toBe("Rifle")

      unit.select()
      game.gameState = new RoutState(game, false)
      expect(game.routState.routPathTree).toBe(false)

      game.routState.finishXY()
      expect(game.routNeeded.length).toBe(0)

      const all = map.allCounters
      expect(all.length).toBe(0)
      expect(game.eliminatedUnits[0].name).toBe("Rifle")
    })
  })
})