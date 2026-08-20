import React, { FormEvent } from "react";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";
import { ArrowRightCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

interface ReplayButtonProps {
  vertical: boolean;
  gameId: number;
}

export default function ReplayButton({ vertical, gameId }: ReplayButtonProps) {
  const navigate = useNavigate()

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    navigate(`/game_replay/${gameId}`, { replace: true })
  }

  const text = "game replay"

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
              <ArrowRightCircle />
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            <ArrowRightCircle /> {text}
          </button>
        }
      </div>
    </form>
  )
}
