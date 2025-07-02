import React, { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import axios from 'axios'
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'

const AuthPage = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const {token, setToken} = useContext(UserContext);

  const backendUrl = import.meta.env.VITE_backendUrl;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    try {
      e.preventDefault();
      if (isSignup) {
        const res = await axios.post(backendUrl + "/api/user/register", {formData});
        console.log(res);
        if(res.data.success){
          toast.success("Succesfully Registered");
        }
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
      } else {
        const res = await axios.post(backendUrl + "/api/user/login", {formData});
        console.log(res);
        if(res.data.success){
          toast.success("Succesfully Logged In");
        }
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center  p-6">
      <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {isSignup ? (
            <Title text1="SIGN" text2="UP" />
          ) : (
            <Title text1="LOG" text2="IN" />
          )}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          {isSignup && (
            <div>
              <label className="block mb-1 text-sm">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none focus:ring focus:ring-red-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none focus:ring focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none focus:ring focus:ring-red-500"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm text-gray-300 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-gradient-to-r from-red-500 to-red-700 rounded-md font-semibold hover:brightness-110 transition"
          >
            {isSignup ? "Sign Up" : "Log In"}
          </button>
        </form>

        <div className="text-sm text-center mt-4 text-gray-300">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignup((prev) => !prev)}
            className="text-red-400 underline hover:text-red-200 transition"
          >
            {isSignup ? "Log In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
