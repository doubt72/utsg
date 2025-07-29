import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { CancelGlyph } from "../../utilities/buttons";
import { rushing } from "../../../engine/control/checks";
import { actionType } from "../../../engine/control/actionState";

interface CancelActionButtonProps {
  game: Game;
  callback: () => void;
}

export default function CancelActionButton({ game, callback }: CancelActionButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.cancelAction()
    callback()
  }

  const text = () => {
    if (game.gameState?.fire) {
      return "cancel fire"
    } else if (game.gameState?.move) {
      return `cancel ${rushing(game) ? "rush" : "move"}`
    } else if (game.gameState?.assault) {
      return "cancel assault move"
    } else if (game.gameState?.rout || game.gameState?.currentAction === actionType.RoutAll) {
      return "cancel rout"
    } else {
      return "unexpected action"
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">
          {CancelGlyph()}{text()}
        </button>
      </div>
    </form>
  )
}
