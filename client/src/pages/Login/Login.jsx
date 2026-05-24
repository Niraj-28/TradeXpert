import { useState } from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { loginUser } from "../../services/authService";

import { useAuth } from "../../context/AuthContext";

import logo from "../../assets/logo.png";


const Login = () => {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = await loginUser(formData);

      login(data);

      toast.success("Login Successful");

      navigate("/dashboard");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Login Failed"
      );

    }

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl shadow-sm border border-gray-200 w-full max-w-md"
      >

        {/* Logo */}

        <div className="flex justify-center mb-2">

          <img
            src={logo}
            alt="TradeXpert"
            className="h-16"
          />

        </div>

        <h1 className="text-3xl font-bold mb-6 text-center">
          Welcome Back
        </h1>

        <div className="space-y-5">

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full h-14 border border-gray-300 rounded-2xl px-5 outline-none focus:border-[#58E6B3]"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full h-14 border border-gray-300 rounded-2xl px-5 outline-none focus:border-[#58E6B3]"
          />

          <button className="w-full h-14 bg-[#58E6B3] rounded-2xl font-semibold">

            Login

          </button>

        </div>

      </form>

    </div>

  );
};

export default Login;