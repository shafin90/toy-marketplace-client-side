import React, { useState } from 'react';
import { Button, Container, Form, Alert } from 'react-bootstrap';
import { toast } from 'react-hot-toast';

const Seeder = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const seedData = async () => {
        setLoading(true);
        setStatus('Starting seed...');

        const toys = [
            {
                picture: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                name: "Vintage Red Racer",
                seller_name: "John Doe",
                seller_email: "john@example.com",
                sub_category: "Sports Car",
                creditCost: 25,
                ratings: 4.5,
                available_quantity: 1,
                detail_description: "A classic red racer in excellent condition. Great for collectors!",
                email: "john@example.com"
            },
            {
                picture: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                name: "Blue Monster Truck",
                seller_name: "Jane Smith",
                seller_email: "jane@example.com",
                sub_category: "Truck",
                creditCost: 30,
                ratings: 5,
                available_quantity: 1,
                detail_description: "Big wheels, big fun! This monster truck can handle any terrain.",
                email: "jane@example.com"
            },
            {
                picture: "https://images.unsplash.com/photo-1532330384815-5133139f1b4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                name: "Yellow Taxi Cab",
                seller_name: "Mike Johnson",
                seller_email: "mike@example.com",
                sub_category: "Regular Car",
                creditCost: 15,
                ratings: 4,
                available_quantity: 2,
                detail_description: "Classic yellow taxi. Durable and fun for city play.",
                email: "mike@example.com"
            },
            {
                picture: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                name: "Speedster 3000",
                seller_name: "Sarah Wilson",
                seller_email: "sarah@example.com",
                sub_category: "Sports Car",
                creditCost: 40,
                ratings: 4.8,
                available_quantity: 1,
                detail_description: "Top of the line speedster. Aerodynamic design.",
                email: "sarah@example.com"
            },
            {
                picture: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                name: "Construction Dump Truck",
                seller_name: "Bob Builder",
                seller_email: "bob@example.com",
                sub_category: "Truck",
                creditCost: 35,
                ratings: 4.2,
                available_quantity: 3,
                detail_description: "Heavy duty dump truck for all your construction needs.",
                email: "bob@example.com"
            }
        ];

        try {
            // We are using the endpoint found in Add_a_toy.jsx: https://carz-server-shafin90.vercel.app/users
            // Note: The backend seems to use /users for posting toys based on existing code.
            const endpoint = 'https://carz-server-shafin90.vercel.app/users';

            let successCount = 0;
            for (const toy of toys) {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(toy)
                });

                if (response.ok) {
                    successCount++;
                } else {
                    console.error("Failed to seed toy:", toy.name);
                }
            }

            setStatus(`Seeding complete! Successfully added ${successCount} toys.`);
            toast.success(`Seeded ${successCount} toys!`);

        } catch (error) {
            console.error("Seeding error:", error);
            setStatus(`Error seeding data: ${error.message}`);
            toast.error("Seeding failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-5 text-center">
            <h2>Database Seeder 🌱</h2>
            <p>Click below to populate the database with sample toys.</p>
            <Button onClick={seedData} disabled={loading} variant="success" size="lg">
                {loading ? 'Seeding...' : 'Seed Data Now'}
            </Button>
            {status && <Alert className="mt-3" variant="info">{status}</Alert>}
        </Container>
    );
};

export default Seeder;
