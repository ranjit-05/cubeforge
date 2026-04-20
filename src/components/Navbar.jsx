import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MdHome, MdTimer, MdMenuBook, MdShowChart, MdSchool, MdLogout, MdMenu, MdClose } from "react-icons/md";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: MdHome },
  { to: "/timer", label: "Timer", icon: MdTimer },
  { to: "/algorithms", label: "Algorithms", icon: MdMenuBook },
  { to: "/progress", label: "Progress", icon: MdShowChart },
  { to: "/training", label: "Training", icon: MdSchool },
];

const LOGO_TILES = [
  "#BA0C2F","#FFD500","#0051A2",
  "#009B48","#FF5800","#F0EFE0",
  "#FFD500","#0051A2","#BA0C2F",
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => { await logout(); navigate("/login"); };
  const initials = (user?.displayName || user?.email || "U")[0].toUpperCase();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="nav-logo">
          <div className="nav-logo-face">
            {LOGO_TILES.map((c, i) => (
              <span key={i} style={{ background: c }} />
            ))}
          </div>
          <span className="nav-logo-text">Cube<em>rick</em></span>
        </Link>

        <div className="nav-links">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}
              className={`nav-link ${location.pathname === to ? "active" : ""}`}>
              <Icon size={16} />{label}
            </Link>
          ))}
        </div>

        <div className="nav-right">
          <div className="user-chip">
            <div className="user-avatar">{initials}</div>
            <span>{user?.displayName || user?.email?.split("@")[0]}</span>
          </div>
          <button onClick={handleLogout} className="btn-logout" title="Logout">
            <MdLogout size={17} />
          </button>
          <button className="hamburger" onClick={() => setOpen(o => !o)}>
            {open ? <MdClose size={22}/> : <MdMenu size={22}/>}
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-menu">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}
              className={`mobile-link ${location.pathname === to ? "active" : ""}`}
              onClick={() => setOpen(false)}>
              <Icon size={18}/>{label}
            </Link>
          ))}
          <button onClick={handleLogout} className="mobile-logout">
            <MdLogout size={16}/> Logout
          </button>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
