// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Button, Container, Modal, Form } from "react-bootstrap";
// import { toast } from "react-toastify";
// import { useAuth } from "../context/auth.jsx";
// import api from "../config/axios.js";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import { storage } from "../config/firebase";
// import { v4 as uuidv4 } from "uuid";

// const TradeRequestDetail = () => {
//   const { requestId } = useParams();
//   const navigate = useNavigate();
//   const { isLoggedIn, username } = useAuth();
//   const [tradeRequest, setTradeRequest] = useState(null);
//   const [owner, setOwner] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showOfferModal, setShowOfferModal] = useState(false);

//   // State cho form tạo offer
//   const [offerImage, setOfferImage] = useState(null);
//   const [offerImagePreview, setOfferImagePreview] = useState(null);
//   const [offerItem, setOfferItem] = useState("");
//   const [offerDescription, setOfferDescription] = useState("");
//   const [offerLoading, setOfferLoading] = useState(false);

//   useEffect(() => {
//     const fetchTradeRequest = async () => {
//       try {
//         const response = await api.get(`/trade_requests/${requestId}`);
//         const tradeRequestData = response.data;

//         // Lấy thông tin owner
//         const ownerResponse = await api.get(`/user/${tradeRequestData.userId}`);
//         setOwner(ownerResponse.data.user);
//         setTradeRequest(tradeRequestData);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching trade request:", error.response?.data || error.message);
//         setLoading(false);
//       }
//     };
//     fetchTradeRequest();
//   }, [requestId]);

//   const handleSendOfferClick = () => {
//     if (!isLoggedIn) {
//       toast.error("Please login to make an offer", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       navigate("/authpage");
//       return;
//     }
//     setShowOfferModal(true);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setOfferImage(file);
//       setOfferImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleCreateOffer = async (e) => {
//     e.preventDefault();
//     if (!isLoggedIn) {
//       toast.error("Please login to make an offer", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       navigate("/login");
//       return;
//     }

//     if (!offerImage || !offerItem || !offerDescription) {
//       toast.error("Please fill in all fields and upload an image!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       return;
//     }

//     setOfferLoading(true);

//     try {
//       const imageRef = ref(
//         storage,
//         `offers/${username}/${offerImage.name + uuidv4()}`
//       );
//       const snapshot = await uploadBytes(imageRef, offerImage);
//       const downloadURL = await getDownloadURL(snapshot.ref);

//       const offerData = {
//         offerItem,
//         offerDescription,
//         offerImage: downloadURL,
//         requestId,
//       };

//       const response = await api.post("/offers/", offerData);
//       setShowOfferModal(false);
//       toast.success("Offer created successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });

//       setOfferImage(null);
//       setOfferImagePreview(null);
//       setOfferItem("");
//       setOfferDescription("");
//     } catch (error) {
//       console.error("Error creating offer:", error.response?.data || error.message);
//       toast.error("Failed to create offer: " + (error.response?.data?.message || error.message), {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } finally {
//       setOfferLoading(false);
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (!tradeRequest) return <div>Trade request not found.</div>;

//   return (
//     <Container className="my-5">
//       <h2>Trade Request Details</h2>
//       <div className="mt-4">
//         <h4>{tradeRequest.requestItem}</h4>
//         <img
//           src={tradeRequest.requestImage}
//           alt={tradeRequest.requestItem}
//           style={{ maxWidth: "300px", marginBottom: "20px" }}
//         />
//         <p><strong>Description:</strong> {tradeRequest.requestDescription}</p>
//         <h5>Owner Information</h5>
//         {owner ? (
//           <>
//             <p><strong>Name:</strong> {owner.name}</p>
//             <p><strong>Email:</strong> {owner.email}</p>
//             <p><strong>Date of Birth:</strong> {new Date(owner.date_of_birth).toLocaleDateString()}</p>
//           </>
//         ) : (
//           <p>Owner information not available.</p>
//         )}
//         <div className="d-flex gap-2">
//           <Button variant="primary" onClick={handleSendOfferClick}>
//             Send an Offer
//           </Button>
//           <Button variant="secondary" onClick={() => navigate("/")}>
//             Back to Home
//           </Button>
//         </div>
//       </div>

