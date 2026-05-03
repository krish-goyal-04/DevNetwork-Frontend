import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseURL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserFeedCard from "./UserFeedCard";
import LoadingPage from "./LoadingPage";

//Feed Pagination has to be done
const Feed = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const feedDataFromStore = useSelector((state) => state.feed);

  useEffect(() => {
    const loadFeed = async () => {
      if (feedDataFromStore) return;
      try {
        setLoading(true);
        const res = await axios.get(baseURL + "/feed", {
          withCredentials: true,
        });
        const feedData = res.data.data;
        dispatch(addFeed(feedData));
      } catch (err) {
        console.log(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    loadFeed();
  }, [feedDataFromStore, dispatch]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="bg-slate-950/95 backdrop-blur border-b border-slate-800 sticky top-0 z-20 shadow-sm shadow-slate-950/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Discover Developers
              </h1>
              <p className="mt-2 text-slate-400 max-w-2xl">
                Browse fresh profiles, connect with talented peers, and grow
                your professional network from one streamlined feed.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search developers..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-700 rounded-2xl bg-slate-900 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
                Filters
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1">
              Remote-friendly
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1">
              Open to collaborate
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1">
              New profiles
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {feedDataFromStore?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedDataFromStore.map((feed) => (
              <UserFeedCard data={feed} key={feed._id || feed.id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-700">
              <svg
                className="w-12 h-12 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No developers found
            </h3>
            <p className="text-slate-400 mb-6">
              Be the first to join our developer community!
            </p>
            <button className="bg-sky-500 hover:bg-sky-400 text-slate-950 px-6 py-3 rounded-lg font-medium transition-colors">
              Invite Developers
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
