import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { CircleFill } from "react-bootstrap-icons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface JoinSquadButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function JoinSquadButton({ game, vertical, callback }: JoinSquadButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.join()
    callback()
  }

  const text = "combine teams"

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
              <CircleFill />
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            <CircleFill /> {text}
          </button>
        }
      </div>
    </form>
  )
}
