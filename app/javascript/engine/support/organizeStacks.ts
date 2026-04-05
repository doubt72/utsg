import { Coordinate, featureType, markerType, MarkerType } from "../../utilities/commonTypes";
import Feature from "../Feature";
import Game from "../Game";
import Map from "../Map";
import Marker from "../Marker";
import Unit from "../Unit";

export type MapCounterData = {
  loc: Coordinate, u: Marker | Unit | Feature, i?: number, pi?: number
}

export default function organizeStacks(map: Map) {
  for (let x = 0; x < map.width; x++) {
    for (let y = 0; y < map.height; y++) {
      const list = map.units[y][x]
      map.units[y][x] = renormalize(map.game as Game, list)
    }
  }
}

export function countersFromUnits(
  loc: Coordinate, list: (Unit | Feature)[], showAllCounters: boolean
): MapCounterData[] {
  let rc: MapCounterData[] = []
  let unitIndex = 0
  for (let i = 0; i < list.length; i++) {
    const unit = list[i]
    const [subList, newIndex] = dataForUnit(loc, unit, unitIndex, showAllCounters)
    unitIndex = newIndex
    rc = rc.concat(subList)
  }
  return rc
}

export function sortStacks(map: Map) {
  for (let x = 0; x < map.width; x++) {
    for (let y = 0; y < map.height; y++) {
      const list = map.units[y][x]
      map.units[y][x] = sortStack(map.game as Game, list)
    }
  }
}

function sortValues(game: Game, unit: Unit | Feature): number {
  if (unit.isFeature && unit.type === featureType.Fire) { return 999 }
  if (unit.isFeature) { return 0 }
  const side = unit.playerNation === game?.playerOneNation ? 0 : 100
  const u = unit as Unit
  if (u.operated) { return 0 }
  return ({
    other: 1, sw: 2, gun: 3, sqd: 4, tm: 5, ldr: 6, cav: 7, truck: 8, ht: 9, ac: 10,
    spg: 11, tank: 12,
  }[u.type] ?? 99) + side
}

function dataForUnit(
  loc: Coordinate, uf: Unit | Feature, index: number, showAllCounters: boolean, parent?: number
): [MapCounterData[], number] {
  let rc: MapCounterData[] = []
  const unit = uf as Unit
  if (!uf.isFeature && unit.turreted && !unit.isWreck) {
    const type = unit.isWheeled ? markerType.WheeledHull : markerType.TrackedHull
    const marker = new Marker({
      id: uf.id, type: type, nation: uf.nation, rotates: 1, facing: uf.facing, mk: 1,
      player_nation: uf.playerNation
    })
    marker.turret = unit
    if (unit.ghost) { marker.ghost = true }
    rc.push({ loc: loc, i: index, u: marker })
  }
  rc.push({ loc: loc, u: uf, i: index++, pi: parent })
  if (showAllCounters) { rc = rc.concat(addMarkers(loc, uf, index)) }
  if (!uf.isFeature) {
    const parentIndex = index - 1
    for (let i = 0; i < unit.children.length; i++) {
      const [subList, newIndex] = dataForUnit(loc, unit.children[i], index, showAllCounters, parentIndex)
      index = newIndex
      rc = rc.concat(subList)
    }
  }
  return [rc, index]
}

function addMarkers(loc: Coordinate, uf: Unit | Feature, index: number): MapCounterData[] {
  const rc: MapCounterData[] = []
  const rotates = uf.rotates ? 1 : 0
  const unit = uf as Unit
  const facing = !uf.isFeature && unit.turreted && !unit.isWreck ? unit.turretFacing : uf.facing
  const markerTypes: MarkerType[] = []
  if (!uf.isFeature) {
    if (unit.eliteCrew > 0) { markerTypes.push(markerType.EliteCrew) }
    if (unit.eliteCrew < 0) { markerTypes.push(markerType.GreenCrew) }
    if (unit.immobilized) { markerTypes.push(markerType.Immobilized) }
    if (unit.turretJammed) { markerTypes.push(markerType.TurretJammed) }
    if (unit.jammed && unit.isVehicle) { markerTypes.push(markerType.Jammed) }
    if (unit.weaponDestroyed) { markerTypes.push(markerType.WeaponBroken) }
    if (unit.sponsonJammed) { markerTypes.push(markerType.SponsonJammed) }
    if (unit.sponsonDestroyed) { markerTypes.push(markerType.SponsonBroken) }
    if (unit.routed) { markerTypes.push(markerType.Routed) }
    if (unit.isTired) { markerTypes.push(markerType.Tired) }
    if (unit.pinned) { markerTypes.push(markerType.Pinned) }
    if (unit.isExhausted) { markerTypes.push(markerType.Exhausted) }
    if (unit.isActivated) { markerTypes.push(markerType.Activated) }
  }
  markerTypes.forEach(t => rc.push(
    { loc: loc, u: new Marker({id: uf.id, type: t, rotates, facing, mk: 1}), i: index }
  ))
  return rc
}

