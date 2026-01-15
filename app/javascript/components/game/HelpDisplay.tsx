import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { findHelpSection, helpIndex, HelpSection } from "../help/helpData";
import Logo from "../Logo";
import { subtitleName, titleName } from "../../utilities/utilities";
import { useOnInView } from "react-intersection-observer";

interface SectionComponentProps {
  id: string,
  header: string,
  ll: number[],
  section: JSX.Element,
  setState: React.Dispatch<React.SetStateAction<{ [index: string]: boolean }>>
}

function SectionComponent({ id, header, ll, section, setState }: SectionComponentProps) {
  const obRef = useOnInView(
    (ob) => {
      if (ob) {
        setState(s => { return { ...s, [id]: true } })
      } else {
        setState(s => { return { ...s, [id]: false } })
      }
    }
  )

  return (
    <div id={`s${id}`} ref={o => {obRef(o)}}>
      { ll.length === 0 ?
          <h1>{ header }</h1> :
          <h2>{ header }</h2> }
      { section }
    </div>
  )
}

export default function HelpDisplay() {
  const navigate = useNavigate()
  const section: string = useParams().section ?? "1"

  const [sectionKey, setSectionKey] = useState<number[]>([])
  const [allSections, setAllSections] = useState<JSX.Element[]>([])
  const [sectionList, setSectionList] = useState<JSX.Element | undefined>()
  const [visible, setVisible] = useState<{ [index: string]: boolean }>({})



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
    navigate(`/help/${curr.map(n => n+1).join(".")}`)
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
          <SectionComponent key={keyName} id={keyName} header={header} ll={ll} section={sec.section}
                            setState={setVisible}>
          </SectionComponent>
        )
        if (sec.children) {
          sections = sections.concat(allMapSections(sec.children, key))
        }
      }
    })
    return sections
  }

  useEffect(() => {
    const sections = allMapSections(helpIndex, [])
    setAllSections(sections)
    const delays = [0, 75, 150, 250, 500, 1000]
    // AFAIK there's no way to actually know when all the subcomponents are done
    // rendering, so keep getting closer and closer until correct (the last few
    // values should just invisibly navigate to the same place, even on slower
    // machines most browsers should get there by ~200ms)
    for (const delay of delays) {
      setTimeout(() => changeSection(section.split(".").map(n => Number(n)-1)), delay)
    }
  }, [])

  useEffect(() => {
    setSectionList(mapSections(helpIndex, []))
  }, [sectionKey])

  useEffect(() => {
    const sections: string[] = []
    for (const key in visible) {
      if (visible[key]) { sections.push(key)}
    }
    if (sections.length > 0) { setSectionKey(sections.sort()[0].split("-").map(n => Number(n) - 1)) }
  }, [visible])

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
