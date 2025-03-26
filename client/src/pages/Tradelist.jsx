// import React, { useEffect, useState } from "react";
// import "../assets/css/Tradelist.css";
// import { useAuth } from "../context/auth.jsx";

// const api = {
//   getMessages: async (senderId, ownerId) => {
//     const response = await fetch(
//       `http://localhost:3000/messages?senderId=${senderId}&ownerId=${ownerId}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           // Add any authentication headers if required
//           // 'Authorization': `Bearer ${yourToken}`
//         },
//       }
//     );
//     return response.json();
//   },
//   sendMessage: async (senderId, ownerId, text) => {
//     const response = await fetch("http://localhost:3000/messages", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         // Add any authentication headers if required
//         // 'Authorization': `Bearer ${yourToken}`
//       },
//       body: JSON.stringify({ senderId, ownerId, text }),
//     });
//     return response.json();
//   },
// };

// const ChatModal = ({ isOpen, onClose, senderId, ownerId }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       fetchMessages();
//     }
//   }, [isOpen, senderId, ownerId]);

//   const fetchMessages = async () => {
//     setLoading(true);
//     try {
//       const fetchedMessages = await api.getMessages(senderId, ownerId);
//       setMessages(fetchedMessages);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     try {
//       const sentMessage = await api.sendMessage(senderId, ownerId, newMessage);
//       setMessages([...messages, sentMessage]);
//       setNewMessage("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="chat-modal">
//         <div className="chat-header">
//           <h3>
//             Chat between #{senderId} and #{ownerId}
//           </h3>
//           <button className="close-btn" onClick={onClose}>
//             ×
//           </button>
//         </div>
//         <div className="chat-messages">
//           {loading ? (
//             <p>Loading messages...</p>
//           ) : messages.length === 0 ? (
//             <p>No messages yet</p>
//           ) : (
//             messages.map((msg) => (
//               <div
//                 key={msg.id}
//                 className={`message ${
//                   msg.senderId === ownerId ? "sent" : "received"
//                 }`}
//               >
//                 <p>{msg.text}</p>
//                 <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
//               </div>
//             ))
//           )}
//         </div>
//         <form className="chat-input" onSubmit={handleSendMessage}>
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Type a message..."
//             disabled={loading}
//           />
//           <button type="submit" disabled={loading}>
//             Send
//           </button>
//           <button onClick={onClose} disabled={loading}>
//             Close
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// const TradeBlock = ({ trade, onTradeDeleted }) => {
//   const [showChatPopup, setChatPopup] = useState(false);
//   const { handleDeleteTrade } = useAuth();

//   const handleDelete = async () => {
//     const success = await handleDeleteTrade(trade.id);
//     if (success) {
//       console.log(`Trade ${trade.id} deleted successfully`);
//       onTradeDeleted(trade.id);
//     } else {
//       console.error("Failed to delete trade");
//     }
//   };

//   return (
//     <div className="trade_request">
//       <div>
//         <h3>Trade #{trade.id}</h3>
//         <p>Sender: {trade.sender}</p>
//         <p>Offering: {trade.offer}</p>
//         <p>Requesting: {trade.request}</p>
//         <p>
//           My Item:{" "}
//           <img
//             src={trade.imageUrl}
//             alt="Offered Item"
//             style={{ width: "100px", height: "100px" }}
//           />
//         </p>
//       </div>
//       <div>
//         <button onClick={() => setChatPopup(true)}>Accept</button>
//       </div>
//       <div>
//         <button onClick={handleDelete}>Delete</button>
//       </div>
//       <ChatModal
//         isOpen={showChatPopup}
//         onClose={() => setChatPopup(false)}
//         senderId={trade.senderId}
//         ownerId={trade.ownerId}
//       />
//     </div>
//   );
// };

// const Tradelist = () => {
//   const { username, updateTrades } = useAuth();
//   const currentUser = username || "guest";
//   const [trades, setTrades] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTrades = async () => {
//       try {
//         const fetchedTrades = await updateTrades(currentUser);
//         setTrades(fetchedTrades);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching trades:", error);
//         setTrades([]);
//         setLoading(false);
//       }
//     };

//     if (currentUser !== "guest") {
//       fetchTrades();
//     } else {
//       setLoading(false);
//     }
//   }, [currentUser, updateTrades]);

//   const handleTradeDeleted = (deletedTradeId) => {
//     setTrades((prevTrades) =>
//       prevTrades.filter((trade) => trade.id !== deletedTradeId)
//     );
//   };

//   if (loading) {
//     return <div>Loading trades...</div>;
//   }

//   return (
//     <div className="tradelist_page">
//       <h2>Trade Requests</h2>
//       {trades.length === 0 ? (
//         <p>No pending trades</p>
//       ) : (
//         trades.map((trade) => (
//           <TradeBlock
//             key={trade.id}
//             trade={trade}
//             onTradeDeleted={handleTradeDeleted}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// export default Tradelist;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../assets/css/Tradelist.css";
// import { useAuth } from "../context/auth.jsx";
// import { toast } from "react-toastify";
// import api from "../config/axios.js"; // Đảm bảo bạn đã import axios instance

// const ChatModal = ({ isOpen, onClose, senderId, ownerId }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       fetchMessages();
//     }
//   }, [isOpen, senderId, ownerId]);

//   const fetchMessages = async () => {
//     setLoading(true);
//     try {
//       const fetchedMessages = await api.get(`/messages?senderId=${senderId}&ownerId=${ownerId}`);
//       setMessages(fetchedMessages.data);
//     } catch (error) {
//       console.error("Error fetching messages:", error.response?.data || error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     try {
//       const sentMessage = await api.post("/messages", {
//         senderId,
//         ownerId,
//         text: newMessage,
//       });
//       setMessages([...messages, sentMessage.data]);
//       setNewMessage("");
//     } catch (error) {
//       console.error("Error sending message:", error.response?.data || error.message);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="chat-modal">
//         <div className="chat-header">
//           <h3>
//             Chat between #{senderId} and #{ownerId}
//           </h3>
//           <button className="close-btn" onClick={onClose}>
//             ×
//           </button>
//         </div>
//         <div className="chat-messages">
//           {loading ? (
//             <p>Loading messages...</p>
//           ) : messages.length === 0 ? (
//             <p>No messages yet</p>
//           ) : (
//             messages.map((msg) => (
//               <div
//                 key={msg._id}
//                 className={`message ${
//                   msg.senderId === ownerId ? "sent" : "received"
//                 }`}
//               >
//                 <p>{msg.text}</p>
//                 <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
//               </div>
//             ))
//           )}
//         </div>
//         <form className="chat-input" onSubmit={handleSendMessage}>
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Type a message..."
//             disabled={loading}
//           />
//           <button type="submit" disabled={loading}>
//             Send
//           </button>
//           <button onClick={onClose} disabled={loading}>
//             Close
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// const TradeBlock = ({ trade, offers, users, onDeleteTradeRequest, onSelectOffer }) => {
//   const [showChatPopup, setChatPopup] = useState(false);
//   const [selectedOffer, setSelectedOffer] = useState(null);

//   const handleDelete = async () => {
//     try {
//       await api.delete(`/trade_requests/${trade._id}`);
//       onDeleteTradeRequest(trade._id);
//       toast.success("Trade request deleted successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error deleting trade request:", error.response?.data || error.message);
//       toast.error("Failed to delete trade request", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleAcceptOffer = (offer) => {
//     setSelectedOffer(offer);
//     setChatPopup(true);
//     onSelectOffer(trade._id, offer._id); // Gọi API để chọn offer
//   };

//   return (
//     <div className="trade_request">
//       <div>
//         <h3>Trade #{trade._id}</h3>
//         <p>Requesting: {trade.requestItem}</p>
//         <p>
//           My Item:{" "}
//           <img
//             src={trade.requestImage}
//             alt="Requested Item"
//             style={{ width: "100px", height: "100px" }}
//           />
//         </p>
//         <h4>Offers:</h4>
//         {offers.length === 0 ? (
//           <p>No offers yet</p>
//         ) : (
//           offers.map((offer) => (
//             <div key={offer._id} style={{ marginBottom: "10px" }}>
//               <p>Sender: {users[offer.userId]?.name || offer.userId}</p>
//               <p>Offering: {offer.offerItem}</p>
//               <p>
//                 Offer Item:{" "}
//                 <img
//                   src={offer.offerImage}
//                   alt="Offered Item"
//                   style={{ width: "80px", height: "80px" }}
//                 />
//               </p>
//               {offer.offerStatus === "Pending" && (
//                 <button onClick={() => handleAcceptOffer(offer)}>Accept</button>
//               )}
//               <p>Status: {offer.offerStatus}</p>
//             </div>
//           ))
//         )}
//       </div>
//       <div>
//         <button onClick={handleDelete}>Delete</button>
//       </div>
//       {selectedOffer && (
//         <ChatModal
//           isOpen={showChatPopup}
//           onClose={() => {
//             setChatPopup(false);
//             setSelectedOffer(null);
//           }}
//           senderId={selectedOffer.userId} // Người gửi offer
//           ownerId={trade.userId} // Người tạo trade request (user hiện tại)
//         />
//       )}
//     </div>
//   );
// };

// const Tradelist = () => {
//   const { isLoggedIn, userId, username } = useAuth();
//   const navigate = useNavigate();
//   const [tradeRequests, setTradeRequests] = useState([]);
//   const [offers, setOffers] = useState({});
//   const [users, setUsers] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTradeRequestsAndOffers = async () => {
//       if (!isLoggedIn) {
//         toast.error("Please login to view your trade list", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//         navigate("/login");
//         return;
//       }

//       try {
//         // Lấy danh sách trade requests của user
//         const tradeRequestsResponse = await api.get(`/trade_requests/user/${userId}`);
//         const tradeRequestsData = tradeRequestsResponse.data;

//         // Lấy danh sách offer cho từng trade request
//         const offersPromises = tradeRequestsData.map(async (trade) => {
//           try {
//             const offersResponse = await api.get(`/offer/request/${trade._id}`);
//             return { requestId: trade._id, offers: offersResponse.data };
//           } catch (error) {
//             console.error(`Error fetching offers for trade request ${trade._id}:`, error.response?.data || error.message);
//             return { requestId: trade._id, offers: [] };
//           }
//         });

