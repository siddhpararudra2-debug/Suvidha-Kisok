import express from 'express';
import Stripe from 'stripe';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Initialize Stripe with a test key (or environment variable if available)
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_51Px_DEMO_KEY_xxx'; 
const stripe = new Stripe(STRIPE_SECRET_KEY);

router.post('/create-intent', async (req, res) => {
    try {
        const { amount, currency = 'inr' } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid or missing amount' });
        }

        // Create a PaymentIntent with the order amount and currency
        // Stripe requires amount in smallest currency unit (e.g., paisa for INR)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        logger.info(`Payment intent created for amount ₹${amount}`);
        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error: any) {
        logger.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

export default router;
