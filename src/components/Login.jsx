import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router";
import { baseURL } from "../utils/constants";
const Login = () => {
  const [emailId, setEmailId] = useState("Tinku@gmail.com");
  const [password, setPassword] = useState("Tinku@123");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //useDispatch hook is used to dispatch an action
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        baseURL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true },
      );
      const user = res.data.data;
      //console.log(user);
      dispatch(addUser(user));
      //console.log(res);
      return navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex justify-center items-center ">
      <div className="card bg-base-300 text-primary-content w-96">
        <div className="card-body">
          <h2 className="card-title text-gray-100 justify-center text-3xl font-bold">
            Login
          </h2>
          <div className="flex flex-col justify-center p-3 my-6">
            <input
              type="email"
              className="bg-base-100 p-2 rounded-lg my-3"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
            ></input>
            <input
              type="password"
              className="bg-base-100 p-2 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>

          <div className="card-actions flex justify-center ">
            <button
              className="btn rounded-lg hover:bg-blue-500"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
