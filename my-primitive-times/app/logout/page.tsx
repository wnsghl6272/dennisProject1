// app/logout/page.tsx
'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../store/store';
import { logout } from '../store/store';

const Logout: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await axios.post('/api/auth/logout');
        dispatch(logout()); // Redux 상태 업데이트
        router.push('/'); // 홈 페이지로 리다이렉트
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    performLogout();
  }, [dispatch, router]);

  return null; // 로그아웃 페이지는 UI가 필요하지 않으므로 아무것도 렌더링하지 않음
};

export default Logout;
