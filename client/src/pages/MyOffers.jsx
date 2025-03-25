// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../assets/css/Tradelist.css";
// import { useAuth } from "../context/auth.jsx";
// import { toast } from "react-toastify";
// import api from "../config/axios.js";

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

// const OfferBlock = ({ offer, tradeRequest, owner, onCancelOffer, onCompleteTrade }) => {
//   const [showChatPopup, setChatPopup] = useState(false);

//   const handleCancelOffer = () => {
//     onCancelOffer(offer._id, tradeRequest._id);
//   };

//   const handleCompleteTrade = () => {
//     onCompleteTrade(tradeRequest._id, offer._id);
//   };

//   return (
//     <div className="trade_request" style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "20px", borderRadius: "5px" }}>
//       <div>
//         <h3>Offer for Trade #{tradeRequest._id}</h3>
//         <p>Requesting: {tradeRequest.requestItem}</p>
//         <p>
//           Requested Item:{" "}
//           <img
//             src={tradeRequest.requestImage}
//             alt="Requested Item"
//             style={{ width: "100px", height: "100px" }}
//           />
//         </p>
//         <p>Owner: {owner?.name || tradeRequest.userId}</p>
//         <h4>Your Offer:</h4>
//         <p>Offering: {offer.offerItem}</p>
//         <p>
//           Offer Item:{" "}
//           <img
//             src={offer.offerImage}
//             alt="Offered Item"
//             style={{ width: "80px", height: "80px" }}
//           />
//         </p>
//         <p>Status: {offer.offerStatus}</p>
//       </div>
//       <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
//         {offer.offerStatus === "Accepted" ? (
//           <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//             <div style={{ display: "flex", gap: "10px" }}>
//               <button
//                 onClick={handleCompleteTrade}
//                 style={{ backgroundColor: "blue", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//               >
//                 Complete
//               </button>
//               <button
//                 onClick={handleCancelOffer}
//                 style={{ backgroundColor: "orange", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//               >
//                 Cancel
//               </button>
//             </div>
//             <button
//               onClick={() => setChatPopup(true)}
//               style={{ backgroundColor: "purple", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//             >
//               Chat
//             </button>
//           </div>
//         ) : offer.offerStatus === "Pending" ? (
//           <button
//             onClick={handleCancelOffer}
//             style={{ backgroundColor: "orange", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px", alignSelf: "flex-end" }}
//           >
//             Cancel
//           </button>
//         ) : null}
//       </div>
//       <ChatModal
//         isOpen={showChatPopup}
//         onClose={() => setChatPopup(false)}
//         senderId={offer.userId}
//         ownerId={tradeRequest.userId}
//       />
//     </div>
//   );
// };

// const MyOffers = () => {
//   const { isLoggedIn, userId } = useAuth();
//   const navigate = useNavigate();
//   const [offers, setOffers] = useState([]);
//   const [tradeRequests, setTradeRequests] = useState({});
//   const [owners, setOwners] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOffers = async () => {
//       if (!isLoggedIn) {
//         toast.error("Please login to view your offers", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//         navigate("/login");
//         return;
//       }

//       try {
//         // Lấy danh sách offer của user hiện tại
//         const offersResponse = await api.get(`/offer/user/${userId}`);
//         const offersData = offersResponse.data;

//         // Lấy thông tin trade request và owner cho từng offer
//         const tradeRequestPromises = offersData.map(async (offer) => {
//           try {
//             const tradeRequestResponse = await api.get(`/trade_requests/${offer.requestId}`);
//             const ownerResponse = await api.get(`/user/${tradeRequestResponse.data.userId}`);
//             return {
//               requestId: offer.requestId,
//               tradeRequest: tradeRequestResponse.data,
//               owner: ownerResponse.data.user,
//             };
//           } catch (error) {
//             console.error(`Error fetching trade request ${offer.requestId}:`, error.response?.data || error.message);
//             return { requestId: offer.requestId, tradeRequest: null, owner: null };
//           }
//         });

