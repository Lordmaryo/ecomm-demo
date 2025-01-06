import { ShoppingCart, LogIn, LogOut, Lock } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // change default to false
  const [isAdmin, setIsAdmin] = useState(true); // change default to false

  return (
    <header className="bg-zinc-100 sticky top-0 left-0 flex items-center justify-between px-4 py-2">
      <Link to={"/"}>
        <h2 className="text-x font-bold">E-commerce</h2>
      </Link>
      <nav className="flex flex-row items-center gap-x-4">
        <Link to={"/"}>
          <div>Home</div>
        </Link>
        {isAuthenticated && (
          <Link to={"/cart"} className="relative">
            <div className="flex flex-row gap-1 items-center">
              <ShoppingCart size={20} />
              <span>Cart</span>
            </div>
            <span className="font-bold flex justify-center items-center w-5 h-5 text-xs bg-black text-white absolute -top-2 -left-2 rounded-full">
              5
            </span>
          </Link>
        )}
        {isAdmin && (
          <Link to={"/dashboard"}>
            <button className="flex flex-row items-center gap-2 bg-black text-white rounded-md py-1 px-2 hover:opacity-90 transition-opacity">
              <Lock size={15} />
              <span>Dashboard</span>
            </button>
          </Link>
        )}
        {isAuthenticated ? (
          <button
            title="Log out"
            className="flex flex-row items-center gap-1 bg-zinc-200 p-2 rounded-md hover:opacity-75 transition-opacity"
          >
            <LogOut size={20} />
            <span>Log out</span>
          </button>
        ) : (
          <Link to={"/signin"}>
            <div
              title="Log In"
              className="flex flex-row items-center gap-2 bg-zinc-200 p-2 rounded-md hover:opacity-75 transition-opacity"
            >
              <LogIn size={20} />
              <span>Sign in</span>
            </div>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
