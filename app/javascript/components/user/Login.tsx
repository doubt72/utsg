import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../Logo";
import { postAPI } from "../../utilities/network";
import { CancelButton, LoginButton, RecoverAccountButton } from "../utilities/buttons";

export default function Login() {
  const navigate = useNavigate()
  const [formInput, setFormInput] = useState({ username: "", password: "" })
  const [formErrors, setFormError] = useState({ username: "", password: "" })

  const anyEmpty = () => {
    if (formInput.username === "") {
      validateForm("username", "")
      return true
    } else if (formInput.password === "") {
      validateForm("password", "")
      return true
    }
    return false
  }

  const validateForm = (name: string, value: string) => {
    let usernameError = formErrors.username
    let passwordError = formErrors.password

    if (name === "username") {
      if (value === "") {
        usernameError = "please enter a username or email"
      } else {
        usernameError = ""
      }
    } else if (name === "password") {
      if (value === "") {
        passwordError = "please enter a password"
      } else {
        passwordError = ""
      }
    }
    setFormError({ username: usernameError, password: passwordError })
    return usernameError === "" && passwordError === ""
  }

  const onChange = (name: string, value: string) => {
    setFormInput({ ...formInput, [name]: value })
    validateForm(name, value)
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateForm("", "") || anyEmpty()) {
      return false
    } else {
      const body = {
        user: {
          username: formInput.username,
          password: formInput.password,
        }
      }

      postAPI("/api/v1/session", body, {
        ok: response => {
          response.json().then(json => {
            localStorage.setItem("username", json.username)
            localStorage.setItem("email", json.email)
            navigate("/", { replace: true })
          })
        },
        unauthorized: () => {
          setFormError({ username: "", password: "username not found or password incorrect" })
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
        <form onSubmit={onSubmit}>
          <label className="form-label">username or email address</label>
          <input
            type="text"
            name="username"
            className="form-input"
            onChange={({ target }) => onChange(target.name, target.value)}
          />
          <div className="form-error-message">{formErrors.username}</div>
          <label className="form-label">password</label>
          <input
            type="password"
            name="password"
            className="form-input"
            onChange={({ target }) => onChange(target.name, target.value)}
          />
          <div className="form-error-message">{formErrors.password}</div>
          <div className="align-end">
            <CancelButton />
            <LoginButton type="confirm" />
          </div>
        </form>
        <div className="mt1em">
          If you&apos;ve forgotten your password, you can recover your account here:
        </div>
        <div className="align-end mt1em">
          <RecoverAccountButton />
        </div>
      </div>
    </div>
  )
}
