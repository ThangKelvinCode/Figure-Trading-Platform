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
        </form>
      </div>
    </div>
  );
};

const TradeBlock = ({ trade, onAccept, onDeny }) => {
  const [showChatPopup, setChatPopup] = useState(false);

  return (
    <div className={`trade_request ${trade.status}`}>
      <div>
        <h3>Trade #{trade.id}</h3>
        <p>Sender: {trade.sender}</p>
        <p>Offering: {trade.offer}</p>
        <p>Requesting: {trade.request}</p>
      </div>
      <div className="trade_buttons">
        {trade.status === "pending" ? (
          <>
            <button className="accept" onClick={() => onAccept(trade.id)}>
              Accept
            </button>
            <button className="deny" onClick={() => onDeny(trade.id)}>
              Deny
            </button>
          </>
        ) : (
          <button className={`status ${trade.status}`} disabled>
            {trade.status === "accepted" ? "Accepted" : "Denied"}
          </button>
        )}
      </div>
      <div>
        <button onClick={() => setChatPopup(true)}>Message</button>
      </div>
      <ChatModal
        isOpen={showChatPopup}
        onClose={() => setChatPopup(false)}
        senderId={trade.senderId} // Assuming trade object has senderId
        ownerId={trade.ownerId} // Assuming trade object has ownerId
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

  const handleAccept = (tradeId) => {
    const allTrades = JSON.parse(localStorage.getItem("trades") || "[]");
    const updatedTrades = allTrades.map((trade) =>
      trade.id === tradeId ? { ...trade, status: "accepted" } : trade
    );
    localStorage.setItem("trades", JSON.stringify(updatedTrades));
    setTrades(updateTrades(currentUser));
  };

  const handleDeny = (tradeId) => {
    const allTrades = JSON.parse(localStorage.getItem("trades") || "[]");
    const updatedTrades = allTrades.map((trade) =>
      trade.id === tradeId ? { ...trade, status: "denied" } : trade
    );
    localStorage.setItem("trades", JSON.stringify(updatedTrades));
    setTrades(updateTrades(currentUser));
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
            onAccept={handleAccept}
            onDeny={handleDeny}
          />
        ))
      )}
    </div>
  );
};

export default Tradelist;
