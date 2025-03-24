import React, { useState } from 'react';
import '../assets/css/BillingInfo.css';

const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("productId") || "N/A";
  const quantity = parseInt(queryParams.get("quantity"), 10) || 1;
  const totalPrice = parseInt(queryParams.get("totalPrice"), 10) || 10000;

const BillingInfo = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`); // Debugging log
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    const checkoutData = {
        ...formData,
        productID: productId,
        quantity: quantity, 
        totalPrice: totalPrice * 1000, 
      };
      // Navigate to /checkout with the data
      navigate('/checkout', { state: checkoutData });
  };

  return (
    <div className="billing-container">
      <h2 className="billing-title">Billing Info</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address" className="form-label">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default BillingInfo;