//         const tradeRequestsData = await Promise.all(tradeRequestPromises);
//         const tradeRequestsMap = tradeRequestsData.reduce((acc, { requestId, tradeRequest }) => {
//           if (tradeRequest) acc[requestId] = tradeRequest;
//           return acc;
//         }, {});
//         const ownersMap = tradeRequestsData.reduce((acc, { requestId, owner }) => {
//           if (owner) acc[requestId] = owner;
//           return acc;
//         }, {});

//         setOffers(offersData);
//         setTradeRequests(tradeRequestsMap);
//         setOwners(ownersMap);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching offers:", error.response?.data || error.message);
//         setLoading(false);
//       }
//     };
//     fetchOffers();
//   }, [isLoggedIn, userId, navigate]);

//   const handleCancelOffer = async (offerId, requestId) => {
//     try {
//       await api.post(`/offers/${offerId}/cancel`);
//       setOffers((prev) =>
//         prev.map((offer) =>
//           offer._id === offerId ? { ...offer, offerStatus: "Cancelled" } : offer
//         )
//       );
//       toast.success("Offer cancelled successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error cancelling offer:", error.response?.data || error.message);
//       toast.error("Failed to cancel offer", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleCompleteTrade = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/complete`, { offerId });
//       setOffers((prev) => prev.filter((offer) => offer._id !== offerId));
//       setTradeRequests((prev) => {
//         const updated = { ...prev };
//         delete updated[requestId];
//         return updated;
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

//   if (loading) {
//     return <div>Loading offers...</div>;
//   }

//   return (
//     <div className="tradelist_page">
//       <h2>My Offers</h2>
//       {offers.length === 0 ? (
//         <p>You have not made any offers yet.</p>
//       ) : (
//         offers.map((offer) => (
//           <OfferBlock
//             key={offer._id}
//             offer={offer}
//             tradeRequest={tradeRequests[offer.requestId]}
//             owner={owners[offer.requestId]}
//             onCancelOffer={handleCancelOffer}
//             onCompleteTrade={handleCompleteTrade}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// export default MyOffers;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../assets/css/Tradelist.css";
// import { useAuth } from "../context/auth.jsx";
// import { toast } from "react-toastify";
// import api from "../config/axios.js";

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

// const OfferBlock = ({ offer, tradeRequest, owner, onCancelOffer, onCompleteTrade }) => {
//   const [showChatPopup, setChatPopup] = useState(false);

//   // Kiểm tra nếu tradeRequest không tồn tại
//   if (!tradeRequest) {
//     return (
//       <div className="trade_request" style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "20px", borderRadius: "5px" }}>
//         <p>Trade request not found for this offer.</p>
//       </div>
//     );
//   }

//   const handleCancelOffer = () => {
//     onCancelOffer(offer._id, tradeRequest._id);
//   };

//   const handleCompleteTrade = () => {
//     onCompleteTrade(tradeRequest._id, offer._id);
//   };

//   return (
//     <div className="trade_request" style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "20px", borderRadius: "5px" }}>
//       <div>
//         <h3>Offer for Trade #{tradeRequest._id}</h3>
//         <p>Requesting: {tradeRequest.requestItem}</p>
//         <p>
//           Requested Item:{" "}
//           <img
//             src={tradeRequest.requestImage}
//             alt="Requested Item"
//             style={{ width: "100px", height: "100px" }}
//           />
//         </p>
//         <p>Owner: {owner?.name || tradeRequest.userId}</p>
//         <h4>Your Offer:</h4>
//         <p>Offering: {offer.offerItem}</p>
//         <p>
//           Offer Item:{" "}
//           <img
//             src={offer.offerImage}
//             alt="Offered Item"
//             style={{ width: "80px", height: "80px" }}
//           />
//         </p>
//         <p>Status: {offer.offerStatus}</p>
//       </div>
//       <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
//         {offer.offerStatus === "Accepted" ? (
//           <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//             <div style={{ display: "flex", gap: "10px" }}>
//               <button
//                 onClick={handleCompleteTrade}
//                 style={{ backgroundColor: "blue", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//               >
//                 Complete
//               </button>
//               <button
//                 onClick={handleCancelOffer}
//                 style={{ backgroundColor: "orange", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//               >
//                 Cancel
//               </button>
//             </div>
//             <button
//               onClick={() => setChatPopup(true)}
//               style={{ backgroundColor: "purple", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//             >
//               Chat
//             </button>
//           </div>
//         ) : offer.offerStatus === "Pending" ? (
//           <button
//             onClick={handleCancelOffer}
//             style={{ backgroundColor: "orange", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px", alignSelf: "flex-end" }}
//           >
//             Cancel
//           </button>
//         ) : null}
//       </div>
//       <ChatModal
//         isOpen={showChatPopup}
//         onClose={() => setChatPopup(false)}
//         senderId={offer.userId}
//         ownerId={tradeRequest.userId}
//       />
//     </div>
//   );
// };

