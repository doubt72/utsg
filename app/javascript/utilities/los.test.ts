import { describe, expect, test } from "vitest";
import Feature, { FeatureData } from "../engine/Feature";
import { HexData } from "../engine/Hex";
import Map from "../engine/Map";
import { Coordinate, Direction, weatherType, windType } from "./commonTypes";
import { los } from "./los";
import { TextLayout } from "./graphics";

// LOS integration tests

const testFeatureData: { [index: string]: FeatureData } = {
  smoke: { ft: 1, n: "Smoke", t: "smoke", i: "smoke", h: 2 },
  fire: { ft: 1, n: "Blaze", t: "fire", i: "fire", o: { los: 1 } },
};

type MapTestData = {
  x: number;
  y: number;
  features?: { u: FeatureData; x: number; y: number; f?: Direction }[];
  hexes: HexData[][];
};

// When using 5x5 test maps, layout looks like:
//
//  00  10  20  30  40
//    01  11  21  31  41
//  02  12  22  32  42
//    03  13  23  33  43
//  04  14  24  34  44
//
// Extended to eight rows:
//
//    05  15  25  35  45
//  06  16  26  36  46
//    07  17  27  37  47

function reverse(set: number[]): number[] {
  return [set[2], set[3], set[0], set[1]]
}

function symmetrical(sets: number[][]): number[][] {
  const rc = []
  for (const set of sets) {
    rc.push(set)
    rc.push(reverse(set))
  }
  return rc
}

function reverseAll(sets: number[][]): number[][] {
  return sets.map(s => reverse(s))
}

const nearHexes = symmetrical([
  [1, 1, 2, 3],
  [2, 1, 1, 3],
  [1, 2, 3, 2],
])

const farHexes = symmetrical([
  [1, 0, 3, 4],
  [3, 0, 1, 4],
  [2, 0, 2, 4],
  [0, 0, 4, 4],
  [0, 4, 4, 0],
]);

const farNearHexes = [
  [1, 0, 2, 3],
  [3, 0, 1, 3],
  [4, 2, 1, 2],
  [3, 4, 1, 1],
  [1, 4, 2, 1],
  [0, 2, 3, 2],
];

const nearFarHexes = reverseAll(farNearHexes)

const edgeHexes = symmetrical([
  [1, 1, 3, 2],
  [3, 2, 1, 3],
  [1, 3, 1, 1],
  [1, 2, 2, 1],
  [2, 1, 2, 3],
  [2, 3, 1, 2],
]);

const closeInHexes = [
  [1, 1, 2, 2],
  [2, 3, 2, 2],
  [2, 1, 2, 2],
  [1, 3, 2, 2],
  [1, 2, 2, 2],
  [3, 2, 2, 2],
];

const farInHexes = [
  [1, 0, 2, 2],
  [3, 4, 2, 2],
  [3, 0, 2, 2],
  [1, 4, 2, 2],
  [2, 0, 2, 2],
  [2, 4, 2, 2],
  [0, 0, 2, 2],
  [4, 4, 2, 2],
  [0, 4, 2, 2],
  [4, 0, 2, 2],
];

const inHexes = closeInHexes.concat(farInHexes)

const outHexes = reverseAll(inHexes)

const missHexes = symmetrical([
  [0, 0, 0, 4],
  [4, 0, 4, 4],
  [0, 0, 2, 4],
  [2, 4, 4, 0],
  [0, 0, 4, 0],
]);

function createMap(data: MapTestData): Map {
  const map = new Map({
    layout: [data.x, data.y, "x"],
    base_terrain: "g",
    start_weather: weatherType.Dry,
    base_weather: weatherType.Dry,
    precip: [0, weatherType.Rain],
    wind: [windType.Calm, 1, false],
    hexes: data.hexes,
  });

  if (data.features) {
    data.features.forEach((featureData) => {
      const feature = new Feature(featureData.u);
      if (featureData.f) {
        feature.facing = featureData.f;
      }
      map.addUnit(new Coordinate(featureData.x, featureData.y), feature);
    });
  }
  return map;
}

