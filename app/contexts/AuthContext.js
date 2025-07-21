// app/contexts/AuthContext.js
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서 사용해야 합니다');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true로 변경

  // 앱 시작 시 로그인 상태 확인
  useEffect(() => {
    checkAuthStatus(); // 주석 해제
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        console.log('사용자 정보 응답:', result);
        if (result.success) {
          setUserInfo(result.user);
        }
      }
    } catch (error) {
      console.error('인증 확인 실패:', error);
      setUserInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (user) => {
    setUserInfo(user);
  };

  const logout = () => {
    setUserInfo(null);
  };

  const value = {
    userInfo,
    setUserInfo,
    isLoading,
    isLoggedIn: !!userInfo,
    isAdmin: userInfo && userInfo.role === 'admin',
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};