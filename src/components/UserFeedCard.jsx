import axios from "axios";
import React, { useState } from "react";
import { baseURL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

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
  const sendConnectionRequest = async () => {
    try {
      if (!_id) {
        setError("User ID is missing. Cannot send connection request.");
        return;
      }
      setProcessingRequest(true);
      console.log("Sending connection request to user ID:", _id);
      const res = await axios.post(
        baseURL + "/request/send/interested/" + _id,
        {},
        { withCredentials: true },
      );
      dispatch(removeUserFromFeed(_id));
      console.log("Connection status:", res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setProcessingRequest(false);
    }
  };

  const ignoreConnectionRequest = async () => {
    try {
      if (!_id) {
        setError("User ID is missing. Cannot ignore connection request.");
        return;
      }
      setProcessingRequest(true);
      const res = await axios.post(
        baseURL + "/request/send/ignored/" + _id,
        {},
        { withCredentials: true },
      );
      dispatch(removeUserFromFeed(_id));
      console.log("Ignore status:", res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
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
    <article className="overflow-hidden rounded-[24px] border border-slate-800 bg-slate-950 shadow-[0_20px_80px_-32px_rgba(15,23,42,0.8)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_90px_-26px_rgba(59,130,246,0.45)] ">
      <div className="h-64 overflow-hidden bg-slate-900">
        {hasPhoto ? (
          <img
            src={photoUrl}
            alt={`${firstName} ${lastName || ""} profile`}
            onError={(event) => {
              event.currentTarget.src =
                "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80";
            }}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="flex h-full  w-full items-center justify-center bg-slate-800 text-4xl font-bold capitalize text-slate-300">
            {firstName} {lastName ? lastName : ""}
          </div>
        )}
      </div>

      <div className="space-y-5 p-6 capitalize">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {firstName} {lastName || ""}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {city ? `${city}` : "Location not available"}
            </p>
          </div>
          <div className="text-right text-sm font-medium text-slate-300">
            {age ? `${age} yrs` : "Age unknown"}
            <span className="block text-slate-500">
              {gender ? gender : "Gender unknown"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {badgeItems.map((item) => (
            <Pill key={item}>{item}</Pill>
          ))}
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            Description
          </h3>
          <p className="text-sm leading-6 text-slate-300">
            {description || "This user has not added a profile summary yet."}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            className="btn btn-primary min-h-12"
            disabled={processingRequest}
            onClick={sendConnectionRequest}
          >
            Connect
          </button>
          <button
            className="btn btn-outline btn-secondary min-h-12"
            disabled={processingRequest}
            onClick={ignoreConnectionRequest}
          >
            Ignore
          </button>
        </div>
      </div>
    </article>
  );
};

export default UserFeedCard;
