import React, { FormEvent } from "react";
import { ArrowCounterclockwise } from "react-bootstrap-icons";
import Game from "../../../engine/Game";

interface UnselectButtonProps {
  game: Game;
  callback: () => void;
}

export default function UnselectButton({ game, callback }: UnselectButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.scenario.map.clearAllSelections()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><ArrowCounterclockwise/>clear selection</button>
      </div>
    </form>
  )
}
