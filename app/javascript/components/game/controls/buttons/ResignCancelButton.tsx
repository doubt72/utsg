import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { CancelGlyph } from "../../../utilities/buttons";

interface ResignCancelButtonProps {
  game: Game;
  callback: () => void;
}

export default function ResignCancelButton({ game, callback }: ResignCancelButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.clearResignation()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{ CancelGlyph() } cancel</button>
      </div>
    </form>
  )
}
