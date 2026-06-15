import axios from "axios";
import React, { useState } from "react";
import { baseURL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { ToastNotification } from "./ToastNotification";

const Pill = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
    {children}
  </span>
);

const UserFeedCard = ({ data = {} }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [processingRequest, setProcessingRequest] = useState(false);

  const {
    firstName,
    lastName,
    photoUrl,
    gender,
    description,
    city,
    age,
    state,
    skills,
    college,
    _id,
  } = data;

  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "User";
  const location =
    [city, state].filter(Boolean).join(", ") || "Location not specified";
  const skillItems = Array.isArray(skills)
    ? skills
        .flatMap((skill) => skill.split(","))
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];
  const metaItems = [
    age ? `${age} yrs` : null,
    gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : null,
    college || null,
  ].filter(Boolean);

  const manageConnectionRequest = async (status) => {
    try {
      if (!_id) {
        setError("User ID is missing. Cannot send connection request.");
        return;
      }

      setProcessingRequest(true);
      await axios.post(
        `${baseURL}/request/send/${status}/${_id}`,
        {},
        { withCredentials: true },
      );
      dispatch(removeUserFromFeed(_id));

      if (status === "interested") {
        ToastNotification(
          "Connection request sent",
          `You sent a connection request to ${fullName}.`,
          "success",
        );
      } else {
        ToastNotification(
          "Profile passed",
          `${fullName} was removed from your discovery feed.`,
          "info",
        );
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      ToastNotification("Request failed", message, "error");
    } finally {
      setProcessingRequest(false);
    }
  };

  return (
    <article className="flex min-h-[22rem] flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:border-slate-700">
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-slate-700 bg-slate-800">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={`${fullName} profile`}
                onError={(event) => {
                  event.currentTarget.src =
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80";
                }}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-sky-500 text-lg font-bold text-slate-950">
                {firstName?.charAt(0)}
                {lastName ? lastName.charAt(0) : ""}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-white">
              {fullName}
            </h3>
            <p className="mt-1 text-sm text-slate-400">{location}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
              {metaItems.length ? (
                metaItems.map((item) => <span key={item}>{item}</span>)
              ) : (
                <span>Profile details pending</span>
              )}
            </div>
          </div>
        </div>

        <p className="mt-5 min-h-16 text-sm leading-6 text-slate-300 line-clamp-3">
          {description || "This developer hasn't added a bio yet."}
        </p>

        <div className="mt-4 flex min-h-8 flex-wrap gap-2">
          {skillItems.length ? (
            skillItems.slice(0, 4).map((skill) => (
              <Pill key={skill}>{skill}</Pill>
            ))
          ) : (
            <Pill>No skills listed</Pill>
          )}
        </div>

        <div className="mt-auto pt-6">
          <div className="flex gap-3">
            <button
              type="button"
              className="flex h-11 flex-1 items-center justify-center rounded-lg bg-sky-500 px-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={processingRequest}
              onClick={() => manageConnectionRequest("interested")}
            >
              {processingRequest ? "Sending..." : "Connect"}
            </button>
            <button
              type="button"
              className="flex h-11 flex-1 items-center justify-center rounded-lg bg-slate-800 px-4 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={processingRequest}
              onClick={() => manageConnectionRequest("ignored")}
            >
              Pass
            </button>
          </div>

          {error && (
            <div className="mt-3 rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
              {error}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default UserFeedCard;
