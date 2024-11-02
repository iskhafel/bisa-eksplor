import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import ManageUser from "./pages/Admin/ManageUser";
// import ActivityPage from "./pages/ActivityPage";
// import DetailActivityPage from "./pages/DetailActivityPage"
import PromoPage from "./pages/PromoPage";
import CartPage from "./pages/CartPage";
import ManageBanner from "./pages/Admin/ManageBanner";
import ManagePromo from "./pages/Admin/ManagePromo";
import ManageCategory from "./pages/Admin/ManageCategory";
// import ManageActivity from "./pages/Admin/ManageActivity";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/activity" element={<ActivityPage />} /> */}
        {/* <Route path="/activity/:id" element={<DetailActivityPage />} /> */}
        <Route path="/promo" element={<PromoPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<UpdateProfilePage />} />

        {/* Protected Routes - Only accessible by Admin */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/user" element={<ManageUser />} />
          <Route path="/dashboard/banner" element={<ManageBanner />} />
          <Route path="/dashboard/promo" element={<ManagePromo />} />
          <Route path="/dashboard/category" element={<ManageCategory />} />
          {/* <Route path="/dashboard/activity" element={<ManageActivity />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
