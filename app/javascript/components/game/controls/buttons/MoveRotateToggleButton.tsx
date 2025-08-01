import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { ArrowClockwise } from "react-bootstrap-icons";

interface MoveRotateToggleButtonProps {
  game: Game;
  callback: () => void;
}

export default function MoveRotateToggleButton({ game, callback }: MoveRotateToggleButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.moveState.rotateToggle()
    callback()
  }

  const text = () => {
    if (game.moveState.rotatingTurret === true) { return "rotating turret" }
    return "rotating hull"
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><ArrowClockwise />{text()}</button>
      </div>
    </form>
  )
}
