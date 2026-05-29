import NavBar from "./NavBar";
import { Outlet, useNavigate, useLocation } from "react-router";
import Footer from "./Footer";
import { baseURL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { addRequests, handleRequestReview } from "../utils/requestsSlice";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

// This component is responsible for rendering the main layout of the application, including the NavBar and Footer. It also contains an Outlet component that will render the child routes defined in App.jsx. Additionally, it has a fetchUser function that makes an API call to retrieve the user's profile information and dispatches it to the Redux store.

// The fetchUser function is called inside a useEffect hook, which means it will run once when the component mounts. If the API call is successful, it will dispatch the user data to the Redux store and navigate to the appropriate route. If there is an error, it will log the error to the console.

// The Body component is wrapped in a BrowserRouter in App.jsx, which allows it to use the useNavigate hook for navigation and the Outlet component for rendering child routes. The NavBar and Footer components are rendered on every page, while the content in between will change based on the route.

//userData is retreived from redux store and user is fetched from /profile api. so for user we reciee data from backend nested in data.data object

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.user);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      // Skip auth check for public routes
      if (location.pathname === "/login" || location.pathname === "/signup") {
        return;
      }

      if (userData) return;
      try {
        const res = await axios.get(baseURL + "/profile", {
          withCredentials: true,
        });
        const user = res.data.data;
        dispatch(addUser(user));
      } catch {
        return navigate("/login");
      }
    };

    fetchUser();
  }, [location.pathname, userData, dispatch, navigate]);

  useEffect(() => {
    if (!userData || socketRef.current) return;

    const socket = io(baseURL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    // Event: request:received
    // Triggered when ANOTHER user sends a connection request to the logged-in user.
    // Payload: { connectionId, status, fromUser: {...}, createdAt }
    // Transform to match REST API format: { ...fromUser, connectionId, createdAt, status }
    // Action: Add the flattened request object to Redux requests slice.
    // Result: Requests.jsx page updates immediately without refresh to show the new request.
    socket.on("request:received", (payload) => {
      const transformedRequest = {
        ...payload.fromUser,
        connectionId: payload.connectionId,
        createdAt: payload.createdAt,
        status: payload.status,
      };
      dispatch(addRequests(transformedRequest));
    });

    // Event: request:reviewed
    // Triggered when a request WE sent is reviewed (accepted or rejected) by the other user.
    // Payload: { connectionId, status, toUserId, toUser }
    // Action: Dispatch handleRequestReview to log and prepare for future features (notifications, feed updates).
    // Note: The receiver already removed the request via removeRequest in UserDetailsCard.
    // Here we handle the SENDER side: they may want to see that their request was reviewed.
    socket.on("request:reviewed", (payload) => {
      console.log("Request reviewed:", payload);
      dispatch(handleRequestReview(payload));
      // TODO: Show a notification/toast: "Your connection request to [name] was [accepted/rejected]"
      // TODO: If accepted, optionally update connections list or feed state
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socketRef.current = socket;
    //socket.connect();
    // Cleanup function to disconnect the socket when the component unmounts or userData changes
    // This ensures that we don't have multiple socket connections open at the same time, which can lead to memory leaks and unexpected behavior. By disconnecting the socket when the component unmounts or when userData changes (e.g., when a user logs out), we can ensure that we are properly managing our WebSocket connections and resources.
    return () => {
      socket.off("request:received");
      socket.off("request:reviewed");
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userData, dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <NavBar />
      <div className="pt-16 flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
export default Body;
