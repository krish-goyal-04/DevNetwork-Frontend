import axios from "axios";
import React, { useEffect } from "react";
import { baseURL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserFeedCard from "./UserFeedCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feedDataFromStore = useSelector((state) => state.feed);

  const getFeed = async () => {
    if (feedDataFromStore) return;
    try {
      const res = await axios.get(baseURL + "/feed", { withCredentials: true });
      const feedData = res.data.data;
      dispatch(addFeed(feedData));
    } catch (err) {
      console.log(err?.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <div className="p-4 mt-5">
      {feedDataFromStore?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {feedDataFromStore.map((feed) => (
            <UserFeedCard data={feed} key={feed._id || feed.id} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-10 text-center text-slate-400 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.9)]">
          No profiles available yet. Check back soon.
        </div>
      )}
    </div>
  );
};

export default Feed;
