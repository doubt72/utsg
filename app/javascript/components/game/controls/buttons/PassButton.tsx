import React, { FormEvent } from "react";
import { ArrowClockwise } from "react-bootstrap-icons";
import Game from "../../../../engine/Game";
import { stateType } from "../../../../engine/control/state/BaseState";
import PassState from "../../../../engine/control/state/PassState";

interface PassButtonProps {
  game: Game;
  callback: () => void;
}

export default function PassButton({ game, callback }: PassButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (game.gameState?.type === stateType.Pass) {
      game.gameState.finish()
    } else {
      game.gameState = new PassState(game)
    }
    callback()
  }

  const text = () => {
    if (game.gameState?.type === stateType.Pass) {
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
