import axios from "axios";
import React, { useState } from "react";
import { baseURL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const textFields = [
  { name: "firstName", label: "First name" },
  { name: "lastName", label: "Last name" },
  { name: "city", label: "City" },
  { name: "state", label: "State" },
  { name: "college", label: "College" },
  { name: "photoUrl", label: "Photo URL" },
];

const EditProfileForm = ({ user = {}, onClose }) => {
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [currData, setCurrData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    photoUrl: user?.photoUrl || "",
    city: user?.city || "",
    state: user?.state || "",
    college: user?.college || "",
    age: user?.age || "",
    gender: user?.gender || "",
    description: user?.description || "",
    skills: Array.isArray(user?.skills)
      ? user.skills.join(", ")
      : user?.skills || "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCurrData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const filteredData = Object.fromEntries(
        Object.entries(currData).filter(([, value]) => value !== ""),
      );

      if (filteredData.skills && typeof filteredData.skills === "string") {
        filteredData.skills = filteredData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);
      }

      const res = await axios.patch(baseURL + "/profile/edit", filteredData, {
        withCredentials: true,
      });
      dispatch(addUser(res.data.data));
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while updating profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm">
      <form
        onSubmit={handleSave}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40"
      >
        <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900 px-6 py-5">
          <h2 className="text-xl font-bold text-white">Edit Profile</h2>
          <p className="mt-1 text-sm text-slate-400">
            Keep fields empty if you do not want to update them.
          </p>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          {textFields.map((field) => (
            <label key={field.name} className="block">
              <span className="text-sm font-medium text-slate-300">
                {field.label}
              </span>
              <input
                name={field.name}
                value={currData[field.name]}
                onChange={handleChange}
                className="mt-2 h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </label>
          ))}

          <label className="block">
            <span className="text-sm font-medium text-slate-300">Age</span>
            <input
              name="age"
              type="number"
              min="15"
              max="50"
              value={currData.age}
              onChange={handleChange}
              className="mt-2 h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-300">Gender</span>
            <select
              name="gender"
              value={currData.gender}
              onChange={handleChange}
              className="mt-2 h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-slate-300">Skills</span>
            <input
              name="skills"
              value={currData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
              className="mt-2 h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-slate-300">
              Description
            </span>
            <textarea
              name="description"
              value={currData.description}
              onChange={handleChange}
              rows={4}
              className="mt-2 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </label>

          {error && (
            <div className="rounded-lg border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100 md:col-span-2">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-800 px-6 py-5">
          <button
            type="button"
            className="h-11 rounded-lg border border-slate-700 bg-slate-800 px-5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-11 rounded-lg bg-sky-500 px-5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
