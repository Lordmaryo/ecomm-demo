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

const App = () => {
  const { user, checkAuth, checkingAuth } = useUseStore();

  useEffect(() => {
    checkAuth();
  }, []);

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
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
