import React, { useEffect, useState } from "react";
import Header from "../Header"
import ProfileEditInfo from "./ProfileEditInfo"
import ProfileEditPassword from "./ProfileEditPassword"
import { CustomCheckbox, ReturnButton } from "../utilities/buttons";
import { getAPI, putAPI } from "../../utilities/network";
import { useParams } from "react-router-dom";
import { ArrowCounterclockwise, Ban, StarFill } from "react-bootstrap-icons";

type GameStats = { name: string, count: number, win: number, loss: number, wait: number, abandoned: number }
type UserData = { username: string, email: string, proto?: string, mcp: string, banned: string }

export default function Profile() {
  const username: string | undefined = useParams().username

  const [stats, setStats] = useState<{ [index: string]: GameStats }>({})
  const [user, setUser] = useState<UserData | undefined>()
  const [resetSettings, setResetSettings] = useState<boolean>(true)
  const [resetUser, setResetUser] = useState<boolean>(true)

  const [colorblind, setColorblind] = useState<boolean>(false)
  const [animations, setAnimations] = useState<boolean>(false)
  const [notifications, setNofications] = useState<boolean>(true)

  const [header, setHeader] = useState<JSX.Element | undefined>()
  const [statDisplay, setStatDisplay] = useState<JSX.Element | undefined>()
  const [settings, setSettings] = useState<JSX.Element | undefined>()

  useEffect(() => {
    getAPI(`/api/v1/user/stats?id=${username}`, {
      ok: response => response.json().then(json => {
        setStats(json.stats)
        setUser(json.user)
      })
    })
  }, [resetUser])

  useEffect(() => {
    if (!stats?.all) { return }
    setStatDisplay(
      <table>
        <tbody>
          <tr>
            <th>scenario</th><th>ready</th><th>stalled</th><th>wins</th><th>losses</th><th>total</th>
          </tr>
          <tr>
            <td className="green">total</td>
            <td>{ stats?.all.wait }</td>
            <td>{ stats?.all.abandoned }</td>
            <td>{ stats?.all.win }</td>
            <td>{ stats?.all.loss }</td>
            <td>{ stats?.all.count }</td>
          </tr>
          { Object.keys(stats).filter(a => a !== "all").sort((a, b) => {
            if (stats[a].count === stats[b].count) { return 0 }
            return stats[a].count > stats[b].count ? -1 : 1
          }).map((k, i) => {
            return (
              <tr key={i} >
                <td className="red nowrap">{ k }: { stats[k].name }</td>
                <td>{ stats[k].wait }</td>
                <td>{ stats[k].abandoned }</td>
                <td>{ stats[k].win }</td>
                <td>{ stats[k].loss }</td>
                <td>{ stats[k].count }</td>
              </tr>
            )
          }) }
        </tbody>
      </table>
    )
  }, [stats])

  useEffect(() => {
    setColorblind(localStorage.getItem("colorblind") === "true")
    setAnimations(localStorage.getItem("noanim") === "true")
    setNofications(localStorage.getItem("notifications") === "true")
  }, [])

  useEffect(() => {
    const self = localStorage.getItem("username") === username
    const proto = user?.proto ? <span className="green">&#x2605;</span> : ""
    const mcp = user?.mcp ? <span className="red">&#x2605;</span> : ""
    const banned = user?.banned && localStorage.getItem("mcp") ? <span className="red">&#x2298;</span> : ""
    const first = <p>Profile for {proto}{mcp}{banned}{username}</p>
    const header = self ?
      <>
        { first }
        <p>Your game stats (does not include hotseat games):</p>
      </> :
      <>
        { first }
        <p>Games stats (does not include hotseat games):</p>
      </>
    setHeader(header)
    if (self) {
      setSettings(
        <div>
          <div className="profile-prefs">
            <p>Preferences:</p>
            <div>
              <CustomCheckbox onClick={() => {
                setColorblind(s => {
                  localStorage.setItem("colorblind", s ? "false" : "true")
                  return !s
                })
              }} selected={colorblind}/>
              <span className="font11em">high contrast display for colorblindness</span>
            </div>
            <div>
              <CustomCheckbox onClick={() => {
                putAPI(`/api/v1/user/toggle_notifications`, {}, {
                  ok: () => {
                    setNofications(s => {
                      localStorage.setItem("notifications", s  ? "false" : "true")
                      return !s
                    })
                  }
                })
              }} selected={notifications}/>
              <span className="font11em">email turn notifications</span>
            </div>
            <div>
              <CustomCheckbox onClick={() => {
                setAnimations(s => {
                  localStorage.setItem("noanim", s ? "false" : "true")
                  return !s
                })
              }} selected={animations}/>
              <span className="font11em">disable map animations</span>
            </div>
            <p className="mt1em">
              Disabling map animations is not recommended except for Safari users.  Instead of
              using that option, a better solution is not using Safari in the first
              place &mdash; it&apos;s rendering performance is abysmal.
            </p>
          </div>
        </div>
      )
    }
  }, [user, colorblind, animations, notifications])

  return (
    <div>
      <Header hideProfile="true" />
      <div className="standard-body">
        <div className="profile-main">
          { header }
          { statDisplay }
          { settings }
          <div className="flex mt2em">
            <div className="flex-fill"></div>
            { resetSettings && localStorage.getItem("username") === username ?
              <div>
                <a className="custom-button nowrap" onClick={() => {
                  localStorage.removeItem("mapInterfaceShrink")
                  localStorage.removeItem("mapScale")
                  localStorage.removeItem("mapCollapseLayout")
                  localStorage.removeItem("mapCoords")
                  localStorage.removeItem("mapMarkers")
                  setResetSettings(false)
                }}>
                  <ArrowCounterclockwise />reset map prefs
                </a>
              </div> : "" }
            { localStorage.getItem("mcp") ?
              <div>
                <a className="custom-button nowrap" onClick={() => {
                  putAPI(`/api/v1/user/toggle_dev`, {
                    id: username,
                  }, {
                    ok: () => setResetUser(s => !s)
                  })
                }}>
                  <StarFill />toggle dev
                </a>
              </div> : "" }
            { localStorage.getItem("mcp") ?
              <div>
                <a className="custom-button nowrap" onClick={() => {
                  putAPI(`/api/v1/user/toggle_banned`, {
                    id: username,
                  }, {
                    ok: () => setResetUser(s => !s)
                  })
                }}>
                  <Ban />toggle ban
                </a>
              </div> : "" }
            <div><ReturnButton /></div>
          </div>
        </div>
        { localStorage.getItem("username") === username ? <ProfileEditInfo /> : "" }
        { localStorage.getItem("username") === username ? <ProfileEditPassword /> : "" }
      </div>
    </div>
  )
}
