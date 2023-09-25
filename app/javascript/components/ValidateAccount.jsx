import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ValidateAccount = () => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("")
  const [verificationError, setVerificationError] = useState("")

  const email = localStorage.getItem("email")

  const onChange = (event, setFunction) => {
    setFunction(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch("/api/v1/users/validate_code", {
      method: "POST",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: verificationCode }),
    }).then(response => {
        if (response.ok) {
          navigate("/", { replace: true });
          return
        } else if (response.status === 403) {
          setVerificationError("Verification code does not match")
          return
        }
        console.log(response.json());
        throw new Error("something went wrong");
    }).catch(error => console.log(error.message));
  };

  return (
    <div>
      <div className="header">
        <div className="header-logo">UTSG</div>
      </div>
      <div className="form-container">
        <div className="mb1em">
          A verification code was sent to {email}.
          Please enter it here to activate your account.
        </div>
        <form onSubmit={onSubmit}>
          <label>Verification code:</label>
          <input
            type="text"
            name="verificationCode"
            className="form-input"
            onChange={event => onChange(event, setVerificationCode)}
          />
          <div className="form-error-message">{verificationError}</div>
          <button type="submit" className="custom-button">
            Verify Email
          </button>
          <Link to="/resent_confirmation" className="custom-button">
            Send New Code
          </Link>
          <Link to="/delete_account" className="custom-button">
            Delete Account
          </Link>
          <Link to="/logout" className="custom-button">
            Logout
          </Link>
        </form>
      </div>
    </div>
  )
};

export default ValidateAccount;
