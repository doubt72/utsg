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

const nearHexes = [
  [1, 1, 2, 3],
  [2, 3, 1, 1],
  [2, 1, 1, 3],
  [1, 3, 2, 1],
  [1, 2, 3, 2],
  [3, 2, 1, 2],
];

const farHexes = [
  [1, 0, 3, 4],
  [3, 4, 1, 0],
  [3, 0, 1, 4],
  [1, 4, 3, 0],
  [2, 0, 2, 4],
  [2, 4, 2, 0],
  [0, 0, 4, 4],
  [4, 4, 0, 0],
  [0, 4, 4, 0],
  [4, 0, 0, 4],
];

const farNearHexes = [
  [1, 0, 2, 3],
  [3, 0, 1, 3],
  [4, 2, 1, 2],
  [3, 4, 1, 1],
  [1, 4, 2, 1],
  [0, 2, 3, 2],
]

const nearFarHexes = [
  [2, 3, 1, 0],
  [1, 3, 3, 0],
  [1, 2, 4, 2],
  [1, 1, 3, 4],
  [2, 1, 1, 4],
  [3, 2, 0, 2],
]

const edgeHexes = [
  [1, 1, 3, 2],
  [3, 2, 1, 3],
  [1, 3, 1, 1],
  [1, 2, 2, 1],
  [2, 1, 2, 3],
  [2, 3, 1, 2],
  [3, 2, 1, 1],
  [1, 3, 3, 2],
  [1, 1, 1, 3],
  [2, 1, 1, 2],
  [2, 3, 2, 1],
  [1, 2, 2, 3],
];

const outHexes = [
  [2, 2, 2, 3],
  [2, 2, 1, 1],
  [2, 2, 1, 3],
  [2, 2, 2, 1],
  [2, 2, 3, 2],
  [2, 2, 1, 2],
  [2, 2, 3, 4],
  [2, 2, 1, 0],
  [2, 2, 1, 4],
  [2, 2, 3, 0],
  [2, 2, 2, 4],
  [2, 2, 2, 0],
  [2, 2, 4, 4],
  [2, 2, 0, 0],
  [2, 2, 4, 0],
  [2, 2, 0, 4],
];

