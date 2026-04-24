import React, { FormEvent } from "react";
import { XCircle } from "react-bootstrap-icons";
import Game from "../../../../engine/Game";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface ResignButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function ResignButton({ game, vertical, callback }: ResignButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.increaseResignation()
    callback()
  }

  let text = "resign"
  if (vertical) {
    text = game.resignationLevel > 0 ? "are you sure you want to resign?" : text
    text = game.resignationLevel > 1 ? "are you really sure you want to resign? " : text
  }

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
              <XCircle />
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            <XCircle /> {text}
          </button>
        }
      </div>
    </form>
  )
}
