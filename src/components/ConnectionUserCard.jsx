import React from "react";

const ConnectionUserCard = ({ user }) => {
  // 🔥 Fix skills (handle "java, python" case)
  const skillsArray = Array.isArray(user.skills)
    ? user.skills.flatMap((s) => s.split(","))
    : [];

  return (
    <div className="w-full bg-base-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-base-200">
      {/* 🔹 Avatar */}
      <div className="flex-shrink-0">
        <img
          src={user.photoUrl || "/default-avatar.png"}
          alt="profile"
          className="w-16 h-16 object-cover rounded-full ring ring-primary/20 ring-offset-2"
        />
      </div>

      {/* 🔹 Content */}
      <div className="flex flex-col flex-1">
        {/* Name + Age */}
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">
            {[user.firstName, user.lastName].filter(Boolean).join(" ") ||
              "User"}
          </h3>
          {user.age && (
            <span className="text-sm text-base-content/50">• {user.age}</span>
          )}
        </div>

        {/* Location */}
        {(user.city || user.state) && (
          <p className="text-sm text-base-content/60 mt-1">
            📍 {[user.city, user.state].filter(Boolean).join(", ")}
          </p>
        )}

        {/* College */}
        {user.college && (
          <p className="text-sm text-base-content/60 truncate">
            🎓 {user.college}
          </p>
        )}

        {/* Skills */}
        {skillsArray.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {skillsArray.slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full capitalize font-medium"
              >
                {skill.trim()}
              </span>
            ))}
            {skillsArray.length > 3 && (
              <span className="text-xs text-base-content/50">
                +{skillsArray.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 🔹 Action */}
      <div>
        <button className="btn btn-sm btn-primary rounded-lg px-4">View</button>
      </div>
    </div>
  );
};

export default ConnectionUserCard;
