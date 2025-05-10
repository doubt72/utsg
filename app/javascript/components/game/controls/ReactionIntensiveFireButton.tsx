import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { FireIntenseGlyph } from "../../utilities/buttons";

interface ReactionIntensiveFireButtonProps {
  game: Game;
}

export default function ReactionIntensiveFireButton({ game }: ReactionIntensiveFireButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.executeUndo()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{FireIntenseGlyph()}intensive reaction fire (2)</button>
      </div>
    </form>
  )
}
