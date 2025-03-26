import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../config/axios"; // Import axios config
import { useEffect } from "react";

function PaymentFailure() {
  const navigate = useNavigate();

  useEffect(async () => {
    const orderID = useParams("orderId")

    const updateOrderStatus = await api.post(`/${orderID}/updateStatus`, {
      newStatus: 2
    })
    console.log(updateOrderStatus)
  })

  const handleReturnHome = () => {
    navigate("/"); // Redirect to home page
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: "8rem",
          color: "#f44336", // Red color for X
          marginBottom: "20px",
        }}
      >
        ✘
      </div>
      <h1
        style={{
          fontSize: "2.5rem",
          color: "#333",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        Your purchase has encountered an unexpected error.
      </h1>
      <button
        onClick={handleReturnHome}
        style={{
          padding: "12px 24px",
          fontSize: "1.2rem",
          backgroundColor: "#ff4d4f", // MoMo red for consistency
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#e63946")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#ff4d4f")}
      >
        Return to Home
      </button>
    </div>
  );
}

export default PaymentFailure;