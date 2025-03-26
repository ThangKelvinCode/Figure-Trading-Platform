import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PaymentProcessing() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("orderId");
    const resultCode = parseInt(queryParams.get("resultCode"), 10); // Convert to integer

    if (!orderId || isNaN(resultCode)) {
      console.error("Missing or invalid orderId/resultCode in redirect URL");
      navigate("/"); // Redirect to home if parameters are missing/invalid
      return;
    }

    // Check resultCode and redirect accordingly
    if (resultCode === 0) {
      navigate(`/payment-success?orderId=${orderId}`); // thanh toan thanh cong
    } else {
      navigate(`/payment-failure?orderId=${orderId}`); // thanh toan that bai
    }
  }, [location, navigate]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Processing Your Payment...</h1>
      <p>Please wait while we verify your transaction.</p>
    </div>
  );
}

export default PaymentProcessing;