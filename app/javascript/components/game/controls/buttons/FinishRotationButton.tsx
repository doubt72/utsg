import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { CheckSquare } from "react-bootstrap-icons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface FinishRotationButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function FinishRotationButton({ game, vertical, callback }: FinishRotationButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.fireState.doneRotating = true
    callback()
  }

  const text = "end turret rotation"

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
