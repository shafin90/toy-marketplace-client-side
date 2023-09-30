import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

const Opinion = () => {
    const [name, setName] = useState("");
    const [opinion, setOpinion] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can perform actions with the collected data here
        console.log("Name:", name);
        console.log("Opinion:", opinion);
    };

    return (
        <Container className="my-5 pt-5">

            <h1 className="py-5 text-center ">Tell us your opinion about Our Website</h1>
            <div className="d-flex justify-content-center align-items-center">
                <Form className="w-50" onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label className="fw-bold ">Your Name</Form.Label>
                        <Form.Control
                            className="mb-3"
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="opinion">
                        <Form.Label className=" fw-bold">Your Opinion</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Enter your opinion"
                            value={opinion}
                            onChange={(e) => setOpinion(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button className="mt-4" variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        </Container>
    );
};

export default Opinion;
