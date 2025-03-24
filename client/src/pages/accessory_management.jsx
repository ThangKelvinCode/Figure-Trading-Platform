import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Modal,
  Spinner,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";
import { Link } from "react-router-dom";

// Import Bootstrap Icons (cần cài đặt: npm install bootstrap-icons)
import "bootstrap-icons/font/bootstrap-icons.css";

// Hàm định dạng giá tiền theo VND
const formatPriceVND = (price) => {
  if (typeof price !== "number" || isNaN(price)) {
    console.warn("Invalid price value:", price);
    return "0đ";
  }

  const hasDecimal = price % 1 !== 0;
  const decimalPlaces = hasDecimal ? price.toString().split(".")[1]?.length || 0 : 0;

  return price.toLocaleString("vi-VN", {
    minimumFractionDigits: hasDecimal ? Math.min(decimalPlaces, 3) : 0,
    maximumFractionDigits: 3,
  }) + "đ";
};

const AccessoryManagement = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    photo: [],
    type: "",
    owner: "",
  });

  const [accessories, setAccessories] = useState([]);
  const [showModal, setShowModal] = useState(false); // Sử dụng Modal thay vì showForm
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/accessories/allAccessories");
      if (!response.ok) {
        throw new Error("Không thể tải danh sách phụ kiện.");
      }
      const data = await response.json();
      console.log("Fetched accessories:", data);
      setAccessories(data);
    } catch (error) {
      console.error("Failed to fetch accessories:", error);
      setError("Không thể tải danh sách phụ kiện: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadImageToFirebase = async (file) => {
    try {
      const storageRef = ref(storage, `accessories/${Date.now()}-${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      return downloadURL;
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      throw new Error("Không thể upload ảnh. Vui lòng thử lại: " + error.message);
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) {
      setError("Vui lòng chọn ít nhất một ảnh để upload.");
      return;
    }

    setLoading(true);
    setError(null);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const url = await uploadImageToFirebase(file);
        console.log("Uploaded image URL:", url);
        uploadedUrls.push(url);
      }
      setFormData((prev) => ({
        ...prev,
        photo: [...prev.photo, ...uploadedUrls],
      }));
      console.log("Updated formData.photo:", uploadedUrls);
    } catch (error) {
      setError(error.message);
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photo: prev.photo.filter((_, i) => i !== index),
    }));
  };

  const handleAddAccessory = async () => {
    if (!formData.name || !formData.price || !formData.type || !formData.owner) {
      setError("Vui lòng điền đầy đủ thông tin (Tên, Giá, Type ID, Owner ID).");
      return;
    }

    if (formData.photo.length === 0) {
      setError("Vui lòng upload ít nhất một ảnh.");
      return;
    }

    const priceAsNumber = parseFloat(formData.price);
    if (isNaN(priceAsNumber)) {
      setError("Giá tiền không hợp lệ. Vui lòng nhập số.");
      return;
    }

    const dataToSend = {
      ...formData,
      price: priceAsNumber,
    };

    console.log("Form data before sending:", dataToSend);

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/accessories/postAccessories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Không thể thêm phụ kiện.");
      }

      const result = await response.json();
      console.log("Response:", result);

      alert("Thêm phụ kiện thành công!");
      setShowModal(false);
      setFormData({
        name: "",
        description: "",
        price: "",
        photo: [],
        type: "",
        owner: "",
      });
      fetchAccessories();
    } catch (error) {
      setError("Lỗi kết nối đến server: " + error.message);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAccessory = (accessory) => {
    let photoArray = [];
    if (accessory.photo) {
      if (Array.isArray(accessory.photo)) {
        photoArray = accessory.photo;
      } else if (typeof accessory.photo === "string" && accessory.photo.length > 0) {
        photoArray = [accessory.photo];
      }
    }

    setFormData({
      name: accessory.name,
      description: accessory.description || "",
      price: accessory.price,
      photo: photoArray,
      type: accessory.type,
      owner: accessory.owner,
    });
    setEditId(accessory._id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleUpdateAccessory = async () => {
    if (!formData.name || !formData.price || !formData.type || !formData.owner) {
      setError("Vui lòng điền đầy đủ thông tin (Tên, Giá, Type ID, Owner ID).");
      return;
    }

    if (formData.photo.length === 0) {
      setError("Vui lòng upload ít nhất một ảnh.");
      return;
    }

    const priceAsNumber = parseFloat(formData.price);
    if (isNaN(priceAsNumber)) {
      setError("Giá tiền không hợp lệ. Vui lòng nhập số.");
      return;
    }

    const dataToSend = {
      ...formData,
      price: priceAsNumber,
    };

    console.log("Form data before updating:", dataToSend);

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/accessories/${editId}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Không thể cập nhật phụ kiện. Kiểm tra xem endpoint PUT /accessories/:id/edit có tồn tại không.");
      }

      const result = await response.json();
      console.log("Update response:", result);

      alert("Cập nhật phụ kiện thành công!");
      setShowModal(false);
      setEditMode(false);
      setEditId(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        photo: [],
        type: "",
        owner: "",
      });
      fetchAccessories();
    } catch (error) {
      setError("Lỗi kết nối đến server: " + error.message);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccessory = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/accessories/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData || "Không thể xóa sản phẩm.");
        }

        alert("Sản phẩm đã được xóa thành công!");
        fetchAccessories();
      } catch (error) {
        setError("Lỗi kết nối đến server: " + error.message);
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setEditId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      photo: [],
      type: "",
      owner: "",
    });
    setError(null);
  };

  return (
    <Container className="my-5">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="text-center">Accessory Management</h1>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => setShowModal(true)} disabled={loading}>
            <i className="bi bi-plus-circle me-2"></i> Add New Accessory
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading...</p>
        </div>
      ) : accessories.length === 0 ? (
        <Alert variant="info" className="text-center">
          Không có phụ kiện nào để hiển thị.
        </Alert>
      ) : (
        <Row>
          {accessories.map((item) => (
            <Col key={item._id} md={4} sm={6} xs={12} className="mb-4">
              <Card className="shadow-sm h-100" style={{ transition: "transform 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                {item.photo && Array.isArray(item.photo) && item.photo.length > 0 ? (
                  <Card.Img
                    variant="top"
                    src={item.photo[0]}
                    alt={item.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                ) : item.photo && typeof item.photo === "string" && item.photo.length > 0 ? (
                  <Card.Img
                    variant="top"
                    src={item.photo}
                    alt={item.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="text-center p-5"
                    style={{ height: "200px", backgroundColor: "#f8f9fa" }}
                  >
                    Không có ảnh
                  </div>
                )}
                <Card.Body>
                  <Card.Title className="text-truncate">{item.name}</Card.Title>
                  <Card.Text>
                    <strong>Price:</strong> {formatPriceVND(item.price)} <br />
                    <strong>Type ID:</strong> {item.type} <br />
                  </Card.Text>
                  <div className="d-flex justify-content-between">
                    <Link to={`/accessory/${item._id}`}>
                      <Button variant="outline-primary" size="sm">
                        <i className="bi bi-eye me-1"></i> View Details
                      </Button>
                    </Link>
                    <div>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditAccessory(item)}
                      >
                        <i className="bi bi-pencil-square me-1"></i> Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteAccessory(item._id)}
                      >
                        <i className="bi bi-trash me-1"></i> Delete
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Accessory" : "Add New Accessory"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          )}
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter accessory name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (đ)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.001"
                    placeholder="Enter price"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Upload Photos</Form.Label>
                  <Form.Control
                    type="file"
                    name="photo"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={loading}
                  />
                </Form.Group>

                {loading && (
                  <div className="text-center mb-3">
                    <Spinner animation="border" variant="primary" size="sm" />
                    <span className="ms-2">Đang upload ảnh...</span>
                  </div>
                )}

                <Row className="mb-3">
                  {Array.isArray(formData.photo) && formData.photo.length > 0 ? (
                    formData.photo.map((url, index) => (
                      <Col key={index} xs={4} className="mb-2 position-relative">
                        <img
                          src={url}
                          alt={`uploaded-${index}`}
                          style={{ width: "100%", borderRadius: "8px" }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0"
                          style={{ transform: "translate(50%, -50%)" }}
                          onClick={() => handleRemovePhoto(index)}
                        >
                          <i className="bi bi-x"></i>
                        </Button>
                      </Col>
                    ))
                  ) : (
                    <p className="text-muted">Chưa có ảnh nào được upload.</p>
                  )}
                </Row>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Type ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    placeholder="Enter Type ID"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Owner ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    placeholder="Enter Owner ID"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={loading}>
            Close
          </Button>
          {editMode ? (
            <Button
              variant="warning"
              onClick={handleUpdateAccessory}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Đang cập nhật...
                </>
              ) : (
                "Update Accessory"
              )}
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={handleAddAccessory}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Đang gửi...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AccessoryManagement;