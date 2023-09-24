import React from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../AuthProvider";

const Login = () => {
  // const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    // setToken("this is a test token");
    navigate("/", { replace: true });
  };

  setTimeout(() => {
    handleLogin();
  }, 3 * 1000);

  return <>Login Page</>;
};

export default Login;
