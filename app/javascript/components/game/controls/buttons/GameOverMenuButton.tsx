import React, { FormEvent } from "react";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";
import { ArrowLeftCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

interface GameOverMenuButtonProps {
  vertical: boolean;
}

export default function GameOverMenuButton({ vertical }: GameOverMenuButtonProps) {
  const navigate = useNavigate()

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    navigate("/", { replace: true })
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
              <ArrowLeftCircle />
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            <ArrowLeftCircle /> {text}
          </button>
        }
      </div>
    </form>
  )
}
