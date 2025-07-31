import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { Clouds, CloudSlash } from "react-bootstrap-icons";

interface MoveSmokeToggleButtonProps {
  game: Game;
  callback: () => void;
}

export default function MoveSmokeToggleButton({ game, callback }: MoveSmokeToggleButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.moveState.smokeToggle()
    callback()
  }

  const text = () => {
    if (game.moveState.smoke === true) { return "stop laying smoke" }
    return "lay smoke"
  }

  const icon = () => {
    if (game.moveState.smoke === true) { return <CloudSlash /> }
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
