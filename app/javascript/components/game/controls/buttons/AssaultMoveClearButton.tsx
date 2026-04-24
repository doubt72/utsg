import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { XLg } from "react-bootstrap-icons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface AssaultMoveClearButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function AssaultMoveClearButton({ game, vertical, callback }: AssaultMoveClearButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.assaultState.clear()
    callback()
  }

  const text = "clear obstacle"

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
              <XLg />
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            <XLg /> {text}
          </button>
        }
      </div>
    </form>
  )
}
