import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router";
import { removeUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import { baseURL } from "../utils/constants";
import { useNavigate } from "react-router";
import axios from "axios";

// NavBar stays dark and compact while keeping key navigation and profile actions accessible.
// The menu uses strong contrast for hover states and prioritizes primary user flows such as feed and requests.
const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navItems = [
    { to: "/feed", label: "Discover" },
    { to: "/connections", label: "Network" },
    { to: "/requests", label: "Requests" },
  ];

  const handleLogout = async () => {
    try {
      await axios.post(baseURL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 shadow-sm shadow-black/10 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/feed" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center shadow-sm shadow-sky-500/20">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">
                DevNetwork
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          {user && (
            <nav className="hidden md:flex items-center rounded-full border border-slate-800 bg-slate-900/70 p-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-slate-100 text-slate-950"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}

          {/* User Menu */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-xs text-slate-500">Signed in as</p>
                <p className="text-sm font-semibold text-white">
                  {user.firstName}
                </p>
              </div>

              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="h-10 w-10 rounded-full border border-slate-700 bg-slate-900 ring-1 ring-slate-700 hover:ring-slate-500 transition-all overflow-hidden"
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
                </div>
                <ul
                  tabIndex="-1"
                  className="menu menu-sm dropdown-content bg-slate-950 rounded-2xl z-10 mt-3 w-56 p-2 shadow-2xl shadow-black/20 border border-slate-800"
                >
                  <li>
                    <Link
                      to="/profile"
                      className="text-slate-100 hover:bg-slate-900"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      View Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/feed"
                      className="text-slate-100 hover:bg-slate-900"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      Discover Developers
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/requests"
                      className="text-slate-100 hover:bg-slate-900"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Connection Requests
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/connections"
                      className="text-slate-100 hover:bg-slate-900"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      My Network
                    </Link>
                  </li>
                  <li>
                    <hr className="border-slate-800" />
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-rose-400 hover:bg-slate-900"
                    >
                      <svg
                        className="w-4 h-4 mr-2 inline"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
