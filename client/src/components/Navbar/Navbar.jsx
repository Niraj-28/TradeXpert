import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";

import {
  useState,
} from "react";

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


  return (

    <header className="h-18 bg-white border-b border-gray-200 px-10 flex items-center justify-between">

      {/* LEFT */}

      <div className="w-[220px]">

        <Link to="/dashboard">

          <img
            src={logo}
            alt="TradeXpert"
            className="h-11"
          />

        </Link>

      </div>


      {/* CENTER */}

      <nav className="flex items-center gap-12">

        <Link
          to="/markets"
          className="text-[15px] font-medium hover:text-[#58E6B3] transition-all"
        >

          Markets

        </Link>


        <Link
          to="/portfolio"
          className="text-[15px] font-medium hover:text-[#58E6B3] transition-all"
        >

          Portfolio

        </Link>


        <Link
          to="/trading"
          className="text-[15px] font-medium hover:text-[#58E6B3] transition-all"
        >

          Trading

        </Link>


        <Link
          to="/news"
          className="text-[15px] font-medium hover:text-[#58E6B3] transition-all"
        >

          News

        </Link>

      </nav>


      {/* RIGHT */}

      <div className="w-[220px] flex justify-end relative">

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3"
        >

          <div className="w-10 h-10 rounded-full bg-[#58E6B3] flex items-center justify-center text-white font-bold text-lg">

            {user?.name?.charAt(0)}

          </div>


          <div className="text-left">

            <h3 className="font-semibold text-[15px] leading-5">

              {user?.name}

            </h3>

            <p className="text-gray-500 text-[13px]">

              Trader

            </p>

          </div>


          <ChevronDown size={18} />

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