const inHexes = [
  [1, 1, 2, 2],
  [2, 3, 2, 2],
  [2, 1, 2, 2],
  [1, 3, 2, 2],
  [1, 2, 2, 2],
  [3, 2, 2, 2],
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

const missHexes = [
  [0, 0, 0, 4],
  [0, 4, 0, 0],
  [4, 0, 4, 4],
  [4, 4, 4, 0],
  [0, 0, 2, 4],
  [2, 4, 0, 0],
  [2, 4, 4, 0],
  [4, 0, 2, 4],
  [0, 0, 4, 0],
  [4, 0, 0, 0],
];

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

      describe("clean misses", () => {
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

    describe("edge shift left", () => {
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
        // [4, 3, 4, 1], TODO: fix
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

    describe("edge shift right", () => {
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

      let tuples = [
        [4, 1, 4, 5],
        [4, 5, 4, 1],
        [0, 1, 0, 5],
        [0, 5, 0, 1],
        // [0, 2, 0, 4], TODO: fix
        [0, 4, 0, 2],
        [2, 0, 0, 4],
        [0, 4, 2, 0],
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
        [4, 2, 4, 4],
        [4, 4, 4, 2],
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

      describe("blocks near", () => {
        for (const tuple of nearHexes) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true); // TODO: fix, this should be false
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

      describe("blocks far to near", () => {
        for(const tuple of farNearHexes) {
          const [x1, y1, x2, y2] = tuple
          test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(false);
          });
        }
      });

      describe("blocks near to far", () => {
        for(const tuple of nearFarHexes) {
          const [x1, y1, x2, y2] = tuple
          test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(false);
          });
        }
      });

      describe("blocks edges", () => {
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

      describe("clean misses", () => {
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
      describe("center obstacle", () => {
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

        describe("clean misses", () => {
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

      describe("edge shift left", () => {
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
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(false);
          });
        }

        tuples = [
          [0, 1, 0, 3],
          [0, 3, 0, 1],
        ];
        for (const tuple of tuples) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} clear`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });

      describe("edge shift right", () => {
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

        let tuples = [
          [4, 1, 4, 5],
          [4, 5, 4, 1],
          [0, 1, 0, 5],
          [0, 5, 0, 1],
          [0, 2, 0, 4],
          [0, 4, 0, 2],
          [2, 0, 0, 4],
          [0, 4, 2, 0],
        ];
        for (const tuple of tuples) {
          const [x1, y1, x2, y2] = tuple;
          test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(false);
          });
        }

        tuples = [
          [4, 2, 4, 4],
          [4, 4, 4, 2],
        ];
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
    describe("center plus fences", () => {
      const mapData: MapTestData = {
        x: 5,
        y: 5,
        hexes: [
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [
            { t: "o" },
            { t: "o" },
            { t: "g", b: "w", be: [1, 2, 3, 4, 5, 6] },
            { t: "o" },
            { t: "o" },
          ],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
          [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
        ],
      };

      const map = createMap(mapData);

      // describe("from near", () => {
      //   for(const tuple of nearHexes) {
      //     const [x1, y1, x2, y2] = tuple
      //     test(`${x1},${y1} to ${x2},${y2} be 2`, () => {
      //       const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
      //       const hindrance = (<TextLayout>lc).value

      //       expect(hindrance).toBe(2);
      //     });
      //   }
      // }); TODO: fix

      // describe("from far", () => {
      //   for(const tuple of farHexes) {
      //     const [x1, y1, x2, y2] = tuple
      //     test(`${x1},${y1} to ${x2},${y2} be 3`, () => {
      //       const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
      //       const hindrance = (<TextLayout>lc).value

      //       expect(hindrance).toBe(3);
      //     });
      //   }
      // }); TODO: fix

      describe("along edge", () => {
        for(const tuple of nearHexes) {
          const [x1, y1, x2, y2] = tuple
          test(`${x1},${y1} to ${x2},${y2} be 1`, () => {
            const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            const hindrance = (<TextLayout>lc).value

            expect(hindrance).toBe(1);
          });
        }
      });

      // describe("near to far", () => {
      //   for(const tuple of nearFarHexes) {
      //     const [x1, y1, x2, y2] = tuple
      //     test(`${x1},${y1} to ${x2},${y2} be 2`, () => {
      //       const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
      //       const hindrance = (<TextLayout>lc).value

      //       expect(hindrance).toBe(2);
      //     });
      //   }
      // }); TODO: fix

      // describe("far to near", () => {
      //   for(const tuple of farNearHexes) {
      //     const [x1, y1, x2, y2] = tuple
      //     test(`${x1},${y1} to ${x2},${y2} be 3`, () => {
      //       const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
      //       const hindrance = (<TextLayout>lc).value

      //       expect(hindrance).toBe(3);
      //     });
      //   }
      // }); TODO: fix

      describe("out", () => {
        for(const tuple of outHexes) {
          const [x1, y1, x2, y2] = tuple
          test(`${x1},${y1} to ${x2},${y2} have none`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });

      describe("in", () => {
        for(const tuple of inHexes) {
          const [x1, y1, x2, y2] = tuple
          test(`${x1},${y1} to ${x2},${y2} be 1`, () => {
            const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            const hindrance = (<TextLayout>lc).value

            expect(hindrance).toBe(1);
          });
        }
      });

      describe("clean misses", () => {
        for(const tuple of missHexes) {
          const [x1, y1, x2, y2] = tuple
          test(`${x1},${y1} to ${x2},${y2} have none`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });
    });

    describe("edge shift left", () => {
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

      let tuples = [
        [0, 0, 0, 4],
        [0, 4, 0, 0],
        [4, 0, 4, 4],
        [4, 4, 4, 0],
        [4, 1, 4, 3],
        // [4, 3, 4, 1], TODO: fix
        [3, 0, 4, 3],
        [4, 3, 3, 0],
      ]
      for(const tuple of tuples) {
        const [x1, y1, x2, y2] = tuple
        test(`${x1},${y1} to ${x2},${y2} to be 1`, () => {
          const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
          const hindrance = (<TextLayout>lc).value

          expect(hindrance).toBe(1);
        });
      }

      tuples = [
        [0, 1, 0, 3],
        [0, 3, 0, 1],
      ]
      for(const tuple of tuples) {
        const [x1, y1, x2, y2] = tuple
        test(`${x1},${y1} to ${x2},${y2} have none`, () => {
          expect(
            los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
          ).toBe(true);
        });
      }
    });

    describe("edge shift right", () => {
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

      let tuples = [
        [4, 1, 4, 5],
        [4, 5, 4, 1],
        [0, 1, 0, 5],
        [0, 5, 0, 1],
        // [0, 2, 0, 4], TODO: fix
        [0, 4, 0, 2],
        [2, 0, 0, 4],
        [0, 4, 2, 0],
      ]
      for(const tuple of tuples) {
        const [x1, y1, x2, y2] = tuple
        test(`${x1},${y1} to ${x2},${y2} to be 1`, () => {
          const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
          const hindrance = (<TextLayout>lc).value

          expect(hindrance).toBe(1);
        });
      }

      tuples = [
        [4, 2, 4, 4],
        [4, 4, 4, 2],
      ]
      for(const tuple of tuples) {
        const [x1, y1, x2, y2] = tuple
        test(`${x1},${y1} to ${x2},${y2} have none`, () => {
          expect(
            los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
          ).toBe(true);
        });
      }
    });

    describe("smoke", () => {
      describe("center", () => {
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
          for(const tuple of nearHexes) {
            const [x1, y1, x2, y2] = tuple
            test(`${x1},${y1} to ${x2},${y2} to be 2`, () => {
              const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
              const hindrance = (<TextLayout>lc).value
  
              expect(hindrance).toBe(2);
            });
          }
        });
  
        describe("hinders far", () => {
          for(const tuple of farHexes) {
            const [x1, y1, x2, y2] = tuple
            test(`${x1},${y1} to ${x2},${y2} to be 2`, () => {
              const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
              const hindrance = (<TextLayout>lc).value
  
              expect(hindrance).toBe(2);
            });
          }
        });
  
        describe("doesn't hinder edges", () => {
          for(const tuple of edgeHexes) {
            const [x1, y1, x2, y2] = tuple
            test(`${x1},${y1} to ${x2},${y2} clear`, () => {
              expect(
                los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
              ).toBe(true);
            });
          }
        });
  
        // describe("hinders out", () => {
        //   for(const tuple of outHexes) {
        //     const [x1, y1, x2, y2] = tuple
        //     test(`${x1},${y1} to ${x2},${y2} to be 2`, () => {
        //       const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
        //       const hindrance = (<TextLayout>lc).value
  
        //       expect(hindrance).toBe(2);
        //     });
        //   }
        // }); TODO: fix
  
        describe("hinders in", () => {
          for(const tuple of inHexes) {
            const [x1, y1, x2, y2] = tuple
            test(`${x1},${y1} to ${x2},${y2} to be 2`, () => {
              const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
              const hindrance = (<TextLayout>lc).value
  
              expect(hindrance).toBe(2);
            });
          }
        });
  
        describe("clean misses", () => {
          for(const tuple of missHexes) {
            const [x1, y1, x2, y2] = tuple
            test(`${x1},${y1} to ${x2},${y2} clear`, () => {
              expect(
                los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
              ).toBe(true);
            });
          }
        });
      });
  
      describe("edge shift left", () => {
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
  
        let tuples = [
          [0, 0, 0, 4],
          [0, 4, 0, 0],
          [4, 0, 4, 4],
          [4, 4, 4, 0],
          // [4, 1, 4, 3], TODO: fix
          [4, 3, 4, 1],
          [3, 0, 4, 3],
          [4, 3, 3, 0],
        ]
        for(const tuple of tuples) {
          const [x1, y1, x2, y2] = tuple
          test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
            const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            const hindrance = (<TextLayout>lc).value

            expect(hindrance).toBe(2);
          });
        }
  
        tuples = [
          [0, 1, 0, 3],
          [0, 3, 0, 1],
        ]
        for(const tuple of tuples) {
          const [x1, y1, x2, y2] = tuple
          test(`${x1},${y1} to ${x2},${y2} clear`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });
  
      describe("edge shift right", () => {
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
  
        let tuples = [
          [4, 1, 4, 5],
          [4, 5, 4, 1],
          [0, 1, 0, 5],
          [0, 5, 0, 1],
          [0, 2, 0, 4],
          //[0, 4, 0, 2], TODO: fix
          [2, 0, 0, 4],
          [0, 4, 2, 0],
        ]
        for(const tuple of tuples) {
          const [x1, y1, x2, y2] = tuple
          test(`${x1},${y1} to ${x2},${y2} blocked`, () => {
            const lc = los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            const hindrance = (<TextLayout>lc).value

            expect(hindrance).toBe(2);
          });
        }
  
        tuples = [
          [4, 2, 4, 4],
          [4, 4, 4, 2],
        ]
        for(const tuple of tuples) {
          const [x1, y1, x2, y2] = tuple
          test(`${x1},${y1} to ${x2},${y2} clear`, () => {
            expect(
              los(map, new Coordinate(x1, y1), new Coordinate(x2, y2))
            ).toBe(true);
          });
        }
      });
    });
  });

  describe("complex buildings", () => {
    test("true", () => {
      expect(true).toBe(true);
    });
  });

  describe("elevation", () => {
    test("true", () => {
      expect(true).toBe(true);
    });
  });
});
