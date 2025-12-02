import React from 'react';
import { Container, Accordion } from 'react-bootstrap';
import PageTitle from '../PageTitle/PageTitle';
import './FAQ.css';

const FAQ = () => {
    return (
        <Container className="my-5">
            <PageTitle title="FAQ" />
            <div className="faq-wrapper">
                <h2 className="faq-main-title">
                    Frequently Asked Questions
                    <span className="emoji-wiggle">🤔</span>
                </h2>
                <p className="faq-subtitle">
                    Everything you need to know about our Toy Swap Circle!
                </p>

                <Accordion defaultActiveKey="0" className="faq-accordion">
                    <Accordion.Item eventKey="0" className="faq-item">
                        <Accordion.Header>
                            <span className="question-icon">💎</span>
                            <span>How do I earn credits?</span>
                        </Accordion.Header>
                        <Accordion.Body>
                            You earn credits by listing your old toys! When you list a toy, you set a credit value.
                            Once another user swaps for your toy, those credits are added to your account.
                            It's that simple! The more toys you share, the more credits you earn! 🎉
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="1" className="faq-item">
                        <Accordion.Header>
                            <span className="question-icon">🚚</span>
                            <span>Is shipping included?</span>
                        </Accordion.Header>
                        <Accordion.Body>
                            Currently, swaps are arranged between users. We recommend meeting in safe, public locations
                            for local swaps (like parks or community centers), or agreeing on shipping costs if you're
                            far apart. Safety first! 🛡️
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="2" className="faq-item">
                        <Accordion.Header>
                            <span className="question-icon">💰</span>
                            <span>Can I buy credits with money?</span>
                        </Accordion.Header>
                        <Accordion.Body>
                            No, the Toy Swap Circle is a strictly swap-based economy. The only way to earn credits is
                            by contributing toys to the community! This keeps our circle fair and encourages sharing.
                            Together we reduce waste! 🌍♻️
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="3" className="faq-item">
                        <Accordion.Header>
                            <span className="question-icon">✨</span>
                            <span>What condition should the toys be in?</span>
                        </Accordion.Header>
                        <Accordion.Body>
                            Toys should be clean, safe, and in working condition. Please be honest in your descriptions
                            and photos - it helps build trust in our community! Broken or dangerous toys are not allowed.
                            Let's keep playtime safe and fun! 🧸
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        </Container>
    );
};

export default FAQ;
