import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";
import { FinishGlyph } from "../../../utilities/buttons";

interface FinishDeployButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function FinishDeployButton({ game, vertical, callback }: FinishDeployButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.gameState?.finish()
    callback()
  }

  const text = "finish deployment"

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
              { FinishGlyph() }
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            { FinishGlyph() } {text}
          </button>
        }
      </div>
    </form>
  )
}
