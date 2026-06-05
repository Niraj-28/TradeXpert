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
import { socket } from "../../services/socket";
import toast from "react-hot-toast";
import TransparentLogo from "../../components/ui/TransparentLogo";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const { user, logout } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Notifications state (loaded from / synced to localStorage)
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("trade_notifications");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [showNotifications, setShowNotifications] = useState(false);

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

  // Listen to order execution notifications
  useEffect(() => {
    if (user && (user.id || user._id)) {
      const uid = user.id || user._id;
      socket.emit("join-user-room", uid);
    }
  }, [user]);

  useEffect(() => {
    const handleOrderExecuted = (data) => {
      toast.success(data.message, { icon: "📈", duration: 5000 });
      setNotifications((prev) => {
        const next = [
          {
            id: data.id || Math.random().toString(),
            message: data.message,
            time: data.time || new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
            read: false,
          },
          ...prev,
        ];
        localStorage.setItem("trade_notifications", JSON.stringify(next.slice(0, 50)));
        return next.slice(0, 50);
      });
    };

    socket.on("order-executed", handleOrderExecuted);
    return () => {
      socket.off("order-executed", handleOrderExecuted);
    };
  }, []);

  // Reset notifications subview when avatar dropdown closes
  useEffect(() => {
    if (!open) {
      setShowNotifications(false);
    }
  }, [open]);

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

  const handleOpenNotifications = (e) => {
    e.stopPropagation();
    setShowNotifications(true);
    // Mark all as read
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem("trade_notifications", JSON.stringify(next));
      return next;
    });
  };

  const handleClearNotifications = (e) => {
    e.stopPropagation();
    setNotifications([]);
    localStorage.removeItem("trade_notifications");
  };

  const handleBackToMenu = (e) => {
    e.stopPropagation();
    setShowNotifications(false);
  };

  // Get user avatar initials
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "N";
  const userFullName = user?.name || "Niraj Kotadiya";
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="navbar">

      {/* LEFT */}
      <div className="navbar-left">

        {/* LOGO */}
        <TransparentLogo className="logo" alt="TradeXpert" style={{ height: "38px", width: "130px" }} />

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

          {user && (
            <>
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
            </>
          )}

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

        {/* PROFILE OR AUTH BUTTONS */}
        {user ? (
          <div className="profile-wrapper">

            <div
              className="profile-box"
              onClick={() => setOpen(!open)}
              style={{ position: "relative" }}
            >
              {userInitial}
              {unreadCount > 0 && <span className="profile-notification-badge-dot" />}
            </div>

            {open && (
              <div className="profile-dropdown">
                {showNotifications ? (
                  /* NOTIFICATIONS SUB-DRAWER */
                  <div className="notifications-subdrawer">
                    <div className="subdrawer-header">
                      <button className="subdrawer-back-btn" onClick={handleBackToMenu}>
                        ← Back
                      </button>
                      <h4>Notifications</h4>
                      {notifications.length > 0 && (
                        <button className="subdrawer-clear-btn" onClick={handleClearNotifications}>
                          Clear
                        </button>
                      )}
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <div className="notifications-list-viewport">
                      {notifications.length === 0 ? (
                        <div className="notifications-empty-state">
                          <Bell size={20} className="text-slate-500 mb-1" />
                          <p>No new notifications</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="notification-item">
                            <p className="notification-message">{n.message}</p>
                            <span className="notification-time">{n.time}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  /* ORIGINAL USER PROFILE MENU */
                  <>
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
                    <button className="dropdown-item" onClick={handleOpenNotifications}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Bell size={16} />
                          <span>Notifications</span>
                        </div>
                        {unreadCount > 0 && (
                          <span className="notification-badge-count">{unreadCount}</span>
                        )}
                      </div>
                    </button>

                    {/* LOGOUT */}
                    <button className="dropdown-item logout" onClick={handleLogoutClick}>
                      <LogOut size={16} />
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}

          </div>
        ) : (
          <div className="navbar-auth-buttons" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => navigate("/login")}
              className="nav-btn-text"
              style={{
                border: "none",
                background: "transparent",
                fontSize: "13px",
                fontWeight: "500",
                color: "var(--brand-dark)",
                cursor: "pointer",
                padding: "8px 16px",
                borderRadius: "8px",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--brand-accent)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--brand-dark)"; }}
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="nav-btn-primary"
              style={{
                background: "var(--brand-accent)",
                border: "none",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "600",
                padding: "8px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(64, 138, 113, 0.15)",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--brand-primary)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--brand-accent)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Get Started
            </button>
          </div>
        )}

      </div>

    </header>
  );
};

export default Navbar;