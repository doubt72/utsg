import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { putAPI } from "../../utilities/network";
import Header from "../Header";
import { CreateGameButton, CustomCheckbox } from "../utilities/buttons";

export default function NewGame() {

  // const navigate = useNavigate()
  const [formInput, setFormInput] = useState({ name: "", scenario: "", player: 1 })
  // const [formErrors, setFormError] = useState({ name: "" })

  const onChange = (name, value) => {
    setFormInput({ ...formInput, [name]: value })
    // validateForm(name, value)
  }

  const setPlayerOne = () => {
    setFormInput({ ...formInput, player: 1 })
  }

  const setPlayerTwo = () => {
    setFormInput({ ...formInput, player: 2 })
  }

  const onSubmit = (event) => {
    event.preventDefault()
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
            Create a new game:{ formInput.player }
            <label className="form-label">name</label>
            <input
              type="text"
              name="name"
              value=""
              className="form-input"
              onChange={({ target }) => onChange(target.name, target.value)}
            />
            <div className="mt1em">
              <CustomCheckbox onClick={setPlayerOne} selected={ formInput.player === 1 }/>
              <span className="font11em">play allied side</span>
            </div>
            <div>
              <CustomCheckbox onClick={setPlayerTwo} selected={ formInput.player === 2 }/>
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
                name="scenario"
                value=""
                className="form-input-gray"
                onChange={({ target }) => onChange(target.name, target.value)}
              />
            </div>
            <div className="scenario-list-filter">
              <label>allied faction filter</label><br />
              <select
                name="allied"
                className="form-input-gray"
                onChange={{}}
              >
                <option value="any">[ any ]</option>
                <option value="soviet">Soviet</option>
                <option value="usarmy">U.S. Army</option>
                <option value="commonwealth">Commonwealth</option>
                <option value="french">French</option>
                <option value="polish">Polish</option>
                <option value="greek">Greek</option>
                <option value="norwegian">Norwegian</option>
                <option value="dutch">Dutch</option>
                <option value="usmarines">U.S. Marines</option>
                <option value="chinese">Chinese</option>
                <option value="philippine">Philippine</option>
              </select>
            </div>
            <div className="scenario-list-filter">
              <label>axis faction filter</label><br />
              <select
                name="axis"
                className="form-input-gray"
                onChange={{}}
              >
                <option value="any">[ any ]</option>
                <option value="german">German</option>
                <option value="german">Italian</option>
                <option value="german">Japanese</option>
                <option value="german">Finnish</option>
                <option value="german">Romanian</option>
                <option value="german">Bulgarian</option>
                <option value="german">Hungarian</option>
                <option value="german">Slovakian</option>
              </select>
            </div>
            <div className="scenario-list-select">
              Select scenario:{ formInput.player }<br />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
