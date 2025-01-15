import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { Lock, LogIn, LogOut } from "lucide-react";
import { Roles } from "../types/types";

interface toggleSidebarProps {
  setToggleSidebar: (setToggleSidebar: boolean) => void;
}

const Sidebar = ({ setToggleSidebar }: toggleSidebarProps) => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === Roles.ADMIN;

  return (
    <>
      <div
        className="bg-[#0000009b] w-full h-full fixed"
        onClick={() => setToggleSidebar(false)}
      />
      <div
        onClick={() => setToggleSidebar(false)}
        className="px-4 bg-zinc-100 h-screen w-72 fixed top-0 left-0"
      >
        <Link to={"/"}>
          <h2 className="pt-4 font-bold">E-commerce</h2>
        </Link>
        <div className="flex flex-row items-center mt-5 gap-4">
          {isAdmin && (
            <Link to={`/secrete-dashboard/${user?.firstName}`}>
              <button
                onClick={() => setToggleSidebar(false)}
                className="flex flex-row items-center gap-2 bg-black text-white rounded-md py-1 px-2 hover:opacity-90 transition-opacity"
              >
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
            <Link to={"/signin"} onClick={() => setToggleSidebar(false)}>
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
        <Link to={"/"} onClick={() => setToggleSidebar(false)}>
          Home
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
