import Hex from "../engine/Hex";
import Map from "../engine/Map";
import { Coordinate, Direction } from "./commonTypes";
import { TextLayout } from "./graphics";
import { OrientationType, lineDoesIntersect, lineOrientation, orientation } from "./lines";
import { normalDir } from "./utilities";

// If you're doing a lot of hex manipulation (or any other sort of game
// programming), I highly recomment my old classmate Amit Patel's page:
// https://www.redblobgames.com/ -- the explanation and presentations of
// various concepts there are exceptional.  Though really none of my code here
// is based on anything there (most of my algorithms are either trivial and/or
// have special requirements for edges and such, and I've prioritized making
// it easy to build low-bandwidth configuration at the expense of elegance.
// OTOH I did skim some of the hexagonal grid pages while thinking about how I
// want to tackle things and they have help me focus my implementations).

// All direction indexes are normalized here and in hexPath to be 1-6, not
// 0-5. This made debugging easier, is consistent with the configuration data,
// makes simpler existence checks for return values (since directions are
// always truthy) at the expense of adding and subtracting numbers at times
// that they would not otherwise be.  Not sure if there are any ideal choices
// here, all of this is quite complicated either way.

type IntersectionData = {
  corner?: Direction;
  cornerIntersection?: Direction;
  orientation?: OrientationType;
  edge?: Direction;
};

function hexIntersection(
  hex: Hex,
  p0: Coordinate,
  p1: Coordinate,
  fromEdge?: Direction,
  fromCorner?: Direction
): IntersectionData {
  for (let i = 0; i < 6; i++) {
    const h0 = new Coordinate(hex.xCorner(normalDir(i)), hex.yCorner(normalDir(i)));
    // Prioritize corner intersections (technically each corner intersects two
    // edges as well, but if we hit a corner, that's what we care about);
    // exclude opposite corners if (1) it's the starting hex but doesn't
    // intersect the line or (2) it's a corner we just came from
    if (
      lineOrientation(p0, h0, p1) === orientation.Straight &&
      h0.onSegment(p0, p1) &&
      i + 1 !== fromCorner
    ) {
      const center = new Coordinate(hex.xOffset, hex.yOffset);
      const o = lineOrientation(p0, center, p1);
      if (o === orientation.Straight) {
        return { corner: normalDir(i + 1) };
      } else {
        return { cornerIntersection: normalDir(i + 1), orientation: o };
      }
    }
  }
  for (let i = 0; i < 6; i++) {
    const h0 = new Coordinate(hex.xCorner(normalDir(i)), hex.yCorner(normalDir(i)));
    const h1 = new Coordinate(hex.xCorner(normalDir(i + 1)), hex.yCorner(normalDir(i + 1)));
    // Exclude (1) edges we came from and (2) edges that intersect a corner we
    // came from if we hit it at an angle that doesn't match a hex edge
    if (lineDoesIntersect(h0, h1, p0, p1) && i + 1 !== fromEdge) {
      const nextCorner = fromCorner ? normalDir(fromCorner - 1) : undefined;
      if (i + 1 !== fromCorner && i + 1 !== nextCorner) {
        return { edge: normalDir(i + 1) };
      }
    }
  }
  console.log("hexIntersection: this shouldn't happen, something went wrong");
  return { edge: 1 };
}

type hexPathData = {
  hex?: Hex;
  edge?: Direction;
  edgeHex?: Hex;
  long?: boolean;
};

