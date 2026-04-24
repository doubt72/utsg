import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { RoutGlyph } from "../../../utilities/buttons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface RoutEliminateButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function RoutEliminateButton({ game, vertical, callback }: RoutEliminateButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.gameState?.finish()
    callback()
  }

  const text = "eliminate unit"

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
              {RoutGlyph()}
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            {RoutGlyph()} {text}
          </button>
        }
      </div>
    </form>
  )
}
