import { ShoppingCart, LogIn, LogOut, Lock, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useUseStore } from "../stores/useUserStore";
import { Roles } from "../types/types";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const { user, logout } = useUseStore();
  const { cart } = useCartStore();
  const isAdmin = user?.role === Roles.ADMIN;

  return (
    <>
      <header className="bg-zinc-100 sticky top-0 left-0 flex items-center justify-between p-4">
        <Link to={"/"}>
          <h2 className="text-x font-bold">E-commerce</h2>
        </Link>
        <nav className="flex flex-row items-center gap-x-4">
          {user && (
            <Link to={"/cart"} className="relative">
              <div className="flex flex-row gap-1 items-center">
                <ShoppingCart size={20} />
                <span>Cart</span>
              </div>
              {cart.length > 0 && (
                <span className="font-bold flex justify-center items-center w-5 h-5 text-xs bg-black text-white absolute -top-2 -left-2 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
          )}
          <button
            onClick={() => setToggleSidebar(!toggleSidebar)}
            className="md:hidden"
          >
            <Menu />
          </button>
          <div className="hidden md:flex flex-row items-center gap-x-4">
            <Link to={"/"} className="hover:font-bold transition-all">
              <div>Home</div>
            </Link>
            {isAdmin && (
              <Link to={`/secrete-dashboard/${user?.firstName}`}>
                <button className="flex flex-row items-center gap-2 bg-black text-white rounded-md py-1 px-2 hover:opacity-90 transition-opacity">
                  <Lock size={15} />
                  <span>Dashboard</span>
                </button>
              </Link>
            )}
            {user ? (
              <button
                onClick={() => logout()}
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
          </div>
        </nav>
      </header>
      <div className="">
        {toggleSidebar && <Sidebar setToggleSidebar={setToggleSidebar} />}
      </div>
    </>
  );
};

export default Navbar;
