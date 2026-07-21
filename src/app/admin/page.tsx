import React from 'react';
import { redirect } from 'next/navigation';
import AdminDashboardContent from './AdminDashboardContent';
import { getSessionUser } from '@/actions/auth';
import { 
  getAdminStats, 
  getAdminProducts, 
  getAdminOrders, 
  getAdminCoupons 
} from '@/actions/admin';
import { getBrands, getCategories } from '@/actions/products';

export default async function AdminPage() {
  const user = await getSessionUser();

  // Route security: Only ADMIN role allowed
  if (!user || user.role !== 'ADMIN') {
    redirect('/');
  }

  // Fetch admin dashboard datasets in parallel
  const [stats, products, orders, coupons, brands, categories] = await Promise.all([
    getAdminStats(),
    getAdminProducts(),
    getAdminOrders(),
    getAdminCoupons(),
    getBrands(),
    getCategories(),
  ]);

  return (
    <AdminDashboardContent
      initialStats={stats as any}
      initialProducts={products as any}
      initialOrders={orders as any}
      initialCoupons={coupons as any}
      brands={brands}
      categories={categories}
    />
  );
}
