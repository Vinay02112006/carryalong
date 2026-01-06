import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import axiosInstance from '../api/axios';

// Replace with your Stripe Public Key
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutForm = ({ parcelId, amount, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);
        setError(null);

        if (!stripe || !elements) {
            return;
        }

        try {
            // 1. Create Payment Intent
            const { data } = await axiosInstance.post('/payments/create-intent', {
                parcelId
            });

            const cardElement = elements.getElement(CardElement);

            // 2. Confirm Card Payment
            const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(
                data.clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                    },
                }
            );

            if (stripeError) {
                setError(stripeError.message);
                setProcessing(false);
            } else {
                // 3. Confirm on Backend
                await axiosInstance.post('/payments/confirm', {
                    paymentIntentId: paymentIntent.id,
                    parcelId
                });
                onSuccess();
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Payment failed');
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <h3 className="text-lg font-bold mb-4">Pay Securely</h3>
            <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Amount to Hold:</p>
                <p className="text-2xl font-bold">₹{amount}</p>
            </div>

            <div className="border border-gray-300 rounded-lg p-3 mb-4">
                <CardElement options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }} />
            </div>

            {error && (
                <div className="text-red-500 text-sm mb-4">{error}</div>
            )}

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 btn-secondary"
                    disabled={processing}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!stripe || processing}
                    className="flex-1 btn-primary disabled:opacity-50"
                >
                    {processing ? 'Processing...' : 'Pay Now'}
                </button>
            </div>
        </form>
    );
};

const PaymentModal = ({ parcelId, amount, onSuccess, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <Elements stripe={stripePromise}>
                    <CheckoutForm
                        parcelId={parcelId}
                        amount={amount}
                        onSuccess={onSuccess}
                        onCancel={onCancel}
                    />
                </Elements>
            </div>
        </div>
    );
};

export default PaymentModal;
