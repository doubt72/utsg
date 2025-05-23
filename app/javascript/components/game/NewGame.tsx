import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAPI, postAPI } from "../../utilities/network";
import Header from "../Header";
import { CreateGameButton, CustomCheckbox } from "../utilities/buttons";
import { ArrowDownCircle, ArrowUpCircle, CaretDownFill, CaretUp, CaretUpFill } from "react-bootstrap-icons";
import ScenarioRow from "./ScenarioRow";
import ScenarioSummary from "./ScenarioSummary";
import { Player } from "../../utilities/commonTypes";
import { ScenarioData } from "../../engine/Scenario";

export default function NewGame() {
  const navigate = useNavigate()
  const [formInput, setFormInput] = useState({ name: "", player: 1, scenario: "" })
  const [formErrors, setFormErrors] = useState({ name: "" , scenario: "" })

  const [scenarioSearch, setScenarioSearch] = useState({
    sort: "n", sortDir: "asc", string: "", allies: "", axis: "", theater: "", status: "*",
    type: "", size: "", page: 0,
  })
  const [scroll, setScroll] = useState({ up: false, down: false })
  const [scenarioList, setScenarioList] = useState([])
  const [scenarioData, setScenarioData] = useState(null)

  const [alliedFactions, setAlliedFactions] = useState([])
  const [axisFactions, setAxisFactions] = useState([])

  const loadScenarios = () => {
    const params: Record<string, string> = { page: scenarioSearch.page.toString() }
    params.sort = scenarioSearch.sort
    params.sort_dir = scenarioSearch.sortDir
    if (scenarioSearch.string != "") { params.string = scenarioSearch.string }
    if (scenarioSearch.allies != "") { params.allies = scenarioSearch.allies }
    if (scenarioSearch.axis != "") { params.axis = scenarioSearch.axis }
    if (scenarioSearch.status != "") { params.status = scenarioSearch.status }
    if (scenarioSearch.theater != "") { params.theater = scenarioSearch.theater }
    if (scenarioSearch.type != "") { params.type = scenarioSearch.type }
    if (scenarioSearch.size != "") { params.size = scenarioSearch.size }
    const urlParams = new URLSearchParams(params).toString()
    const url = urlParams.length > 0 ? "/api/v1/scenarios?" + urlParams : "/api/v1/scenarios"
    getAPI(url, {
      ok: response => {
        response.json().then(json => {
          setScenarioList(json.data)
          setScroll({ up: json.page > 0, down: json.more })
        })
      }
    })
  }

  const checkScenarios = () => {
    const scenarioTimer = setTimeout(() => {
      loadScenarios()
    }, 500)
    if (Number(scenarioTimer) > 0) {
      clearTimeout(Number(scenarioTimer) - 1)
    }
  }

  useEffect(() => {
    if (formInput.scenario !== "") {
      const url = `/api/v1/scenarios/${formInput.scenario}`
      getAPI(url, {
        ok: response => {
          response.json().then(json => { setScenarioData(json) })
        }
      })
    } else {
      setScenarioData(null)
    }
  }, [formInput.scenario])

  useEffect(() => {
    setFormInput({ ...formInput, scenario: "" })
    checkScenarios()
  }, [
    scenarioSearch.string, scenarioSearch.allies, scenarioSearch.axis, scenarioSearch.status,
    scenarioSearch.type, scenarioSearch.size, scenarioSearch.theater, scenarioSearch.sort,
    scenarioSearch.sortDir,
  ])

  useEffect(() => {
    loadScenarios()
  }, [scenarioSearch.page])

  useEffect(() => {
    getAPI("/api/v1/scenarios/allied_factions", {
      ok: respons => respons.json().then(json => { setAlliedFactions(json) })
    })
    getAPI("/api/v1/scenarios/axis_factions", {
      ok: respons => respons.json().then(json => { setAxisFactions(json) })
    })
  }, [])

  const validateName = (name: string) => {
    if (name == "") {
      setFormErrors({ ...formErrors, name: "please choose a name for the game" })
    } else {
      setFormErrors({ ...formErrors, name: "" })
    }
  }

  const onNameChange = (value: string) => {
    validateName(value)
    setFormInput({ ...formInput, name: value })
  }

  const setPlayer = (num: Player | 0) => {
    setFormInput({ ...formInput, player: num })
  }

  const setScenario = (code: string) => {
    setFormInput({ ...formInput, scenario: code })
    setFormErrors({ ...formErrors, scenario: "" })
  }

  const onSearchChange = (name: string, value: string) => {
    setScenarioSearch({ ...scenarioSearch, [name]: value, page: 0 })
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const nativeEvent = event.nativeEvent as SubmitEvent
    if (nativeEvent.submitter instanceof HTMLButtonElement &&
        nativeEvent.submitter.name === "check") { return }
    if (formInput.name == "") {
      setFormErrors({ ...formErrors, name: "please choose a name for the game" })
      return false
    } else if (formInput.scenario == "") {
      setFormErrors({ ...formErrors, scenario: "please select a scenario" })
      return false
    } else {
      const user = localStorage.getItem("username") ?? undefined
      const game: { [index: string]: string | undefined } = {
        name: formInput.name,
        scenario: formInput.scenario,
        metadata: JSON.stringify({ turn: 0 }),
      }
      if (formInput.player === 1) {
        game.player_one = user
      } else if (formInput.player === 2) {
        game.player_two = user
      } else {
        game.player_one = user
        game.player_two = user
      }
      postAPI("/api/v1/games", { game: game }, {
        ok: response => {
          response.json().then(json => {
            navigate(`/game/${json.id}`)
          })
        }
      })
    }
  }

  const sorts = [
    { code: "n", name: "Scenario ID"},
    { code: "d", name: "Date"},
    { code: "m", name: "Map Size"},
    { code: "u", name: "Unit Count"},
  ]

  const sortSelector = (
    <div className="flex nowrap" >
      <select
        name="sort"
        className="form-input-gray"
        onChange={({ target }) => onSearchChange(target.name, target.value)}
      >
        {
          sorts.map(sel => {
            return <option key={sel.code} value={sel.code}>{sel.name}</option>
          })
        }
      </select>
      <div className="custom-button sort-button"
            onClick={() => setScenarioSearch(s => {
              return { ...s, sortDir: s.sortDir === "asc" ? "desc" : "asc" }
            }) }>
        { scenarioSearch.sortDir === "asc" ? <ArrowUpCircle /> : <ArrowDownCircle /> }
      </div>
    </div>
  )

  const alliedFactionSelector = (
    <select
      name="allies"
      className="form-input-gray"
      onChange={({ target }) => onSearchChange(target.name, target.value)}
    >
      <option key="" value="">[ any ]</option>
      {
        alliedFactions.map((faction: { code: string, name: string }) => {
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
        axisFactions.map((faction: { code: string, name: string }) => {
          return <option key={faction.code} value={faction.code}>{faction.name}</option>
        })
      }
    </select>
  )

  const statuses = [
    { code: "", name: "Ready"},
    { code: "b", name: "Beta Test"},
    { code: "a", name: "Alpha Test"},
    { code: "p", name: "Prototype"},
    { code: "*", name: "[ any ]"},
  ]

  const statusSelector = (
    <select
      name="status"
      className="form-input-gray"
      onChange={({ target }) => onSearchChange(target.name, target.value)}
    >
      {
        statuses.map(sel => {
          return <option key={sel.code} value={sel.code}>{sel.name}</option>
        })
      }
    </select>
  )

  const theaters = [
    { code: "", name: "[ any ]"},
    { code: "0", name: "East Front"},
    { code: "1", name: "North Africa"},
    { code: "2", name: "Italy/Sicily"},
    { code: "3", name: "Normandy/West"},
    { code: "4", name: "Pacific"},
    { code: "5", name: "Europe Other"},
    { code: "6", name: "China/Asia"},
    // { code: "7", name: "Spain/Africa"},
    // { code: "8", name: "Korea"},
    // { code: "9", name: "Hypthetical"},
  ]

  const theaterSelector = (
    <select
      name="theater"
      className="form-input-gray"
      onChange={({ target }) => onSearchChange(target.name, target.value)}
    >
      {
        theaters.map(sel => {
          return <option key={sel.code} value={sel.code}>{sel.name}</option>
        })
      }
    </select>
  )

  const unitClasses = [
    { code: "", name: "[ any ]"},
    { code: "inf", name: "Infantry Only"},
    { code: "art", name: "Infantry and Artillery"},
    { code: "tank", name: "Vehicles Only"},
    { code: "no_feat", name: "Units Only"},
  ]

  const classSelector = (
    <select
      name="type"
      className="form-input-gray"
      onChange={({ target }) => onSearchChange(target.name, target.value)}
    >
      {
        unitClasses.map(sel => {
          return <option key={sel.code} value={sel.code}>{sel.name}</option>
        })
      }
    </select>
  )

  const sizes = [
    { code: "", name: "[ any ]"},
    { code: "2x1", name: "15x11 (2x1 pages)"},
    { code: "2x2", name: "15x23 (2x2 pages)"},
    { code: "2x3", name: "15x36 (2x3 pages)"},
    { code: "3x1", name: "23x11 (3x1 pages)"},
    { code: "3x2", name: "23x23 (3x2 pages)"},
    { code: "3x3", name: "23x36 (3x3 pages)"},
    // { code: "4x1", name: "32x11 (4x1 pages)"},
    { code: "4x2", name: "32x23 (4x2 pages)"},
    // { code: "4x3", name: "32x36 (4x3 pages)"},
    { code: "other", name: "Other"},
  ]

  const sizeSelector = (
    <select
      name="size"
      className="form-input-gray"
      onChange={({ target }) => onSearchChange(target.name, target.value)}
    >
      {
        sizes.map(sel => {
          return <option key={sel.code} value={sel.code}>{sel.name}</option>
        })
      }
    </select>
  )

  const scenarioDisplayList = (
    scenarioList.length < 1 ? <div className="red mt05em">no scenarios match search</div> :
    scenarioList.map((row: ScenarioData, i) => {
      return (
        <ScenarioRow key={i} onClick={setScenario}
                     selected={formInput.scenario === row.id} data={row} />
      )
    })
  )

  const noScenario = (
    <div className="scenario-description scenario-no-description">
      no scenario selected
    </div>
  )

  const scenarioDisplay = (
    <div>
      { scenarioData ? <ScenarioSummary data={scenarioData} /> : noScenario }
    </div>
  )

  const setPage = (page: number) => {
    setScenarioSearch({ ...scenarioSearch, page: page })
  }

  const scrollUp = scroll.up ?
    <div onClick={() => setPage(scenarioSearch.page - 1)}><CaretUpFill /></div> :
    (scroll.down ? <div><CaretUp /></div> :
      <div className="transparent"><CaretUpFill /></div>)

  const scrollDown = scroll.down ?
    <div onClick={() => setPage(scenarioSearch.page + 1)}><CaretDownFill /></div> : ""

  return (
    <div className="main-page">
      <Header />
      <form onSubmit={onSubmit}>
        <div className="standard-body">
          <div className="scenario-form-container">
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
            <div>
              <CustomCheckbox onClick={() => setPlayer(0)} selected={ formInput.player === 0 }/>
              <span className="font11em">hotseat / solo</span>
            </div>
            <div className="align-end">
              <CreateGameButton type="confirm" />
            </div>
          </div>
          <div className="scenario-list-container">
            <div className="scenario-list-filter-limit">
              <label>sort by</label><br />
              {sortSelector}
            </div>
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
            <div className="scenario-list-filter-limit">
              <label>by allied faction</label><br />
              {alliedFactionSelector}
            </div>
            <div className="scenario-list-filter-limit">
              <label>by axis faction</label><br />
              {axisFactionSelector}
            </div>
            <div className="scenario-list-filter-limit">
              <label>by theater</label><br />
              {theaterSelector}
            </div>
            <div className="scenario-list-filter-limit">
              <label>by unit types</label><br />
              {classSelector}
            </div>
            <div className="scenario-list-filter-limit">
              <label>by map size</label><br />
              {sizeSelector}
            </div>
            <div className="scenario-list-filter-limit">
              <label>by dev status</label><br />
              {statusSelector}
            </div>
            <div className="scenario-list-select">
              <div>select scenario:</div>
              <div className="red">{formErrors.scenario}</div>
              <div className="flex">
                <div className="flex-fill">
                  {scenarioDisplayList}
                </div>
                <div className="ml05em control-large">{scrollUp}{scrollDown}</div>
              </div>
            </div>
          </div>
        </div>
      </form>
      { scenarioDisplay }
    </div>
  )
}
