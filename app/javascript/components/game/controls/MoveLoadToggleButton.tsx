import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { BoxArrowInUp } from "react-bootstrap-icons";
import { MoveGlyph } from "../../utilities/buttons";

interface MoveLoadToggleButtonProps {
  game: Game;
  callback: () => void;
}

export default function MoveLoadToggleButton({ game, callback }: MoveLoadToggleButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.moveState.loadToggle()
    callback()
  }

  const text = () => {
    if (game.moveState.loading === true) { return "continue moving" }
    return "pick up unit"
  }
  
  const icon = () => {
    if (game.moveState.loading === true) { return MoveGlyph() }
    return <BoxArrowInUp />
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{icon()}{text()}</button>
      </div>
    </form>
  )
}
