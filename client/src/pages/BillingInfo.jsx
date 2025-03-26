import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import api from "../config/axios"; // Import axios config

const BillingInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { productId, quantity, totalPrice, shippingInfo } = location.state || {};

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [originalPhone, setOriginalPhone] = useState(""); // Store original shipping info
  const [originalAddress, setOriginalAddress] = useState(""); // Store original shipping info
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const user_id = sessionStorage.getItem("SWD392_user_id");

  useEffect(() => {
    if (shippingInfo?.user) {
      setName(shippingInfo.user.name || "");
      setEmail(shippingInfo.user.email || "");
      setPhoneNumber(shippingInfo.user.phoneNumber || "");
      setAddress(shippingInfo.user.address || "");

      // Store original values to detect changes
      setOriginalPhone(shippingInfo.user.phoneNumber || "");
      setOriginalAddress(shippingInfo.user.address || "");
    }
  }, [shippingInfo]);

  const updateShippingInfo = async () => {
    try {
      console.log("📡 Updating shipping info:", { phoneNumber, address });

      // Gọi API PUT /user/:id/updateShippingInfo để cập nhật thông tin giao hàng
      const response = await api.put(`/user/${user_id}/updateShippingInfo`, {
        phoneNumber,
        address,
      });

      console.log("✅ Shipping info updated successfully:", response.data);
    } catch (err) {
      console.error("❌ Error updating shipping info:", err.response?.data?.message || err.message);
      throw new Error(err.response?.data?.message || "Failed to update shipping information.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if phone number or address is missing or has changed
      const needsUpdate =
        phoneNumber.trim() === "" ||
        address.trim() === "" ||
        phoneNumber !== originalPhone ||
        address !== originalAddress;

      if (needsUpdate) {
        await updateShippingInfo();
      }

      // Dữ liệu gửi lên API purchase
      const purchaseData = {
        userID: user_id,
        quantity: quantity,
      };

      // Gọi API POST /accessories/:id/purchase để hoàn tất việc mua hàng
      const response = await api.post(`/accessories/${productId}/purchase`, purchaseData);

      // Lấy orderId từ response (nếu API trả về)
      const orderId = response.data?.result?.order?.insertedId || "";

      // Chuyển hướng đến trang checkout với thông tin cần thiết
      navigate("/checkout", {
        state: { name, email, phoneNumber, address, orderId, productId, quantity, totalPrice },
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to complete purchase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1>Billing Information</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={name} disabled />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} disabled />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Processing..." : "Confirm Purchase"}
        </Button>
      </Form>
    </Container>
  );
};

export default BillingInfo;