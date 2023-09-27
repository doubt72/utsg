import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo"
import { ArrowRepeat, BoxArrowRight, Check2Square, Trash3 } from "react-bootstrap-icons";

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
    const token = document.querySelector('meta[name="csrf-token"]').content
    fetch("/api/v1/user/validate_code", {
      method: "POST",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: verificationCode }),
    }).then(response => {
        if (response.ok) {
          localStorage.removeItem("validationNeeded")
          navigate("/", { replace: true })
          return
        } else if (response.status === 403) {
          setVerificationError("code does not match")
          return
        }
        console.log(response.json())
    }).catch(error => console.log(error.message))
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
            <Link to="/logout" className="custom-button">
              <BoxArrowRight />logout
            </Link>
            <button type="submit" className="custom-button">
              <Check2Square />confirm
            </button>
          </div>
        </form>
        <div className="mt1em mb1em">
          If you did not receive the email with the verification code,
          you may request a new code:
        </div>
        <div className="align-end">
          <Link to="/new_validation_code" className="custom-button">
            <ArrowRepeat />send new code
          </Link>
        </div>
        <div className="mt1em mb1em">
          If you no longer want to create an account with this username
          and password, you may cancel this signup and delete this account:
        </div>
        <div className="align-end">
          <Link to="/delete_account" className="custom-button">
            <Trash3 />delete account
          </Link>
        </div>
      </div>
    </div>
  )
}
