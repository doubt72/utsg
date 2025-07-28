import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { Clouds, CloudSlash } from "react-bootstrap-icons";
import { fireSmokeToggle } from "../../../engine/control/mainActions";

interface FireSmokeButtonProps {
  game: Game;
  callback: () => void;
}

export default function FireSmokeButton({ game, callback }: FireSmokeButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    fireSmokeToggle(game)
    callback()
  }
  
    const text = () => {
      if (game.gameActionState?.fire?.firingSmoke === true) { return "cancel smoke round" }
      return "smoke round"
    }
  
    const icon = () => {
      if (game.gameActionState?.fire?.firingSmoke === true) { return <CloudSlash /> }
      return <Clouds />
    }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{icon()}{text()}</button>
      </div>
    </form>
  )
}
