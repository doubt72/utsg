import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { Dice6 } from "react-bootstrap-icons";
import { finishMoraleCheck } from "../../../engine/control/mainActions";

interface MoraleCheckButtonProps {
  game: Game;
  callback: () => void;
}

export default function MoraleCheckButton({ game, callback }: MoraleCheckButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    finishMoraleCheck(game)
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap"><Dice6 />morale check</button>
      </div>
    </form>
  )
}
