// app/components/AdminPage/index.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import PageLoader from '@/components/PageLoader';
import UserModal from '../components/UserModal';
import styles from './AdminPage.module.css';

const AdminPage = () => {
  const { userInfo, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  // 관리자가 아닌 경우 접근 차단
  useEffect(() => {
    if (!isAuthLoading && (!userInfo || userInfo.role !== 'admin')) {
      alert('관리자만 접근 가능합니다.');
      window.location.href = '/';
    }
  }, [isAuthLoading, userInfo]);

  // 탭 변경 시 데이터 로드
  useEffect(() => {
    if (userInfo && userInfo.role === 'admin') {
      if (activeTab === 'products') {
        fetchProducts();
      } else if (activeTab === 'users') {
        fetchUsers();
      }
    }
  }, [activeTab, userInfo]);

  // 상품 목록 조회
  const fetchProducts = async () => {
    try {
      setIsProductsLoading(true);
      setError('');
      
      const response = await fetch('/api/products', {
        method: 'GET',
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setProducts(Array.isArray(result.products) ? result.products : []);
      } else {
        setError(result.message || '상품 목록을 불러오는데 실패했습니다.');
        setProducts([]);
      }
    } catch (error) {
      console.error('상품 목록 조회 오류:', error);
      setError('상품 목록을 불러오는데 실패했습니다.');
      setProducts([]);
    } finally {
      setIsProductsLoading(false);
    }
  };

  // 사용자 목록 조회
  const fetchUsers = async () => {
    try {
      setIsUsersLoading(true);
      setError('');
      
      const response = await fetch('/api/user', {
        method: 'GET',
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setUsers(Array.isArray(result.users) ? result.users : []);
      } else {
        setError(result.message || '사용자 목록을 불러오는데 실패했습니다.');
        setUsers([]);
      }
    } catch (error) {
      console.error('사용자 목록 조회 오류:', error);
      setError('사용자 목록을 불러오는데 실패했습니다.');
      setUsers([]);
    } finally {
      setIsUsersLoading(false);
    }
  };

  // 상품 삭제
  const handleDeleteProduct = async (productId) => {
    if (!confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        alert('상품이 성공적으로 삭제되었습니다.');
        fetchProducts(); // 목록 새로고침
      } else {
        alert(result.message || '상품 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('상품 삭제 오류:', error);
      alert('상품 삭제 중 오류가 발생했습니다.');
    }
  };

  // 상품 상세 조회
  const handleViewProduct = async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'GET',
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        window.location.href = `/products/${productId}`;
      } else {
        alert(result.message || '상품 정보를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('상품 상세 조회 오류:', error);
      alert('상품 정보를 불러오는데 실패했습니다.');
    }
  };

  // 상품 수정 페이지로 이동
  const handleEditProduct = (productId) => {
    window.location.href = `/admin/products/${productId}/edit`;
  };

  // 사용자 상세 조회 (모달 열기)
  const handleViewUser = async (userId) => {
    try {
      setIsModalLoading(true);
      setIsModalOpen(true);
      
      const response = await fetch(`/api/user/${userId}`, {
        method: 'GET',
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        console.log('사용자 데이터:', result.user); // 🔍 디버깅용
        setSelectedUser(result.user);
      } else {
        alert(result.message || '사용자 정보를 불러오는데 실패했습니다.');
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('사용자 상세 조회 오류:', error);
      alert('사용자 정보를 불러오는데 실패했습니다.');
      setIsModalOpen(false);
    } finally {
      setIsModalLoading(false);
    }
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // 사용자 수정 완료 후 콜백
  const handleUserUpdated = () => {
    fetchUsers(); // 사용자 목록 새로고침
    handleCloseModal();
  };

  // 사용자 삭제 완료 후 콜백
  const handleUserDeleted = () => {
    fetchUsers(); // 사용자 목록 새로고침
    handleCloseModal();
  };

  // 유틸리티 함수들
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const handlePageNavigation = (url) => {
    window.location.href = url;
  };

  // 로딩 중일 때
  if (isAuthLoading) {
    return (
      <>
        <Navbar />
        <PageLoader message="관리자 권한을 확인하는 중..." />
      </>
    );
  }

  if (!userInfo || userInfo.role !== 'admin') {
    return null;
  }

  return (
    <div className={styles.adminContainer}>
      <Navbar />
      
      <div className={styles.content}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>관리자 메뉴</h3>
          </div>
          
          <nav className={styles.sidebarNav}>
            <button 
              className={`${styles.navItem} ${activeTab === 'products' ? styles.active : ''}`}
              onClick={() => setActiveTab('products')}
            >
              📦 상품 관리
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'users' ? styles.active : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 사용자 관리
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              📋 주문 관리
            </button>
          </nav>
        </div>

        <div className={styles.mainContent}>
          {activeTab === 'products' && (
            <div className={styles.tabContent}>
              <h2>상품 관리</h2>
              <div className={styles.contentHeader}>
                <button 
                  className={styles.addButton}
                  onClick={() => handlePageNavigation('/products/register')}
                >
                  + 새 상품 추가
                </button>
                <button 
                  className={styles.refreshButton}
                  onClick={fetchProducts}
                  disabled={isProductsLoading}
                >
                  🔄 새로고침
                </button>
              </div>
              
              {isProductsLoading ? (
                <div className={styles.tableLoading}>
                  <p>상품 목록을 불러오는 중...</p>
                </div>
              ) : error ? (
                <div className={styles.error}>
                  <p>{error}</p>
                  <button onClick={fetchProducts}>다시 시도</button>
                </div>
              ) : (
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>상품 ID</th>
                        <th>상품명</th>
                        <th>카테고리</th>
                        <th>가격</th>
                        <th>재고</th>
                        <th>상태</th>
                        <th>등록일</th>
                        <th>액션</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan="8" className={styles.noData}>
                            등록된 상품이 없습니다.
                          </td>
                        </tr>
                      ) : (
                        products.map(product => (
                          <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.category || '일반'}</td>
                            <td>₩{formatPrice(product.price)}</td>
                            <td>{product.stock || 0}</td>
                            <td>
                              <span className={`${styles.statusBadge} ${product.status === 'active' ? styles.active : styles.inactive}`}>
                                {product.status === 'active' ? '활성' : '비활성'}
                              </span>
                            </td>
                            <td>{formatDate(product.createdAt)}</td>
                            <td>
                              <div className={styles.actionButtons}>
                                <button 
                                  className={styles.viewBtn}
                                  onClick={() => handleViewProduct(product.id)}
                                  title="상품 상세 보기"
                                >
                                  👁️
                                </button>
                                <button 
                                  className={styles.editBtn}
                                  onClick={() => handleEditProduct(product.id)}
                                  title="상품 수정"
                                >
                                  ✏️
                                </button>
                                <button 
                                  className={styles.deleteBtn}
                                  onClick={() => handleDeleteProduct(product.id)}
                                  title="상품 삭제"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className={styles.tabContent}>
              <h2>사용자 관리</h2>
              <div className={styles.contentHeader}>
                <button 
                  className={styles.refreshButton}
                  onClick={fetchUsers}
                  disabled={isUsersLoading}
                >
                  🔄 새로고침
                </button>
              </div>
              
              {isUsersLoading ? (
                <div className={styles.tableLoading}>
                  <p>사용자 목록을 불러오는 중...</p>
                </div>
              ) : error ? (
                <div className={styles.error}>
                  <p>{error}</p>
                  <button onClick={fetchUsers}>다시 시도</button>
                </div>
              ) : (
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>사용자 ID</th>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>역할</th>
                        <th>가입일</th>
                        <th>상태</th>
                        <th>액션</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="7" className={styles.noData}>
                            등록된 사용자가 없습니다.
                          </td>
                        </tr>
                      ) : (
                        users.map(user => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`${styles.roleBadge} ${user.role === 'admin' ? styles.admin : styles.user}`}>
                                {user.role === 'admin' ? '관리자' : '사용자'}
                              </span>
                            </td>
                            <td>{formatDate(user.createdAt)}</td>
                            <td>
                              <span className={styles.statusBadge}>
                                활성
                              </span>
                            </td>
                            <td>
                              <div className={styles.actionButtons}>
                                <button 
                                  className={styles.viewBtn}
                                  onClick={() => handleViewUser(user.id)}
                                  title="사용자 상세 보기"
                                >
                                  👁️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className={styles.tabContent}>
              <h2>주문 관리</h2>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>주문 ID</th>
                      <th>사용자</th>
                      <th>상품</th>
                      <th>수량</th>
                      <th>총액</th>
                      <th>상태</th>
                      <th>주문일</th>
                      <th>액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="8" className={styles.noData}>
                        등록된 주문이 없습니다.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 사용자 모달 */}
      {isModalOpen && (
        <UserModal
          user={selectedUser}
          isLoading={isModalLoading}
          onClose={handleCloseModal}
          onUserUpdated={handleUserUpdated}
          onUserDeleted={handleUserDeleted}
        />
      )}
    </div>
  );
};

export default AdminPage;