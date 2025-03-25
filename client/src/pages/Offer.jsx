import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // Import uuid for unique file names
import "../assets/css/Offer.css";
import { storage } from "../config/firebase";
import { useAuth } from "../context/auth.jsx";

const Offer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, createTrade } = useAuth();

  // State for form data
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [owner, setOwner] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]); // Store image URLs like your friend's code

  // Extract product ID and owner from URL or context
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("productId");
    const ownerUsername = params.get("owner");

    if (id && ownerUsername) {
      setProductId(id);
      setOwner(ownerUsername);
    } else {
      navigate("/");
    }
  }, [location, navigate]);

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission with image upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      alert("Please log in to make an offer!");
      return;
    }

    if (!image || !productName) {
      alert("Please fill in all fields and upload an image!");
      return;
    }

    setLoading(true);

    try {
      // Prepare an array of images to upload (even though it's just one for now)
      const imagesToUpload = [image];
      const uploadedUrls = [...imageUrls]; // Keep previously uploaded URLs (if any)

      // Upload image(s) to Firebase Storage, similar to your friend's code
      for (const img of imagesToUpload) {
        const imageRef = ref(
          storage,
          `offers/${username}/${img.name + uuidv4()}`
        );
        try {
          const snapshot = await uploadBytes(imageRef, img);
          const downloadURL = await getDownloadURL(snapshot.ref);
          uploadedUrls.push(downloadURL);
        } catch (error) {
          console.error("Error uploading image:", error);
          throw new Error("Failed to upload image.");
        }
      }

      // Update state with the new image URLs
      setImageUrls(uploadedUrls);
      console.log("Uploaded URLs:", uploadedUrls);

      // Create trade request using the first uploaded image URL
      const tradeData = {
        id: Date.now(),
        sender: username,
        senderId: username,
        ownerId: owner,
        offer: productName,
        request: productId,
        imageUrl: uploadedUrls[0], // Use the first image URL
      };

      // Use createTrade from auth context to store the trade
      const success = await createTrade(tradeData);
      if (success) {
        alert("Trade request sent successfully!");
        navigate("/tradelist");
      } else {
        alert("Failed to create trade request.");
      }
    } catch (error) {
      console.error("Error uploading image or creating trade:", error);
      alert("An error occurred while submitting your offer: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="offer-page">
      <h2>Make an Offer</h2>
      <form onSubmit={handleSubmit}>
        {/* Image Upload Section */}
        <div className="image-upload">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="image-preview" />
          ) : (
            <div className="drop-image">
              <p>Drop IMG</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "block", margin: "10px 0" }}
              />
            </div>
          )}
        </div>

        {/* Product ID (Read-only) */}
        <div className="form-group">
          <label>Product ID</label>
          <input type="text" value={productId} readOnly />
        </div>

        {/* Product Name */}
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Confirm Offer"}
        </button>
      </form>
    </div>
  );
};

export default Offer;
