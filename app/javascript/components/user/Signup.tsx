import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../Logo";
import { postAPI } from "../../utilities/network";
import { PasswordTooltip, SignupEmailTooltip } from "../utilities/tooltips";
import { CancelButton, SignupButton } from "../utilities/buttons";

export default function Signup() {
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

  const checkConflict = (type: string, value: string) => {
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
    }, 500)
    if (Number(conflictTimer) > 0) {
      clearTimeout(Number(conflictTimer) - 1)
    }
  }

  const validateForm = (name: string, value: string) => {
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
          email: formInput.email,
          password: formInput.password,
        }
      }

      postAPI("/api/v1/user", body, {
        ok: response => {
          response.json().then(json => {
            localStorage.setItem("username", json.username)
            localStorage.setItem("email", json.email)
            navigate("/verify_account", { replace: true })
          })
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
          <p>Welcome to the Untitled TSG server.</p>
          <p>Sign up for a new account here:</p>
        </div>
        <form onSubmit={onSubmit}>
          <label className="form-label">username</label>
          <input
            type="text"
            name="username"
            className="form-input"
            onChange={({ target }) => onChange(target.name, target.value)}
          />
          <div className="form-error-message">{formErrors.username}</div>
          <label className="form-label">email<SignupEmailTooltip /></label>
          <input
            type="email"
            name="email"
            className="form-input"
            onChange={({ target }) => onChange(target.name, target.value)}
          />
          <div className="form-error-message">{formErrors.email}</div>
          <label className="form-label">password<PasswordTooltip /></label>
          <input
            type="password"
            name="password"
            className="form-input"
            onChange={({ target }) => onChange(target.name, target.value)}
          />
          <div className="form-error-message">{formErrors.password}</div>
          <label className="form-label">confirm password</label>
          <input
            type="password"
            name="confirmPassword"
            id="userConfirmPassword"
            className="form-input"
            onChange={({ target }) => onChange(target.name, target.value)}
          />
          <div className="form-error-message">{formErrors.confirmPassword}</div>
          <div className="align-end">
            <CancelButton />
            <SignupButton type="confirm" />
          </div>
        </form>
      </div>
    </div>
  )
}
