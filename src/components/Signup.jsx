import axios from "axios";
import React, { useState } from "react";
import { baseURL } from "../utils/constants";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { removeFeed } from "../utils/feedSlice";

// Signup uses a consistent dark theme with clear onboarding sections and subtle UI transitions.
// The form is designed to feel inviting and easy to complete, while maintaining mobile responsiveness.
const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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
  });

  const formFields = [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "John",
      required: true,
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "Doe",
      required: false,
    },
    {
      name: "emailId",
      label: "Email",
      type: "email",
      placeholder: "john.doe@example.com",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
      required: true,
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Confirm password",
      required: true,
    },
    {
      name: "age",
      label: "Age",
      type: "number",
      placeholder: "25",
      required: false,
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      options: ["Male", "Female", "Others"],
      required: true,
    },
    {
      name: "city",
      label: "City",
      type: "text",
      placeholder: "New York",
      required: false,
    },
    {
      name: "state",
      label: "State",
      type: "text",
      placeholder: "NY",
      required: false,
    },
    {
      name: "college",
      label: "College",
      type: "text",
      placeholder: "University of XYZ",
      required: false,
    },
    {
      name: "skills",
      label: "Skills",
      type: "text",
      placeholder: "JavaScript, React, Node.js",
      required: false,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Tell us about yourself...",
      required: false,
    },
    {
      name: "photoUrl",
      label: "Photo URL",
      type: "text",
      placeholder: "https://example.com/photo.jpg",
      required: false,
    },
  ];
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
        return;
      }
      //Removing empty and null values from formData before sending to backend
      const sanitizedFormData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => {
          if (key === "confirmPassword") return false;
          if (key === "age") return Number(value);
          return value !== "" && value !== null && value !== undefined;
        }),
      );

      // Convert comma-separated skills string into an array
      if (sanitizedFormData.skills) {
        sanitizedFormData.skills = sanitizedFormData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== "");
      }

      const res = await axios.post(baseURL + "/signup", sanitizedFormData, {
        withCredentials: true,
      });

      dispatch(removeFeed());
      console.log("Signup successful:", res.data);
      setError("");
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center shadow-sm shadow-sky-500/20">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-2xl font-bold text-white">DevNetwork</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Join Our Developer Community
          </h1>
          <p className="text-slate-400">
            Connect with developers, build your network, and grow your career
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Two Column Grid for Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formFields.slice(0, 2).map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {field.label}
                    {field.required && (
                      <span className="text-rose-400 ml-1">*</span>
                    )}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                    placeholder={field.placeholder}
                    required={field.required}
                    disabled={loading}
                  />
                </div>
              ))}
            </div>

            {/* Email and Password */}
            <div className="space-y-4">
              {formFields.slice(2, 5).map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {field.label}
                    {field.required && (
                      <span className="text-rose-400 ml-1">*</span>
                    )}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                    placeholder={field.placeholder}
                    required={field.required}
                    disabled={loading}
                  />
                </div>
              ))}
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formFields.slice(5, 9).map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {field.label}
                    {field.required && (
                      <span className="text-rose-400 ml-1">*</span>
                    )}
                  </label>
                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                      required={field.required}
                      disabled={loading}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                      placeholder={field.placeholder}
                      required={field.required}
                      disabled={loading}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Skills and Description */}
            <div className="space-y-4">
              {formFields.slice(9, 11).map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {field.label}
                    {field.required && (
                      <span className="text-rose-400 ml-1">*</span>
                    )}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors resize-none"
                      placeholder={field.placeholder}
                      required={field.required}
                      disabled={loading}
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                      placeholder={field.placeholder}
                      required={field.required}
                      disabled={loading}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {formFields[11].label}
                {formFields[11].required && (
                  <span className="text-rose-400 ml-1">*</span>
                )}
              </label>
              <input
                type={formFields[11].type}
                name={formFields[11].name}
                value={formData[formFields[11].name]}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                placeholder={formFields[11].placeholder}
                required={formFields[11].required}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-400/20 rounded-lg p-4">
                <p className="text-rose-100 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
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
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
