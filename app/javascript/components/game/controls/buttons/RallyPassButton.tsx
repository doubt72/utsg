import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import RallyState from "../../../../engine/control/state/RallyState";
import { ArrowClockwise } from "react-bootstrap-icons";

interface RallyPassButtonProps {
  game: Game;
  callback: () => void;
}

export default function RallyPassButton({ game, callback }: RallyPassButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const state = game.gameState as RallyState
    state.pass()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><ArrowClockwise/>rally</button>
      </div>
    </form>
  )
}
