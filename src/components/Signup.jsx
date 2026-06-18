import axios from "axios";
import React, { useState } from "react";
import { baseURL } from "../utils/constants";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { removeFeed } from "../utils/feedSlice";

const initialFormData = {
  firstName: "",
  lastName: "",
  emailId: "",
  password: "",
  confirmPassword: "",
  age: "",
  gender: "",
  city: "",
  state: "",
  college: "",
  skills: "",
  description: "",
  photoUrl: "",
};

const inputClass =
  "input-control";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
        return;
      }

      const payload = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => {
          if (key === "confirmPassword") return false;
          if (key === "age") return value !== "";
          return value !== "" && value !== null && value !== undefined;
        }),
      );

      if (payload.age) payload.age = Number(payload.age);
      if (payload.skills) {
        payload.skills = payload.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);
      }

      await axios.post(baseURL + "/signup", payload, {
        withCredentials: true,
      });

      dispatch(removeFeed());
      return navigate("/feed");
    } catch (err) {
      const backendError =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data ||
        err.message;
      setError("Error signing up: " + backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <div className="page-header">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400 text-sm font-bold text-slate-950">
                D
              </div>
              <span className="text-xl font-bold text-white">DevNetwork</span>
            </div>
            <h1 className="page-title">
              Create your developer profile
            </h1>
            <p className="page-copy">
              Add the basics now. You can update profile details later from your
              account page.
            </p>
          </div>
          <p className="text-sm text-slate-400">
            Already registered?{" "}
            <Link
              to="/login"
              className="font-semibold text-cyan-300 hover:text-cyan-200"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="panel p-6"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <section>
              <h2 className="text-lg font-semibold text-white">
                Account details
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-300">
                    First name
                  </span>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-300">
                    Last name
                  </span>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium text-slate-300">
                    Email
                  </span>
                  <input
                    name="emailId"
                    type="email"
                    value={formData.emailId}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-300">
                    Password
                  </span>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-300">
                    Confirm password
                  </span>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </label>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                Profile details
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-300">
                    Age
                  </span>
                  <input
                    name="age"
                    type="number"
                    min="15"
                    max="50"
                    value={formData.age}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-300">
                    Gender
                  </span>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-300">
                    City
                  </span>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-300">
                    State
                  </span>
                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium text-slate-300">
                    College
                  </span>
                  <input
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium text-slate-300">
                    Skills
                  </span>
                  <input
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="React, Node.js, MongoDB"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium text-slate-300">
                    Photo URL
                  </span>
                  <input
                    name="photoUrl"
                    value={formData.photoUrl}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="https://example.com/photo.jpg"
                  />
                </label>
              </div>
            </section>
          </div>

          <label className="mt-6 block">
            <span className="text-sm font-medium text-slate-300">
              Short bio
            </span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="textarea-control"
              placeholder="Tell people what you build, learn, or want to collaborate on."
            />
          </label>

          {error && (
            <div className="mt-6 rounded-lg border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
