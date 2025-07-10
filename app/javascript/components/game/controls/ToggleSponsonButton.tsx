import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { FireGlyph } from "../../utilities/buttons";

interface ToggleSponsonButtonProps {
  game: Game;
  callback: () => void;
}

export default function ToggleSponsonButton({ game, callback }: ToggleSponsonButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!game.gameActionState?.fire) { return }
    game.sponsonFire = !game.sponsonFire
    game.gameActionState.fire.targetSelection = []
    if (game.sponsonFire) {
      game.gameActionState.fire.path = [game.gameActionState.fire.path[0]]
      game.gameActionState.fire.doneRotating = true
    } else {
      game.gameActionState.fire.doneRotating = false
    }
    callback()
  }

  const text = () => {
    return game.sponsonFire ? "use turret" : "use sponson"
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{FireGlyph()}{text()}</button>
      </div>
    </form>
  )
}
