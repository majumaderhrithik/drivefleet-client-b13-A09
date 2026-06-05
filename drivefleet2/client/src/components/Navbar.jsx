import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
    setDropOpen(false); setMobileOpen(false);
  };

  const nl = (to, label) => (
    <NavLink to={to} end={to==="/"} onClick={() => setMobileOpen(false)}
      className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
      {label}
    </NavLink>
  );

  const avatar = user?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email || "U")}&background=E53935&color=fff&size=64`;

  return (
    <header className="navbar">
      <div className="nav-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <span className="logo-mark">D</span>
          <span className="logo-text">Drive<span>Fleet</span></span>
        </Link>

        {/* Desktop links */}
        <nav className="nav-links">
          {nl("/", "Home")}
          {nl("/cars", "Explore Cars")}
          {user && nl("/add-car", "Add Car")}
          {user && nl("/my-bookings", "My Bookings")}
        </nav>

        {/* Right controls */}
        <div className="nav-right">
          <button className="icon-btn" onClick={toggle} title="Toggle theme">
            {dark ? "☀" : "☾"}
          </button>

          {user ? (
            <div className="avatar-wrap" ref={dropRef}>
              <button className="avatar-btn" onClick={() => setDropOpen(d => !d)}>
                <img src={avatar} alt="avatar" className="avatar-img" />
                <span className="avatar-name">{user.displayName?.split(" ")[0] || "Me"}</span>
                <span className="drop-caret">{dropOpen ? "▴" : "▾"}</span>
              </button>
              {dropOpen && (
                <div className="dropdown">
                  <div className="drop-user">
                    <strong>{user.displayName || "User"}</strong>
                    <small>{user.email}</small>
                  </div>
                  <Link to="/add-car" className="drop-item" onClick={() => setDropOpen(false)}>➕ Add Car</Link>
                  <Link to="/my-bookings" className="drop-item" onClick={() => setDropOpen(false)}>📋 My Bookings</Link>
                  <Link to="/my-cars" className="drop-item" onClick={() => setDropOpen(false)}>🚗 My Added Cars</Link>
                  <hr className="drop-hr" />
                  <button className="drop-item drop-logout" onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-nav-login">Login</Link>
          )}

          <button className="icon-btn hamburger" onClick={() => setMobileOpen(m => !m)}>
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-nav">
          {nl("/", "Home")}
          {nl("/cars", "Explore Cars")}
          {user && nl("/add-car", "Add Car")}
          {user && nl("/my-bookings", "My Bookings")}
          {user && nl("/my-cars", "My Added Cars")}
          {user
            ? <button className="mobile-link danger" onClick={handleLogout}>Logout</button>
            : <Link to="/login" className="mobile-link" onClick={() => setMobileOpen(false)}>Login / Register</Link>}
        </div>
      )}
    </header>
  );
};
export default Navbar;
