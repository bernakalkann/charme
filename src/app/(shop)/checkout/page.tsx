import React from 'react';
import { redirect } from 'next/navigation';
import CheckoutContent from './CheckoutContent';
import { getUserAddresses } from '@/actions/orders';
import { getSessionUser } from '@/actions/auth';

export default async function CheckoutPage() {
  const user = await getSessionUser();
  
  if (!user) {
    redirect('/login?callbackUrl=/checkout');
  }

  const addresses = await getUserAddresses();

  return (
    <CheckoutContent
      initialAddresses={addresses as any}
    />
  );
}
