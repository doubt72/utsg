import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../Logo";
import { deleteAPI } from "../../utilities/network";
import { CancelButton } from "../utilities/buttons";

export default () => {
  const navigate = useNavigate()
  const [confirm, setConfirm] = useState("")
  const [confirmError, setConfirmError] = useState("")

  const onChange = (value) => {
    setConfirm(value)
    if (value !== "DELETE") {
      setConfirmError("value does not equal 'DELETE'")
    } else {
      setConfirmError("are you really really sure?")
    }
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (confirm !== "DELETE") {
      return false
    } else {
      deleteAPI("/api/v1/user", {
        ok: _response => {
          localStorage.removeItem("username")
          localStorage.removeItem("email")
          navigate("/")
        }
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
          <p>
            Are you sure you want to delete this account?  All of your data including
            your games.
          </p>
        </div>
        <form onSubmit={onSubmit}>
          <label>Enter '<span className="red">DELETE</span>' to confirm that you want to delete this account:</label>
          <input
            type="text"
            name="confirm"
            className="form-input"
            onChange={({ target }) => onChange(target.value)}
          />
          <div className="form-error-message">{confirmError}</div>
          <div className="align-end">
            <CancelButton />
            <DeleteButton type="confirm" />
          </div>
        </form>
      </div>
    </div>
  )
}
