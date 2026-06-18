import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router";
import { baseURL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { removeRequest } from "../utils/requestsSlice";
import { ToastNotification } from "./ToastNotification";

const getDaysAgo = (dateString) => {
  if (!dateString) return null;

  const createdDate = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor(Math.abs(now - createdDate) / 86400000);

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) return "1 week ago";
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "1 month ago";
  return `${diffMonths} months ago`;
};

const normalizeSkills = (skills) => {
  if (Array.isArray(skills)) {
    return skills
      .flatMap((skill) => skill.split(","))
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [];
};

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
    isOnline: initialOnline = false,
  } = user;

  const presence = useSelector((state) => state.presence || {});
  const userId = String(_id || "");
  const isOnline = presence[userId] ?? initialOnline;

  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || "Connection";
  const location =
    [city, state].filter(Boolean).join(", ") || "Unknown location";
  const skillItems = normalizeSkills(skills);
  const requestedAgo = getDaysAgo(createdAt);

  const reviewRequest = async (status) => {
    try {
      if (!connectionId) return;

      setProcessing(true);
      await axios.post(
        `${baseURL}/request/review/${status}/${connectionId}`,
        {},
        { withCredentials: true },
      );
      dispatch(removeRequest(connectionId));

      ToastNotification(
        status === "accepted" ? "Request accepted" : "Request rejected",
        `${fullName}'s request was ${status}.`,
        status === "accepted" ? "success" : "error",
      );
    } catch (error) {
      ToastNotification(
        "Unable to review request",
        error.response?.data?.message || error.message,
        "error",
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <article className="panel w-full overflow-hidden transition hover:border-cyan-400/30">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/10 bg-slate-800">
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
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 capitalize">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-xl font-semibold text-white">
                {fullName}
              </h3>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                  isOnline
                    ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                    : "border border-white/10 bg-slate-800 text-slate-400"
                }`}
              >
                <span
                  className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${
                    isOnline ? "bg-emerald-400" : "bg-slate-500"
                  }`}
                />
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-400">{location}</p>
            <p className="mt-2 text-sm text-slate-500">
              {age ? `${age} yrs` : "Age not specified"}
              {gender ? ` | ${gender}` : ""}
            </p>
            {type === "request" && requestedAgo && (
              <p className="mt-1 text-xs text-slate-500">
                Requested {requestedAgo}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {type === "request" && (
            <>
              <button
                type="button"
                disabled={processing}
                onClick={() => reviewRequest("accepted")}
                className="btn-primary h-10 px-4"
              >
                Accept
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={() => reviewRequest("rejected")}
                className="btn-secondary h-10 px-4"
              >
                Reject
              </button>
            </>
          )}
          {type !== "request" && connectionId && (
            <Link
              to={`/chat/${_id}`}
              className="btn-primary h-10 px-4"
            >
              Chat
            </Link>
          )}
          <button
            type="button"
            onClick={() => setProfileView((prev) => !prev)}
            className="btn-secondary h-10 px-4"
          >
            {profileView ? "Hide details" : "View details"}
          </button>
        </div>
      </div>

      {profileView && (
        <div className="border-t border-white/10 bg-slate-950/40 p-5">
          {type === "request" && (
            <div className="mb-4 flex flex-col gap-3 rounded-lg border border-cyan-400/15 bg-cyan-400/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  Review connection request
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Check profile context before accepting this developer into
                  your network.
                </p>
              </div>
              {requestedAgo && (
                <span className="chip shrink-0">Requested {requestedAgo}</span>
              )}
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="panel-soft p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">
                College
              </p>
              <p className="mt-2 text-sm text-slate-200">
                {college || "Not available"}
              </p>
            </div>
            <div className="panel-soft p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Location
              </p>
              <p className="mt-2 text-sm text-slate-200">{location}</p>
            </div>
            <div className="panel-soft p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Profile
              </p>
              <p className="mt-2 text-sm text-slate-200">
                {age ? `${age} yrs` : "Age not specified"}
              </p>
              <p className="text-sm text-slate-400">
                {gender || "Gender not specified"}
              </p>
            </div>
          </div>

          <div className="panel-soft mt-4 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">
              About
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {description || "No additional profile information available."}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {skillItems.length ? (
              skillItems.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="chip"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="chip">
                No skills listed
              </span>
            )}
          </div>

          {type === "request" && (
            <div className="mt-5 rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
              Accepting adds this developer to your network and enables chat.
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default UserDetailsCard;
