'use client';

import React, { useState } from 'react';
import styles from './ProductRegister.module.css';

const ProductRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: ''
  });

  const categories = [
    { id: 1, name: '액세서리' },
    { id: 2, name: '의류' },
    { id: 3, name: '가방' },
    { id: 4, name: '신발' },
    { id: 5, name: '기타' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 입력값 검증
      if (!formData.name || !formData.description || !formData.price || !formData.categoryId) {
        alert('모든 필드를 입력해주세요.');
        return;
      }

      if (isNaN(formData.price) || Number(formData.price) <= 0) {
        alert('올바른 가격을 입력해주세요.');
        return;
      }

      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('categoryId', formData.categoryId);

      const response = await fetch('/api/products', {
        method: 'POST',
        credentials: 'include',
        body: submitData
      });

      const result = await response.json();

      if (result.success) {
        alert('상품이 성공적으로 등록되었습니다!');
        // 폼 초기화
        setFormData({
          name: '',
          description: '',
          price: '',
          categoryId: ''
        });
      } else {
        alert(result.message || '상품 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('상품 등록 오류:', error);
      alert('상품 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageNavigation = (url) => {
    window.location.href = url;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <a href="/" onClick={(e) => {
              e.preventDefault();
              handlePageNavigation('/');
            }}>Au Revoir</a>
          </div>
          <nav className={styles.nav}>
            <a href="/products" onClick={(e) => {
              e.preventDefault();
              handlePageNavigation('/products');
            }}>상품 목록</a>
            <a href="/" onClick={(e) => {
              e.preventDefault();
              handlePageNavigation('/');
            }}>홈으로</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>상품 등록</h1>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>상품명</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                placeholder="상품명을 입력해주세요"
                disabled={isLoading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="description" className={styles.label}>상품 설명</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="상품 설명을 입력해주세요"
                rows="4"
                disabled={isLoading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="price" className={styles.label}>가격</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={styles.input}
                placeholder="가격을 입력해주세요"
                min="0"
                disabled={isLoading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="categoryId" className={styles.label}>카테고리</label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className={styles.select}
                disabled={isLoading}
              >
                <option value="">카테고리를 선택해주세요</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  등록 중...
                  <div className="spinner"></div>
                </>
              ) : (
                '상품 등록'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProductRegister;