// import React, { useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Alert,
//   Spinner,
// } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import api from "../config/axios";

// function Checkout() {
//   const location = useLocation();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Get billing info and orderId from state
//   const { state } = location;
//   const {
//     email = "",
//     name = "",
//     phoneNumber = "",
//     address = "",
//     productId = "N/A",
//     orderId = "", // Order ID from state
//     quantity = 1,
//     totalPrice = 0,
//     detailId,
//   } = state || {};

//   const handlePayment = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       if (!orderId) {
//         throw new Error("❌ Order ID is missing.");
//       }

//       console.log(`🔍 Sending Payment Request to: http://localhost:3000/payment/create_momo/${orderId}`);

//       const response = await api.post(`http://localhost:3000/payment/create_momo/${orderId}`);

//       console.log("✅ MoMo Response:", response.data);

//       if (response.data.payUrl) {
//         window.location.href = response.data.payUrl;
//       } else {
//         setError("⚠️ Failed to get payment URL from MoMo.");
//       }
//     } catch (error) {
//       console.error("🚨 Payment Error:", error.response ? error.response.data : error.message);
//       setError("An error occurred while processing the payment: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="py-5">
//       <h1 className="text-center mb-5">Checkout</h1>
//       {error && (
//         <Alert variant="danger" className="text-center">
//           {error}
//         </Alert>
//       )}
//       <Row>
//         {/* Left Column: Billing Information */}
//         <Col md={7}>
//           <Card className="mb-4 shadow-sm border-0">
//             <Card.Body>
//               <Card.Title className="mb-4">Billing Information</Card.Title>
//               <div className="billing-details">
//                 <div className="d-flex justify-content-between mb-3">
//                   <span><strong>Email:</strong></span>
//                   <span>{email || "N/A"}</span>
//                 </div>
//                 <div className="d-flex justify-content-between mb-3">
//                   <span><strong>Full Name:</strong></span>
//                   <span>{name || "N/A"}</span>
//                 </div>
//                 <div className="d-flex justify-content-between mb-3">
//                   <span><strong>Phone Number:</strong></span>
//                   <span>{phoneNumber || "N/A"}</span>
//                 </div>
//                 <div className="d-flex justify-content-between mb-3">
//                   <span><strong>Address:</strong></span>
//                   <span>{address || "N/A"}</span>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* Right Column: Order Summary */}
//         <Col md={5}>
//           <Card className="shadow-sm border-0">
//             <Card.Body>
//               <Card.Title className="mb-4">Order Summary</Card.Title>
//               <div className="order-details">
//                 <div className="d-flex justify-content-between mb-2">
//                   <span><strong>Order ID:</strong></span>
//                   <span>{orderId || "N/A"}</span>
//                 </div>
//                 <div className="d-flex justify-content-between mb-2">
//                   <span><strong>Product ID:</strong></span>
//                   <span>{productId || "N/A"}</span>
//                 </div>
//                 <div className="d-flex justify-content-between mb-2">
//                   <span><strong>Quantity:</strong></span>
//                   <span>{quantity}</span>
//                 </div>
//                 <hr />
//                 <div className="d-flex justify-content-between fw-bold">
//                   <span>Total:</span>
//                   <span>{totalPrice.toLocaleString("vi-VN")} VND</span>
//                 </div>
//               </div>
//               <Button
//                 variant="primary"
//                 onClick={handlePayment}
//                 disabled={loading}
//                 className="w-100 mt-3"
//               >
//                 {loading ? (
//                   <>
//                     <Spinner animation="border" size="sm" className="me-2" />
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <i className="bi bi-wallet2 me-2"></i> Pay with MoMo
//                   </>
//                 )}
//               </Button>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default Checkout;

import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useLocation } from "react-router-dom";
import api from "../config/axios"; // Import axios config

function Checkout() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get billing info and orderId from state
  const { state } = location;
  const {
    email = "",
    name = "",
    phoneNumber = "",
    address = "",
    productId = "N/A",
    orderId = "", // Order ID from state
    quantity = 1,
    totalPrice = 0,
    detailId,
  } = state || {};

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!orderId) {
        throw new Error("❌ Order ID is missing.");
      }

      console.log(`🔍 Sending Payment Request for orderId: ${orderId}`);

      // Gọi API POST /payment/create_momo/:orderId để tạo URL thanh toán MoMo
      const response = await api.post(`/payment/create_momo/${orderId}`);

      console.log("✅ MoMo Response:", response.data);

      if (response.data.payUrl) {
        window.location.href = response.data.payUrl;
      } else {
        setError("⚠️ Failed to get payment URL from MoMo.");
      }
    } catch (error) {
      console.error("🚨 Payment Error:", error.response?.data?.message || error.message);
      setError(
        "An error occurred while processing the payment: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Checkout</h1>
      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}
      <Row>
        {/* Left Column: Billing Information */}
        <Col md={7}>
          <Card className="mb-4 shadow-sm border-0">
            <Card.Body>
              <Card.Title className="mb-4">Billing Information</Card.Title>
              <div className="billing-details">
                <div className="d-flex justify-content-between mb-3">
                  <span>
                    <strong>Email:</strong>
                  </span>
                  <span>{email || "N/A"}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>
                    <strong>Full Name:</strong>
                  </span>
                  <span>{name || "N/A"}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>
                    <strong>Phone Number:</strong>
                  </span>
                  <span>{phoneNumber || "N/A"}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>
                    <strong>Address:</strong>
                  </span>
                  <span>{address || "N/A"}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column: Order Summary */}
        <Col md={5}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="mb-4">Order Summary</Card.Title>
              <div className="order-details">
                <div className="d-flex justify-content-between mb-2">
                  <span>
                    <strong>Order ID:</strong>
                  </span>
                  <span>{orderId || "N/A"}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>
                    <strong>Product ID:</strong>
                  </span>
                  <span>{productId || "N/A"}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>
                    <strong>Quantity:</strong>
                  </span>
                  <span>{quantity}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span>{totalPrice.toLocaleString("vi-VN")} VND</span>
                </div>
              </div>
              <Button
                variant="primary"
                onClick={handlePayment}
                disabled={loading}
                className="w-100 mt-3"
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-wallet2 me-2"></i> Pay with MoMo
                  </>
                )}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Checkout;