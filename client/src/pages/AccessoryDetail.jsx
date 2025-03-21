import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";

const AccessoryDetail = () => {
  const { id } = useParams(); // Lấy 'id' từ URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 ID từ useParams:", id); // Debug giá trị id

    // Kiểm tra nếu ID không hợp lệ
    if (!id || id === "undefined") {
      setError("⚠️ Lỗi: ID sản phẩm không hợp lệ.");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log("📡 Gửi request đến API với ID:", id);

        const response = await fetch(`http://localhost:3000/accessories/${id}`);
        
        if (!response.ok) {
          throw new Error("⚠️ Sản phẩm không tồn tại hoặc lỗi server.");
        }

        const data = await response.json();

        // Kiểm tra nếu API trả về `accessory: null`
        if (!data.accessory) {
          throw new Error("⚠️ API không tìm thấy sản phẩm này!");
        }

        setProduct(data.accessory);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  

  const handleBuyNow = () => {
    if (!product) return;
    const totalPrice = product?.price * quantity;
    navigate(`/checkout?productId=${id}&quantity=${quantity}&totalPrice=${totalPrice}`);
  };

  const handleQuantityChange = (value) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + value)); // Không cho số lượng <1
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <p>⏳ Đang tải sản phẩm...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col md={5}>
          {product?.photo ? (
            <img src={product.photo} alt={product.name} className="img-fluid" />
          ) : (
            <p>❌ Không có hình ảnh</p>
          )}
        </Col>
        <Col md={7}>
          <h2>{product?.name || "🔍 Tên sản phẩm không có"}</h2>
          <h4 className="text-danger">
            {product?.price ? product.price.toLocaleString() : "0"}đ
          </h4>
          <Form className="d-flex align-items-center">
            <strong className="me-3">Số lượng:</strong>
            <Button variant="outline-secondary" onClick={() => handleQuantityChange(-1)}>-</Button>
            <Form.Control
              type="text"
              value={quantity}
              readOnly
              className="text-center mx-2"
              style={{ width: "50px" }}
            />
            <Button variant="outline-secondary" onClick={() => handleQuantityChange(1)}>+</Button>
          </Form>
          <Button className="mt-3 w-100 bg-black text-white" onClick={handleBuyNow}>
            🛒 MUA NGAY VỚI GIÁ {product?.price ? product.price.toLocaleString() : "0"}đ
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default AccessoryDetail;
