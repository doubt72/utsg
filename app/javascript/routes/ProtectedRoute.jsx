import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getAPI } from "../utilities/network";

export const ProtectedRoute = (props) => {
  const navigate = useNavigate()

  const unvalidatedPaths = [
    "/verify_account", '/new_validation_code', '/logout', '/delete_account'
  ]

  const unauthorized = () => {
    const path = window.location.pathname
    localStorage.removeItem("username")
    localStorage.removeItem("email")
    localStorage.removeItem("validationNeeded")
    if (path !== '/') {
      navigate("/", { replace: true })
    }
  }

  useEffect(() => {
    const path = window.location.pathname
    getAPI("/api/v1/session/auth", {
      ok: response => {
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
      },
      forbidden: _response => {
        if (!unvalidatedPaths.includes(path)) {
          localStorage.setItem("validationNeeded", true)
          navigate("/verify_account", { replace: true })
        }
      },
      other: _response => unauthorized()
    })
  }, [])

  return <Outlet />
}
