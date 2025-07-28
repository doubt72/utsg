import React, { FormEvent } from "react";
import { ArrowClockwise } from "react-bootstrap-icons";
import Game from "../../../engine/Game";
import { actionType, finishPass, startPass } from "../../../engine/control/mainActions";

interface PassButtonProps {
  game: Game;
  callback: () => void;
}

export default function PassButton({ game, callback }: PassButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (game.gameActionState?.currentAction === actionType.Pass) {
      finishPass(game)
    } else {
      startPass(game)
    }
    callback()
  }

  const text = () => {
    if (game.gameActionState?.currentAction === actionType.Pass) {
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
