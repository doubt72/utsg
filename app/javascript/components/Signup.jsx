import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo"

const Signup = () => {
  const navigate = useNavigate();
  const [formInput, setFormInput] = useState({
    username: "", email: "", password: "", confirmPassword: ""
  });
  const [formErrors, setFormError] = useState({
    username: "", email: "", password: "", confirmPassword: ""
  });

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
      const token = document.querySelector('meta[name="csrf-token"]').content;
      fetch("/api/v1/users/check_conflict", {
        method: "POST",
        headers: {
          "X-CSRF-Token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ check: value }),
      }).then(response => {
          if (response.ok) {
            const json = response.json().then(json => {
              if (json.conflict) {
                const usernameError = type === "username" ? "username already exists" : formErrors.username
                const emailError = type === "email" ? "email already exists" : formErrors.email
                setFormError({
                  username: usernameError,
                  email: emailError,
                  password: formErrors.password,
                  confirmPassword: formErrors.confirmPassword,
                });
              }
            })
            return
          }
          console.log(response.json());
      }).catch(error => console.log(error.message));
    }, 1000);
    if (conflictTimer > 0) {
      clearTimeout(conflictTimer - 1);
    }
  }

  const validateForm = (name, value) => {
    let usernameError = formErrors.username;
    let emailError = formErrors.email;
    let passwordError = formErrors.password;
    let confirmPasswordError = formErrors.confirmPassword;

    if (name === "username") {
      if (value === "") {
        usernameError = "username must not be blank";
      } else {
        usernameError = ""
      }
      checkConflict("username", value);
    } else if (name === "email") {
      const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (value === "") {
        emailError = "email must not be blank";
      } else if (value.match(validRegex)) {
        emailError = "";
      } else {
        emailError = "please enter a valid email address"
      }
      checkConflict("email", value);
    } else if (name === "password") {
      if (value !== formInput.confirmPassword) {
        confirmPasswordError = "passwords must match";
        passwordError = "";
      } else if (value === "") {
        passwordError = "password must not be blank";
        confirmPasswordError = "";
      } else {
        confirmPasswordError = "";
        passwordError = "";
      }
    } else if (name === "confirmPassword") {
      if (value !== formInput.password) {
        confirmPasswordError = "passwords must match";
        passwordError = "";
      } else if (formInput.password === "") {
        passwordError = "password must not be blank";
        confirmPasswordError = "";
      } else {
        passwordError = "";
        confirmPasswordError = "";
      }
    }
    setFormError({
      username: usernameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });
    return usernameError === "" && emailError === "" && passwordError === "" && confirmPasswordError === ""
  }

  const onChange = (name, value) => {
    setFormInput({ ...formInput, [name]: value });
    validateForm(name, value);
  }

  const onSubmit = (event) => {
    event.preventDefault();
    if (!validateForm("", "") || anyEmpty()) {
      return false;
    } else {
      const url = "/api/v1/users";

      const body = {
        user: {
          username: formInput.username,
          email: formInput.email,
          password: formInput.password,
        }
      };

      const token = document.querySelector('meta[name="csrf-token"]').content;
      fetch(url, {
        method: "POST",
        headers: {
          "X-CSRF-Token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).then(response => {
          if (response.ok) {
            const json = response.json().then(json => {
              localStorage.setItem("username", json.username)
              localStorage.setItem("email", json.email)
              navigate("/validate_account", { replace: true });
            })
            return
          }
          console.log(response.json());
      }).catch(error => console.log(error.message));
    }
  };

  return (
    <div>
      <div className="header">
        <Logo />
      </div>
      <div className="form-container">
        <div className="mb1em">
          Sign up for a new account here:
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
          <label>email</label>
          <input
            type="email"
            name="email"
            className="form-input"
            onChange={({ target }) => onChange(target.name, target.value)}
          />
          <div className="form-error-message">{formErrors.email}</div>
          <label>password</label>
          <input
            type="password"
            name="password"
            className="form-input"
            onChange={({ target }) => onChange(target.name, target.value)}
          />
          <div className="form-error-message">{formErrors.password}</div>
          <label>verify Password</label>
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
              cancel
            </Link>
            <button type="submit" className="custom-button">
              sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
};

export default Signup;
