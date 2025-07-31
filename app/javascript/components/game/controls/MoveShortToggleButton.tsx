import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { BoxArrowDown } from "react-bootstrap-icons";
import { MoveGlyph } from "../../utilities/buttons";

interface MoveShortToggleButtonProps {
  game: Game;
  callback: () => void;
}

export default function MoveShortToggleButton({ game, callback }: MoveShortToggleButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.moveState.dropToggle()
    callback()
  }

  const text = () => {
    if (game.moveState.dropping === true) {
      return `continue ${ game.moveState.rushing ? "rushing" : "moving" }`
    }
    return "drop unit"
  }
  
  const icon = () => {
    if (game.moveState.dropping === true) { return MoveGlyph() }
    return <BoxArrowDown />
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{icon()}{text()}</button>
      </div>
    </form>
  )
}
