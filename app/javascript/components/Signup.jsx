import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { ExclamationCircleFill, PencilSquare, XCircle } from "react-bootstrap-icons"
import Logo from "./Logo";
import { postAPI } from "../helper";

export default () => {
  const navigate = useNavigate()
  const [formInput, setFormInput] = useState({
    username: "", email: "", password: "", confirmPassword: ""
  })
  const [formErrors, setFormError] = useState({
    username: "", email: "", password: "", confirmPassword: ""
  })

  const anyEmpty = () => {
    if (formInput.username === "") {
      validateForm("username", "")
      return true
    } else if (formInput.email === "") {
      validateForm("email", "")
      return true
    } else if (formInput.password === "") {
      validateForm("password", "")
      return true
    }
    return false
  }

  const checkConflict = (type, value) => {
    const conflictTimer = setTimeout(() => {
      const body = { check: value }
      postAPI("/api/v1/user/check_conflict", body, {
        ok: response => {
          response.json().then(json => {
            if (json.conflict) {
              const usernameError = type === "username" ? "username already exists" : formErrors.username
              const emailError = type === "email" ? "email already exists" : formErrors.email
              setFormError({
                username: usernameError,
                email: emailError,
                password: formErrors.password,
                confirmPassword: formErrors.confirmPassword,
              })
            }
          })
        }
      })
    }, 1000)
    if (conflictTimer > 0) {
      clearTimeout(conflictTimer - 1)
    }
  }

  const validateForm = (name, value) => {
    let usernameError = formErrors.username
    let emailError = formErrors.email
    let passwordError = formErrors.password
    let confirmPasswordError = formErrors.confirmPassword

    if (name === "username") {
      if (value === "") {
        usernameError = "username must not be blank"
      } else {
        usernameError = ""
      }
      checkConflict("username", value)
    } else if (name === "email") {
      const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      if (value === "") {
        emailError = "email must not be blank"
      } else if (value.match(validRegex)) {
        emailError = ""
      } else {
        emailError = "please enter a valid email address"
      }
      checkConflict("email", value)
    } else if (name === "password") {
      if (value !== formInput.confirmPassword) {
        confirmPasswordError = "passwords must match"
        passwordError = ""
      } else if (value === "") {
        passwordError = "password must not be blank"
        confirmPasswordError = ""
      } else {
        confirmPasswordError = ""
        passwordError = ""
      }
    } else if (name === "confirmPassword") {
      if (value !== formInput.password) {
        confirmPasswordError = "passwords must match"
        passwordError = ""
      } else if (formInput.password === "") {
        passwordError = "password must not be blank"
        confirmPasswordError = ""
      } else {
        passwordError = ""
        confirmPasswordError = ""
      }
    }
    setFormError({
      username: usernameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    })
    return usernameError === "" && emailError === "" && passwordError === "" && confirmPasswordError === ""
  }

  const onChange = (name, value) => {
    setFormInput({ ...formInput, [name]: value })
    validateForm(name, value)
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (!validateForm("", "") || anyEmpty()) {
      return false
    } else {
      const body = {
        user: {
          username: formInput.username,
          email: formInput.email,
          password: formInput.password,
        }
      }

      postAPI("/api/v1/user", body, {
        ok: response => {
          response.json().then(json => {
            localStorage.setItem("username", json.username)
            localStorage.setItem("email", json.email)
            navigate("/validate_account", { replace: true })
          })
        }
      })
    }
  }

  const emailTooltip = "email will be used to send a verification code<br />to complete signup"
  const passwordTooltip = "we don't enforce any password quality at all but<br />" +
                          "you should still choose a unique, secure password<br />" +
                          "and if you don't, that's on you"

  return (
    <div>
      <div className="header">
        <Logo />
      </div>
      <div className="form-container">
        <div className="mb1em">
          <p>Welcome to the Untitled TSG server.</p>
          <p>Sign up for a new account here:</p>
        </div>
        <form onSubmit={onSubmit}>
          <label>username</label>
          <input
            type="text"
            name="username"
            className="form-input"
            onChange={({ target }) => onChange(target.name, target.value)}
          />
          <div className="form-error-message">{formErrors.username}</div>
          <label>
            email
            <span className="standard-tooltip" data-tooltip-id="email-tt" data-tooltip-html={emailTooltip}>
              <ExclamationCircleFill />
            </span>
            <Tooltip className="standard-tooltip-popout" id="email-tt" />
          </label>
          <input
            type="email"
            name="email"
            className="form-input"
            onChange={({ target }) => onChange(target.name, target.value)}
          />
          <div className="form-error-message">{formErrors.email}</div>
          <label>
            password
            <span className="standard-tooltip" data-tooltip-id="email-tt" data-tooltip-html={passwordTooltip}>
              <ExclamationCircleFill />
            </span>
            <Tooltip className="standard-tooltip-popout" id="email-tt" />
          </label>
          <input
            type="password"
            name="password"
            className="form-input"
            onChange={({ target }) => onChange(target.name, target.value)}
          />
          <div className="form-error-message">{formErrors.password}</div>
          <label>confirm password</label>
          <input
            type="password"
            name="confirmPassword"
            id="userConfirmPassword"
            className="form-input"
            onChange={({ target }) => onChange(target.name, target.value)}
          />
          <div className="form-error-message">{formErrors.confirmPassword}</div>
          <div className="align-end">
            <Link to="/" className="custom-button">
              <XCircle />cancel
            </Link>
            <button type="submit" className="custom-button">
              <PencilSquare />sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
