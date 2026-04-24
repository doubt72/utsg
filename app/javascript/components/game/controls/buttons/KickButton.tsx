import React, { FormEvent } from "react";
import { PersonSlash } from "react-bootstrap-icons";
import { postAPI } from "../../../../utilities/network";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface KickButtonProps {
  gameId: number;
  vertical: boolean;
}

export default function KickButton({ vertical, gameId }: KickButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    postAPI(`/api/v1/games/${gameId}/kick`, {}, {
      ok: () => {}
    })
  }

  const text = "kick player"

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
              <PersonSlash />
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            <PersonSlash /> {text}
          </button>
        }
      </div>
    </form>
  )
}
