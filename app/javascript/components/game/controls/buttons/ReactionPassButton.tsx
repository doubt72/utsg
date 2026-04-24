import React, { FormEvent } from "react";
import { ArrowClockwise } from "react-bootstrap-icons";
import Game from "../../../../engine/Game";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface ReactionPassButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function ReactionPassButton({ game, vertical, callback }: ReactionPassButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.gameState?.finish()
    callback()
  }

  const text = "skip reaction fire"

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
