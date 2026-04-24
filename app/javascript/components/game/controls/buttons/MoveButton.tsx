import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { MoveGlyph } from "../../../utilities/buttons";
import MoveState from "../../../../engine/control/state/MoveState";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface MoveButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function MoveButton({ game, vertical, callback }: MoveButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.setGameState(new MoveState(game))
    callback()
  }

  const text = "move (2)"

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
              {MoveGlyph()}
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            {MoveGlyph()} {text}
          </button>
        }
      </div>
    </form>
  )
}
