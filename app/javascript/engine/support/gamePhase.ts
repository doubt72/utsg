import { togglePlayer } from "../../utilities/utilities"
import Game from "../Game"
import GameAction, { GameActionData, GameActionPhaseChange } from "../GameAction"

export type GamePhase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export const gamePhaseType: { [index: string]: GamePhase } = {
  Deployment: 0, PrepRally: 1, PrepPrecip: 2, Main: 3, CleanupCloseCombat: 4,
  CleanupOverstack: 5, CleanupStatus: 6, CleanupSmoke: 7, CleanupFire: 8,
  CleanupWeather: 9,
}

export function checkPhase(game: Game, backendSync: boolean) {
  if (backendSync) { return }
  const oldPhase = game.phase
  const oldTurn = game.turn
  const phaseData: GameActionPhaseChange = {
    old_phase: oldPhase, new_phase: gamePhaseType.Deployment,
    old_turn: oldTurn, new_turn: oldTurn, new_player: game.currentPlayer,
  }
  const data: GameActionData = {
    player: game.currentPlayer, user: game.currentUser,
    data: { action: "phase", phase_data: phaseData, old_initiative: game.initiative }
  }
  if (oldPhase == gamePhaseType.Deployment) {
    Deployment(game, backendSync, data)
  } else if (oldPhase === gamePhaseType.PrepRally) {
    PrepRally(game, backendSync, data)
  } else if (oldPhase === gamePhaseType.PrepPrecip) {
    PrepPrecip(game, backendSync, data)
  } else if (oldPhase === gamePhaseType.Main) {
    Main(game, backendSync, data)
  } else if (oldPhase === gamePhaseType.CleanupCloseCombat) {
    CleanupCloseCombat(game, backendSync, data)
  } else if (oldPhase === gamePhaseType.CleanupOverstack) {
    CleanupOverstack(game, backendSync, data)
  } else if (oldPhase === gamePhaseType.CleanupStatus) {
    CleanupStatus(game, backendSync, data)
  } else if (oldPhase === gamePhaseType.CleanupSmoke) {
    CleanupSmoke(game, backendSync, data)
  } else if (oldPhase === gamePhaseType.CleanupFire) {
    CleanupFire(game, backendSync, data)
  } else if (oldPhase === gamePhaseType.CleanupWeather) {
    CleanupWeather(game, backendSync, data)
  }
}

function Deployment(game: Game, backendSync: boolean, data: GameActionData): void {
  const phaseData: GameActionPhaseChange = data.data.phase_data as GameActionPhaseChange
  const oldTurn = game.turn
  const [count, initialCount] = game.reinforcementsCount
  if (count === 0) {
    if (initialCount === 0) {
      game.executeAction(new GameAction({
        player: game.currentPlayer, user: game.currentUser, data: {
          action: "info", message: "no units to deploy, skipping phase",
          old_initiative: game.initiative,
        }
      }, game), backendSync)
    }
    if (oldTurn === 0) {
      phaseData.new_phase = gamePhaseType.Deployment
      if (game.currentPlayer === game.scenario.firstDeploy) {
        phaseData.new_player = togglePlayer(game.currentPlayer)
      } else {
        phaseData.new_player = game.scenario.firstAction
        phaseData.new_turn = 1
      }
    } else {
      phaseData.new_player = togglePlayer(game.currentPlayer)
      phaseData.new_phase = game.currentPlayer === game.scenario.firstAction ?
        gamePhaseType.Deployment : gamePhaseType.PrepRally
    }
    game.executeAction(new GameAction(data, game), backendSync)
    game.closeReinforcementPanel = true
  }
}

function PrepRally(game: Game, backendSync: boolean, data: GameActionData): void {
  const phaseData: GameActionPhaseChange = data.data.phase_data as GameActionPhaseChange
  const oldPhase = game.phase
  if (game.scenario.map.anyBrokenUnits(game.currentPlayer)) {
    return
  }
  game.executeAction(new GameAction({
    player: game.currentPlayer, user: game.currentUser, data: {
      action: "info", message: "no broken units or jammed weapons, skipping phase",
      old_initiative: game.initiative,
    }
  }, game), backendSync)
  if (game.currentPlayer === game.scenario.firstAction) {
    // TODO: switch to initiative player
    phaseData.new_player = togglePlayer(game.currentPlayer)
    phaseData.new_phase = oldPhase
  } else {
    phaseData.new_player = togglePlayer(game.currentPlayer)
    phaseData.new_phase = gamePhaseType.PrepPrecip
  }
  game.executeAction(new GameAction(data, game), backendSync)
}

function PrepPrecip(game: Game, backendSync: boolean, data: GameActionData): void {
  const phaseData: GameActionPhaseChange = data.data.phase_data as GameActionPhaseChange
  const oldPhase = game.phase
  if (game.scenario.map.anyPrecip()) {
    return
  }
  game.executeAction(new GameAction({
    player: game.currentPlayer, user: game.currentUser, data: {
      action: "info", message: "no precipitation in game.scenario, skipping check",
      old_initiative: game.initiative,
    }
  }, game), backendSync)
  if (game.currentPlayer === game.scenario.firstAction) {
    phaseData.new_player = togglePlayer(game.currentPlayer)
    phaseData.new_phase = oldPhase
  } else {
    phaseData.new_player = togglePlayer(game.currentPlayer)
    phaseData.new_phase = gamePhaseType.Main

  }
  game.executeAction(new GameAction(data, game), backendSync)
}

