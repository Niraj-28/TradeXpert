import { NavLink } from "react-router-dom";
import {
  Search,
  User,
  Bell,
  LogOut,
} from "lucide-react";

import { useState } from "react";

import logo from "../../assets/Logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">

      {/* LEFT */}
      <div className="navbar-left">

        {/* LOGO */}
        <img
          src={logo}
          alt="TradeXpert"
          className="logo"
        />

        {/* MENU */}
        <nav className="navbar-center">

          <NavLink
            to="/markets"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Markets
          </NavLink>

          <NavLink
            to="/portfolio"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Portfolio
          </NavLink>

          <NavLink
            to="/watchlist"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Watchlist
          </NavLink>

          <NavLink
            to="/trading"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Trading
          </NavLink>

          <NavLink
            to="/news"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            News
          </NavLink>

        </nav>

      </div>

      {/* RIGHT */}
      <div className="navbar-right">

        {/* SEARCH */}
        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search stocks..."
          />

        </div>

        {/* PROFILE */}
        <div className="profile-wrapper">

          <div
            className="profile-box"
            onClick={() => setOpen(!open)}
          >
            N
          </div>

          {open && (
            <div className="profile-dropdown">

              {/* USER */}
              <div className="dropdown-user">

                <div className="dropdown-avatar">
                  N
                </div>

                <div>
                  <h4>Niraj</h4>
                  <p>Trader</p>
                </div>

              </div>

              <div className="dropdown-divider"></div>

              {/* PROFILE */}

              <NavLink
                to="/profile"
                className="dropdown-link"
              >
                <button className="dropdown-item">
                  <User size={16} />
                  Profile
                </button>
              </NavLink>

              {/* NOTIFICATION */}

              <button className="dropdown-item">
                <Bell size={16} />
                Notifications
              </button>

              {/* LOGOUT */}

              <button className="dropdown-item logout">
                <LogOut size={16} />
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