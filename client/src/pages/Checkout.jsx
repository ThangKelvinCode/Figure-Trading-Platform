import React from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

function Checkout() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/payment-result");
  };

  return (
    <div className="home-container">
      <h1>Welcome to MoMo Payment Demo</h1>
      <p>Click the button below to view a sample payment result.</p>
      <button className="redirect-button" onClick={handleRedirect}>
        View Payment Result
      </button>
    </div>
  );
}

export default Checkout;
