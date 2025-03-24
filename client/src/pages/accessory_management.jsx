import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Alert } from "react-bootstrap";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";
import { Link } from "react-router-dom";

// Hàm định dạng giá tiền theo VND
const formatPriceVND = (price) => {
  if (typeof price !== "number" || isNaN(price)) {
    console.warn("Invalid price value:", price);
    return "0đ";
  }

  // Kiểm tra xem giá có phần thập phân không
  const hasDecimal = price % 1 !== 0;
  const decimalPlaces = hasDecimal
    ? price.toString().split(".")[1]?.length || 0
    : 0;

  return price.toLocaleString("vi-VN", {
    minimumFractionDigits: hasDecimal ? Math.min(decimalPlaces, 3) : 0, // Hiển thị số chữ số thập phân thực tế, tối đa 3
    maximumFractionDigits: 3, // Hiển thị tối đa 3 chữ số thập phân
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
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    try {
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

  const handleAddAccessory = async () => {
    if (!formData.name || !formData.price || !formData.type || !formData.owner) {
      setError("Vui lòng điền đầy đủ thông tin (Tên, Giá, Type ID, Owner ID).");
      return;
    }

    if (formData.photo.length === 0) {
      setError("Vui lòng upload ít nhất một ảnh.");
      return;
    }

    // Chuyển đổi price thành số trước khi gửi
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
      setShowForm(false);
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
    setShowForm(true);
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

    // Chuyển đổi price thành số trước khi gửi
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
      setShowForm(false);
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
      }
    }
  };

  return (
    <Container>
      <h1 className="mt-4 mb-4 text-center">Accessory Management</h1>

      <div className="text-center mb-3">
        <Button
          variant="primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditMode(false);
            setFormData({
              name: "",
              description: "",
              price: "",
              photo: [],
              type: "",
              owner: "",
            });
          }}
          disabled={loading}
        >
          {showForm ? "Close Form" : "+ Add New Accessory"}
        </Button>
      </div>

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {showForm && (
        <Card className="p-3 mb-4">
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Price (đ)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.001" // Cho phép nhập số thập phân với tối đa 3 chữ số
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mt-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Row className="mt-2">
              <Col md={6}>
                <Form.Group>
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

                {loading && <p className="text-center mt-2">Đang upload ảnh...</p>}

                <Row className="mt-2">
                  {Array.isArray(formData.photo) && formData.photo.length > 0 ? (
                    formData.photo.map((url, index) => (
                      <Col key={index} md={4} className="mb-2">
                        <img
                          src={url}
                          alt={`uploaded-${index}`}
                          style={{ width: "100%", borderRadius: "8px" }}
                        />
                      </Col>
                    ))
                  ) : (
                    <p className="text-muted mt-2">Chưa có ảnh nào được upload.</p>
                  )}
                </Row>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Type ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Owner ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {editMode ? (
              <Button
                className="mt-3"
                variant="warning"
                onClick={handleUpdateAccessory}
                disabled={loading}
              >
                {loading ? "Đang cập nhật..." : "Update Accessory"}
              </Button>
            ) : (
              <Button
                className="mt-3"
                variant="success"
                onClick={handleAddAccessory}
                disabled={loading}
              >
                {loading ? "Đang gửi..." : "Submit"}
              </Button>
            )}
          </Form>
        </Card>
      )}

      <h2 className="mt-4 mb-3 text-center">Accessory List</h2>
      <Row>
        {accessories.length > 0 ? (
          accessories.map((item) => (
            <Col key={item._id} md={4} sm={6} xs={12} className="mb-4">
              <Card className="shadow-sm">
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
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>
                    <strong>Price:</strong> {formatPriceVND(item.price)} <br />
                    <strong>Type ID:</strong> {item.type} <br />
                  </Card.Text>
                  <Link to={`/accessory/${item._id}`}>
                    <Button variant="outline-primary" size="sm">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="ms-2"
                    onClick={() => handleEditAccessory(item)}
                  >
                    Edit
                  </Button>
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
          ))
        ) : (
          <Col>
            <p className="text-center">Không có phụ kiện nào để hiển thị.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default AccessoryManagement;