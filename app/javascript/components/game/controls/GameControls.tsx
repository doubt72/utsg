import React, { useEffect, useState } from "react";
import Game from "../../../engine/Game";
import JoinButton from "./buttons/JoinButton";
import LeaveButton from "./buttons/LeaveButton";
import StartButton from "./buttons/StartButton";
import UndoButton from "./buttons/UndoButton";
import PassButton from "./buttons/PassButton";
import ReactionFireButton from "./buttons/ReactionFireButton";
import ReactionIntensiveFireButton from "./buttons/ReactionIntensiveFireButton";
import EnemyRoutButton from "./buttons/EnemyRoutButton";
import FireButton from "./buttons/FireButton";
import IntensiveFireButton from "./buttons/IntensiveFireButton";
import MoveButton from "./buttons/MoveButton";
import RushButton from "./buttons/RushButton";
import AssaultMoveButton from "./buttons/AssaultMoveButton";
import RoutButton from "./buttons/RoutButton";
import MoveFinishButton from "./buttons/MoveFinishButton";
import CancelActionButton from "./buttons/CancelActionButton";
import MoveRotateToggleButton from "./buttons/MoveRotateToggleButton";
import actionsAvailable from "../../../engine/control/actionsAvailable";
import MoveShortToggleButton from "./buttons/MoveShortToggleButton";
import MoveSmokeToggleButton from "./buttons/MoveSmokeToggleButton";
import MoveLoadToggleButton from "./buttons/MoveLoadToggleButton";
import FinishMultiselectButton from "./buttons/FinishMultiselectButton";
import UnselectButton from "./buttons/UnselectButton";
import HelpButton from "./buttons/HelpButton";
import BreakdownButton from "./buttons/BreakdownButton";
import InitiativeButton from "./buttons/InitiativeButton";
import ResignButton from "./buttons/ResignButton";
import ResignCancelButton from "./buttons/ResignCancelButton";
import PassCancelButton from "./buttons/PassCancelButton";
import AssaultMoveFinishButton from "./buttons/AssaultMoveFinishButton";
import AssaultMoveEntrenchButton from "./buttons/AssaultMoveEntrenchButton";
import AssaultMoveClearButton from "./buttons/AssaultMoveClearButton";
import FinishRotationButton from "./buttons/FinishRotationButton";
import ToggleSponsonButton from "./buttons/ToggleSponsonButton";
import FireFinishButton from "./buttons/FireFinishButton";
import MoraleCheckButton from "./buttons/MoraleCheckButton";
import FireSmokeButton from "./buttons/FireSmokeButton";
import ReactionPassButton from "./buttons/ReactionPassButton";
import RoutEliminateButton from "./buttons/RoutEliminateButton";
import RoutCheckButton from "./buttons/RoutCheckButton";
import CloseCombatSelectButton from "./buttons/CloseCombatSelectButton";
import CloseCombatReduceButton from "./buttons/CloseCombatReduceButton";
import SniperButton from "./buttons/SniperButton";
import PrecipCheckButton from "./buttons/PrecipCheckButton";
import RallyButton from "./buttons/RallyButton";
import RallyPassButton from "./buttons/RallyPassButton";
import OverstackReduceButton from "./buttons/OverstackReduceButton";
import SmokeCheckButton from "./buttons/SmokeCheckButton";
import FireOutCheckButton from "./buttons/FireOutCheckButton";
import FireSpreadCheckButton from "./buttons/FireSpreadCheckButton";
import WeatherCheckButton from "./buttons/WeatherCheckButton";
import FireDisplaceEliminateButton from "./buttons/FireDisplaceEliminateButton";
import FireDisplaceConfirmButton from "./buttons/FireDisplaceConfirmButton";
import FireDisplaceCancelButton from "./buttons/FireDisplaceCancelButton";
import FireStartCheckButton from "./buttons/FireStartCheckButton";
import KickButton from "./buttons/KickButton";
import CancelMoveButton from "./buttons/CancelMoveButton";

interface GameControlsProps {
  game: Game;
  update: number;
  callback: () => void;
}

