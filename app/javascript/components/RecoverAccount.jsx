import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo"
import { ArrowRepeat, XCircle } from "react-bootstrap-icons";

export default () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const onChange = (value) => {
    setUsername(value);
    if (value === "") {
      setUsernameError("please supply a username or email address'");
    } else {
      setUsernameError("");
    }
  }

  const onSubmit = (event) => {
    event.preventDefault();
    if (username === "") {
      setUsernameError("please supply a username or email address'");
      return false;
    } else {
      const token = document.querySelector('meta[name="csrf-token"]').content;
      fetch("/api/v1/user/set_recovery", {
        method: "POST",
        headers: {
          "X-CSRF-Token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ check: username }),
      }).then(response => {
        if (response.ok) {
          navigate("/reset_password", { replace: true });
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
            <Link to="/" className="custom-button">
              <XCircle />cancel
            </Link>
            <button type="submit" className="custom-button">
              <ArrowRepeat />send code
            </button>
          </div>
        </form>
      </div>
    </div>
  )
};
