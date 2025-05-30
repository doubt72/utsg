import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { adminUsers, getAPI } from "../utilities/network";

export function ProtectedRoute() {
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
            if (path.includes("debug") && !adminUsers.includes(body.username)) {
              navigate("/", { replace: true })
            }
          }
        }).catch(error => {
          console.log(error.message)
          unauthorized()
        })
      },
      forbidden: () => {
        if (!unvalidatedPaths.includes(path)) {
          localStorage.setItem("validationNeeded", "true")
          navigate("/verify_account", { replace: true })
        }
      },
      other: () => unauthorized()
    })
  }, [])

  return <Outlet />
}
