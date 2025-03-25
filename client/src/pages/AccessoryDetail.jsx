import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Alert,
  Carousel,
  Card,
  Badge,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../config/axios"; // Import the configured axios instance

const AccessoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [attachedPhotos, setAttachedPhotos] = useState([]);

  useEffect(() => {
    if (!id || id === "undefined") {
      setError("⚠️ Lỗi: ID sản phẩm không hợp lệ.");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/accessories/${id}`);

        if (!response.data.accessory) {
          throw new Error("⚠️ API không tìm thấy sản phẩm này!");
        }

        setProduct(response.data.accessory);

        // Handle photos
        let photos = [];
        if (response.data.accessory?.photo) {
          if (Array.isArray(response.data.accessory.photo) && response.data.accessory.photo.length > 0) {
            photos = response.data.accessory.photo;
          } else if (typeof response.data.accessory.photo === "string" && response.data.accessory.photo.length > 0) {
            photos = [response.data.accessory.photo];
          }
        }
        setAttachedPhotos(photos);
        setError(null);
      } catch (err) {
        setError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedProducts = async () => {
      try {
        const response = await api.get("/accessories/allAccessories");
        const filteredProducts = response.data.filter((item) => item._id !== id);
        setRelatedProducts(filteredProducts.slice(0, 3));
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm liên quan:", err);
      }
    };

    fetchProduct();
    fetchRelatedProducts();
  }, [id, navigate]);

  const handleBuyNow = () => {
    if (!product) return;
    const totalPrice = product.price * quantity;
    navigate(`/checkout?productId=${id}&quantity=${quantity}&totalPrice=${totalPrice}`);
  };

  const handleQuantityChange = (value) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + value));
  };

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  const handleRelatedProductClick = (productId) => {
    navigate(`/accessory/${productId}`);
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
        <Col md={6}>
          {attachedPhotos.length > 0 ? (
            <Carousel
              activeIndex={activeIndex}
              onSelect={handleSelect}
              interval={null}
              className="shadow-sm rounded"
            >
              {attachedPhotos.map((photo, index) => (
                <Carousel.Item key={index}>
                  <img
                    src={photo}
                    alt={`${product.name}-${index}`}
                    className="d-block w-100 rounded"
                    style={{ maxHeight: "500px", objectFit: "contain" }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/500";
                    }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <div className="text-center">
              <img
                src="https://via.placeholder.com/500"
                alt="No image"
                className="img-fluid rounded"
                style={{ maxHeight: "500px", objectFit: "contain", width: "100%" }}
              />
              <p className="text-muted mt-2">❌ Không có hình ảnh</p>
            </div>
          )}

          {attachedPhotos.length > 1 && (
            <div className="d-flex flex-wrap gap-2 mt-3 justify-content-center">
              {attachedPhotos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`attached-${index}`}
                  className={`img-thumbnail rounded shadow-sm ${
                    activeIndex === index ? "border-primary" : ""
                  }`}
                  style={{ width: "80px", height: "80px", objectFit: "cover", cursor: "pointer" }}
                  onClick={() => setActiveIndex(index)}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80";
                  }}
                />
              ))}
            </div>
          )}
        </Col>
        <Col md={6}>
          <h2 className="mb-3">{product?.name || "🔍 Tên sản phẩm không có"}</h2>
          <div className="d-flex align-items-center mb-2">
            <h4 className="text-danger me-3">
              {product?.price ? product.price.toLocaleString() : "0"}đ
            </h4>
            <Badge bg="success">Còn hàng</Badge>
          </div>
          <div className="d-flex align-items-center mb-3">
            <span className="text-warning me-2">★★★★★</span>
            <span>(5 đánh giá)</span>
          </div>
          <Form className="d-flex align-items-center mb-3">
            <strong className="me-3">Số lượng:</strong>
            <Button variant="outline-secondary" onClick={() => handleQuantityChange(-1)}>
              -
            </Button>
            <Form.Control
              type="text"
              value={quantity}
              readOnly
              className="text-center mx-2"
              style={{ width: "50px" }}
            />
            <Button variant="outline-secondary" onClick={() => handleQuantityChange(1)}>
              +
            </Button>
          </Form>
          <Button
            variant="danger"
            className="w-100 mb-3"
            onClick={handleBuyNow}
          >
            🛒 MUA NGAY VỚI GIÁ {product?.price ? product.price.toLocaleString() : "0"}đ
          </Button>
          <div className="bg-light p-3 rounded">
            <p className="mb-1"><strong>Thương hiệu:</strong> POP MART</p>
            <p className="mb-1"><strong>SKU:</strong> PVNS344</p>
            <p className="mb-1"><strong>Gói đặt mua:</strong> 0866 777 320</p>
            <p className="mb-1"><strong>Sử dụng mã giảm phí ship:</strong> TẶNG CHO HÓA ĐƠN TỪ 1.000.000Đ</p>
            <p className="mb-0"><strong>Cam kết:</strong> 100% chính hãng</p>
          </div>
        </Col>
      </Row>

      {relatedProducts.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-4">Sản phẩm liên quan</h3>
          <Row>
            {relatedProducts.map((relatedProduct) => (
              <Col md={4} key={relatedProduct._id} className="mb-4">
                <Card
                  className="shadow-sm h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRelatedProductClick(relatedProduct._id)}
                >
                  <Card.Img
                    variant="top"
                    src={
                      relatedProduct.photo && relatedProduct.photo.length > 0
                        ? Array.isArray(relatedProduct.photo)
                          ? relatedProduct.photo[0]
                          : relatedProduct.photo
                        : "https://via.placeholder.com/300"
                    }
                    style={{ height: "200px", objectFit: "contain" }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300";
                    }}
                  />
                  <Card.Body>
                    <Card.Title className="text-truncate">{relatedProduct.name}</Card.Title>
                    <Card.Text className="text-danger">
                      {relatedProduct.price ? relatedProduct.price.toLocaleString() : "0"}đ
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Container>
  );
};

export default AccessoryDetail;