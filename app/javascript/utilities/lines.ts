import { Coordinate } from "./commonTypes"

export type OrientationType = 0 | 1 | -1;
export const orientation: { [index: string]: OrientationType } = {
  Clockwise: 1, Straight: 0, CounterClockwise: -1
}

export function lineOrientation(p: Coordinate, q: Coordinate, r: Coordinate): OrientationType {
  const delta = 0.0000001 // deal with floating point precision issues
  const o = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)
  if (o < delta && o > -delta) { return orientation.Straight }
  return o > 0 ? orientation.Clockwise : orientation.CounterClockwise
}

export function lineDoesIntersect(p1: Coordinate, q1: Coordinate, p2: Coordinate, q2: Coordinate): boolean {
  const o1 = lineOrientation(p1, q1, p2) 
  const o2 = lineOrientation(p1, q1, q2) 
  const o3 = lineOrientation(p2, q2, p1) 
  const o4 = lineOrientation(p2, q2, q1)

  if (o1 !== o2 && o3 !== o4) { return true}
  if (o1 === 0 && p2.onSegment(p1, q1)) { return true }
  if (o2 === 0 && q2.onSegment(p1, q1)) { return true }
  if (o3 === 0 && p1.onSegment(p2, q2)) { return true }
  if (o4 === 0 && q1.onSegment(p2, q2)) { return true }
  return false
}
