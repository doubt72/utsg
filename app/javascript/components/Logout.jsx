import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = document.querySelector('meta[name="csrf-token"]').content
    fetch("/api/v1/session", {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }).then(response => {
        if (response.ok) {
          localStorage.removeItem("username")
          localStorage.removeItem("email")
          navigate("/", { replace: true })
          return
        }
        console.log(response.json());
    }).catch(error => console.log(error.message))
  }, [])

  return <>bye</>
}
