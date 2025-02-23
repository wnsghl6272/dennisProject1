// app/checkout/page.tsx
'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import apiClient from '@/app/utils/apiClient';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_YOUR_PUBLISHABLE_KEY!);

const Checkout: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromCart = searchParams.get('fromCart') === 'true';
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
  const [product, setProduct] = useState<{ productId: string; seller_name: string; description: string; price: string } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {

    // 로그인된 사용자 정보 가져오기
    const fetchUser = async () => {
      const response = await apiClient.get('/api/auth/user');
      if (response.status === 200) {
        setUserId(response.data.user.id); // userId 설정
      } else {
        console.error('Failed to fetch user:', response.data.message);
      }
    };

    const sellerName = searchParams.get('sellerName');
    const productDescription = searchParams.get('productDescription');
    const productPrice = searchParams.get('productPrice');
    const productId = searchParams.get('productId');

    if (sellerName && productDescription && productPrice && productId) {
      setProduct({
        productId: productId,
        seller_name: sellerName,
        description: productDescription,
        price: productPrice,
      });
    }
    fetchUser();

    // 장바구니 아이템 가져오기
    const fetchCartItems = async () => {
      if (userId) {
        try {
          const response = await apiClient.get(`/api/cart?userId=${userId}`);
          setCartItems(response.data.items);
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }
      }
    };

    fetchCartItems();
  }, [searchParams, userId]);

  // 총 금액 계산
  const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    if (!fullAddress) newErrors.fullAddress = 'Full address is required';
    if (!city) newErrors.city = 'City is required';
    if (!state) newErrors.state = 'State is required';
    if (!postalCode) newErrors.postalCode = 'Postal code is required';
    if (!country) newErrors.country = 'Country is required';
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Phone number is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // 유효성 검사 통과 여부 반환
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setPaymentStatus('Stripe.js has not loaded yet.');
      return;
    }

    if (!validateForm()) {
      setPaymentStatus('Please fix the errors in the form.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setPaymentStatus('Card element not found.');
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
  
      if (error) {
        setPaymentStatus(`Payment failed: ${error.message}`);
      } else {
        // 장바구니 결제와 단일 상품 결제 구분
        if (fromCart) {
          const response = await apiClient.post('/api/stripePayment', {
            paymentMethodId: paymentMethod.id,
            amount: totalAmount * 100, // cents로 변환
            userId: userId,
            fromCart: true,
            cartItems: cartItems,
            shippingInfo: {
              first_name: firstName,
              last_name: lastName,
              address: fullAddress,
              city: city,
              state: state,
              postal_code: postalCode,
              country: country,
              email: email,
              phone_number: phoneNumber,
            },
          });
          
          if (response.data.error) {
            setPaymentStatus(`Payment failed: ${response.data.error}`);
          } else {
            setPaymentStatus('Payment successful! Thank you for your purchase.');
            router.push('/payment-success');
          }
        } else if (product) {
          // 기존 단일 상품 결제 로직
          const response = await apiClient.post('/api/stripePayment', {
            paymentMethodId: paymentMethod.id,
            amount: parseFloat(product.price) * 100,
            productId: product.productId,
            userId: userId,
            shippingInfo: {
              first_name: firstName,
              last_name: lastName,
              address: fullAddress,
              city: city,
              state: state,
              postal_code: postalCode,
              country: country,
              email: email,
              phone_number: phoneNumber,
            },
          });

          if (response.data.error) {
            setPaymentStatus(`Payment failed: ${response.data.error}`);
          } else {
            setPaymentStatus('Payment successful! Thank you for your purchase.');
            router.push('/payment-success');
          }
        }
      }
    } catch (error) {
      setPaymentStatus('An unexpected error occurred. Please try again.');
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
          {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
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
          {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
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
          {errors.fullAddress && <p className="text-red-500">{errors.fullAddress}</p>}
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
          {errors.city && <p className="text-red-500">{errors.city}</p>}
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
          {errors.state && <p className="text-red-500">{errors.state}</p>}
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
          {errors.postalCode && <p className="text-red-500">{errors.postalCode}</p>}
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
          {errors.country && <p className="text-red-500">{errors.country}</p>}
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
          {errors.email && <p className="text-red-500">{errors.email}</p>}
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
          {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber}</p>}
        </div>

        <h2 className="text-2xl font-semibold mb-4">Payment Information</h2>
        <CardElement className="border-2 border-gray-300 rounded-lg w-full p-2" />

        <button
          type="submit"
          disabled={!stripe || !userId || (!product && !fromCart)}
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
          <p className="text-gray-800">Product ID: {product.productId}</p>
          <p className="text-3xl font-bold">Total: ${product.price}</p>
        </div>
      )}

      {/* Cart Items Section */}
      {!product && (
        <div className="mt-6 border-t border-gray-300 pt-4">
          <h2 className="text-2xl font-semibold mb-4">Cart Items</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img
                  src={item.photo_url}
                  alt={item.description}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="ml-4">
                  <p className="font-semibold">{item.description}</p>
                  <p className="text-gray-600">${item.price}</p>
                </div>
              </div>
            </div>
          ))}
          <p className="text-xl font-bold mt-4">Total: ${totalAmount.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

// Wrap the Checkout component with Elements
const CheckoutWrapper: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Elements stripe={stripePromise}>
        <Checkout />
      </Elements>
    </Suspense>
  );
};

export default CheckoutWrapper;