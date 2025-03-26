import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  Pagination,
  Row,
  Spinner,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import api from "../config/axios"; // Import the configured axios instance

// Hàm định dạng số kiểu double, giữ nguyên phần thập phân
const toLocaleDouble = (number) => {
  if (typeof number !== "number") return "0đ";

  return (
    number.toLocaleString("vi-VN", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + "đ"
  );
};

const Accessory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [typeIds, setTypeIds] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/accessories/allAccessories");
        // const response = await fetch("http://localhost:3000/accessories/allCategories", {
        //   method: "GET"
        // })
        if (!Array.isArray(response.data)) {
          throw new Error("Dữ liệu từ API không hợp lệ!");
        }

        setProducts(response.data);
        
        // Get unique Type IDs
        const uniqueTypeIds = [...new Set(response.data.map((product) => product.type))];
        setTypeIds(uniqueTypeIds);

        // Set initial filtered products
        setFilteredProducts(response.data);

        // Calculate total pages
        const totalCount = response.data.length;
        setTotalPages(Math.ceil(totalCount / productsPerPage));
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu từ API:", err);
        setError("Lỗi khi tải dữ liệu: " + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products when Type ID or products change
  useEffect(() => {
    let filtered = products;
    if (selectedTypeId) {
      filtered = products.filter((product) => product.type === selectedTypeId);
    }

    setFilteredProducts(filtered);
    const totalCount = filtered.length;
    setTotalPages(Math.ceil(totalCount / productsPerPage));
    setCurrentPage(1);
  }, [selectedTypeId, products]);

  const handleProductClick = (product) => {
    if (!product || !product._id) {
      console.error("🚨 Không thể điều hướng! ID sản phẩm không tồn tại:", product);
      return;
    }
    navigate(`/accessory/${product._id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate products for current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Danh sách phụ kiện</h2>

      {/* Type ID Filter */}
      <Row className="mb-4">
        <Col md={3}>
          <Form.Group>
            <Form.Label>
              <strong>Sorted By Category:</strong>
            </Form.Label>
            <DropdownButton
              id="dropdown-type-id"
              title={selectedTypeId || "Tất cả"}
              variant="outline-primary"
              onSelect={(typeId) =>
                setSelectedTypeId(typeId === "all" ? "" : typeId)
              }
            >
              <Dropdown.Item eventKey="all">Tất cả</Dropdown.Item>
              {typeIds.map((typeId) => (
                <Dropdown.Item key={typeId} eventKey={typeId}>
                  {typeId}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Form.Group>
        </Col>
      </Row>

      {/* Product Display */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">⏳ Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : currentProducts.length === 0 ? (
        <Alert variant="info" className="text-center">
          Không có sản phẩm nào phù hợp với bộ lọc.
        </Alert>
      ) : (
        <Row>
          {currentProducts.map((product, index) => {
            let photoUrl = "https://via.placeholder.com/200";
            if (product.photo) {
              if (Array.isArray(product.photo) && product.photo.length > 0) {
                photoUrl = product.photo[0];
              } else if (typeof product.photo === "string" && product.photo.length > 0) {
                photoUrl = product.photo;
              }
            }

            return (
              <Col md={4} key={product._id || `product-${index}`} className="mb-4">
                <Card
                  className="shadow-sm h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleProductClick(product)}
                >
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "200px", overflow: "hidden" }}
                  >
                    <Card.Img
                      variant="top"
                      src={photoUrl}
                      alt={product.name}
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/200";
                      }}
                    />
                  </div>
                  <Card.Body className="text-center">
                    <Card.Title className="text-truncate">{product.name}</Card.Title>
                    <Card.Text className="text-danger">
                      {toLocaleDouble(product.price)}
                    </Card.Text>
                    <Button variant="outline-primary" size="sm">
                      Xem chi tiết
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={`page-${index}`}
                active={currentPage === index + 1}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}
    </Container>
  );
};

export default Accessory;