import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GameReplay from "../../engine/GameReplay";

interface ActionReplayDisplayProps {
  gameReplay: GameReplay,
  currentSequence: number,
}

export default function ActionReplayDisplay({ gameReplay, currentSequence }: ActionReplayDisplayProps) {
  const [actionList, setActionList] = useState<JSX.Element | undefined>()

  useEffect(() => {
    setActionList(
      <div className="action-replay-output">
        {
          gameReplay.game.actions.map((action, i) => {
            return (
              <div key={i} id={`replay-action-sequence-${action.sequence}`}
                   className={`action-replay-output-record${
                     action.sequence === currentSequence ? " action-replay-output-record-selected": ""
                   }`}>
                <div className="action-output-date nowrap">{action.formattedDate}</div>
                <div className="action-output-message">
                  {["phase", "status_update"].includes(action.type) ||
                  ["start", "resign", "finish"].includes(action.data.action) ?
                    <span className="action-output-game">&gt;&gt;</span> :
                    <span className="action-output-username">
                      <Link className="user-link" to={`/profile/${action.user}`} >{action.user}</Link>
                    </span> }
                  <span dangerouslySetInnerHTML={{ __html: action.htmlValue }}></span>
                  <span className="red">{action.undone ? " [cancelled]" : ""}</span>
                </div>
              </div>
            )
          }).reverse()
        }
      </div>
    )
    const element = document.getElementById(`replay-action-sequence-${currentSequence}`)
    element?.scrollIntoView({ behavior: "smooth" })
  }, [currentSequence])

  return (
    <div>
      { actionList }
    </div>
  )
}
