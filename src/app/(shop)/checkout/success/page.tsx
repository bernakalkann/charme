'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { createOrder } from '@/actions/orders';
import { CheckCircle2, Truck, Calendar, Loader2 } from 'lucide-react';

function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const cartStore = useCart();

  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Extract query parameters passed from Checkout redirect
  const shippingId = searchParams.get('shippingId');
  const billingId = searchParams.get('billingId');
  const giftWrap = searchParams.get('giftWrap') === 'true';
  const giftNote = searchParams.get('giftNote');
  const testerId = searchParams.get('testerId');
  const couponCode = searchParams.get('couponCode');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // If the order has already been created (refresh prevention), load it from sessionStorage
    const storedOrderId = sessionStorage.getItem('last_order_id');
    if (storedOrderId) {
      setOrderId(storedOrderId);
      setLoading(false);
      return;
    }

    // Check if there are items to order
    if (cartStore.items.length === 0) {
      setError('Sipariş edilecek ürün bulunamadı veya sepetiniz boş.');
      setLoading(false);
      return;
    }

    if (!shippingId || !billingId) {
      setError('Eksik teslimat veya fatura adresi bilgisi.');
      setLoading(false);
      return;
    }

    async function triggerCreateOrder() {
      try {
        const orderData = {
          items: cartStore.items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          shippingAddressId: shippingId!,
          billingAddressId: billingId!,
          giftWrap,
          giftNote: giftNote ? decodeURIComponent(giftNote) : undefined,
          selectedTesterId: testerId || undefined,
          couponCode: couponCode || undefined,
          stripeSessionId: sessionId || undefined,
        };

        const res = await createOrder(orderData) as any;
        if (res.success && res.orderId) {
          setOrderId(res.orderId);
          // Store order ID in session storage to prevent duplicate orders on page refresh
          sessionStorage.setItem('last_order_id', res.orderId);
          // Empty client-side cart
          cartStore.clearCart();
        } else {
          setError(res.error || 'Sipariş oluşturulamadı.');
        }
      } catch (err: any) {
        console.error('[ORDER ERROR] Failed to create order after payment redirect:', err);
        setError(err.message || 'Sipariş kaydedilirken sistemsel bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }

    triggerCreateOrder();
  }, [cartStore, shippingId, billingId, giftWrap, giftNote, testerId, couponCode, sessionId]);

  // Estimate delivery (3 business days)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDelivery = deliveryDate.toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 text-secondary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">
          Ödemeniz doğrulandı, siparişiniz kaydediliyor...
        </p>
      </div>
    );
  }

  if (error && !orderId) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 px-4 space-y-6">
        <div className="inline-flex p-3 bg-red-50 text-red-600 rounded-full">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="font-serif text-2xl font-semibold text-primary">Sipariş Kaydedilemedi</h1>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">{error}</p>
        <div className="pt-4">
          <Link
            href="/checkout"
            className="rounded-full bg-primary text-primary-foreground px-8 py-3 text-xs font-semibold hover:bg-primary/90 transition-colors uppercase tracking-widest"
          >
            Ödeme Sayfasına Geri Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl text-center py-20 px-4 space-y-6 animate-in fade-in duration-200">
      <div className="flex justify-center animate-bounce">
        <CheckCircle2 className="h-16 w-16 text-emerald-500 fill-emerald-50/30" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold tracking-widest text-secondary uppercase">Siparişiniz Alındı</span>
        <h1 className="font-serif text-3xl font-semibold text-primary">Teşekkür Ederiz!</h1>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Güzellik rutininizi taçlandıracak siparişiniz başarıyla oluşturuldu ve hazırlık aşamasına alındı.
        </p>
      </div>

      <div className="bg-card border border-border/40 rounded-xl p-6 text-left space-y-4 max-w-md mx-auto">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground font-medium">Sipariş Numarası</span>
          <span className="font-mono font-semibold text-primary">{orderId}</span>
        </div>
        {sessionId && !sessionId.startsWith('mock_') && (
          <div className="border-t border-border/30 pt-3 flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-medium">Ödeme Referansı</span>
            <span className="font-mono text-muted-foreground truncate max-w-[150px]">{sessionId}</span>
          </div>
        )}
        <div className="border-t border-border/30 pt-3 flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Truck className="h-4 w-4 text-secondary" />
            <span>Kargo Firması</span>
          </div>
          <span className="font-semibold text-primary">Yurtiçi Kargo (Lüks Kurye)</span>
        </div>
        <div className="border-t border-border/30 pt-3 flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-4 w-4 text-secondary" />
            <span>Tahmini Teslimat</span>
          </div>
          <span className="font-semibold text-primary text-right">{formattedDelivery}</span>
        </div>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
        <Link
          href="/profile?tab=orders"
          className="flex-1 rounded-full border border-primary py-3 text-xs font-semibold hover:bg-muted transition-colors uppercase tracking-widest font-sans"
        >
          Siparişlerimi Gör
        </Link>
        <Link
          href="/cilt-bakimi"
          className="flex-1 rounded-full bg-primary text-primary-foreground py-3 text-xs font-semibold hover:bg-primary/90 transition-colors uppercase tracking-widest font-sans"
        >
          Alışverişe Devam Et
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-muted-foreground">Yükleniyor...</div>}>
      <OrderSuccessPage />
    </Suspense>
  );
}
