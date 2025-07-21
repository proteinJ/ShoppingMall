import React, { useRef, useEffect } from 'react';
import styles from './Navbar.module.css';

const popularKeywords = [
  '#스포츠', '#파자마', '#PREMIUM', '#한정', '#브리프', '#슬립'
];

export default function SearchOverlay({ onClose }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className={styles.searchOverlayTop}>
      <div className={styles.searchOverlayContent}>
        <input
          ref={inputRef}
          className={styles.searchOverlayInput}
          placeholder="검색어를 입력해주세요."
        />
        <div className={styles.searchOverlayPopularWrap}>
          <span className={styles.searchOverlayPopularTitle}>인기 검색어</span>
          <div className={styles.searchOverlayPopularList}>
            {popularKeywords.map((kw) => (
              <span key={kw} className={styles.searchOverlayPopularItem}>{kw}</span>
            ))}
          </div>
        </div>
      </div>
      <button className={styles.searchOverlayClose} onClick={onClose} aria-label="닫기">
          ×
      </button>
    </div>
  );
}