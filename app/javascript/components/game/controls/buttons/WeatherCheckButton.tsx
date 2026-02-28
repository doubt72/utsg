import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { DiceGlyph } from "../../../utilities/buttons";

interface WeatherCheckButtonProps {
  game: Game;
  callback: () => void;
}

export default function WeatherCheckButton({ game, callback }: WeatherCheckButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.gameState?.finish()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">
          {DiceGlyph()}wind { game.checkWindDirection ? "direction" : "speed" } check
        </button>
      </div>
    </form>
  )
}
