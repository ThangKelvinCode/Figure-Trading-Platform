import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import "../assets/css/Home.css";
import api from "../config/axios.js";
import { storage } from "../config/firebase";
import { useAuth } from "../context/auth.jsx";

const Home = () => {
  const navigate = useNavigate();
  const { username, userId, isLoggedIn } = useAuth();
  const [showTradeRequestPopup, setTradeRequestPopup] = useState(false);
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tradeRequests, setTradeRequests] = useState([]);
  const [users, setUsers] = useState({});
  const [userOffers, setUserOffers] = useState({});
  const [accessories, setAccessories] = useState([]); // State cho accessories

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [requestItem, setRequestItem] = useState("");
  const [requestDescription, setRequestDescription] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const [offerImage, setOfferImage] = useState(null);
  const [offerImagePreview, setOfferImagePreview] = useState(null);
  const [offerItem, setOfferItem] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Trade Requests
        const tradeResponse = await api.get("/trade_requests/");
        const tradeRequestsData = tradeResponse.data;

        const userPromises = tradeRequestsData.map(async (trade) => {
          try {
            const userResponse = await api.get(`/user/${trade.userId}`);
            return { userId: trade.userId, user: userResponse.data.user };
          } catch (error) {
            console.error(`Error fetching user ${trade.userId}:`, error);
            return { userId: trade.userId, user: null };
          }
        });

        const usersData = await Promise.all(userPromises);
        const usersMap = usersData.reduce((acc, { userId, user }) => {
          if (user) acc[userId] = user;
          return acc;
        }, {});

        const filteredTradeRequests = tradeRequestsData.filter(
          (trade) => trade.userId !== userId
        );

        if (isLoggedIn) {
          const offersPromises = filteredTradeRequests.map(async (trade) => {
            try {
              const offersResponse = await api.get(
                `/offer/request/${trade._id}`
              );
              const userOffer = offersResponse.data.find(
                (offer) => offer.userId === userId
              );
              return { requestId: trade._id, hasOffer: !!userOffer };
            } catch (error) {
              console.error(`Error fetching offers for ${trade._id}:`, error);
              return { requestId: trade._id, hasOffer: false };
            }
          });

          const offersData = await Promise.all(offersPromises);
          const userOffersMap = offersData.reduce(
            (acc, { requestId, hasOffer }) => {
              acc[requestId] = hasOffer;
              return acc;
            },
            {}
          );
          setUserOffers(userOffersMap);
        }

        setUsers(usersMap);
        setTradeRequests(filteredTradeRequests);

        // Fetch Accessories
        const accessoryResponse = await api.get(
          "http://localhost:3000/accessories/allAccessories"
        );
        setAccessories(accessoryResponse.data.slice(0, 4)); // Lấy 4 sản phẩm đầu tiên

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, isLoggedIn]);

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

  const handleView = (requestId) => {
    if (!isLoggedIn) {
      toast.error("Please login to view trade request", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }
    navigate(`/trade_request/${requestId}`);
  };

  const handleOffer = (requestId) => {
    if (!isLoggedIn) {
      toast.error("Please login to make an offer", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }
    setSelectedRequestId(requestId);
    setShowOfferPopup(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOfferImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOfferImage(file);
      setOfferImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateTradeRequest = async (e) => {
    e.preventDefault();
    if (!isLoggedIn || !image || !requestItem || !requestDescription) {
      toast.error("Please fill in all fields and upload an image!", {
        position: "top-right",
        autoClose: 3000,
      });
      if (!isLoggedIn) navigate("/login");
      return;
    }

    setAddLoading(true);
    try {
      const imageRef = ref(
        storage,
        `trade_requests/${username}/${image.name + uuidv4()}`
      );
      const snapshot = await uploadBytes(imageRef, image);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const tradeRequestData = {
        requestItem,
        requestDescription,
        requestImage: downloadURL,
      };

      const response = await api.post("/trade_requests/", tradeRequestData);
      setTradeRequests((prev) => [...prev, response.data.result]);
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
      console.error("Error creating trade request:", error);
      toast.error("Failed to create trade request!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setAddLoading(false);
    }
  };

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    if (!isLoggedIn || !offerImage || !offerItem || !offerDescription) {
      toast.error("Please fill in all fields and upload an image!", {
        position: "top-right",
        autoClose: 3000,
      });
      if (!isLoggedIn) navigate("/login");
      return;
    }

    setOfferLoading(true);
    try {
      const imageRef = ref(
        storage,
        `offers/${username}/${offerImage.name + uuidv4()}`
      );
      const snapshot = await uploadBytes(imageRef, offerImage);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const offerData = {
        offerItem,
        offerDescription,
        offerImage: downloadURL,
        requestId: selectedRequestId,
      };

      await api.post("/offer/", offerData);
      setUserOffers((prev) => ({ ...prev, [selectedRequestId]: true }));
      setShowOfferPopup(false);
      toast.success("Offer created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setOfferImage(null);
      setOfferImagePreview(null);
      setOfferItem("");
      setOfferDescription("");
      setSelectedRequestId(null);
    } catch (error) {
      console.error("Error creating offer:", error);
      toast.error("Failed to create offer!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setOfferLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home">
      <section className="sect_1">
        <div>
          <img
            src="https://cdn-global.popmart.com/about-us/web/about-us-en/banner.png?x-oss-process=image/format,webp"
            alt="banner"
            className="full-cover-gif"
          />
        </div>
      </section>

      <section className="sect_2">
        <Container className="text-center my-5">
          <h2 className="fw-bold">Item for trade</h2>
          <Row className="mt-4">
            {tradeRequests.length === 0 ? (
              <p>No Items available.</p>
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
                    </div>
                    <Card.Body>
                      <h6 className="fw-bold">{trade.requestItem}</h6>
                      <p className="fw-bold">
                        Owner: {users[trade.userId]?.name || trade.userId}
                      </p>
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="primary"
                          className="btn-sm"
                          onClick={() => handleView(trade._id)}
                        >
                          View
                        </Button>
                        <Button
                          variant="secondary"
                          className="btn-sm"
                          onClick={() => handleOffer(trade._id)}
                          disabled={userOffers[trade._id]}
                        >
                          Offer
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
          <Button
            variant="dark"
            className="px-4 py-2 mt-3"
            onClick={() => navigate("/about")}
          >
            XEM TẤT CẢ · TRADE REQUESTS
          </Button>
        </Container>

        <Container className="text-center my-5">
          <h2 className="fw-bold">Accessory</h2>
          <Row className="mt-4">
            {accessories.length === 0 ? (
              <p>No Accessories available.</p>
            ) : (
              accessories.map((accessory) => (
                <Col key={accessory._id} md={3} sm={6} xs={12} className="mb-4">
                  <Card className="border-0">
                    <div className="image-container">
                      <Card.Img
                        variant="top"
                        src={
                          accessory.photo && accessory.photo.length > 0
                            ? Array.isArray(accessory.photo)
                              ? accessory.photo[0]
                              : accessory.photo
                            : "https://via.placeholder.com/200"
                        }
                        alt={accessory.name}
                      />
                    </div>
                    <Card.Body>
                      <h6 className="fw-bold">{accessory.name}</h6>
                      <p className="fw-bold">{accessory.price}đ</p>
                      <Button
                        variant="primary"
                        className="btn-sm"
                        onClick={() => navigate(`/accessory/${accessory._id}`)}
                      >
                        View
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
          <Button
            variant="dark"
            className="px-4 py-2 mt-3"
            onClick={() => navigate("/accessory")}
          >
            XEM TẤT CẢ · ACCESSORY
          </Button>
        </Container>
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
          <Modal.Title>Create New Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleCreateTradeRequest}>
            <div className="image-upload">
              {imagePreview ? (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)} // Xóa hình ảnh
                    style={{
                      position: "absolute",
                      top: "0",
                      right: "0",
                      background: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "15px",
                      height: "30px",
                      cursor: "pointer",
                    }}
                  >
                    X
                  </button>
                </div>
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
              <label>Item name</label>
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
              <label>Item Description</label>
              <textarea
                value={requestDescription}
                onChange={(e) => setRequestDescription(e.target.value)}
                placeholder="Enter request description"
                className="form-control"
                required
              />
            </div>
            <Button type="submit" variant="primary" disabled={addLoading}>
              {addLoading ? "Creating..." : "Create New Item"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showOfferPopup}
        onHide={() => setShowOfferPopup(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateOffer}>
            <Form.Group className="mb-3">
              <Form.Label>Offer Item</Form.Label>
              <Form.Control
                type="text"
                value={offerItem}
                onChange={(e) => setOfferItem(e.target.value)}
                placeholder="Enter offer item"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Offer Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={offerDescription}
                onChange={(e) => setOfferDescription(e.target.value)}
                placeholder="Enter offer description"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Offer Image</Form.Label>
              {offerImagePreview ? (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={offerImagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      marginBottom: "10px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setOfferImagePreview(null)} // Xóa hình ảnh
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                    }}
                  >
                    X
                  </button>
                </div>
              ) : (
                <div>
                  <p>Drop Image Here</p>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleOfferImageChange}
                    required
                  />
                </div>
              )}
            </Form.Group>
            <Button type="submit" variant="primary" disabled={offerLoading}>
              {offerLoading ? "Creating..." : "Confirm"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;
