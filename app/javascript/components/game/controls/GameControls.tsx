import React, { useEffect, useState } from "react";
import Game from "../../../engine/Game";
import JoinButton from "./JoinButton";
import LeaveButton from "./LeaveButton";
import StartButton from "./StartButton";

interface GameControlsProps {
  game: Game;
}

export default function GameControls({ game }: GameControlsProps) {
  const [controls, setControls] = useState<JSX.Element[]>([])

  useEffect(() => {
    if (!game.id) { return }
    displayActions()
  }, [game])

  const displayActions = () => {
    const user = localStorage.getItem("username")
    setControls(game.actionsAvailable(user as string).map((a, i) => {
      if (a.type === "none") {
        return <div key={i}>{a.message}</div>
      } else if (a.type === "join") {
        return <JoinButton gameId={game.id} key={i} />
      } else if (a.type === "leave") {
        return <LeaveButton gameId={game.id} key={i} />
      } else if (a.type === "start") {
        return <StartButton gameId={game.id} key={i} />
      } else {
        return <div key={i}>unknown action {a.type}</div>
      }
    }))
  }

  return (
    <div className="game-control ml05em mr05em">
      {controls}
    </div>
  )
}
