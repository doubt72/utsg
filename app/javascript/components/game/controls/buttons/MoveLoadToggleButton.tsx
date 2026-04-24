import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { BoxArrowInUp } from "react-bootstrap-icons";
import { MoveGlyph } from "../../../utilities/buttons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface MoveLoadToggleButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function MoveLoadToggleButton({ game, vertical, callback }: MoveLoadToggleButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.moveState.loadToggle()
    callback()
  }

  const text = () => {
    if (game.moveState.loading === true) { return "continue moving" }
    return "pick up unit"
  }
  
  const icon = () => {
    if (game.moveState.loading === true) { return MoveGlyph() }
    return <BoxArrowInUp />
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
