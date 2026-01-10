import React, { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { findHelpSection, helpIndex, HelpSection } from "../help/helpData";
import Logo from "../Logo";
import { subtitleName, titleName } from "../../utilities/utilities";

export default function HelpDisplay() {
  const section: string = useParams().section ?? "1"

  const [sectionKey, setSectionKey] = useState<number[]>([])
  const [allSections, setAllSections] = useState<JSX.Element[]>([])
  const [sectionList, setSectionList] = useState<JSX.Element | undefined>()

  const compareList = (a: number[], b: number[]): boolean => {
    if (a.length !== b.length) { return false }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) { return false }
    }
    return true
  }

  const changeSection = (curr: number[]) => {
    setSectionKey(curr)
    document.querySelector(`#s${curr.map(n => n+1).join("-")}`)?.scrollIntoView()
  }

  const onSubmit = (curr: number[]) => {
    changeSection(curr)
  }

  const mapSections = (l: HelpSection[], ll: number[]): JSX.Element => {
    return (
      <div>{l.map((s, i) => {
        const sec = ll.concat(i)
        const section = findHelpSection(sec)?.section
        return (
          <div key={sec.join(".")} className="ml1em nowrap">
            <form onSubmit={(event: FormEvent) => {
                event.preventDefault()
                onSubmit(sec)}
              }>
              <button type="submit" className={
                `custom-button ${compareList(sec, sectionKey) ? "help-section-selected" : "help-section-unselected"}`
                }>{sec.map(n => n+1).join(".")}&nbsp; { section ? s.name : <span className="help-button-deleteme">{ s.name }</span> }{  }
              </button>
            </form>
            {s.children ? mapSections(s.children, sec) : undefined }
          </div>)}
        )
      }
      </div>
    )
  }

  const allMapSections = (help: HelpSection[], ll: number[]): JSX.Element[] => {
    let sections: JSX.Element[] = []
    help.forEach((sec, i) => {
      const key = ll.concat(i + 1)
      const keyName = key.join("-")
      if (sec.section) {
        const header = `${key.join(".")}. ${sec.fullName}`
        sections.push(
          <div key={keyName} id={`s${keyName}`}>
            { ll.length === 0 ?
                <h1>{ header }</h1> :
                <h2>{ header }</h2> }
            { sec.section }
          </div>
        )
        if (sec.children) {
          sections = sections.concat(allMapSections(sec.children, key))
        }
      }
    })
    return sections
  }

  useEffect(() => {
    setAllSections(allMapSections(helpIndex, []))
    const delays = [0, 75, 150, 250, 500, 1000]
    // AFAIK there's no way to actually know when all the subcomponents are done
    // rendering, so keep getting closer and closer until correct (the last few
    // values should just invisibly navigate to the same place)
    for (const delay of delays) {
      setTimeout(() => changeSection(section.split(".").map(n => Number(n)-1)), delay)
    }
  }, [])

  useEffect(() => {
    setSectionList(mapSections(helpIndex, []))
  }, [sectionKey])

  return (
    <div className="help-page" style={{ minHeight: window.innerHeight }}>
      <div className="help-side"></div>
      <div className="help-main">
        <div className="help-index" id="index-for-size">
          <div className="help-index-header flex">
            <Logo />
            <div className="ml025em">
              <div className="header-name">{ titleName }</div>
              <div className="header-subname">{ subtitleName }</div>
            </div>
          </div>
          <h3 className="ml075em">Table of Contents</h3>
          {sectionList}
        </div>
        <div className="help-sections">
          {allSections}
        </div>
      </div>
      <div className="help-side"></div>
    </div>
  )
}
