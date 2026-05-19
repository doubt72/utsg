import React, { FormEvent } from "react";
import { XCircle } from "react-bootstrap-icons";
import Game from "../../../../engine/Game";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface DeleteGameButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function DeleteGameButton({ game, vertical, callback }: DeleteGameButtonProps) {
  const navigate = useNavigate()

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.increaseDelete()
    if (game.deleteLevel > 1) {
      navigate("/", { replace: true })
    }
    callback()
  }

  let text = "delete game"
  if (vertical) {
    text = game.deleteLevel > 0 ? "are you sure you want to delete this game?" : text
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
