// app/components/MainPage/index.jsx
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext'; 
import styles from './MainPage.module.css';
import Navbar from '@/components/Navbar'; 
import PageLoader from '@/components/PageLoader';

const MainPage = () => {
  const { userInfo, isLoggedIn, isLoading, logout } = useAuth(); 
  const [isPageLoading, setIsPageLoading] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        logout();
        alert('로그아웃되었습니다.');
        window.location.href = '/';
      } else {
        alert('로그아웃 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };
  
  const handlePageNavigation = (url) => {
    setIsPageLoading(true);
    setTimeout(() => {
      window.location.href = url;
    }, 100);
  };

  return (
    <>
      {isPageLoading && <PageLoader message="로딩 중..." />}
      
      <div className={styles.mainContainer}>
        {/* 공통 Navbar 사용 */}
        <Navbar />

        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroBackground}></div>
          <div className={styles.heroContent}>
            <h2 className={styles.heroTitle}>Premium Shopping Experience</h2>
            <p className={styles.heroSubtitle}>
              최고의 품질과 서비스를 만나보세요
            </p>
            <button 
              className={styles.ctaButton}
              onClick={() => handlePageNavigation('/products')}
            >
              상품 둘러보기
            </button>
          </div>
        </section>

        {/* Featured Products */}
        <section className={styles.featuredProducts}>
          <div className={styles.container}>
            <h3 className={styles.sectionTitle}>Featured Products</h3>
            <div className={styles.productsGrid}>
              <div className={styles.productCard}>
                <div className={styles.productImage}>
                  <div style={{
                    width: '100%',
                    height: '300px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.2rem'
                  }}>
                    Premium Product 1
                  </div>
                </div>
                <div className={styles.productInfo}>
                  <h3>Elegant Watch</h3>
                  <p className={styles.price}>₩299,000</p>
                </div>
              </div>
              
              <div className={styles.productCard}>
                <div className={styles.productImage}>
                  <div style={{
                    width: '100%',
                    height: '300px',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.2rem'
                  }}>
                    Premium Product 2
                  </div>
                </div>
                <div className={styles.productInfo}>
                  <h3>Luxury Bag</h3>
                  <p className={styles.price}>₩599,000</p>
                </div>
              </div>
              
              <div className={styles.productCard}>
                <div className={styles.productImage}>
                  <div style={{
                    width: '100%',
                    height: '300px',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.2rem'
                  }}>
                    Premium Product 3
                  </div>
                </div>
                <div className={styles.productInfo}>
                  <h3>Designer Shoes</h3>
                  <p className={styles.price}>₩399,000</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerInfo}>
              <h3>Au Revoir</h3>
              <div className={styles.contactInfo}>
                <p>Elegance Redefined</p>
                <p>문의: contact@aurevoir.com</p>
                <p>전화: 1588-0000</p>
              </div>
            </div>
            <div className={styles.footerLinks}>
              <button 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#ccc', 
                  cursor: 'pointer',
                  padding: 0,
                  textAlign: 'left',
                  fontSize: 'inherit'
                }}
                onClick={() => handlePageNavigation('/products')}
              >
                상품 목록
              </button>
              {!isLoggedIn && (
                <button 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#ccc', 
                    cursor: 'pointer',
                    padding: 0,
                    textAlign: 'left',
                    fontSize: 'inherit'
                  }}
                  onClick={() => handlePageNavigation('/login')}
                >
                  로그인
                </button>
              )}
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2024 Au Revoir. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MainPage;