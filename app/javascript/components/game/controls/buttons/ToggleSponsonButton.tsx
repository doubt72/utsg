import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { FireGlyph } from "../../../utilities/buttons";

interface ToggleSponsonButtonProps {
  game: Game;
  callback: () => void;
}

export default function ToggleSponsonButton({ game, callback }: ToggleSponsonButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.fireState.sponsonToggle()
    callback()
  }

  const text = () => {
    return game.fireState.sponson ? "use turret" : "use hull gun"
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{FireGlyph()}{text()}</button>
      </div>
    </form>
  )
}
