// app/admin/products/[productId]/edit/page.jsx
'use client';
import AdminProductEdit from '@/components/AdminProductEdit';
export default function Page({ params }) {
  return <AdminProductEdit productId={params.productId} />;
}