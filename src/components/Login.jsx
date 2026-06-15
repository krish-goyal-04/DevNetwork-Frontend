import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate, Link } from "react-router";
import { baseURL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.post(
        baseURL + "/login",
        { emailId, password },
        { withCredentials: true },
      );
      dispatch(addUser(res.data.data));
      return navigate("/feed");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-7xl px-4 py-10 lg:grid-cols-[1fr_28rem] lg:items-center lg:gap-16">
        <section className="hidden lg:block">
          <div className="max-w-2xl">
            <div className="mb-8 inline-flex items-center rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300">
              Full-stack developer networking platform
            </div>
            <h1 className="text-5xl font-bold leading-tight text-white">
              Build your network with people who actually write code.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-400">
              Discover developers, manage connection requests, and chat in real
              time after both sides connect.
            </p>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {["Secure auth", "Live chat", "Profile discovery"].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-4"
                >
                  <p className="text-sm font-semibold text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/30">
            <div className="mb-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500 text-sm font-bold text-slate-950">
                  D
                </div>
                <span className="text-xl font-bold text-white">DevNetwork</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-400">
                Sign in to continue to your developer feed.
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                handleLogin();
              }}
            >
              <label className="block">
                <span className="text-sm font-medium text-slate-300">
                  Email address
                </span>
                <input
                  type="email"
                  value={emailId}
                  onChange={(event) => setEmailId(event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-300">
                  Password
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  placeholder="Enter your password"
                  required
                />
              </label>

              {error && (
                <div className="rounded-lg border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="h-11 w-full rounded-lg bg-sky-500 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              New to DevNetwork?{" "}
              <Link
                to="/signup"
                className="font-semibold text-sky-400 hover:text-sky-300"
              >
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
