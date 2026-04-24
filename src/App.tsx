import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Forecast from "./pages/Forecast";
import UserHomePage from "./pages/UserHome";
import Settings from "./pages/Settings";
import Favorites from "./pages/Favorites";
import ManageLocations from "./pages/ManageLocations";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private Pages */}
        <Route element={<ProtectedRoute />}>
    
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/home" element={<UserHomePage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/locations" element={<ManageLocations />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
