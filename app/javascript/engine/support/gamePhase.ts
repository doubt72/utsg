import { formatNation } from "../../utilities/graphics"
import { otherPlayer } from "../../utilities/utilities"
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
    old_phase: oldPhase, new_phase: oldPhase, messages: [],
    old_turn: oldTurn, new_turn: oldTurn, new_player: game.currentPlayer,
  }
  const data: GameActionData = {
    player: game.currentPlayer, user: game.currentUser,
    data: { action: "phase", phase_data: phaseData, old_initiative: game.initiative }
  }
  if (oldPhase == gamePhaseType.Deployment) {
    deployment(game, data)
  } else if (oldPhase === gamePhaseType.PrepRally) {
    prepRally(game, data)
  } else if (oldPhase === gamePhaseType.PrepPrecip) {
    prepPrecip(game, data)
  } else if (oldPhase === gamePhaseType.Main) {
    main(game, data)
  } else if (oldPhase === gamePhaseType.CleanupCloseCombat) {
    cleanupCloseCombat(game, data)
  } else if (oldPhase === gamePhaseType.CleanupOverstack) {
    cleanupOverstack(game, data)
  } else if (oldPhase === gamePhaseType.CleanupStatus) {
    cleanupStatus(game, data)
  } else if (oldPhase === gamePhaseType.CleanupSmoke) {
    cleanupSmoke(game, data)
  } else if (oldPhase === gamePhaseType.CleanupFire) {
    cleanupFire(game, data)
  } else if (oldPhase === gamePhaseType.CleanupWeather) {
    cleanupWeather(game, data)
  }
  if (oldPhase !== phaseData.new_phase || oldTurn !== phaseData.new_turn ||
      data.player !== phaseData.new_player) {
    game.executeAction(new GameAction(data, game), backendSync)
    if (phaseData.messages[phaseData.messages.length - 1] === "game complete") {
      let winner = game.currentInitiativePlayer
      if (game.playerOneScore !== game.playerTwoScore) {
        winner = game.playerOneScore > game.playerTwoScore ? 1 : 2
      }
      game.executeAction(new GameAction({
        player: winner, user: game.currentUser, data: {
          action: "finish", old_initiative: game.initiative,
        }
      }, game), backendSync)
    }
  }
  if (phaseData.messages[phaseData.messages.length - 1] === "starting status update") {
    const targets = game.scenario.map.allStatusChanges()
    game.executeAction(new GameAction({
      player: phaseData.new_player, user: game.currentUser, data: {
        action: "status_update", old_initiative: game.initiative,
        target: targets,
      }
    }, game), backendSync)
  }
}

function deployment(game: Game, data: GameActionData): void {
  const phaseData: GameActionPhaseChange = data.data.phase_data as GameActionPhaseChange
  const oldTurn = phaseData.new_turn
  const player = phaseData.new_player
  const [count, initialCount] = game.reinforcementsCount(oldTurn, player)
  if (count === 0) {
    if (initialCount === 0) {
      phaseData.messages.push(`no units to deploy, skipping ${formatNation(game, player)} player`)
    }
    phaseData.messages.push(`${formatNation(game, player)} deployment complete`)
    if (oldTurn === 0) {
      phaseData.new_phase = gamePhaseType.Deployment
      if (phaseData.new_player === game.scenario.firstDeploy) {
        phaseData.new_player = otherPlayer(phaseData.new_player)
      } else {
        phaseData.new_player = game.scenario.firstAction
        phaseData.new_turn = 1
      }
    } else {
      phaseData.new_player = otherPlayer(phaseData.new_player)
      phaseData.new_phase = player === game.currentInitiativePlayer ?
        gamePhaseType.Deployment : gamePhaseType.PrepRally
    }
    if (phaseData.new_phase === gamePhaseType.Deployment) {
      phaseData.messages.push(`starting ${formatNation(game, phaseData.new_player)} deployment`)
      deployment(game, data)
    } else {
      phaseData.messages.push(`starting ${formatNation(game, phaseData.new_player)} rally`)
      if (game.scenario.map.anyUnitsCanRally(phaseData.new_player)) {
        `no rallyable broken units or jammed weapons, skipping ${formatNation(game, phaseData.new_player)} rally`
      }
      prepRally(game, data)
    }
    game.closeReinforcementPanel = true
  }
}

