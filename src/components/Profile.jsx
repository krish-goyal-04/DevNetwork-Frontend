import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import EditProfileForm from "./EditProfileForm";

//
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
    <div className="min-h-screen bg-base-300 flex items-center justify-center p-6">
      <div className="card bg-base-100 w-full max-w-lg shadow-2xl rounded-2xl">
        {/* 🔹 Header */}
        <div className="flex flex-col items-center p-6 border-b">
          <img
            src={photoUrl}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover ring ring-primary ring-offset-2 "
          />
          <h2 className="text-2xl font-bold mt-3 capitalize">
            {firstName} {lastName || ""}
          </h2>
        </div>

        {/* 🔹 Info Section */}
        <div className="p-6 space-y-4">
          {/* Grid Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {profileAttributes.map((item, ind) => (
              <div
                key={ind}
                className="flex flex-col bg-base-200 p-3 rounded-lg"
              >
                <span className="text-gray-500 text-xs mb-2">{item.Label}</span>
                <span className="font-semibold capitalize">
                  {item.value || "Not specified"}
                </span>
              </div>
            ))}
          </div>

          {/* 🔹 Skills */}
          {skills && (
            <div>
              <h3 className="font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(skills) ? (
                  skills.map((skill, i) => (
                    <span
                      key={i}
                      className="badge badge-primary badge-outline px-3 py-2 capitalize"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="badge badge-outline">{skills}</span>
                )}
              </div>
            </div>
          )}

          {/* 🔹 Description */}
          {description && (
            <div>
              <h3 className="font-semibold mb-1">About</h3>
              <p className="bg-base-200 p-3 rounded-lg text-sm leading-relaxed">
                {description}
              </p>
            </div>
          )}
        </div>

        {/* 🔹 Action */}
        <div className="card-actions justify-center pb-6">
          <button
            className="btn btn-primary px-6"
            onClick={() => setOpenEdit(true)}
          >
            Edit Profile
          </button>
        </div>
        {openEdit && (
          <EditProfileForm
            onClose={() => setOpenEdit(false)}
            user={profileData}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
