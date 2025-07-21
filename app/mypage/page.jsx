// app/components/MyPage/index.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import styles from './MyPage.module.css';
import AddressModal from '@/components/AddressModal';

const MyPage = () => {
  const { userInfo, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [addresses, setAddresses] = useState([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);

  // 주소 목록 불러오기
  const fetchAddresses = async () => {
    setIsAddressLoading(true);
    try {
      const res = await fetch('/api/address', { credentials: 'include' });
      const result = await res.json();
      if (result.success) {
        setAddresses(result.addresses || []);
      } else {
        setAddresses([]);
      }
    } catch (e) {
      setAddresses([]);
    } finally {
      setIsAddressLoading(false);
    }
  };

  // 주소 탭 진입 시 목록 불러오기
  useEffect(() => {
    if (activeTab === 'addresses') {
      fetchAddresses();
    }
  }, [activeTab]);

  // 주소 추가 후 목록 새로고침
  const handleAddressAdded = () => {
    fetchAddresses();
  };

  // 로그인되지 않은 경우 로그인 페이지로 리디렉션
  useEffect(() => {
    if (!isAuthLoading && !userInfo) {
      window.location.href = '/login';
    }
  }, [isAuthLoading, userInfo]);

  if (isAuthLoading) {
    return (
      <div className={styles.myPageContainer}>
        <Navbar />
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!userInfo) {
    return null; // 리디렉션 중이므로 빈 화면
  }

  return (
    <div className={styles.myPageContainer}>
      <Navbar />
      
      <div className={styles.content}>
        <div className={styles.sidebar}>
          <div className={styles.profileSection}>
            <div className={styles.avatar}>
              {userInfo?.name?.charAt(0) || 'U'}
            </div>
            <h3>{userInfo?.name || 'User'}</h3>
            <p>{userInfo?.email}</p>
          </div>

          <nav className={styles.nav}>
            <button 
              className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Information
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Order History
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'addresses' ? styles.active : ''}`}
              onClick={() => setActiveTab('addresses')}
            >
              Addresses
            </button>
          </nav>
        </div>

        <div className={styles.mainContent}>
          {activeTab === 'profile' && (
            <div className={styles.profileInfo}>
              <h2>Profile Information</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label>Full Name</label>
                  <p>{userInfo?.name}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Email</label>
                  <p>{userInfo?.email}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Phone Number</label>
                  <p>{userInfo?.phone || 'Not provided'}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Member Since</label>
                  <p>{new Date(userInfo?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button className={styles.editButton}>Edit Profile</button>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className={styles.orders}>
              <h2>Order History</h2>
              <div className={styles.ordersList}>
                <p className={styles.noOrders}>No orders yet. Start shopping!</p>
                <a href="/products" className={styles.shopButton}>Shop Now</a>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className={styles.addresses}>
              <h2>Delivery Addresses</h2>
              <div className={styles.addressesList}>
                {isAddressLoading ? (
                  <p>Loading...</p>
                ) : addresses.length === 0 ? (
                  <p className={styles.noAddresses}>No addresses saved yet.</p>
                ) : (
                  <ul className={styles.addressList}>
                    {addresses.map(addr => (
                      <li key={addr.id} className={styles.addressItem}>
                        <div className={styles.addressRow}>
                          <div>
                            <strong>{addr.name}</strong>
                            {addr.isDefault && <span className={styles.defaultBadge}>기본</span>}
                            <div>{addr.recipient} | {addr.phone}</div>
                            <div>{addr.zipcode} {addr.address} {addr.detailAddress}</div>
                          </div>
                          <button
                            className={styles.deleteButton}
                            onClick={async () => {
                              if (confirm('정말 삭제하시겠습니까?')) {
                                try {
                                  const res = await fetch(`/api/products/${addr.id}`, {
                                    method: 'DELETE',
                                    credentials: 'include',
                                  });
                                  if (res.ok) {
                                    fetchAddresses();
                                  } else {
                                    alert('삭제에 실패했습니다.');
                                  }
                                } catch (e) {
                                  alert('삭제 중 오류가 발생했습니다.');
                                }
                              }
                            }}
                            title="삭제"
                          >
                            ×
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  className={styles.addButton}
                  onClick={() => setIsAddressModalOpen(true)}
                >
                  Add New Address
                </button>
              </div>
            </div>
          )}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onAddressAdded={handleAddressAdded}
      />
        </div>
      </div>
    </div>
    
  );
};

export default MyPage;