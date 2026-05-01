import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseURL } from "../utils/constants";
import UserDetailsCard from "./UserDetailsCard";
import LoadingPage from "./LoadingPage";

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  const getConnections = async () => {
    try {
      setLoading(true);
      const res = await axios.get(baseURL + "/user/connections", {
        withCredentials: true,
      });
      setConnections(res.data.data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-base-300 px-4 py-8 ">
      {connections.length > 0 ? (
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="rounded-3xl border border-base-200 bg-base-100/80 p-8 shadow-sm">
            <h1 className="text-4xl font-semibold">Connections</h1>
            <p className="mt-2 text-base-content/70">
              You have{" "}
              <span className="font-semibold text-primary">
                {connections.length}
              </span>{" "}
              active network connections.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {connections.map((connection) => (
              <UserDetailsCard key={connection._id} user={connection} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl  rounded-3xl border border-base-200 bg-base-100/80 p-10 text-center text-base-content/70 shadow-sm">
          You have no connections yet. Start building your network by connecting
          with other professionals!
        </div>
      )}
    </div>
  );
};

export default Connections;
