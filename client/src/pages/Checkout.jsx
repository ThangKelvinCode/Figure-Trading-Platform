import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import axios from "axios";
import '../assets/css/Checkout.css'; // Import custom CSS

function Checkout() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Get billing info from BillingInfo page via location.state
  const { state } = location;
  const {
    email = "",
    fullName = "",
    phoneNumber = "",
    address = "",
    productID = "N/A",
    quantity = 1,
    totalPrice = 10000, // Default to 10000 if not provided
  } = state || {};

  // Extract query parameters (optional fallback if not passed via state)
  const queryParams = new URLSearchParams(location.search);
  const productIdFromQuery = queryParams.get("productId") || productID;
  const quantityFromQuery = parseInt(queryParams.get("quantity"), 10) || quantity;
  const totalPriceFromQuery = parseInt(queryParams.get("totalPrice"), 10) || totalPrice;

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await axios({
        method: "POST",
        url: "http://localhost:3000/payment/create_momo",
        data: {
          amount: totalPriceFromQuery * 1000, // Convert to VND
          orderId: '123fwcw',
          email: email,
          fullName: fullName,
          phoneNumber: phoneNumber,
          address: address
        },
      });

      console.log(response.data);

      if (response.data.payUrl) {
        window.location.href = response.data.payUrl; // Redirect to MoMo payment page
      } else {
        alert("Failed to get payment URL");
      }
    } catch (error) {
      alert("An error occurred while processing the payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="checkout-page py-5">
      <h1 className="text-center mb-5">Checkout</h1>
      <Row>
        {/* Left Column: Billing Information (Display Only) */}
        <Col md={7}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Billing Information</Card.Title>
              <div className="billing-details">
                <div className="d-flex justify-content-between mb-3">
                  <span>Email:</span>
                  <span>{email}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Full Name:</span>
                  <span>{fullName}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Phone Number:</span>
                  <span>{phoneNumber}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Address:</span>
                  <span>{address}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column: Order Summary */}
        <Col md={5}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <div className="order-details">
                <div className="d-flex justify-content-between">
                  <span>Product ID:</span>
                  <span>{productIdFromQuery}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Quantity:</span>
                  <span>{quantityFromQuery}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span>{(totalPriceFromQuery * 1000).toLocaleString('vi-VN')} VND</span>
                </div>
              </div>
              <Button
                variant="primary"
                onClick={handlePayment}
                disabled={loading}
                className="w-100 mt-3 pay-button"
              >
                {loading ? "Processing..." : "Pay with MoMo"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Checkout;