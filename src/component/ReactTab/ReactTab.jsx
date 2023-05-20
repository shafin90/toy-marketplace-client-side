import { useContext, useEffect, useState } from 'react';
import { Tab, Tabs, Container, Row, Col } from 'react-bootstrap';
import MyCard from '../MyCard/MyCard';
import './ReactTab.css'
import { AuthContext } from '../Provider/Provider';

const ReactTab = () => {


    const {regulerCar,sportsCar,trucks} = useContext(AuthContext);





   








    console.log(regulerCar)


    return (
        <Container>
            <h1 className='text-center'>Shop By Catagory</h1>
            <Row className="my-5">
                <Col>
                    <Tabs defaultActiveKey="regular" className='d-flex justify-content-center alighn-items-center' id="car-tabs">
                        <Tab eventKey="regular" title="Regular Car">
                            <div className='grid'>
                                {regulerCar.map(e => <MyCard

                                    info={e}


                                ></MyCard>)}
                            </div>
                        </Tab>

                        <Tab eventKey="truck" title="Truck">
                            <div className='grid'>
                                {trucks.map(e => <MyCard

                                    info={e}


                                ></MyCard>)}
                            </div>
                        </Tab>

                        <Tab eventKey="sports" title="Sports Car">
                            <div className='grid'>
                                {sportsCar.map(e => <MyCard

                                    info={e}


                                ></MyCard>)}
                            </div>
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </Container>
    );
};

export default ReactTab;
