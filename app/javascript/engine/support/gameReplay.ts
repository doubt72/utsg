import {
  Direction, Player, UnitStatus, VictoryHex, WeatherType, WindType
} from "../../utilities/commonTypes"
import Feature, { FeatureData } from "../Feature"
import Game from "../Game"
import Unit, { UnitData } from "../Unit"
import { GamePhase } from "./gamePhase"

export type GameReplayCounterData = {
  x: number,
  y: number,
  status?: UnitStatus,
  pinned?: boolean,
  routed?: boolean,
  split?: boolean,
  immobilized?: boolean,
  wreck?: boolean,
  jammed?: boolean,
  sponsonJammed?: boolean,
  weaponDestroyed?: boolean,
  sponsonDestroyed?: boolean,
  turretJammed?: boolean,
  abandoned?: boolean,
  facing: Direction,
  turretFacing?: Direction,

  uf: UnitData | FeatureData,
  children?: GameReplayCounterData[],
}

export type GameReplayState = {
  sequence: number,
  undone: boolean,

  state: string,
  turn: number,
  phase: GamePhase,
  currentInitiativePlayer: Player,
  initative: number,
  p1Score: number,
  p2Score: number,

  units: GameReplayCounterData[],
  vp: VictoryHex[],
  currentWeather: WeatherType,
  windSpeed: WindType,
  windDirection: Direction,
}

function unitToData(x: number, y: number, unit: Unit): GameReplayCounterData {
  const children: GameReplayCounterData[] = []
  for (const c of unit.children) {
    children.push(unitToData(x, y, c))
  }
  return {
    x, y, status: unit.status, pinned: unit.pinned, routed: unit.routed,
    split: unit.isSplit, immobilized: unit.isImmobilized, wreck: unit.isWreck,
    jammed: unit.jammed, sponsonJammed: unit.sponsonJammed,
    weaponDestroyed: unit.weaponDestroyed, sponsonDestroyed: unit.sponsonDestroyed,
    turretJammed: unit.turretJammed, abandoned: unit.isAbandoned, facing: unit.facing,
    turretFacing: unit.turretFacing, uf: unit.rawData, children
  }
}

function dataToUnit(data: GameReplayCounterData): Unit {
  const unit = new Unit(data.uf as UnitData)
  unit.setStatus(data.status as UnitStatus)
  if (data.split) { unit.split() }
  unit.pinned = !!data.pinned
  unit.routed = !!data.routed
  if (data.immobilized) { unit.immobilize() }
  if (data.wreck) { unit.wreck() }
  unit.jammed = !!data.jammed
  unit.sponsonJammed = !!data.sponsonJammed
  unit.weaponDestroyed = !!data.weaponDestroyed
  unit.sponsonDestroyed = !!data.sponsonDestroyed
  unit.turretJammed = !!data.turretJammed
  if (data.abandoned) { unit.abandon() }
  unit.facing = data.facing
  unit.turretFacing = data.turretFacing as Direction
  for (const c of data.children as GameReplayCounterData[]) {
    unit.children.push(dataToUnit(c))
  }
  return unit
}

export function copyGameData(game: Game, sequence: number, undone: boolean): GameReplayState {
  const units: GameReplayCounterData[] = []
  const vp: VictoryHex[] = []

  if (!undone) {
    for (let x = 0; x < game.scenario.map.width; x++) {
      for (let y = 0; y < game.scenario.map.height; y++) {
        for (const uf of game.scenario.map.units[y][x]) {
          if (uf.isFeature) {
            units.push({ x, y, facing: uf.facing, uf: uf.rawData })
          } else {
            const unit = uf as Unit
            units.push(unitToData(x, y, unit))
          }
        }
      }
    }
    for (const v of game.scenario.map.victoryHexes) {
      vp.push({ ...v })
    }
  }

  return {
    sequence,
    undone,

    state: game.state as string,
    turn: game.turn,
    phase: game.phase,
    currentInitiativePlayer: game.currentInitiativePlayer,
    initative: game.initiative,
    p1Score: game.playerOneScore, p2Score: game.playerTwoScore,

    units,
    vp,
    currentWeather: game.scenario.map.currentWeather,
    windSpeed: game.scenario.map.windSpeed,
    windDirection: game.scenario.map.windDirection,
  }
}

export function setGameData(game: Game, state: GameReplayState): void {
  game.state = state.state
  game.setTurn(state.turn)
  game.phase = state.phase
  game.setCurrentInitiativePlayer(state.currentInitiativePlayer)
  game.initiative = state.initative
  game.replay1Score = state.p1Score
  game.replay2Score = state.p2Score

  for (let x = 0; x < game.scenario.map.width; x++) {
    for (let y = 0; y < game.scenario.map.height; y++) {
      game.scenario.map.units[y][x] = []
    }
  }
  for (const u of state.units) {
    if (u.uf.ft === 1) {
      const feature = new Feature(u.uf)
      feature.facing = u.facing
      game.scenario.map.units[u.y][u.x].push(feature)
    } else {
      const unit = dataToUnit(u)
      game.scenario.map.units[u.y][u.x].push(unit)
    }
  }
  game.scenario.map.victoryHexes = state.vp
  game.scenario.map.currentWeather = state.currentWeather
  game.scenario.map.windSpeed = state.windSpeed
  game.scenario.map.windDirection = state.windDirection
}