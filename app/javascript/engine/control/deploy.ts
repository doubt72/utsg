import { DeployHexes } from "../Map"

export function deployHex(hexes: DeployHexes, x: number, y: number): boolean {
  for (const h of hexes) {
    let xMatch = false
    let yMatch = false

    if (typeof h[0] === "string" && h[0].includes("-")) {
      const [lo, hi] = h[0].split("-")
      if (x >= Number(lo) && x <= Number(hi)) { xMatch = true }
    } else if (h[0] === "*") {
      xMatch = true
    } else if (x === h[0]) {
      xMatch = true
    }

    if (typeof h[1] === "string" && h[1].includes("-")) {
      const [lo, hi] = h[1].split("-")
      if (y >= Number(lo) && y <= Number(hi)) { yMatch = true }
    } else if (h[1] === "*") {
      yMatch = true
    } else if (y === h[1]) {
      yMatch = true
    }

    if (xMatch && yMatch) { return true }
  }
  return false
}

export function toggleHex(
  hexes: DeployHexes, newX: number, newY: number, xMax: number, yMax: number
) : DeployHexes {
  const rc: DeployHexes = []
  for (let y = 0; y <= yMax; y++) {
    const starts = []
    const ends = []
    for (let x = 0; x <= xMax; x++) {
      const current = checkToggle(hexes, x, y, newX, newY) 
      if (x === 0 && current) {
        starts.push(x)
      } else {
        const last = checkToggle(hexes, x - 1, y, newX, newY)
        if (current && !last) { starts.push(x) }
        if (!current && last) { ends.push(x-1) }
        if (x === xMax && current) { ends.push(x) }
      }
    }
    for (let i = 0; i < starts.length; i++) {
      const start = starts[i]
      const end = ends[i]
      rc.push([start === 0 && end === xMax ? "*" : `${start}-${end}`,y])
    }
  }
  return collapseColumns(rc, yMax).map(h => {
    if (typeof h[0] === "string") {
      const [lo, hi] = h[0].split("-")
      if (lo === hi) {
        return [Number(lo), h[1]]
      } else {
        return h
      }
    } else {
      return h
    }
  })
}

function checkToggle(
  hexes: DeployHexes, x: number, y: number, newX: number, newY: number
): boolean {
  return deployHex(hexes, x, y) !== (x === newX && y === newY)
}

// Only really collapses full columns, could do something more efficient for partials
function collapseColumns(hexes: DeployHexes, yMax: number): DeployHexes {
  const rc: DeployHexes = []
  const exclude: string[] = []
  for (const h of hexes) {
    const check = h[0]
    if (typeof check === "string" && check.includes("-")) {
      if (exclude.includes(check)) { continue }
      let count = 0
      for (const hh of hexes) {
        if (hh[0] === check) { count++ }
      }
      if (count === yMax + 1) {
        rc.push([check, "*"])
        exclude.push(check)
        continue
      }
    }
    rc.push(h)
  }
  return rc
}