//       <Modal
//         show={showOfferModal}
//         onHide={() => setShowOfferModal(false)}
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Send an Offer</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleCreateOffer}>
//             <Form.Group className="mb-3">
//               <Form.Label>Offer Item</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={offerItem}
//                 onChange={(e) => setOfferItem(e.target.value)}
//                 placeholder="Enter offer item"
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Offer Description</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 value={offerDescription}
//                 onChange={(e) => setOfferDescription(e.target.value)}
//                 placeholder="Enter offer description"
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Offer Image</Form.Label>
//               {offerImagePreview ? (
//                 <img
//                   src={offerImagePreview}
//                   alt="Preview"
//                   style={{ maxWidth: "100%", height: "auto", marginBottom: "10px" }}
//                 />
//               ) : (
//                 <div>
//                   <p>Drop Image Here</p>
//                   <Form.Control
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     required
//                   />
//                 </div>
//               )}
//             </Form.Group>

//             <Button type="submit" variant="primary" disabled={offerLoading}>
//               {offerLoading ? "Creating..." : "Confirm"}
//             </Button>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </Container>
//   );
// };

// export default TradeRequestDetail;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Container, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.jsx";
import api from "../config/axios.js";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase";
import { v4 as uuidv4 } from "uuid";

const TradeRequestDetail = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, userId, username } = useAuth();
  const [tradeRequest, setTradeRequest] = useState(null);
  const [owner, setOwner] = useState(null);
  const [hasOffer, setHasOffer] = useState(false); // Kiểm tra user đã tạo offer chưa
  const [loading, setLoading] = useState(true);
  const [showOfferModal, setShowOfferModal] = useState(false);

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

        // Kiểm tra xem user đã tạo offer cho trade request này chưa
        if (isLoggedIn) {
          const offersResponse = await api.get(`/offers/request/${requestId}`);
          const userOffer = offersResponse.data.find((offer) => offer.userId === userId);
          setHasOffer(!!userOffer);
        }

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
      navigate("/login");
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

      const response = await api.post("/offers/", offerData);
      setHasOffer(true); // Cập nhật trạng thái đã tạo offer
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
      toast.error("Failed to create offer: " + (error.response?.data?.message || error.message), {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setOfferLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!tradeRequest) return <div>Trade request not found.</div>;

  return (
    <Container className="my-5">
      <h2>Trade Request Details</h2>
      <div className="mt-4">
        <h4>{tradeRequest.requestItem}</h4>
        <img
          src={tradeRequest.requestImage}
          alt={tradeRequest.requestItem}
          style={{ maxWidth: "300px", marginBottom: "20px" }}
        />
        <p><strong>Description:</strong> {tradeRequest.requestDescription}</p>
        <h5>Owner Information</h5>
        {owner ? (
          <>
            <p><strong>Name:</strong> {owner.name}</p>
            <p><strong>Email:</strong> {owner.email}</p>
            <p><strong>Date of Birth:</strong> {new Date(owner.date_of_birth).toLocaleDateString()}</p>
          </>
        ) : (
          <p>Owner information not available.</p>
        )}
        <div className="d-flex gap-2">
          <Button
            variant="primary"
            onClick={handleSendOfferClick}
            disabled={hasOffer}
          >
            Send an Offer
          </Button>
          <Button variant="secondary" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>

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

            <Form.Group className="mb-3">
              <Form.Label>Offer Image</Form.Label>
              {offerImagePreview ? (
                <img
                  src={offerImagePreview}
                  alt="Preview"
                  style={{ maxWidth: "100%", height: "auto", marginBottom: "10px" }}
                />
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