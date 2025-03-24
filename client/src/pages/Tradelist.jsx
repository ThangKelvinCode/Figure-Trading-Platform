import React, { useEffect, useState } from "react";
import "../assets/css/Tradelist.css";
import { useAuth } from "../context/auth.jsx";

const api = {
  getMessages: async (senderId, ownerId) => {
    const response = await fetch(
      `http://localhost:3000/messages?senderId=${senderId}&ownerId=${ownerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add any authentication headers if required
          // 'Authorization': `Bearer ${yourToken}`
        },
      }
    );
    return response.json();
  },
  sendMessage: async (senderId, ownerId, text) => {
    const response = await fetch("http://localhost:3000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any authentication headers if required
        // 'Authorization': `Bearer ${yourToken}`
      },
      body: JSON.stringify({ senderId, ownerId, text }),
    });
    return response.json();
  },
};

const ChatModal = ({ isOpen, onClose, senderId, ownerId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen, senderId, ownerId]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const fetchedMessages = await api.getMessages(senderId, ownerId);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const sentMessage = await api.sendMessage(senderId, ownerId, newMessage);
      setMessages([...messages, sentMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!isOpen) return null;

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
          {loading ? (
            <p>Loading messages...</p>
          ) : messages.length === 0 ? (
            <p>No messages yet</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${
                  msg.senderId === ownerId ? "sent" : "received"
                }`}
              >
                <p>{msg.text}</p>
                <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
            ))
          )}
        </div>
        <form className="chat-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            Send
          </button>
          <button onClick={onClose} disabled={loading}>
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

const TradeBlock = ({ trade, onTradeDeleted }) => {
  const [showChatPopup, setChatPopup] = useState(false);
  const { handleDeleteTrade } = useAuth();

  const handleDelete = async () => {
    const success = await handleDeleteTrade(trade.id);
    if (success) {
      console.log(`Trade ${trade.id} deleted successfully`);
      onTradeDeleted(trade.id);
    } else {
      console.error("Failed to delete trade");
    }
  };

  return (
    <div className="trade_request">
      <div>
        <h3>Trade #{trade.id}</h3>
        <p>Sender: {trade.sender}</p>
        <p>Offering: {trade.offer}</p>
        <p>Requesting: {trade.request}</p>
        <p>
          My Item:{" "}
          <img
            src={trade.imageUrl}
            alt="Offered Item"
            style={{ width: "100px", height: "100px" }}
          />
        </p>
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const fetchedTrades = await updateTrades(currentUser);
        setTrades(fetchedTrades);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trades:", error);
        setTrades([]);
        setLoading(false);
      }
    };

    if (currentUser !== "guest") {
      fetchTrades();
    } else {
      setLoading(false);
    }
  }, [currentUser, updateTrades]);

  const handleTradeDeleted = (deletedTradeId) => {
    setTrades((prevTrades) =>
      prevTrades.filter((trade) => trade.id !== deletedTradeId)
    );
  };

  if (loading) {
    return <div>Loading trades...</div>;
  }

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
            onTradeDeleted={handleTradeDeleted}
          />
        ))
      )}
    </div>
  );
};

export default Tradelist;
