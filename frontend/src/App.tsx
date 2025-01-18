import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import SignInPage from "./pages/SignInPage";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import { Roles } from "./types/types";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import { useCartStore } from "./stores/useCartStore";
import PaymentSucess from "./pages/PaymentSucess";
import PaymentFailed from "./pages/PaymentFailed";
import OtpVerification from "./pages/OtpVerification";

const App = () => {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  //TODO- add the isverified condition from the database and if
  //the user is verified then no need to redirect to the home page
  useEffect(() => {
    if (user?.role === Roles.ADMIN) {
      navigate("/otp-verification");
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    getCartItems();
  }, [user, getCartItems]);

  const hideNavRoute = ["/otp-verification"];

  if (checkingAuth) return <LoadingSpinner />;
  return (
    <div className="min-h-screen relative overflow-hidden">
      {!hideNavRoute.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signin"
          element={!user ? <SignInPage /> : <Navigate to={"/"} />}
        />
        <Route
          path={`/secrete-dashboard/${user?.firstName}`}
          element={
            user && user?.role === Roles.ADMIN ? (
              <AdminPage />
            ) : (
              <Navigate to={"/"} />
            )
          }
        />
        <Route path="category/:category" element={<CategoryPage />} />
        <Route
          path="cart"
          element={user ? <CartPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/order/success"
          element={user ? <PaymentSucess /> : <Navigate to={"/"} />}
        />
        <Route
          path="/order/payment-failed"
          element={user ? <PaymentFailed /> : <Navigate to={"/"} />}
        />
        <Route
          path="/otp-verification"
          element={
            user?.role === Roles.ADMIN ? (
              <OtpVerification />
            ) : (
              <Navigate to={"/"} />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
