import React, { useState } from "react";
import { useSelector } from "react-redux";
import EditProfileForm from "./EditProfileForm";

const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 border-b border-slate-800 py-3 last:border-b-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="max-w-[60%] text-right text-sm font-medium text-slate-200">
      {value || "Not specified"}
    </span>
  </div>
);

const Profile = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const profileData = useSelector((state) => state.user);

  if (!profileData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading profile...
      </div>
    );
  }

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

  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "User";
  const location =
    [city, state].filter(Boolean).join(", ") || "Location not specified";
  const skillItems = Array.isArray(skills)
    ? skills.filter(Boolean)
    : skills
      ? [skills]
      : [];
  const completionItems = [
    firstName,
    emailId,
    gender,
    photoUrl,
    description,
    city || state,
    college,
    skillItems.length > 0,
  ];
  const completedCount = completionItems.filter(Boolean).length;
  const completionPercent = Math.round(
    (completedCount / completionItems.length) * 100,
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 bg-slate-950/40 px-6 py-5">
            <p className="text-sm font-medium text-sky-400">Developer profile</p>
            <h1 className="mt-2 text-3xl font-bold text-white">{fullName}</h1>
          </div>

          <div className="grid gap-8 p-6 lg:grid-cols-[18rem_1fr]">
            <aside>
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                <img
                  src={
                    photoUrl ||
                    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={`${fullName} profile`}
                  onError={(event) => {
                    event.currentTarget.src =
                      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80";
                  }}
                  className="aspect-square w-full object-cover"
                />
              </div>

              <button
                type="button"
                onClick={() => setOpenEdit(true)}
                className="mt-4 h-11 w-full rounded-lg bg-sky-500 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                Edit Profile
              </button>
            </aside>

            <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
              <main className="space-y-6">
                <div>
                  <p className="text-sm text-slate-400">{location}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-500">
                    {age && <span>{age} years old</span>}
                    {gender && <span>{gender}</span>}
                    {college && <span>{college}</span>}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                  <h2 className="text-lg font-semibold text-white">About</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {description ||
                      "Add a short summary so other developers know what you work on and what you are looking for."}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                  <h2 className="text-lg font-semibold text-white">Skills</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {skillItems.length ? (
                      skillItems.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">
                        No skills listed yet.
                      </span>
                    )}
                  </div>
                </div>
              </main>

              <aside className="space-y-6">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                      Profile Strength
                    </h2>
                    <span className="text-sm font-semibold text-sky-400">
                      {completionPercent}%
                    </span>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-sky-500"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-slate-500">
                    Complete profile details improve discovery quality.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                  <h2 className="text-lg font-semibold text-white">
                    Details
                  </h2>
                  <div className="mt-3">
                    <DetailRow label="Email" value={emailId} />
                    <DetailRow label="Gender" value={gender} />
                    <DetailRow label="Age" value={age} />
                    <DetailRow label="City" value={city} />
                    <DetailRow label="State" value={state} />
                    <DetailRow label="College" value={college} />
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
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
