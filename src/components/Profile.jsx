import React, { useState } from "react";
import { useSelector } from "react-redux";
import EditProfileForm from "./EditProfileForm";

// Profile page features dark card sections, a clean personal summary, and well-spaced information blocks.
// The edit profile flow is accessible and keeps the main UI uncluttered while providing strong visual hierarchy.
const Profile = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const profileData = useSelector((state) => state.user);
  if (!profileData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  const {
    firstName,
    lastName,
    photoUrl,
    gender,
    description,
    city,
    age,
    college,
    state,
    skills,
    emailId,
  } = profileData;
  const profileAttributes = [
    { Label: "First Name", value: firstName },
    { Label: "Last Name", value: lastName },
    { Label: "Gender", value: gender },
    { Label: "Age", value: age },
    { Label: "City", value: city },
    { Label: "College", value: college },
    { Label: "State", value: state },
    { Label: "Email ID", value: emailId },
  ];
  console.log("Profile data from Redux:", profileData);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 capitalize">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Profile Header Card */}
        <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 overflow-hidden mb-6">
          <div className="px-6 py-10 text-center">
            <div className="mx-auto h-36 w-36 overflow-hidden rounded-full border-4 border-slate-800 shadow-lg bg-slate-800">
              <img
                src={
                  photoUrl ||
                  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
                }
                alt="Profile"
                onError={(event) => {
                  event.currentTarget.src =
                    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80";
                }}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-6">
              <h1 className="text-3xl font-bold text-white">
                {firstName} {lastName ? lastName : ""}
              </h1>
              <p className="text-lg text-slate-300 mt-2">
                {city && state
                  ? `${city}, ${state}`
                  : city || state || "Location not specified"}
              </p>
              <div className="flex flex-wrap justify-center items-center gap-3 mt-3 text-sm text-slate-400">
                {age && <span>{age} years old</span>}
                {gender && <span>• {gender}</span>}
              </div>
            </div>

            <button
              onClick={() => setOpenEdit(true)}
              className="mt-8 inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium py-2.5 px-6 rounded-lg transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            {description && (
              <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">About</h2>
                <p className="text-slate-300 leading-relaxed">{description}</p>
              </div>
            )}

            {/* Skills Section */}
            {skills && (
              <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Skills & Expertise
                </h2>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(skills) ? (
                    skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-slate-800 text-slate-200 px-3 py-1 rounded-full text-sm font-medium border border-slate-700"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="bg-slate-800 text-slate-200 px-3 py-1 rounded-full text-sm font-medium border border-slate-700">
                      {skills}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Contact Information
              </h2>
              <div className="space-y-3">
                {profileAttributes.map((item, ind) => (
                  <div
                    key={ind}
                    className="flex justify-between items-center py-2 border-b border-slate-800 last:border-b-0"
                  >
                    <span className="text-slate-400 text-sm">{item.Label}</span>
                    <span className="text-slate-100 font-medium text-sm">
                      {item.value || "Not specified"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Profile Stats
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-sky-400">0</div>
                  <div className="text-sm text-slate-400">Connections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">0</div>
                  <div className="text-sm text-slate-400">Projects</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openEdit && (
        <EditProfileForm
          user={profileData}
          onClose={() => setOpenEdit(false)}
        />
      )}
    </div>
  );
};

export default Profile;
