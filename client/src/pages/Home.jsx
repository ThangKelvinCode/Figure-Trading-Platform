import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../assets/css/Home.css";
import Cocacola from "../assets/images/CocaCola.jpg"; // Fixed import path
import ExcitingMacaron from "../assets/images/ExcitingMacaron.jpg"; // Fixed import path
import Haveaseat from "../assets/images/Haveaseat.jpg"; // Fixed import path
import AnimatedGif from "../context/AnimatedGif.jsx";
import { useAuth } from "../context/auth.jsx";
import { mockUsers } from "../utils/mockData.js"; // Fixed import path

const Home = () => {
  const navigate = useNavigate();
  const { username, createTrade } = useAuth();

  const products = [
    {
      id: 1,
      name: "Labubu V2 Have A Seat",
      owner: mockUsers[0].username,
      image: Haveaseat,
    },
    {
      id: 2,
      name: "Labubu Exciting Macaron",
      owner: mockUsers[1].username,
      image: ExcitingMacaron,
    },
    {
      id: 3,
      name: "Labubu Coca Cola",
      owner: mockUsers[2].username,
      image: Cocacola,
    },
    {
      id: 4,
      name: "MR BONE DOUBLE EDGED",
      owner: mockUsers[3].username,
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

      <button className="add_item_button">
        <div className="plus_icon">+</div>
      </button>
    </div>
  );
};

export default Home;
