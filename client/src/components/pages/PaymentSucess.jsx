import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PaymentSuccess.css";

function PaymentSuccess() {
  const [paymentData, setPaymentData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("orderId");

    if (!orderId) {
      navigate("/"); // Redirect to home if no orderId
      return;
    }

    const fetchTransactionStatus = async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/payment/status", { orderId });
        const { resultCode, orderId: fetchedOrderId, amount } = response.data;

        if (resultCode === 0) {
          setPaymentData({
            orderId: fetchedOrderId,
            amount,
          });
        } else {
          navigate("/"); // Redirect if not successful
        }
      } catch (error) {
        console.error("Error fetching transaction status:", error);
        setPaymentData({
          orderId,
          amount: 50000, // Fallback
        });
      }
    };

    fetchTransactionStatus();
  }, [location, navigate]);

  const handleReturnHome = () => {
    navigate("/");
  };

  if (!paymentData) return <div>Loading...</div>;

  return (
    <div className="payment-success-container">
      <div className="success-header">
        <span className="checkmark">✔</span>
        <h1>Payment Successful!</h1>
      </div>
      <div className="bill-details">
        <h2>Transaction Details</h2>
        <div className="bill-item">
          <span className="label">Order ID:</span>
          <span className="value">{paymentData.orderId}</span>
        </div>
        <div className="bill-item">
          <span className="label">Amount:</span>
          <span className="value">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(paymentData.amount)}
          </span>
        </div>
      </div>
      <div className="action-container">
        <button className="home-button" onClick={handleReturnHome}>
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;