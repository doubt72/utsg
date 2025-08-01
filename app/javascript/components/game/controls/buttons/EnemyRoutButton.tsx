import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { RoutGlyph } from "../../../utilities/buttons";
import { stateType } from "../../../../engine/control/state/BaseState";
import RoutAllState from "../../../../engine/control/state/RoutAllState";

interface EnemyRoutButtonProps {
  game: Game;
  callback: () => void;
}

export default function EnemyRoutButton({ game, callback }: EnemyRoutButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (game.gameState?.type === stateType.RoutAll) {
      game.gameState?.finish()
    } else {
      game.gameState = new RoutAllState(game)
    }
    callback()
  }

  const text = () => {
    if (game.gameState?.type === stateType.RoutAll) {
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
