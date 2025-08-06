import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { DiceGlyph } from "../../../utilities/buttons";

interface CloseCombatSelectButtonProps {
  game: Game;
  callback: () => void;
}

export default function CloseCombatSelectButton({ game, callback }: CloseCombatSelectButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.closeCombatState.rollForCombat()
    callback()
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        <button type="submit" className="custom-button nowrap">{DiceGlyph()}resolve close combat</button>
      </div>
    </form>
  )
}
