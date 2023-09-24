import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const User = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({ ingredients: "" });

  useEffect(() => {
    const url = `/api/v1/show/${params.id}`;
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((response) => setUser(response))
      .catch(() => navigate("/users"));
  }, [params.id]);

  const deleteUser = () => {
    const url = `/api/v1/destroy/${params.id}`;
    const token = document.querySelector('meta[name="csrf-token"]').content;

    fetch(url, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(() => navigate("/users"))
      .catch((error) => console.log(error.message));
  };
  
  return (
    <div className="">
      <div className="hero position-relative d-flex align-items-center justify-content-center">
        <div className="overlay bg-dark position-absolute" />
        <h1 className="display-4 position-relative text-white">
          {user.username}
        </h1>
      </div>
      <div className="container py-5">
        <div className="row">
          <div className="col-sm-12 col-lg-7">
            <h5 className="mb-2">Email</h5>
            <div>
              {user.email}
            </div>
          </div>
          <div className="col-sm-12 col-lg-2">
            <button
              type="button"
              className="btn btn-danger"
              onClick={deleteUser}
            >
              Delete User
            </button>
          </div>
        </div>
        <Link to="/users" className="btn btn-link">
          Back to users
        </Link>
      </div>
    </div>
  );
};

export default User;