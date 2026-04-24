import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { FireGlyph } from "../../../utilities/buttons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface ToggleSponsonButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function ToggleSponsonButton({ game, vertical, callback }: ToggleSponsonButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.fireState.sponsonToggle()
    callback()
  }

  const text = () => {
    return game.fireState.sponson ? "use turret" : "use hull gun"
  }

  const buttonTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      { text() }
    </Tooltip>
  )

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        { vertical ?
          <OverlayTrigger placement="bottom" overlay={buttonTooltip}
                          delay={{ show: 0, hide: 0 }} >
            <button type="submit" className="custom-button custom-button-balance nowrap">
              {FireGlyph()}
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            {FireGlyph()} {text()}
          </button>
        }
      </div>
    </form>
  )
}