//         const offersData = await Promise.all(offersPromises);
//         const offersMap = offersData.reduce((acc, { requestId, offers }) => {
//           acc[requestId] = offers;
//           return acc;
//         }, {});

//         // Lấy thông tin user cho từng offer
//         const userIds = new Set();
//         Object.values(offersMap).forEach((offerList) => {
//           offerList.forEach((offer) => userIds.add(offer.userId));
//         });

//         const userPromises = Array.from(userIds).map(async (userId) => {
//           try {
//             const userResponse = await api.get(`/users/${userId}`);
//             return { userId, user: userResponse.data.user };
//           } catch (error) {
//             console.error(`Error fetching user ${userId}:`, error.response?.data || error.message);
//             return { userId, user: null };
//           }
//         });

//         const usersData = await Promise.all(userPromises);
//         const usersMap = usersData.reduce((acc, { userId, user }) => {
//           if (user) acc[userId] = user;
//           return acc;
//         }, {});

//         setTradeRequests(tradeRequestsData);
//         setOffers(offersMap);
//         setUsers(usersMap);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching trade requests:", error.response?.data || error.message);
//         setLoading(false);
//       }
//     };
//     fetchTradeRequestsAndOffers();
//   }, [isLoggedIn, userId, navigate]);

//   const handleDeleteTradeRequest = (tradeId) => {
//     setTradeRequests((prev) => prev.filter((trade) => trade._id !== tradeId));
//     setOffers((prev) => {
//       const updatedOffers = { ...prev };
//       delete updatedOffers[tradeId];
//       return updatedOffers;
//     });
//   };

//   const handleSelectOffer = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/select-offer/${offerId}`);
//       setOffers((prev) => {
//         const updatedOffers = { ...prev };
//         updatedOffers[requestId] = updatedOffers[requestId].map((offer) => {
//           if (offer._id === offerId) {
//             return { ...offer, offerStatus: "Accepted" };
//           }
//           return { ...offer, offerStatus: "Declined" };
//         });
//         return updatedOffers;
//       });
//       toast.success("Offer accepted successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error selecting offer:", error.response?.data || error.message);
//       toast.error("Failed to accept offer", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   if (loading) {
//     return <div>Loading trades...</div>;
//   }

//   return (
//     <div className="tradelist_page">
//       <h2>Trade Requests</h2>
//       {tradeRequests.length === 0 ? (
//         <p>No pending trades</p>
//       ) : (
//         tradeRequests.map((trade) => (
//           <TradeBlock
//             key={trade._id}
//             trade={trade}
//             offers={offers[trade._id] || []}
//             users={users}
//             onDeleteTradeRequest={handleDeleteTradeRequest}
//             onSelectOffer={handleSelectOffer}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// export default Tradelist;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../assets/css/Tradelist.css";
// import { useAuth } from "../context/auth.jsx";
// import io from "socket.io-client";
// import { toast } from "react-toastify";
// import api from "../config/axios.js";

// // Kết nối tới Socket.IO server
// const socket = io("http://localhost:3000", {
//   withCredentials: true,
//   extraHeaders: {
//     "Content-Type": "application/json",
//   },
// });

// // const ChatModal = ({ isOpen, onClose, senderId, ownerId }) => {
// //   const [messages, setMessages] = useState([]);
// //   const [newMessage, setNewMessage] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     if (isOpen) {
// //       fetchMessages();
// //     }
// //   }, [isOpen, senderId, ownerId]);

