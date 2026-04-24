import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { MoveRushGlyph } from "../../../utilities/buttons";
import AssaultState from "../../../../engine/control/state/AssaultState";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface AssaultMoveButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function AssaultMoveButton({ game, vertical, callback }: AssaultMoveButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    game.setGameState(new AssaultState(game))
    callback()
  }

  const text = "assault move (3)"

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
              {MoveRushGlyph()}
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            {MoveRushGlyph()} {text}
          </button>
        }
      </div>
    </form>
  )
}
