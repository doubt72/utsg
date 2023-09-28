import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../Logo";
import { postAPI } from "../../utilities/network";
import { DeleteButton, LogoutButton, SendNewCodeButton, VerifyButton } from "../utilities/buttons";

export default () => {
  const navigate = useNavigate()
  const [verificationCode, setVerificationCode] = useState("")
  const [verificationError, setVerificationError] = useState("")

  const email = localStorage.getItem("email")

  const onChange = (event, setFunction) => {
    setFunction(event.target.value)
  }

  const onSubmit = (event) => {
    event.preventDefault()
    body = { code: verificationCode }
    postAPI("/api/v1/user/validate_code", body, {
      ok: _response => {
        localStorage.removeItem("validationNeeded")
        navigate("/", { replace: true })
      },
      forbidden: _response => setVerificationError("code does not match")
    })
  }

  return (
    <div>
      <div className="header">
        <Logo />
      </div>
      <div className="form-container">
        <div className="mb1em">
          A verification code was sent to {email}.
          Please enter it here to activate your account.
        </div>
        <form onSubmit={onSubmit}>
          <label>verification code:</label>
          <input
            type="text"
            name="verificationCode"
            className="form-input"
            onChange={event => onChange(event, setVerificationCode)}
          />
          <div className="form-error-message">{verificationError}</div>
          <div className="align-end">
            <LogoutButton />
            <VerifyButton />
          </div>
        </form>
        <div className="mt1em mb1em">
          If you did not receive the email with the verification code,
          you may request a new code:
        </div>
        <div className="align-end">
          <SendNewCodeButton />
        </div>
        <div className="mt1em mb1em">
          If you no longer want to create an account with this username
          and password, you may cancel this signup and delete this account:
        </div>
        <div className="align-end">
          <DeleteButton />
        </div>
      </div>
    </div>
  )
}
