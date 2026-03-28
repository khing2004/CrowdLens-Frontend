import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Forecast from "./pages/Forecast";
import UserHomePage from "./pages/UserHome";
import Settings from "./pages/Settings";
import Favorites from "./pages/Favorites";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/home" element={<UserHomePage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Router>
  );
}

export default App;
