import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { BoxArrowDown } from "react-bootstrap-icons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface AssaultMoveAbandonButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function AssaultMoveAbandonButton({ game, vertical, callback }: AssaultMoveAbandonButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.assaultState.abandon()
    callback()
  }

  const text = "abandon vehicle"

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
              <BoxArrowDown />
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            <BoxArrowDown /> {text}
          </button>
        }
      </div>
    </form>
  )
}
