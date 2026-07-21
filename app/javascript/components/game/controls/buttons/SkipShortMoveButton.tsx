import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";
import { ArrowClockwise } from "react-bootstrap-icons";

interface SkipShortMoveButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function SkipShortMoveButton({ game, vertical, callback }: SkipShortMoveButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.shortMoveState.skip()
    callback()
  }

  const text = "complete move"

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
              <ArrowClockwise />
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            <ArrowClockwise /> {text}
          </button>
        }
      </div>
    </form>
  )
}
