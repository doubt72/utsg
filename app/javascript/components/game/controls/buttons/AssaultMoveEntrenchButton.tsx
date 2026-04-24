import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { ShieldFill } from "react-bootstrap-icons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface AssaultMoveEntrenchButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function AssaultMoveEntrenchButton({ game, vertical, callback }: AssaultMoveEntrenchButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.assaultState.entrench()
    callback()
  }

  const text = "entrench"

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
              <ShieldFill />
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            <ShieldFill /> {text}
          </button>
        }
      </div>
    </form>
  )
}
