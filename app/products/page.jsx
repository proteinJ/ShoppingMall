'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import PageLoader from '@/components/PageLoader';
import styles from './ProductList.module.css';

const CATEGORY_MAP = {
  1: '액세사리',
  2: '의류',
  3: '가방',
  4: '신발',
  5: '기타',
};

const GENDER_MAP = {
  MALE: '남성',
  FEMALE: '여성',
  UNISEX: '공용',
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo, isLoading: isAuthLoading, isAdmin } = useAuth();

  // next/navigation 훅 사용
  const router = useRouter();
  const searchParams = useSearchParams();

  // 쿼리 파라미터에서 필터값 읽기
  const genderFilter = searchParams.get('gender') || 'ALL';
  const categoryFilter = searchParams.get('category') || 'ALL';

  useEffect(() => {
    fetchProducts();
  }, []);

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
      setError('상품 목록을 불러오는데 실패했습니다.');
      setProducts([]);
    } finally {
      setIsProductsLoading(false);
    }
  };

  const handlePageNavigation = (url) => {
    router.push(url);
  };

  // 필터 버튼 클릭 시 URL 쿼리 변경
  const handleGenderChange = (gender) => {
    const params = new URLSearchParams(searchParams.toString());
    if (gender === 'ALL') {
      params.delete('gender');
    } else {
      params.set('gender', gender);
    }
    router.replace(`/products?${params.toString()}`);
  };

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'ALL') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.replace(`/products?${params.toString()}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // 필터링된 상품 목록
  const filteredProducts = products.filter(product => {
    const genderOk =
      genderFilter === 'ALL' ||
      product.gender === genderFilter ||
      (genderFilter === 'UNISEX' && product.gender === 'UNISEX');
    const categoryOk =
      categoryFilter === 'ALL' ||
      String(product.categoryId) === String(categoryFilter);
    return genderOk && categoryOk;
  });

  if (isAuthLoading || isProductsLoading) {
    return (
      <>
        <Navbar />
        <PageLoader message="상품 목록을 불러오는 중..." />
      </>
    );
  }

  if (error) {
    return (
      <div className={styles.trendyContainer}>
        <Navbar />
        <main className={styles.trendyMain}>
          <div className={styles.trendyContent}>
            <div className={styles.trendyError}>
              <h2>오류가 발생했습니다</h2>
              <p>{error}</p>
              <button 
                className={styles.trendyRetryButton}
                onClick={fetchProducts}
              >
                다시 시도
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.trendyContainer}>
      <Navbar />
      <main className={styles.trendyMain}>
        <div className={styles.trendyContent}>
          {/* 필터 UI */}
          <div style={{ marginBottom: 24 }}>
            <strong>성별:</strong>
            <button
              className={genderFilter === 'ALL' ? styles.activeFilterBtn : styles.filterBtn}
              onClick={() => handleGenderChange('ALL')}
            >전체</button>
            <button
              className={genderFilter === 'MALE' ? styles.activeFilterBtn : styles.filterBtn}
              onClick={() => handleGenderChange('MALE')}
            >남성</button>
            <button
              className={genderFilter === 'FEMALE' ? styles.activeFilterBtn : styles.filterBtn}
              onClick={() => handleGenderChange('FEMALE')}
            >여성</button>
            <button
              className={genderFilter === 'UNISEX' ? styles.activeFilterBtn : styles.filterBtn}
              onClick={() => handleGenderChange('UNISEX')}
            >공용</button>
          </div>
          <div style={{ marginBottom: 24 }}>
            <strong>카테고리:</strong>
            <button
              className={categoryFilter === 'ALL' ? styles.activeFilterBtn : styles.filterBtn}
              onClick={() => handleCategoryChange('ALL')}
            >전체</button>
            {Object.entries(CATEGORY_MAP).map(([id, name]) => (
              <button
                key={id}
                className={categoryFilter === id ? styles.activeFilterBtn : styles.filterBtn}
                onClick={() => handleCategoryChange(id)}
              >{name}</button>
            ))}
          </div>
          <div className={styles.trendyTitleSection}>
            <h1 className={styles.trendyTitle}>SHOP</h1>
            <p className={styles.trendySubtitle}>프리미엄 아이템을 만나보세요</p>
          </div>
          {filteredProducts.length === 0 ? (
            <div className={styles.trendyEmptyState}>
              <h3>조건에 맞는 상품이 없습니다</h3>
              {isAdmin && (
                <button 
                  className={styles.trendyRegisterButton}
                  onClick={() => handlePageNavigation('/admin/products/register')}
                >
                  상품 등록하기
                </button>
              )}
            </div>
          ) : (
          <div className={styles.trendyGrid}>
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className={styles.trendyCard}
                onClick={() => handlePageNavigation(`/products/${product.id}`)}
                tabIndex={0}
                role="button"
                onKeyDown={e => {
                  if (e.key === 'Enter') handlePageNavigation(`/products/${product.id}`);
                }}
              >
                <div className={styles.trendyImageWrap}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} className={styles.trendyImage} />
                  ) : (
                    <div className={styles.trendyPlaceholderImage}>이미지 없음</div>
                  )}
                </div>
                <div className={styles.trendyInfo}>
                  <div className={styles.trendyCategory}>
                    {CATEGORY_MAP[product.categoryId] || '일반'}
                  </div>
                  <div className={styles.trendyGender}>
                    {GENDER_MAP[product.gender] || product.gender}
                  </div>
                  <h3 className={styles.trendyProductName}>{product.name}</h3>
                  <div className={styles.trendyPrice}>
                    ₩{formatPrice(product.price)}
                  </div>
                  {product.tags && product.tags.length > 0 && (
                    <div className={styles.trendyTags}>
                      {product.tags.map(tag => (
                        <span key={tag} className={styles.trendyTag}>#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                {isAdmin && (
                  <div className={styles.trendyActions}>
                    <button
                      className={styles.trendyEditButton}
                      onClick={e => {
                        e.stopPropagation();
                        handlePageNavigation(`/admin/products/${product.id}/edit`);
                      }}
                    >
                      수정
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductList;