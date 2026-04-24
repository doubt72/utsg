import React, { FormEvent } from "react";
import { PlayCircle } from "react-bootstrap-icons";
import { postAPI } from "../../../../utilities/network";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface StartButtonProps {
  gameId: number;
  vertical: boolean;
}

export default function StartButton({ vertical, gameId }: StartButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    postAPI(`/api/v1/games/${gameId}/start`, {}, {
      ok: () => {}
    })
  }

  const text = "start game"

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
              <PlayCircle />
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            <PlayCircle /> {text}
          </button>
        }
      </div>
    </form>
  )
}