// const MyOffers = () => {
//   const { isLoggedIn, userId } = useAuth();
//   const navigate = useNavigate();
//   const [offers, setOffers] = useState([]);
//   const [tradeRequests, setTradeRequests] = useState({});
//   const [owners, setOwners] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOffers = async () => {
//       if (!isLoggedIn) {
//         toast.error("Please login to view your offers", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//         navigate("/login");
//         return;
//       }

//       try {
//         // Lਰ: Sửa endpoint từ /offer/user thành /offers/user
//         const offersResponse = await api.get(`/offer/user/${userId}`);
//         const offersData = offersResponse.data;

//         // Lọc các offer hợp lệ và lấy thông tin trade request, owner
//         const validOffers = [];
//         const tradeRequestsMap = {};
//         const ownersMap = {};

//         for (const offer of offersData) {
//           try {
//             const tradeRequestResponse = await api.get(`/trade_requests/${offer.requestId}`);
//             if (tradeRequestResponse.data) {
//               validOffers.push(offer);
//               tradeRequestsMap[offer.requestId] = tradeRequestResponse.data;

//               // Chỉ gọi API lấy thông tin owner nếu trade request tồn tại
//               try {
//                 const ownerResponse = await api.get(`/user/${tradeRequestResponse.data.userId}`);
//                 ownersMap[offer.requestId] = ownerResponse.data.user;
//               } catch (ownerError) {
//                 console.error(`Error fetching owner for trade request ${offer.requestId}:`, ownerError.response?.data || ownerError.message);
//                 ownersMap[offer.requestId] = null;
//               }
//             }
//           } catch (error) {
//             console.error(`Error fetching trade request ${offer.requestId}:`, error.response?.data || error.message);
//           }
//         }

//         setOffers(validOffers);
//         setTradeRequests(tradeRequestsMap);
//         setOwners(ownersMap);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching offers:", error.response?.data || error.message);
//         setLoading(false);
//       }
//     };
//     fetchOffers();
//   }, [isLoggedIn, userId, navigate]);

//   const handleCancelOffer = async (offerId, requestId) => {
//     try {
//       await api.post(`/offers/${offerId}/cancel`);
//       setOffers((prev) =>
//         prev.map((offer) =>
//           offer._id === offerId ? { ...offer, offerStatus: "Cancelled" } : offer
//         )
//       );
//       toast.success("Offer cancelled successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error cancelling offer:", error.response?.data || error.message);
//       toast.error("Failed to cancel offer", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleCompleteTrade = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/complete`, { offerId });
//       setOffers((prev) => prev.filter((offer) => offer._id !== offerId));
//       setTradeRequests((prev) => {
//         const updated = { ...prev };
//         delete updated[requestId];
//         return updated;
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

//   if (loading) {
//     return <div>Loading offers...</div>;
//   }