export default function GameControls({ game, callback, update }: GameControlsProps) {
  const [playerNation, setPlayerNation] = useState<JSX.Element | undefined>()
  const [controls, setControls] = useState<JSX.Element[]>([])
  const [internalUpdate, setInternalUpdate] = useState(0)

  useEffect(() => {
    if (!game.id) { return }
    displayActions()
  }, [game, game.lastActionIndex, internalUpdate, update])

  useEffect(() => {
    if (!game.id) { return }
    if (game.state !== "in_progress") {
      setPlayerNation(undefined)
      return
    }
    const user = localStorage.getItem("username") ?? ""
    let nation: string | undefined = undefined
    if (game.playerOneName === game.playerTwoName && game.playerOneName === user) {
      nation = game.currentPlayerNation
    } else if (user === game.playerOneName) {
      nation = game.playerOneNation
    } else if (user === game.playerTwoName) {
      nation = game.playerTwoNation
    }
    if (nation) {
      const fill = `url(#nation-${nation}-16)`
      setPlayerNation(
        <div style={{ paddingTop: 3, paddingRight: 2 }}>
          <svg width={34} height={34} viewBox="0 0 34 34" style={{ minWidth: 32 }}>
            <circle cx={17} cy={17} r={16}
                    style={{ fill, strokeWidth: 1, stroke: "black" }}/>
          </svg>
        </div>
      )
    }
  }, [game, game.state, game.currentPlayer])

  const callAllBack = () => {
    setInternalUpdate(s => s+1)
    callback()
  }

  const displayActions = () => {
    const user = localStorage.getItem("username")
    const actions = actionsAvailable(game, user as string)
    actions.push({ type: "help" })
    setControls(actions.map((a, i) => {
      if (a.type === "sync") {
        return <div className="mt05em mb05em mr05em ml05em" key={i}>synchronizing (you may need to reload this page)</div>
      } else if (a.type === "wait") {
        return <div className="mt05em mb05em mr05em ml05em" key={i}>{a.message}</div>
      } else if (a.type === "none") {
        return <div className="mt05em mb05em mr05em ml05em" key={i}>{a.message}</div>
      } else if (a.type === "undo") {
        return <UndoButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "join") {
        return <JoinButton gameId={game.id} key={i} />
      } else if (a.type === "leave") {
        return <LeaveButton gameId={game.id} key={i} />
      } else if (a.type === "start") {
        return <StartButton gameId={game.id} key={i} />
      } else if (a.type === "kick") {
        return <KickButton gameId={game.id} key={i} />
      } else if (a.type === "deploy") {
        return <div className="mt05em mb05em mr05em ml05em" key={i}>deploy units</div>
      } else if (a.type === "rally") {
        return <RallyButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "rally_pass") {
        return <RallyPassButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "precip_check") {
        return <PrecipCheckButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "unselect") {
        return <UnselectButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "pass") {
        return <PassButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "pass_cancel") {
        return <PassCancelButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "reaction_fire") {
        return <ReactionFireButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "reaction_intensive_fire") {
        return <ReactionIntensiveFireButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "reaction_pass") {
        return <ReactionPassButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "enemy_rout") {
        return <EnemyRoutButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "fire") {
        return <FireButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "fire_finish") {
        return <FireFinishButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "fire_toggle_sponson") {
        return <ToggleSponsonButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "fire_smoke") {
        return <FireSmokeButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "intensive_fire") {
        return <IntensiveFireButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "morale_check") {
        return <MoraleCheckButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "initiative") {
        return <InitiativeButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "fire_start_check") {
        return <FireStartCheckButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "sniper") {
        return <SniperButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "move") {
        return <MoveButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "move_undo") {
        return <CancelMoveButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "move_finish") {
        return <MoveFinishButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "move_rotate_toggle") {
        return <MoveRotateToggleButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "move_shortdrop_toggle") {
        return <MoveShortToggleButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "move_load_toggle") {
        return <MoveLoadToggleButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "move_smoke_toggle") {
        return <MoveSmokeToggleButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "breakdown") {
        return <BreakdownButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "rush") {
        return <RushButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "assault_move") {
        return <AssaultMoveButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "assault_move_finish") {
        return <AssaultMoveFinishButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "assault_move_clear") {
        return <AssaultMoveClearButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "assault_move_entrench") {
        return <AssaultMoveEntrenchButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "finish_multiselect") {
        return <FinishMultiselectButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "finish_rotation") {
        return <FinishRotationButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "cancel_action") {
        return <CancelActionButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "rout") {
        return <RoutButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "rout_eliminate") {
        return <RoutEliminateButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "rout_check") {
        return <RoutCheckButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "close_combat_select") {
        return <CloseCombatSelectButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "close_combat_reduce") {
        return <CloseCombatReduceButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "overstack_reduce") {
        return <OverstackReduceButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "smoke_check") {
        return <SmokeCheckButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "fire_out_check") {
        return <FireOutCheckButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "fire_spread_check") {
        return <FireSpreadCheckButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "weather_check") {
        return <WeatherCheckButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "fire_displace_eliminate") {
        return <FireDisplaceEliminateButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "fire_displace_confirm") {
        return <FireDisplaceConfirmButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "fire_displace_cancel") {
        return <FireDisplaceCancelButton game={game} key={i} callback={callAllBack} />
      } else if (a.type === "help") {
        return <HelpButton game={game} key={i} />
      } else {
        return <div className="mt05em mb05em mr05em" key={i}>unknown action {a.type}</div>
      }
    }))
  }

  return (
    <div className="game-control ml05em mr05em">
      {playerNation}
      {controls}
      <div className="flex-fill"></div>
      { game.state === "complete" ? "" : game.resignationLevel > 0 ? <div className="flex nowrap">
        <div className="mt05em mb05em mr05em ml05em" >
          { game.resignationLevel > 1 ? "Are you really sure? " : "Are you sure you want to resign? " }
        </div>
        <ResignButton game={game} callback={callAllBack} />
        <ResignCancelButton game={game} callback={callAllBack} />
      </div> : <div><ResignButton game={game} callback={callAllBack} /></div>
      }
    </div>
  )
}
