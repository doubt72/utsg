import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAPI } from "../../utilities/network";
import { CancelButton, DeleteButton } from "../utilities/buttons";

interface DeleteAccountProps {
  reset?: () => void;
  version?: string;
}

export default function DeleteAccount({ reset, version }: DeleteAccountProps) {
  const navigate = useNavigate()
  const [confirm, setConfirm] = useState("")
  const [confirmError, setConfirmError] = useState("")

  const onChange = (value: string) => {
    setConfirm(value)
    if (value !== "DELETE") {
      setConfirmError("value does not equal 'DELETE'")
    } else {
      setConfirmError("are you really really sure?")
    }
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (document.activeElement instanceof HTMLButtonElement &&
        document.activeElement.name === "cancel") {
      if (reset) { reset() }
      return false
    } else if (confirm !== "DELETE") {
      setConfirmError("value does not equal 'DELETE'")
      return false
    } else {
      deleteAPI("/api/v1/user", {
        ok: () => {
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
          { version === "signup" ? signupDeleteMessage : normalDeleteMessage }
        </p>
      </div>
      <form onSubmit={onSubmit}>
        <label>Enter &apos;<span className="red">DELETE</span>&apos; to confirm that you want to delete this account:</label>
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
