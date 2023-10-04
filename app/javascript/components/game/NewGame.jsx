import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { getAPI } from "../../utilities/network";
import Header from "../Header";
import { CreateGameButton, CustomCheckbox } from "../utilities/buttons";
import ScenarioRow from "./ScenarioRow";

export default function NewGame() {
  // const navigate = useNavigate()
  const [formInput, setFormInput] = useState({ name: "", player: 1, scenario: ""})
  const [string, setString] = useState("")
  const [allies, setAllies] = useState("")
  const [axis, setAxis] = useState("")
  const [formErrors, setFormError] = useState({ name: "" , scenario: "" })
  const [alliedFactions, setAlliedFaction] = useState([])
  const [axisFactions, setAxisFactions] = useState([])
  const [scenarioList, setScenarioList] = useState([])

  const checkScenarios = () => {
    const scenarioTimer = setTimeout(() => {
      const params = {}
      if (string != "") { params.string = string }
      if (allies != "") { params.allies = allies }
      if (axis != "") { params.axis = axis }
      const urlParams = new URLSearchParams(params).toString()
      const url = urlParams.length > 0 ? "/api/v1/scenarios?" + urlParams : "/api/v1/scenarios"
      getAPI(url, {
        ok: response => {
          response.json().then(json => {
            const list = []
            console.log(json)
            for(const rec of json) {
              list.push(
                <ScenarioRow key={rec.id} code={rec.id} name={rec.name} allies={rec.allies} axis={rec.axis}/>
              )
            }
            setScenarioList(list)
          })
        }
      })
    }, 1000)
    if (scenarioTimer > 0) {
      clearTimeout(scenarioTimer - 1)
    }
  }

  useEffect(() => {
    checkScenarios()
  }, [string, allies, axis])

  useEffect(() => {
    getAPI("/api/v1/scenarios/allied_factions", {
      ok: respons => respons.json().then(json => {
        const allies = [<option key="" value="">[ any ]</option>]
        for (const rec of json) {
          allies.push(<option key={rec.code} value={rec.code}>{rec.name}</option>)
        }
        setAlliedFaction(allies)
      })
    })
    getAPI("/api/v1/scenarios/axis_factions", {
      ok: respons => respons.json().then(json => {
        const axis = [<option key="" value="">[ any ]</option>]
        for (const rec of json) {
          axis.push(<option key={rec.code} value={rec.code}>{rec.name}</option>)
        }
        setAxisFactions(axis)
      })
    })
  }, [])

  const validateName = (name) => {
    if (name == "") {
      setFormError({name: "please choose a name for the game"})
    } else {
      setFormError({name: ""})
    }
  }

  const onNameChange = (value) => {
    validateName(value)
    setFormInput({ ...formInput, name: value })
  }

  const setPlayer = (num) => {
    setFormInput({ ...formInput, player: num })
  }

  const onStringChange = (value) => {
    setString(value)
  }

  const onAlliedChange = (value) => {
    setAllies(value)
  }

  const onAxisChange = (value) => {
    setAxis(value)
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (formInput.name == "") {
      setFormError({name: "please choose a name for the game"})
      return false
    }
    return false
    // if (!validateForm("", "") || anyEmpty()) {
    //   return false
    // } else {
    //   const body = {
    //     user: {
    //       username: formInput.username,
    //       email: formInput.email,
    //     }
    //   }

    //   putAPI("/api/v1/user", body, {
    //     ok: response => {
    //       response.json().then(json => {
    //         localStorage.setItem("username", json.username)
    //         localStorage.setItem("email", json.email)
    //         navigate("/profile", { replace: true })
    //       })
    //     }
    //   })
    // }
  }

  return (
    <div className="main-page">
      <Header />
      <form onSubmit={onSubmit}>
        <div className="standard-body">
          <div className="game-form-container">
            Create a new game:
            <label className="form-label">name</label>
            <input
              type="text"
              name="name"
              value={formInput.name}
              className="form-input"
              onChange={({ target }) => onNameChange(target.value)}
            />
            <div className="red">{formErrors.name}</div>
            <div className="mt1em">
              <CustomCheckbox onClick={() => setPlayer(1)} selected={ formInput.player === 1 }/>
              <span className="font11em">play allied side</span>
            </div>
            <div>
              <CustomCheckbox onClick={() => setPlayer(2)} selected={ formInput.player === 2 }/>
              <span className="font11em">play axis side</span>
            </div>
            <div className="align-end">
              <CreateGameButton type="confirm" />
            </div>
          </div>
          <div className="scenario-list-container">
            <div className="scenario-list-filter">
              <label>scenario names filter</label>
              <input
                type="text"
                name="string"
                value={string}
                className="form-input-gray"
                onChange={({ target }) => onStringChange(target.value)}
              />
            </div>
            <div className="scenario-list-filter">
              <label>allied faction filter</label><br />
              <select
                name="allies"
                className="form-input-gray"
                onChange={({ target }) => onAlliedChange(target.value)}
              >
                {alliedFactions}
              </select>
            </div>
            <div className="scenario-list-filter">
              <label>axis faction filter</label><br />
              <select
                name="axis"
                className="form-input-gray"
                onChange={({ target }) => onAxisChange(target.value)}
              >
                {axisFactions}
              </select>
            </div>
            <div className="scenario-list-select">
              Select scenario:<br />
              {scenarioList}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
