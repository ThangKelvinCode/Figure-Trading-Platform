// components/LogoutWindow.jsx
import React from "react";
import "../assets/css/Navbar.css"; // Ensure this CSS file includes the necessary styles

const Logoutwindow = ({ onConfirm, onCancel }) => {
  return (
    <div className="logout_popup">
      <div className="logout_window">
        <h3>Confirm Logout</h3>
        <p>Are you sure you want to log out?</p>
        <div className="popup_button">
          <button onClick={onConfirm}>Yes, Log out</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Logoutwindow;
