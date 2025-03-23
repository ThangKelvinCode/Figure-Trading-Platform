import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const products = [
  {
    id: 1,
    category: "FIGURE",
    name: "STANDING TOTORO",
    price: "360.000₫",
    image: "/path-to-image/totoro.jpg",
  },
  {
    id: 2,
    category: "BLINDBOX",
    name: "EFFIE PLUFFY BLIND BOX SE...",
    price: "490.000₫",
    image: "/path-to-image/blindbox.jpg",
  },
  {
    id: 3,
    category: "BLINDBOX",
    name: "CRAYON SHIN-CHAN GROWI...",
    price: "290.000₫",
    image: "/path-to-image/shinchan.jpg",
  },
  {
    id: 4,
    category: "FIGURE",
    name: "MR BONE DOUBLE EDGED S...",
    price: "8.390.000₫",
    image: "/path-to-image/mrbone.jpg",
  },
];

const NewArrivalSection = () => {
  return (
    <Container className="text-center my-5">
      <h2 className="fw-bold">NEW ARRIVAL</h2>
      <Row className="mt-4">
        {products.map((product) => (
          <Col key={product.id} md={3} sm={6} xs={12} className="mb-4">
            <Card className="border-0">
              <Card.Img variant="top" src={product.image} alt={product.name} />
              <Card.Body>
                <p className="text-muted text-uppercase">{product.category}</p>
                <h6 className="fw-bold">{product.name}</h6>
                <p className="fw-bold">{product.price}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Button variant="dark" className="px-4 py-2 mt-3">XEM TẤT CẢ · NEW ARRIVAL</Button>
    </Container>
  );
};

export default NewArrivalSection;
