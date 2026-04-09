import React, { useEffect, useState } from "react";
import { statAddOne, statIncrementAllOne, StatLookup, StatUserData } from "../debug/statHelpers";
import { getAPI } from "../utilities/network";
import { counterRed } from "../utilities/graphics";
import { displayStat } from "../debug/DebugScenarioStats";

export default function AdminUsers() {
  const [users, setUsers] = useState<StatUserData[]>([])
  
  const [countDev, setCountDev] = useState<StatLookup>({})
  const [countAdmin, setCountAdmin] = useState<StatLookup>({})
  const [countCC, setCountCC] = useState<StatLookup>({})
  const [countRC, setCountRC] = useState<StatLookup>({})
  const [countRCValid, setCountRCValid] = useState<StatLookup>({})
  const [countVerified, setCountVerified] = useState<StatLookup>({})
  const [countBanned, setCountBanned] = useState<StatLookup>({})

  const [userDisplay, setUserDisplay] = useState<JSX.Element[]>([])

  useEffect(() => {
    const url = "/api/v1/user/all"
    getAPI(url, {
      ok: response => {
        response.json().then(json => {
          setUsers(json.data)
        })
      }
    })
  }, [])

  useEffect(() => {
    const cproto: StatLookup = { all: 0 }
    const cmcp: StatLookup = { all: 0 }
    const ccc: StatLookup = { all: 0 }
    const crc: StatLookup = { all: 0 }
    const crcv: StatLookup = { all: 0 }
    const cv: StatLookup = { all: 0 }
    const cb: StatLookup = { all: 0 }
    for (const u of users) {
      statIncrementAllOne([cproto, cmcp, ccc, crc, cv, cb])
      statAddOne(cproto, u.proto)
      statAddOne(cmcp, u.mcp)
      statAddOne(ccc, u.cc)
      statAddOne(crc, u.rc)
      statAddOne(cv, u.verified)
      statAddOne(cb, u.banned)
      if (u.rc) {
        statIncrementAllOne([crcv])
      statAddOne(crcv, u.rc_valid)
      }
    }
    setCountDev(() => cproto)
    setCountAdmin(() => cmcp)
    setCountCC(() => ccc)
    setCountRC(() => crc)
    setCountRCValid(() => crcv)
    setCountVerified(() => cv)
    setCountBanned(() => cb)
    const rows = []
    for (let i = 0; i < users.length; i++) {
      const user = users[i]
      rows.push(
        <tr key={i}>
          <td style={{ padding: "0 8px"}}><a href={`/profile/${user.username}`}>{user.username}</a></td>
          <td style={{ padding: "0 8px"}}>{user.email}</td>
          <td style={{ padding: "0 8px"}}>{`${user.cc}`}</td>
          <td style={{ padding: "0 8px", color: user.verified ? "#000" : counterRed() }}>{`${user.verified}`}</td>
          <td style={{ padding: "0 8px"}}>{`${user.rc}`}</td>
          <td style={{ padding: "0 8px"}}>{`${user.rc_valid}`}</td>
          <td style={{ padding: "0 8px", color: user.proto ? counterRed() : "#000" }}>{`${user.proto}`}</td>
          <td style={{ padding: "0 8px", color: user.mcp ? counterRed() : "#000" }}>{`${user.mcp}`}</td>
          <td style={{ padding: "0 8px", color: user.banned ? counterRed() : "#000" }}>{`${user.banned}`}</td>
        </tr>
      )
    }
    setUserDisplay(rows)
  }, [users])

  return (
    <div className="flex flex-wrap">
      <div className="p1em">
        Developer:
        {displayStat(countDev, {})}
        Admin:
        {displayStat(countAdmin, {})}
        Banned:
        {displayStat(countBanned, {})}
        Verified:
        {displayStat(countVerified, {})}
        Confirmation Code:
        {displayStat(countCC, {})}
        Recovery Code:
        {displayStat(countRC, {})}
        Recovery Code Valid:
        {displayStat(countRCValid, {})}
      </div>
      <div className="p1em">
        <table>
          <tbody>
            <tr>
              <th style={{ padding: "0 8px"}}>Name</th>
              <th style={{ padding: "0 8px"}}>Email</th>
              <th style={{ padding: "0 8px"}}>CC</th>
              <th style={{ padding: "0 8px"}}>Verified</th>
              <th style={{ padding: "0 8px"}}>RC</th>
              <th style={{ padding: "0 8px"}}>Valid</th>
              <th style={{ padding: "0 8px"}}>Dev</th>
              <th style={{ padding: "0 8px"}}>Admin</th>
              <th style={{ padding: "0 8px"}}>Banned</th>
            </tr>
            { userDisplay }
          </tbody>
        </table>
      </div>
    </div>
  )
}
