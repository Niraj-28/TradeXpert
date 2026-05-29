import { NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  User,
  Bell,
  LogOut,
  X,
  RefreshCw
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { searchStocks } from "../../services/marketApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import logo from "../../assets/Logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const { user, logout } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setDropdownOpen(true);

    if (!val.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const data = await searchStocks(val);
      setSearchResults(data || []);
    } catch (error) {
      console.error("Navbar search error:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleLogoutClick = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
    setOpen(false);
  };

  // Get user avatar initials
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "N";
  const userFullName = user?.name || "Niraj Kotadiya";

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
            to="/orders"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Orders
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
        <div className="search-box" style={{ position: "relative" }} ref={searchRef}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search stocks (e.g. RELIANCE, TATASTEEL)..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setDropdownOpen(true)}
          />
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(""); setSearchResults([]); }}
              style={{ border: "none", background: "transparent", cursor: "pointer", paddingRight: "8px", display: "flex", alignItems: "center" }}
            >
              <X size={15} className="text-slate-400" />
            </button>
          )}

          {dropdownOpen && searchQuery && (
            <div className="nav-search-dropdown">
              {searching ? (
                <div className="nav-search-status">
                  <RefreshCw className="animate-spin text-[#00b074]" size={15} />
                  <span>Searching...</span>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((stock) => (
                  <div
                    key={stock.instrument_key}
                    onClick={() => {
                      navigate(`/stocks/${stock.trading_symbol.toUpperCase()}`);
                      setSearchQuery("");
                      setSearchResults([]);
                      setDropdownOpen(false);
                    }}
                    className="nav-search-result-item"
                  >
                    <div className="result-left-block">
                      <span className="result-sym">{stock.trading_symbol}</span>
                      <span className="result-name">{stock.name || "Equity Stock"}</span>
                    </div>
                    <span className="result-ex">{stock.exchange}</span>
                  </div>
                ))
              ) : (
                <div className="nav-search-status">
                  <span>No stocks found</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* PROFILE */}
        <div className="profile-wrapper">

          <div
            className="profile-box"
            onClick={() => setOpen(!open)}
          >
            {userInitial}
          </div>

          {open && (
            <div className="profile-dropdown">

              {/* USER */}
              <div className="dropdown-user">

                <div className="dropdown-avatar">
                  {userInitial}
                </div>

                <div>
                  <h4>{userFullName}</h4>
                  <p>Trader</p>
                </div>

              </div>

              <div className="dropdown-divider"></div>

              {/* PROFILE */}

              <NavLink
                to="/profile"
                className="dropdown-link"
                onClick={() => setOpen(false)}
              >
                <button className="dropdown-item">
                  <User size={16} />
                  Profile
                </button>
              </NavLink>

              {/* NOTIFICATION */}

              <button className="dropdown-item" onClick={() => setOpen(false)}>
                <Bell size={16} />
                Notifications
              </button>

              {/* LOGOUT */}

              <button className="dropdown-item logout" onClick={handleLogoutClick}>
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