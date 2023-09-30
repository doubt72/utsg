import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAPI } from "../../utilities/network";

export default function Logout() {
  const navigate = useNavigate()

  useEffect(() => {
    deleteAPI("/api/v1/session", {
      ok: () => {
        localStorage.removeItem("username")
        localStorage.removeItem("email")
        localStorage.removeItem("validationNeeded")
        navigate("/", { replace: true })
      }
    })
  }, [])

  return <>bye</>
}