//   return (
//     <div className="tradelist_page">
//       <h2>My Offers</h2>
//       {offers.length === 0 ? (
//         <p>You have not made any offers yet.</p>
//       ) : (
//         offers.map((offer) => (
//           <OfferBlock
//             key={offer._id}
//             offer={offer}
//             tradeRequest={tradeRequests[offer.requestId]}
//             owner={owners[offer.requestId]}
//             onCancelOffer={handleCancelOffer}
//             onCompleteTrade={handleCompleteTrade}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// export default MyOffers;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../assets/css/Tradelist.css";
// import { useAuth } from "../context/auth.jsx";
// import { toast } from "react-toastify";
// import api from "../config/axios.js";
// import ChatModal from "./ChatModal.jsx";


// const OfferBlock = ({ offer, tradeRequest, owner, onCancelOffer, onCompleteTrade }) => {
//   const [showChatPopup, setChatPopup] = useState(false);

//   // Kiểm tra nếu tradeRequest không tồn tại
//   if (!tradeRequest) {
//     return (
//       <div className="trade_request" style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "20px", borderRadius: "5px" }}>
//         <p>Trade request not found for this offer.</p>
//       </div>
//     );
//   }

//   const handleCancelOffer = () => {
//     onCancelOffer(offer._id, tradeRequest._id);
//   };

//   const handleCompleteTrade = () => {
//     onCompleteTrade(tradeRequest._id, offer._id);
//   };

//   return (
//     <div className="trade_request" style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "20px", borderRadius: "5px" }}>
//       <div>
//         <h3>Offer for Trade #{tradeRequest._id}</h3>
//         <p>Requesting: {tradeRequest.requestItem}</p>
//         <p>
//           Requested Item:{" "}
//           <img
//             src={tradeRequest.requestImage}
//             alt="Requested Item"
//             style={{ width: "100px", height: "100px" }}
//           />
//         </p>
//         <p>Owner: {owner?.name || tradeRequest.userId}</p>
//         <h4>Your Offer:</h4>
//         <p>Offering: {offer.offerItem}</p>
//         <p>
//           Offer Item:{" "}
//           <img
//             src={offer.offerImage}
//             alt="Offered Item"
//             style={{ width: "80px", height: "80px" }}
//           />
//         </p>
//         <p>Status: {offer.offerStatus}</p>
//       </div>
//       <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
//         {offer.offerStatus === "Accepted" ? (
//           <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//             <div style={{ display: "flex", gap: "10px" }}>
//               <button
//                 onClick={handleCompleteTrade}
//                 style={{ backgroundColor: "blue", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//               >
//                 Complete
//               </button>
//               <button
//                 onClick={handleCancelOffer}
//                 style={{ backgroundColor: "orange", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//               >
//                 Cancel
//               </button>
//             </div>
//             <button
//               onClick={() => setChatPopup(true)}
//               style={{ backgroundColor: "purple", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//             >
//               Chat
//             </button>
//           </div>
//         ) : offer.offerStatus === "Pending" ? (
//           <button
//             onClick={handleCancelOffer}
//             style={{ backgroundColor: "orange", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px", alignSelf: "flex-end" }}
//           >
//             Cancel
//           </button>
//         ) : null}
//       </div>
//       <ChatModal
//         isOpen={showChatPopup}
//         onClose={() => setChatPopup(false)}
//         tradeId={tradeRequest._id}
//         senderId={offer.userId} // Người tạo offer
//         ownerId={tradeRequest.userId} // Người tạo trade request
//       />
//     </div>
//   );
// };

// const MyOffers = () => {
//   const { isLoggedIn, userId } = useAuth();
//   const navigate = useNavigate();
//   const [offers, setOffers] = useState([]);
//   const [tradeRequests, setTradeRequests] = useState({});
//   const [owners, setOwners] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOffers = async () => {
//       if (!isLoggedIn) {
//         toast.error("Please login to view your offers", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//         navigate("/login");
//         return;
//       }

//       try {
//         const offersResponse = await api.get(`/offer/user/${userId}`);
//         const offersData = offersResponse.data;

//         const validOffers = [];
//         const tradeRequestsMap = {};
//         const ownersMap = {};

//         for (const offer of offersData) {
//           try {
//             const tradeRequestResponse = await api.get(`/trade_requests/${offer.requestId}`);
//             if (tradeRequestResponse.data) {
//               validOffers.push(offer);
//               tradeRequestsMap[offer.requestId] = tradeRequestResponse.data;

