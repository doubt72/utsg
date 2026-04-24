import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { EliminateGlyph } from "../../../utilities/buttons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface FireDisplaceEliminateButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function FireDisplaceEliminateButton({ game, vertical, callback }: FireDisplaceEliminateButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (game.fireDisplaceState.availableHexes.length > 0) {
      game.fireDisplaceState.remove = true
    } else {
      game.gameState?.finish()
    }
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
              { EliminateGlyph() }
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            { EliminateGlyph() } {text}
          </button>
        }
      </div>
    </form>
  )
}
