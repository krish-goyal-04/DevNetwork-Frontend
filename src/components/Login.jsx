import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router";
import { baseURL } from "../utils/constants";
import { Link } from "react-router";
import { io } from "socket.io-client";
// Login page uses a dark surface with easy-to-read input labels and strong contrast.
// The centered card layout keeps the focus on authentication and provides a modern, calm sign-in experience.
const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formFields = [
    {
      id: "emailId",
      label: "Email Address",
      type: "email",
      placeholder: "Enter your email",
      value: emailId,
      onChange: setEmailId,
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
      value: password,
      onChange: setPassword,
    },
  ];

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.post(
        baseURL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true },
      );
      const user = res.data.data;
      dispatch(addUser(user));
      const socket = io(baseURL, {
        withCredentials: true,
      });
      socket.on("connect", () => {
        console.log("Connected to Socket.IO server with ID: " + socket.id);
      });
      return navigate("/feed");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-950 text-slate-100 flex">
      {/* Hero Section */}
      <div className="flex flex-1 min-h-full">
        {/* Left Side - Hero Content */}
        <div className="hidden lg:flex  bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 p-12 flex-col justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 text-slate-100">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Connect with <span className="text-blue-200">Developers</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Build your professional network, discover opportunities, and grow
              your career in tech.
            </p>
            <div className="flex flex-col space-y-4 text-blue-100">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                <span className="text-lg">10K+ Active Developers</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                <span className="text-lg">500+ Companies</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                <span className="text-lg">Real-time Collaboration</span>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-slate-100/10 rounded-full blur-3xl"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-sky-300/15 rounded-full blur-2xl"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-slate-400">
                  Sign in to your developer network
                </p>
              </div>

              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                {formFields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      required
                    />
                  </div>
                ))}

                {error && (
                  <div className="bg-rose-500/10 border border-rose-400/20 text-rose-200 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
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
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-400">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-sky-400 hover:text-sky-300 font-semibold transition-colors duration-200"
                  >
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
