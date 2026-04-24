import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";
import { ArrowCounterclockwise } from "react-bootstrap-icons";

interface CancelMoveButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function CancelMoveButton({ game, vertical, callback }: CancelMoveButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.moveState.unmove()
    callback()
  }

  const text = "undo last move"

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
              <ArrowCounterclockwise />
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            <ArrowCounterclockwise /> {text}
          </button>
        }
      </div>
    </form>
  )
}
