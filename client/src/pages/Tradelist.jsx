import React, { useEffect, useState } from "react";
import "../assets/css/Tradelist.css";
import { useAuth } from "../context/auth.jsx";

const ChatModal = ({ isOpen, onClose, senderId, ownerId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  if (!isOpen) return null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now(),
          senderId: ownerId, // For now, assuming current user is owner
          text: newMessage,
          timestamp: new Date(),
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="chat-modal">
        <div className="chat-header">
          <h3>
            Chat between #{senderId} and #{ownerId}
          </h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${
                msg.senderId === ownerId ? "sent" : "received"
              }`}
            >
              <p>{msg.text}</p>
              <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
        <form className="chat-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
          <button onClick={onClose}> Close </button>
        </form>
      </div>
    </div>
  );
};

const TradeBlock = ({ trade, onTradeDeleted }) => {
  const [showChatPopup, setChatPopup] = useState(false);
  const { handleDeleteTrade } = useAuth();

  const handleDelete = () => {
    const success = handleDeleteTrade(trade.id);
    if (success) {
      console.log("Trade ${trade.id} deleted successfully");
      onTradeDeleted(trade.id);
    } else {
      console.error("failed to delete");
    }
  };
  return (
    <div className={`trade_request`}>
      <div>
        <h3>Trade #{trade.id}</h3>
        <p>Sender: {trade.sender}</p>
        <p>Offering: {trade.offer}</p>
        <p>Requesting: {trade.request}</p>
      </div>
      <div>
        <button onClick={() => setChatPopup(true)}>Accept</button>
      </div>
      <div>
        <button onClick={handleDelete}>Delete</button>
      </div>
      <ChatModal
        isOpen={showChatPopup}
        onClose={() => setChatPopup(false)}
        senderId={trade.senderId}
        ownerId={trade.ownerId}
      />
    </div>
  );
};

const Tradelist = () => {
  const { username, updateTrades } = useAuth();
  const currentUser = username || "guest";
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    setTrades(updateTrades(currentUser));
    const interval = setInterval(
      () => setTrades(updateTrades(currentUser)),
      5000
    );
    return () => clearInterval(interval);
  }, [currentUser, updateTrades]);

  const handleTradeDeleted = (deletedTradeId) => {
    // Update trades state by filtering out the deleted trade
    setTrades((prevTrades) =>
      prevTrades.filter((trade) => trade.id !== deletedTradeId)
    );
  };

  return (
    <div className="tradelist_page">
      <h2>Trade Requests</h2>
      {trades.length === 0 ? (
        <p>No pending trades</p>
      ) : (
        trades.map((trade) => (
          <TradeBlock
            key={trade.id}
            trade={trade}
            onTradeDeleted={{ handleTradeDeleted }}
          />
        ))
      )}
    </div>
  );
};

export default Tradelist;
