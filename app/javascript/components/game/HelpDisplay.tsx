import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { findHelpSection, helpIndex, HelpSection } from "../help/helpData";
import Logo from "../Logo";
import { subtitleName, titleName } from "../../utilities/utilities";

export default function HelpDisplay() {
  const navigate = useNavigate()
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
  }

  const onSubmit = (curr: number[]) => {
    changeSection(curr)
    navigate(`/help/${curr.map(n => n+1).join(".")}`)
  }

  const mapSections = (l: HelpSection[], ll: number[]): JSX.Element => {
    return (
      <div>{l.map((s, i) => {
        const sec = ll.concat(i)
        // TODO: remove this (and the ***'s) once we have a full set of docs
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
      const keyName = key.join(".")
      if (sec.section) {
        const header = `${keyName}. ${sec.fullName}`
        sections.push(
          <div key={keyName} id={keyName}>
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
    changeSection(section.split(".").map(n => Number(n)-1))
    setAllSections(allMapSections(helpIndex, []))
  }, [])

  useEffect(() => {
    changeSection(section.split(".").map(n => Number(n)-1))
  }, [location])

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
        <div className="help-section">
          {allSections}
        </div>
      </div>
      <div className="help-side"></div>
    </div>
  )
}
