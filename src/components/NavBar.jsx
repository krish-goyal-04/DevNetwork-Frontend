import { useSelector } from "react-redux";
import { Link } from "react-router";
import { removeUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import { baseURL } from "../utils/constants";
import { useNavigate } from "react-router";
import axios from "axios";
const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        baseURL + "/logout",
        {},
        { withCredentials: true },
      );
      dispatch(removeUser());
      return navigate("/login");
    } catch (error) {}
  };
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link to="/feed" className="btn btn-ghost text-xl">
          Dev🔗Network
        </Link>
      </div>
      {user && (
        <div className="flex gap-7 mr-4 items-center">
          <div className="flex gap-1">
            Welcome,{" "}
            <p className="font-semibold capitalize">{user.firstName}</p>!
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component" src={user.photoUrl} />
              </div>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/connections">Connections</Link>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