function prepRally(game: Game, data: GameActionData): void {
  const phaseData: GameActionPhaseChange = data.data.phase_data as GameActionPhaseChange
  const oldPhase = phaseData.new_phase
  const player = phaseData.new_player
  if (game.scenario.map.anyUnitsCanRally(player)) {
    if (game.lastAction?.type !== "rally_pass") { return }
  }
  phaseData.messages.push(`${formatNation(game, player)} rally complete`)
  if (player === game.currentInitiativePlayer) {
    phaseData.new_player = otherPlayer(player)
    phaseData.new_phase = oldPhase
  } else {
    phaseData.new_player = otherPlayer(player)
    phaseData.new_phase = gamePhaseType.PrepPrecip
  }
  if (phaseData.new_phase === gamePhaseType.PrepRally) {
    phaseData.messages.push(`starting ${formatNation(game, phaseData.new_player)} rally`)
    if (game.scenario.map.anyUnitsCanRally(phaseData.new_player)) {
      `no rallyable broken units or jammed weapons, skipping ${formatNation(game, phaseData.new_player)} rally`
    }
    prepRally(game, data)
  } else {
    phaseData.messages.push("starting precipitation check")
    prepPrecip(game, data)
  }
}

function prepPrecip(game: Game, data: GameActionData): void {
  const phaseData: GameActionPhaseChange = data.data.phase_data as GameActionPhaseChange
  if (game.scenario.map.anyPrecip()) {
    if (game.lastAction?.type !== "precipitation_check") { return }
  } else {
    phaseData.messages.push("no precipitation in scenario, skipping")
  }
  phaseData.messages.push("precipitation check complete")
  phaseData.messages.push("starting main phase")
  phaseData.new_player = game.currentInitiativePlayer
  phaseData.new_phase = gamePhaseType.Main
  // No need to check main phase, never skipped
}

function main(game: Game, data: GameActionData): void {
  const phaseData: GameActionPhaseChange = data.data.phase_data as GameActionPhaseChange
  let index = game.lastActionIndex - 1
  let previousAction = game.actions[index--]
  while (previousAction && previousAction.undone) {
    previousAction = game.actions[index--]
  }
  if (game.lastAction?.type === "pass" && previousAction?.type === "pass") {
    phaseData.messages.push("both players have passed, main phase complete")
    phaseData.new_player = game.currentInitiativePlayer
    phaseData.new_phase = gamePhaseType.CleanupCloseCombat
    phaseData.messages.push("starting close combat")
    game.addCloseCombatChecks()
    if (!game.anyCloseCombatLeft) {
      phaseData.messages.push("no units in contact, skipping")
    }
    cleanupCloseCombat(game, data)
  }
}

function cleanupCloseCombat(game: Game, data: GameActionData): void {
  const phaseData: GameActionPhaseChange = data.data.phase_data as GameActionPhaseChange
  if (game.anyCloseCombatLeft) { return }
  phaseData.messages.push("close combat complete")
  phaseData.new_player = game.currentInitiativePlayer
  phaseData.new_phase = gamePhaseType.CleanupOverstack
  phaseData.messages.push(`starting overstack check for ${formatNation(game, phaseData.new_player)}`)
  if (!game.scenario.map.anyOverstackedUnits(phaseData.new_player)) {
      phaseData.messages.push("no overstacked units, skipping")
  }
  cleanupOverstack(game, data)
}

