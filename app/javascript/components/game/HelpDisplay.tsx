import React, { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { findHelpSection, flatHelpIndexes, helpIndex, HelpSection } from "../../help/helpData";
import Logo from "../Logo";
import { subtitleName, titleName } from "../../utilities/graphics";

export default function HelpDisplay() {
  const section: string = useParams().section ?? "1"

  const [sectionKey, setSectionKey] = useState<number[]>([])
  const [currSection, setCurrSection] = useState<JSX.Element | undefined>()
  const [sectionList, setSectionList] = useState<JSX.Element | undefined>()
  const [bottomNavigation, setBottomNavigation] = useState<JSX.Element | undefined>()

  const compareList = (a: number[], b: number[]): boolean => {
    if (a.length !== b.length) { return false }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) { return false }
    }
    return true
  }

  const prevSection = () => {
    const sections = flatHelpIndexes()
    for (let i = 0; i < sections.length; i++) {
      if (compareList(sections[i], sectionKey)) {
        return sections[i-1] ?? []
      }
    }
    return []
  }

  const nextSection = () => {
    const sections = flatHelpIndexes()
    for (let i = 0; i < sections.length; i++) {
      if (compareList(sections[i], sectionKey)) {
        return sections[i+1] ?? []
      }
    }
    return []
  }

  const onSubmit = (curr: number[]) => {
    setCurrSection(findHelpSection(curr)?.section)
    setSectionKey(curr)
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
    const prevKey = prevSection()
    const nextKey = nextSection()
    const prev = prevKey.map(n => n+1).join(".")
    const next = nextKey.map(n => n+1).join(".")
    setBottomNavigation(
      <div className="help-bottom-navigation flex">
        { prev.length > 0 ?
        <div>
          <form onSubmit={(event: FormEvent) => {
              event.preventDefault()
              onSubmit(prevKey)}
            }>
            <button type="submit" className="custom-button" >
              {prev} &lt; prev
            </button>
          </form>
        </div> : undefined }
        <div className="flex-fill"></div>
        { next.length > 0 ?
        <div>
          <form onSubmit={(event: FormEvent) => {
              event.preventDefault()
              onSubmit(nextKey)}
            }>
            <button type="submit" className="custom-button" >
              next &gt; {next}
            </button>
          </form>
        </div> : undefined }
      </div>
    )
  }, [sectionKey])

  return (
    <div className="help-page">
      <div className="help-index">
        <div className="help-index-header flex">
          <Logo />
          <div className="ml025em">
            <div className="header-name">{ titleName }<span>:</span></div>
            <div className="header-subname">{ subtitleName }</div>
          </div>
        </div>
        <h3 className="ml075em">Table of Contents</h3>
        {sectionList}
      </div>
      <div className="help-body">
        {currSection}
        {bottomNavigation}
      </div>
    </div>
  )
}
