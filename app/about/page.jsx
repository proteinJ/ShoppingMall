'use client';

import styles from './About.module.css';

export default function AboutPage() {
  return (
    <div className={styles.aboutBg}>
      <div className={styles.aboutCard}>
        <h1 className={styles.title}>About Our Shopping Mall</h1>
        <p className={styles.desc}>
          저희 쇼핑몰은 최신 트렌드와 감각적인 디자인, 그리고 편리한 쇼핑 경험을 제공합니다.<br />
          <span className={styles.point}>고객 중심</span>의 서비스와 <span className={styles.point2}>안전한 결제 시스템</span>으로<br />
          언제 어디서나 쉽고 빠르게 원하는 상품을 만나보세요.
        </p>
        <div className={styles.features}>
          <div className={styles.featureBox}>
            <span className={styles.emoji}>🚚</span>
            <div className={styles.featureTitle}>빠른 배송</div>
          </div>
          <div className={styles.featureBox}>
            <span className={styles.emoji}>💳</span>
            <div className={styles.featureTitle}>다양한 결제</div>
          </div>
          <div className={styles.featureBox}>
            <span className={styles.emoji}>⭐</span>
            <div className={styles.featureTitle}>믿을 수 있는 리뷰</div>
          </div>
        </div>
        <a href="/products" className={styles.shopBtn}>쇼핑하러 가기</a>
      </div>
    </div>
  );
}