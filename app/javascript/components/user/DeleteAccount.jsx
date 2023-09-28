import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAPI } from "../../utilities/network";
import { CancelButton, DeleteButton } from "../utilities/buttons";

export default (props) => {
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
    if (document.activeElement.name === "cancel") {
      props.reset()
      return false
    } else if (confirm !== "DELETE") {
      setConfirmError("value does not equal 'DELETE'")
      return false
    } else {
      deleteAPI("/api/v1/user", {
        ok: _response => {
          localStorage.removeItem("username")
          localStorage.removeItem("email")
          localStorage.removeItem("validationNeeded")
          navigate("/", { replace: true })
        }
      })
    }
  }

  const normalDeleteMessage = "Are you sure you want to delete this account?  All of your " +
                              "data will be unrecoverably deleted including your games."
  const signupDeleteMessage = "Are you sure?"

  return (
    <div className="mt1em">
      <div className="mb1em">
        <p>
          { props.version === "signup" ? signupDeleteMessage : normalDeleteMessage }
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
          <CancelButton type="submit" />
          <DeleteButton />
        </div>
      </form>
    </div>
  )
}
