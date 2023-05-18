import React from 'react';
import { Tab, Tabs, Container, Row, Col } from 'react-bootstrap';

const ReactTab = () => {
  return (
    <Container>
      <Row className="mt-4">
        <Col>
          <Tabs defaultActiveKey="regular" id="car-tabs">
            <Tab eventKey="regular" title="Regular Car">
              <h3>Regular Car</h3>
              <p>This is the content for the Regular Car tab.</p>
            </Tab>

            <Tab eventKey="truck" title="Truck">
              <h3>Truck</h3>
              <p>This is the content for the Truck tab.</p>
            </Tab>

            <Tab eventKey="sports" title="Sports Car">
              <h3>Sports Car</h3>
              <p>This is the content for the Sports Car tab.</p>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default ReactTab;
