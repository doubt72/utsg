import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { CancelGlyph } from "../../utilities/buttons";

interface MoveCancelButtonProps {
  game: Game;
  callback: () => void;
}

export default function MoveCancelButton({ game, callback }: MoveCancelButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.cancelAction()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{CancelGlyph()}cancel move</button>
      </div>
    </form>
  )
}
