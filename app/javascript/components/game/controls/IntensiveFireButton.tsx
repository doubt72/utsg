import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { FireIntenseGlyph } from "../../utilities/buttons";

interface IntensiveFireButtonProps {
  game: Game;
  callback: () => void;
}

export default function IntensiveFireButton({ game, callback }: IntensiveFireButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.startFire()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{FireIntenseGlyph()}intensive fire (2)</button>
      </div>
    </form>
  )
}
