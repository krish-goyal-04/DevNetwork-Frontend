import NavBar from "./NavBar";
import { Outlet, useNavigate, useLocation } from "react-router";
import Footer from "./Footer";
import { baseURL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { addRequests, handleRequestReview } from "../utils/requestsSlice";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "../context/SocketContext";
import { ToastNotification } from "./ToastNotification";

// This component is responsible for rendering the main layout of the application, including the NavBar and Footer. It also contains an Outlet component that will render the child routes defined in App.jsx. Additionally, it has a fetchUser function that makes an API call to retrieve the user's profile information and dispatches it to the Redux store.

// The fetchUser function is called inside a useEffect hook, which means it will run once when the component mounts. If the API call is successful, it will dispatch the user data to the Redux store and navigate to the appropriate route. If there is an error, it will log the error to the console.

// The Body component is wrapped in a BrowserRouter in App.jsx, which allows it to use the useNavigate hook for navigation and the Outlet component for rendering child routes. The NavBar and Footer components are rendered on every page, while the content in between will change based on the route.

//userData is retreived from redux store and user is fetched from /profile api. so for user we reciee data from backend nested in data.data object

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.user);
  const [socket, setSocket] = useState(null);
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
      ToastNotification(
        payload.fromUser.firstName,
        " sent you a connection request.",
      ); // Show a toast notification with the sender's name
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

      const name = payload.toUser
        ? `${payload.toUser.firstName || "User"} ${payload.toUser.lastName || ""}`.trim()
        : "User";
      const isAccepted = payload.status === "accepted";

      ToastNotification(
        isAccepted ? "Request accepted" : "Request rejected",
        `${name} ${isAccepted ? "accepted" : "rejected"} your connection request.`,
        isAccepted ? "success" : "error",
      );
    });

    socket.on("notification:message", (payload) => {
      if (location.pathname.startsWith("/chat/")) return;
      ToastNotification(
        "New message",
        payload.snippet || "You received a new message.",
        "info",
      );
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setSocket(null);
    });

    socketRef.current = socket;
    setSocket(socket);

    return () => {
      socket.off("request:received");
      socket.off("request:reviewed");
      socket.off("notification:message");
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [userData, dispatch]);

  return (
    // SocketContext.Provider makes the socket available to every page and nested component.
    // It is created once in Body.jsx and then consumed by child components via useSocket().
    <SocketContext.Provider value={socket}>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <NavBar />
        <div className="pt-16 flex-1">
          <Outlet />
        </div>
        <Footer />
      </div>
    </SocketContext.Provider>
  );
};
export default Body;
