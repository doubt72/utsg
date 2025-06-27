import React, { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { findHelpSection, flatHelpIndexes, helpIndex, HelpSection } from "../../help/helpData";
import Logo from "../Logo";
import { subtitleName, titleName } from "../../utilities/utilities";

export default function HelpDisplay() {
  const navigate = useNavigate()
  const location = useLocation()
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

  const changeSection = (curr: number[]) => {
    setCurrSection(findHelpSection(curr)?.section)
    setSectionKey(curr)
  }

  const onSubmit = (curr: number[]) => {
    changeSection(curr)
    navigate(`/help/${curr.map(n => n+1).join(".")}`)
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
    changeSection(section.split(".").map(n => Number(n)-1))
  }, [])

  useEffect(() => {
    console.log("got new location")
    changeSection(section.split(".").map(n => Number(n)-1))
  }, [location])

  useEffect(() => {
    setSectionList(mapSections(helpIndex, []))
    const prevKey = prevSection()
    const nextKey = nextSection()
    const prev = prevKey.map(n => n+1).join(".")
    const next = nextKey.map(n => n+1).join(".")
    setBottomNavigation(
      <div className="flex">
        <div className="flex-fill"></div>
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
          </div> : <div style={{ minWidth: "60px" }}></div> }
          <div className="flex-fill" style={{ minWidth: "100px" }}></div>
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
          </div> : <div style={{ minWidth: "60px" }}></div> }
        </div>
        <div className="flex-fill"></div>
      </div>
    )
  }, [sectionKey])

  return (
    <div className="help-page" style={{ minHeight: window.innerHeight }}>
      <div className="help-side"></div>
      <div className="help-main">
        <div className="help-index">
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
        <div className="help-section">
          {currSection}
          <div className="help-section-fill"></div>
          {bottomNavigation}
        </div>
      </div>
      <div className="help-side"></div>
    </div>
  )
}