// We care about both specific edges and corners and hexes traversed for the
// purposes of LOS and hindrance, so this is actually quite tricky.  We're
// essentially doing a ray trace through hexes, and we also need to make sure
// that we don't backtrack so we need to keep track of what direction we came
// from so we can send that back to the intersection code so it will ignore
// intersections we don't want.
export function losHexPath(map: Map, start: Hex, target: Hex): hexPathData[] {
  const hexes: hexPathData[] = [];
  if (start.coord.x === target.coord.x && start.coord.y === target.coord.y) {
    return hexes;
  }

  let hex = start;
  const p0 = new Coordinate(hex.xOffset, hex.yOffset);
  const p1 = new Coordinate(target.xOffset, target.yOffset);

  let count = 0;
  let fromEdge: Direction | undefined = undefined;
  let fromCorner: Direction | undefined = undefined;
  while (hex.coord.x !== target.coord.x || hex.coord.y !== target.coord.y) {
    // Should never need this but infinite loops are very, very bad
    if (count++ > 99) {
      console.log("aborting possible infinite loop");
      console.log("losHexPath: this shouldn't happen, something went wrong");
      break;
    }
    const check = hexIntersection(hex, p0, p1, fromEdge, fromCorner);
    if (check.edge) {
      // Edge crossing
      // Add edge crossed, move to next hex
      hexes.push({ edge: check.edge, edgeHex: hex, long: false });
      hex = map.neighborAt(hex.coord, check.edge) as Hex;
      hexes.push({ hex: hex });

      fromEdge = normalDir(check.edge + 3);
      fromCorner = undefined;
    } else if (check.corner) {
      // Corner crossings - travelling along hex edge
      // Add edge traversed, move to hex at end of traversal
      const x = hex.coord.x;
      const y = hex.coord.y;
      hex = map.neighborAt(hex.coord, check.corner) as Hex;
      // Handle when traversing off edge of map; next hex will be on it
      if (!hex) {
        if (check.corner === 3) {
          hex = new Hex(new Coordinate(x + 1, y - 1), { offmap: true }, map);
        } else if (check.corner === 6) {
          hex = new Hex(new Coordinate(x - 1, y + 1), { offmap: true }, map);
        }
      }
      const edge = normalDir(check.corner + 4);
      hexes.push({ edge: edge, edgeHex: hex, long: true });
      const dir = normalDir(check.corner - 1);
      hex = map.neighborAt(hex.coord, dir) as Hex;
      hexes.push({ hex: hex });

      fromCorner = normalDir(check.corner + 3);
      fromEdge = undefined;
    } else if (check.cornerIntersection) {
      // Corner crossing - hex-to-hex
      // Technically we cross the edge at the...  Edge of the edge, then move
      // to next hex.  An...  Edge case, but does happen somewhat often
      const dir = normalDir(
        check.orientation === orientation.Clockwise
          ? check.cornerIntersection
          : check.cornerIntersection - 1
      );
      hexes.push({ edge: dir, edgeHex: hex, long: false });
      hex = map.neighborAt(hex.coord, dir) as Hex;
      hexes.push({ hex: hex });

      fromCorner = normalDir(
        check.orientation === orientation.Clockwise
          ? check.cornerIntersection - 2
          : check.cornerIntersection + 2
      );
      fromEdge = undefined;
    } else {
      // If we had to break out of an infinite loop, we'll probably hit this
      console.log("hexPath: this shouldn't happen, something went wrong");
    }
  }
  return hexes;
}

function hexDistance(hex0: Hex, hex1: Hex): number {
  // Transform X into axial coordinates
  const x00 = hex0.coord.x - Math.floor(hex0.coord.y / 2);
  const x11 = hex1.coord.x - Math.floor(hex1.coord.y / 2);
  // Add a cubic component
  const z0 = -x00 - hex0.coord.y;
  const z1 = -x11 - hex1.coord.y;
  // And now things are simple
  return Math.max(Math.abs(x00 - x11), Math.abs(hex0.coord.y - hex1.coord.y), Math.abs(z0 - z1));
}

function elevationHindrance(
  start: Hex,
  target: Hex,
  elevation: number,
  currDist: number,
  hindrance: number,
  edge?: boolean
): number {
  if (start.elevation === target.elevation && elevation === start.elevation) {
    return hindrance;
  }
  if (elevation < start.elevation && elevation < target.elevation) {
    return 0;
  }
  const dist = hexDistance(start, target);
  const lo = start.elevation > target.elevation ? target.elevation : start.elevation;
  const hi = start.elevation > target.elevation ? start.elevation : target.elevation;
  if ((dist === 1 && start.elevation < target.elevation) || edge) {
    // Feels like a hack, this apparently seems to coming out on wrong direction
    // but only in this case, or when doing edge calculations
    return (dist - currDist) / dist <= (elevation - lo + 1) / (hi - lo + 1) ? hindrance : 0;
  } else {
    return (dist - currDist) / dist < (elevation - lo + 1) / (hi - lo + 1) ? hindrance : 0;
  }
}

function hexElevationHindrance(start: Hex, target: Hex, hex: Hex): number {
  const ch = hex.counterLos.hindrance;
  if (hex.elevation > start.elevation && hex.elevation > target.elevation) {
    return 0 + ch;
  }
  const currDist =
    start.elevation > target.elevation ? hexDistance(start, hex) : hexDistance(hex, target);
  return elevationHindrance(start, target, hex.elevation, currDist, hex.hindrance) + ch;
}

function edgeElevationHindrance(start: Hex, target: Hex, hex: Hex, edge: Direction): number {
  const currDist =
    start.elevation > target.elevation ? hexDistance(start, hex) : hexDistance(hex, target) - 1;
  return elevationHindrance(start, target, hex.elevation, currDist, hex.edgeHindrance(edge), true);
}

function alongEdgeElevationHindrance(
  start: Hex,
  target: Hex,
  hex: Hex,
  edge: Direction,
  initialEdge: boolean
): number {
  const neighbor = hex.map.neighborAt(hex.coord, edge);
  let ch = 0;
  // If counters on both sides, apply effects
  if (!hex.counterLos.los && !neighbor?.counterLos?.los) {
    ch = Math.min(
      hex.counterLos.hindrance,
      neighbor ? neighbor.counterLos.hindrance : hex.counterLos.hindrance
    );
  } else if (hex.counterLos.los) {
    ch = neighbor?.counterLos?.hindrance || 0;
  } else {
    ch = hex.counterLos.hindrance;
  }
  const elevation = Math.min(
    hex.elevation,
    neighbor?.elevation === undefined ? hex.elevation : neighbor.elevation
  );
  if (elevation > start.elevation && elevation > target.elevation) {
    return 0;
  }
  const currDist =
    start.elevation > target.elevation ? hexDistance(start, hex) : hexDistance(hex, target);
  return (
    elevationHindrance(
      start,
      target,
      hex.elevation,
      currDist,
      Math.max(
        hex.alongEdgeHindrance(edge, initialEdge),
        hex.map
          .neighborAt(hex.coord, edge)
          ?.alongEdgeHindrance(normalDir(edge + 3), !initialEdge) || 0
      )
    ) + ch
  );
}

