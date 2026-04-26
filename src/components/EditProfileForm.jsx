import axios from "axios";
import React, { useState } from "react";
import { baseURL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

// This component is a modal form for editing user profile information. It takes in the current user data and a callback function to close the modal as props. The form allows users to update their profile details, and upon saving, it sends a PATCH request to the server to update the profile information. If the update is successful, it updates the Redux store with the new user data and closes the modal.

const EditProfileForm = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const [currData, seCurrData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    photoUrl: user.photoUrl || "",
    city: user.city || "",
    state: user.state || "",
    college: user.college || "",
    age: user.age || "",
    gender: user.gender || "",
    description: user.description || "",
    skills: user.skills || [],
  });

  // Handle input changes and update the current data state
  const handleChange = (e) => {
    seCurrData({ ...currData, [e.target.name]: e.target.value });
  };
  // Handle saving the updated profile information
  // This function filters out any empty fields from the current data and sends a PATCH request to update the profile or else we will fail db level validations like lastName>3, because it will send lastname as "". If successful, it updates the Redux store with the new user data and closes the modal. If there's an error, it logs the error message.
  const handleSave = async () => {
    try {
      // Filter out empty fields from the current data to avoid sending invalid data to the server
      const filteredData = Object.fromEntries(
        Object.entries(currData).filter(([_, value]) => value !== ""),
      );
      const res = await axios.patch(baseURL + "/profile/edit", filteredData, {
        withCredentials: true,
      });
      dispatch(addUser(res.data.data));
      onClose();
    } catch (error) {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "An error occurred while updating profile.",
      );
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-base-100 p-6 rounded-xl w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-center">Edit Profile</h2>

        {Object.keys(currData).map((key) => (
          <input
            key={key}
            name={key}
            value={currData[key]}
            onChange={handleChange}
            placeholder={key}
            className="input input-bordered w-full capitalize"
          />
        ))}

        <div className="flex justify-end gap-2 mt-4">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditProfileForm;
