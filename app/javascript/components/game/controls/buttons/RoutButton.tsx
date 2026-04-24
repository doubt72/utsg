import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { RoutGlyph } from "../../../utilities/buttons";
import RoutState from "../../../../engine/control/state/RoutState";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface RoutButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function RoutButton({ game, vertical, callback }: RoutButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.setGameState(new RoutState(game, true))
    callback()
  }

  const text = "rout (1)"

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
