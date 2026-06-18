import axios from "axios";
import React, { useState } from "react";
import { baseURL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { ToastNotification } from "./ToastNotification";

const Pill = ({ children }) => (
  <span className="chip">
    {children}
  </span>
);

const UserFeedCard = ({ data = {} }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [processingRequest, setProcessingRequest] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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
  const primarySkill = skillItems[0] || "Open to connect";
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
    <article className="panel group flex min-h-[27rem] flex-col overflow-hidden transition hover:-translate-y-0.5 hover:border-cyan-400/30">
      <div className="h-1 bg-cyan-400" />
      <div className="border-b border-white/10 bg-slate-950/35 px-6 py-5">
        <div className="flex items-start gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-800 shadow-lg shadow-black/20">
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
              <div className="flex h-full w-full items-center justify-center bg-cyan-400 text-lg font-bold text-slate-950">
                {firstName?.charAt(0)}
                {lastName ? lastName.charAt(0) : ""}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-xl font-semibold text-white">
                  {fullName}
                </h3>
                <p className="mt-1 truncate text-sm text-slate-400">
                  {location}
                </p>
              </div>
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
                Profile
              </span>
            </div>
            <p className="mt-3 inline-flex rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-200">
              {primarySkill}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-white/10 bg-slate-950/45 px-2 py-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
              Skills
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              {skillItems.length || 0}
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-950/45 px-2 py-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
              Age
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              {age || "-"}
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-950/45 px-2 py-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
              Profile
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-white">
              {gender || "Open"}
            </p>
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

        {showDetails && (
          <div className="mt-5 grid gap-3 rounded-lg border border-white/10 bg-slate-950/45 p-4 text-sm">
            {metaItems.length > 0 && (
              <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
                {metaItems.map((item) => (
                  <span className="chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">Location</span>
              <span className="text-right font-medium text-slate-200">
                {location}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">College</span>
              <span className="text-right font-medium text-slate-200">
                {college || "Not specified"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">Profile</span>
              <span className="text-right font-medium text-slate-200">
                {[age ? `${age} yrs` : null, gender || null]
                  .filter(Boolean)
                  .join(" | ") || "Not specified"}
              </span>
            </div>
            {skillItems.length > 4 && (
              <div className="flex flex-wrap gap-2 border-t border-white/10 pt-3">
                {skillItems.slice(4).map((skill) => (
                  <Pill key={skill}>{skill}</Pill>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="mb-3 h-10 w-full rounded-lg border border-white/10 bg-slate-950/40 text-sm font-semibold text-slate-300 hover:border-cyan-400/30 hover:text-white"
          >
            {showDetails ? "Hide profile details" : "View profile details"}
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              className="btn-primary flex-1"
              disabled={processingRequest}
              onClick={() => manageConnectionRequest("interested")}
            >
              {processingRequest ? "Sending..." : "Connect"}
            </button>
            <button
              type="button"
              className="btn-secondary flex-1"
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
