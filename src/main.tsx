import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogIn from "./pages/Login";
import Register from "./pages/Register";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogIn />} />          {/* first page */}
        <Route path="/register" element={<Register />} /> {/* signup page */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);