//               try {
//                 const ownerResponse = await api.get(`/user/${tradeRequestResponse.data.userId}`);
//                 ownersMap[offer.requestId] = ownerResponse.data.user;
//               } catch (ownerError) {
//                 console.error(`Error fetching owner for trade request ${offer.requestId}:`, ownerError.response?.data || ownerError.message);
//                 ownersMap[offer.requestId] = null;
//               }
//             }
//           } catch (error) {
//             console.error(`Error fetching trade request ${offer.requestId}:`, error.response?.data || error.message);
//           }
//         }

//         setOffers(validOffers);
//         setTradeRequests(tradeRequestsMap);
//         setOwners(ownersMap);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching offers:", error.response?.data || error.message);
//         setLoading(false);
//       }
//     };
//     fetchOffers();
//   }, [isLoggedIn, userId, navigate]);

//   const handleCancelOffer = async (offerId, requestId) => {
//     try {
//       await api.post(`/offers/${offerId}/cancel`);
//       setOffers((prev) =>
//         prev.map((offer) =>
//           offer._id === offerId ? { ...offer, offerStatus: "Cancelled" } : offer
//         )
//       );
//       toast.success("Offer cancelled successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error cancelling offer:", error.response?.data || error.message);
//       toast.error("Failed to cancel offer", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleCompleteTrade = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/complete`, { offerId });
//       setOffers((prev) => prev.filter((offer) => offer._id !== offerId));
//       setTradeRequests((prev) => {
//         const updated = { ...prev };
//         delete updated[requestId];
//         return updated;
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

//   if (loading) {
//     return <div>Loading offers...</div>;
//   }

//   return (
//     <div className="tradelist_page">
//       <h2>My Offers</h2>
//       {offers.length === 0 ? (
//         <p>You have not made any offers yet.</p>
//       ) : (
//         offers.map((offer) => (
//           <OfferBlock
//             key={offer._id}
//             offer={offer}
//             tradeRequest={tradeRequests[offer.requestId]}
//             owner={owners[offer.requestId]}
//             onCancelOffer={handleCancelOffer}
//             onCompleteTrade={handleCompleteTrade}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// export default MyOffers;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../assets/css/Tradelist.css";
// import { useAuth } from "../context/auth.jsx";
// import { toast } from "react-toastify";
// import api from "../config/axios.js";
// import ChatModal from "./ChatModal.jsx"; // Import ChatModal

// const OfferBlock = ({ offer, tradeRequest, owner, onCancelOffer, onCompleteTrade }) => {
//   const [showChatPopup, setChatPopup] = useState(false);

//   // Kiểm tra nếu tradeRequest không tồn tại
//   if (!tradeRequest) {
//     return (
//       <div className="trade_request" style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "20px", borderRadius: "5px" }}>
//         <p>Trade request not found for this offer.</p>
//       </div>
//     );
//   }

//   const handleCancelOffer = () => {
//     onCancelOffer(offer._id, tradeRequest._id);
//   };

//   const handleCompleteTrade = () => {
//     onCompleteTrade(tradeRequest._id, offer._id);
//   };

