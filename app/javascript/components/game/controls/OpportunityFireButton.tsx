import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { FireGlyph } from "../../utilities/buttons";

interface OpportunityFireButtonProps {
  game: Game;
}

export default function OpportunityFireButton({ game }: OpportunityFireButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.executeUndo()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{FireGlyph()}opportunity fire (2)</button>
      </div>
    </form>
  )
}
