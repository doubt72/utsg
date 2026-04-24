import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { CancelGlyph } from "../../../utilities/buttons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface UnselectButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function UnselectButton({ game, vertical, callback }: UnselectButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.scenario.map.clearAllSelections()
    callback()
  }

  const text = "clear selection"

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
              {CancelGlyph()}
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            {CancelGlyph()} {text}
          </button>
        }
      </div>
    </form>
  )
}
