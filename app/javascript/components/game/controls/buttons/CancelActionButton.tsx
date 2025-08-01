import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { CancelGlyph } from "../../../utilities/buttons";
import { stateType } from "../../../../engine/control/state/BaseState";

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
    if (game.gameState?.type === stateType.Fire) {
      return "cancel fire"
    } else if (game.gameState?.type === stateType.Move) {
      return `cancel ${game.moveState.rushing ? "rush" : "move"}`
    } else if (game.gameState?.type === stateType.Assault) {
      return "cancel assault move"
    } else if (game.gameState && [stateType.Rout, stateType.RoutAll].includes(game.gameState.type)) {
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
