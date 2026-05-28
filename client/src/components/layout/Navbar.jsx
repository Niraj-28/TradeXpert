import { NavLink } from "react-router-dom";
import { Search } from "lucide-react";

import logo from "../../assets/Logo.png";

const Navbar = () => {
  return (
    <header className="navbar">

      <div className="navbar-left">
        <img src={logo} alt="TradeXpert" className="logo" />
      </div>

      <nav className="navbar-center">
        <NavLink to="/markets">Markets</NavLink>
        <NavLink to="/portfolio">Portfolio</NavLink>
        <NavLink to="/watchlist">Watchlist</NavLink>
        <NavLink to="/trading">Trading</NavLink>
        <NavLink to="/news">News</NavLink>
      </nav>

      <div className="navbar-right">

        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search stocks..." />
        </div>

        <div className="profile-box">
          <div className="profile-avatar"></div>
          <span>Trader</span>
        </div>

      </div>

    </header>
  );
};

export default Navbar;