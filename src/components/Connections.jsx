import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseURL } from "../utils/constants";
import UserDetailsCard from "./UserDetailsCard";
import LoadingPage from "./LoadingPage";
import { ToastNotification } from "./ToastNotification";

// Connections uses a structured dark layout with card-based results and a clear empty state.
// The design keeps user actions visible while preserving readability on large lists.
const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  const getConnections = async () => {
    try {
      setLoading(true);
      const res = await axios.get(baseURL + "/user/connections", {
        withCredentials: true,
      });
      setConnections(res.data.data || []);
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {connections.length > 0 ? (
          <div className="space-y-8">
            {/* Header */}
            <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-sky-400"
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
                <div>
                  <h1 className="text-3xl font-bold text-white">My Network</h1>
                  <p className="text-slate-400 mt-1">
                    You have{" "}
                    <span className="font-semibold text-sky-400">
                      {connections.length}
                    </span>{" "}
                    {connections.length === 1 ? "connection" : "connections"}
                  </p>
                </div>
              </div>
            </div>

            {/* Connections Grid */}
            <div className="grid grid-cols-1  gap-6">
              {connections.map((connection) => (
                <UserDetailsCard key={connection._id} user={connection} />
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-12 text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
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
                onClick={() => (window.location.href = "/feed")}
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
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
