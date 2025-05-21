"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.jsx"
import "./Navbar.css"

const Navbar = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const isActive = (path) => {
    return location.pathname === path ? "active" : ""
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Association
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <span className={`menu-icon-bar ${menuOpen ? "open" : ""}`}></span>
          <span className={`menu-icon-bar ${menuOpen ? "open" : ""}`}></span>
          <span className={`menu-icon-bar ${menuOpen ? "open" : ""}`}></span>
        </div>

        <ul className={menuOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link to="/" className={`nav-link ${isActive("/")}`} onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/events" className={`nav-link ${isActive("/events")}`} onClick={() => setMenuOpen(false)}>
              Events
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/discussions"
              className={`nav-link ${isActive("/discussions")}`}
              onClick={() => setMenuOpen(false)}
            >
              Discussions
            </Link>
          </li>

          {currentUser ? (
            <>
              <li className="nav-item">
                <Link to="/profile" className={`nav-link ${isActive("/profile")}`} onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className={`nav-link ${isActive("/login")}`} onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className={`nav-link ${isActive("/register")}`} onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
