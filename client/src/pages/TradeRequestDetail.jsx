import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Row, Col, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import api from "../config/axios.js";
import { storage } from "../config/firebase";
import { useAuth } from "../context/auth.jsx";

const TradeRequestDetail = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, userId, username } = useAuth();
  const [tradeRequest, setTradeRequest] = useState(null);
  const [owner, setOwner] = useState(null);
  const [hasOffer, setHasOffer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [relatedTrades, setRelatedTrades] = useState([]); // State for related trade items

  const [offerImage, setOfferImage] = useState(null);
  const [offerImagePreview, setOfferImagePreview] = useState(null);
  const [offerItem, setOfferItem] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);

  useEffect(() => {
    const fetchTradeRequest = async () => {
      try {
        const response = await api.get(`/trade_requests/${requestId}`);
        const tradeRequestData = response.data;

        const ownerResponse = await api.get(`/user/${tradeRequestData.userId}`);
        setOwner(ownerResponse.data.user);
        setTradeRequest(tradeRequestData);

        if (isLoggedIn) {
          const offersResponse = await api.get(`/offer/request/${requestId}`);
          const userOffer = offersResponse.data.find(
            (offer) => offer.userId === userId
          );
          setHasOffer(!!userOffer);
        }

        // Fetch related trade items (excluding the current trade request)
        const relatedTradesResponse = await api.get("/trade_requests/");
        const filteredTrades = relatedTradesResponse.data
          .filter((trade) => trade._id !== requestId)
          .slice(0, 3); // Limit to 3 related trades
        setRelatedTrades(filteredTrades);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching trade request:", error.response?.data || error.message);
        setLoading(false);
      }
    };
    fetchTradeRequest();
  }, [requestId, isLoggedIn, userId]);

  const handleSendOfferClick = () => {
    if (!isLoggedIn) {
      toast.error("Please login to make an offer", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/authpage");
      return;
    }
    setShowOfferModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOfferImage(file);
      setOfferImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please login to make an offer", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }

    if (!offerImage || !offerItem || !offerDescription) {
      toast.error("Please fill in all fields and upload an image!", {
        position: "top-right",
        autoClose: 3000,
      });
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
        requestId,
      };

      const response = await api.post("/offer/", offerData);
      setHasOffer(true);
      setShowOfferModal(false);
      toast.success("Offer created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setOfferImage(null);
      setOfferImagePreview(null);
      setOfferItem("");
      setOfferDescription("");
    } catch (error) {
      console.error("Error creating offer:", error.response?.data || error.message);
      toast.error(
        "Failed to create offer: " + (error.response?.data?.message || error.message),
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setOfferLoading(false);
    }
  };

  const handleRelatedTradeClick = (tradeId) => {
    navigate(`/trade_request/${tradeId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (!tradeRequest) return <div>Trade request not found.</div>;

  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          <img
            src={tradeRequest.requestImage}
            alt={tradeRequest.requestItem}
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: "400px", objectFit: "contain", width: "100%" }}
          />
        </Col>
        <Col md={6}>
          <h2 className="mb-3">{tradeRequest.requestItem}</h2>
          <p className="text-muted">{tradeRequest.requestDescription}</p>
          <h5 className="mt-4">Owner Information</h5>
          {owner ? (
            <div className="bg-light p-3 rounded">
              <p><strong>Name:</strong> {owner.name}</p>
              <p><strong>Email:</strong> {owner.email}</p>
              <p><strong>Date of Birth:</strong> {new Date(owner.date_of_birth).toLocaleDateString()}</p>
            </div>
          ) : (
            <p>Owner information not available.</p>
          )}
          <div className="d-flex gap-2 mt-4">
            <Button
              variant="primary"
              onClick={handleSendOfferClick}
              disabled={hasOffer || tradeRequest.userId === userId}
            >
              Send an Offer
            </Button>
            <Button variant="secondary" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </Col>
      </Row>

      {relatedTrades.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-4">Items for Trade</h3>
          <Row>
            {relatedTrades.map((trade) => (
              <Col md={4} key={trade._id} className="mb-4">
                <Card
                  className="shadow-sm h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRelatedTradeClick(trade._id)}
                >
                  <Card.Img
                    variant="top"
                    src={trade.requestImage}
                    style={{ height: "200px", objectFit: "contain" }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300";
                    }}
                  />
                  <Card.Body>
                    <Card.Title className="text-truncate">{trade.requestItem}</Card.Title>
                    <Card.Text className="text-muted">
                      Owner: {owner?.name || trade.userId}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      <Modal
        show={showOfferModal}
        onHide={() => setShowOfferModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Send an Offer</Modal.Title>
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
            <Form.Group className = "mb-3">
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
                    onClick={() => {
                      setOfferImage(null);
                      setOfferImagePreview(null);
                    }}
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
                    onChange={handleImageChange}
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
    </Container>
  );
};

export default TradeRequestDetail;