// const ChatModal = ({ isOpen, onClose, tradeId, senderId, ownerId }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Cuộn xuống cuối danh sách tin nhắn khi có tin nhắn mới
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     if (isOpen && tradeId) {
//       // Tham gia phòng chat dựa trên tradeId
//       socket.emit("join_trade", tradeId);

//       // Lấy lịch sử tin nhắn
//       fetchMessages();

//       // Lắng nghe tin nhắn mới từ Socket.IO
//       socket.on("receive_message", (message) => {
//         setMessages((prev) => [...prev, message]);
//       });

//       // Dọn dẹp khi component unmount
//       return () => {
//         socket.off("receive_message");
//       };
//     }
//   }, [isOpen, tradeId]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // const fetchMessages = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const fetchedMessages = await api.get(`/messages?senderId=${senderId}&ownerId=${ownerId}`);
//   //     setMessages(fetchedMessages.data);
//   //   } catch (error) {
//   //     console.error("Error fetching messages:", error.response?.data || error.message);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const fetchMessages = async () => {
//     setLoading(true);
//     try {
//       const fetchedMessages = await api.get(`/messages/${tradeId}`);
//       setMessages(fetchedMessages.data);
//     } catch (error) {
//       console.error("Error fetching messages:", error.response?.data || error.message);
//       toast.error("Failed to load messages", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const handleSendMessage = async (e) => {
//   //   e.preventDefault();
//   //   if (!newMessage.trim()) return;

//   //   try {
//   //     const sentMessage = await api.post("/messages", {
//   //       senderId,
//   //       ownerId,
//   //       text: newMessage,
//   //     });
//   //     setMessages([...messages, sentMessage.data]);
//   //     setNewMessage("");
//   //   } catch (error) {
//   //     console.error("Error sending message:", error.response?.data || error.message);
//   //   }
//   // };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     try {
//       const messageData = {
//         tradeId,
//         senderId,
//         receiverId: senderId === ownerId ? ownerId : senderId, // Đảm bảo gửi đúng người nhận
//         message: newMessage,
//       };

//       // Gửi tin nhắn qua API để lưu vào database
//       const sentMessage = await api.post("/messages", messageData);

//       // Gửi tin nhắn qua Socket.IO để hiển thị thời gian thực
//       socket.emit("send_message", {
//         tradeId,
//         senderId,
//         receiverId: senderId === ownerId ? ownerId : senderId,
//         message: newMessage,
//         createdAt: new Date().toISOString(),
//       });

//       setNewMessage("");
//     } catch (error) {
//       console.error("Error sending message:", error.response?.data || error.message);
//       toast.error("Failed to send message", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   if (!isOpen) return null;

// //   return (
// //     <div className="modal-overlay">
// //       <div className="chat-modal">
// //         <div className="chat-header">
// //           <h3>
// //             Chat between #{senderId} and #{ownerId}
// //           </h3>
// //           <button className="close-btn" onClick={onClose}>
// //             ×
// //           </button>
// //         </div>
// //         <div className="chat-messages">
// //           {loading ? (
// //             <p>Loading messages...</p>
// //           ) : messages.length === 0 ? (
// //             <p>No messages yet</p>
// //           ) : (
// //             messages.map((msg) => (
// //               <div
// //                 key={msg._id}
// //                 className={`message ${
// //                   msg.senderId === ownerId ? "sent" : "received"
// //                 }`}
// //               >
// //                 <p>{msg.text}</p>
// //                 <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
// //               </div>
// //             ))
// //           )}
// //         </div>
// //         <form className="chat-input" onSubmit={handleSendMessage}>
// //           <input
// //             type="text"
// //             value={newMessage}
// //             onChange={(e) => setNewMessage(e.target.value)}
// //             placeholder="Type a message..."
// //             disabled={loading}
// //           />
// //           <button type="submit" disabled={loading}>
// //             Send
// //           </button>
// //           <button onClick={onClose} disabled={loading}>
// //             Close
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// return (
//   <div className="modal-overlay">
//     <div className="chat-modal">
//       <div className="chat-header">
//         <h3>Chat for Trade #{tradeId}</h3>
//         <button className="close-btn" onClick={onClose}>
//           ×
//         </button>
//       </div>
//       <div className="chat-messages">
//         {loading ? (
//           <p>Loading messages...</p>
//         ) : messages.length === 0 ? (
//           <p>No messages yet</p>
//         ) : (
//           messages.map((msg) => (
//             <div
//               key={msg._id}
//               className={`message ${
//                 msg.senderId === senderId ? "sent" : "received"
//               }`}
//             >
//               <p>{msg.message}</p>
//               <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
//             </div>
//           ))
//         )}
//         <div ref={messagesEndRef} />
//       </div>
//       <form className="chat-input" onSubmit={handleSendMessage}>
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type a message..."
//           disabled={loading}
//         />
//         <button type="submit" disabled={loading}>
//           Send
//         </button>
//         <button type="button" onClick={onClose} disabled={loading}>
//           Close
//         </button>
//       </form>
//     </div>
//   </div>
// );
// };

// const TradeBlock = ({ trade, offers, users, onDeleteTradeRequest, onSelectOffer, onDeclineOffer, onCompleteTrade, onCancelTrade }) => {
//   const [showChatPopup, setChatPopup] = useState(false);
//   const [selectedOffer, setSelectedOffer] = useState(null);

//   const handleDelete = async () => {
//     try {
//       await api.delete(`/trade_requests/${trade._id}`);
//       onDeleteTradeRequest(trade._id);
//       toast.success("Trade request deleted successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error deleting trade request:", error.response?.data || error.message);
//       toast.error("Failed to delete trade request", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleAcceptOffer = (offer) => {
//     setSelectedOffer(offer);
//     setChatPopup(true);
//     onSelectOffer(trade._id, offer._id);
//   };

//   const handleDeclineOffer = (offer) => {
//     onDeclineOffer(trade._id, offer._id);
//   };

//   const handleCompleteTrade = () => {
//     onCompleteTrade(trade._id, selectedOffer._id);
//   };

//   const handleCancelTrade = () => {
//     onCancelTrade(trade._id, selectedOffer._id);
//   };

//   const hasAcceptedOffer = offers.some((offer) => offer.offerStatus === "Accepted");
//   const acceptedOffer = offers.find((offer) => offer.offerStatus === "Accepted");

//   return (
//     <div className="trade_request" style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "20px", borderRadius: "5px" }}>
//       <div>
//         <h3>Trade #{trade._id}</h3>
//         <p>Requesting: {trade.requestItem}</p>
//         <p>
//           My Item:{" "}
//           <img
//             src={trade.requestImage}
//             alt="Requested Item"
//             style={{ width: "100px", height: "100px" }}
//           />
//         </p>
//         <h4>Offers:</h4>
//         {offers.length === 0 ? (
//           <p>No offers yet</p>
//         ) : (
//           offers.map((offer) => (
//             <div key={offer._id} style={{ marginBottom: "10px" }}>
//               <p>Sender: {users[offer.userId]?.name || offer.userId}</p>
//               <p>Offering: {offer.offerItem}</p>
//               <p>
//                 Offer Item:{" "}
//                 <img
//                   src={offer.offerImage}
//                   alt="Offered Item"
//                   style={{ width: "80px", height: "80px" }}
//                 />
//               </p>
//               <p>Status: {offer.offerStatus}</p>
//               {offer.offerStatus === "Pending" && !hasAcceptedOffer && (
//                 <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
//                   <button
//                     onClick={() => handleAcceptOffer(offer)}
//                     style={{ backgroundColor: "green", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     onClick={() => handleDeclineOffer(offer)}
//                     style={{ backgroundColor: "gray", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//                   >
//                     Decline
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//       <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
//         <button
//           onClick={handleDelete}
//           style={{ backgroundColor: "red", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px", alignSelf: "flex-end" }}
//         >
//           Delete
//         </button>
//         {hasAcceptedOffer && (
//           <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//             <div style={{ display: "flex", gap: "10px" }}>
//               <button
//                 onClick={handleCompleteTrade}
//                 style={{ backgroundColor: "blue", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//               >
//                 Complete
//               </button>
//               <button
//                 onClick={handleCancelTrade}
//                 style={{ backgroundColor: "orange", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//               >
//                 Cancel
//               </button>
//             </div>
//             <button
//               onClick={() => {
//                 setSelectedOffer(acceptedOffer);
//                 setChatPopup(true);
//               }}
//               style={{ backgroundColor: "purple", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//             >
//               Chat
//             </button>
//           </div>
//         )}
//       </div>
//       {selectedOffer && (
//         <ChatModal
//           isOpen={showChatPopup}
//           onClose={() => {
//             setChatPopup(false);
//             setSelectedOffer(null);
//           }}
//           senderId={selectedOffer.userId}
//           ownerId={trade.userId}
//         />
//       )}
//     </div>
//   );
// };

// const Tradelist = () => {
//   const { isLoggedIn, userId, username } = useAuth();
//   const navigate = useNavigate();
//   const [tradeRequests, setTradeRequests] = useState([]);
//   const [offers, setOffers] = useState({});
//   const [users, setUsers] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTradeRequestsAndOffers = async () => {
//       if (!isLoggedIn) {
//         toast.error("Please login to view your trade list", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//         navigate("/login");
//         return;
//       }

//       try {
//         const tradeRequestsResponse = await api.get(`/trade_requests/user/${userId}`);
//         const tradeRequestsData = tradeRequestsResponse.data;

//         const offersPromises = tradeRequestsData.map(async (trade) => {
//           try {
//             const offersResponse = await api.get(`/offer/request/${trade._id}`);
//             return { requestId: trade._id, offers: offersResponse.data };
//           } catch (error) {
//             console.error(`Error fetching offers for trade request ${trade._id}:`, error.response?.data || error.message);
//             return { requestId: trade._id, offers: [] };
//           }
//         });

//         const offersData = await Promise.all(offersPromises);
//         const offersMap = offersData.reduce((acc, { requestId, offers }) => {
//           acc[requestId] = offers;
//           return acc;
//         }, {});

//         const userIds = new Set();
//         Object.values(offersMap).forEach((offerList) => {
//           offerList.forEach((offer) => userIds.add(offer.userId));
//         });

//         const userPromises = Array.from(userIds).map(async (userId) => {
//           try {
//             const userResponse = await api.get(`/user/${userId}`);
//             return { userId, user: userResponse.data.user };
//           } catch (error) {
//             console.error(`Error fetching user ${userId}:`, error.response?.data || error.message);
//             return { userId, user: null };
//           }
//         });

//         const usersData = await Promise.all(userPromises);
//         const usersMap = usersData.reduce((acc, { userId, user }) => {
//           if (user) acc[userId] = user;
//           return acc;
//         }, {});

//         setTradeRequests(tradeRequestsData);
//         setOffers(offersMap);
//         setUsers(usersMap);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching trade requests:", error.response?.data || error.message);
//         setLoading(false);
//       }
//     };
//     fetchTradeRequestsAndOffers();
//   }, [isLoggedIn, userId, navigate]);

//   const handleDeleteTradeRequest = (tradeId) => {
//     setTradeRequests((prev) => prev.filter((trade) => trade._id !== tradeId));
//     setOffers((prev) => {
//       const updatedOffers = { ...prev };
//       delete updatedOffers[tradeId];
//       return updatedOffers;
//     });
//   };

//   const handleSelectOffer = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/select-offer/${offerId}`);
//       setOffers((prev) => {
//         const updatedOffers = { ...prev };
//         updatedOffers[requestId] = updatedOffers[requestId].map((offer) => {
//           if (offer._id === offerId) {
//             return { ...offer, offerStatus: "Accepted" };
//           }
//           return { ...offer, offerStatus: "Declined" };
//         });
//         return updatedOffers;
//       });
//       toast.success("Offer accepted successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error selecting offer:", error.response?.data || error.message);
//       toast.error("Failed to accept offer", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleDeclineOffer = async (requestId, offerId) => {
//     try {
//       await api.post(`/offers/${offerId}/decline`);
//       setOffers((prev) => {
//         const updatedOffers = { ...prev };
//         updatedOffers[requestId] = updatedOffers[requestId].map((offer) => {
//           if (offer._id === offerId) {
//             return { ...offer, offerStatus: "Declined" };
//           }
//           return offer;
//         });
//         return updatedOffers;
//       });
//       toast.success("Offer declined successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error declining offer:", error.response?.data || error.message);
//       toast.error("Failed to decline offer", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleCompleteTrade = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/complete`, { offerId });
//       setTradeRequests((prev) => prev.filter((trade) => trade._id !== requestId));
//       setOffers((prev) => {
//         const updatedOffers = { ...prev };
//         delete updatedOffers[requestId];
//         return updatedOffers;
//       });
//       toast.success("Trade completed successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error completing trade:", error.response?.data || error.message);
//       toast.error("Failed to complete trade", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleCancelTrade = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/cancel`, { offerId });
//       setOffers((prev) => {
//         const updatedOffers = { ...prev };
//         updatedOffers[requestId] = updatedOffers[requestId].map((offer) => {
//           if (offer._id === offerId) {
//             return { ...offer, offerStatus: "Cancelled" };
//           }
//           return offer;
//         });
//         return updatedOffers;
//       });
//       toast.success("Trade cancelled successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error cancelling trade:", error.response?.data || error.message);
//       toast.error("Failed to cancel trade", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   if (loading) {
//     return <div>Loading trades...</div>;
//   }

//   return (
//     <div className="tradelist_page">
//       <h2>Trade Requests</h2>
//       {tradeRequests.length === 0 ? (
//         <p>No pending trades</p>
//       ) : (
//         tradeRequests.map((trade) => (
//           <TradeBlock
//             key={trade._id}
//             trade={trade}
//             offers={offers[trade._id] || []}
//             users={users}
//             onDeleteTradeRequest={handleDeleteTradeRequest}
//             onSelectOffer={handleSelectOffer}
//             onDeclineOffer={handleDeclineOffer}
//             onCompleteTrade={handleCompleteTrade}
//             onCancelTrade={handleCancelTrade}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// export default Tradelist;
// //học

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../assets/css/Tradelist.css";
// import { useAuth } from "../context/auth.jsx";
// import { toast } from "react-toastify";
// import api from "../config/axios.js";
// import ChatModal from "./ChatModal.jsx";


// const TradeBlock = ({ trade, offers, users, onDeleteTradeRequest, onSelectOffer, onDeclineOffer, onCompleteTrade, onCancelTrade }) => {
//   const [showChatPopup, setChatPopup] = useState(false);
//   const [selectedOffer, setSelectedOffer] = useState(null);

//   const handleDelete = async () => {
//     try {
//       await api.delete(`/trade_requests/${trade._id}`);
//       onDeleteTradeRequest(trade._id);
//       toast.success("Trade request deleted successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error deleting trade request:", error.response?.data || error.message);
//       toast.error("Failed to delete trade request", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleAcceptOffer = (offer) => {
//     setSelectedOffer(offer);
//     onSelectOffer(trade._id, offer._id);
//     // Không mở popup chat ở đây
//   };

//   const handleDeclineOffer = (offer) => {
//     onDeclineOffer(trade._id, offer._id);
//   };

//   const handleCompleteTrade = () => {
//     onCompleteTrade(trade._id, selectedOffer._id);
//   };

//   const handleCancelTrade = () => {
//     onCancelTrade(trade._id, selectedOffer._id);
//   };

//   const hasAcceptedOffer = offers.some((offer) => offer.offerStatus === "Accepted");
//   const acceptedOffer = offers.find((offer) => offer.offerStatus === "Accepted");

//   return (
//     <div className="trade_request" style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "20px", borderRadius: "5px" }}>
//       <div>
//         <h3>Trade #{trade._id}</h3>
//         <p>Requesting: {trade.requestItem}</p>
//         <p>
//           My Item:{" "}
//           <img
//             src={trade.requestImage}
//             alt="Requested Item"
//             style={{ width: "100px", height: "100px" }}
//           />
//         </p>
//         <h4>Offers:</h4>
//         {offers.length === 0 ? (
//           <p>No offers yet</p>
//         ) : (
//           offers.map((offer) => (
//             <div key={offer._id} style={{ marginBottom: "10px" }}>
//               <p>Sender: {users[offer.userId]?.name || offer.userId}</p>
//               <p>Offering: {offer.offerItem}</p>
//               <p>
//                 Offer Item:{" "}
//                 <img
//                   src={offer.offerImage}
//                   alt="Offered Item"
//                   style={{ width: "80px", height: "80px" }}
//                 />
//               </p>
//               <p>Status: {offer.offerStatus}</p>
//               {offer.offerStatus === "Pending" && !hasAcceptedOffer && (
//                 <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
//                   <button
//                     onClick={() => handleAcceptOffer(offer)}
//                     style={{ backgroundColor: "green", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     onClick={() => handleDeclineOffer(offer)}
//                     style={{ backgroundColor: "gray", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//                   >
//                     Decline
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//       <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
//         <button
//           onClick={handleDelete}
//           style={{ backgroundColor: "red", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px", alignSelf: "flex-end" }}
//         >
//           Delete
//         </button>
//         {hasAcceptedOffer && (
//           <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//             <div style={{ display: "flex", gap: "10px" }}>
//               <button
//                 onClick={handleCompleteTrade}
//                 style={{ backgroundColor: "blue", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//               >
//                 Complete
//               </button>
//               <button
//                 onClick={handleCancelTrade}
//                 style={{ backgroundColor: "orange", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//               >
//                 Cancel
//               </button>
//             </div>
//             <button
//               onClick={() => {
//                 setSelectedOffer(acceptedOffer);
//                 setChatPopup(true);
//               }}
//               style={{ backgroundColor: "purple", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//             >
//               Chat
//             </button>
//           </div>
//         )}
//       </div>
//       {selectedOffer && (
//         <ChatModal
//           isOpen={showChatPopup}
//           onClose={() => {
//             setChatPopup(false);
//             setSelectedOffer(null);
//           }}
//           tradeId={trade._id}
//           senderId={trade.userId} // Người tạo trade request
//           ownerId={selectedOffer.userId} // Người tạo offer
//         />
//       )}
//     </div>
//   );
// };

// const Tradelist = () => {
//   const { isLoggedIn, userId, username } = useAuth();
//   const navigate = useNavigate();
//   const [tradeRequests, setTradeRequests] = useState([]);
//   const [offers, setOffers] = useState({});
//   const [users, setUsers] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTradeRequestsAndOffers = async () => {
//       if (!isLoggedIn) {
//         toast.error("Please login to view your trade list", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//         navigate("/login");
//         return;
//       }

//       try {
//         const tradeRequestsResponse = await api.get(`/trade_requests/user/${userId}`);
//         const tradeRequestsData = tradeRequestsResponse.data;

//         const offersPromises = tradeRequestsData.map(async (trade) => {
//           try {
//             const offersResponse = await api.get(`/offer/request/${trade._id}`);
//             return { requestId: trade._id, offers: offersResponse.data };
//           } catch (error) {
//             console.error(`Error fetching offers for trade request ${trade._id}:`, error.response?.data || error.message);
//             return { requestId: trade._id, offers: [] };
//           }
//         });

//         const offersData = await Promise.all(offersPromises);
//         const offersMap = offersData.reduce((acc, { requestId, offers }) => {
//           acc[requestId] = offers;
//           return acc;
//         }, {});

//         const userIds = new Set();
//         Object.values(offersMap).forEach((offerList) => {
//           offerList.forEach((offer) => userIds.add(offer.userId));
//         });

//         const userPromises = Array.from(userIds).map(async (userId) => {
//           try {
//             const userResponse = await api.get(`/user/${userId}`);
//             return { userId, user: userResponse.data.user };
//           } catch (error) {
//             console.error(`Error fetching user ${userId}:`, error.response?.data || error.message);
//             return { userId, user: null };
//           }
//         });

//         const usersData = await Promise.all(userPromises);
//         const usersMap = usersData.reduce((acc, { userId, user }) => {
//           if (user) acc[userId] = user;
//           return acc;
//         }, {});

//         setTradeRequests(tradeRequestsData);
//         setOffers(offersMap);
//         setUsers(usersMap);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching trade requests:", error.response?.data || error.message);
//         setLoading(false);
//       }
//     };
//     fetchTradeRequestsAndOffers();
//   }, [isLoggedIn, userId, navigate]);

//   const handleDeleteTradeRequest = (tradeId) => {
//     setTradeRequests((prev) => prev.filter((trade) => trade._id !== tradeId));
//     setOffers((prev) => {
//       const updatedOffers = { ...prev };
//       delete updatedOffers[tradeId];
//       return updatedOffers;
//     });
//   };

//   const handleSelectOffer = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/select-offer/${offerId}`);
//       setOffers((prev) => {
//         const updatedOffers = { ...prev };
//         updatedOffers[requestId] = updatedOffers[requestId].map((offer) => {
//           if (offer._id === offerId) {
//             return { ...offer, offerStatus: "Accepted" };
//           }
//           return { ...offer, offerStatus: "Declined" };
//         });
//         return updatedOffers;
//       });
//       toast.success("Offer accepted successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error selecting offer:", error.response?.data || error.message);
//       toast.error("Failed to accept offer", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleDeclineOffer = async (requestId, offerId) => {
//     try {
//       await api.post(`/offers/${offerId}/decline`);
//       setOffers((prev) => {
//         const updatedOffers = { ...prev };
//         updatedOffers[requestId] = updatedOffers[requestId].map((offer) => {
//           if (offer._id === offerId) {
//             return { ...offer, offerStatus: "Declined" };
//           }
//           return offer;
//         });
//         return updatedOffers;
//       });
//       toast.success("Offer declined successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error declining offer:", error.response?.data || error.message);
//       toast.error("Failed to decline offer", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleCompleteTrade = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/complete`, { offerId });
//       setTradeRequests((prev) => prev.filter((trade) => trade._id !== requestId));
//       setOffers((prev) => {
//         const updatedOffers = { ...prev };
//         delete updatedOffers[requestId];
//         return updatedOffers;
//       });
//       toast.success("Trade completed successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error completing trade:", error.response?.data || error.message);
//       toast.error("Failed to complete trade", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleCancelTrade = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/cancel`, { offerId });
//       setOffers((prev) => {
//         const updatedOffers = { ...prev };
//         updatedOffers[requestId] = updatedOffers[requestId].map((offer) => {
//           if (offer._id === offerId) {
//             return { ...offer, offerStatus: "Cancelled" };
//           }
//           return offer;
//         });
//         return updatedOffers;
//       });
//       toast.success("Trade cancelled successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error cancelling trade:", error.response?.data || error.message);
//       toast.error("Failed to cancel trade", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   if (loading) {
//     return <div>Loading trades...</div>;
//   }

//   return (
//     <div className="tradelist_page">
//       <h2>Trade Requests</h2>
//       {tradeRequests.length === 0 ? (
//         <p>No pending trades</p>
//       ) : (
//         tradeRequests.map((trade) => (
//           <TradeBlock
//             key={trade._id}
//             trade={trade}
//             offers={offers[trade._id] || []}
//             users={users}
//             onDeleteTradeRequest={handleDeleteTradeRequest}
//             onSelectOffer={handleSelectOffer}
//             onDeclineOffer={handleDeclineOffer}
//             onCompleteTrade={handleCompleteTrade}
//             onCancelTrade={handleCancelTrade}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// export default Tradelist;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../assets/css/Tradelist.css";
// import { useAuth } from "../context/auth.jsx";
// import { toast } from "react-toastify";
// import api from "../config/axios.js";
// import ChatModal from "./ChatModal.jsx"; // Import ChatModal

// const TradeBlock = ({ trade, offers, users, onDeleteTradeRequest, onSelectOffer, onDeclineOffer, onCompleteTrade, onCancelTrade }) => {
//   const [showChatPopup, setChatPopup] = useState(false);
//   const [selectedOffer, setSelectedOffer] = useState(null);

//   const handleDelete = async () => {
//     try {
//       await api.delete(`/trade_requests/${trade._id}`);
//       onDeleteTradeRequest(trade._id);
//       toast.success("Trade request deleted successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error deleting trade request:", error.response?.data || error.message);
//       toast.error("Failed to delete trade request", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleAcceptOffer = (offer) => {
//     setSelectedOffer(offer);
//     onSelectOffer(trade._id, offer._id);
//     // Không mở popup chat ở đây
//   };

//   const handleDeclineOffer = (offer) => {
//     onDeclineOffer(trade._id, offer._id);
//   };

//   const handleCompleteTrade = () => {
//     onCompleteTrade(trade._id, selectedOffer._id);
//   };

//   const handleCancelTrade = () => {
//     onCancelTrade(trade._id, selectedOffer._id);
//   };

//   const hasAcceptedOffer = offers.some((offer) => offer.offerStatus === "Accepted");
//   const acceptedOffer = offers.find((offer) => offer.offerStatus === "Accepted");

//   return (
//     <div className="trade_request" style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "20px", borderRadius: "5px" }}>
//       <div>
//         <h3>Trade #{trade._id}</h3>
//         <p>Requesting: {trade.requestItem}</p>
//         <p>
//           My Item:{" "}
//           <img
//             src={trade.requestImage}
//             alt="Requested Item"
//             style={{ width: "100px", height: "100px" }}
//           />
//         </p>
//         <h4>Offers:</h4>
//         {offers.length === 0 ? (
//           <p>No offers yet</p>
//         ) : (
//           offers.map((offer) => (
//             <div key={offer._id} style={{ marginBottom: "10px" }}>
//               <p>Sender: {users[offer.userId]?.name || offer.userId}</p>
//               <p>Offering: {offer.offerItem}</p>
//               <p>
//                 Offer Item:{" "}
//                 <img
//                   src={offer.offerImage}
//                   alt="Offered Item"
//                   style={{ width: "80px", height: "80px" }}
//                 />
//               </p>
//               <p>Status: {offer.offerStatus}</p>
//               {offer.offerStatus === "Pending" && !hasAcceptedOffer && (
//                 <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
//                   <button
//                     onClick={() => handleAcceptOffer(offer)}
//                     style={{ backgroundColor: "green", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     onClick={() => handleDeclineOffer(offer)}
//                     style={{ backgroundColor: "gray", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//                   >
//                     Decline
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//       <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
//         <button
//           onClick={handleDelete}
//           style={{ backgroundColor: "red", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px", alignSelf: "flex-end" }}
//         >
//           Delete
//         </button>
//         {hasAcceptedOffer && (
//           <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//             <div style={{ display: "flex", gap: "10px" }}>
//               <button
//                 onClick={handleCompleteTrade}
//                 style={{ backgroundColor: "blue", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//               >
//                 Complete
//               </button>
//               <button
//                 onClick={handleCancelTrade}
//                 style={{ backgroundColor: "orange", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//               >
//                 Cancel
//               </button>
//             </div>
//             <button
//               onClick={() => {
//                 setSelectedOffer(acceptedOffer);
//                 setChatPopup(true);
//               }}
//               style={{ backgroundColor: "purple", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//             >
//               Chat
//             </button>
//           </div>
//         )}
//       </div>
//       {selectedOffer && (
//         <ChatModal
//           isOpen={showChatPopup}
//           onClose={() => {
//             setChatPopup(false);
//             setSelectedOffer(null);
//           }}
//           tradeId={trade._id}
//           senderId={trade.userId} // Người tạo trade request
//           ownerId={selectedOffer.userId} // Người tạo offer
//         />
//       )}
//     </div>
//   );
// };

// const Tradelist = () => {
//   const { isLoggedIn, userId, username } = useAuth();
//   const navigate = useNavigate();
//   const [tradeRequests, setTradeRequests] = useState([]);
//   const [offers, setOffers] = useState({});
//   const [users, setUsers] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTradeRequestsAndOffers = async () => {
//       if (!isLoggedIn) {
//         toast.error("Please login to view your trade list", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//         navigate("/authpage");
//         return;
//       }

//       try {
//         const tradeRequestsResponse = await api.get(`/trade_requests/user/${userId}`);
//         const tradeRequestsData = tradeRequestsResponse.data;

//         const offersPromises = tradeRequestsData.map(async (trade) => {
//           try {
//             const offersResponse = await api.get(`/offer/request/${trade._id}`);
//             return { requestId: trade._id, offers: offersResponse.data };
//           } catch (error) {
//             console.error(`Error fetching offers for trade request ${trade._id}:`, error.response?.data || error.message);
//             return { requestId: trade._id, offers: [] };
//           }
//         });

//         const offersData = await Promise.all(offersPromises);
//         const offersMap = offersData.reduce((acc, { requestId, offers }) => {
//           acc[requestId] = offers;
//           return acc;
//         }, {});

//         const userIds = new Set();
//         Object.values(offersMap).forEach((offerList) => {
//           offerList.forEach((offer) => userIds.add(offer.userId));
//         });

//         const userPromises = Array.from(userIds).map(async (userId) => {
//           try {
//             const userResponse = await api.get(`/user/${userId}`);
//             return { userId, user: userResponse.data.user };
//           } catch (error) {
//             console.error(`Error fetching user ${userId}:`, error.response?.data || error.message);
//             return { userId, user: null };
//           }
//         });

//         const usersData = await Promise.all(userPromises);
//         const usersMap = usersData.reduce((acc, { userId, user }) => {
//           if (user) acc[userId] = user;
//           return acc;
//         }, {});

//         setTradeRequests(tradeRequestsData);
//         setOffers(offersMap);
//         setUsers(usersMap);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching trade requests:", error.response?.data || error.message);
//         setLoading(false);
//       }
//     };
//     fetchTradeRequestsAndOffers();
//   }, [isLoggedIn, userId, navigate]);

//   const handleDeleteTradeRequest = (tradeId) => {
//     setTradeRequests((prev) => prev.filter((trade) => trade._id !== tradeId));
//     setOffers((prev) => {
//       const updatedOffers = { ...prev };
//       delete updatedOffers[tradeId];
//       return updatedOffers;
//     });
//   };

//   const handleSelectOffer = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/select-offer/${offerId}`);
//       setOffers((prev) => {
//         const updatedOffers = { ...prev };
//         updatedOffers[requestId] = updatedOffers[requestId].map((offer) => {
//           if (offer._id === offerId) {
//             return { ...offer, offerStatus: "Accepted" };
//           }
//           return { ...offer, offerStatus: "Declined" };
//         });
//         return updatedOffers;
//       });
//       toast.success("Offer accepted successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error selecting offer:", error.response?.data || error.message);
//       toast.error("Failed to accept offer", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleDeclineOffer = async (requestId, offerId) => {
//     try {
//       await api.post(`/offers/${offerId}/decline`);
//       setOffers((prev) => {
//         const updatedOffers = { ...prev };
//         updatedOffers[requestId] = updatedOffers[requestId].map((offer) => {
//           if (offer._id === offerId) {
//             return { ...offer, offerStatus: "Declined" };
//           }
//           return offer;
//         });
//         return updatedOffers;
//       });
//       toast.success("Offer declined successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error declining offer:", error.response?.data || error.message);
//       toast.error("Failed to decline offer", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleCompleteTrade = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/complete`, { offerId });
//       setTradeRequests((prev) => prev.filter((trade) => trade._id !== requestId));
//       setOffers((prev) => {
//         const updatedOffers = { ...prev };
//         delete updatedOffers[requestId];
//         return updatedOffers;
//       });
//       toast.success("Trade completed successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error completing trade:", error.response?.data || error.message);
//       toast.error("Failed to complete trade", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleCancelTrade = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/cancel`, { offerId });
//       setOffers((prev) => {
//         const updatedOffers = { ...prev };
//         updatedOffers[requestId] = updatedOffers[requestId].map((offer) => {
//           if (offer._id === offerId) {
//             return { ...offer, offerStatus: "Cancelled" };
//           }
//           return offer;
//         });
//         return updatedOffers;
//       });
//       toast.success("Trade cancelled successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error cancelling trade:", error.response?.data || error.message);
//       toast.error("Failed to cancel trade", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   if (loading) {
//     return <div>Loading trades...</div>;
//   }

//   return (
//     <div className="tradelist_page">
//       <h2>Trade Requests</h2>
//       {tradeRequests.length === 0 ? (
//         <p>No pending trades</p>
//       ) : (
//         tradeRequests.map((trade) => (
//           <TradeBlock
//             key={trade._id}
//             trade={trade}
//             offers={offers[trade._id] || []}
//             users={users}
//             onDeleteTradeRequest={handleDeleteTradeRequest}
//             onSelectOffer={handleSelectOffer}
//             onDeclineOffer={handleDeclineOffer}
//             onCompleteTrade={handleCompleteTrade}
//             onCancelTrade={handleCancelTrade}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// export default Tradelist;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../assets/css/Tradelist.css";
// import { useAuth } from "../context/auth.jsx";
// import { toast } from "react-toastify";
// import api from "../config/axios.js";
// import ChatModal from "./ChatModal.jsx";

// const TradeBlock = ({ trade, offers, users, onDeleteTradeRequest, onSelectOffer, onDeclineOffer, onCompleteTrade, onCancelTrade }) => {
//   const [showChatPopup, setChatPopup] = useState(false);
//   const [selectedOffer, setSelectedOffer] = useState(null);

//   const handleDelete = async () => {
//     try {
//       await api.delete(`/trade_requests/${trade._id}`);
//       onDeleteTradeRequest(trade._id);
//       toast.success("Trade request deleted successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error deleting trade request:", error.response?.data || error.message);
//       toast.error("Failed to delete trade request", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleAcceptOffer = (offer) => {
//     setSelectedOffer(offer);
//     onSelectOffer(trade._id, offer._id);
//   };

//   const handleDeclineOffer = (offer) => {
//     onDeclineOffer(trade._id, offer._id);
//   };

//   const handleCompleteTrade = () => {
//     onCompleteTrade(trade._id, selectedOffer._id);
//   };

//   const handleCancelTrade = () => {
//     onCancelTrade(trade._id, selectedOffer._id);
//   };

//   const hasAcceptedOffer = offers.some((offer) => offer.offerStatus === "Accepted");
//   const acceptedOffer = offers.find((offer) => offer.offerStatus === "Accepted");

//   return (
//     <div className="trade_request" style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "20px", borderRadius: "5px" }}>
//       <div>
//         <h3>Trade #{trade._id}</h3>
//         <p>Requesting: {trade.requestItem}</p>
//         <p>
//           My Item:{" "}
//           <img
//             src={trade.requestImage}
//             alt="Requested Item"
//             style={{ width: "100px", height: "100px" }}
//           />
//         </p>
//         <h4>Offers:</h4>
//         {offers.length === 0 ? (
//           <p>No offers yet</p>
//         ) : (
//           offers.map((offer) => (
//             <div key={offer._id} style={{ marginBottom: "10px" }}>
//               <p>Sender: {users[offer.userId]?.name || offer.userId}</p>
//               <p>Offering: {offer.offerItem}</p>
//               <p>
//                 Offer Item:{" "}
//                 <img
//                   src={offer.offerImage}
//                   alt="Offered Item"
//                   style={{ width: "80px", height: "80px" }}
//                 />
//               </p>
//               <p>Status: {offer.offerStatus}</p>
//               {offer.offerStatus === "Pending" && !hasAcceptedOffer && (
//                 <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
//                   <button
//                     onClick={() => handleAcceptOffer(offer)}
//                     style={{ backgroundColor: "green", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     onClick={() => handleDeclineOffer(offer)}
//                     style={{ backgroundColor: "gray", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//                   >
//                     Decline
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//       <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
//         <button
//           onClick={handleDelete}
//           style={{ backgroundColor: "red", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px", alignSelf: "flex-end" }}
//         >
//           Delete
//         </button>
//         {hasAcceptedOffer && (
//           <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//             <div style={{ display: "flex", gap: "10px" }}>
//               <button
//                 onClick={handleCompleteTrade}
//                 style={{ backgroundColor: "blue", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//               >
//                 Complete
//               </button>
//               <button
//                 onClick={handleCancelTrade}
//                 style={{ backgroundColor: "orange", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//               >
//                 Cancel
//               </button>
//             </div>
//             <button
//               onClick={() => {
//                 setSelectedOffer(acceptedOffer);
//                 setChatPopup(true);
//               }}
//               style={{ backgroundColor: "purple", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//             >
//               Chat
//             </button>
//           </div>
//         )}
//       </div>
//       {selectedOffer && (
//         <ChatModal
//           isOpen={showChatPopup}
//           onClose={() => {
//             setChatPopup(false);
//             setSelectedOffer(null);
//           }}
//           tradeId={trade._id}
//           senderId={trade.userId}
//           ownerId={selectedOffer.userId}
//         />
//       )}
//     </div>
//   );
// };

// const Tradelist = () => {
//   const { isLoggedIn, userId, username, loading } = useAuth(); // Add loading from useAuth
//   const navigate = useNavigate();
//   const [tradeRequests, setTradeRequests] = useState([]);
//   const [offers, setOffers] = useState({});
//   const [users, setUsers] = useState({});
//   const [dataLoading, setDataLoading] = useState(true); // Rename to avoid confusion with auth loading

//   useEffect(() => {
//     const fetchTradeRequestsAndOffers = async () => {
//       // Wait until auth loading is complete
//       if (loading) return;

//       // Now check if the user is logged in
//       if (!isLoggedIn) {
//         toast.error("Please login to view your trade list", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//         navigate("/authpage");
//         return;
//       }

//       try {
//         const tradeRequestsResponse = await api.get(`/trade_requests/user/${userId}`);
//         const tradeRequestsData = tradeRequestsResponse.data;

//         const offersPromises = tradeRequestsData.map(async (trade) => {
//           try {
//             const offersResponse = await api.get(`/offer/request/${trade._id}`);
//             return { requestId: trade._id, offers: offersResponse.data };
//           } catch (error) {
//             console.error(`Error fetching offers for trade request ${trade._id}:`, error.response?.data || error.message);
//             return { requestId: trade._id, offers: [] };
//           }
//         });

//         const offersData = await Promise.all(offersPromises);
//         const offersMap = offersData.reduce((acc, { requestId, offers }) => {
//           acc[requestId] = offers;
//           return acc;
//         }, {});

//         const userIds = new Set();
//         Object.values(offersMap).forEach((offerList) => {
//           offerList.forEach((offer) => userIds.add(offer.userId));
//         });

//         const userPromises = Array.from(userIds).map(async (userId) => {
//           try {
//             const userResponse = await api.get(`/user/${userId}`);
//             return { userId, user: userResponse.data.user };
//           } catch (error) {
//             console.error(`Error fetching user ${userId}:`, error.response?.data || error.message);
//             return { userId, user: null };
//           }
//         });

//         const usersData = await Promise.all(userPromises);
//         const usersMap = usersData.reduce((acc, { userId, user }) => {
//           if (user) acc[userId] = user;
//           return acc;
//         }, {});

//         setTradeRequests(tradeRequestsData);
//         setOffers(offersMap);
//         setUsers(usersMap);
//         setDataLoading(false);
//       } catch (error) {
//         console.error("Error fetching trade requests:", error.response?.data || error.message);
//         setDataLoading(false);
//       }
//     };
//     fetchTradeRequestsAndOffers();
//   }, [isLoggedIn, userId, navigate, loading]); // Add loading to dependencies

//   const handleDeleteTradeRequest = (tradeId) => {
//     setTradeRequests((prev) => prev.filter((trade) => trade._id !== tradeId));
//     setOffers((prev) => {
//       const updatedOffers = { ...prev };
//       delete updatedOffers[tradeId];
//       return updatedOffers;
//     });
//   };

//   const handleSelectOffer = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/select-offer/${offerId}`);
//       setOffers((prev) => {
//         const updatedOffers = { ...prev };
//         updatedOffers[requestId] = updatedOffers[requestId].map((offer) => {
//           if (offer._id === offerId) {
//             return { ...offer, offerStatus: "Accepted" };
//           }
//           return { ...offer, offerStatus: "Declined" };
//         });
//         return updatedOffers;
//       });
//       toast.success("Offer accepted successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error selecting offer:", error.response?.data || error.message);
//       toast.error("Failed to accept offer", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleDeclineOffer = async (requestId, offerId) => {
//     try {
//       await api.post(`/offers/${offerId}/decline`);
//       setOffers((prev) => {
//         const updatedOffers = { ...prev };
//         updatedOffers[requestId] = updatedOffers[requestId].map((offer) => {
//           if (offer._id === offerId) {
//             return { ...offer, offerStatus: "Declined" };
//           }
//           return offer;
//         });
//         return updatedOffers;
//       });
//       toast.success("Offer declined successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error declining offer:", error.response?.data || error.message);
//       toast.error("Failed to decline offer", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleCompleteTrade = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/complete`, { offerId });
//       setTradeRequests((prev) => prev.filter((trade) => trade._id !== requestId));
//       setOffers((prev) => {
//         const updatedOffers = { ...prev };
//         delete updatedOffers[requestId];
//         return updatedOffers;
//       });
//       toast.success("Trade completed successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error completing trade:", error.response?.data || error.message);
//       toast.error("Failed to complete trade", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleCancelTrade = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/cancel`, { offerId });
//       setOffers((prev) => {
//         const updatedOffers = { ...prev };
//         updatedOffers[requestId] = updatedOffers[requestId].map((offer) => {
//           if (offer._id === offerId) {
//             return { ...offer, offerStatus: "Cancelled" };
//           }
//           return offer;
//         });
//         return updatedOffers;
//       });
//       toast.success("Trade cancelled successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error cancelling trade:", error.response?.data || error.message);
//       toast.error("Failed to cancel trade", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   if (loading) {
//     return <div>Loading authentication...</div>;
//   }

//   if (dataLoading) {
//     return <div>Loading trades...</div>;
//   }

//   return (
//     <div className="tradelist_page">
//       <h2>Trade Requests</h2>
//       {tradeRequests.length === 0 ? (
//         <p>No pending trades</p>
//       ) : (
//         tradeRequests.map((trade) => (
//           <TradeBlock
//             key={trade._id}
//             trade={trade}
//             offers={offers[trade._id] || []}
//             users={users}
//             onDeleteTradeRequest={handleDeleteTradeRequest}
//             onSelectOffer={handleSelectOffer}
//             onDeclineOffer={handleDeclineOffer}
//             onCompleteTrade={handleCompleteTrade}
//             onCancelTrade={handleCancelTrade}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// export default Tradelist;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../assets/css/Tradelist.css";
// import { useAuth } from "../context/auth.jsx";
// import { toast } from "react-toastify";
// import api from "../config/axios.js";
// import ChatModal from "./ChatModal.jsx";

// const TradeBlock = ({ trade, offers, users, onDeleteTradeRequest, onSelectOffer, onDeclineOffer, onCompleteTrade, onCancelTrade }) => {
//   const [showChatPopup, setChatPopup] = useState(false);
//   const [selectedOffer, setSelectedOffer] = useState(null);

//   const handleDelete = async () => {
//     try {
//       await api.delete(`/trade_requests/${trade._id}`);
//       onDeleteTradeRequest(trade._id);
//       toast.success("Trade request deleted successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error deleting trade request:", error.response?.data || error.message);
//       toast.error("Failed to delete trade request", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleAcceptOffer = (offer) => {
//     setSelectedOffer(offer);
//     onSelectOffer(trade._id, offer._id);
//   };

//   const handleDeclineOffer = (offer) => {
//     onDeclineOffer(trade._id, offer._id);
//   };

//   const handleCompleteTrade = () => {
//     onCompleteTrade(trade._id, selectedOffer._id);
//   };

//   const handleCancelTrade = () => {
//     onCancelTrade(trade._id, selectedOffer._id);
//   };

//   const hasAcceptedOffer = offers.some((offer) => offer.offerStatus === "Accepted");
//   const acceptedOffer = offers.find((offer) => offer.offerStatus === "Accepted");

//   return (
//     <div className={`trade_request ${hasAcceptedOffer ? "accepted" : ""}`}>
//       <div>
//         <h3>Trade #{trade._id}</h3>
//         <p>Requesting: {trade.requestItem}</p>
//         <p>
//           My Item:{" "}
//           <img
//             src={trade.requestImage}
//             alt="Requested Item"
//             style={{ width: "100px", height: "100px" }}
//           />
//         </p>
//         <h4>Offers:</h4>
//         {offers.length === 0 ? (
//           <p>No offers yet</p>
//         ) : (
//           offers.map((offer) => (
//             <div key={offer._id} style={{ marginBottom: "10px" }}>
//               <p>Sender: {users[offer.userId]?.name || offer.userId}</p>
//               <p>Offering: {offer.offerItem}</p>
//               <p>
//                 Offer Item:{" "}
//                 <img
//                   src={offer.offerImage}
//                   alt="Offered Item"
//                   style={{ width: "80px", height: "80px" }}
//                 />
//               </p>
//               <p>Status: {offer.offerStatus}</p>
//               {offer.offerStatus === "Pending" && !hasAcceptedOffer && (
//                 <div className="trade_buttons">
//                   <button
//                     className="accept"
//                     onClick={() => handleAcceptOffer(offer)}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     className="deny"
//                     onClick={() => handleDeclineOffer(offer)}
//                   >
//                     Decline
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//       <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
//         <button
//           onClick={handleDelete}
//           style={{ backgroundColor: "red", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px", alignSelf: "flex-end" }}
//         >
//           Delete
//         </button>
//         {hasAcceptedOffer && (
//           <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//             <div style={{ display: "flex", gap: "10px" }}>
//               <button
//                 onClick={handleCompleteTrade}
//                 style={{ backgroundColor: "blue", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//               >
//                 Complete
//               </button>
//               <button
//                 onClick={handleCancelTrade}
//                 style={{ backgroundColor: "orange", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//               >
//                 Cancel
//               </button>
//             </div>
//             <button
//               onClick={() => {
//                 setSelectedOffer(acceptedOffer);
//                 setChatPopup(true);
//               }}
//               style={{ backgroundColor: "purple", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//             >
//               Chat
//             </button>
//           </div>
//         )}
//       </div>
//       {selectedOffer && (
//         <ChatModal
//           isOpen={showChatPopup}
//           onClose={() => {
//             setChatPopup(false);
//             setSelectedOffer(null);
//           }}
//           tradeId={trade._id}
//           senderId={trade.userId}
//           ownerId={selectedOffer.userId}
//         />
//       )}
//     </div>
//   );
// };

// const Tradelist = () => {
//   const { isLoggedIn, userId, username, loading } = useAuth();
//   const navigate = useNavigate();
//   const [tradeRequests, setTradeRequests] = useState([]);
//   const [offers, setOffers] = useState({});
//   const [users, setUsers] = useState({});
//   const [dataLoading, setDataLoading] = useState(true);

//   useEffect(() => {
//     const fetchTradeRequestsAndOffers = async () => {
//       if (loading) return;

//       if (!isLoggedIn) {
//         toast.error("Please login to view your trade list", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//         navigate("/authpage");
//         return;
//       }

//       try {
//         const tradeRequestsResponse = await api.get(`/trade_requests/user/${userId}`);
//         const tradeRequestsData = tradeRequestsResponse.data;

//         const offersPromises = tradeRequestsData.map(async (trade) => {
//           try {
//             const offersResponse = await api.get(`/offer/request/${trade._id}`);
//             return { requestId: trade._id, offers: offersResponse.data };
//           } catch (error) {
//             console.error(`Error fetching offers for trade request ${trade._id}:`, error.response?.data || error.message);
//             return { requestId: trade._id, offers: [] };
//           }
//         });

//         const offersData = await Promise.all(offersPromises);
//         const offersMap = offersData.reduce((acc, { requestId, offers }) => {
//           acc[requestId] = offers;
//           return acc;
//         }, {});

//         const userIds = new Set();
//         Object.values(offersMap).forEach((offerList) => {
//           offerList.forEach((offer) => userIds.add(offer.userId));
//         });

//         const userPromises = Array.from(userIds).map(async (userId) => {
//           try {
//             const userResponse = await api.get(`/user/${userId}`);
//             return { userId, user: userResponse.data.user };
//           } catch (error) {
//             console.error(`Error fetching user ${userId}:`, error.response?.data || error.message);
//             return { userId, user: null };
//           }
//         });

//         const usersData = await Promise.all(userPromises);
//         const usersMap = usersData.reduce((acc, { userId, user }) => {
//           if (user) acc[userId] = user;
//           return acc;
//         }, {});

//         setTradeRequests(tradeRequestsData);
//         setOffers(offersMap);
//         setUsers(usersMap);
//         setDataLoading(false);
//       } catch (error) {
//         console.error("Error fetching trade requests:", error.response?.data || error.message);
//         setDataLoading(false);
//       }
//     };
//     fetchTradeRequestsAndOffers();
//   }, [isLoggedIn, userId, navigate, loading]);

//   const handleDeleteTradeRequest = (tradeId) => {
//     setTradeRequests((prev) => prev.filter((trade) => trade._id !== tradeId));
//     setOffers((prev) => {
//       const updatedOffers = { ...prev };
//       delete updatedOffers[tradeId];
//       return updatedOffers;
//     });
//   };

//   const handleSelectOffer = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/select-offer/${offerId}`);
//       setOffers((prev) => {
//         const updatedOffers = { ...prev };
//         updatedOffers[requestId] = updatedOffers[requestId].map((offer) => {
//           if (offer._id === offerId) {
//             return { ...offer, offerStatus: "Accepted" };
//           }
//           return { ...offer, offerStatus: "Declined" };
//         });
//         return updatedOffers;
//       });
//       toast.success("Offer accepted successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error selecting offer:", error.response?.data || error.message);
//       toast.error("Failed to accept offer", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleDeclineOffer = async (requestId, offerId) => {
//     try {
//       // Gọi API decline-offer đúng theo route đã định nghĩa
//       await api.post(`/trade_requests/${requestId}/decline-offer/${offerId}`);
//       setOffers((prev) => {
//         const updatedOffers = { ...prev };
//         updatedOffers[requestId] = updatedOffers[requestId].map((offer) => {
//           if (offer._id === offerId) {
//             return { ...offer, offerStatus: "Declined" };
//           }
//           return offer;
//         });
//         return updatedOffers;
//       });
//       toast.success("Offer declined successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error declining offer:", error.response?.data || error.message);
//       toast.error("Failed to decline offer", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleCompleteTrade = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/finish-trade`);
//       setTradeRequests((prev) => prev.filter((trade) => trade._id !== requestId));
//       setOffers((prev) => {
//         const updatedOffers = { ...prev };
//         delete updatedOffers[requestId];
//         return updatedOffers;
//       });
//       toast.success("Trade completed successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error completing trade:", error.response?.data || error.message);
//       toast.error("Failed to complete trade", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleCancelTrade = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/cancel-trade`);
//       setOffers((prev) => {
//         const updatedOffers = { ...prev };
//         updatedOffers[requestId] = updatedOffers[requestId].map((offer) => {
//           if (offer._id === offerId) {
//             return { ...offer, offerStatus: "Cancelled" };
//           }
//           return offer;
//         });
//         return updatedOffers;
//       });
//       toast.success("Trade cancelled successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error cancelling trade:", error.response?.data || error.message);
//       toast.error("Failed to cancel trade", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   if (loading) {
//     return <div>Loading authentication...</div>;
//   }

//   if (dataLoading) {
//     return <div>Loading trades...</div>;
//   }

//   return (
//     <div className="tradelist_page">
//       <h2>Trade Requests</h2>
//       {tradeRequests.length === 0 ? (
//         <p>No pending trades</p>
//       ) : (
//         tradeRequests.map((trade) => (
//           <TradeBlock
//             key={trade._id}
//             trade={trade}
//             offers={offers[trade._id] || []}
//             users={users}
//             onDeleteTradeRequest={handleDeleteTradeRequest}
//             onSelectOffer={handleSelectOffer}
//             onDeclineOffer={handleDeclineOffer}
//             onCompleteTrade={handleCompleteTrade}
//             onCancelTrade={handleCancelTrade}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// export default Tradelist;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import io from "socket.io-client";
// import "../assets/css/Tradelist.css";
// import { useAuth } from "../context/auth.jsx";
// import { toast } from "react-toastify";
// import api from "../config/axios.js";
// import ChatModal from "./ChatModal.jsx";

// // Kết nối tới Socket.IO server
// const socket = io("http://localhost:3000", {
//   withCredentials: true,
//   extraHeaders: {
//     "Content-Type": "application/json",
//   },
// });

// const TradeBlock = ({ trade, offers, users, onDeleteTradeRequest, onSelectOffer, onDeclineOffer, onCompleteTrade, onCancelTrade }) => {
//   const [showChatPopup, setChatPopup] = useState(false);
//   const [selectedOffer, setSelectedOffer] = useState(null);

//   const handleDelete = async () => {
//     try {
//       await api.delete(`/trade_requests/${trade._id}`);
//       onDeleteTradeRequest(trade._id);
//       toast.success("Trade request deleted successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error deleting trade request:", error.response?.data || error.message);
//       toast.error("Failed to delete trade request", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleAcceptOffer = (offer) => {
//     setSelectedOffer(offer);
//     onSelectOffer(trade._id, offer._id);
//   };

//   const handleDeclineOffer = (offer) => {
//     onDeclineOffer(trade._id, offer._id);
//   };

//   const handleCompleteTrade = () => {
//     onCompleteTrade(trade._id, selectedOffer._id);
//   };

//   const handleCancelTrade = () => {
//     onCancelTrade(trade._id, selectedOffer._id);
//   };

//   const hasAcceptedOffer = offers.some((offer) => offer.offerStatus === "Accepted" || offer.offerStatus === "Completed");
//   const acceptedOffer = offers.find((offer) => offer.offerStatus === "Accepted" || offer.offerStatus === "Completed");
//   const isTradeCompleted = trade.requestStatus === "Completed";

//   return (
//     <div className={`trade_request ${hasAcceptedOffer ? "accepted" : isTradeCompleted ? "completed" : ""}`}>
//       <div>
//         <h3>Trade #{trade._id}</h3>
//         <p>Requesting: {trade.requestItem}</p>
//         <p>
//           My Item:{" "}
//           <img
//             src={trade.requestImage}
//             alt="Requested Item"
//             style={{ width: "100px", height: "100px" }}
//           />
//         </p>
//         <h4>Offers:</h4>
//         {offers.length === 0 ? (
//           <p>No offers yet</p>
//         ) : (
//           offers.map((offer) => (
//             <div key={offer._id} style={{ marginBottom: "10px" }}>
//               <p>Sender: {users[offer.userId]?.name || offer.userId}</p>
//               <p>Offering: {offer.offerItem}</p>
//               <p>
//                 Offer Item:{" "}
//                 <img
//                   src={offer.offerImage}
//                   alt="Offered Item"
//                   style={{ width: "80px", height: "80px" }}
//                 />
//               </p>
//               <p>Status: {offer.offerStatus}</p>
//               {offer.offerStatus === "Pending" && !hasAcceptedOffer && (
//                 <div className="trade_buttons">
//                   <button
//                     className="accept"
//                     onClick={() => handleAcceptOffer(offer)}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     className="deny"
//                     onClick={() => handleDeclineOffer(offer)}
//                   >
//                     Decline
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//       <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
//         {!isTradeCompleted && (
//           <button
//             onClick={handleDelete}
//             style={{ backgroundColor: "red", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px", alignSelf: "flex-end" }}
//           >
//             Delete
//           </button>
//         )}
//         {hasAcceptedOffer && (
//           <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//             {!isTradeCompleted && (
//               <div style={{ display: "flex", gap: "10px" }}>
//                 <button
//                   onClick={handleCompleteTrade}
//                   style={{ backgroundColor: "blue", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//                 >
//                   Complete
//                 </button>
//                 <button
//                   onClick={handleCancelTrade}
//                   style={{ backgroundColor: "orange", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             )}
//             <button
//               onClick={() => {
//                 setSelectedOffer(acceptedOffer);
//                 setChatPopup(true);
//               }}
//               style={{ backgroundColor: "purple", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//             >
//               Chat
//             </button>
//           </div>
//         )}
//       </div>
//       {selectedOffer && (
//         <ChatModal
//           isOpen={showChatPopup}
//           onClose={() => {
//             setChatPopup(false);
//             setSelectedOffer(null);
//           }}
//           tradeId={trade._id}
//           senderId={trade.userId}
//           ownerId={selectedOffer.userId}
//         />
//       )}
//     </div>
//   );
// };

// const Tradelist = () => {
//   const { isLoggedIn, userId, username, loading } = useAuth();
//   const navigate = useNavigate();
//   const [tradeRequests, setTradeRequests] = useState([]);
//   const [offers, setOffers] = useState({});
//   const [users, setUsers] = useState({});
//   const [dataLoading, setDataLoading] = useState(true);

//   const fetchTradeRequestsAndOffers = async () => {
//     try {
//       const tradeRequestsResponse = await api.get(`/trade_requests/user/${userId}`);
//       const tradeRequestsData = tradeRequestsResponse.data;

//       const offersPromises = tradeRequestsData.map(async (trade) => {
//         try {
//           const offersResponse = await api.get(`/offer/request/${trade._id}`);
//           return { requestId: trade._id, offers: offersResponse.data };
//         } catch (error) {
//           console.error(`Error fetching offers for trade request ${trade._id}:`, error.response?.data || error.message);
//           return { requestId: trade._id, offers: [] };
//         }
//       });

//       const offersData = await Promise.all(offersPromises);
//       const offersMap = offersData.reduce((acc, { requestId, offers }) => {
//         acc[requestId] = offers;
//         return acc;
//       }, {});

//       const userIds = new Set();
//       Object.values(offersMap).forEach((offerList) => {
//         offerList.forEach((offer) => userIds.add(offer.userId));
//       });

//       const userPromises = Array.from(userIds).map(async (userId) => {
//         try {
//           const userResponse = await api.get(`/user/${userId}`);
//           return { userId, user: userResponse.data.user };
//         } catch (error) {
//           console.error(`Error fetching user ${userId}:`, error.response?.data || error.message);
//           return { userId, user: null };
//         }
//       });

//       const usersData = await Promise.all(userPromises);
//       const usersMap = usersData.reduce((acc, { userId, user }) => {
//         if (user) acc[userId] = user;
//         return acc;
//       }, {});

//       setTradeRequests(tradeRequestsData);
//       setOffers(offersMap);
//       setUsers(usersMap);
//       setDataLoading(false);
//     } catch (error) {
//       console.error("Error fetching trade requests:", error.response?.data || error.message);
//       setDataLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (loading) return;

//     if (!isLoggedIn) {
//       toast.error("Please login to view your trade list", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       navigate("/authpage");
//       return;
//     }

//     fetchTradeRequestsAndOffers();

//     // Tham gia phòng cho từng trade request của user
//     tradeRequests.forEach((trade) => {
//       socket.emit("join_trade", trade._id);
//     });

//      // Lắng nghe sự kiện new_offer
//     socket.on("new_offer", (newOffer) => {
//     fetchTradeRequestsAndOffers(); // Làm mới danh sách offers
//     toast.info("A new offer has been made for one of your trade requests!", {
//       position: "top-right",
//       autoClose: 3000,
//     });
//   });

//     // Lắng nghe các sự kiện từ server
//     socket.on("offer_accepted", (data) => {
//       fetchTradeRequestsAndOffers();
//     });

//     socket.on("offer_declined", (data) => {
//       fetchTradeRequestsAndOffers();
//     });

//     socket.on("trade_cancelled", (data) => {
//       fetchTradeRequestsAndOffers();
//     });

//     socket.on("trade_completed", (data) => {
//       fetchTradeRequestsAndOffers();
//       if (data.message === "Trade completed successfully") {
//         toast.success("Trade completed successfully!", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       } else {
//         toast.info("The other party has confirmed the trade completion.", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       }
//     });

//     return () => {
//       socket.off("new_offer");
//       socket.off("offer_accepted");
//       socket.off("offer_declined");
//       socket.off("trade_cancelled");
//       socket.off("trade_completed");
//     };
//   }, [isLoggedIn, userId, navigate, loading, tradeRequests]);

//   const handleDeleteTradeRequest = (tradeId) => {
//     setTradeRequests((prev) => prev.filter((trade) => trade._id !== tradeId));
//     setOffers((prev) => {
//       const updatedOffers = { ...prev };
//       delete updatedOffers[tradeId];
//       return updatedOffers;
//     });
//   };

//   const handleSelectOffer = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/select-offer/${offerId}`);
//       toast.success("Offer accepted successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       await fetchTradeRequestsAndOffers();
//     } catch (error) {
//       console.error("Error selecting offer:", error.response?.data || error.message);
//       toast.error("Failed to accept offer", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleDeclineOffer = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/decline-offer/${offerId}`);
//       toast.success("Offer declined successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       await fetchTradeRequestsAndOffers();
//     } catch (error) {
//       console.error("Error declining offer:", error.response?.data || error.message);
//       toast.error("Failed to decline offer", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleCompleteTrade = async (requestId, offerId) => {
//     try {
//       const response = await api.post(`/trade_requests/${requestId}/finish-trade`);
//       const message = response.data.message;

//       if (message === "Trade completed successfully") {
//         toast.success("Trade completed successfully!", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       } else {
//         toast.info("Waiting for the other party to confirm the trade completion.", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       }
//       await fetchTradeRequestsAndOffers();
//     } catch (error) {
//       console.error("Error completing trade:", error.response?.data || error.message);
//       toast.error("Failed to complete trade", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleCancelTrade = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/cancel-trade`);
//       toast.success("Trade cancelled successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       await fetchTradeRequestsAndOffers();
//     } catch (error) {
//       console.error("Error cancelling trade:", error.response?.data || error.message);
//       toast.error("Failed to cancel trade", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   if (loading) {
//     return <div>Loading authentication...</div>;
//   }

//   if (dataLoading) {
//     return <div>Loading trades...</div>;
//   }

//   return (
//     <div className="tradelist_page">
//       <h2>Trade Requests</h2>
//       {tradeRequests.length === 0 ? (
//         <p>No pending trades</p>
//       ) : (
//         tradeRequests.map((trade) => (
//           <TradeBlock
//             key={trade._id}
//             trade={trade}
//             offers={offers[trade._id] || []}
//             users={users}
//             onDeleteTradeRequest={handleDeleteTradeRequest}
//             onSelectOffer={handleSelectOffer}
//             onDeclineOffer={handleDeclineOffer}
//             onCompleteTrade={handleCompleteTrade}
//             onCancelTrade={handleCancelTrade}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// export default Tradelist;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Tradelist.css";
import { useAuth } from "../context/auth.jsx";
import { toast } from "react-toastify";
import api from "../config/axios.js";
import ChatModal from "./ChatModal.jsx";

const TradeBlock = ({ trade, offers, users, onDeleteTradeRequest, onSelectOffer, onDeclineOffer, onCompleteTrade, onCancelTrade }) => {
  const [showChatPopup, setChatPopup] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  // const handleDelete = async () => {
  //   try {
  //     await api.delete(`/trade_requests/${trade._id}`);
  //     onDeleteTradeRequest(trade._id);
  //     toast.success("Trade request deleted successfully!", {
  //       position: "top-right",
  //       autoClose: 3000,
  //     });
  //   } catch (error) {
  //     console.error("Error deleting trade request:", error.response?.data || error.message);
  //     toast.error("Failed to delete trade request", {
  //       position: "top-right",
  //       autoClose: 3000,
  //     });
  //   }
  // };

  const handleAcceptOffer = (offer) => {
    setSelectedOffer(offer);
    onSelectOffer(trade._id, offer._id);
  };

  const handleDeclineOffer = (offer) => {
    onDeclineOffer(trade._id, offer._id);
  };

  const handleCompleteTrade = () => {
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
    if (acceptedOffer) {
      onCancelTrade(trade._id, acceptedOffer._id);
    } else {
      toast.error("No accepted offer found to cancel the trade.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const hasAcceptedOffer = offers.some((offer) => offer.offerStatus === "Accepted" || offer.offerStatus === "Completed");
  const acceptedOffer = offers.find((offer) => offer.offerStatus === "Accepted" || offer.offerStatus === "Completed");
  const isTradeCompleted = trade.requestStatus === "Completed";

  return (
    <div className={`trade_request ${hasAcceptedOffer ? "accepted" : isTradeCompleted ? "completed" : ""}`}>
      <div>
        <h3>Trade #{trade._id}</h3>
        <p>Requesting: {trade.requestItem}</p>
        <p>
          My Item:{" "}
          <img
            src={trade.requestImage}
            alt="Requested Item"
            style={{ width: "100px", height: "100px" }}
          />
        </p>
        <h4>Offers:</h4>
        {offers.length === 0 ? (
          <p>No offers yet</p>
        ) : (
          offers.map((offer) => (
            <div key={offer._id} style={{ marginBottom: "10px" }}>
              <p>Sender: {users[offer.userId]?.name || offer.userId}</p>
              <p>Offering: {offer.offerItem}</p>
              <p>
                Offer Item:{" "}
                <img
                  src={offer.offerImage}
                  alt="Offered Item"
                  style={{ width: "80px", height: "80px" }}
                />
              </p>
              <p>Status: {offer.offerStatus}</p>
              {offer.offerStatus === "Pending" && !hasAcceptedOffer && (
                <div className="trade_buttons">
                  <button
                    className="accept"
                    onClick={() => handleAcceptOffer(offer)}
                  >
                    Accept
                  </button>
                  <button
                    className="deny"
                    onClick={() => handleDeclineOffer(offer)}
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
        {/* {!isTradeCompleted && (
          <button
            onClick={handleDelete}
            style={{ backgroundColor: "red", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px", alignSelf: "flex-end" }}
          >
            Delete
          </button>
        )} */}
        {hasAcceptedOffer && acceptedOffer && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {!isTradeCompleted && (
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handleCompleteTrade}
                  style={{ backgroundColor: "blue", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
                >
                  Complete
                </button>
                <button
                  onClick={handleCancelTrade}
                  style={{ backgroundColor: "orange", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
                >
                  Cancel
                </button>
              </div>
            )}
            <button
              onClick={() => {
                setSelectedOffer(acceptedOffer);
                setChatPopup(true);
              }}
              style={{ backgroundColor: "purple", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
            >
              Chat
            </button>
          </div>
        )}
      </div>
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
      const tradeRequestsResponse = await api.get(`/trade_requests/user/${userId}`);
      const tradeRequestsData = tradeRequestsResponse.data;

      const offersPromises = tradeRequestsData.map(async (trade) => {
        try {
          const offersResponse = await api.get(`/offer/request/${trade._id}`);
          return { requestId: trade._id, offers: offersResponse.data };
        } catch (error) {
          console.error(`Error fetching offers for trade request ${trade._id}:`, error.response?.data || error.message);
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
          console.error(`Error fetching user ${userId}:`, error.response?.data || error.message);
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
      console.error("Error fetching trade requests:", error.response?.data || error.message);
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

  // const handleDeleteTradeRequest = (tradeId) => {
  //   setTradeRequests((prev) => prev.filter((trade) => trade._id !== tradeId));
  //   setOffers((prev) => {
  //     const updatedOffers = { ...prev };
  //     delete updatedOffers[tradeId];
  //     return updatedOffers;
  //   });
  // };

  const handleSelectOffer = async (requestId, offerId) => {
    try {
      await api.post(`/trade_requests/${requestId}/select-offer/${offerId}`);
      toast.success("Offer accepted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      await fetchTradeRequestsAndOffers();
    } catch (error) {
      console.error("Error selecting offer:", error.response?.data || error.message);
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
      console.error("Error declining offer:", error.response?.data || error.message);
      toast.error("Failed to decline offer", {
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
      await fetchTradeRequestsAndOffers();
    } catch (error) {
      console.error("Error completing trade:", error.response?.data || error.message);
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
      console.error("Error cancelling trade:", error.response?.data || error.message);
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
            // onDeleteTradeRequest={handleDeleteTradeRequest}
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