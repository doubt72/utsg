import React, { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Logo from "../Logo";
import { helpIndex, HelpSection } from "../../help/helpData";

export default function HelpDisplay() {
  const section: string = useParams().section ?? "1"

  const [sectionKey, setSectionKey] = useState<number[]>([])
  const [currSection, setCurrSection] = useState<JSX.Element | undefined>()
  const [sectionList, setSectionList] = useState<JSX.Element | undefined>()

  const onSubmit = (curr: number[]) => {
    let part = helpIndex[curr[0]]
    for (let i = 1; i < curr.length; i++) {
      if (!part.children) { break }
      part = part.children[curr[i]]
    }
    setCurrSection(part.section)
    setSectionKey(curr)
  }

  const compareList = (a: number[], b: number[]): boolean => {
    console.log(`comparing ${a} with ${b}`)
    if (a.length !== b.length) { return false }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) { return false }
    }
    return true
  }

  const mapSections = (l: HelpSection[], ll: number[]): JSX.Element => {
    return (
      <div>{l.map((s, i) => {
        const sec = ll.concat(i)
        return (
          <div key={sec.join(".")} className="ml1em nowrap">
            <form onSubmit={(event: FormEvent) => {
                event.preventDefault()
                onSubmit(sec)}
              }>
              <button type="submit" className={
                `custom-button${compareList(sec, sectionKey) ? " help-button-selected" : ""}`
                }>{sec.map(n => n+1).join(".")}&nbsp; {s.name}
              </button>
            </form>
            {s.children ? mapSections(s.children, sec) : undefined }
          </div>)}
        )
      }
      </div>
    )
  }

  useEffect(() => {
    onSubmit(section.split(".").map(n => Number(n)-1))
  }, [])

  useEffect(() => {
    setSectionList(mapSections(helpIndex, []))
  }, [sectionKey])

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
