import React, { FormEvent } from "react";
import { ArrowClockwise } from "react-bootstrap-icons";
import Game from "../../../engine/Game";
import { passReaction } from "../../../engine/control/mainActions";

interface ReactionPassButtonProps {
  game: Game;
  callback: () => void;
}

export default function ReactionPassButton({ game, callback }: ReactionPassButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    passReaction(game)
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><ArrowClockwise/>skip reaction fire</button>
      </div>
    </form>
  )
}
