'use client';

import React, { useState } from 'react';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
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
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          alert('회원가입 성공! 로그인 페이지로 이동합니다.');
          // 폼 초기화
          setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
          });
          // 로그인 페이지로 이동
          window.location.href = '/login';
        } else {
          alert(data.message || '회원가입에 실패했습니다.');
        }
      } catch (error) {
        console.error('회원가입 오류:', error);
        alert('회원가입 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerBackground}></div>
      <div className={styles.registerContent}>
        <div className={styles.registerFormContainer}>
          <div className={styles.registerHeader}>
            <h1>Create Account</h1>
            <p>Join Au Revoir and discover elegance</p>
          </div>
          
          <form onSubmit={handleSubmit} className={styles.registerForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
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
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className={styles.termsContainer}>
              <label className={styles.checkboxContainer}>
                <input type="checkbox" required disabled={isLoading} />
                <span className={styles.checkmark}></span>
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>
            
            <button type="submit" className={styles.registerButton} disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <div className={styles.registerFooter}>
            <p>Already have an account? <a href="/login">Sign in</a></p>
            <a href="/" className={styles.backHome}>← Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;