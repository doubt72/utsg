import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { BoxArrowDown } from "react-bootstrap-icons";
import { MoveGlyph } from "../../../utilities/buttons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface MoveShortToggleButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function MoveShortToggleButton({ game, vertical, callback }: MoveShortToggleButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.moveState.dropToggle()
    callback()
  }

  const text = () => {
    if (game.moveState.dropping === true) {
      return `continue ${ game.moveState.rushing ? "rushing" : "moving" }`
    }
    return "drop unit"
  }
  
  const icon = () => {
    if (game.moveState.dropping === true) { return MoveGlyph() }
    return <BoxArrowDown />
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
              {icon()}
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            {icon()} {text()}
          </button>
        }
      </div>
    </form>
  )
}
