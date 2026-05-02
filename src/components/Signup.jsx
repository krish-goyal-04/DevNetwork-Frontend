import axios from "axios";
import React, { useState } from "react";
import { baseURL } from "../utils/constants";
import { useNavigate } from "react-router";
const Signup = () => {
  const navigate = useNavigate();
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
      options: ["Male", "Female", "Other"],
      required: false,
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
      //Removiong empty and null values from formData before sending to backend
      const sanitizedFormData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => {
          return value !== "" && value !== null && value !== undefined;
        }),
      );
      const res = await axios.post(baseURL + "/signup", sanitizedFormData, {
        withCredentials: true,
      });
      console.log("Signup successful:", res.data);
      //navigate("/login");
    } catch (err) {
      setError(
        "Error signing up: " + (err.response?.data?.message || err.message),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900/95 border border-slate-800 shadow-[0_25px_80px_-30px_rgba(15,23,42,0.8)] p-8 backdrop-blur-xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {formFields.map((row) => (
              <div key={row.name} className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  {row.label}
                  {row.required && <span className="text-red-500"> *</span>}
                </label>
                <input
                  type={row.type}
                  name={row.name}
                  value={formData[row.name]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder={row.placeholder}
                  required={row.required}
                  options={row.options}
                  disabled={loading}
                />
              </div>
            ))}
          </div>
          {error && <p className="text-red-400 text-center text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            disabled={loading}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