describe("los", () => {
  describe("open terrain", () => {
    const mapData: MapTestData = {
      x: 5,
      y: 5,
      hexes: [
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
      ],
    };

    const map = createMap(mapData);

    // Test all the paths; let's make sure the basic checks and nothing in the
    // basic pathing is outright breaking.  Yes, this is a LOT of tests but
    // there are a lot of literal "edge cases" to test here, and it doesn't
    // actually take very long.  This code is tricky and there are a remarkable
    // number of things that can break (edge crossings, map edges, point
    // intersections), but the test itself here is pretty simple: this should
    // always always result in a clear LOS.
    for (let y1 = 0; y1 < 5; y1++) {
      for (let x1 = 0; x1 < 5; x1++) {
        for (let y2 = 0; y2 < 5; y2++) {
          for (let x2 = 0; x2 < 5; x2++) {
            if (x1 !== x2 || y1 !== y2) {
              test(`${x1},${y1} to ${x2},${y2} clear`, () => {
                expect(
                  los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
                ).toBe(true);
              });
            }
          }
        }
      }
    }
  });

  describe("los", () => {
    describe("center obstacle", () => {
      const mapData: MapTestData = {
        x: 5,
        y: 5,
        hexes: [
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "f" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        ],
      };

      const map = createMap(mapData);

      describe("blocks near", () => {
        for (const tuple of nearHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(false);
          });
        }
      });

      describe("blocks far", () => {
        for (const tuple of farHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(false);
          });
        }
      });

      describe("doesn't block along edges", () => {
        for (const tuple of edgeHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} clear`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });

      describe("doesn't block out", () => {
        for (const tuple of outHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} clear`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });

      describe("doesn't block in", () => {
        for (const tuple of inHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} clear`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });

      describe("doesn't block clean misses", () => {
        for (const tuple of missHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} clear`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });
    });

    describe("map edge, shifted left", () => {
      const mapData: MapTestData = {
        x: 5,
        y: 5,
        hexes: [
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "f" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "f" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        ],
      };

      const map = createMap(mapData);

      let tuples = [
        [0, 0, 0, 4],
        [0, 4, 0, 0],
        [4, 0, 4, 4],
        [4, 4, 4, 0],
        [4, 1, 4, 3],
        [4, 3, 4, 1],
        [3, 0, 4, 3],
        [4, 3, 3, 0],
      ];
      for (const tuple of tuples) {
        const [x1, y1, x2, y2] = tuple;
        test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
          expect(los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))).toBe(
            false
          );
        });
      }

      tuples = [
        [0, 1, 0, 3],
        [0, 3, 0, 1],
      ];
      for (const tuple of tuples) {
        const [x1, y1, x2, y2] = tuple;
        test(`${x1},${y1} to ${x2},${y2} clear`, () => {
          expect(los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))).toBe(
            true
          );
        });
      }
    });

    describe("map edge, shifted right", () => {
      const mapData: MapTestData = {
        x: 5,
        y: 6,
        hexes: [
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "f" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "f" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        ],
      };

      const map = createMap(mapData);

      let tuples = symmetrical([
        [4, 1, 4, 5],
        [0, 1, 0, 5],
        [0, 2, 0, 4],
        [2, 0, 0, 4],
      ])
      for (const tuple of tuples) {
        const [x1, y1, x2, y2] = tuple;
        test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
          expect(los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))).toBe(
            false
          );
        });
      }

      tuples = symmetrical([
        [4, 2, 4, 4],
      ])
      for (const tuple of tuples) {
        const [x1, y1, x2, y2] = tuple;
        test(`${x1},${y1} to ${x2},${y2} clear`, () => {
          expect(los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))).toBe(
            true
          );
        });
      }
    });

    describe("along edge between neighbors", () => {
      const mapData: MapTestData = {
        x: 5,
        y: 5,
        hexes: [
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "f" }, { t: "f" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        ],
      };

      const map = createMap(mapData);

      describe("blocks near", () => {

        const tuples = symmetrical([
          [1, 1, 1, 3],
        ])

        for (const tuple of tuples) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(false);
          });
        }
      });
    });

    describe("walls", () => {
      const mapData: MapTestData = {
        x: 5,
        y: 5,
        hexes: [
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [
            { t: "o" },
            { t: "o" },
            { t: "o", b: "w", be: [1, 2, 3] },
            { t: "o", b: "w", be: [1] },
            { t: "o" },
          ],
          [
            { t: "o" },
            { t: "o", b: "w", be: [3] },
            { t: "o", b: "w", be: [2] },
            { t: "o" },
            { t: "o" },
          ],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        ],
      };

      const map = createMap(mapData);

      describe("blocks through double walls", () => {
        for (const tuple of farHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(false);
          });
        }

        for(const tuple of farNearHexes) {
          const [x1, y1, x2, y2] = tuple
          test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(false);
          });
        }

        for(const tuple of nearFarHexes) {
          const [x1, y1, x2, y2] = tuple
          test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(false);
          });
        }
      });

      describe("blocks along edges", () => {
        for (const tuple of edgeHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(false);
          });
        }
      });

      describe("doesn't block out", () => {
        for (const tuple of outHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} clear`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });

      describe("doesn't block in", () => {
        for (const tuple of inHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} clear`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });

      describe("doesn't block edge-to-edge", () => {
        for (const tuple of nearHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });

      describe("doesn't block clean misses", () => {
        for (const tuple of missHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} clear`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });
    });

    describe("blaze", () => {
      describe("in center", () => {
        const mapData: MapTestData = {
          x: 5,
          y: 5,
          features: [{ u: testFeatureData.fire, x: 2, y: 2 }],
          hexes: [
            [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
            [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
            [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
            [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
            [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          ],
        };

        const map = createMap(mapData);

        describe("blocks near", () => {
          for (const tuple of nearHexes) {
            const [x1, y1, x2, y2] = tuple;
            test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
              expect(
                los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
              ).toBe(false);
            });
          }
        });

        describe("blocks far", () => {
          for (const tuple of farHexes) {
            const [x1, y1, x2, y2] = tuple;
            test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
              expect(
                los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
              ).toBe(false);
            });
          }
        });

        describe("doesn't block edges", () => {
          for (const tuple of edgeHexes) {
            const [x1, y1, x2, y2] = tuple;
            test(`${x1},${y1} to ${x2},${y2} clear`, () => {
              expect(
                los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
              ).toBe(true);
            });
          }
        });

        describe("doesn't block clean misses", () => {
          for (const tuple of missHexes) {
            const [x1, y1, x2, y2] = tuple;
            test(`${x1},${y1} to ${x2},${y2} clear`, () => {
              expect(
                los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
              ).toBe(true);
            });
          }
        });
      });

      describe("map edge, shifted left", () => {
        const mapData: MapTestData = {
          x: 5,
          y: 5,
          features: [
            { u: testFeatureData.fire, x: 0, y: 2 },
            { u: testFeatureData.fire, x: 4, y: 2 },
          ],
          hexes: [
            [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
            [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
            [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
            [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
            [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          ],
        };

        const map = createMap(mapData);

        let tuples = symmetrical([
          [0, 0, 0, 4],
          [4, 0, 4, 4],
          [4, 1, 4, 3],
          [3, 0, 4, 3],
        ])
        for (const tuple of tuples) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(false);
          });
        }

        tuples = symmetrical([
          [0, 1, 0, 3],
        ])
        for (const tuple of tuples) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} clear`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });

      describe("map edge, shifted right", () => {
        const mapData: MapTestData = {
          x: 5,
          y: 6,
          features: [
            { u: testFeatureData.fire, x: 0, y: 3 },
            { u: testFeatureData.fire, x: 4, y: 3 },
          ],
          hexes: [
            [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
            [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
            [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
            [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
            [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
            [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          ],
        };

        const map = createMap(mapData);

        let tuples = symmetrical([
          [4, 1, 4, 5],
          [0, 1, 0, 5],
          [0, 2, 0, 4],
          [2, 0, 0, 4],
        ])
        for (const tuple of tuples) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(false);
          });
        }

        tuples = symmetrical([
          [4, 2, 4, 4],
        ])
        for (const tuple of tuples) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} clear`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });

      describe("along edge between neighbors", () => {
        const mapData: MapTestData = {
          x: 5,
          y: 5,
          features: [
            { u: testFeatureData.fire, x: 1, y: 2 },
            { u: testFeatureData.fire, x: 2, y: 2 },

          ],
          hexes: [
            [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
            [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
            [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
            [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
            [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          ],
        };

        const map = createMap(mapData);

        describe("blocks near", () => {
          const tuples = symmetrical([
            [1, 1, 1, 3],
          ])

          for (const tuple of tuples) {
            const [x1, y1, x2, y2] = tuple;
            test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
              expect(
                los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
              ).toBe(false);
            });
          }
        });
      });
    });
  });

  describe("buildings", () => {
    describe("single hex buildings", () => {
      const mapData: MapTestData = {
        x: 5,
        y: 8,
        hexes: [
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o", d: 1, st: { sh: "l" } }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [
            { t: "o" },
            { t: "o" },
            { t: "o", d: 2, st: { sh: "x" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "x" } },
          ],
          [{ t: "o" }, { t: "o" }, { t: "o", d: 2, st: { sh: "x" } }, { t: "o" }, { t: "o" }],
          [{ t: "o", d: 1, st: { sh: "c" } }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o", d: 1, st: { sh: "x" } }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        ],
      };

      const map = createMap(mapData);

      let tuples = symmetrical([
        [0, 2, 0, 6],
        [4, 3, 4, 7],
        [1, 2, 3, 2],
        [2, 4, 3, 2],
        [1, 1, 3, 4],
      ])

      for (const tuple of tuples) {
        const [x1, y1, x2, y2] = tuple;
        test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
          expect(
            los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
          ).toBe(false);
        });
      }

      tuples = symmetrical([
        [0, 2, 0, 0],
        [4, 3, 4, 1],
        [1, 3, 3, 2],
      ])

      for (const tuple of tuples) {
        const [x1, y1, x2, y2] = tuple;
        test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
          expect(
            los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
          ).toBe(true);
        });
      }
    });

    describe("multi hex buildings", () => {
      const mapData: MapTestData = {
        x: 5,
        y: 8,
        hexes: [
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o", d: 4, st: { sh: "s" } }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [
            { t: "o" },
            { t: "o" },
            { t: "o", d: 2, st: { sh: "s" } },
            { t: "o" },
            { t: "o", d: 1, st: { sh: "s" } },
          ],
          [{ t: "o" }, { t: "o" }, { t: "o", d: 5, st: { sh: "s" } }, { t: "o" }, { t: "o" }],
          [{ t: "o", d: 4, st: { sh: "s" } }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o", d: 1, st: { sh: "s" } }],
          [
            { t: "o" },
            { t: "o", d: 1, st: { sh: "s" } },
            { t: "o", d: 1, st: { sh: "m" } },
            { t: "o", d: 4, st: { sh: "s" } },
            { t: "o" },
          ],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        ],
      };

      const map = createMap(mapData);

      const tuples = symmetrical([
        [0, 2, 0, 6],
        [4, 3, 4, 7],
        [1, 2, 3, 2],
        [2, 4, 3, 2],
        [1, 1, 3, 4],
        [0, 2, 0, 0],
        [4, 3, 4, 1],
        [1, 3, 3, 2],
        [1, 5, 2, 7],
        [1, 7, 2, 5],
        [1, 5, 1, 7],
        [2, 5, 2, 7],
      ])

      for (const tuple of tuples) {
        const [x1, y1, x2, y2] = tuple;
        test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
          expect(
            los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
          ).toBe(false);
        });
      }
    });

    describe("very large building", () => {
      const mapData: MapTestData = {
        x: 5,
        y: 5,
        hexes: [
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [
            { t: "o" },
            { t: "o", d: 1, st: { sh: "bc1" } },
            { t: "o", d: 1, st: { sh: "bc2" } },
            { t: "o" },
            { t: "o" },
          ],
          [
            { t: "o" },
            { t: "o", d: 1, st: { sh: "bs1" } },
            { t: "o", d: 1, st: { sh: "bm" } },
            { t: "o", d: 4, st: { sh: "bs1" } },
            { t: "o" },
          ],
          [
            { t: "o" },
            { t: "o", d: 4, st: { sh: "bc2" } },
            { t: "o", d: 4, st: { sh: "bc1" } },
            { t: "o" },
            { t: "o" },
          ],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        ],
      };

      const map = createMap(mapData);

      let tuples = symmetrical([
        [1, 1, 1, 3],
        [1, 0, 1, 4],
        [2, 1, 2, 3],
        [3, 0, 3, 4],
        [2, 2, 0, 0],
        [2, 2, 4, 0],
        [2, 2, 0, 4],
        [2, 2, 4, 4],
      ])

      for (const tuple of tuples) {
        const [x1, y1, x2, y2] = tuple;
        test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
          expect(
            los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
          ).toBe(false);
        });
      }

      tuples = symmetrical([
        [2, 2, 1, 1],
        [2, 2, 2, 1],
        [2, 2, 3, 2],
        [2, 2, 2, 3],
        [2, 2, 1, 3],
        [2, 2, 1, 2],
        [0, 1, 0, 3],
        [3, 1, 3, 3],
      ])

      for (const tuple of tuples) {
        const [x1, y1, x2, y2] = tuple;
        test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
          expect(
            los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
          ).toBe(true);
        });
      }
    });
  });

  describe("elevation", () => {
    describe("one small hill", () => {
      const mapData: MapTestData = {
        x: 5,
        y: 5,
        hexes: [
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o", h: 1 }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        ],
      };
  
      const map = createMap(mapData);

      describe("blocks near", () => {
        for (const tuple of nearHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(false);
          });
        }
      });

      describe("blocks far", () => {
        for (const tuple of farHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(false);
          });
        }
      });

      describe("doesn't block along edges", () => {
        for (const tuple of edgeHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} clear`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });

      describe("doesn't block down", () => {
        for (const tuple of outHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} clear`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });

      describe("doesn't block up", () => {
        for (const tuple of inHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} clear`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });

      describe("doesn't block clean misses", () => {
        for (const tuple of missHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} clear`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });
    });

    describe("two small hills", () => {
      const mapData: MapTestData = {
        x: 5,
        y: 5,
        hexes: [
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o", h: 1 }, { t: "o" }, { t: "o", h: 1 }, { t: "o", h: 1 }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        ],
      };
  
      const map = createMap(mapData);

      describe("hill to hill", () => {
        const tuples = symmetrical([
          [1, 2, 3, 2],
          [1, 2, 4, 2],
        ])

        for (const tuple of tuples) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} clear`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });

      describe("hill and valley", () => {
        let tuples = symmetrical([
          [1, 2, 2, 2],
          [2, 2, 3, 2],
        ])

        for (const tuple of tuples) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} clear`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }

        tuples = symmetrical([
          [2, 2, 4, 2],
        ])

        for (const tuple of tuples) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(false);
          });
        }
      });
    });

    describe("two small hills obstruction between", () => {
      const mapData: MapTestData = {
        x: 5,
        y: 5,
        hexes: [
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o", h: 1 }, { t: "f" }, { t: "o", h: 1 }, { t: "o", h: 1 }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        ],
      };
  
      const map = createMap(mapData);

      describe("hill to hill", () => {
        const tuples = symmetrical([
          [1, 2, 3, 2],
          [1, 2, 4, 2],
        ])

        for (const tuple of tuples) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} clear`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });

      describe("hill and valley", () => {
        let tuples = symmetrical([
          [1, 2, 2, 2],
          [2, 2, 3, 2],
        ])

        for (const tuple of tuples) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} clear`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }

        tuples = symmetrical([
          [2, 2, 4, 2],
        ])

        for (const tuple of tuples) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(false);
          });
        }
      });
    });

    describe("two small hills blaze between", () => {
      const mapData: MapTestData = {
        x: 5,
        y: 5,
        features: [{ u: testFeatureData.fire, x: 2, y: 2 }],
        hexes: [
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o", h: 1 }, { t: "o" }, { t: "o", h: 1 }, { t: "o", h: 1 }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        ],
      };
  
      const map = createMap(mapData);

      describe("hill to hill", () => {
        const tuples = symmetrical([
          [1, 2, 3, 2],
          [1, 2, 4, 2],
        ])

        for (const tuple of tuples) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} block`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(false);
          });
        }
      });
    });


    describe("shadow distance", () => {
      const mapData: MapTestData = {
        x: 6,
        y: 8,
        hexes: [
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "f" }, { t: "f" }, { t: "f" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [
            { t: "o" },
            { t: "o" },
            { t: "o" },
            { t: "o", h: 1 },
            { t: "o", h: 2 },
            { t: "o", h: 3 },
          ],
        ],
      };
  
      const map = createMap(mapData);

      let tuples = symmetrical([
        [3, 7, 1, 2],
        [3, 7, 0, 1],
        [3, 7, 0, 0],
        [4, 7, 2, 2],
        [4, 7, 1, 1],
        [5, 7, 3, 2],
      ])

      for (const tuple of tuples) {
        const [x1, y1, x2, y2] = tuple;
        test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
          expect(
            los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
          ).toBe(false);
        });
      }

      tuples = symmetrical([
        [4, 7, 1, 0],
        [5, 7, 2, 1],
        [5, 7, 2, 0],
      ])

      for (const tuple of tuples) {
        const [x1, y1, x2, y2] = tuple;
        test(`${x1},${y1} to ${x2},${y2} clear`, () => {
          expect(
            los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
          ).toBe(true);
        });
      }
    });
  });
});

