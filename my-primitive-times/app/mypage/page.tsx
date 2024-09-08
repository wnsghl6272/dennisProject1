// app/components/MyPage.tsx
'use client'
import { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';

interface User {
  username: string;
  email: string;
}

const MyPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await apiClient.get('/api/auth/user');
        setUser(response.data.user);
      } catch (err) {
        setError('Failed to fetch user details');
      }
    };

    fetchUserDetails();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.username}</h1>
          <p>Email: {user.email}</p>
          {/* Display more user details as needed */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MyPage;
