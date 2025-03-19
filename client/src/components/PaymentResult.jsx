import React from "react";
import "../assets/css/PaymentResult.css";

function PaymentResult() {
  const paymentData = {
    partnerCode: "MOMO",
    orderId: "MOMO1742289263055",
    requestId: "MOMO1742289263055",
    amount: 50000,
    responseTime: 1742289262649,
    message: "Thành công.",
    resultCode: 0,
    payUrl:
      "https://test-payment.momo.vn/v2/gateway/pay?t=TU9NT3xNT01PMTc0MjI4OTI2MzA1NQ&s=c1dca9c589dda76152fc7855b569d5903835e666c550303feb75ce1a9971eb07",
    shortLink: "https://test-payment.momo.vn/shortlink/YI3PfGqnl5",
  };
  const handlePayUrlClick = () => {
    window.open(paymentData.payUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="payment-result-container">
      <h1>Payment Receipt</h1>
      <div className="bill-details">
        <h2>Transaction Summary</h2>
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
        <div className="pay-button-container">
          <button className="pay-button" onClick={handlePayUrlClick}>
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentResult;