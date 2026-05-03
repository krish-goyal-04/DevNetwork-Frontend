import axios from "axios";
import React, { useState } from "react";
import { baseURL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeRequest } from "../utils/requestsSlice";

// UserDetailsCard uses dark card components to present connection and request details clearly.
// The design balances data density with readability for quick decision-making.
const UserDetailsCard = ({ user = {}, type }) => {
  const [processing, setProcessing] = useState(false);
  const [profileView, setProfileView] = useState(false);
  const dispatch = useDispatch();

  const {
    _id,
    firstName,
    lastName,
    photoUrl,
    gender,
    age,
    city,
    state,
    college,
    skills,
    description,
    connectionId,
    createdAt,
  } = user;
  console.log("Rendering UserDetailsCard for user:", user);

  // Function to calculate days ago from createdAt date
  const getDaysAgo = (dateString) => {
    if (!dateString) return null;

    const createdDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;

    // For older dates, show weeks
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks === 1) return "1 week ago";
    if (diffWeeks < 4) return `${diffWeeks} weeks ago`;

    // For very old dates, show months
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return "1 month ago";
    return `${diffMonths} months ago`;
  };

  const acceptUserRequest = async () => {
    try {
      if (!connectionId) {
        console.error("Request ID not found");
        return;
      }
      setProcessing(true);
      const res = await axios.post(
        baseURL + "/request/review/accepted/" + connectionId,
        {},
        { withCredentials: true },
      );
      console.log(res.data);
      // Dispatch action to update requests in store
      dispatch(removeRequest(connectionId));
    } catch (error) {
      console.error("Error accepting user request:", error);
    } finally {
      setProcessing(false);
    }
  };

  const rejectUserRequest = async () => {
    try {
      if (!connectionId) {
        console.error("Request ID not found");
        return;
      }
      setProcessing(true);
      const res = await axios.post(
        baseURL + "/request/review/rejected/" + connectionId,
        {},
        { withCredentials: true },
      );
      dispatch(removeRequest(connectionId));
      console.log(res.data);
    } catch (error) {
      console.error("Error rejecting user request:", error);
    } finally {
      setProcessing(false);
    }
  };

  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || "Connection";
  const location =
    [city, state].filter(Boolean).join(", ") || "Unknown location";
  const skillItems = Array.isArray(skills)
    ? skills
        .flatMap((skill) => skill.split(","))
        .map((skill) => skill.trim())
        .filter(Boolean)
    : typeof skills === "string"
      ? skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : [];

  return (
    <article className="w-full max-w-4xl mx-auto overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)] transition hover:-translate-y-0.5">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-800 ring-1 ring-slate-700 shadow-inner">
            <img
              src={
                photoUrl ||
                "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
              }
              alt={`${fullName} avatar`}
              onError={(event) => {
                event.currentTarget.src =
                  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80";
              }}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="capitalize">
            <h3 className="text-xl font-semibold text-white">{fullName}</h3>
            <p className="mt-1 text-sm text-slate-400">{location}</p>
            {type === "request" && createdAt && (
              <p className="mt-1 text-xs text-slate-500">
                Requested {getDaysAgo(createdAt)}
              </p>
            )}
            <p className="mt-2 text-sm text-slate-500">
              {age ? `${age} yrs` : "Age not specified"}
              <span className="mx-2">•</span>
              {gender ? gender : "Gender not specified"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setProfileView((prev) => !prev)}
          className="btn btn-sm btn-primary"
        >
          {profileView ? "Hide details" : "View details"}
        </button>
      </div>

      {profileView && (
        <div className="border-t border-slate-800/90 bg-slate-900/80 px-5 py-5 sm:px-6 capitalize">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                College
              </p>
              <p className="mt-3 text-sm text-slate-200">
                {college || "Not available"}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Location
              </p>
              <p className="mt-3 text-sm text-slate-200">{location}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Age / Gender
              </p>
              <p className="mt-3 text-sm text-slate-200">
                {age ? `${age} yrs` : "N/A"}
              </p>
              <p className="text-sm text-slate-400">
                {gender ? gender : "N/A"}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-slate-800 bg-slate-950 p-5">
            <h4 className="text-sm uppercase tracking-[0.22em] text-slate-500">
              Description
            </h4>
            <p className="mt-3 text-sm leading-6 text-slate-300 normal-case">
              {description || "No additional profile information available."}
            </p>
          </div>

          {skillItems.length > 0 && (
            <div className="mt-5">
              <h4 className="text-sm uppercase tracking-[0.22em] text-slate-500">
                Skills
              </h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {skillItems.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="inline-flex rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {type === "request" && (
            <div className="flex gap-4 items-center justify-center mt-5 max-w-sm mx-auto">
              <button
                disabled={processing}
                onClick={acceptUserRequest}
                className="flex-1 py-3 rounded-xl border border-white/10 text-white hover:bg-white/10 transition bg-sky-500"
              >
                Accept
              </button>
              <button
                disabled={processing}
                onClick={rejectUserRequest}
                className="flex-1 py-3 rounded-xl border border-white/10 text-white hover:bg-white/10 transition bg-red-500"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default UserDetailsCard;
