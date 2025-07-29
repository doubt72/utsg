import React, { FormEvent } from "react";
import { ArrowClockwise } from "react-bootstrap-icons";
import Game from "../../../engine/Game";
import { finishPass, startPass } from "../../../engine/control/mainActions";
import { actionType } from "../../../engine/control/actionState";

interface PassButtonProps {
  game: Game;
  callback: () => void;
}

export default function PassButton({ game, callback }: PassButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (game.gameState?.currentAction === actionType.Pass) {
      finishPass(game)
    } else {
      startPass(game)
    }
    callback()
  }

  const text = () => {
    if (game.gameState?.currentAction === actionType.Pass) {
      return "confirm pass"
    } else {
      return "pass (-1)"
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><ArrowClockwise/>{text()}</button>
      </div>
    </form>
  )
}
