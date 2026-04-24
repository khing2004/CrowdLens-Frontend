import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Forecast from "./pages/Forecast";
import UserHomePage from "./pages/UserHome";
import Settings from "./pages/Settings";
import Favorites from "./pages/Favorites";
import ManageLocations from "./pages/ManageLocations";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "./components/Toast";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Login />} />
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
    </AuthProvider>
  );
}

export default App;
