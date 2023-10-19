// This component is shows all the toys based on catagory - Sport Car, Truck, Reguler Car
// If any field is empty, then there will  be a loader .
// The collection is shown using react tabs

import { useContext } from 'react';
import { Tab, Tabs, Container, Row, Col } from 'react-bootstrap';
import MyCard from '../MyCard/MyCard';
import './ReactTab.css';
import { AuthContext } from '../Provider/Provider';
import Spinner from 'react-bootstrap/Spinner';


const ReactTab = () => {
  const { regulerCar, sportsCar, trucks, data, spinner } = useContext(AuthContext); // Retrieving data from Provider component.

  return (
    <Container className='tab'>

      {/* Heading of this catagory */}
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

                {/* Loader if the data is missing */}
                {regulerCar.length == 0
                  &&
                  <div className='d-flex justify-content-center align-items-center my-5 py-5 spinner'>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                }


                {/* Reguler cars */}
                {regulerCar.map((e) => (
                  <MyCard info={e} key={e._id}></MyCard>
                ))}
              </div>
            </Tab>

            <Tab eventKey="truck" title="Truck">
              <div className="grid">
                
                {/*  */}
                {trucks.length == 0
                  &&
                  <div className='d-flex justify-content-center align-items-center my-5 py-5 spinner'>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                }
                {trucks.map((e) => (
                  <MyCard info={e} key={e._id}></MyCard>
                ))}
              </div>
            </Tab>

            <Tab eventKey="sports" title="Sports Car">
              <div className="grid">
                {sportsCar.length == 0
                  &&
                  <div className='d-flex justify-content-center align-items-center my-5 py-5 spinner'>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                }


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




export default ReactTab;
