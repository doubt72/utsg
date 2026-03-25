import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Verify() {
  const navigate = useNavigate()
  
  const email = localStorage.getItem("email")

  useEffect(() => {
    if (email) {
      navigate("/verify_account", { replace: true })
    } else {
      navigate("/login", { replace: true })
    }
  }, [])

  return (
    <div></div>
  )
}