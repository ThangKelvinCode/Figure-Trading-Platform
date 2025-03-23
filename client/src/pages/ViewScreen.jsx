import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Để lấy productId từ URL
import "bootstrap/dist/css/bootstrap.min.css";

const ViewScreen = () => {
  const { id } = useParams(); // Lấy productId từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://67cff34d823da0212a83ef35.mockapi.io/Product/${id}`);
        if (!response.ok) {
          throw new Error("Không tìm thấy sản phẩm!");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;
  if (!product) return <p className="text-center mt-5">Sản phẩm không tồn tại.</p>;

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Hình ảnh sản phẩm chính */}
        <div className="col-md-6 text-center">
          <img src={product.image} alt={product.name} className="img-fluid rounded shadow-sm" />
        </div>

        {/* Thông tin sản phẩm */}
        <div className="col-md-6">
          <h4>{product.name}</h4>
          <p>{product.description}</p>
          <button className="btn btn-secondary px-5">Offer</button>

          {/* Các phiên bản khác */}
          {product.variations && product.variations.length > 0 && (
            <>
              <h5 className="mt-4">Lựa chọn khác:</h5>
              <div className="d-flex flex-wrap gap-3 mt-2">
                {product.variations.slice(0, 3).map((item) => (
                  <img
                    key={item.id}
                    src={item.image}
                    alt="variation"
                    className="img-thumbnail p-2 border rounded"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "contain",
                      cursor: "pointer",
                      transition: "transform 0.2s ease-in-out",
                    }}
                    onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
                    onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewScreen;
