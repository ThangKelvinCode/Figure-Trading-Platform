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
  const location = useLocation(); // Get location object

  // Parse query params inside the component
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("productId") || "N/A";
  const quantity = parseInt(queryParams.get("quantity"), 10) || 1;
  const totalPrice = parseInt(queryParams.get("totalPrice"), 10) || 10000;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      console.log("Form Submitted:", formData);
      const checkoutData = {
        ...formData,
        productID: productId,
        quantity: quantity,
        totalPrice: totalPrice,
      };
      // Navigate to /checkout with the data
      navigate("/checkout", { state: checkoutData });
    } catch (err) {
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
                    placeholder="Enter your phone number"
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