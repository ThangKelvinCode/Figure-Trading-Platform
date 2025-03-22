import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import axios from "axios";

function Checkout() {
  const location = useLocation();

//   // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("productId");
  const quantity = parseInt(queryParams.get("quantity"), 10);
  const totalPrice = parseInt(queryParams.get("totalPrice"), 10);

//   // const paymentData = {
//   //   partnerCode: "MOMO",
//   //   orderId: "MOMO1742289263055",
//   //   requestId: "MOMO1742289263055",
//   //   amount: totalPrice * 1000,
//   //   responseTime: 1742289262649,
//   //   message: "Thành công.",
//   //   resultCode: 0,
//   //   payUrl:
//   //     "https://test-payment.momo.vn/v2/gateway/pay?t=TU9NT3xNT01PMTc0MjI4OTI2MzA1NQ&s=c1dca9c589dda76152fc7855b569d5903835e666c550303feb75ce1a9971eb07",
//   //   shortLink: "https://test-payment.momo.vn/shortlink/YI3PfGqnl5",
//   // };
//   // Your component making the API call
  
// const handlePayment = async () => {
//   try {
//     const response = await fetch('http://localhost:3000/payment/create_momo', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         amount: 10000,
//         orderId: "67af6d45efd963779dfa5f84"
//       })
//     });
    
//     const paymentData = await response.json();
//     // Redirect to payment page
//     navigate('/payment-redirect');
//   } catch (error) {
//     console.error('Payment initiation failed:', error);
//   }
// };

//   const handlePayUrlClick = () => {
//     window.open(paymentData.payUrl, "_blank", "noopener,noreferrer");
//     handlePayment();
//   };

//   return (
//     <div className="payment-result-container">
//       <h1>Payment Receipt</h1>
//       <div className="bill-details">
//         <h2>Transaction Summary</h2>
//         <div className="bill-item">
//           <span className="label">Order ID:</span>
//           <span className="value">{paymentData.orderId}</span>
//         </div>
//         <div className="bill-item">
//           <span className="label">Amount:</span>
//           <span className="value">
//             {new Intl.NumberFormat("vi-VN", {
//               style: "currency",
//               currency: "VND",
//             }).format(paymentData.amount)}
//           </span>
//         </div>
//         <div className="pay-button-container">
//           <button className="pay-button" onClick={handlePayUrlClick}>
//             Proceed to Payment
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// function MomoPayment() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await axios({
        method: "POST",
        url: "http://localhost:3000/payment/create_momo",
        data: {
          amount: 10000,
          orderId: '123wfewcacdw',
        },
      });

      console.log(response.data);

      if (response.data.payUrl) {
        window.location.href = response.data.payUrl; // Redirect to MoMo payment page
      } else {
        alert("Failed to get payment URL");
      }
    } catch (error) {
      // console.error("Payment request failed", error);
      alert("An error occurred while processing the payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">MoMo Payment</h1>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay with MoMo"}
      </button>
    </div>
  );
}

 export default Checkout;
