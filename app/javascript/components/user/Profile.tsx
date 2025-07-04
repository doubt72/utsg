import React, { useEffect, useState } from "react";
import Header from "../Header"
import ProfileEditInfo from "./ProfileEditInfo"
import ProfileEditPassword from "./ProfileEditPassword"
import { ReturnButton } from "../utilities/buttons";
import { getAPI } from "../../utilities/network";
import { useParams } from "react-router-dom";

type GameStats = {
  name: string, count: number, win: number, loss: number, wait: number, abandoned: number
}

export default function Profile() {
  const username: string | undefined = useParams().username

  const [stats, setStats] = useState<{ [index: string]: GameStats }>({})
  const [statDisplay, setStatDisplay] = useState<JSX.Element | undefined>()

  useEffect(() => {
    getAPI(`/api/v1/user/stats?id=${username}`, {
      ok: response => response.json().then(json => {
        setStats(json)
      })
    })
  }, [])

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
            return stats[a].count > stats[b].count ? 1 : -1
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

  return (
    <div>
      <Header hideProfile="true" />
      <div className="standard-body">
        <div className="profile-main">
          { localStorage.getItem("username") === username ? 
            <p>
              Hello {username}!
            </p> : "" }
          { localStorage.getItem("username") === username ? 
            <p>
              Your game stats:
            </p> : <p>Games stats:</p> }
          { statDisplay }
          <div className="align-end">
            <ReturnButton />
          </div>
        </div>
        { localStorage.getItem("username") === username ? <ProfileEditInfo /> : "" }
        { localStorage.getItem("username") === username ? <ProfileEditPassword /> : "" }
      </div>
    </div>
  )
}