//   return (
//     <div className="trade_request" style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "20px", borderRadius: "5px" }}>
//       <div>
//         <h3>Offer for Trade #{tradeRequest._id}</h3>
//         <p>Requesting: {tradeRequest.requestItem}</p>
//         <p>
//           Requested Item:{" "}
//           <img
//             src={tradeRequest.requestImage}
//             alt="Requested Item"
//             style={{ width: "100px", height: "100px" }}
//           />
//         </p>
//         <p>Owner: {owner?.name || tradeRequest.userId}</p>
//         <h4>Your Offer:</h4>
//         <p>Offering: {offer.offerItem}</p>
//         <p>
//           Offer Item:{" "}
//           <img
//             src={offer.offerImage}
//             alt="Offered Item"
//             style={{ width: "80px", height: "80px" }}
//           />
//         </p>
//         <p>Status: {offer.offerStatus}</p>
//       </div>
//       <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
//         {offer.offerStatus === "Accepted" ? (
//           <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//             <div style={{ display: "flex", gap: "10px" }}>
//               <button
//                 onClick={handleCompleteTrade}
//                 style={{ backgroundColor: "blue", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//               >
//                 Complete
//               </button>
//               <button
//                 onClick={handleCancelOffer}
//                 style={{ backgroundColor: "orange", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//               >
//                 Cancel
//               </button>
//             </div>
//             <button
//               onClick={() => setChatPopup(true)}
//               style={{ backgroundColor: "purple", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
//             >
//               Chat
//             </button>
//           </div>
//         ) : offer.offerStatus === "Pending" ? (
//           <button
//             onClick={handleCancelOffer}
//             style={{ backgroundColor: "orange", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px", alignSelf: "flex-end" }}
//           >
//             Cancel
//           </button>
//         ) : null}
//       </div>
//       <ChatModal
//         isOpen={showChatPopup}
//         onClose={() => setChatPopup(false)}
//         tradeId={tradeRequest._id}
//         senderId={offer.userId} // Người tạo offer
//         ownerId={tradeRequest.userId} // Người tạo trade request
//       />
//     </div>
//   );
// };

// const MyOffers = () => {
//   const { isLoggedIn, userId } = useAuth();
//   const navigate = useNavigate();
//   const [offers, setOffers] = useState([]);
//   const [tradeRequests, setTradeRequests] = useState({});
//   const [owners, setOwners] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOffers = async () => {
//       if (!isLoggedIn) {
//         toast.error("Please login to view your offers", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//         navigate("/authpage");
//         return;
//       }

//       try {
//         const offersResponse = await api.get(`/offer/user/${userId}`);
//         const offersData = offersResponse.data;

//         const validOffers = [];
//         const tradeRequestsMap = {};
//         const ownersMap = {};

//         for (const offer of offersData) {
//           try {
//             const tradeRequestResponse = await api.get(`/trade_requests/${offer.requestId}`);
//             if (tradeRequestResponse.data) {
//               validOffers.push(offer);
//               tradeRequestsMap[offer.requestId] = tradeRequestResponse.data;

//               try {
//                 const ownerResponse = await api.get(`/user/${tradeRequestResponse.data.userId}`);
//                 ownersMap[offer.requestId] = ownerResponse.data.user;
//               } catch (ownerError) {
//                 console.error(`Error fetching owner for trade request ${offer.requestId}:`, ownerError.response?.data || ownerError.message);
//                 ownersMap[offer.requestId] = null;
//               }
//             }
//           } catch (error) {
//             console.error(`Error fetching trade request ${offer.requestId}:`, error.response?.data || error.message);
//           }
//         }

//         setOffers(validOffers);
//         setTradeRequests(tradeRequestsMap);
//         setOwners(ownersMap);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching offers:", error.response?.data || error.message);
//         setLoading(false);
//       }
//     };
//     fetchOffers();
//   }, [isLoggedIn, userId, navigate]);

//   const handleCancelOffer = async (offerId, requestId) => {
//     try {
//       await api.post(`/offers/${offerId}/cancel`);
//       setOffers((prev) =>
//         prev.map((offer) =>
//           offer._id === offerId ? { ...offer, offerStatus: "Cancelled" } : offer
//         )
//       );
//       toast.success("Offer cancelled successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error("Error cancelling offer:", error.response?.data || error.message);
//       toast.error("Failed to cancel offer", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleCompleteTrade = async (requestId, offerId) => {
//     try {
//       await api.post(`/trade_requests/${requestId}/complete`, { offerId });
//       setOffers((prev) => prev.filter((offer) => offer._id !== offerId));
//       setTradeRequests((prev) => {
//         const updated = { ...prev };
//         delete updated[requestId];
//         return updated;
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

//   if (loading) {
//     return <div>Loading offers...</div>;
//   }

