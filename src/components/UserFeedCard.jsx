import axios from "axios";
import React, { useState } from "react";
import { baseURL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { ToastNotification } from "./ToastNotification";

// UserFeedCard presents candidate cards in a dark UI with strong contrast.
// Action buttons and badges are designed to make connection requests clear and easy to interact with.
const Pill = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center rounded-full border border-slate-700/80 bg-slate-800/90 px-3 py-1 text-xs font-medium text-slate-300 ${className}`}
  >
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
    _id,
  } = data;

  // This function will be called when the user clicks the "Connect" button. It sends a connection request to the backend and updates the feed accordingly.
  //Avoids apapi call when connection req is sent as data is stored in redux, so we remove the user id from redux and from feed it automatically removes the card from feed. by this way we reduce one api call to fetch feed again after sending connection request.
  const manageConnectionRequest = async (status) => {
    try {
      if (!_id) {
        setError("User ID is missing. Cannot send connection request.");
        return;
      }
      setProcessingRequest(true);
      console.log("Sending connection request to user ID:", _id);
      const res = await axios.post(
        baseURL + "/request/send/" + status + "/" + _id,
        {},
        { withCredentials: true },
      );
      dispatch(removeUserFromFeed(_id));
      status === "interested"
        ? ToastNotification(
            "Connection request sent",
            `You sent a connection request to ${firstName} ${lastName || ""}`.trim(),
            "success",
          )
        : ToastNotification(
            "Connection request skipped",
            `You skipped sending a connection request to ${firstName} ${lastName || ""}`.trim(),
            "error",
          );
      console.log("Connection status:", res.data);
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(err.response?.data?.message || err.message);
      ToastNotification("Request failed", message, "error");
    } finally {
      setProcessingRequest(false);
    }
  };

  const hasPhoto = Boolean(photoUrl);
  const badgeItems = [
    age ? `${age} yrs` : null,
    gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : null,
    city || null,
  ].filter(Boolean);

  return (
    <article className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 hover:shadow-2xl transition-all duration-300 overflow-hidden">
      {/* Profile Header */}
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative">
            {hasPhoto ? (
              <img
                src={photoUrl}
                alt={`${firstName} ${lastName || ""} profile`}
                onError={(event) => {
                  event.currentTarget.src =
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80";
                }}
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-700"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-sky-500 to-slate-700 flex items-center justify-center text-white font-bold text-lg border-2 border-slate-700">
                {firstName.charAt(0)}
                {lastName ? lastName.charAt(0) : ""}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">
              {firstName} {lastName || ""}
            </h3>
            <p className="text-sm text-slate-400 mb-1">
              {city && state
                ? `${city}, ${state}`
                : city || state || "Location not specified"}
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              {age && <span>{age} years old</span>}
              {gender && <span>• {gender}</span>}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <p className="text-sm text-slate-300 line-clamp-3">
            {description || "This developer hasn't added a bio yet."}
          </p>
        </div>
        {/* Skills/Interests */}
        {badgeItems.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {badgeItems.slice(0, 3).map((item) => (
              <span
                key={item}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <button
            className="flex-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
            disabled={processingRequest}
            onClick={() => manageConnectionRequest("interested")}
          >
            {processingRequest ? (
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Connect
              </>
            )}
          </button>
          <button
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center text-sm"
            disabled={processingRequest}
            onClick={() => manageConnectionRequest("ignored")}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Skip
          </button>
        </div>

        {error && (
          <div className="mt-3 bg-rose-500/10 border border-rose-400/20 text-rose-100 px-3 py-2 rounded-lg text-xs">
            {error}
          </div>
        )}
      </div>
    </article>
  );
};

export default UserFeedCard;
