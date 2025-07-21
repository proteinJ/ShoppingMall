'use client';

import ProductDetail from '@/components/ProductDetail';

export default function ProductDetailPage({ params }) {
  const productId = params.productId;

  return <ProductDetail productId={productId} />;
}