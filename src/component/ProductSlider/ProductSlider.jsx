import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Provider/Provider";
import MyCard from "../MyCard/MyCard";
import { Carousel, Col, Container, Row } from "react-bootstrap";
// import "react-bootstrap/dist/react-bootstrap.min.css"; // Import React Bootstrap CSS

const ProductSlider = ({heading, itemList}) => {
    

    return (
        <Container className=" my-5 py-5 border-bottom   ">
            <h1 className=" display-4  fw-bold mb-4   " >{heading}</h1>
            <Carousel
                indicators={false}
                interval={5000} // Adjust as needed
            >
                {itemList?.map((item, index) => (
                    <Carousel.Item key={index}>
                        <Row className="justify-content-center">
                            {itemList.slice(index, index + 3).map((toy, i) => (
                                <Col key={i} md={4} sm={6} xs={12}>
                                    <MyCard info={toy} />
                                </Col>
                            ))}
                        </Row>
                    </Carousel.Item>
                ))}
            </Carousel>
        </Container>
    );
};

export default ProductSlider;
