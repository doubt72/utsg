import React, { FormEvent, useEffect } from "react";
import { ArrowClockwise } from "react-bootstrap-icons";
import Game from "../../../../engine/Game";
import { stateType } from "../../../../engine/control/state/BaseState";
import PassState from "../../../../engine/control/state/PassState";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface PassButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function PassButton({ game, vertical, callback }: PassButtonProps) {
  const hotkey = "P"
  const submit = () => {
    if (game.gameState?.type === stateType.Pass) {
      game.gameState.finish()
    } else {
      game.setGameState(new PassState(game))
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
    const amount = game.passAmount
    if (game.gameState?.type === stateType.Pass) {
      return "confirm pass"
    } else {
      return `pass (${amount})`
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
              <ArrowClockwise />
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            <ArrowClockwise /> {text()} {
              localStorage.getItem("hotkeys") === "true" ? <span className="button-hotkey">^{hotkey}</span> : ""
            }
          </button>
        }
      </div>
    </form>
  )
}
