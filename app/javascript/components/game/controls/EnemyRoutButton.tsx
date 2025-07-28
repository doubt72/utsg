import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { RoutGlyph } from "../../utilities/buttons";
import { actionType, finishRoutAll, startRoutAll } from "../../../engine/control/mainActions";

interface EnemyRoutButtonProps {
  game: Game;
  callback: () => void;
}

export default function EnemyRoutButton({ game, callback }: EnemyRoutButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (game.gameActionState?.currentAction === actionType.RoutAll) {
      finishRoutAll(game)
    } else {
      startRoutAll(game)
    }
    callback()
  }

  const text = () => {
    if (game.gameActionState?.currentAction === actionType.RoutAll) {
      return "confirm rout enemy"
    } else {
      return "rout enemy (3)"
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{RoutGlyph()}{text()}</button>
      </div>
    </form>
  )
}
