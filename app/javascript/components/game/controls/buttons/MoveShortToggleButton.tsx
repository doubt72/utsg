import React, { FormEvent, useEffect } from "react";
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
  const hotkey = "D"
  const submit = () => {
    game.moveState.dropToggle()
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
              {icon()}
            </button>
          </OverlayTrigger> :
          <button type="submit" className="custom-button nowrap">
            {icon()} {text()} {
              localStorage.getItem("hotkeys") === "true" ? <span className="button-hotkey">^{hotkey}</span> : ""
            }
          </button>
        }
      </div>
    </form>
  )
}
