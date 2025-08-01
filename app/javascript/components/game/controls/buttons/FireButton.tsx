import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { FireGlyph } from "../../../utilities/buttons";
import FireState from "../../../../engine/control/state/FireState";

interface FireButtonProps {
  game: Game;
  callback: () => void;
}

export default function FireButton({ game, callback }: FireButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.gameState = new FireState(game, false)
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{FireGlyph()}fire (2)</button>
      </div>
    </form>
  )
}
