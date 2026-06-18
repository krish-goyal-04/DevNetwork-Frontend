import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { baseURL } from "../utils/constants";
import UserDetailsCard from "./UserDetailsCard";
import LoadingPage from "./LoadingPage";
import { ToastNotification } from "./ToastNotification";
import { useDispatch } from "react-redux";
import { setPresenceState } from "../utils/presenceSlice";

// Connections uses a structured dark layout with card-based results and a clear empty state.
// The design keeps user actions visible while preserving readability on large lists.
const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getConnections = async () => {
    try {
      setLoading(true);
      const res = await axios.get(baseURL + "/user/connections", {
        withCredentials: true,
      });
      const data = res.data.data || [];
      setConnections(data);
      // Initialize presence state from API response so badges render immediately because isOnline is part of the user object. This avoids a flash of offline badges before the socket updates arrive. So we extract the isOnline status from the API response and dispatch it to the presence slice.
      const presenceMap = {};
      data.forEach((u) => {
        const id = String(u._id);
        presenceMap[id] = Boolean(u.isOnline);
      });
      dispatch(setPresenceState(presenceMap));
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      console.error(message);
      ToastNotification("Unable to load connections", message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="app-shell">
      <div className="page-wrap">
        <div className="page-header">
          <div>
            <p className="eyebrow">Your network</p>
            <h1 className="page-title">Connections</h1>
            <p className="page-copy">
              {connections.length}{" "}
              {connections.length === 1 ? "developer" : "developers"} available
              for direct chat.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/feed")}
            className="btn-primary"
          >
            Discover more
          </button>
        </div>

        {connections.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1  gap-6">
              {connections.map((connection) => (
                <UserDetailsCard key={connection._id} user={connection} />
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="panel p-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-slate-800">
                <svg
                  className="w-8 h-8 text-slate-500"
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
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                No Connections Yet
              </h2>
              <p className="text-slate-400 mb-6">
                Start building your professional network by connecting with
                other developers. Visit the feed to discover and connect with
                like-minded professionals.
              </p>
              <button
                type="button"
                onClick={() => navigate("/feed")}
                className="btn-primary"
              >
                Explore Feed
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
