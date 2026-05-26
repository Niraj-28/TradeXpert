import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  User,
  LogOut,
  Bell,
} from "lucide-react";

import { useState } from "react";

import { useAuth } from "../../context/AuthContext";

import logo from "../../assets/logo.png";

const Navbar = () => {

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {

    logout();

    navigate("/login");

  };

  const navLinkStyle = ({ isActive }) =>
    `text-[14px] font-medium transition-all duration-200 ${
      isActive
        ? "text-[#58E6B3]"
        : "text-gray-700 hover:text-[#58E6B3]"
    }`;

  return (

    <header className="sticky top-0 z-50 h-16 bg-white border-b border-gray-200 px-4 md:px-10 flex items-center justify-between">

      {/* LEFT */}

      <div className="w-[180px] md:w-[220px]">

        <Link to="/dashboard">

          <img
            src={logo}
            alt="TradeXpert"
            className="h-10 md:h-11"
          />

        </Link>

      </div>

      {/* CENTER */}

      <nav className="hidden md:flex items-center gap-8 lg:gap-12">

        <NavLink
          to="/markets"
          className={navLinkStyle}
        >
          Markets
        </NavLink>

        <NavLink
          to="/portfolio"
          className={navLinkStyle}
        >
          Portfolio
        </NavLink>

        <NavLink
          to="/watchlist"
          className={navLinkStyle}
        >
          Watchlist
        </NavLink>

        <NavLink
          to="/trading"
          className={navLinkStyle}
        >
          Trading
        </NavLink>

        <NavLink
          to="/news"
          className={navLinkStyle}
        >
          News
        </NavLink>

      </nav>

      {/* RIGHT */}

      <div className="w-[180px] md:w-[220px] flex items-center justify-end gap-3 md:gap-4 relative">

        {/* Notification Bell */}

        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-all">

          <Bell size={20} />

          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>

        </button>

        {/* Profile Button */}

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 bg-[#F8FAFC] px-3 md:px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
        >

          {/* Avatar */}

          <div className="w-8 h-8 rounded-full bg-[#58E6B3] flex items-center justify-center text-white font-bold text-lg">

            {user?.name?.charAt(0)}

          </div>

          {/* User Info */}

          <div className="hidden sm:block text-left">

            <h3 className="font-semibold text-[13px] leading-5">

              {user?.name}

            </h3>

            <p className="text-gray-500 text-[11px]">

              Trader

            </p>

          </div>

        </button>

        {/* Dropdown */}

        {open && (

          <div className="absolute top-14 right-0 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">

            <button
              onClick={() => navigate("/profile")}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-all text-[14px]"
            >

              <User size={16} />

              Profile

            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-500 transition-all text-[14px]"
            >

              <LogOut size={16} />

              Logout

            </button>

          </div>

        )}

      </div>

    </header>

  );
};

export default Navbar;