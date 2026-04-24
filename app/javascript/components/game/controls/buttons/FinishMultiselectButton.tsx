import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { CheckSquare } from "react-bootstrap-icons";
import { stateType } from "../../../../engine/control/state/BaseState";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface FinishMultiselectButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function FinishMultiselectButton({ game, vertical, callback }: FinishMultiselectButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (game.gameState?.type === stateType.Fire) { game.fireState.doneSelect = true }
    if (game.gameState?.type === stateType.Move) { game.moveState.doneSelect = true }
    if (game.gameState?.type === stateType.Assault) { game.assaultState.doneSelect = true }
    game.closeOverlay = true
    callback()
  }

  const text = "end selection"

  const buttonTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      { text }
    </Tooltip>
  )

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        { vertical ?
          <OverlayTrigger placement="bottom" overlay={buttonTooltip}
                          delay={{ show: 0, hide: 0 }} >
            <button type="submit" className="custom-button custom-button-balance nowrap">
              <CheckSquare />
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            <CheckSquare /> {text}
          </button>
        }
      </div>
    </form>
  )
}
