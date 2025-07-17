'use client';

import { useState, useEffect } from 'react';
import MainPage from './components/MainPage';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUserInfo(data.user);
      }
    } catch (error) {
      console.error('인증 확인 실패:', error);
    }
  };

  return (
    <div>
      <MainPage isLoggedIn={isLoggedIn} userInfo={userInfo} />
    </div>
  );
}