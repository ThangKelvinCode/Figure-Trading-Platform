// import "bootstrap/dist/css/bootstrap.min.css";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import React, { useEffect, useState } from "react";
// import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { v4 as uuidv4 } from "uuid";
// import "../assets/css/Home.css";
// import { storage } from "../config/firebase";
// import AnimatedGif from "../context/AnimatedGif.jsx";
// import { useAuth } from "../context/auth.jsx";
// import { fetchUsers } from "./../context/adminauth";

// const Home = () => {
//   const navigate = useNavigate();
//   const { username, updateItems, createItem } = useAuth();
//   const [showItemPopup, setItemPopup] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [items, setItems] = useState([]); // State for dynamic items

//   // State for the add item modal
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [productName, setProductName] = useState("");
//   const [addLoading, setAddLoading] = useState(false);

//   // Fetch users
//   useEffect(() => {
//     const getUsers = async () => {
//       try {
//         const fetchedUsers = await fetchUsers();
//         setUsers(fetchedUsers);
//         setLoading(false);
//       } catch (error) {
//         console.error("Failed to fetch users:", error);
//         setLoading(false);
//       }
//     };
//     getUsers();
//   }, []);

//   // Fetch items when username changes or on initial load
//   useEffect(() => {
//     const loadItems = () => {
//       if (username) {
//         const fetchedItems = updateItems(username);
//         // If no items exist for the user, use default items with the current username
//         setItems(
//           fetchedItems.length > 0
//             ? fetchedItems
//             : defaultItems.map((item) => ({
//                 ...item,
//                 owner: username,
//               }))
//         );
//       } else {
//         // If no user is logged in, show default items
//         setItems(defaultItems);
//       }
//     };
//     loadItems();
//   }, [username, updateItems]);

