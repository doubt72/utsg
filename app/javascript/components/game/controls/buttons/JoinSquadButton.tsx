import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { CircleFill } from "react-bootstrap-icons";

interface JoinSquadButtonProps {
  game: Game;
  callback: () => void;
}

export default function JoinSquadButton({ game, callback }: JoinSquadButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.join()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><CircleFill />join squad</button>
      </div>
    </form>
  )
}
