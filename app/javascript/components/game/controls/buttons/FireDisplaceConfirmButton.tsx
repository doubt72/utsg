import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { EliminateGlyph, MoveGlyph } from "../../../utilities/buttons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface FireDisplaceConfirmButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function FireDisplaceConfirmButton({ game, vertical, callback }: FireDisplaceConfirmButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.gameState?.finish()
    callback()
  }

  const text = ` confirm ${game.fireDisplaceState.path.length > 1 ? "displacement" : "elimination"}`

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
              { game.fireDisplaceState.path.length > 1 ? MoveGlyph() : EliminateGlyph() }
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            { game.fireDisplaceState.path.length > 1 ? MoveGlyph() : EliminateGlyph() } {text}
          </button>
        }
      </div>
    </form>
  )
}
