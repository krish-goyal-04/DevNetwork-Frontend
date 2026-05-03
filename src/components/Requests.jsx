import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseURL } from "../utils/constants";
import LoadingPage from "./LoadingPage";
import UserDetailsCard from "./UserDetailsCard";
import { useDispatch, useSelector } from "react-redux";
import { setRequests } from "../utils/requestsSlice";

// Requests page presents received requests in a dark, approachable layout.
// Clear feedback and button states make it easy to accept or reject connections without visual clutter.
const Requests = () => {
  const [loading, setLoading] = useState(false);
  const requests = useSelector((state) => state.requests);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadRequests = async () => {
      if (requests.length > 0) return;
      try {
        setLoading(true);
        const res = await axios.get(baseURL + "/user/requests/received", {
          withCredentials: true,
        });
        dispatch(setRequests(res.data.data || []));
        console.log(res.data);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [requests.length, dispatch]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {requests.length > 0 ? (
          <div className="space-y-8">
            {/* Header */}
            <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Connection Requests
                  </h1>
                  <p className="text-slate-400 mt-1">
                    You have{" "}
                    <span className="font-semibold text-emerald-400">
                      {requests.length}
                    </span>{" "}
                    {requests.length === 1
                      ? "pending request"
                      : "pending requests"}
                  </p>
                </div>
              </div>
            </div>

            {/* Requests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((connection) => (
                <UserDetailsCard
                  key={connection._id}
                  user={connection}
                  type="request"
                />
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
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                No Pending Requests
              </h2>
              <p className="text-slate-400 mb-6">
                You don't have any connection requests at the moment. Keep
                engaging with the community to grow your network!
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

export default Requests;
