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
import NewGame from "../components/game/NewGame";
import DebugUnits from "../debug/DebugUnits";
import DebugMap from "../debug/DebugMap";
import GameDisplay from "../components/game/GameDisplay";
import DebugMarkers from "../debug/DebugMarkers";
import DebugUnitsByYear from "../debug/DebugUnitsByYear";
import DebugIndex from "../debug/DebugIndex";
import DebugUnitsByType from "../debug/DebugUnitsByType";
import DebugUnitStats from "../debug/DebugUnitStats";
import DebugScenarioStats from "../debug/DebugScenarioStats";
import HelpDisplay from "../components/game/HelpDisplay";

export default function Routes() {
  const publicRoutes = [
    { path: "*", element: <MainPage /> },
    { path: "/about", element: <About /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/recover_account", element: <RecoverAccount /> },
    { path: "/reset_password", element: <ResetPassword /> },
    { path: "/game/:id", element: <GameDisplay /> },

    { path: "/help", element: <HelpDisplay /> },
    { path: "/help/:section", element: <HelpDisplay /> },
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
        { path: "/profile/:username", element: <Profile /> },

        { path: "/debug/", element: <DebugIndex /> },
        { path: "/debug/markers", element: <DebugMarkers /> },
        { path: "/debug/markers/:nation", element: <DebugUnits /> },
        { path: "/debug/units/", element: <DebugUnits /> },
        { path: "/debug/units/:nation", element: <DebugUnits suppressMarkers={true} /> },
        { path: "/debug/units/type", element: <DebugUnitsByType /> },
        { path: "/debug/units/type/:type", element: <DebugUnitsByType /> },
        { path: "/debug/units/ability/:ability", element: <DebugUnitsByType /> },
        { path: "/debug/units/year", element: <DebugUnitsByYear /> },
        { path: "/debug/units/year/:nation", element: <DebugUnitsByYear /> },
        { path: "/debug/map/:id", element: <DebugMap /> },
        { path: "/debug/stats/units", element: <DebugUnitStats /> },
        { path: "/debug/stats/units/:nation", element: <DebugUnitStats /> },
        { path: "/debug/stats/scenarios", element: <DebugScenarioStats /> },
        { path: "/debug/stats/scenarios/:nation", element: <DebugScenarioStats /> },

        { path: "/new_game", element: <NewGame /> },
      ],
    },
  ]

  const router = createBrowserRouter([
    ...publicRoutes,
    ...protectedRoutes,
  ])

  return <RouterProvider router={router} />
}

