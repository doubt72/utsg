import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { BoxArrowDown } from "react-bootstrap-icons";
import { MoveGlyph } from "../../utilities/buttons";
import { shortingMoveToggle } from "../../../engine/control/mainActions";
import { rushing } from "../../../engine/control/checks";

interface MoveShortToggleButtonProps {
  game: Game;
  callback: () => void;
}

export default function MoveShortToggleButton({ game, callback }: MoveShortToggleButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    shortingMoveToggle(game)
    callback()
  }

  const text = () => {
    if (game.gameActionState?.move?.droppingMove === true) {
      return `continue ${ rushing(game) ? "rushing" : "moving" }`
    }
    return "drop unit"
  }
  
  const icon = () => {
    if (game.gameActionState?.move?.droppingMove === true) { return MoveGlyph() }
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
