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
import axios from "axios";

function Checkout() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get billing info and orderId from BillingInfo page via location.state
  const { state } = location;
  const {
    email = "",
    name = "",
    phone = "",
    address = "",
    productID = "N/A",
    quantity = 1,
    totalPrice = 10000,
    orderId = "", // Nhận orderId (id) từ state
  } = state || {};

  // Extract query parameters (optional fallback if not passed via state)
  const queryParams = new URLSearchParams(location.search);
  const productIdFromQuery = queryParams.get("productId") || productID;
  const quantityFromQuery = parseInt(queryParams.get("quantity"), 10) || quantity;
  const totalPriceFromQuery = parseInt(queryParams.get("totalPrice"), 10) || totalPrice;

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      // Kiểm tra xem orderId có tồn tại không
      if (!orderId) {
        throw new Error("Order ID is missing.");
      }

      const response = await axios({
        method: "POST",
        url: "http://localhost:3000/payment/create_momo",
        data: {
          amount: totalPriceFromQuery,
          orderId: orderId, // Sử dụng orderId từ backend
          email: email,
          fullName: name,
          phoneNumber: phone,
          address: address,
        },
        timeout: 10000,
      });

      console.log("MoMo Response:", response.data);

      if (response.data.payUrl) {
        window.location.href = response.data.payUrl;
      } else {
        setError("Failed to get payment URL from MoMo.");
      }
    } catch (error) {
      setError("An error occurred while processing the payment: " + error.message);
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
                  <span><strong>Email:</strong></span>
                  <span>{email || "N/A"}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span><strong>Full Name:</strong></span>
                  <span>{name || "N/A"}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span><strong>Phone Number:</strong></span>
                  <span>{phone || "N/A"}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span><strong>Address:</strong></span>
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
                  <span>Order ID:</span>
                  <span>{orderId || "N/A"}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Product ID:</span>
                  <span>{productIdFromQuery}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Quantity:</span>
                  <span>{quantityFromQuery}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span>{totalPriceFromQuery.toLocaleString("vi-VN")} VND</span>
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