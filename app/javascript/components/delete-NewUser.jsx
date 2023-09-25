import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NewUser = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [passwordDigest, setPasswordDigest] = useState("");

  const onChange = (event, setFunction) => {
    setFunction(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const url = "/api/v1/users/create";

    if (username.length == 0 || passwordDigest.length == 0 || email.length == 0)
      return;

    const body = {
      username,
      password_digest: passwordDigest,
      email,
    };

    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch(url, {
      method: "POST",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(response => navigate(`/users/${response.id}`))
      .catch(error => console.log(error.message));
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-sm-12 col-lg-6 offset-lg-3">
          <h1 className="font-weight-normal mb-5">
            Add a new recipe to our awesome recipe collection.
          </h1>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="userUsername">Username</label>
              <input
                type="text"
                name="username"
                id="userUsername"
                className="form-control"
                required
                onChange={(event) => onChange(event, setUsername)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="userPasswordDigest">Whatever</label>
              <input
                type="text"
                name="passwordDigest"
                id="userPasswordDigest"
                className="form-control"
                required
                onChange={(event) => onChange(event, setPasswordDigest)}
              />
            </div>
            <label htmlFor="userEmail">Email</label>
            <input
              type="text"
              name="email"
              id="userEmail"
              className="form-control"
              required
              onChange={(event) => onChange(event, setEmail)}
            />
            <button type="submit" className="btn custom-button mt-3">
              Create User
            </button>
            <Link to="/users" className="btn btn-link mt-3">
              Back to users
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
