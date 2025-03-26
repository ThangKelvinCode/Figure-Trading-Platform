import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../assets/css/Tradelist.css";
import api from "../config/axios.js";
import { useAuth } from "../context/auth.jsx";
import ChatModal from "./ChatModal.jsx";

const TradeBlock = ({
  trade,
  offers,
  users,
  onSelectOffer,
  onDeclineOffer,
  onCompleteTrade,
  onCancelTrade,
}) => {
  const [showChatPopup, setChatPopup] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const handleAcceptOffer = (offer) => {
    setSelectedOffer(offer);
    onSelectOffer(trade._id, offer._id);
  };

  const handleDeclineOffer = (offer) => {
    onDeclineOffer(trade._id, offer._id);
  };

  const handleCompleteTrade = () => {
    const acceptedOffer = offers.find(
      (offer) => offer.offerStatus === "Accepted"
    );
    if (acceptedOffer) {
      onCompleteTrade(trade._id, acceptedOffer._id);
    } else {
      toast.error("No accepted offer found to complete the trade.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleCancelTrade = () => {
    const acceptedOffer = offers.find(
      (offer) => offer.offerStatus === "Accepted"
    );
    if (acceptedOffer) {
      onCancelTrade(trade._id, acceptedOffer._id);
    } else {
      toast.error("No accepted offer found to cancel the trade.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const hasAcceptedOffer = offers.some(
    (offer) => offer.offerStatus === "Accepted"
  );
  const acceptedOffer = offers.find(
    (offer) => offer.offerStatus === "Accepted"
  );
  const isTradeCompleted = trade.requestStatus === "Completed";

  return (
    <div className="trade-block">
      {/* Trade Header: Trade Info and Global Actions */}
      <div className="trade-header">
        <div className="trade-info">
          <h3>Trade #{trade._id}</h3>
          <p>Requesting: {trade.requestItem}</p>
          <div className="my-item">
            <span>My Item:</span>
            <img
              src={trade.requestImage}
              alt="Requested Item"
              className="item-image"
            />
          </div>
        </div>
        <div className="global-actions">
          {!isTradeCompleted && hasAcceptedOffer && (
            <div className="trade-actions">
              <button className="complete-btn" onClick={handleCompleteTrade}>
                Complete
              </button>
              <button className="cancel-btn" onClick={handleCancelTrade}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Offers Section */}
      <div className="offers-section">
        <h4>Offers:</h4>
        {offers.length === 0 ? (
          <p className="no-offers">No offers yet</p>
        ) : (
          offers.map((offer) => (
            <div
              key={offer._id}
              className={`offer-block ${
                offer.offerStatus === "Accepted"
                  ? "accepted-offer"
                  : offer.offerStatus === "Declined"
                  ? "declined-offer"
                  : ""
              }`}
            >
              <div className="offer-details">
                <p>
                  <strong>Sender:</strong>{" "}
                  {users[offer.userId]?.name || offer.userId}
                </p>
                <p>
                  <strong>Offering:</strong> {offer.offerItem}
                </p>
                <div className="offer-item">
                  <span>Offer Item:</span>
                  <img
                    src={offer.offerImage}
                    alt="Offered Item"
                    className="item-image"
                  />
                </div>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status-${offer.offerStatus.toLowerCase()}`}>
                    {offer.offerStatus}
                  </span>
                </p>
              </div>
              <div className="offer-actions">
                {offer.offerStatus === "Pending" && !hasAcceptedOffer && (
                  <div className="trade_buttons">
                    <button
                      className="accept-btn"
                      onClick={() => handleAcceptOffer(offer)}
                    >
                      Accept
                    </button>
                    <button
                      className="decline-btn"
                      onClick={() => handleDeclineOffer(offer)}
                    >
                      Decline
                    </button>
                  </div>
                )}
                {offer.offerStatus === "Accepted" && !isTradeCompleted && (
                  <button
                    className="chat-btn"
                    onClick={() => {
                      setSelectedOffer(offer);
                      setChatPopup(true);
                    }}
                  >
                    Chat
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat Modal */}
      {selectedOffer && (
        <ChatModal
          isOpen={showChatPopup}
          onClose={() => {
            setChatPopup(false);
            setSelectedOffer(null);
          }}
          tradeId={trade._id}
          senderId={trade.userId}
          ownerId={selectedOffer.userId}
        />
      )}
    </div>
  );
};

const Tradelist = () => {
  const { isLoggedIn, userId, username, loading } = useAuth();
  const navigate = useNavigate();
  const [tradeRequests, setTradeRequests] = useState([]);
  const [offers, setOffers] = useState({});
  const [users, setUsers] = useState({});
  const [dataLoading, setDataLoading] = useState(true);

  const fetchTradeRequestsAndOffers = async () => {
    try {
      const tradeRequestsResponse = await api.get(
        `/trade_requests/user/${userId}`
      );
      const tradeRequestsData = tradeRequestsResponse.data;

      const offersPromises = tradeRequestsData.map(async (trade) => {
        try {
          const offersResponse = await api.get(`/offer/request/${trade._id}`);
          return { requestId: trade._id, offers: offersResponse.data };
        } catch (error) {
          console.error(
            `Error fetching offers for trade request ${trade._id}:`,
            error.response?.data || error.message
          );
          return { requestId: trade._id, offers: [] };
        }
      });

      const offersData = await Promise.all(offersPromises);
      const offersMap = offersData.reduce((acc, { requestId, offers }) => {
        acc[requestId] = offers;
        return acc;
      }, {});

      const userIds = new Set();
      Object.values(offersMap).forEach((offerList) => {
        offerList.forEach((offer) => userIds.add(offer.userId));
      });

      const userPromises = Array.from(userIds).map(async (userId) => {
        try {
          const userResponse = await api.get(`/user/${userId}`);
          return { userId, user: userResponse.data.user };
        } catch (error) {
          console.error(
            `Error fetching user ${userId}:`,
            error.response?.data || error.message
          );
          return { userId, user: null };
        }
      });

      const usersData = await Promise.all(userPromises);
      const usersMap = usersData.reduce((acc, { userId, user }) => {
        if (user) acc[userId] = user;
        return acc;
      }, {});

      setTradeRequests(tradeRequestsData);
      setOffers(offersMap);
      setUsers(usersMap);
      setDataLoading(false);
    } catch (error) {
      console.error(
        "Error fetching trade requests:",
        error.response?.data || error.message
      );
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (loading) return;

    if (!isLoggedIn) {
      toast.error("Please login to view your trade list", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/authpage");
      return;
    }

    fetchTradeRequestsAndOffers();
  }, [isLoggedIn, userId, navigate, loading]);

  const handleSelectOffer = async (requestId, offerId) => {
    try {
      await api.post(`/trade_requests/${requestId}/select-offer/${offerId}`);
      toast.success("Offer accepted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      await fetchTradeRequestsAndOffers();
    } catch (error) {
      console.error(
        "Error selecting offer:",
        error.response?.data || error.message
      );
      toast.error("Failed to accept offer", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDeclineOffer = async (requestId, offerId) => {
    try {
      await api.post(`/trade_requests/${requestId}/decline-offer/${offerId}`);
      toast.success("Offer declined successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      await fetchTradeRequestsAndOffers();
    } catch (error) {
      console.error(
        "Error declining offer:",
        error.response?.data || error.message
      );
      toast.error("Failed to decline offer", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleCompleteTrade = async (requestId, offerId) => {
    try {
      const response = await api.post(
        `/trade_requests/${requestId}/finish-trade`
      );
      const message = response.data.message;

      if (message === "Trade completed successfully") {
        toast.success("Trade completed successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.info(
          "Waiting for the other party to confirm the trade completion.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
      await fetchTradeRequestsAndOffers();
    } catch (error) {
      console.error(
        "Error completing trade:",
        error.response?.data || error.message
      );
      toast.error("Failed to complete trade", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleCancelTrade = async (requestId, offerId) => {
    try {
      await api.post(`/trade_requests/${requestId}/cancel-trade`);
      toast.success("Trade cancelled successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      await fetchTradeRequestsAndOffers();
    } catch (error) {
      console.error(
        "Error cancelling trade:",
        error.response?.data || error.message
      );
      toast.error("Failed to cancel trade", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  if (dataLoading) {
    return <div>Loading trades...</div>;
  }

  return (
    <div className="tradelist_page">
      <h2>Trade Requests</h2>
      {tradeRequests.length === 0 ? (
        <p>No pending trades</p>
      ) : (
        tradeRequests.map((trade) => (
          <TradeBlock
            key={trade._id}
            trade={trade}
            offers={offers[trade._id] || []}
            users={users}
            onSelectOffer={handleSelectOffer}
            onDeclineOffer={handleDeclineOffer}
            onCompleteTrade={handleCompleteTrade}
            onCancelTrade={handleCancelTrade}
          />
        ))
      )}
    </div>
  );
};

export default Tradelist;