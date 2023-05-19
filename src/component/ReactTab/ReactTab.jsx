import { useEffect, useState } from 'react';
import { Tab, Tabs, Container, Row, Col } from 'react-bootstrap';
import MyCard from '../MyCard/MyCard';
import './ReactTab.css'

const ReactTab = () => {

    // state declareation======================
    const [data, setData] = useState([])
    const [regulerCar, setRegulerCar] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [sportsCar, setSportsCar] = useState([]);



    // loading data
    useEffect(() => {
        fetch('data.json')
            .then(res => res.json())
            .then(data => setData(data))

    }, [])


    const handle_react_tab = () => {
        const subCatagory_regulerCar = data.filter(e => e.sub_category === 'Regular Car');
        setRegulerCar([...subCatagory_regulerCar])


        const subCatagory_trucks = data.filter(e => e.sub_category === 'Truck');
        setTrucks([...subCatagory_trucks])


        const subCatagory_sportsCar = data.filter(e => e.sub_category === 'Sports Car');
        setSportsCar([...subCatagory_sportsCar])




    }






    console.log(regulerCar)


    return (
        <Container onClick={handle_react_tab}>
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
