import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../Logo";
import { postAPI } from "../../utilities/network";
import { CancelButton, RecoverAccountButton } from "../utilities/buttons";

export default () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [usernameError, setUsernameError] = useState("")

  const onChange = (value) => {
    setUsername(value)
    if (value === "") {
      setUsernameError("please supply a username or email address'")
    } else {
      setUsernameError("")
    }
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (username === "") {
      setUsernameError("please supply a username or email address'")
      return false
    } else {
      body = { check: username }
      postAPI("/api/v1/user/set_recovery", body, {
        ok: _response => navigate("/reset_password", { replace: true })
      })
    }
  }

  return (
    <div>
      <div className="header">
        <Logo />
      </div>
      <div className="form-container">
        <div className="mb1em">
          Enter your username or email.  If the username or email
          you supply exists, an email will be sent to the email address on that
          account with an account recovery code.  The recovery code will be good
          for one day before expiring, after which you'll need to generate a new
          code.
        </div>
        <form onSubmit={onSubmit}>
          <label>username or email address</label>
          <input
            type="text"
            name="username"
            className="form-input"
            onChange={({ target }) => onChange(target.value)}
          />
          <div className="form-error-message">{usernameError}</div>
          <div className="align-end">
            <CancelButton />
            <RecoverAccountButton type="confirm" />
          </div>
        </form>
      </div>
    </div>
  )
}
