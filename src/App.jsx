import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import DashboardAdminPage from "./pages/DashboardAdminPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<UpdateProfilePage />} />
        <Route path="/dashboard/user" element={<DashboardAdminPage />} />
      </Routes>
    </Router>
  );
};

export default App;