//   return (
//     <div className="tradelist_page">
//       <h2>My Offers</h2>
//       {offers.length === 0 ? (
//         <p>You have not made any offers yet.</p>
//       ) : (
//         offers.map((offer) => (
//           <OfferBlock
//             key={offer._id}
//             offer={offer}
//             tradeRequest={tradeRequests[offer.requestId]}
//             owner={owners[offer.requestId]}
//             onCancelOffer={handleCancelOffer}
//             onCompleteTrade={handleCompleteTrade}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// export default MyOffers;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Tradelist.css";
import { useAuth } from "../context/auth.jsx";
import { toast } from "react-toastify";
import api from "../config/axios.js";
import ChatModal from "./ChatModal.jsx";

const OfferBlock = ({ offer, tradeRequest, owner, onCancelOffer, onCompleteTrade }) => {
  const [showChatPopup, setChatPopup] = useState(false);

  if (!tradeRequest) {
    return (
      <div className="trade_request" style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "20px", borderRadius: "5px" }}>
        <p>Trade request not found for this offer.</p>
      </div>
    );
  }

  const handleCancelOffer = () => {
    onCancelOffer(offer._id, tradeRequest._id);
  };

  const handleCompleteTrade = () => {
    onCompleteTrade(tradeRequest._id, offer._id);
  };

  return (
    <div className="trade_request" style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "20px", borderRadius: "5px" }}>
      <div>
        <h3>Offer for Trade #{tradeRequest._id}</h3>
        <p>Requesting: {tradeRequest.requestItem}</p>
        <p>
          Requested Item:{" "}
          <img
            src={tradeRequest.requestImage}
            alt="Requested Item"
            style={{ width: "100px", height: "100px" }}
          />
        </p>
        <p>Owner: {owner?.name || tradeRequest.userId}</p>
        <h4>Your Offer:</h4>
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
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
        {offer.offerStatus === "Accepted" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleCompleteTrade}
                style={{ backgroundColor: "blue", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
              >
                Complete
              </button>
              <button
                onClick={handleCancelOffer}
                style={{ backgroundColor: "orange", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
              >
                Cancel
              </button>
            </div>
            <button
              onClick={() => setChatPopup(true)}
              style={{ backgroundColor: "purple", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px" }}
            >
              Chat
            </button>
          </div>
        ) : offer.offerStatus === "Pending" ? (
          <button
            onClick={handleCancelOffer}
            style={{ backgroundColor: "orange", color: "white", padding: "5px 10px", border: "none", borderRadius: "3px", alignSelf: "flex-end" }}
          >
            Cancel
          </button>
        ) : null}
      </div>
      <ChatModal
        isOpen={showChatPopup}
        onClose={() => setChatPopup(false)}
        tradeId={tradeRequest._id}
        senderId={offer.userId}
        ownerId={tradeRequest.userId}
      />
    </div>
  );
};

const MyOffers = () => {
  const { isLoggedIn, userId, loading } = useAuth();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [tradeRequests, setTradeRequests] = useState({});
  const [owners, setOwners] = useState({});
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      if (loading) return;

      if (!isLoggedIn) {
        toast.error("Please login to view your offers", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/authpage");
        return;
      }

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
    fetchOffers();
  }, [isLoggedIn, userId, navigate, loading]);

  const handleCancelOffer = async (offerId, requestId) => {
    try {
      await api.post(`/offers/${offerId}/cancel`);
      setOffers((prev) =>
        prev.map((offer) =>
          offer._id === offerId ? { ...offer, offerStatus: "Cancelled" } : offer
        )
      );
      toast.success("Offer cancelled successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
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
      await api.post(`/trade_requests/${requestId}/complete`, { offerId });
      setOffers((prev) => prev.filter((offer) => offer._id !== offerId));
      setTradeRequests((prev) => {
        const updated = { ...prev };
        delete updated[requestId];
        return updated;
      });
      toast.success("Trade completed successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
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
    <div className="tradelist_page">
      <h2>My Offers</h2>
      {offers.length === 0 ? (
        <p>You have not made any offers yet.</p>
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
    </div>
  );
};

export default MyOffers;