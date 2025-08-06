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

interface GameControlsProps {
  game: Game;
  callback: () => void;
}

export default function GameControls({ game, callback }: GameControlsProps) {
  const [controls, setControls] = useState<JSX.Element[]>([])
  const [update, setUpdate] = useState(0)

  useEffect(() => {
    if (!game.id) { return }
    displayActions()
  }, [game, game.lastActionIndex, update])

  const callAllBack = () => {
    setUpdate(s => s+1)
    callback()
  }

  const displayActions = () => {
    const user = localStorage.getItem("username")
    const actions = actionsAvailable(game, user as string)
    actions.push({ type: "help" })
    setControls(actions.map((a, i) => {
      if (a.type === "sync") {
        return <div className="mt05em mb05em mr05em ml05em" key={i}>synchronizing</div>
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
      } else if (a.type === "deploy") {
        return <div className="mt05em mb05em mr05em ml05em" key={i}>deploy units</div>
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
      } else if (a.type === "move") {
        return <MoveButton game={game} key={i} callback={callAllBack} />
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
      } else if (a.type === "help") {
        return <HelpButton game={game} key={i} />
      } else {
        return <div className="mt05em mb05em mr05em" key={i}>unknown action {a.type}</div>
      }
    }))
  }

  return (
    <div className="game-control ml05em mr05em">
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
