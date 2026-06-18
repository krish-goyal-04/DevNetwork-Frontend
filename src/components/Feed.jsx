import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseURL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserFeedCard from "./UserFeedCard";
import LoadingPage from "./LoadingPage";
import { ToastNotification } from "./ToastNotification";

const filterOptions = ["All", "With skills", "With location"];

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
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
        const message = err?.response?.data?.message || err.message;
        console.error(message);
        ToastNotification("Unable to load feed", message, "error");
      } finally {
        setLoading(false);
      }
    };
    loadFeed();
  }, [feedDataFromStore, dispatch]);

  const feedItems = feedDataFromStore || [];
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredFeed = feedItems.filter((developer) => {
    const skillsText = Array.isArray(developer.skills)
      ? developer.skills.join(" ")
      : developer.skills || "";
    const searchableText = [
      developer.firstName,
      developer.lastName,
      developer.city,
      developer.state,
      developer.college,
      developer.description,
      skillsText,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !normalizedSearch || searchableText.includes(normalizedSearch);
    const hasSkills =
      Array.isArray(developer.skills) && developer.skills.length > 0;
    const hasLocation = Boolean(developer.city || developer.state);
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "With skills" && hasSkills) ||
      (activeFilter === "With location" && hasLocation);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="app-shell">
      <div className="border-b border-white/10 bg-slate-950/35">
        <div className="page-wrap">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">
                Developer discovery
              </p>
              <h1 className="page-title">
                Discover Developers
              </h1>
              <p className="page-copy">
                Find peers by skills, location, and profile details. Every
                action updates the feed immediately.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-[minmax(16rem,24rem)_auto]">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search developers..."
                  className="h-11 w-full rounded-lg border border-slate-700/80 bg-slate-950/80 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
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
              <div className="flex rounded-lg border border-white/10 bg-slate-900/80 p-1">
                {filterOptions.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`h-9 rounded-md px-3 text-xs font-semibold transition ${
                      activeFilter === filter
                        ? "bg-cyan-400 text-slate-950"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="panel-soft px-4 py-3">
              <p className="text-xs text-slate-500">Loaded profiles</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {feedItems.length}
              </p>
            </div>
            <div className="panel-soft px-4 py-3">
              <p className="text-xs text-slate-500">Current matches</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {filteredFeed.length}
              </p>
            </div>
            <div className="panel-soft px-4 py-3">
              <p className="text-xs text-slate-500">Active filter</p>
              <p className="mt-1 text-sm font-semibold text-slate-200">
                {activeFilter}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="page-wrap">
        {filteredFeed.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeed.map((feed) => (
              <UserFeedCard data={feed} key={feed._id || feed.id} />
            ))}
          </div>
        ) : (
          <div className="panel mx-auto max-w-xl p-10 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-slate-700 bg-slate-950">
              <svg
                className="w-8 h-8 text-slate-500"
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
            <h3 className="mb-2 text-xl font-semibold text-white">
              No matching developers
            </h3>
            <p className="mb-6 text-slate-400">
              Try a different search term or clear the active filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("All");
              }}
              className="btn-primary"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
