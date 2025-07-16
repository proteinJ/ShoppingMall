'use client';

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';

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
      <Navbar isLoggedIn={isLoggedIn} userInfo={userInfo} />
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Welcome to My Next.js App</h1>
        <p>This is a basic setup for Next.js project</p>
      </main>
    </div>
  );
}