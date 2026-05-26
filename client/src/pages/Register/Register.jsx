import { useState } from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import logo from "../../assets/logo.png";

import { registerUser } from "../../services/authService";

import { useAuth } from "../../context/AuthContext";


const Register = () => {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({

    name: "",
    email: "",
    password: "",
    phone: "",

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

      const data = await registerUser(formData);

      login(data);

      toast.success("Account Created");

      navigate("/dashboard");

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Registration Failed"

      );

    }

  };


  return (

    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-[#F0FFF8] to-[#ECFDF5] px-6">

      {/* BACKGROUND GLOW */}

      <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-[#58E6B3]/20 rounded-full blur-[120px]"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-[#34D399]/20 rounded-full blur-[120px]"></div>

      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#58E6B3]/10 rounded-full blur-[140px]"></div>


      {/* GRID EFFECT */}

      <div className="absolute inset-0 opacity-[0.03]">

        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(#0F172A 1px, transparent 1px), linear-gradient(to right, #0F172A 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        ></div>

      </div>


      {/* REGISTER CARD */}

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[32px] shadow-[0_20px_60px_rgba(52,211,153,0.10)] border border-white/60 w-full max-w-md"
      >

        {/* LOGO */}

        <div className="flex justify-center mb-3">

          <img
            src={logo}
            alt="TradeXpert"
            className="h-16"
          />

        </div>


        {/* TITLE */}

        <h1 className="text-[30px] font-bold mb-4 text-center text-[#0F172A]">

          Create Account

        </h1>

        {/* INPUTS */}

        <div className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full h-14 border border-[#E2E8F0] rounded-2xl px-5 outline-none focus:border-[#58E6B3] bg-white"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full h-14 border border-[#E2E8F0] rounded-2xl px-5 outline-none focus:border-[#58E6B3] bg-white"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full h-14 border border-[#E2E8F0] rounded-2xl px-5 outline-none focus:border-[#58E6B3] bg-white"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            className="w-full h-14 border border-[#E2E8F0] rounded-2xl px-5 outline-none focus:border-[#58E6B3] bg-white"
          />

          <button className="w-full h-14 bg-gradient-to-r from-[#58E6B3] to-[#34D399] rounded-2xl font-semibold text-black hover:opacity-90 transition-all shadow-[0_10px_30px_rgba(52,211,153,0.20)]">

            Register

          </button>

        </div>


        {/* LOGIN OPTION */}

        <div className="text-center mt-4">

          <p className="text-[#64748B]">

            Already registered?{" "}

            <span
              onClick={() => navigate("/login")}
              className="text-[#34D399] font-semibold cursor-pointer hover:underline"
            >

              Sign In

            </span>

          </p>

        </div>

      </form>

    </div>

  );
};

export default Register;