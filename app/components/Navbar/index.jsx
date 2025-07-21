'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import styles from './Navbar.module.css';
import SearchOverlay from './SearchOverlay';


const CATEGORY_LIST = [
  { id: 1, name: '액세사리' },
  { id: 2, name: '의류' },
  { id: 3, name: '가방' },
  { id: 4, name: '신발' },
  { id: 5, name: '기타' },
];

const GENDER_LIST = [
  { value: 'FEMALE', label: 'WOMEN' },
  { value: 'MALE', label: 'MEN' },
  { value: 'UNISEX', label: '공용' },
];

const Navbar = () => {
  const { userInfo, isLoggedIn, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [saleOpen, setSaleOpen] = useState(false);

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
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  const handlePageNavigation = (url) => {
    window.location.href = url;
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* 로고 */}
        <div className={styles.logo}>
          <a href="/" onClick={e => { e.preventDefault(); handlePageNavigation('/'); }}>
            MODA
          </a>
        </div>

        {/* 메뉴 */}
        <nav className={styles.menu}>
          {/* SHOP */}
          <div
            className={styles.menuItem}
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <a className={styles.menuLink} href="/products" onClick={e => { e.preventDefault(); handlePageNavigation('/products'); }}>SHOP</a>
            {shopOpen && (
              <>
              <div className={styles.megaMenuBgShop} />
              <div className={styles.megaMenuPanel}>
                  <div className={styles.megaLeft}>
                    <div className={styles.megaTitle}>성별</div>
                    {GENDER_LIST.map(g => (
                      <Link
                        key={g.value}
                        href={`/products?gender=${g.value}`}
                        className={styles.megaLink}
                      >
                        {g.label}
                      </Link>
                    ))}
                  </div>
                  <div className={styles.megaRight}>
                    <div className={styles.megaTitle}>카테고리</div>
                    {CATEGORY_LIST.map(c => (
                      <Link
                        key={c.id}
                        href={`/products?category=${c.id}`}
                        className={styles.megaLink}
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          {/* CUSTOMER CARE */}
          <div
            className={styles.menuItem}
            onMouseEnter={() => setCustomerOpen(true)}
            onMouseLeave={() => setCustomerOpen(false)}
            style={{ position: 'relative' }}
          >
            <a className={styles.menuLink} href="/customer-care" onClick={e => { e.preventDefault(); handlePageNavigation('/customer-care'); }}>CUSTOMER CARE</a>
            {customerOpen && (
              <>
                <div className={styles.megaMenuBgCustomer} />
                <div className={styles.megaMenuPanel}>
                  {/* 원하는 CUSTOMER CARE 내용 */}
                  <div>
                    <div className={styles.megaTitle}>고객센터</div>
                    <Link href="/customer-care/faq" className={styles.megaLink}>FAQ</Link>
                    <Link href="/customer-care/contact" className={styles.megaLink}>문의하기</Link>
                    <Link href="/customer-care/shipping" className={styles.megaLink}>배송 안내</Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* SALE */}
          <div
            className={styles.menuItem}
            onMouseEnter={() => setSaleOpen(true)}
            onMouseLeave={() => setSaleOpen(false)}
            style={{ position: 'relative' }}
          >
            <a className={styles.menuLink} href="/sale" onClick={e => { e.preventDefault(); handlePageNavigation('/sale'); }}>SALE</a>
            {saleOpen && (
              <>
                <div className={styles.megaMenuBgSale} />
                <div className={styles.megaMenuPanel}>
                  {/* 원하는 SALE 내용 */}
                  <div>
                    <div className={styles.megaTitle}>세일 상품</div>
                    <Link href="/sale/new" className={styles.megaLink}>신상품 세일</Link>
                    <Link href="/sale/best" className={styles.megaLink}>베스트 세일</Link>
                    <Link href="/sale/last" className={styles.megaLink}>마지막 찬스</Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </nav>


        {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
        {/* 우측 아이콘/유저 */}
        <div className={styles.right}>
          {/* 검색 */}
          <button
            className={styles.searchIconBtn}
            onClick={() => setShowSearch(true)}
            aria-label="검색"
            type="button"
          >
            <span className={styles.searchIcon}>🔍</span>
          </button>
          <button className={styles.iconBtn} title="장바구니" onClick={() => handlePageNavigation('/cart')}>
            <span>🛒</span>
          </button>
          {isLoggedIn ? (
            <div className={styles.userMenuWrap}
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <button className={styles.userBtn}>
                <span className={styles.userIcon}>👤</span>
                <span className={styles.userName}>{userInfo?.name}</span>
              </button>
              {showUserMenu && (
                <div className={styles.userDropdown}>
                  <button onClick={() => handlePageNavigation(userInfo?.role === 'admin' ? '/admin' : '/mypage')}>
                    {userInfo?.role === 'admin' ? '관리자 페이지' : '마이페이지'}
                  </button>
                  <button onClick={handleLogout}>로그아웃</button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authBtns}>
              <button className={styles.loginBtn} onClick={() => handlePageNavigation('/login')}>Log In</button>
              <button className={styles.signupBtn} onClick={() => handlePageNavigation('/register')}>Sign Up</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;