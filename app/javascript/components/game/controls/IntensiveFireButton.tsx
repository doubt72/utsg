import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { FireIntenseGlyph } from "../../utilities/buttons";

interface IntensiveFireButtonProps {
  game: Game;
}

export default function IntensiveFireButton({ game }: IntensiveFireButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.executeUndo()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{FireIntenseGlyph()}intensive fire (2)</button>
      </div>
    </form>
  )
}
