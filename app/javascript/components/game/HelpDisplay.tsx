import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Logo from "../Logo";

export default function HelpDisplay() {
  const section: string = useParams().section ?? ""

  const [currSection, setCurrSection] = useState("")

  useEffect(() => {
    setCurrSection(section)
  }, [])

  return (
    <div className="help">
      <div className="help-index">
        <Logo />
      </div>
      <div className="help-body">
        {currSection}
      </div>
    </div>
  )
}
