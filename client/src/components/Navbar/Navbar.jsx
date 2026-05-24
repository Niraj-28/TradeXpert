import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ChartCandlestick,
  Newspaper,
  Wallet,
  User,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import logo from "../../assets/logo.png";


const Navbar = () => {

  const { user, logout } = useAuth();

  const navigate = useNavigate();


  const handleLogout = () => {

    logout();

    navigate("/login");

  };


  return (

    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-12">

      {/* LEFT */}

      <div className="flex items-center gap-16">

        {/* Logo */}

        <Link to="/dashboard">

          <img
            src={logo}
            alt="TradeXpert"
            className="h-12"
          />

        </Link>


        {/* Navigation */}

        <div className="flex items-center gap-10">

          <Link
            to="/markets"
            className="flex items-center gap-2 font-medium hover:text-[#58E6B3]"
          >

            <ChartCandlestick size={20} />

            Markets

          </Link>


          <Link
            to="/portfolio"
            className="flex items-center gap-2 font-medium hover:text-[#58E6B3]"
          >

            <Wallet size={20} />

            Portfolio

          </Link>


          <Link
            to="/news"
            className="flex items-center gap-2 font-medium hover:text-[#58E6B3]"
          >

            <Newspaper size={20} />

            News

          </Link>


          <Link
            to="/profile"
            className="flex items-center gap-2 font-medium hover:text-[#58E6B3]"
          >

            <User size={20} />

            Profile

          </Link>

        </div>

      </div>


      {/* RIGHT */}

      <div className="flex items-center gap-5">

        {/* User Name */}

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-full bg-[#58E6B3] text-white flex items-center justify-center font-bold">

            {user?.name?.charAt(0)}

          </div>

          <div>

            <h3 className="font-semibold">

              {user?.name}

            </h3>

            <p className="text-sm text-gray-500">

              Trader

            </p>

          </div>

        </div>


        {/* Logout */}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-50 text-red-500 px-5 py-3 rounded-2xl hover:bg-red-100 transition-all"
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </header>

  );
};

export default Navbar;