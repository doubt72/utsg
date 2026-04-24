import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import OverstackState from "../../../../engine/control/state/OverstackState";
import { EliminateGlyph } from "../../../utilities/buttons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface OverstackReduceButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function OverstackReduceButton({ game, vertical, callback }: OverstackReduceButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const state = game.gameState as OverstackState
    state.finish()
    callback()
  }

  const text = "eliminate"

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
