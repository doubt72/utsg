import React, { FormEvent, useEffect } from "react";
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
  const hotkey = "R"
  const submit = () => {
    if (game.gameState?.type === stateType.RoutAll) {
      game.gameState?.finish()
    } else {
      game.setGameState(new RoutAllState(game))
    }
    callback()
  }

  useEffect(() => {
    if (localStorage.getItem("hotkeys") === "true") {
      const hotKeyListener = (e: KeyboardEvent) => {
        if (e.key === hotkey.toLowerCase() && e.ctrlKey) {
          e.preventDefault()
          e.stopPropagation()
          submit()
        }
      }
      window.addEventListener('keyup', hotKeyListener)

      return () => {
        window.removeEventListener('keyup', hotKeyListener)
      }
    }
  }, [])

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    submit()
  }

  const text = () => {
    if (game.gameState?.type === stateType.RoutAll) {
      return "confirm rout enemy"
    } else {
      const mod = game.routCount()*2
      if (vertical) {
        return `rout enemy (3)${ mod > 0 ? ` [+${mod} rally modifier]` : "" }`
      } else {
        return `rout enemy (3)${ mod > 0 ? ` [rally +${mod}]` : "" }`
      }
    }
  }

  const buttonTooltip = (props: TooltipProps) => (
    <Tooltip className="tooltip-game" {...props}>
      { text() }{ localStorage.getItem("hotkeys") === "true" ? ` ^${hotkey}` : "" }
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
            {RoutGlyph()} {text()} {
              localStorage.getItem("hotkeys") === "true" ? <span className="button-hotkey">^{hotkey}</span> : ""
            }
          </button>
        }
      </div>
    </form>
  )
}
