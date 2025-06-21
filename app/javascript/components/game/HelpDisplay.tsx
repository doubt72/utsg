import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Logo from "../Logo";
import { helpIndex, HelpSection } from "../../help/helpData";

export default function HelpDisplay() {
  const section: string = useParams().section ?? ""

  const [currSection, setCurrSection] = useState("")
  const [sectionList, setSectionList] = useState<JSX.Element | undefined>()

  const mapSections = (l: HelpSection[], ll: number[]): JSX.Element => {
    return (
      <div>{l.map((s, i) =>
        <div key={i} className="ml1em">
          {s.name}
          {s.children ? mapSections(s.children, ll.concat(i)) : undefined }
        </div>)}
      </div>
    )
  }

  useEffect(() => {
    setCurrSection(section)
    setSectionList(mapSections(helpIndex, []))
  }, [])

  return (
    <div className="help">
      <div className="help-index">
        <Logo />
        {sectionList}
      </div>
      <div className="help-body">
        {currSection}
      </div>
    </div>
  )
}
