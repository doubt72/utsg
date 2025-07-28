import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { RoutGlyph } from "../../utilities/buttons";
import { finishRoutCheck } from "../../../engine/control/mainActions";

interface RoutCheckButtonProps {
  game: Game;
  callback: () => void;
}

export default function RoutCheckButton({ game, callback }: RoutCheckButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    finishRoutCheck(game)
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{RoutGlyph()}rout morale check</button>
      </div>
    </form>
  )
}
