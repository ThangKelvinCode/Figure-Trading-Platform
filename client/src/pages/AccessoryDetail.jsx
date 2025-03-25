import "bootstrap/dist/css/bootstrap.min.css";
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
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Hàm định dạng số kiểu double, giữ nguyên phần thập phân
const toLocaleDouble = (number) => {
  if (typeof number !== "number") return "0đ";

  // Luôn hiển thị ít nhất 1 chữ số thập phân, khớp với kiểu double của backend
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
  const [typeIds, setTypeIds] = useState([]); // Danh sách Type ID duy nhất
  const [selectedTypeId, setSelectedTypeId] = useState(""); // Type ID được chọn
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 9; // Số sản phẩm mỗi trang
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/accessories/allAccessories`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Dữ liệu từ API không hợp lệ!");
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu từ API không hợp lệ!");
        }

        // Lưu danh sách sản phẩm
        setProducts(data);

        // Lấy danh sách Type ID duy nhất
        const uniqueTypeIds = [...new Set(data.map((product) => product.type))];
        setTypeIds(uniqueTypeIds);

        // Lọc sản phẩm ban đầu (hiển thị tất cả)
        setFilteredProducts(data);

        // Tính tổng số trang
        const totalCount = data.length;
        setTotalPages(Math.ceil(totalCount / productsPerPage));
        setLoading(false);
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu từ API:", err);
        setError("Lỗi khi tải dữ liệu!");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Lọc sản phẩm khi Type ID hoặc trang thay đổi
  useEffect(() => {
    let filtered = products;
    if (selectedTypeId) {
      filtered = products.filter((product) => product.type === selectedTypeId);
    }

    setFilteredProducts(filtered);

    // Cập nhật tổng số trang sau khi lọc
    const totalCount = filtered.length;
    setTotalPages(Math.ceil(totalCount / productsPerPage));
    setCurrentPage(1); // Reset về trang 1 khi lọc
  }, [selectedTypeId, products]);

  const handleProductClick = (product) => {
    if (!product || !product._id) {
      console.error("🚨 Không thể điều hướng! ID sản phẩm không tồn tại:", product);
      return;
    }

    console.log("🛒 Điều hướng đến sản phẩm với ID:", product._id);
    navigate(`/accessory/${product._id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Tính toán sản phẩm hiển thị trên trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Danh sách phụ kiện</h2>

      {/* Bộ lọc Type ID */}
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

      {/* Hiển thị sản phẩm */}
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
            console.log(`Rendering Product ${index + 1}:`, product);
            console.log(`Rendering Photo: ${product.photo}`);

            // Xác định URL ảnh để hiển thị
            let photoUrl = "https://via.placeholder.com/200"; // Ảnh placeholder mặc định
            if (product.photo) {
              if (Array.isArray(product.photo) && product.photo.length > 0) {
                photoUrl = product.photo[0]; // Lấy ảnh đầu tiên nếu photo là mảng
              } else if (
                typeof product.photo === "string" &&
                product.photo.length > 0
              ) {
                photoUrl = product.photo; // Sử dụng trực tiếp nếu photo là chuỗi
              }
            }

            return (
              <Col
                md={4}
                key={product._id || `product-${index}`}
                className="mb-4"
              >
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
                  <Card.Body className=" text-center">
                    <Card.Title className="text-truncate">
                      {product.name}
                    </Card.Title>
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

      {/* Phân trang */}
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