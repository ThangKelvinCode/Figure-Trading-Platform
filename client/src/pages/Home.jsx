import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../assets/css/Home.css";
import Cocacola from "../assets/images/CocaCola.jpg"; // Fixed import path
import ExcitingMacaron from "../assets/images/ExcitingMacaron.jpg"; // Fixed import path
import Haveaseat from "../assets/images/Haveaseat.jpg"; // Fixed import path
import Itempopup from "../components/Itempopup.jsx";
import AnimatedGif from "../context/AnimatedGif.jsx";
import { useAuth } from "../context/auth.jsx";
import { fetchUsers } from "./../context/adminauth";

const Home = () => {
  const navigate = useNavigate();
  const { username, createTrade } = useAuth();
  const [showItemPopup, setItemPopup] = useState(false);
  const [users, setUsers] = useState([]); // State to store fetched users
  const [loading, setLoading] = useState(true); // State to handle loading

  useEffect(() => {
    const getUsers = async () => {
      try {
        const fetchedUsers = await fetchUsers(); // Call fetchUsers from adminauth
        setUsers(fetchedUsers); // Store the fetched users in state
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  const products = [
    {
      id: 1,
      name: "Labubu V2 Have A Seat",
      owner: users[0]?.username || "Unknown", // Will be "liem"
      image: Haveaseat,
    },
    {
      id: 2,
      name: "Labubu Exciting Macaron",
      owner: users[1]?.username || "", // Will be "anh"
      image: ExcitingMacaron,
    },
    {
      id: 3,
      name: "Labubu Coca Cola",
      owner: users[2]?.username || "", // Will be "thang"
      image: Cocacola,
    },
    {
      id: 4,
      name: "MR BONE DOUBLE EDGED",
      owner: users[3]?.username || "", // Will be "an"
      image: Cocacola,
    },
  ];

  const handleOffer = (productId) => {
    if (!username) {
      alert("please log in to make an offer!");
      return;
    }
    const product = products.find((p) => p.id === productId);
    createTrade(username, "My Item", product.name, product.owner);
    alert(`Trade request sent to ${product.owner}`);
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="home">
      <section className="sect_1">
        <div>
          <AnimatedGif
            src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDluZ2FldHhtOGdnZDgyaDA1MG9jN2JjMG50Z2V1ZmM4MXhkYWltbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/EaOW6ssYbMUYxJmr8U/giphy.gif"
            alt="gif"
            className="full-cover-gif"
          />
        </div>
      </section>

      <section className="sect_2">
        <Container className="text-center my-5">
          <h2 className="fw-bold">NEW ARRIVAL</h2>
          <Row className="mt-4">
            {products.map((product) => (
              <Col key={product.id} md={3} sm={6} xs={12} className="mb-4">
                <Card className="border-0">
                  <div className="image-container">
                    <Card.Img
                      variant="top"
                      src={product.image}
                      alt={product.name}
                    />
                    <div className="overlay-buttons">
                      <Button
                        variant="primary"
                        className="btn-sm me-2"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        View
                      </Button>
                      <Button
                        variant="secondary"
                        className="btn-sm"
                        onClick={() => handleOffer(product.id)}
                      >
                        Offer
                      </Button>
                    </div>
                  </div>

                  <Card.Body>
                    <h6 className="fw-bold">{product.name}</h6>
                    <p className="fw-bold">Owner: {product.owner}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <Button variant="dark" className="px-4 py-2 mt-3">
            XEM TẤT CẢ · NEW ARRIVAL
          </Button>
        </Container>
      </section>
      <section className="sect_3">
        <div>hi</div>
      </section>

      <button className="add_item_button" onClick={() => setItemPopup(true)}>
        <div className="plus_icon">+</div>
      </button>

      {showItemPopup && <Itempopup onClose={() => setItemPopup(false)} />}
    </div>
  );
};

export default Home;
