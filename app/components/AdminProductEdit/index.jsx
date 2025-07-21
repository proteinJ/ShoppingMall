// app/components/AdminProductEdit/index.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import PageLoader from '@/components/PageLoader';
import styles from './AdminProductEdit.module.css';

const AdminProductEdit = ({ productId }) => {
  const { userInfo, isLoading: isAuthLoading } = useAuth();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    status: 'active',
    categoryId: '',
    gender: 'UNISEX',
  });

  // 관리자가 아닌 경우 접근 차단
  useEffect(() => {
    if (!isAuthLoading && (!userInfo || userInfo.role !== 'admin')) {
      alert('관리자만 접근 가능합니다.');
      window.location.href = '/';
    }
  }, [isAuthLoading, userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.role === 'admin' && productId) {
      fetchProduct();
    }
  }, [userInfo, productId]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch(`/api/products/${productId}`, {
        method: 'GET',
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        const productData = result.FoundProduct;
        setProduct(productData);
        setFormData({
          name: productData.name || '',
          description: productData.description || '',
          price: productData.price || '',
          stock: productData.stock || '',
          status: productData.status || 'active',
          categoryId: productData.categoryId || '',
          gender: productData.gender || 'UNISEX',
        });
      } else {
        setError(result.message || '상품 정보를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('상품 상세 조회 오류:', error);
      setError('상품 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('상품명을 입력해주세요.');
      return;
    }

    if (!formData.price || formData.price <= 0) {
      alert('올바른 가격을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const updateData = new FormData();
      updateData.append('name', formData.name);
      updateData.append('description', formData.description);
      updateData.append('price', formData.price);
      updateData.append('stock', formData.stock);
      updateData.append('status', formData.status);
      updateData.append('categoryId', formData.categoryId);
      updateData.append('gender', formData.gender);
      
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        credentials: 'include',
        body: updateData,
      });

      const result = await response.json();

      if (result.success) {
        alert('상품이 성공적으로 수정되었습니다.');
        window.location.href = `/products/${productId}`;
      } else {
        alert(result.message || '상품 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('상품 수정 오류:', error);
      alert('상품 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageNavigation = (url) => {
    window.location.href = url;
  };

  // 로딩 중일 때
  if (isAuthLoading || isLoading) {
    return (
      <>
        <Navbar />
        <PageLoader message="상품 정보를 불러오는 중..." />
      </>
    );
  }

  if (!userInfo || userInfo.role !== 'admin') {
    return null;
  }

  if (error) {
    return (
      <div className={styles.adminContainer}>
        <Navbar />
        <div className={styles.content}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h3>상품 관리</h3>
            </div>
            <nav className={styles.sidebarNav}>
              <button 
                className={styles.navItem}
                onClick={() => handlePageNavigation('/admin')}
              >
                ← 목록으로 돌아가기
              </button>
            </nav>
          </div>
          <div className={styles.mainContent}>
            <div className={styles.error}>
              <h2>오류가 발생했습니다</h2>
              <p>{error}</p>
              <button onClick={fetchProduct} className={styles.retryButton}>
                다시 시도
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <Navbar />
      
      <div className={styles.content}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>상품 관리</h3>
          </div>
          
          <nav className={styles.sidebarNav}>
            <button 
              className={styles.navItem}
              onClick={() => handlePageNavigation('/admin')}
            >
              ← 목록으로 돌아가기
            </button>
            <button 
              className={styles.navItem}
              onClick={() => handlePageNavigation(`/products/${productId}`)}
            >
              📦 상품 상세
            </button>
            <button 
              className={`${styles.navItem} ${styles.active}`}
            >
              ✏️ 상품 수정
            </button>
          </nav>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.productEdit}>
            <div className={styles.header}>
              <h1>상품 수정</h1>
            </div>

            <form onSubmit={handleSubmit} className={styles.editForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">상품명 *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="상품명을 입력하세요"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="price">가격 *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="1"
                    placeholder="가격을 입력하세요"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="stock">재고</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                    placeholder="재고를 입력하세요"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="status">상태</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="categoryId">카테고리 ID</label>
                  <input
                    type="number"
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    min="1"
                    step="1"
                    placeholder="카테고리 ID를 입력하세요"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="gender">성별</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                    <option value="UNISEX">공용</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">상품 설명</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                  placeholder="상품 설명을 입력하세요"
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => handlePageNavigation(`/admin/products/${productId}`)}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '수정 중...' : '수정하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductEdit;