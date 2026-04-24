import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { ArrowClockwise } from "react-bootstrap-icons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface MoveRotateToggleButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function MoveRotateToggleButton({ game, vertical, callback }: MoveRotateToggleButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.moveState.rotateToggle()
    callback()
  }

  const text = () => {
    if (game.moveState.rotatingTurret === true) { return "rotating turret" }
    return "rotating hull"
  }

  const buttonTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      { text() }
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
            <ArrowClockwise /> {text()}
          </button>
        }
      </div>
    </form>
  )
}
