import React, { FormEvent } from "react";
import Game from "../../../../engine/Game";
import { RoutGlyph } from "../../../utilities/buttons";
import { stateType } from "../../../../engine/control/state/BaseState";
import RoutAllState from "../../../../engine/control/state/RoutAllState";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface EnemyRoutButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function EnemyRoutButton({ game, vertical, callback }: EnemyRoutButtonProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (game.gameState?.type === stateType.RoutAll) {
      game.gameState?.finish()
    } else {
      game.setGameState(new RoutAllState(game))
    }
    callback()
  }

  const text = () => {
    if (game.gameState?.type === stateType.RoutAll) {
      return "confirm rout enemy"
    } else {
      return "rout enemy (3)"
    }
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
              {RoutGlyph()}
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            {RoutGlyph()} {text()}
          </button>
        }
      </div>
    </form>
  )
}
