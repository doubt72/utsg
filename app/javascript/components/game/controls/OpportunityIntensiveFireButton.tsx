import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { FireIntenseGlyph } from "../../utilities/buttons";

interface OpportunityIntensiveFireButtonProps {
  game: Game;
}

export default function OpportunityIntensiveFireButton({ game }: OpportunityIntensiveFireButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.executeUndo()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{FireIntenseGlyph()}intensive opportunity fire (2)</button>
      </div>
    </form>
  )
}
