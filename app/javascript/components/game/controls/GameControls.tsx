import React, { useEffect, useState } from "react";
import Game from "../../../engine/Game";
import JoinButton from "./JoinButton";
import LeaveButton from "./LeaveButton";
import StartButton from "./StartButton";
import UndoButton from "./UndoButton";
import PassButton from "./PassButton";
import OpportunityFireButton from "./OpportunityFireButton";
import OpportunityIntensiveFireButton from "./OpportunityIntensiveFireButton";
import ReactionFireButton from "./ReactionFireButton";
import ReactionIntensiveFireButton from "./ReactionIntensiveFireButton";
import EnemyRoutButton from "./EnemyRoutButton";
import FireButton from "./FireButton";
import IntensiveFireButton from "./IntensiveFireButton";
import MoveButton from "./MoveButton";
import RushButton from "./RushButton";
import AssaultMoveButton from "./AssaultMoveButton";
import RoutButton from "./RoutButton";

interface GameControlsProps {
  game: Game;
}

export default function GameControls({ game }: GameControlsProps) {
  const [controls, setControls] = useState<JSX.Element[]>([])

  useEffect(() => {
    if (!game.id) { return }
    displayActions()
  }, [game, game.lastMoveIndex])

  const displayActions = () => {
    const user = localStorage.getItem("username")
    setControls(game.actionsAvailable(user as string).map((a, i) => {
      if (a.type === "sync") {
        return <div className="mt05em mb05em mr05em ml05em" key={i}>synchronizing</div>
      } else if (a.type === "none") {
        return <div className="mt05em mb05em mr05em ml05em" key={i}>{a.message}</div>
      } else if (a.type === "undo") {
        return <UndoButton game={game} key={i} />
      } else if (a.type === "join") {
        return <JoinButton gameId={game.id} key={i} />
      } else if (a.type === "leave") {
        return <LeaveButton gameId={game.id} key={i} />
      } else if (a.type === "start") {
        return <StartButton gameId={game.id} key={i} />
      } else if (a.type === "deploy") {
        return <div className="mt05em mb05em mr05em ml05em" key={i}>deploy units</div>
      } else if (a.type === "pass") {
        return <PassButton game={game} key={i} />
      } else if (a.type === "opportunity_fire") {
        return <OpportunityFireButton game={game} key={i} />
      } else if (a.type === "opportunity_intensive_fire") {
        return <OpportunityIntensiveFireButton game={game} key={i} />
      } else if (a.type === "reaction_fire") {
        return <ReactionFireButton game={game} key={i} />
      } else if (a.type === "reaction_intensive_fire") {
        return <ReactionIntensiveFireButton game={game} key={i} />
      } else if (a.type === "enemy_rout") {
        return <EnemyRoutButton game={game} key={i} />
      } else if (a.type === "fire") {
        return <FireButton game={game} key={i} />
      } else if (a.type === "intensive_fire") {
        return <IntensiveFireButton game={game} key={i} />
      } else if (a.type === "move") {
        return <MoveButton game={game} key={i} />
      } else if (a.type === "rush") {
        return <RushButton game={game} key={i} />
      } else if (a.type === "assault_move") {
        return <AssaultMoveButton game={game} key={i} />
      } else if (a.type === "rout") {
        return <RoutButton game={game} key={i} />
      } else {
        return <div className="mt05em mb05em mr05em" key={i}>unknown action {a.type}</div>
      }
    }))
  }

  return (
    <div className="game-control ml05em mr05em">
      {controls}
      <div className="mt05em mb05em mr05em transparent">O</div>
    </div>
  )
}
