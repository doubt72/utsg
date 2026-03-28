import React, { FormEvent, useState, useEffect } from "react";
import { PersonPlus } from "react-bootstrap-icons";
import { postAPI } from "../../../../utilities/network";

interface JoinButtonProps {
  gameId: number;
}

export default function JoinButton({ gameId }: JoinButtonProps) {
  const [className, setClassName] = useState<string>("custom-button-orange nowrap")

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    postAPI(`/api/v1/games/${gameId}/join`, {}, {
      ok: () => {}
    })
  }

  const button = <button type="submit" className={className}><PersonPlus/>join game</button>

  useEffect(() => {
    setTimeout(() => {
      setClassName("custom-button nowrap")
    }, 1600)

    setTimeout(() => {
      setClassName("custom-button-orange nowrap")
    }, 1800)

    setTimeout(() => {
      setClassName("custom-button nowrap")
    }, 2000)

    setTimeout(() => {
      setClassName("custom-button-orange nowrap")
    }, 2200)
  }, [])

  return (
    <form onSubmit={onSubmit}>
      <div className="mb025em">
        { button }
      </div>
    </form>
  )
}
