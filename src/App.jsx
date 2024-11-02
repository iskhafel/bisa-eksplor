import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PromoPage from "./pages/User/Promo/PromoPage";

import UpdateProfilePage from "./pages/UpdateProfilePage";

import ManageUser from "./pages/Admin/ManageUser";
import ManageBanner from "./pages/Admin/ManageBanner";
import ManagePromo from "./pages/Admin/ManagePromo";
import ManageCategory from "./pages/Admin/ManageCategory";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/promo" element={<PromoPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<UpdateProfilePage />} />
          <Route path="/dashboard/user" element={<ManageUser />} />
          <Route path="/dashboard/banner" element={<ManageBanner />} />
          <Route path="/dashboard/promo" element={<ManagePromo />} />
          <Route path="/dashboard/category" element={<ManageCategory />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
