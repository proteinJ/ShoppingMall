// app/components/ProductDetail/index.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import PageLoader from '@/components/PageLoader';
import styles from './ProductDetail.module.css';

const ProductDetail = ({ productId }) => {
  const { userInfo, isLoading: isAuthLoading } = useAuth();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

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
        setProduct(result.FoundProduct);
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

  const handlePageNavigation = (url) => {
    window.location.href = url;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (!userInfo) {
      alert('로그인이 필요한 서비스입니다.');
      window.location.href = '/login';
      return;
    }
    
    // 장바구니 추가 로직
    alert(`${product.name} ${quantity}개를 장바구니에 추가했습니다.`);
  };

  const handleBuyNow = () => {
    if (!userInfo) {
      alert('로그인이 필요한 서비스입니다.');
      window.location.href = '/login';
      return;
    }
    
    // 바로 구매 로직
    alert(`${product.name} ${quantity}개를 구매합니다.`);
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <>
        <Navbar />
        <PageLoader message="상품 정보를 불러오는 중..." />
      </>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.errorContainer}>
          <div className={styles.error}>
            <h2>오류가 발생했습니다</h2>
            <p>{error}</p>
            <button onClick={fetchProduct} className={styles.retryButton}>
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.errorContainer}>
          <div className={styles.error}>
            <h2>상품을 찾을 수 없습니다</h2>
            <p>요청하신 상품이 존재하지 않거나 삭제되었습니다.</p>
            <button onClick={() => handlePageNavigation('/products')} className={styles.retryButton}>
              상품 목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 더미 이미지 데이터
  const productImages = [
    '/api/placeholder/600/600',
    '/api/placeholder/600/600',
    '/api/placeholder/600/600',
    '/api/placeholder/600/600'
  ];

  return (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbContent}>
          <button onClick={() => handlePageNavigation('/')}>홈</button>
          <span>›</span>
          <button onClick={() => handlePageNavigation('/products')}>상품</button>
          <span>›</span>
          <span>{product.name}</span>
        </div>
      </div>

      <div className={styles.productContainer}>
        <div className={styles.productLayout}>
          {/* 좌측 이미지 영역 */}
          <div className={styles.imageSection}>
            <div className={styles.mainImage}>
              <img 
                src={productImages[selectedImage]} 
                alt={product.name}
                className={styles.productImage}
              />
            </div>
            
            <div className={styles.thumbnails}>
              {productImages.map((image, index) => (
                <button
                  key={index}
                  className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* 우측 정보 영역 */}
          <div className={styles.infoSection}>
            <div className={styles.productInfo}>
              <div className={styles.badges}>
                <span className={styles.categoryBadge}>
                  {product.categoryId ? `카테고리 ${product.categoryId}` : '일반'}
                </span>
                {product.stock > 0 && (
                  <span className={styles.stockBadge}>재고 있음</span>
                )}
              </div>

              <h1 className={styles.productName}>{product.name}</h1>
              
              <div className={styles.priceSection}>
                <span className={styles.price}>₩{formatPrice(product.price)}</span>
                <span className={styles.originalPrice}>₩{formatPrice(product.price * 1.2)}</span>
                <span className={styles.discount}>17% 할인</span>
              </div>

              <div className={styles.productDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.label}>상품 ID</span>
                  <span className={styles.value}>{product.id}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>재고</span>
                  <span className={styles.value}>{product.stock}개</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>상태</span>
                  <span className={`${styles.value} ${styles.statusValue}`}>
                    {product.status === 'active' ? '판매중' : '품절'}
                  </span>
                </div>
              </div>

              <div className={styles.description}>
                <h3>상품 설명</h3>
                <p>{product.description || '상품 설명이 없습니다.'}</p>
              </div>

              <div className={styles.options}>
                <div className={styles.quantitySection}>
                  <span className={styles.label}>수량</span>
                  <div className={styles.quantityControl}>
                    <button 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className={styles.quantity}>{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className={styles.totalPrice}>
                  <span className={styles.label}>총 가격</span>
                  <span className={styles.total}>₩{formatPrice(product.price * quantity)}</span>
                </div>
              </div>

              <div className={styles.actions}>
                <button 
                  className={styles.cartButton}
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  🛒 장바구니 담기
                </button>
                <button 
                  className={styles.buyButton}
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                >
                  바로 구매
                </button>
              </div>

              <div className={styles.additionalInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.icon}>🚚</span>
                  <span>무료배송 (5만원 이상 구매시)</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.icon}>↩️</span>
                  <span>7일 무료 반품</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.icon}>🔒</span>
                  <span>안전한 결제</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 상품 상세 정보 탭 */}
        <div className={styles.detailTabs}>
          <div className={styles.tabHeader}>
            <button className={`${styles.tabButton} ${styles.active}`}>
              상품 정보
            </button>
            <button className={styles.tabButton}>
              리뷰 (0)
            </button>
            <button className={styles.tabButton}>
              배송/교환/반품
            </button>
          </div>
          
          <div className={styles.tabContent}>
            <div className={styles.productDetailInfo}>
              <h3>상품 상세 정보</h3>
              <div className={styles.detailInfoGrid}>
                <div className={styles.detailInfoItem}>
                  <span className={styles.label}>브랜드</span>
                  <span className={styles.value}>Au Revoir</span>
                </div>
                <div className={styles.detailInfoItem}>
                  <span className={styles.label}>원산지</span>
                  <span className={styles.value}>한국</span>
                </div>
                <div className={styles.detailInfoItem}>
                  <span className={styles.label}>제조사</span>
                  <span className={styles.value}>Au Revoir</span>
                </div>
                <div className={styles.detailInfoItem}>
                  <span className={styles.label}>A/S 정보</span>
                  <span className={styles.value}>고객센터 1588-0000</span>
                </div>
              </div>
              
              <div className={styles.detailDescription}>
                <p>{product.description || '상품에 대한 자세한 설명이 추가될 예정입니다.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;