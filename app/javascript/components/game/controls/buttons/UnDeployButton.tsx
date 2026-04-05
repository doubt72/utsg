import React, { FormEvent } from "react";
import { ArrowCounterclockwise } from "react-bootstrap-icons";
import Game from "../../../../engine/Game";

interface UndeployButtonProps {
  game: Game;
  callback: () => void;
}

export default function UndeployButton({ game, callback }: UndeployButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.undeploy()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><ArrowCounterclockwise/>undeploy</button>
      </div>
    </form>
  )
}