function cleanupOverstack(game: Game, data: GameActionData): void {
  const phaseData: GameActionPhaseChange = data.data.phase_data as GameActionPhaseChange
  const oldPhase = phaseData.new_phase
  const player = phaseData.new_player
  if (game.scenario.map.anyOverstackedUnits(player)) { return }
  phaseData.messages.push(`overstack check complete for ${formatNation(game, player)}`)
  phaseData.new_player = otherPlayer(player)
  if (player === game.internalInitiativePlayer) {
    phaseData.new_phase = oldPhase
    phaseData.messages.push(`starting overstack check for ${formatNation(game, phaseData.new_player)}`)
    if (!game.scenario.map.anyOverstackedUnits(phaseData.new_player)) {
        phaseData.messages.push("no overstacked units, skipping")
    }
    cleanupOverstack(game, data)
  } else {
    // In either case, we're done with this sequence of phase changes;
    // these are "magic" messages, if these change, must also make changes above
    if (phaseData.new_turn === game.scenario.turns) {
      phaseData.messages.push("game complete")
    } else {
      phaseData.new_phase = gamePhaseType.CleanupStatus
      phaseData.messages.push("starting status update")
    }
  }
}

function cleanupStatus(game: Game, data: GameActionData): void {
  const phaseData: GameActionPhaseChange = data.data.phase_data as GameActionPhaseChange
  if (game.lastAction?.type !== "status_update") { return }
  phaseData.messages.push("status update complete")
  phaseData.new_player = game.currentInitiativePlayer
  phaseData.new_phase = gamePhaseType.CleanupSmoke
  phaseData.messages.push("starting smoke dispersion check")
  game.addSmokeCheckState()
  if (game.smokeCheckNeeded.length < 1) {
    phaseData.messages.push("no smoke counters, skipping")
  }
  cleanupSmoke(game, data)
}

function cleanupSmoke(game: Game, data: GameActionData): void {
  const phaseData: GameActionPhaseChange = data.data.phase_data as GameActionPhaseChange
  game.addSmokeCheckState()
  if (game.smokeCheckNeeded.length > 0) { return }
  phaseData.messages.push("smoke dispersion check complete")
  phaseData.new_player = game.currentInitiativePlayer
  phaseData.new_phase = gamePhaseType.CleanupFire
  phaseData.messages.push("starting blaze check")
  game.addFireCheckState()
  if ((game.fireOutCheckNeeded.length < 1 && game.fireSpreadCheckNeeded.length < 1)) {
    phaseData.messages.push("no blazes on map, skipping")
  }
  cleanupFire(game, data)
}

function cleanupFire(game: Game, data: GameActionData): void {
  const phaseData: GameActionPhaseChange = data.data.phase_data as GameActionPhaseChange
  game.addFireCheckState()
  if ((game.fireOutCheckNeeded.length > 0 || game.fireSpreadCheckNeeded.length > 0)) {
    return
  }
  phaseData.messages.push("blaze check complete")
  phaseData.new_player = game.currentInitiativePlayer
  phaseData.new_phase = gamePhaseType.CleanupWeather
  phaseData.messages.push("starting variable wind check")
  game.addVariableWindState()
  if (!game.checkWindDirection && !game.checkWindSpeed) {
    phaseData.messages.push("wind not variable, skipping")
  }
  cleanupWeather(game, data)
}

function cleanupWeather(game: Game, data: GameActionData): void {
  const phaseData: GameActionPhaseChange = data.data.phase_data as GameActionPhaseChange
  const oldTurn = phaseData.old_turn
  game.addVariableWindState()
  if (game.checkWindDirection || game.checkWindSpeed) { return }
  phaseData.messages.push("variable wind check complete")
  phaseData.new_phase = gamePhaseType.Deployment
  phaseData.new_player = game.scenario.firstAction
  phaseData.new_turn = oldTurn + 1
  phaseData.messages.push(`starting ${formatNation(game, phaseData.new_player)} deployment`)
  deployment(game, data)
}