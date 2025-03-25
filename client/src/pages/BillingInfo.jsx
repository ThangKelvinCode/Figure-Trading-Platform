import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  Spinner,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate, useLocation } from "react-router-dom";

const BillingInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy query params từ URL
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("productId") || "N/A";
  const quantity = parseInt(queryParams.get("quantity"), 10) || 1;
  const totalPrice = parseInt(queryParams.get("totalPrice"), 10) || 10000;

  // Giả sử bạn có userId (lấy từ context, localStorage, hoặc authentication)
  const userId = "67f645e5df963779af5f84"; // Thay thế bằng userId thực tế

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Kiểm tra dữ liệu trước khi gửi
      if (!formData.name || !formData.email || !formData.phone || !formData.address) {
        throw new Error("Please fill in all required fields.");
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error("Invalid email address.");
      }
      if (!/^\d{10}$/.test(formData.phone)) {
        throw new Error("Invalid phone number. Please enter a 10-digit phone number.");
      }
      if (!productId || productId === "N/A") {
        throw new Error("Invalid product ID.");
      }

      // Chuẩn bị dữ liệu gửi đi
      const bodyData = {
        userId: userId,
        quantity: quantity,
        totalPrice: totalPrice,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      };

      // Log dữ liệu gửi đi
      console.log("Data sent to API:", bodyData);

      // Gửi thông tin đơn hàng đến API /accessories/{id}/purchase
      const response = await fetch(`http://localhost:3000/accessories/${productId}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Request failed with status code ${response.status}`);
      }

      const data = await response.json();
      const { id, quantity: returnedQuantity } = data; // Nhận id (orderId) và quantity từ backend
      console.log("Received from Backend:", { id, quantity: returnedQuantity });

      // Truyền thông tin đơn hàng, id (orderId), và quantity sang Checkout
      const checkoutData = {
        ...formData,
        productID: productId,
        quantity: returnedQuantity,
        totalPrice: totalPrice,
        orderId: id,
      };
      navigate("/checkout", { state: checkoutData });
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError("Không thể gửi thông tin: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h2 className="text-center mb-4">Billing Info</h2>
              {error && (
                <Alert variant="danger" className="text-center">
                  {error}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number (e.g., 0938239032)"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button
                    variant="success"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BillingInfo;