function Main(game: Game, backendSync: boolean, data: GameActionData): void {
  const phaseData: GameActionPhaseChange = data.data.phase_data as GameActionPhaseChange
  let index = game.lastActionIndex - 1
  let previousAction = game.actions[index--]
  while (previousAction && previousAction.undone) {
    previousAction = game.actions[index--]
  }
  if (game.lastAction?.type === "pass" && previousAction?.type === "pass") {
    game.executeAction(new GameAction({
      player: game.currentPlayer, user: game.currentUser, data: {
        action: "info", message: "both players have passed, ending phase",
        old_initiative: game.initiative,
      }
    }, game), backendSync)
    phaseData.new_phase = gamePhaseType.CleanupCloseCombat
    game.executeAction(new GameAction(data, game), backendSync)
  }
}

function CleanupCloseCombat(game: Game, backendSync: boolean, data: GameActionData): void {
  const phaseData: GameActionPhaseChange = data.data.phase_data as GameActionPhaseChange
  if (game.scenario.map.anyCloseCombat()) {
    return
  }
  game.executeAction(new GameAction({
    player: game.currentPlayer, user: game.currentUser, data: {
      action: "info", message: "no units in contact, skipping close combat",
      old_initiative: game.initiative,
    }
  }, game), backendSync)
  phaseData.new_phase = gamePhaseType.CleanupOverstack
  game.executeAction(new GameAction(data, game), backendSync)
}

function CleanupOverstack(game: Game, backendSync: boolean, data: GameActionData): void {
  const phaseData: GameActionPhaseChange = data.data.phase_data as GameActionPhaseChange
  const oldPhase = game.phase
  if (game.scenario.map.anyOverstackedUnits(game.currentPlayer)) {
    return
  }
  phaseData.new_player = togglePlayer(game.currentPlayer)
  if (game.currentPlayer === game.initiative) {
    phaseData.new_phase = oldPhase
  } else {
    phaseData.new_phase = gamePhaseType.CleanupStatus
  }
  game.executeAction(new GameAction({
    player: game.currentPlayer, user: game.currentUser, data: {
      action: "info", message: "no units overstacked, skipping overstack reduction",
      old_initiative: game.initiative,
    }
  }, game), backendSync)
  phaseData.new_phase = gamePhaseType.CleanupStatus
  game.executeAction(new GameAction(data, game), backendSync)
}

function CleanupStatus(game: Game, backendSync: boolean, data: GameActionData): void {
  const phaseData: GameActionPhaseChange = data.data.phase_data as GameActionPhaseChange
  if (game.scenario.map.needsStatusUpdate()) {
    game.executeAction(new GameAction({
      player: game.currentPlayer, user: game.currentUser, data: {
        action: "update_status", old_initiative: game.initiative,
      }
    }, game), backendSync)
    return
  }
  game.executeAction(new GameAction({
    player: game.currentPlayer, user: game.currentUser, data: {
      action: "info", message: "done updating status",
      old_initiative: game.initiative,
    }
  }, game), backendSync)
  phaseData.new_phase = gamePhaseType.CleanupSmoke
  game.executeAction(new GameAction(data, game), backendSync)
}

function CleanupSmoke(game: Game, backendSync: boolean, data: GameActionData): void {
  const phaseData: GameActionPhaseChange = data.data.phase_data as GameActionPhaseChange
  if (game.scenario.map.anySmoke()) {
    return
  }
  game.executeAction(new GameAction({
    player: game.currentPlayer, user: game.currentUser, data: {
      action: "info", message: "no smoke on map, skipping smoke dissapation check",
      old_initiative: game.initiative,
    }
  }, game), backendSync)
  phaseData.new_phase = gamePhaseType.CleanupFire
  game.executeAction(new GameAction(data, game), backendSync)
}

function CleanupFire(game: Game, backendSync: boolean, data: GameActionData): void {
  const phaseData: GameActionPhaseChange = data.data.phase_data as GameActionPhaseChange
  if (game.scenario.map.anyFire()) {
    return
  }
  game.executeAction(new GameAction({
    player: game.currentPlayer, user: game.currentUser, data: {
      action: "info", message: "no units in contact, skipping close combat",
      old_initiative: game.initiative,
    }
  }, game), backendSync)
  phaseData.new_phase = gamePhaseType.CleanupWeather
  game.executeAction(new GameAction(data, game), backendSync)
}

function CleanupWeather(game: Game, backendSync: boolean, data: GameActionData): void {
  const phaseData: GameActionPhaseChange = data.data.phase_data as GameActionPhaseChange
  const oldTurn = game.turn
  if (game.scenario.map.anyVariableWeather()) {
    return
  }
  game.executeAction(new GameAction({
    player: game.currentPlayer, user: game.currentUser, data: {
      action: "info", message: "no units in contact, skipping close combat",
      old_initiative: game.initiative,
    }
  }, game), backendSync)
  if (oldTurn === game.scenario.turns) {
    // TODO: finish game
  } else {
    phaseData.new_phase = gamePhaseType.Deployment
    phaseData.new_player = game.scenario.firstDeploy
    phaseData.new_turn = oldTurn + 1
    game.executeAction(new GameAction(data, game), backendSync)
  }
}