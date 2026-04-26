import React from "react";

const UserCard = (data) => {
  const { firstName, lastName, photoUrl, gender, description, city, age } =
    data.data;
  return (
    <div className="card bg-base-100 w-full max-w-sm shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden border border-base-300">
      <figure className="relative">
        <img
          src={photoUrl}
          alt={`${firstName} ${lastName || ""} profile`}
          className="w-full h-60 object-cover "
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-2xl"></div>
      </figure>
      <div className="card-body p-6 bg-base-100">
        <div className="text-center mb-4">
          <h2 className="card-title text-2xl font-extrabold text-base-content">
            {firstName} {lastName}
          </h2>
          {age && (
            <p className="text-base-content/70 mt-1 font-medium">
              {age} years old
            </p>
          )}
        </div>
        <div className="space-y-3 mb-4">
          {city && (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <p className="text-sm text-base-content/80 font-medium">{city}</p>
            </div>
          )}
          {gender && (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <p className="text-sm text-base-content/80 font-medium capitalize">
                {gender}
              </p>
            </div>
          )}
        </div>
        {description && (
          <blockquote className="text-sm text-base-content/70 italic text-center border-l-4 border-primary pl-4">
            {description}
          </blockquote>
        )}
        <div className="card-actions justify-center mt-6 gap-4">
          <button className="btn btn-primary btn-md shadow-md hover:shadow-lg">
            Send Request
          </button>
          <button className="btn btn-outline btn-secondary btn-md shadow-md hover:shadow-lg">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
