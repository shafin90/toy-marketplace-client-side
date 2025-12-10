import { useContext, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { AuthContext } from '../Provider/Provider';
import PageTitle from '../PageTitle/PageTitle';
import { Toaster, toast } from 'react-hot-toast';
import toyService from '../../services/toyService';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const Add_a_toy = () => {
    const { setMyToy, user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const toySchema = z.object({
        picture: z.string().url('Enter a valid image URL'),
        name: z.string().min(2, 'Name is required'),
        seller_name: z.string().min(2, 'Seller name is required'),
        seller_email: z.string().email('Enter a valid email'),
        sub_category: z.string().min(1, 'Select a sub-category'),
        creditCost: z.coerce.number().min(1, 'Credit cost must be at least 1'),
        ratings: z.coerce.number().min(0).max(5, 'Ratings must be between 0 and 5'),
        available_quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
        detail_description: z.string().min(10, 'Description must be at least 10 characters'),
    });

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(toySchema),
        defaultValues: {
            picture: '',
            name: '',
            seller_name: '',
            seller_email: user?.email || '',
            sub_category: '',
            creditCost: '',
            ratings: '',
            available_quantity: '',
            detail_description: '',
        }
    });

    const onSubmit = async (values) => {
        if (!user?.email) {
            toast.error('Please login to add a toy');
            return;
        }

        try {
            setLoading(true);

            const toyData = {
                name: values.name,
                picture: values.picture,
                pictureUrl: values.picture,
                sellerName: values.seller_name,
                seller_name: values.seller_name,
                sellerEmail: values.seller_email || user.email,
                seller_email: values.seller_email || user.email,
                subcategory: values.sub_category,
                sub_category: values.sub_category,
                creditCost: Number(values.creditCost) || 10,
                ratings: values.ratings,
                quantity: Number(values.available_quantity) || 1,
                available_quantity: Number(values.available_quantity) || 1,
                description: values.detail_description,
                detail_description: values.detail_description,
            };

            await toyService.addToy(toyData);

            reset({ seller_email: user?.email || '' });

            if (user?.email) {
                const updatedToys = await toyService.getUserToys(user.email);
                setMyToy(updatedToys);
            }

            toast.success('Item has been added to database');
        } catch (error) {
            console.error('Error adding toy:', error);
            toast.error(error.message || 'Failed to add toy. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form className='container mb-5' onSubmit={handleSubmit(onSubmit)}>
            <PageTitle title={"Add a toy"}></PageTitle>
            <h1 className='h1 my-4 text-center'>List a Toy for Swap</h1>
            <Row>
                <Col xs={12} md={6}>
                    <Form.Group controlId="picture">
                        <Form.Label>Picture URL of the toy</Form.Label>
                        <Form.Control type="text" placeholder="Enter picture URL" {...register('picture')} isInvalid={!!errors.picture} />
                        <Form.Control.Feedback type="invalid">{errors.picture?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" {...register('name')} isInvalid={!!errors.name} />
                        <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="seller_name">
                        <Form.Label>Seller Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter seller name" {...register('seller_name')} isInvalid={!!errors.seller_name} />
                        <Form.Control.Feedback type="invalid">{errors.seller_name?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="seller_email">
                        <Form.Label>Seller Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter seller email" {...register('seller_email')} isInvalid={!!errors.seller_email} />
                        <Form.Control.Feedback type="invalid">{errors.seller_email?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Group controlId="sub_category">
                        <Form.Label>Sub-category</Form.Label>
                        <Form.Control as="select" {...register('sub_category')} isInvalid={!!errors.sub_category}>
                            <option value="">Select sub-category</option>
                            <option value="Regular Car">Reguler Car</option>
                            <option value="Truck">Truck</option>
                            <option value="Sports Car">Sports Car</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.sub_category?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="creditCost">
                        <Form.Label>Credit Cost</Form.Label>
                        <Form.Control type="number" placeholder="e.g. 20" {...register('creditCost')} isInvalid={!!errors.creditCost} />
                        <Form.Control.Feedback type="invalid">{errors.creditCost?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="ratings">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control type="number" step="0.1" placeholder="Enter rating" {...register('ratings')} isInvalid={!!errors.ratings} />
                        <Form.Control.Feedback type="invalid">{errors.ratings?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="available_quantity">
                        <Form.Label>Available Quantity</Form.Label>
                        <Form.Control type="number" placeholder="Enter available quantity" {...register('available_quantity')} isInvalid={!!errors.available_quantity} />
                        <Form.Control.Feedback type="invalid">{errors.available_quantity?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group controlId="detail_description">
                <Form.Label>Detail Description</Form.Label>
                <Form.Control as="textarea" rows={5} placeholder="Enter detail description" {...register('detail_description')} isInvalid={!!errors.detail_description} />
                <Form.Control.Feedback type="invalid">{errors.detail_description?.message}</Form.Control.Feedback>
            </Form.Group>
            <Button className='my-3' variant="primary" type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Submit'}
            </Button>
            <Toaster />
        </Form>
    );
};

export default Add_a_toy;
