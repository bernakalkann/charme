import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import ProfileContent from '@/components/shop/ProfileContent';
import { getUserAddresses, getUserOrders, getUserWishlist } from '@/actions/orders';
import { getSessionUser } from '@/actions/auth';

export default async function ProfilePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login?callbackUrl=/profile');
  }

  const addresses = await getUserAddresses();
  const orders = await getUserOrders();
  const wishlist = await getUserWishlist();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-muted-foreground">Yükleniyor...</div>}>
      <ProfileContent
        user={user as any}
        initialAddresses={addresses as any}
        initialOrders={orders as any}
        initialWishlist={wishlist as any}
      />
    </Suspense>
  );
}
