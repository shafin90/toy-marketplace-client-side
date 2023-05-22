import { useContext } from 'react';
import { Tab, Tabs, Container, Row, Col } from 'react-bootstrap';
import MyCard from '../MyCard/MyCard';
import './ReactTab.css';
import { AuthContext } from '../Provider/Provider';
import Spinner from 'react-bootstrap/Spinner';

const ReactTab = () => {
  const { regulerCar, sportsCar, trucks, data, spinner } = useContext(AuthContext);



  if (!spinner) {
    return (
      <div className='d-flex justify-content-center align-items-center my-5 py-5'>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  else {



    return (
      <Container>


        <h1 className="text-center">Shop By Category</h1>
        <Row className="my-5">
          <Col className='tab_container'>
            <Tabs
              defaultActiveKey="regular"
              className="d-flex justify-content-center align-items-center"
              id="car-tabs"
            >
              <Tab eventKey="regular" title="Regular Car">
                <div className="grid">
                  {regulerCar.map((e) => (
                    <MyCard info={e} key={e._id}></MyCard>
                  ))}
                </div>
              </Tab>

              <Tab eventKey="truck" title="Truck">
                <div className="grid">
                  {trucks.map((e) => (
                    <MyCard info={e} key={e._id}></MyCard>
                  ))}
                </div>
              </Tab>

              <Tab eventKey="sports" title="Sports Car">
                <div className="grid">
                  {sportsCar.map((e) => (
                    <MyCard info={e} key={e._id}></MyCard>
                  ))}
                </div>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    );
  }
}



export default ReactTab;
