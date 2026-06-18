import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router";
import { baseURL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const navItems = [
  { to: "/feed", label: "Discover" },
  { to: "/connections", label: "Network" },
  { to: "/requests", label: "Requests" },
];

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(baseURL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b1018]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={user ? "/feed" : "/login"} className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400 text-sm font-bold text-slate-950 shadow-sm shadow-cyan-950/40">
            D
          </div>
          <div>
            <p className="text-base font-semibold text-white">DevNetwork</p>
            <p className="hidden text-xs text-slate-500 sm:block">
              Developer networking
            </p>
          </div>
        </Link>

        {user && (
          <>
            <nav className="hidden items-center rounded-lg border border-white/10 bg-slate-900/70 p-1 md:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-md px-4 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-cyan-400 text-slate-950"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-xs text-slate-500">Signed in</p>
                <p className="text-sm font-semibold text-white">
                  {user.firstName || "Developer"}
                </p>
              </div>

              <div className="dropdown dropdown-end">
                <button
                  tabIndex={0}
                  type="button"
                  className="h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-slate-900 ring-2 ring-transparent hover:ring-cyan-400/40"
                >
                  <img
                    alt="Profile"
                    src={
                      user.photoUrl ||
                      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80"
                    }
                    onError={(event) => {
                      event.currentTarget.src =
                        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80";
                    }}
                    className="h-full w-full object-cover"
                  />
                </button>

                <ul
                  tabIndex="-1"
                  className="dropdown-content menu z-10 mt-3 w-60 rounded-lg border border-white/10 bg-slate-950 p-2 shadow-2xl shadow-black/30"
                >
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  {navItems.map((item) => (
                    <li key={item.to} className="md:hidden">
                      <Link to={item.to}>{item.label}</Link>
                    </li>
                  ))}
                  <li>
                    <button className="text-rose-300" onClick={handleLogout}>
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default NavBar;
