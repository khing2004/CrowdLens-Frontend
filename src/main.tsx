import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogIn from "./pages/Login";
import Register from "./pages/Register";
import UserHome from "./pages/UserHome";
import Settings from "./pages/Settings";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<UserHome />} /> {/* user home route */}
        <Route path="/settings" element={<Settings />} />{" "}
        {/* user home route */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
