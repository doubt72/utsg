import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch("/api/v1/users/logout", {
      method: "POST",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }).then(response => {
        if (response.ok) {
          localStorage.removeItem("username")
          localStorage.removeItem("email")
          navigate("/", { replace: true });
          return
        }
        console.log(response.json());
    }).catch(error => console.log(error.message));
  }, []);

  return <>bye</>;
};

export default Logout;
