import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import SignInPage from "./pages/SignInPage";
import { Toaster } from "react-hot-toast";
import { useUseStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import { Roles } from "./types/types";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import { useCartStore } from "./stores/useCartStore";

const App = () => {
  const { user, checkAuth, checkingAuth } = useUseStore();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    getCartItems();
  }, [user, getCartItems]);

  if (checkingAuth) return <LoadingSpinner />;
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signin"
          element={!user ? <SignInPage /> : <Navigate to={"/"} />}
        />
        <Route
          path={`/secrete-dashboard/${user?.firstName}`}
          element={
            user?.role === Roles.ADMIN ? <AdminPage /> : <Navigate to={"/"} />
          }
        />
        <Route path="category/:category" element={<CategoryPage />} />
        <Route
          path="cart"
          element={user ? <CartPage /> : <Navigate to={"/"} />}
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
