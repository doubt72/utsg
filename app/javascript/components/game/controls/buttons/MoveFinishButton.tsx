import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { FinishGlyph } from "../../../utilities/buttons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface MoveFinishButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function MoveFinishButton({ game, vertical, callback }: MoveFinishButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.gameState?.finish()
    callback()
  }

  const text = `finish ${ game.moveState.rushing ? "rush" : "move" }`

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
              {FinishGlyph()}
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            {FinishGlyph()} {text}
          </button>
        }
      </div>
    </form>
  )
}
