import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import axios from "axios";
import '../assets/css/Checkout.css'; // Import custom CSS

function Checkout() {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("productId") || "N/A";
  const quantity = parseInt(queryParams.get("quantity"), 10) || 1;
  const totalPrice = parseInt(queryParams.get("totalPrice"), 10) || 10000; // Default to 10000 if not provided

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await axios({
        method: "POST",
        url: "http://localhost:3000/payment/create_momo",
        data: {
          amount: totalPrice * 1000, // Convert to VND
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
      // console.error("Payment request failed", error);
      alert("An error occurred while processing the payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="checkout-page py-5">
      <h1 className="text-center mb-5">Checkout</h1>
      <Row>
        {/* Left Column: Billing Information */}
        <Col md={7}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Billing Information</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your address"
                    required
                  />
                </Form.Group>
              </Form>
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
                  <span>{productId}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Quantity:</span>
                  <span>{quantity}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span>{(totalPrice * 1000).toLocaleString('vi-VN')} VND</span>
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