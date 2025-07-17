'use client';

import React from 'react';
import styles from './MainPage.module.css';

const MainPage = ({ isLoggedIn, userInfo }) => {
  return (
    <div className={styles.mainContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <a href="/">Au Revoir</a>
          </div>
          <nav className={styles.navIcons}>
            <div className={styles.icon}>
              <img src="https://cdn-icons-png.flaticon.com/512/54/54481.png" alt="Search" />
            </div>
            <div className={styles.icon}>
              <img src="https://cdn-icons-png.flaticon.com/512/833/833472.png" alt="Wish" />
            </div>
            <div className={styles.icon}>
              <img src="https://cdn-icons-png.flaticon.com/512/263/263142.png" alt="Cart" />
            </div>
            <div className={styles.authButtons}>
              {isLoggedIn ? (
                <>
                  <span className={styles.welcomeText}>Welcome, {userInfo?.name || 'User'}</span>
                  <a href="/logout" className={styles.authLink}>Logout</a>
                </>
              ) : (
                <>
                  <a href="/login" className={styles.authLink}>Login</a>
                  <a href="/register" className={styles.authLink}>Sign Up</a>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Elegance Redefined</h1>
          <p className={styles.heroSubtitle}>Discover timeless pieces that speak to your soul</p>
          <button className={styles.ctaButton}>Shop Collection</button>
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.featuredProducts}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Featured Collection</h2>
          <div className={styles.productsGrid}>
            <div className={styles.productCard}>
              <div className={styles.productImage}>
                <img src="/image/product1.png" alt="Product 1" />
              </div>
              <div className={styles.productInfo}>
                <h3>B Logo Cotton Ribbon Band</h3>
                <p className={styles.price}>₩49,000</p>
              </div>
            </div>
            <div className={styles.productCard}>
              <div className={styles.productImage}>
                <img src="/image/product2.png" alt="Product 2" />
              </div>
              <div className={styles.productInfo}>
                <h3>Mint Daphne Argyle Knit Vest</h3>
                <p className={styles.price}>₩39,000</p>
              </div>
            </div>
            <div className={styles.productCard}>
              <div className={styles.productImage}>
                <img src="/image/product3.png" alt="Product 3" />
              </div>
              <div className={styles.productInfo}>
                <h3>Ivory Tweed Chain Belt Mini Bag</h3>
                <p className={styles.price}>₩59,000</p>
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
              <p>Company: 주식회사 Au Revoir</p>
              <p>CEO: ProteinJ</p>
              <p>Email: ymnii111@gmail.com</p>
              <p>TEL: 02-1234-1234</p>
            </div>
          </div>
          <div className={styles.footerLinks}>
            <a href="#">Instagram</a>
            <a href="#">Order</a>
            <a href="#">Contact</a>
            <a href="#">Guide</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2025 ProteinJ All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;