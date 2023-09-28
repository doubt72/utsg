import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import MainPage from "../components/MainPage";
import About from "../components/About";

import Profile from "../components/user/Profile";
import Login from '../components/user/Login';
import Logout from '../components/user/Logout';
import Signup from '../components/user/Signup';
import VerifyAccount from "../components/user/VerifyAccount";
import RecoverAccount from "../components/user/RecoverAccount";
import ResetPassword from "../components/user/ResetPassword";
import DeleteAccount from '../components/user/DeleteAccount';

const Routes = () => {
  const publicRoutes = [
    { path: "*", element: <MainPage /> },
    { path: "/about", element: <About /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/recover_account", element: <RecoverAccount /> },
    { path: "/reset_password", element: <ResetPassword /> },
  ]

  const protectedRoutes = [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        { path: "/", element: <MainPage />},
        { path: "/verify_account", element: <VerifyAccount /> },
        { path: "/delete_account", element: <DeleteAccount /> },
        { path: "/logout", element: <Logout /> },
        { path: "/profile", element: <Profile /> },
      ],
    },
  ]

  const router = createBrowserRouter([
    ...publicRoutes,
    ...protectedRoutes,
  ])

  return <RouterProvider router={router} />
}

export default Routes
