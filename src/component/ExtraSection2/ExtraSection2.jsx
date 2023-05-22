import React from 'react';
import { Container } from 'react-bootstrap';

const ExtraSection2 = () => {
    return (
        <div className='my-5'>
            <Container>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <h1>
                            The most expensive toy
                        </h1>
                        <article>
                            The most expensive car toy is the limited edition 1:8 scale replica of the Bugatti Veyron, produced by the luxury car model manufacturer, Amalgam Collection. This exquisite car toy is meticulously crafted with precision and attention to detail, featuring an accurate representation of the iconic Bugatti Veyron supercar. The price of this highly sought-after car toy reaches an astonishing $40,000, making it a truly exclusive and prized collector's item. Its high price tag is justified by the use of high-quality materials, hand-finishing techniques, and the intricate craftsmanship involved in replicating the iconic design of the Bugatti Veyron.
                        </article>
                    </div>
                    <div className="col-12 d-flex justify-content-center align-items-center col-md-6"><img className='img-fluid' src="https://3dprint.com/wp-content/uploads/2015/05/bugatti6.jpg" alt="" /></div>
                </div>
            </Container>

        </div>
    );
};

export default ExtraSection2;