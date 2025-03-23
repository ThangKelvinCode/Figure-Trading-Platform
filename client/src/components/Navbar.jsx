import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import "../assets/css/Navbar.css";
import { useAuth } from "../context/auth.jsx";
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";
import Logoutwindow from "./Logoutwindow.jsx";
import { RegisterButton } from "./RegisterButton";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const { isLoggedIn, username, role, logout } = useAuth();
  console.log("Navbar auth state:", { isLoggedIn, username, role });

  const handleLogout = () => {
    setShowLogoutPopup(false);
    logout();
  };

  return (
    <nav>
      <Link to="/" className="title">
        Website
      </Link>

      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={menuOpen ? "open" : ""}>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/Accessory"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Accessory
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/tradelist"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Trade
          </NavLink>
        </li>

        {isLoggedIn && (role || "user").toLowerCase().trim() === "admin" && (
          <>
            <li>
              <NavLink
                to="/user_management"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                User Manage
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/accessory_management"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Accessory Manage
              </NavLink>
            </li>
          </>
        )}

        {isLoggedIn ? (
          <li className="user">
            <span className="account">
              <FaUser /> @{username}
            </span>
            <LogoutButton onClick={() => setShowLogoutPopup(true)} />
          </li>
        ) : (
          <>
            <li>
              <LoginButton />
            </li>
            <li>
              <RegisterButton />
            </li>
          </>
        )}
      </ul>

      {showLogoutPopup && (
        <Logoutwindow
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutPopup(false)}
        />
      )}
    </nav>
  );
};
