import { useState } from "react";
import { storage } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

function UploadImage() {
  const [imageUploads, setImageUploads] = useState([]); // Selected files
  const [imageUrls, setImageUrls] = useState([]); // Uploaded URLs
  const [previews, setPreviews] = useState([]); // Image previews
  const [isUploading, setIsUploading] = useState(false); // Uploading state

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Append new images instead of replacing
    setImageUploads((prevUploads) => [...prevUploads, ...files]);

    // Generate preview URLs and retain previous previews
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews((prevPreviews) => [...prevPreviews, ...previewUrls]);
  };

  const handleUploadImages = async () => {
    if (imageUploads.length === 0) {
      alert("Please select images to upload");
      return;
    }

    setIsUploading(true);
    const uploadedUrls = [...imageUrls]; // Keep previously uploaded images

    for (const image of imageUploads) {
      const imageRef = ref(storage, `images/${image.name + v4()}`);
      try {
        const snapshot = await uploadBytes(imageRef, image);
        const downloadURL = await getDownloadURL(snapshot.ref);
        uploadedUrls.push(downloadURL);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload some images.");
      }
    }

    setImageUrls(uploadedUrls);
    console.log("Uploaded URLs:", uploadedUrls);
    saveImageUrlsToDatabase(uploadedUrls);
    setIsUploading(false);
  };

  const saveImageUrlsToDatabase = async (urls) => {
    try {
      const bodyData = {
        name: "400% bag",
        description: "Big bag for 400%",
        type: "67c91d9583ff104caa240546",
        price: 59.99,
        photo: urls, // Send all uploaded image URLs
        status: "on-stock",
        date_added: new Date().toISOString(),
        owner: "67bca3f6207e4b98d3665a9f",
      };

      const response = await fetch("http://localhost:3000/accessories/postAccessories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        throw new Error("Failed to save image URLs.");
      }

      const data = await response.json();
      console.log("Server Response:", data);
      alert("Images and data saved successfully!");

      // Clear selected images after successful upload
      setImageUploads([]);
      setPreviews([]);
    } catch (error) {
      console.error("Error saving image URLs:", error);
      alert("Failed to save data.");
    }
  };

  return (
    <div>
      <h1>Upload Images</h1>
      <input type="file" accept="image/*" multiple onChange={handleImageChange} />
      <button onClick={handleUploadImages} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload"}
      </button>

      {/* Display image previews before upload */}
      {previews.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Images selected:</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {previews.map((preview, index) => (
              <img key={index} src={preview} alt="Preview" width="100" height="100" />
            ))}
          </div>
        </div>
      )}

      {/* Display uploaded image URLs */}
      {imageUrls.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Uploaded Image URLs:</h3>
          {imageUrls.map((url, index) => (
            <p key={index}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url}
              </a>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default UploadImage;
