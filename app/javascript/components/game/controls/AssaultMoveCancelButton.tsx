import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { CancelGlyph } from "../../utilities/buttons";

interface AssaultMoveCancelButtonProps {
  game: Game;
  callback: () => void;
}

export default function AssaultMoveCancelButton({ game, callback }: AssaultMoveCancelButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.cancelAction()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">
          {CancelGlyph()}cancel assault move
        </button>
      </div>
    </form>
  )
}
