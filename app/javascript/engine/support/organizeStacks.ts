import { Coordinate, markerType, MarkerType } from "../../utilities/commonTypes";
import Feature from "../Feature";
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
      map.units[y][x] = renormalize(list)
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
      map.units[y][x] = sortStack(list)
    }
  }
}

export function sortValues(unit: Unit | Feature): number {
  if (unit.isFeature) { return 0 }
  const u = unit as Unit
  return {
    other: 0, sw: 1, gun: 2, sqd: 3, tm: 4, ldr: 5, cav: 6, truck: 7, ht: 8, ac: 9,
    spg: 10, tank: 11,
  }[(u).type] ?? 99
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

function renormalize(list: (Unit | Feature)[]): (Unit | Feature)[] {
  return sortStack(
    loadVehicles(
      pairTowedWeapons(
        pairCrewedWeapons(
          unshiftFeatures(list)
        )
      )
    )
  )
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

function sortStack(list: (Unit | Feature)[]): (Unit | Feature)[] {
  list.forEach(u => {
    if (u.isFeature) { return }
    const unit = u as Unit
    sortStack(unit.children)
  })
  return list.sort((a, b) => {
    const av = sortValues(a)
    const bv = sortValues(b)
    if (bv === av) { return 0 }
    return av > bv ? 1 : -1
  })
}