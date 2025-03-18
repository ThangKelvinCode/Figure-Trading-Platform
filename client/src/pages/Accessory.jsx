import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Accessory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`https://67cff34d823da0212a83ef35.mockapi.io/Accessory?page=${currentPage}&limit=10`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Lỗi khi tải dữ liệu!");
        }
        return response.json().then((data) => ({ data, totalCount: response.headers.get("x-total-count") }));
      })
      .then(({ data, totalCount }) => {
        setProducts(data);
        setTotalPages(totalCount ? Math.ceil(Number(totalCount) / 10) : 1);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [currentPage]);

  useEffect(() => {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    const uniqueTypes = [...new Set(products.map(product => product.type))];
    const uniqueBrands = [...new Set(products.map(product => product.brand))];

    setCategories(uniqueCategories);
    setTypes(uniqueTypes);
    setBrands(uniqueBrands);
  }, [products]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredProducts = products.filter(product => {
    return (
      (selectedCategory === "" || product.category === selectedCategory) &&
      (selectedType === "" || product.type === selectedType) &&
      (selectedBrand === "" || product.brand === selectedBrand)
    );
  });

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Filter Controls */}
        <div className="col-12 p-3">
          <div className="d-flex justify-content-between">
            <h5>Accessories</h5>
            <div className="d-flex">
              <select className="form-select me-2" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
              <select className="form-select me-2" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="">All Types</option>
                {types.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
              <select className="form-select" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                <option value="">All Brands</option>
                {brands.map((brand, index) => (
                  <option key={index} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-12 p-3">
          {loading && <p>Đang tải dữ liệu...</p>}
          {error && <p className="text-danger">{error}</p>}

          <div className="row mt-3">
            {!loading &&
              !error &&
              filteredProducts.map((product) => (
                <div key={product.id} className="col-md-4 mb-4">
                  <div className="card" onClick={() => navigate(`/accessory/${product.id}`)} style={{ cursor: "pointer" }}>
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "200px", overflow: "hidden" }}>
                      <img src={product.image} className="img-fluid" alt={product.name} style={{ maxHeight: "100%", maxWidth: "100%" }} />
                    </div>
                    <div className="card-body text-center">
                      <p className="mb-0">{product.name}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-center mt-4">
            <nav className="justify-content-center">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
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