function renormalize(game: Game, list: (Unit | Feature)[]): (Unit | Feature)[] {
  return sortStack(game,
    loadVehicles(
      pairTowedWeapons(
        pairCrewedWeapons(
          unshiftFeatures(
            collapseSmoke(list) // irreversable, but okay since only happens when laying smoke
          )
        )
      )
    )
  )
}

function collapseSmoke(list: (Unit | Feature)[]): (Unit | Feature)[] {
  const totalSmoke = list.filter(u => u.isFeature && u.name === "Smoke").reduce((sum, s) => {
    return sum + (s.hindrance ?? 0)
  }, 0)
  const newList: (Unit | Feature)[] = list.filter(u => !u.isFeature || u.name !== "Smoke")
  if (totalSmoke === 0) { return newList }

  const id = list.filter(u => u.isFeature && u.name === "Smoke")[0].id
  return newList.concat([new Feature(
    { ft: 1, t: featureType.Smoke, n: "Smoke", i: "smoke", h: totalSmoke, id }
  )])
}

function unshiftFeatures(list: (Unit | Feature)[]): (Unit | Feature)[] {
  return list.filter(f => f.isFeature).concat(list.filter(u => !u.isFeature))
}

function pairCrewedWeapons(list: (Unit | Feature)[]): (Unit | Feature)[] {
  const newList: (Unit | Feature)[] = []
  for (let index = 0; index < list.length; index++) {
    const uf = list[index]
    if (uf.isFeature) {
      newList.push(uf)
      continue
    }
    const unit = uf as Unit
    const next = list[index + 1] as Unit
    if (next && !next.isFeature &&
        ((unit.canCarrySupport && next.uncrewedSW && !(unit.leader &&
          next.baseMovement < 0)) || (unit.canHandle && next.crewed)) && unit.children.length === 0) {
      unit.children.push(next as Unit)
      next.parent = unit as Unit
      index++
    }
    newList.push(unit)
  }
  return newList
}

function pairTowedWeapons(list: (Unit | Feature)[]): (Unit | Feature)[] {
  const newList: (Unit | Feature)[] = []
  for (let index = 0; index < list.length; index++) {
    const uf = list[index]
    if (uf.isFeature) {
      newList.push(uf)
      continue
    }
    const unit = uf as Unit
    const next = list[index + 1] as Unit
    if (next && !next.isFeature && unit.canTowUnit(next as Unit)) {
      unit.children.push(next as Unit)
      next.parent = unit as Unit
      index++
    }
    newList.push(unit)
  }
  return newList
}

function loadVehicles(list: (Unit | Feature)[]): (Unit | Feature)[] {
  const newList: (Unit | Feature)[] = []
  for (let index = 0; index < list.length; index++) {
    const uf = list[index]
    if (uf.isFeature) {
      newList.push(uf)
      continue
    }
    const unit = uf as Unit
    const next = list[index + 1] as Unit
    const next2 = list[index + 2] as Unit
    if (next && next2 && !next.isFeature && !next2.isFeature) {
      if (unit.canTransportUnit(next as Unit)) {
        unit.children.push(next as Unit)
        next.parent = unit
        index++
        if (unit.canTransportUnit(next2)) {
          unit.children.push(next2)
          next2.parent = unit
          index++
        }
      }
    } else if (next && !next.isFeature && unit.canTransportUnit(next)) {
      unit.children.push(next)
      next.parent = unit
      index++
    }
    newList.push(unit)
  }
  return newList
}

function sortStack(game: Game, list: (Unit | Feature)[]): (Unit | Feature)[] {
  list.forEach(u => {
    if (u.isFeature) { return }
    const unit = u as Unit
    sortStack(game, unit.children)
  })
  return list.sort((a, b) => {
    const av = sortValues(game, a)
    const bv = sortValues(game, b)
    if (bv === av) { return 0 }
    return av > bv ? 1 : -1
  })
}