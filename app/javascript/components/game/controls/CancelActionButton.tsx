import React, { FormEvent } from "react";
import Game from "../../../engine/Game";
import { CancelGlyph } from "../../utilities/buttons";
import { actionType } from "../../../engine/control/mainActions";

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
    if (game.gameActionState?.fire) {
      return "cancel fire"
    } else if (game.gameActionState?.move) {
      return `cancel ${game.rushing ? "rush" : "move"}`
    } else if (game.gameActionState?.assault) {
      return "cancel assault move"
    } else if (game.gameActionState?.rout || game.gameActionState?.currentAction === actionType.RoutAll) {
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
