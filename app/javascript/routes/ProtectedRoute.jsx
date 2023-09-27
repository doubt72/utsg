import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export const ProtectedRoute = (props) => {
  const navigate = useNavigate()

  const unvalidatedPaths = [
    "/validate_account", '/new_validation_code', '/logout', '/delete_account'
  ]

  const unauthorized = () => {
    const path = window.location.pathname
    localStorage.removeItem("username")
    localStorage.removeItem("email")
    if (path !== '/') {
      navigate("/", { replace: true })
    }
  }

  useEffect(() => {
    const path = window.location.pathname
    const token = document.querySelector('meta[name="csrf-token"]').content
    fetch("/api/v1/session/auth", {
      method: "GET",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
      },
    }).then(response => {
        if (response.ok) {
          response.json().then(body => {
            if (body.username === undefined) {
              unauthorized()
            } else {
              localStorage.removeItem("validationNeeded")
            }
          }).catch(error => {
            console.log(error.message)
            unauthorized()
          })
          return
        } else if (response.status === 403) {
          if (!unvalidatedPaths.includes(path)) {
            localStorage.setItem("validationNeeded", true)
            navigate("/validate_account", { replace: true })
          }
          return
        }
        unauthorized()
    }).catch(error => console.log(error.message))
  }, [])

  return <Outlet />
}
