import React, { FormEvent, useState, useEffect } from "react";
import { PersonPlus } from "react-bootstrap-icons";
import { postAPI } from "../../../../utilities/network";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface JoinButtonProps {
  gameId: number;
  vertical: boolean;
}

export default function JoinButton({ vertical, gameId }: JoinButtonProps) {
  const [className, setClassName] = useState<string>("custom-button-orange nowrap")

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    postAPI(`/api/v1/games/${gameId}/join`, {}, {
      ok: () => {}
    })
  }

  const text = "join game"

  const buttonTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      { text }
    </Tooltip>
  )

  useEffect(() => {
    setTimeout(() => {
      setClassName(`custom-button nowrap`)
    }, 1600)

    setTimeout(() => {
      setClassName(`custom-button-orange nowrap`)
    }, 1800)

    setTimeout(() => {
      setClassName(`custom-button nowrap`)
    }, 2000)

    setTimeout(() => {
      setClassName(`custom-button-orange nowrap`)
    }, 2200)
  }, [])

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        { vertical ?
          <OverlayTrigger placement="bottom" overlay={buttonTooltip}
                          delay={{ show: 0, hide: 0 }} >
            <button type="submit" className={`${className} custom-button-balance`} >
              <PersonPlus />
            </button>
          </OverlayTrigger> :
          <button type="submit" className={className} >
            <PersonPlus /> {text}
          </button>
        }
      </div>
    </form>
  )
}
