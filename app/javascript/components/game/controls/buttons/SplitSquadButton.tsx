import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { CircleHalf } from "react-bootstrap-icons";

interface SplitSquadButtonProps {
  game: Game;
  callback: () => void;
}

export default function SplitSquadButton({ game, callback }: SplitSquadButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.split()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><CircleHalf />split squad</button>
      </div>
    </form>
  )
}
