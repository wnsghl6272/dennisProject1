'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import apiClient from '@/app/utils/apiClient';

const Checkout: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Get search parameters
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentType, setPaymentType] = useState('');
  
  // checkout product details
  const [product, setProduct] = useState<{ seller_name: string; description: string; price: string } | null>(null);
  
  // credit card payment
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    const sellerName = searchParams.get('sellerName');
    const productDescription = searchParams.get('productDescription');
    const productPrice = searchParams.get('productPrice');

    // Set product details from search parameters for checkout
    if (sellerName && productDescription && productPrice) {
      setProduct({
        seller_name: sellerName,
        description: productDescription,
        price: productPrice,
      });
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    console.log({
      firstName,
      lastName,
      country,
      fullAddress,
      city,
      state,
      postalCode,
      email,
      phoneNumber,
      paymentType,
    });

    // Simulate payment processing
    if (paymentType === 'credit_card') {
      simulatePayment();
    }
  };

  const simulatePayment = () => {
    // Basic validation for credit card fields
    if (!cardNumber || !expirationDate || !cvv) {
      setPaymentStatus('Please fill in all credit card fields.');
      return;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <h2 className="text-2xl font-semibold mb-4">Payment Type</h2>
        <div>
          <label className="block mb-1">Select Payment Type</label>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            className="border-2 border-gray-300 rounded-lg w-full p-2"
            required
          >
            <option value="">Select a payment type</option>
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>

        {/* Credit Card Fields */}
        {paymentType === 'credit_card' && (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-2">Credit Card Information</h2>
            <div>
              <label className="block mb-1">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="border-2 border-gray-300 rounded-lg w-full p-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Expiration Date (MM/YY)</label>
              <input
                type="text"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="border-2 border-gray-300 rounded-lg w-full p-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1">CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="border-2 border-gray-300 rounded-lg w-full p-2"
                required
              />
            </div>
          </div>
        )}

        {/* New Section for Product Details */}
        {product && (
          <div className="mt-6 border-t border-gray-300 pt-4">
            <h2 className="text-2xl font-semibold mb-2">Product Details</h2>
            <p className="text-gray-800">Seller: {product.seller_name}</p>
            <p className="text-gray-800">Description: {product.description}</p>
            <p className="text-3xl font-bold">${product.price}</p>
          </div>
        )}

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
    </div>
  );
};

export default Checkout;