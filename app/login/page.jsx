'use client';

import React, { useState } from 'react';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // 쿠키 포함
      });

      const data = await response.json();

      if (response.ok) {
        alert('로그인 성공!');
        window.location.href = '/'; // 메인 페이지로 이동
      } else {
        alert(data.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBackground}></div>
      <div className={styles.loginContent}>
        <div className={styles.loginFormContainer}>
          <div className={styles.loginHeader}>
            <h1>Welcome Back</h1>
            <p>Sign in to your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className={styles.formOptions}>
              <label className={styles.checkboxContainer}>
                <input type="checkbox" disabled={isLoading} />
                <span className={styles.checkmark}></span>
                Remember me
              </label>
              <a href="#" className={styles.forgotPassword}>Forgot password?</a>
            </div>
            
            <button 
              type="submit" 
              className={styles.loginButton}
              disabled={isLoading}
            >
              {isLoading ? 'loging In...' : 'Sign In'}
            </button>
          </form>
          
          <div className={styles.loginFooter}>
            <p>Don't have an account? <a href="/register">Sign up</a></p>
            <a href="/" className={styles.backHome}>← Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;