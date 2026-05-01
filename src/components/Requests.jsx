import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseURL } from "../utils/constants";
import LoadingPage from "./LoadingPage";

const Requests = () => {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const getRquests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(baseURL + "/user/requests/received", {
        withCredentials: true,
      });
      setRequests(res.data || []);
      console.log(res.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRquests();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }
  return (
    <div className="min-h-screen bg-base-300 px-4 py-8 ">
      {requests.length > 0 ? (
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="rounded-3xl border border-base-200 bg-base-100/80 p-8 shadow-sm">
            <h1 className="text-4xl font-semibold">requests</h1>
            <p className="mt-2 text-base-content/70">
              You have{" "}
              <span className="font-semibold text-primary">
                {requests.length}
              </span>{" "}
              active network requests.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {requests.map((connection) => (
              <UserDetailsCard key={connection._id} user={connection} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl  rounded-3xl border border-base-200 bg-base-100/80 p-10 text-center text-base-content/70 shadow-sm">
          You have no requests yet. Start building your network by connecting
          with other professionals!
        </div>
      )}
    </div>
  );
};

export default Requests;
