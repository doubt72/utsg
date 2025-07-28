import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { FireIntenseGlyph } from "../../utilities/buttons";
import { startFire } from "../../../engine/control/mainActions";

interface ReactionIntensiveFireButtonProps {
  game: Game;
  callback: () => void;
}

export default function ReactionIntensiveFireButton({ game, callback }: ReactionIntensiveFireButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    startFire(game)
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{FireIntenseGlyph()}intensive reaction fire (2)</button>
      </div>
    </form>
  )
}
