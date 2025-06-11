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

function dataForUnit(
  loc: Coordinate, unit: Unit | Feature, index: number, showAllCounters: boolean, parent?: number
): [MapCounterData[], number] {
  let rc: MapCounterData[] = []
  if (unit.turreted && !unit.isWreck) {
    const type = unit.isWheeled ? markerType.WheeledHull : markerType.TrackedHull
    rc.push({ loc: loc, i: index, u: new Marker({
      type: type, nation: unit.nation, rotates: 1, facing: unit.facing, mk: 1, player_nation: unit.playerNation
    })})
  }
  rc.push({ loc: loc, u: unit, i: index++, pi: parent })
  if (showAllCounters) { rc = rc.concat(addMarkers(loc, unit, index)) }
  const parentIndex = index - 1
  for (let i = 0; i < unit.children.length; i++) {
    const [subList, newIndex] = dataForUnit(loc, unit.children[i], index, showAllCounters, parentIndex)
    index = newIndex
    rc = rc.concat(subList)
  }
  return [rc, index]
}

function addMarkers(loc: Coordinate, unit: Unit | Feature, index: number): MapCounterData[] {
  const rc: MapCounterData[] = []
  const rotates = unit.rotates ? 1 : 0
  const facing = unit.turreted && !unit.isWreck ? unit.turretFacing : unit.facing
  const markerTypes: MarkerType[] = []
  if (!unit.isFeature && (unit as Unit).eliteCrew > 0) { markerTypes.push(markerType.EliteCrew) }
  if (!unit.isFeature && (unit as Unit).eliteCrew < 0) { markerTypes.push(markerType.GreenCrew) }
  if (unit.immobilized) { markerTypes.push(markerType.Immobilized) }
  if (unit.turretJammed) { markerTypes.push(markerType.TurretJammed) }
  if (unit.jammed && unit.turreted) { markerTypes.push(markerType.Jammed) }
  if (unit.weaponBroken) { markerTypes.push(markerType.WeaponBroken) }
  if (unit.isTired) { markerTypes.push(markerType.Tired) }
  if (unit.isPinned) { markerTypes.push(markerType.Pinned) }
  if (unit.isExhausted) { markerTypes.push(markerType.Exhausted) }
  if (unit.isActivated) { markerTypes.push(markerType.Activated) }
  markerTypes.forEach(t => rc.push({ loc: loc, u: new Marker({type: t, rotates, facing, mk: 1}), i: index }))
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
    const unit = list[index]
    if (unit.isFeature) {
      newList.push(unit)
      continue
    }
    const next = list[index + 1]
    if (next && ((unit.canCarrySupport && next.uncrewedSW) || (unit.canHandle && next.crewed)) &&
        unit.children.length === 0) {
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
    const unit = list[index]
    if (unit.isFeature) {
      newList.push(unit)
      continue
    }
    const next = list[index + 1]
    if (next && unit.canTowUnit(next as Unit)) {
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
    const unit = list[index]
    if (unit.isFeature) {
      newList.push(unit)
      continue
    }
    const next = list[index + 1]
    const next2 = list[index + 2]
    if (next && next2) {
      if (unit.canTransportUnit(next as Unit)) {
        unit.children.push(next as Unit)
        next.parent = unit as Unit
        index++
        if (unit.canTransportUnit(next2 as Unit)) {
          unit.children.push(next2 as Unit)
          next2.parent = unit as Unit
          index++
        }
      }
    } else if (next && unit.canTransportUnit(next as Unit)) {
      unit.children.push(next as Unit)
      next.parent = unit as Unit
      index++
    }
    newList.push(unit)
  }
  return newList
}

function sortValues(unit: Unit | Feature): number {
  if (unit.isFeature) { return 0 }
  return {
    sw: 1, gun: 1,
    sqd: 2, tm: 2,
    ldr: 3,
    cav: 4, ht: 4, truck: 4,
    tank: 5, spg: 5, ac: 5,
    other: 6,
  }[(unit as Unit).type] ?? 9
}

function sortStack(list: (Unit | Feature)[]): (Unit | Feature)[] {
  list.forEach(u => {
    sortStack(u.children)
  })
  return list.sort((a, b) => {
    const av = sortValues(a)
    const bv = sortValues(b)
    if (bv === av) { return 0 }
    return av > bv ? 1 : -1
  })
}