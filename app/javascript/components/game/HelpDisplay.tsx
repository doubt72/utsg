import React, { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Logo from "../Logo";
import { helpIndex, HelpSection } from "../../help/helpData";

export default function HelpDisplay() {
  const section: string = useParams().section ?? "1"

  const [currSection, setCurrSection] = useState<JSX.Element | undefined>()
  const [sectionList, setSectionList] = useState<JSX.Element | undefined>()

  const onSubmit = (curr: number[]) => {
    let part = helpIndex[curr[0]]
    for (let i = 1; i < curr.length; i++) {
      if (!part.children) { break }
      part = part.children[curr[i]]
    }
    setCurrSection(part.section)
  }

  const mapSections = (l: HelpSection[], ll: number[]): JSX.Element => {
    return (
      <div>{l.map((s, i) => {
        return (
          <div key={i} className="ml1em nowrap">
            <form onSubmit={(event: FormEvent) => {
                event.preventDefault()
                onSubmit(ll.concat(i))}
              }>
              <button type="submit" className="custom-button">
                {ll.concat(i).map(n => n+1).join(".")}&nbsp; {s.name}
              </button>
            </form>
            {s.children ? mapSections(s.children, ll.concat(i)) : undefined }
          </div>)}
        )
      }
      </div>
    )
  }

  useEffect(() => {
    onSubmit(section.split(".").map(n => Number(n)-1))
    setSectionList(mapSections(helpIndex, []))
  }, [])

  return (
    <div className="help-page">
      <div className="help-index">
        <div className="help-index-header">
          <Logo />
        </div>
        <h3 className="ml075em mt1em">Table of Contents</h3>
        {sectionList}
      </div>
      <div className="help-body">
        {currSection}
      </div>
    </div>
  )
}
