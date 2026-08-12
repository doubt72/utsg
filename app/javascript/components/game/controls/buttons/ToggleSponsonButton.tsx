import React, { FormEvent, useEffect } from "react";
import Game from "../../../../engine/Game";
import { FireGlyph } from "../../../utilities/buttons";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface ToggleSponsonButtonProps {
  game: Game;
  vertical: boolean;
  callback: () => void;
}

export default function ToggleSponsonButton({ game, vertical, callback }: ToggleSponsonButtonProps) {
  const hotkey = "T"
  const submit = () => {
    game.fireState.sponsonToggle()
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
    return game.fireState.sponson ? "use turret" : "use hull gun"
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
              {FireGlyph()}
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            {FireGlyph()} {text()} {
              localStorage.getItem("hotkeys") === "true" ? <span className="button-hotkey">^{hotkey}</span> : ""
            }
          </button>
        }
      </div>
    </form>
  )
}
