// app/checkout/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import apiClient from '@/app/utils/apiClient';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_YOUR_PUBLISHABLE_KEY!); // Replace with your actual publishable key

const Checkout: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [product, setProduct] = useState<{ seller_name: string; description: string; price: string } | null>(null);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const sellerName = searchParams.get('sellerName');
    const productDescription = searchParams.get('productDescription');
    const productPrice = searchParams.get('productPrice');

    if (sellerName && productDescription && productPrice) {
      setProduct({
        seller_name: sellerName,
        description: productDescription,
        price: productPrice,
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setPaymentStatus('Stripe.js has not loaded yet.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setPaymentStatus('Card element not found.');
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setPaymentStatus(`Payment failed: ${error.message}`);
    } else {
      if (product) { // Check if product is not null
        const response = await apiClient.post('/api/stripePayment', {
          paymentMethodId: paymentMethod.id,
          amount: parseFloat(product.price) * 100, // Convert to cents
        });

        if (response.data.error) {
          setPaymentStatus(`Payment failed: ${response.data.error}`);
        } else {
          setPaymentStatus('Payment successful! Thank you for your purchase.');
        }
      } else {
        setPaymentStatus('Product information is missing.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Shipping Address Fields */}
        <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
        <div>
          <label className="block mb-1">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border-2 border-gray-300 rounded-lg w-full p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border-2 border-gray-300 rounded-lg w-full p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Full Address</label>
          <input
            type="text"
            value={fullAddress}
            onChange={(e) => setFullAddress(e.target.value)}
            className="border-2 border-gray-300 rounded-lg w-full p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border-2 border-gray-300 rounded-lg w-full p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">State</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="border-2 border-gray-300 rounded-lg w-full p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Postal Code</label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="border-2 border-gray-300 rounded-lg w-full p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="border-2 border-gray-300 rounded-lg w-full p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-gray-300 rounded-lg w-full p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border-2 border-gray-300 rounded-lg w-full p-2"
            required
          />
        </div>

        <h2 className="text-2xl font-semibold mb-4">Payment Information</h2>
        <CardElement className="border-2 border-gray-300 rounded-lg w-full p-2" />

        <button
          type="submit"
          className="bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition duration-200 ease-in-out"
        >
          Complete Order
        </button>

        {/* Display Payment Status */}
        {paymentStatus && (
          <div className="mt-4 text-green-600">
            {paymentStatus}
          </div>
        )}
      </form>

      {/* Product Details Section */}
      {product && (
        <div className="mt-6 border-t border-gray-300 pt-4">
          <h2 className="text-2xl font-semibold mb-2">Product Details</h2>
          <p className="text-gray-800">Seller: {product.seller_name}</p>
          <p className="text-gray-800">Description: {product.description}</p>
          <p className="text-3xl font-bold">${product.price}</p>
        </div>
      )}
    </div>
  );
};

// Wrap the Checkout component with Elements
const CheckoutWrapper: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <Checkout />
    </Elements>
  );
};

export default CheckoutWrapper;