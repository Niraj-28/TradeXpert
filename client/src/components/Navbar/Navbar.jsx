import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  User,
  LogOut,
  Bell,
  Search,
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
    `text-[15px] font-medium transition-all duration-200 whitespace-nowrap ${
      isActive
        ? "text-[#58E6B3]"
        : "text-gray-700 hover:text-[#58E6B3]"
    }`;

  return (

    <header className="sticky top-0 z-50 h-20 bg-white border-b border-gray-200">

      <div className="max-w-[1800px] mx-auto h-full px-6 lg:px-10 flex items-center justify-between">

        {/* LEFT */}

        <div className="flex items-center min-w-[220px]">

          <Link to="/dashboard">

            <img
              src={logo}
              alt="TradeXpert"
              className="h-11 object-contain"
            />

          </Link>

        </div>

        {/* CENTER */}

        <div className="hidden md:flex flex-1 justify-center px-8">

          <nav className="flex items-center gap-8 xl:gap-12">

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

        </div>

        {/* RIGHT */}

        <div className="min-w-[360px] flex items-center justify-end gap-5 relative">

          {/* SEARCH */}

          <div className="hidden lg:flex items-center relative">

            <Search
              size={18}
              className="absolute left-4 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search stocks..."
              className="w-[180px] xl:w-[220px] h-11 pl-11 pr-4 rounded-xl border border-gray-200 bg-[#F8FAFC] outline-none focus:border-[#58E6B3] transition-all text-[14px]"
            />

          </div>

          {/* PROFILE */}

          <button
            onClick={() => setOpen(!open)}
            className="min-w-[190px] flex items-center gap-3 bg-[#F8FAFC] px-4 py-2 rounded-2xl hover:bg-gray-100 transition-all"
          >

            {/* AVATAR */}

            <div className="w-10 h-10 rounded-full bg-[#58E6B3] flex items-center justify-center text-white font-bold text-lg shrink-0">

              {user?.name?.charAt(0)}

            </div>

            {/* USER INFO */}

            <div className="hidden sm:block text-left">

              <h3 className="font-semibold text-[15px] leading-5 text-[#0F172A]">

                {user?.name}

              </h3>

              <p className="text-gray-500 text-[12px]">

                Trader

              </p>

            </div>

          </button>

          {/* DROPDOWN */}

          {open && (

            <div className="absolute top-16 right-0 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50">

              {/* PROFILE */}

              <button
                onClick={() => navigate("/profile")}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-all text-[14px] text-[#0F172A]"
              >

                <User size={18} />

                Profile

              </button>

              {/* NOTIFICATIONS */}

              <button
                onClick={() => navigate("/notifications")}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-all text-[14px] text-[#0F172A]"
              >

                <Bell size={18} />

                Notifications

              </button>

              {/* LOGOUT */}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50 text-red-500 transition-all text-[14px]"
              >

                <LogOut size={18} />

                Logout

              </button>

            </div>

          )}

        </div>

      </div>

    </header>

  );

};

export default Navbar;