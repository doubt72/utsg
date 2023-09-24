import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../AuthProvider";

const Logout = () => {
  // const { setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // setToken();
    navigate("/", { replace: true });
  }, []);

  return <>bye</>;
};

export default Logout;
