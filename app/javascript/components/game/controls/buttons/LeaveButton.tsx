import React, { FormEvent } from "react";
import { PersonSlash } from "react-bootstrap-icons";
import { postAPI } from "../../../../utilities/network";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface LeaveButtonProps {
  gameId: number;
  vertical: boolean;
}

export default function LeaveButton({ vertical, gameId }: LeaveButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    postAPI(`/api/v1/games/${gameId}/leave`, {}, {
      ok: () => {}
    })
  }

  const text = "leave game"

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
