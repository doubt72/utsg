import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { Clouds, CloudSlash } from "react-bootstrap-icons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface MoveSmokeToggleButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function MoveSmokeToggleButton({ game, vertical, callback }: MoveSmokeToggleButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.moveState.smokeToggle()
    game.closeOverlay = true
    callback()
  }

  const text = () => {
    if (game.moveState.smoke === true) { return "stop laying smoke" }
    return "lay smoke"
  }

  const icon = () => {
    if (game.moveState.smoke === true) { return <CloudSlash /> }
    return <Clouds />
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
              {icon()}
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            {icon()} {text()}
          </button>
        }
      </div>
    </form>
  )
}
