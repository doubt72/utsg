import { describe, expect, test } from "vitest";
import Feature, { FeatureData } from "../engine/Feature";
import { HexData } from "../engine/Hex";
import Map from "../engine/Map";
import { Coordinate, Direction, weatherType, windType } from "./commonTypes";
import { los } from "./los";

// LOS integration tests

// const testFeatureData: { [index: string]: FeatureData } = {
//   smoke: { ft: 1, n: "Smoke", t: "smoke", i: "smoke", h: 2 },
//   fire: { ft: 1, n: "Blaze", t: "fire", i: "fire", o: { los: 1 } },
// };

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

    // Test all the paths.  Yes, this is a LOT of tests but there are a lot of
    // literal "edge cases" to test here, and it doesn't actually take very
    // long.  This code is tricky and there are a remarkable number of things
    // that can go wrong, but the test here is pretty simple: this should always
    // always result in a clear LOS.
    for (let y1 = 0; y1 < 5; y1++) {
      for (let x1 = 0; x1 < 5; x1++) {
        for (let y2 = 0; y2 < 5; y2++) {
          for (let x2 = 0; x2 < 5; x2++) {
            if (x1 !== x2 || y1 !== y2) {
              test(`${x1},${y1} to ${x2},${y2} works`, () => {
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
});

// const map: MapTestData = {
//   x: 5,
//   y: 5,
//   hexes: [
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [{ t: "o" }, { t: "o" }, { t: "f" }, { t: "o" }, { t: "o" }],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//   ],
// };

// const map: MapTestData = {
//   x: 5,
//   y: 5,
//   hexes: [
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [{ t: "f" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "f" }],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//   ],
// };

// const map: MapTestData = {
//   x: 5,
//   y: 5,
//   hexes: [
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [{ t: "f" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "f" }],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//   ],
// };

// const map: MapTestData = {
//   x: 5,
//   y: 5,
//   hexes: [
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [
//       { t: "o" },
//       { t: "o" },
//       { t: "o", b: "w", be: [1, 2, 3, 4, 5, 6] },
//       { t: "o" },
//       { t: "o" },
//     ],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//   ],
// };

// const map: MapTestData = {
//   x: 5,
//   y: 5,
//   hexes: [
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [
//       { t: "o" },
//       { t: "o" },
//       { t: "g", b: "w", be: [1, 2, 3, 4, 5, 6] },
//       { t: "o" },
//       { t: "o" },
//     ],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//   ],
// };

// // left, right

// const map: MapTestData = {
//   x: 5,
//   y: 5,
//   features: [{ u: testFeatureData.fire, x: 2, y: 2 }],
//   hexes: [
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//   ],
// };

// const map: MapTestData = {
//   x: 5,
//   y: 5,
//   features: [{ u: testFeatureData.smoke, x: 2, y: 2 }],
//   hexes: [
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//     [{ t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }, { t: "o" }],
//   ],
// };
