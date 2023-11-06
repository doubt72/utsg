const Point = class {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  onSegment(p, q) 
  { 
    const delta = 0.0000001 // deal with floating point precision issues
    if (this.x <= Math.max(p.x, q.x) + delta && this.x >= Math.min(p.x, q.x) - delta &&
        this.y <= Math.max(p.y, q.y) + delta && this.y >= Math.min(p.y, q.y) - delta) {
      return true
    }
    return false 
  } 
}

const orientation = (p, q, r) => {
  const delta = 0.0000001 // deal with floating point precision issues
  const o = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)
  if (o < delta && o > -delta) { return 0 }
  return o > 0 ? 1 : -1
}

const doesIntersect = (p1, q1, p2, q2) => {
  let o1 = orientation(p1, q1, p2) 
  let o2 = orientation(p1, q1, q2) 
  let o3 = orientation(p2, q2, p1) 
  let o4 = orientation(p2, q2, q1)

  if (o1 !== o2 && o3 !== o4) { return true}
  if (o1 === 0 && p2.onSegment(p1, q1)) { return true }
  if (o2 === 0 && q2.onSegment(p1, q1)) { return true }
  if (o3 === 0 && p1.onSegment(p2, q2)) { return true }
  if (o4 === 0 && q1.onSegment(p2, q2)) { return true }
  return false
}

export { Point, orientation, doesIntersect }