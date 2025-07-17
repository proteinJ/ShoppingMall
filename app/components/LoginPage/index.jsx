'use client';

import React, { useState } from 'react';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
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
              />
            </div>
            
            <div className={styles.formOptions}>
              <label className={styles.checkboxContainer}>
                <input type="checkbox" />
                <span className={styles.checkmark}></span>
                Remember me
              </label>
              <a href="#" className={styles.forgotPassword}>Forgot password?</a>
            </div>
            
            <button type="submit" className={styles.loginButton}>
              Sign In
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