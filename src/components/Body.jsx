import NavBar from "./NavBar";
import { Outlet, useNavigate } from "react-router";
import Footer from "./Footer";
import { baseURL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";

// This component is responsible for rendering the main layout of the application, including the NavBar and Footer. It also contains an Outlet component that will render the child routes defined in App.jsx. Additionally, it has a fetchUser function that makes an API call to retrieve the user's profile information and dispatches it to the Redux store.

// The fetchUser function is called inside a useEffect hook, which means it will run once when the component mounts. If the API call is successful, it will dispatch the user data to the Redux store and navigate to the appropriate route. If there is an error, it will log the error to the console.

// The Body component is wrapped in a BrowserRouter in App.jsx, which allows it to use the useNavigate hook for navigation and the Outlet component for rendering child routes. The NavBar and Footer components are rendered on every page, while the content in between will change based on the route.

//userData is retreived from redux store and user is fetched from /profile api. so for user we reciee data from backend nested in data.data object

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const fetchUser = async () => {
    if (userData) return;
    try {
      const res = await axios.get(baseURL + "/profile", {
        withCredentials: true,
      });
      const user = res.data.data;
      dispatch(addUser(user));
    } catch (err) {
      return navigate("/login");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="min-h-screen flex flex-col ">
      <NavBar />
      <div className="grow ">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};
export default Body;
