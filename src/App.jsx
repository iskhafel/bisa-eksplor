import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DetailBannerPage from "./pages/User/Banner/DetailBannerPage";
import PromoPage from "./pages/User/Promo/PromoPage";
import DetailPromoPage from "./pages/User/Promo/DetailPromoPage";
import ActivityPage from "./pages/User/Activity/ActivityPage";
import DetailActivityPage from "./pages/User/Activity/DetailActivityPage";
import CartPage from "./pages/User/Cart/CartPage";
import TransactionPage from "./pages/User/Transaction/TransactionPage";
import DetailTransactionPage from "./pages/User/Transaction/DetailTransactionPage";

import UpdateProfilePage from "./pages/UpdateProfilePage";
import ManageUser from "./pages/Admin/ManageUser";
import ManageBanner from "./pages/Admin/ManageBanner";
import ManageCategory from "./pages/Admin/ManageCategory";
import ManagePromo from "./pages/Admin/ManagePromo";
import ManageActivity from "./pages/Admin/ManageActivity";
import ManageTransaction from "./pages/Admin/ManageTransaction";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/banner/:id" element={<DetailBannerPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/activity/:id" element={<DetailActivityPage />} />
        <Route path="/promo" element={<PromoPage />} />
        <Route path="/promo/:id" element={<DetailPromoPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/transaction" element={<TransactionPage />} />
        <Route path="/transaction/:id" element={<DetailTransactionPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<UpdateProfilePage />} />
          <Route path="/dashboard/user" element={<ManageUser />} />
          <Route path="/dashboard/banner" element={<ManageBanner />} />
          <Route path="/dashboard/promo" element={<ManagePromo />} />
          <Route path="/dashboard/category" element={<ManageCategory />} />
          <Route path="/dashboard/activity" element={<ManageActivity />} />
          <Route
            path="/dashboard/transaction"
            element={<ManageTransaction />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
