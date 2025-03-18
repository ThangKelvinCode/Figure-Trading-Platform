import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Accessory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/accessories/allAccessories`)
      .then((response) => {
        console.log("API Response:", response.data);
        
        if (!Array.isArray(response.data)) {
          throw new Error("Dữ liệu từ API không hợp lệ!");
        }

        setProducts(response.data);

        response.data.forEach((product, index) => {
          console.log(`Product ${index + 1}:`, product);
          console.log(`Product ID: ${product._id}`);
          console.log(`Photo URL: ${product.photo}`);
        });

        const totalCount = parseInt(response.headers['x-total-count'], 10);
        setTotalPages(!isNaN(totalCount) ? Math.ceil(totalCount / 10) : 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Lỗi khi tải dữ liệu từ API:", err);
        setError("Lỗi khi tải dữ liệu!");
        setLoading(false);
      });
  }, [currentPage]);

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

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 p-3">
          {loading && <p>⏳ Đang tải dữ liệu...</p>}
          {error && <p className="text-danger">{error}</p>}

          <div className="row mt-3">
            {!loading &&
              !error &&
              products.map((product, index) => {
                console.log(`Rendering Product ${index + 1}:`, product);
                console.log(`Rendering Photo URL: ${product.photo}`);
                
                return (
                  <div 
                    key={product._id || `product-${index}`} 
                    className="col-md-4 mb-4"
                  >
                    <div
                      className="card"
                      onClick={() => handleProductClick(product)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex justify-content-center align-items-center" style={{ height: "200px", overflow: "hidden" }}>
                        <img
                          src={product.photo || "https://via.placeholder.com/200"}
                          className="img-fluid"
                          alt={product.name}
                          style={{ maxHeight: "100%", maxWidth: "100%" }}
                        />
                      </div>
                      <div className="card-body text-center">
                        <p className="mb-0">{product.name}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="d-flex justify-content-center mt-4">
            <nav className="justify-content-center">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li key={`page-${index}`} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accessory;
