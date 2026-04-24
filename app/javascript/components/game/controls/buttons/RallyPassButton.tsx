import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import RallyState from "../../../../engine/control/state/RallyState";
import { ArrowClockwise } from "react-bootstrap-icons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface RallyPassButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function RallyPassButton({ game, vertical, callback }: RallyPassButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const state = game.gameState as RallyState
    state.pass()
    callback()
  }

  const text = "pass"

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