describe("hindrance", () => {
  describe("combined fence and hex", () => {
    const mapData: MapTestData = {
      x: 5,
      y: 5,
      hexes: [
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [
          { t: "o" },
          { t: "o" },
          { t: "g", b: "f", be: [1, 2, 3] },
          { t: "o", b: "f", be: [1] },
          { t: "o" },
        ],
        [
          { t: "o" },
          { t: "o", b: "f", be: [3] },
          { t: "o", b: "f", be: [2] },
          { t: "o" },
          { t: "o" },
        ],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
      ],
    };

    const map = createMap(mapData);

    describe("from near", () => {
      for (const tuple of nearHexes) {
        const [x1, y1, x2, y2] = tuple;
        test(`${x1},${y1} to ${x2},${y2} is 2`, () => {
          const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2));
          const hindrance = (<TextLayout>lc).value;

          expect(hindrance).toBe(2);
        });
      }
    });

    describe("from far", () => {
      for(const tuple of farHexes) {
        const [x1, y1, x2, y2] = tuple
        test(`${x1},${y1} to ${x2},${y2} is 3`, () => {
          const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
          const hindrance = (<TextLayout>lc).value

          expect(hindrance).toBe(3);
        });
      }
    });

    describe("along edge", () => {
      for (const tuple of edgeHexes) {
        const [x1, y1, x2, y2] = tuple;
        test(`${x1},${y1} to ${x2},${y2} is 1`, () => {
          const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2));
          const hindrance = (<TextLayout>lc).value;

          expect(hindrance).toBe(1);
        });
      }
    });

    describe("near to far", () => {
      for(const tuple of nearFarHexes) {
        const [x1, y1, x2, y2] = tuple
        test(`${x1},${y1} to ${x2},${y2} is 2`, () => {
          const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
          const hindrance = (<TextLayout>lc).value

          expect(hindrance).toBe(2);
        });
      }
    });

    describe("far to near", () => {
      for(const tuple of farNearHexes) {
        const [x1, y1, x2, y2] = tuple
        test(`${x1},${y1} to ${x2},${y2} is 3`, () => {
          const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
          const hindrance = (<TextLayout>lc).value

          expect(hindrance).toBe(3);
        });
      }
    });

    describe("out", () => {
      for (const tuple of outHexes) {
        const [x1, y1, x2, y2] = tuple;
        test(`${x1},${y1} to ${x2},${y2} have none`, () => {
          expect(
            los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
          ).toBe(true);
        });
      }
    });

    describe("in", () => {
      for (const tuple of farInHexes) {
        const [x1, y1, x2, y2] = tuple;
        test(`${x1},${y1} to ${x2},${y2} is 2`, () => {
          const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2));
          const hindrance = (<TextLayout>lc).value;

          expect(hindrance).toBe(2);
        });
      }

      for (const tuple of closeInHexes) {
        const [x1, y1, x2, y2] = tuple;
        test(`${x1},${y1} to ${x2},${y2} is 1`, () => {
          const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2));
          const hindrance = (<TextLayout>lc).value;

          expect(hindrance).toBe(1);
        });
      }
    });

    describe("clean misses", () => {
      for (const tuple of missHexes) {
        const [x1, y1, x2, y2] = tuple;
        test(`${x1},${y1} to ${x2},${y2} have none`, () => {
          expect(
            los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
          ).toBe(true);
        });
      }
    });
  });

  describe("map edge, shifted left", () => {
    const mapData: MapTestData = {
      x: 5,
      y: 5,
      hexes: [
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "g" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "g" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
      ],
    };

    const map = createMap(mapData);

    let tuples = symmetrical([
      [0, 0, 0, 4],
      [4, 0, 4, 4],
      [4, 1, 4, 3],
      [3, 0, 4, 3],
    ]);
    for (const tuple of tuples) {
      const [x1, y1, x2, y2] = tuple;
      test(`${x1},${y1} to ${x2},${y2} is 1`, () => {
        const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2));
        const hindrance = (<TextLayout>lc).value;

        expect(hindrance).toBe(1);
      });
    }

    tuples = symmetrical([
      [0, 1, 0, 3],
    ]);
    for (const tuple of tuples) {
      const [x1, y1, x2, y2] = tuple;
      test(`${x1},${y1} to ${x2},${y2} have none`, () => {
        expect(los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))).toBe(
          true
        );
      });
    }
  });

  describe("map edge, shifted right", () => {
    const mapData: MapTestData = {
      x: 5,
      y: 6,
      hexes: [
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "g" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "g" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
      ],
    };

    const map = createMap(mapData);

    let tuples = symmetrical([
      [4, 1, 4, 5],
      [0, 1, 0, 5],
      [0, 2, 0, 4],
      [2, 0, 0, 4],
    ]);
    for (const tuple of tuples) {
      const [x1, y1, x2, y2] = tuple;
      test(`${x1},${y1} to ${x2},${y2} is 1`, () => {
        const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2));
        const hindrance = (<TextLayout>lc).value;

        expect(hindrance).toBe(1);
      });
    }

    tuples = symmetrical([
      [4, 2, 4, 4],
    ]);
    for (const tuple of tuples) {
      const [x1, y1, x2, y2] = tuple;
      test(`${x1},${y1} to ${x2},${y2} have none`, () => {
        expect(los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))).toBe(
          true
        );
      });
    }
  });

  describe("along edge between neighbors", () => {
    const mapData: MapTestData = {
      x: 5,
      y: 5,
      hexes: [
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "g" }, { t: "g" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
      ],
    };

    const map = createMap(mapData);

    describe("blocks near", () => {
      const tuples = symmetrical([
        [1, 1, 1, 3],
      ])

      for (const tuple of tuples) {
        const [x1, y1, x2, y2] = tuple;
        test(`${x1},${y1} to ${x2},${y2} is 1`, () => {
          const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2));
          const hindrance = (<TextLayout>lc).value;

          expect(hindrance).toBe(1);
        });
      }
    });
  });

  describe("smoke", () => {
    describe("in center", () => {
      const mapData: MapTestData = {
        x: 5,
        y: 5,
        features: [{ u: testFeatureData.smoke, x: 2, y: 2 }],
        hexes: [
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        ],
      };

      const map = createMap(mapData);

      describe("hinders near", () => {
        for (const tuple of nearHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} is 2`, () => {
            const lc = los(
              map,
              new Coordinate(x1, y1),
              new Coordinate(x2, y2)
            );
            const hindrance = (<TextLayout>lc).value;

            expect(hindrance).toBe(2);
          });
        }
      });

      describe("hinders far", () => {
        for (const tuple of farHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} is 2`, () => {
            const lc = los(
              map,
              new Coordinate(x1, y1),
              new Coordinate(x2, y2)
            );
            const hindrance = (<TextLayout>lc).value;

            expect(hindrance).toBe(2);
          });
        }
      });

      describe("doesn't hinder edges", () => {
        for (const tuple of edgeHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} has none`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });

      describe("hinders out", () => {
        for(const tuple of outHexes) {
          const [x1, y1, x2, y2] = tuple
          test(`${x1},${y1} to ${x2},${y2} is 2`, () => {
            const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            const hindrance = (<TextLayout>lc).value

            expect(hindrance).toBe(2);
          });
        }
      });

      describe("hinders in", () => {
        for (const tuple of inHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} is 2`, () => {
            const lc = los(
              map,
              new Coordinate(x1, y1),
              new Coordinate(x2, y2)
            );
            const hindrance = (<TextLayout>lc).value;

            expect(hindrance).toBe(2);
          });
        }
      });

      describe("doesn't hinder clean misses", () => {
        for (const tuple of missHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} has none`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });
    });

    describe("map edge, shifted left", () => {
      const mapData: MapTestData = {
        x: 5,
        y: 5,
        features: [
          { u: testFeatureData.smoke, x: 0, y: 2 },
          { u: testFeatureData.smoke, x: 4, y: 2 },
        ],
        hexes: [
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        ],
      };

      const map = createMap(mapData);

      let tuples = symmetrical([
        [0, 0, 0, 4],
        [4, 0, 4, 4],
        [4, 1, 4, 3],
        [3, 0, 4, 3],
      ]);
      for (const tuple of tuples) {
        const [x1, y1, x2, y2] = tuple;
        test(`${x1},${y1} to ${x2},${y2} is 2`, () => {
          const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2));
          const hindrance = (<TextLayout>lc).value;

          expect(hindrance).toBe(2);
        });
      }

      tuples = symmetrical([
        [0, 1, 0, 3],
      ]);
      for (const tuple of tuples) {
        const [x1, y1, x2, y2] = tuple;
        test(`${x1},${y1} to ${x2},${y2} has none`, () => {
          expect(
            los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
          ).toBe(true);
        });
      }
    });

    describe("map edge, shifted right", () => {
      const mapData: MapTestData = {
        x: 5,
        y: 6,
        features: [
          { u: testFeatureData.smoke, x: 0, y: 3 },
          { u: testFeatureData.smoke, x: 4, y: 3 },
        ],
        hexes: [
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        ],
      };

      const map = createMap(mapData);

      let tuples = symmetrical([
        [4, 1, 4, 5],
        [0, 1, 0, 5],
        [0, 2, 0, 4],
        [2, 0, 0, 4],
      ]);
      for (const tuple of tuples) {
        const [x1, y1, x2, y2] = tuple;
        test(`${x1},${y1} to ${x2},${y2} is 2`, () => {
          const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2));
          const hindrance = (<TextLayout>lc).value;

          expect(hindrance).toBe(2);
        });
      }

      tuples = symmetrical([
        [4, 2, 4, 4],
      ]);
      for (const tuple of tuples) {
        const [x1, y1, x2, y2] = tuple;
        test(`${x1},${y1} to ${x2},${y2} has none`, () => {
          expect(
            los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
          ).toBe(true);
        });
      }
    });

    describe("along edge between neighbors", () => {
      const mapData: MapTestData = {
        x: 5,
        y: 5,
        features: [
          { u: testFeatureData.smoke, x: 1, y: 2 },
          { u: testFeatureData.smoke, x: 2, y: 2 },

        ],
        hexes: [
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        ],
      };

      const map = createMap(mapData);

      describe("blocks near", () => {
        const tuples = symmetrical([
          [1, 1, 1, 3],
        ])

        for (const tuple of tuples) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} is 2`, () => {
            const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2));
            const hindrance = (<TextLayout>lc).value;

            expect(hindrance).toBe(2);
          });
        }
      });
    });
  });

  describe.skip("elevation", () => {
    test("true", () => {
      expect(true).toBe(true);
    });
  });
});