//   const handleOffer = (productId) => {
//     if (!username) {
//       alert("Please log in to make an offer!");
//       navigate("/authpage");
//       return;
//     }
//     const product = items.find((p) => p.id === productId);
//     if (product) {
//       navigate(`/offer?productId=${product.id}&owner=${product.owner}`);
//     } else {
//       console.error("Product not found:", productId);
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleAddItem = async (e) => {
//     e.preventDefault();
//     if (!username) {
//       alert("Please log in to add an item!");
//       navigate("/authpage");
//       return;
//     }

//     if (!image || !productName) {
//       alert("Please fill in all fields and upload an image!");
//       return;
//     }

//     setAddLoading(true);

//     try {
//       const imageRef = ref(
//         storage,
//         `items/${username}/${image.name + uuidv4()}`
//       );
//       const snapshot = await uploadBytes(imageRef, image);
//       const downloadURL = await getDownloadURL(snapshot.ref);

//       const newItem = {
//         id: Date.now(),
//         name: productName,
//         owner: username,
//         image: downloadURL,
//       };

//       // Save the new item using createItem
//       createItem(newItem);

//       // Update the items list
//       const updatedItems = updateItems(username);
//       setItems(
//         updatedItems.length > 0 ? updatedItems : [...defaultItems, newItem]
//       );

//       // Reset form and close modal
//       setImage(null);
//       setImagePreview(null);
//       setProductName("");
//       setItemPopup(false);
//       alert("Item added successfully!");
//     } catch (error) {
//       console.error("Error adding item:", error);
//       alert("Failed to add item: " + error.message);
//     } finally {
//       setAddLoading(false);
//     }
//   };

//   if (loading) {
//     return <div>Loading users...</div>;
//   }

//   return (
//     <div className="home">
//       <section className="sect_1">
//         <div>
//           <AnimatedGif
//             src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDluZ2FldHhtOGdnZDgyaDA1MG9jN2JjMG50Z2V1ZmM4MXhkYWltbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/EaOW6ssYbMUYxJmr8U/giphy.gif"
//             alt="gif"
//             className="full-cover-gif"
//           />
//         </div>
//       </section>

//       <section className="sect_2">
//         <Container className="text-center my-5">
//           <h2 className="fw-bold">NEW ARRIVAL</h2>
//           <Row className="mt-4">
//             {items.map((product) => (
//               <Col key={product.id} md={3} sm={6} xs={12} className="mb-4">
//                 <Card className="border-0">
//                   <div className="image-container">
//                     <Card.Img
//                       variant="top"
//                       src={product.image}
//                       alt={product.name}
//                     />
//                     <div className="overlay-buttons">
//                       <Button
//                         variant="primary"
//                         className="btn-sm me-2"
//                         onClick={() => navigate(`/product/${product.id}`)}
//                       >
//                         View
//                       </Button>
//                       <Button
//                         variant="secondary"
//                         className="btn-sm"
//                         onClick={() => handleOffer(product.id)}
//                       >
//                         Offer
//                       </Button>
//                     </div>
//                   </div>

//                   <Card.Body>
//                     <h6 className="fw-bold">{product.name}</h6>
//                     <p className="fw-bold">Owner: {product.owner}</p>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//           <Button variant="dark" className="px-4 py-2 mt-3">
//             XEM TẤT CẢ · NEW ARRIVAL
//           </Button>
//         </Container>
//       </section>
//       <section className="sect_3">
//         <div>hi</div>
//       </section>

//       <button className="add_item_button" onClick={() => setItemPopup(true)}>
//         <div className="plus_icon">+</div>
//       </button>

//       <Modal show={showItemPopup} onHide={() => setItemPopup(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Add New Item</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <form onSubmit={handleAddItem}>
//             <div className="image-upload">
//               {imagePreview ? (
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   className="image-preview"
//                   style={{ maxWidth: "100%", height: "auto" }}
//                 />
//               ) : (
//                 <div className="drop-image">
//                   <p>Drop Image Here</p>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     style={{ display: "block", margin: "10px 0" }}
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="form-group">
//               <label>Product Name</label>
//               <input
//                 type="text"
//                 value={productName}
//                 onChange={(e) => setProductName(e.target.value)}
//                 placeholder="Enter product name"
//                 className="form-control"
//                 required
//               />
//             </div>

//             <Button type="submit" variant="primary" disabled={addLoading}>
//               {addLoading ? "Adding..." : "Add Item"}
//             </Button>
//           </form>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default Home;

import "bootstrap/dist/css/bootstrap.min.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "../assets/css/Home.css";
import { storage } from "../config/firebase";
import AnimatedGif from "../context/AnimatedGif.jsx";
import { useAuth } from "../context/auth.jsx";
import { toast } from "react-toastify"; // Import react-toastify
import api from "../config/axios.js";

const Home = () => {
  const navigate = useNavigate();
  const { username, isLoggedIn } = useAuth(); // Lấy trạng thái đăng nhập và username
  const [showTradeRequestPopup, setTradeRequestPopup] = useState(false); // Đổi tên popup
  const [loading, setLoading] = useState(true);
  const [tradeRequests, setTradeRequests] = useState([]); // State để lưu danh sách trade requests

  // State cho form tạo trade request
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [requestItem, setRequestItem] = useState("");
  const [requestDescription, setRequestDescription] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // API để lấy danh sách trade requests
  useEffect(() => {
    const fetchTradeRequests = async () => {
      try {
        const response = await api.get("/trade_requests/"); // Sử dụng axios instance
        setTradeRequests(response.data); // Dữ liệu trả về từ API
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trade requests:", error.response?.data || error.message);
        setLoading(false);
      }
    };
    fetchTradeRequests();
  }, []);

  // Xử lý khi nhấn nút "Create new trade request"
  const handleCreateTradeRequestClick = () => {
    if (!isLoggedIn) {
      toast.error("Please login to create a trade request", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }
    setTradeRequestPopup(true);
  };

  // Xử lý khi nhấn nút "View"
  const handleView = (requestId) => {
    if (!isLoggedIn) {
      toast.error("Please login to view trade request", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/authpage");
      return;
    }
    navigate(`/trade_request/${requestId}`);
  };

  // Xử lý khi nhấn nút "Offer"
  const handleOffer = (requestId, owner) => {
    if (!isLoggedIn) {
      toast.error("Please login to make an offer", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/authpage");
      return;
    }
    navigate(`/offer?requestId=${requestId}&owner=${owner}`);
  };

  // Xử lý khi chọn hình ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Xử lý khi submit form tạo trade request
  const handleCreateTradeRequest = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please login to create a trade request", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }

    if (!image || !requestItem || !requestDescription) {
      toast.error("Please fill in all fields and upload an image!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setAddLoading(true);

    try {
      // Upload hình ảnh lên Firebase Storage
      const imageRef = ref(
        storage,
        `trade_requests/${username}/${image.name + uuidv4()}`
      );
      const snapshot = await uploadBytes(imageRef, image);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Tạo trade request qua API
      const tradeRequestData = {
        requestItem,
        requestDescription,
        requestImage: downloadURL,
      };

      const response = await api.post("/trade_requests/", tradeRequestData); // Sử dụng axios instance

      const newTradeRequest = response.data.result; // Lấy trade request vừa tạo từ response
      setTradeRequests((prev) => [...prev, newTradeRequest]); // Cập nhật danh sách trade requests

      // Reset form và đóng modal
      setImage(null);
      setImagePreview(null);
      setRequestItem("");
      setRequestDescription("");
      setTradeRequestPopup(false);
      toast.success("Trade request created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error creating trade request:", error.response?.data || error.message);
      toast.error("Failed to create trade request: " + (error.response?.data?.message || error.message), {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setAddLoading(false);
    }
  };

  if (loading) {
    return <div>Loading trade requests...</div>;
  }

  return (
    <div className="home">
      <section className="sect_1">
        <div>
          <AnimatedGif
            src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDluZ2FldHhtOGdnZDgyaDA1MG9jN2JjMG50Z2V1ZmM4MXhkYWltbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/EaOW6ssYbMUYxJmr8U/giphy.gif"
            alt="gif"
            className="full-cover-gif"
          />
        </div>
      </section>

      <section className="sect_2">
        <Container className="text-center my-5">
          <h2 className="fw-bold">TRADE REQUESTS</h2>
          <Row className="mt-4">
            {tradeRequests.length === 0 ? (
              <p>No trade requests available.</p>
            ) : (
              tradeRequests.map((trade) => (
                <Col key={trade._id} md={3} sm={6} xs={12} className="mb-4">
                  <Card className="border-0">
                    <div className="image-container">
                      <Card.Img
                        variant="top"
                        src={trade.requestImage}
                        alt={trade.requestItem}
                      />
                      <div className="overlay-buttons">
                        <Button
                          variant="primary"
                          className="btn-sm me-2"
                          onClick={() => handleView(trade._id)}
                        >
                          View
                        </Button>
                        <Button
                          variant="secondary"
                          className="btn-sm"
                          onClick={() => handleOffer(trade._id, trade.userId)}
                        >
                          Offer
                        </Button>
                      </div>
                    </div>

                    <Card.Body>
                      <h6 className="fw-bold">{trade.requestItem}</h6>
                      <p className="fw-bold">Owner: {trade.userId}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
          <Button variant="dark" className="px-4 py-2 mt-3">
            XEM TẤT CẢ · TRADE REQUESTS
          </Button>
        </Container>
      </section>
      <section className="sect_3">
        <div>hi</div>
      </section>

      <button
        className="add_item_button"
        onClick={handleCreateTradeRequestClick}
      >
        <div className="plus_icon">+</div>
      </button>

      <Modal
        show={showTradeRequestPopup}
        onHide={() => setTradeRequestPopup(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Trade Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleCreateTradeRequest}>
            <div className="image-upload">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              ) : (
                <div className="drop-image">
                  <p>Drop Image Here</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "block", margin: "10px 0" }}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Request Item</label>
              <input
                type="text"
                value={requestItem}
                onChange={(e) => setRequestItem(e.target.value)}
                placeholder="Enter request item"
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label>Request Description</label>
              <textarea
                value={requestDescription}
                onChange={(e) => setRequestDescription(e.target.value)}
                placeholder="Enter request description"
                className="form-control"
                required
              />
            </div>

            <Button type="submit" variant="primary" disabled={addLoading}>
              {addLoading ? "Creating..." : "Create Trade Request"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;