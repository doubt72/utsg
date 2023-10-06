import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { getAPI } from "../../utilities/network";
import Header from "../Header";
import { CreateGameButton, CustomCheckbox } from "../utilities/buttons";
import ScenarioRow from "./ScenarioRow";

export default function NewGame() {
  // const navigate = useNavigate()
  const [formInput, setFormInput] = useState({ name: "", player: 1, scenario: "" })
  const [formErrors, setFormErrors] = useState({ name: "" , scenario: "" })

  const [scenarioSearch, setScenarioSearch] = useState({ string: "", allies: "", axis: "" })
  const [scenarioList, setScenarioList] = useState([])

  const [alliedFactions, setAlliedFactions] = useState([])
  const [axisFactions, setAxisFactions] = useState([])

  const checkScenarios = () => {
    const scenarioTimer = setTimeout(() => {
      const params = {}
      if (scenarioSearch.string != "") { params.string = scenarioSearch.string }
      if (scenarioSearch.allies != "") { params.allies = scenarioSearch.allies }
      if (scenarioSearch.axis != "") { params.axis = scenarioSearch.axis }
      const urlParams = new URLSearchParams(params).toString()
      const url = urlParams.length > 0 ? "/api/v1/scenarios?" + urlParams : "/api/v1/scenarios"
      getAPI(url, {
        ok: response => {
          response.json().then(json => { setScenarioList(json) })
        }
      })
    }, 500)
    if (scenarioTimer > 0) {
      clearTimeout(scenarioTimer - 1)
    }
  }

  useEffect(() => {
    checkScenarios()
  }, [scenarioSearch.string, scenarioSearch.allies, scenarioSearch.axis])

  useEffect(() => {
    getAPI("/api/v1/scenarios/allied_factions", {
      ok: respons => respons.json().then(json => { setAlliedFactions(json) })
    })
    getAPI("/api/v1/scenarios/axis_factions", {
      ok: respons => respons.json().then(json => { setAxisFactions(json) })
    })
  }, [])

  const validateName = (name) => {
    if (name == "") {
      setFormErrors({ ...formErrors, name: "please choose a name for the game" })
    } else {
      setFormErrors({ ...formErrors, name: "" })
    }
  }

  const onNameChange = (value) => {
    validateName(value)
    setFormInput({ ...formInput, name: value })
  }

  const setPlayer = (num) => {
    setFormInput({ ...formInput, player: num })
  }

  const setScenario = (code) => {
    setFormInput({ ...formInput, scenario: code })
    setFormErrors({ ...formErrors, scenario: "" })
  }

  const onSearchChange = (name, value) => {
    setScenarioSearch({ ...scenarioSearch, [name]: value })
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (formInput.name == "") {
      setFormErrors({ ...formErrors, name: "please choose a name for the game" })
      return false
    } else if (formInput.scenario == "") {
      setFormErrors({ ...formErrors, scenario: "please select a scenario" })
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

  const alliedFactionSelector = (
    <select
      name="allies"
      className="form-input-gray"
      onChange={({ target }) => onSearchChange(target.name, target.value)}
    >
      <option key="" value="">[ any ]</option>
      {
        alliedFactions.map(faction => {
          return <option key={faction.code} value={faction.code}>{faction.name}</option>
        })
      }
    </select>
  )

  const axisFactionSelector = (
    <select
      name="axis"
      className="form-input-gray"
      onChange={({ target }) => onSearchChange(target.name, target.value)}
    >
      <option key="" value="">[ any ]</option>
      {
        axisFactions.map(faction => {
          return <option key={faction.code} value={faction.code}>{faction.name}</option>
        })
      }
    </select>
  )

  const scenarioDisplayList = (
    scenarioList.map(row => {
      return (
        <ScenarioRow
          onClick={setScenario} selected={formInput.scenario === row.id}
          key={row.id} code={row.id} name={row.name}
          allies={row.allies} axis={row.axis}
        />
      )
    })
  )

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
              <span className="font11em">play as allied side</span>
            </div>
            <div>
              <CustomCheckbox onClick={() => setPlayer(2)} selected={ formInput.player === 2 }/>
              <span className="font11em">play as axis side</span>
            </div>
            <div className="align-end">
              <CreateGameButton type="confirm" />
            </div>
          </div>
          <div className="scenario-list-container">
            <div className="scenario-list-filter">
              <label>filter by scenario name</label>
              <input
                type="text"
                name="string"
                value={scenarioSearch.string}
                className="form-input-gray"
                onChange={({ target }) => onSearchChange(target.name, target.value)}
              />
            </div>
            <div className="scenario-list-filter">
              <label>by allied faction</label><br />
              {alliedFactionSelector}
            </div>
            <div className="scenario-list-filter">
              <label>by axis faction</label><br />
              {axisFactionSelector}
            </div>
            <div className="scenario-list-select">
              <div>select scenario:</div>
              <div className="red">{formErrors.scenario}</div>
              {scenarioDisplayList}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
