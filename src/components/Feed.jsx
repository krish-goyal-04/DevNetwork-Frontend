import axios from "axios";
import React, { useEffect } from "react";
import { baseURL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feedDataFromStore = useSelector((state) => state.feed);
  console.log("feedadata", feedDataFromStore);
  const getFeed = async () => {
    if (feedDataFromStore) return;
    try {
      const res = await axios.get(baseURL + "/feed", { withCredentials: true });
      const feedData = res.data.data;
      dispatch(addFeed(feedData));
    } catch (err) {
      console.log(err.response.data.message);
    }
  };
  useEffect(() => {
    getFeed();
  }, []);
  return (
    <div className="p-4 mt-5">
      {feedDataFromStore && (
        <div className="flex flex-col gap-4">
          {feedDataFromStore.map((feed) => (
            <UserCard data={feed} key={feed._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
