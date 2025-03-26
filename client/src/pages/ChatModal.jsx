import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import io from "socket.io-client";
import "../assets/css/chatmodal.css";
import api from "../config/axios.js";

// Kết nối tới Socket.IO server
const socket = io("http://localhost:3000", {
  withCredentials: true,
  extraHeaders: {
    "Content-Type": "application/json",
  },
});

const ChatModal = ({ isOpen, onClose, tradeId, senderId, ownerId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Cuộn xuống cuối danh sách tin nhắn khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && tradeId) {
      // Tham gia phòng chat dựa trên tradeId
      socket.emit("join_trade", tradeId);

      // Lấy lịch sử tin nhắn
      fetchMessages();

      // Lắng nghe tin nhắn mới từ Socket.IO
      socket.on("receive_message", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      // Dọn dẹp khi component unmount
      return () => {
        socket.off("receive_message");
      };
    }
  }, [isOpen, tradeId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const fetchedMessages = await api.get(`/messages/${tradeId}`);
      setMessages(fetchedMessages.data);
    } catch (error) {
      console.error(
        "Error fetching messages:",
        error.response?.data || error.message
      );
      toast.error("Failed to load messages", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        tradeId,
        senderId,
        receiverId: senderId === ownerId ? ownerId : senderId, // Đảm bảo gửi đúng người nhận
        message: newMessage,
      };

      // Gửi tin nhắn qua API để lưu vào database
      const sentMessage = await api.post("/messages", messageData);

      // Gửi tin nhắn qua Socket.IO để hiển thị thời gian thực
      socket.emit("send_message", {
        tradeId,
        senderId,
        receiverId: senderId === ownerId ? ownerId : senderId,
        message: newMessage,
        createdAt: new Date().toISOString(),
      });

      setNewMessage("");
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );
      toast.error("Failed to send message", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="chat-modal">
        <div className="chat-header">
          <h3>Chat for Trade #{tradeId}</h3>
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
                key={msg._id}
                className={`message ${
                  msg.senderId === senderId ? "sent" : "received"
                }`}
              >
                <p>{msg.message}</p>
                <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
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
        </form>
      </div>
    </div>
  );
};

export default ChatModal;
