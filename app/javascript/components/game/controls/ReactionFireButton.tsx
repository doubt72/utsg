import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { FireGlyph } from "../../utilities/buttons";

interface ReactionFireButtonProps {
  game: Game;
}

export default function ReactionFireButton({ game }: ReactionFireButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.executeUndo()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{FireGlyph()}reaction fire (2)</button>
      </div>
    </form>
  )
}