function elevationLos(
  start: Hex,
  target: Hex,
  elevation: number,
  currDist: number,
  los: boolean
): boolean {
  if (start.elevation === target.elevation && elevation === start.elevation) {
    return los;
  }
  if (elevation < start.elevation && elevation < target.elevation) {
    return false;
  }
  const dist = hexDistance(start, target);
  const lo = start.elevation > target.elevation ? target.elevation : start.elevation;
  const hi = start.elevation > target.elevation ? start.elevation : target.elevation;
  if (elevation > lo && elevation === hi) {
    return true;
  }
  const mid = elevation + (los ? 1 : 0);
  return ((dist - currDist) * (hi - lo)) / (currDist + 1) / (mid - lo) < 1;
}

function hexElevationLos(start: Hex, target: Hex, hex: Hex): boolean {
  if (hex.counterLos.los) {
    return true;
  }
  if (hex.elevation > start.elevation && hex.elevation > target.elevation) {
    return true;
  }
  const currDist =
    start.elevation > target.elevation ? hexDistance(start, hex) : hexDistance(hex, target);
  return elevationLos(start, target, hex.elevation, currDist, hex.los);
}

function edgeElevationLos(start: Hex, target: Hex, hex: Hex, edge: Direction): boolean {
  const currDist =
    start.elevation > target.elevation ? hexDistance(start, hex) : hexDistance(hex, target) - 1;
  return elevationLos(start, target, hex.elevation, currDist, hex.edgeLos(edge));
}

function alongEdgeElevationLos(
  start: Hex,
  target: Hex,
  hex: Hex,
  edge: Direction,
  initialEdge: boolean,
  finalEdge: boolean
): boolean {
  const neighbor = hex.map.neighborAt(hex.coord, edge);
  const counterLos = neighbor ? neighbor.counterLos.los : true;
  if (hex.counterLos.los && counterLos) {
    return true;
  }
  const elevation = Math.min(
    hex.elevation,
    neighbor?.elevation === undefined ? hex.elevation : neighbor.elevation
  );
  if (elevation > start.elevation && elevation > target.elevation) {
    return true;
  }
  const currDist =
    start.elevation > target.elevation ? hexDistance(start, hex) : hexDistance(hex, target);
  return elevationLos(
    start,
    target,
    elevation,
    currDist,
    hex.alongEdgeLos(edge, initialEdge, finalEdge) ||
      !!neighbor?.alongEdgeLos(normalDir(edge + 3), finalEdge, initialEdge)
  );
}

export function los(map: Map, start: Coordinate, end: Coordinate): TextLayout | boolean {
  if (start.x === end.x && start.y === end.y) {
    return true;
  }
  const hex0 = map.hexAt(start) as Hex;
  const hex1 = map.hexAt(end) as Hex;
  // Smoke in starting hex is special and always adds to hindrance:
  let hindrance = hex0.counterLos.hindrance;
  const path = losHexPath(map, hex0, hex1);
  for (let i = 0; i < path.length; i++) {
    const curr = path[i];
    if (curr.edge) {
      if (curr.long) {
        hindrance += alongEdgeElevationHindrance(
          hex0,
          hex1,
          curr.edgeHex as Hex,
          curr.edge,
          i === 0
        );
        const los = alongEdgeElevationLos(
          hex0,
          hex1,
          curr.edgeHex as Hex,
          curr.edge,
          i === 0,
          i === path.length - 2
        );
        if (los) {
          return false;
        }
      } else {
        if (i !== 0) {
          hindrance += edgeElevationHindrance(hex0, hex1, curr.edgeHex as Hex, curr.edge);
        }
        const los = edgeElevationLos(hex0, hex1, curr.edgeHex as Hex, curr.edge);
        const hex = path[i + 1].hex;
        if (los && (hex?.coord.x !== end.x || hex.coord.y !== end.y) && i !== 0) {
          return false;
        }
      }
    } else {
      hindrance += hexElevationHindrance(hex0, hex1, curr.hex as Hex);
      const block = hexElevationLos(hex0, hex1, curr.hex as Hex);
      if (block && (curr.hex?.coord.x !== end.x || curr.hex?.coord.y !== end.y)) {
        return false;
      }
    }
  }
  const lastHex = path[path.length - 1].hex as Hex;
  const offset = Math.max(map.counterDataAt(end).length * 5 - 5, 0);
  if (hindrance === 0) {
    return true;
  }
  return {
    value: hindrance,
    size: 80,
    x: lastHex.xOffset + offset,
    y: lastHex.yOffset + 24 - offset,
    style: { fill: "rgba(0,0,0,0.6)" },
  };
}
