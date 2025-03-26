import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Tradelist.css";
import { useAuth } from "../context/auth.jsx";
import { toast } from "react-toastify";
import api from "../config/axios.js";
import ChatModal from "./ChatModal.jsx";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

const OfferBlock = ({ offer, tradeRequest, owner, onCancelOffer, onCompleteTrade }) => {
  const [showChatPopup, setChatPopup] = useState(false);

  if (!tradeRequest) {
    return (
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <p>Trade request not found for this offer.</p>
        </Card.Body>
      </Card>
    );
  }

  const handleCancelOffer = () => {
    onCancelOffer(offer._id, tradeRequest._id);
  };

  const handleCompleteTrade = () => {
    onCompleteTrade(tradeRequest._id, offer._id);
  };

  const isTradeCompleted = tradeRequest.requestStatus === "Completed";
  const canShowChat = offer.offerStatus === "Accepted" || offer.offerStatus === "Completed";

  return (
    <Card
      className={`mb-4 shadow-sm ${
        offer.offerStatus === "Accepted"
          ? "border-success"
          : offer.offerStatus === "Declined"
          ? "border-danger"
          : isTradeCompleted
          ? "border-primary"
          : ""
      }`}
    >
      <Card.Body>
        <Card.Title>Offer for Trade #{tradeRequest._id}</Card.Title>
        <Row>
          <Col md={6}>
            <p><strong>Requesting:</strong> {tradeRequest.requestItem}</p>
            <img
              src={tradeRequest.requestImage}
              alt="Requested Item"
              className="img-fluid rounded"
              style={{ maxWidth: "150px", maxHeight: "150px", objectFit: "contain" }}
            />
          </Col>
          <Col md={6}>
            <p><strong>Owner:</strong> {owner?.name || tradeRequest.userId}</p>
            <h5>Your Offer:</h5>
            <p><strong>Offering:</strong> {offer.offerItem}</p>
            <img
              src={offer.offerImage}
              alt="Offered Item"
              className="img-fluid rounded"
              style={{ maxWidth: "120px", maxHeight: "120px", objectFit: "contain" }}
            />
            <p><strong>Status:</strong> {offer.offerStatus}</p>
          </Col>
        </Row>
        <div className="d-flex justify-content-end gap-2 mt-3">
          {offer.offerStatus === "Accepted" && !isTradeCompleted ? (
            <>
              <Button
                variant="primary"
                onClick={handleCompleteTrade}
              >
                Complete
              </Button>
              <Button
                variant="warning"
                onClick={handleCancelOffer}
              >
                Cancel
              </Button>
            </>
          ) : offer.offerStatus === "Pending" ? (
            <Button
              variant="warning"
              onClick={handleCancelOffer}
            >
              Cancel
            </Button>
          ) : null}
          {canShowChat && (
            <Button
              variant="purple"
              onClick={() => setChatPopup(true)}
              style={{ backgroundColor: "#6f42c1", borderColor: "#6f42c1" }}
            >
              Chat
            </Button>
          )}
        </div>
      </Card.Body>
      <ChatModal
        isOpen={showChatPopup}
        onClose={() => setChatPopup(false)}
        tradeId={tradeRequest._id}
        senderId={offer.userId}
        ownerId={tradeRequest.userId}
      />
    </Card>
  );
};

const MyOffers = () => {
  const { isLoggedIn, userId, loading } = useAuth();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [tradeRequests, setTradeRequests] = useState({});
  const [owners, setOwners] = useState({});
  const [dataLoading, setDataLoading] = useState(true);

  const fetchOffers = async () => {
    try {
      const offersResponse = await api.get(`/offer/user/${userId}`);
      const offersData = offersResponse.data;

      const validOffers = [];
      const tradeRequestsMap = {};
      const ownersMap = {};

      for (const offer of offersData) {
        try {
          const tradeRequestResponse = await api.get(`/trade_requests/${offer.requestId}`);
          if (tradeRequestResponse.data) {
            validOffers.push(offer);
            tradeRequestsMap[offer.requestId] = tradeRequestResponse.data;

            try {
              const ownerResponse = await api.get(`/user/${tradeRequestResponse.data.userId}`);
              ownersMap[offer.requestId] = ownerResponse.data.user;
            } catch (ownerError) {
              console.error(`Error fetching owner for trade request ${offer.requestId}:`, ownerError.response?.data || ownerError.message);
              ownersMap[offer.requestId] = null;
            }
          }
        } catch (error) {
          console.error(`Error fetching trade request ${offer.requestId}:`, error.response?.data || error.message);
        }
      }

      setOffers(validOffers);
      setTradeRequests(tradeRequestsMap);
      setOwners(ownersMap);
      setDataLoading(false);
    } catch (error) {
      console.error("Error fetching offers:", error.response?.data || error.message);
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (loading) return;

    if (!isLoggedIn) {
      toast.error("Please login to view your offers", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/authpage");
      return;
    }

    fetchOffers();

    const intervalId = setInterval(fetchOffers, 5000);
    return () => clearInterval(intervalId);
  }, [isLoggedIn, userId, navigate, loading]);

  const handleCancelOffer = async (offerId, requestId) => {
    try {
      await api.post(`/trade_requests/${requestId}/cancel-trade`);
      toast.success("Offer cancelled successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      await fetchOffers();
    } catch (error) {
      console.error("Error cancelling offer:", error.response?.data || error.message);
      toast.error("Failed to cancel offer", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleCompleteTrade = async (requestId, offerId) => {
    try {
      const response = await api.post(`/trade_requests/${requestId}/finish-trade`);
      const message = response.data.message;

      if (message === "Trade completed successfully") {
        toast.success("Trade completed successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.info("Waiting for the other party to confirm the trade completion.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      await fetchOffers();
    } catch (error) {
      console.error("Error completing trade:", error.response?.data || error.message);
      toast.error("Failed to complete trade", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  if (dataLoading) {
    return <div>Loading offers...</div>;
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">My Offers</h2>
      {offers.length === 0 ? (
        <p className="text-center">You have not made any offers yet.</p>
      ) : (
        offers.map((offer) => (
          <OfferBlock
            key={offer._id}
            offer={offer}
            tradeRequest={tradeRequests[offer.requestId]}
            owner={owners[offer.requestId]}
            onCancelOffer={handleCancelOffer}
            onCompleteTrade={handleCompleteTrade}
          />
        ))
      )}
    </Container>
  );
};

export default MyOffers;