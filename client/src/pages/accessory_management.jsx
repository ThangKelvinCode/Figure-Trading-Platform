import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";

const AccessoryManagement = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    photo: "",
    type: "",
    owner: "",
  });

  const [accessories, setAccessories] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    try {
      const response = await fetch("http://localhost:3000/accessories/allAccessories");
      const data = await response.json();
      setAccessories(data);
    } catch (error) {
      console.error("Failed to fetch accessories:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAccessory = async () => {
    try {
      const response = await fetch("http://localhost:3000/accessories/postAccessories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("Response:", result);

      if (response.ok) {
        alert("Accessory added successfully!");
        setShowForm(false);
        fetchAccessories();
      } else {
        alert(`Failed to add accessory: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      alert("Error connecting to the server.");
      console.error("Error:", error);
    }
  };

  const handleDeleteAccessory = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        const response = await fetch(`http://localhost:3000/accessories/${id}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          alert("Sản phẩm đã được xóa thành công!");
          fetchAccessories();
        } else {
          alert("Lỗi: Không thể xóa sản phẩm.");
        }
      } catch (error) {
        alert("Lỗi kết nối đến server.");
        console.error("Lỗi:", error);
      }
    }
  };

  return (
    <Container>
      <h1 className="mt-4 mb-4 text-center">Accessory Management</h1>

      <div className="text-center mb-3">
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "+ Add New Accessory"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-3 mb-4">
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="name" onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Price ($)</Form.Label>
                  <Form.Control type="number" name="price" onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mt-2">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={2} name="description" onChange={handleChange} />
            </Form.Group>

            <Row className="mt-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Photo URL</Form.Label>
                  <Form.Control type="text" name="photo" onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Type ID</Form.Label>
                  <Form.Control type="text" name="type" onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Owner ID</Form.Label>
                  <Form.Control type="text" name="owner" onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Button className="mt-3" variant="success" onClick={handleAddAccessory}>
              Submit
            </Button>
          </Form>
        </Card>
      )}

      <h2 className="mt-4 mb-3 text-center">Accessory List</h2>
      <Row>
        {accessories.map((item) => (
          <Col key={item._id} md={4} sm={6} xs={12} className="mb-4">
            <Card className="shadow-sm">
              <Card.Img variant="top" src={item.photo} alt={item.name} style={{ height: "200px", objectFit: "cover" }} />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>
                  <strong>Price:</strong> ${item.price} <br />
                  <small>{item.description}</small>
                </Card.Text>
                <Button variant="outline-primary" size="sm">View Details</Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="ms-2"
                  onClick={() => handleDeleteAccessory(item._id)}
                >
                  Xóa
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AccessoryManagement;
