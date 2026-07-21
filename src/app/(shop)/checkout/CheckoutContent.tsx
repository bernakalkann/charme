'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { createAddress, checkCoupon } from '@/actions/orders';
import { createStripeCheckoutSession } from '@/actions/payment';
import { 
  Sparkles, 
  MapPin, 
  Plus, 
  Gift, 
  CreditCard, 
  ShoppingBag, 
  Check, 
  Percent,
  Lock,
  ArrowLeft
} from 'lucide-react';

interface Address {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
}

interface CheckoutContentProps {
  initialAddresses: Address[];
}

const mockTesters = [
  { id: 't1', name: 'Estée Lauder Advanced Night Repair (1.5ml Numune)' },
  { id: 't2', name: 'Dior Forever Skin Glow Foundation 2N (1ml Numune)' },
  { id: 't3', name: 'Chanel Bleu de Chanel EDP (2ml Numune)' },
];

export default function CheckoutContent({
  initialAddresses,
}: CheckoutContentProps) {
  const router = useRouter();
  const cartStore = useCart();
  const [mounted, setMounted] = useState(false);

  // Address states
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [selectedShippingId, setSelectedShippingId] = useState(initialAddresses[0]?.id || '');
  const [selectedBillingId, setSelectedBillingId] = useState(initialAddresses[0]?.id || '');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    title: '',
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
  });

  // Gift wrap states
  const giftWrap = cartStore.giftWrap;
  const giftNote = cartStore.giftNote;

  // Coupon states
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const cartItems = cartStore.items;
  const subtotal = cartStore.getCartSubtotal();
  const discount = cartStore.getDiscountAmount();
  const total = cartStore.getCartTotal();

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 px-4">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
        <h2 className="text-xl font-serif font-semibold text-primary">Sepetiniz Boş</h2>
        <p className="text-sm text-muted-foreground mt-2">Sipariş tamamlamak için sepetinizde ürün bulunmalıdır.</p>
        <button
          onClick={() => router.push('/cilt-bakimi')}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors uppercase tracking-widest font-sans"
        >
          Alışverişe Dön
        </button>
      </div>
    );
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createAddress(newAddress);
    if (res.success && res.address) {
      const added = res.address as Address;
      setAddresses([added, ...addresses]);
      setSelectedShippingId(added.id);
      setSelectedBillingId(added.id);
      setIsAddingAddress(false);
      setNewAddress({
        title: '',
        fullName: '',
        phone: '',
        addressLine: '',
        city: '',
        state: '',
        postalCode: '',
      });
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCodeInput) return;
    const res = await checkCoupon(couponCodeInput, subtotal);
    if (res.success && res.coupon) {
      cartStore.applyCoupon(res.coupon as any);
      setCouponSuccess('Kupon başarıyla uygulandı!');
      setCouponError('');
    } else {
      setCouponError(res.error || 'Kupon uygulanamadı.');
      setCouponSuccess('');
    }
  };

  const handleRemoveCoupon = () => {
    cartStore.applyCoupon(null);
    setCouponCodeInput('');
    setCouponSuccess('');
    setCouponError('');
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShippingId || !selectedBillingId) {
      setOrderError('Lütfen teslimat ve fatura adresi seçin.');
      return;
    }

    // Prepare items for Stripe checkout screen breakdown
    const stripeItems = cartItems.map((item) => ({
      name: `${item.productName} (${item.variantName})`,
      price: item.price,
      quantity: item.quantity,
    }));

    if (giftWrap) {
      stripeItems.push({
        name: 'Hediye Paketi ve Kutusu',
        price: 50,
        quantity: 1,
      });
    }

    // Success and Cancel URLs
    const successUrl = `${window.location.origin}/checkout/success?shippingId=${selectedShippingId}&billingId=${selectedBillingId}&giftWrap=${giftWrap}&giftNote=${encodeURIComponent(giftNote || '')}&testerId=${cartStore.selectedTesters[0] || ''}&couponCode=${cartStore.coupon?.code || ''}`;
    const cancelUrl = `${window.location.origin}/checkout`;

    const metadata = {
      shippingAddressId: selectedShippingId,
      billingAddressId: selectedBillingId,
      giftWrap: String(giftWrap),
      giftNote: giftNote || undefined,
      selectedTesterId: cartStore.selectedTesters[0] || undefined,
      couponCode: cartStore.coupon?.code || undefined,
      itemsJson: JSON.stringify(cartItems.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }))),
    };

    const res = await createStripeCheckoutSession({
      amount: total,
      items: stripeItems,
      successUrl,
      cancelUrl,
      metadata,
    });

    if (res.success && res.url) {
      window.location.href = res.url;
    } else {
      setOrderError(res.error || 'Ödeme oturumu başlatılamadı.');
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold tracking-wide text-primary">Güvenli Ödeme (Checkout)</h1>
        <button
          onClick={() => router.back()}
          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Alışverişe Geri Dön
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Shipping details, addresses, testers, payment */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Adres Seçimi */}
          <div className="bg-card border border-border/40 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h2 className="text-base font-serif font-semibold text-primary flex items-center gap-2">
                <MapPin className="h-5 w-5 text-secondary" /> 1. Adres Defteri
              </h2>
              <button
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="text-xs text-secondary font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Yeni Adres Ekle
              </button>
            </div>

            {isAddingAddress ? (
              <form onSubmit={handleAddAddress} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Adres Başlığı (Örn: Ev, İş)</label>
                    <input
                      type="text"
                      required
                      value={newAddress.title}
                      onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                      className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:ring-1 focus:ring-secondary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Ad Soyad</label>
                    <input
                      type="text"
                      required
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:ring-1 focus:ring-secondary focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Telefon</label>
                    <input
                      type="text"
                      required
                      placeholder="+905..."
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:ring-1 focus:ring-secondary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Posta Kodu</label>
                    <input
                      type="text"
                      required
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:ring-1 focus:ring-secondary focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Adres Satırı</label>
                  <textarea
                    required
                    rows={2}
                    value={newAddress.addressLine}
                    onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                    className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:ring-1 focus:ring-secondary focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Şehir</label>
                    <input
                      type="text"
                      required
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:ring-1 focus:ring-secondary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">İlçe</label>
                    <input
                      type="text"
                      required
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:ring-1 focus:ring-secondary focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="text-xs font-semibold px-4 py-2 border rounded-md"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="text-xs bg-primary text-primary-foreground font-semibold px-6 py-2 rounded-md hover:bg-primary/90"
                  >
                    Adresi Kaydet
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 pt-2">
                {addresses.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Kayıtlı adresiniz bulunmuyor. Lütfen yeni adres ekleyin.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                          selectedShippingId === addr.id
                            ? 'border-primary bg-primary/[0.02]'
                            : 'border-border/60 hover:border-muted-foreground'
                        }`}
                        onClick={() => {
                          setSelectedShippingId(addr.id);
                          setSelectedBillingId(addr.id);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-sm text-primary">{addr.title}</span>
                          {selectedShippingId === addr.id && <Check className="h-4 w-4 text-secondary" />}
                        </div>
                        <p className="text-xs font-medium text-foreground/80 mt-2">{addr.fullName}</p>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                          {addr.addressLine}, {addr.state}/{addr.city}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{addr.phone}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tester / Numune Seçimi */}
          <div className="bg-card border border-border/40 rounded-xl p-6 space-y-4">
            <h2 className="text-base font-serif font-semibold text-primary flex items-center gap-2 border-b border-border/50 pb-3">
              <Sparkles className="h-5 w-5 text-secondary" /> 2. Ücretsiz Tester / Numune Seçimi
            </h2>
            <p className="text-xs text-muted-foreground">
              Her siparişe özel en fazla <span className="font-bold text-primary">3 adete kadar</span> ücretsiz numune seçebilirsiniz:
            </p>
            <div className="space-y-2 pt-1">
              {mockTesters.map((tester) => {
                const isSelected = cartStore.selectedTesters.includes(tester.id);
                return (
                  <label key={tester.id} className="flex items-center space-x-3 text-xs p-3 rounded-lg border border-border/40 bg-muted/20 cursor-pointer select-none hover:bg-muted/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={!isSelected && cartStore.selectedTesters.length >= 3}
                      onChange={() => cartStore.toggleTester(tester.id)}
                      className="rounded border-border text-secondary focus:ring-secondary/40 h-4 w-4"
                    />
                    <span className={`flex-1 ${isSelected ? 'text-primary font-medium' : 'text-foreground/80'}`}>
                      {tester.name}
                    </span>
                    {isSelected && <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">Eklendi</span>}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Hediye Paketi ve Notu */}
          <div className="bg-card border border-border/40 rounded-xl p-6 space-y-4">
            <h2 className="text-base font-serif font-semibold text-primary flex items-center gap-2 border-b border-border/50 pb-3">
              <Gift className="h-5 w-5 text-secondary" /> 3. Hediye Paketi / Notu
            </h2>
            <div className="space-y-4 pt-1">
              <label className="flex items-center space-x-3 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => cartStore.setGiftWrap(e.target.checked)}
                  className="rounded border-border text-secondary focus:ring-secondary/40 h-4 w-4"
                />
                <div>
                  <span className="font-semibold text-primary">Hediye paketi yapılmasını istiyorum (+50 TL)</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Siparişiniz şık bir hediye kutusuna konulacaktır.</p>
                </div>
              </label>

              {giftWrap && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <label htmlFor="giftNote" className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                    Hediye Notunuz
                  </label>
                  <textarea
                    id="giftNote"
                    rows={3}
                    placeholder="Sevdiklerinize göndermek istediğiniz mesajı buraya yazın..."
                    value={giftNote}
                    onChange={(e) => cartStore.setGiftNote(e.target.value)}
                    className="w-full text-xs bg-muted border-none rounded-md p-3 focus:ring-1 focus:ring-secondary focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Güvenli Ödeme */}
          <div className="bg-card border border-border/40 rounded-xl p-6 space-y-4">
            <h2 className="text-base font-serif font-semibold text-primary flex items-center gap-2 border-b border-border/50 pb-3">
              <CreditCard className="h-5 w-5 text-secondary" /> 4. Güvenli Ödeme Yönlendirmesi
            </h2>
            
            <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-1">
              <div className="p-4 bg-muted/40 border border-border/50 rounded-lg space-y-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Lock className="h-4.5 w-4.5 text-emerald-600" />
                  <span className="font-semibold text-primary">Kart bilgilerinizi sitemizde görmüyoruz.</span>
                </div>
                <p className="leading-relaxed">
                  Ödemenizi tamamlamak için güvenli bir şekilde **Stripe resmi ödeme altyapısına** yönlendirileceksiniz. Ödeme tamamlandıktan sonra otomatik olarak sitemize geri dönerek siparişinizi onaylayabilirsiniz.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-border/30 text-[10px] uppercase font-bold tracking-wider text-secondary">
                  <span>SSL ŞİFRELİ SİSTEM</span>
                  <span>3D SECURE KORUMASI</span>
                </div>
              </div>

              {orderError && <p className="text-xs text-red-600 font-semibold">{orderError}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-colors uppercase tracking-widest font-sans disabled:opacity-50"
              >
                {submitting ? 'Güvenli Sayfaya Yönlendiriliyor...' : 'Ödemeye Geç ve Siparişi Tamamla'}
              </button>
            </form>
          </div>

        </div>

        {/* Right: Cart Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border/40 rounded-xl p-6 space-y-6 sticky top-24">
            <h3 className="font-serif text-lg font-semibold text-primary border-b border-border/60 pb-3">Sipariş Özeti</h3>
            
            {/* Items summary */}
            <div className="divide-y divide-border/40 max-h-60 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.variantId} className="flex py-3 gap-3">
                  <div className="h-12 w-12 rounded bg-muted overflow-hidden border border-border flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.productImage} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-primary truncate">{item.productName}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.variantName} x {item.quantity}</p>
                  </div>
                  <span className="text-xs font-semibold font-serif">{item.price * item.quantity} TL</span>
                </div>
              ))}
            </div>

            {/* Coupon Application */}
            <div className="border-t border-b border-border/40 py-4 space-y-3">
              {cartStore.coupon ? (
                <div className="bg-emerald-50 border border-emerald-200/40 rounded-lg p-3 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <Percent className="h-4 w-4" />
                    <span>Kupon uygulandı: <strong>{cartStore.coupon.code}</strong></span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-[10px] text-red-600 font-bold hover:underline"
                  >
                    Kaldır
                  </button>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">İndirim Kuponu</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="KOD10"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      className="flex-1 text-xs bg-muted border-none rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-secondary uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-primary text-primary-foreground text-xs font-semibold px-4 rounded-md hover:bg-primary/90"
                    >
                      Uygula
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-600 font-medium mt-1">{couponError}</p>}
                  {couponSuccess && <p className="text-[10px] text-emerald-600 font-medium mt-1">{couponSuccess}</p>}
                </div>
              )}
            </div>

            {/* Summary calculation */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Ara Toplam</span>
                <span className="font-serif">{subtotal} TL</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>İndirim</span>
                  <span className="font-serif">-{discount} TL</span>
                </div>
              )}
              {giftWrap && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Hediye Paketi</span>
                  <span className="font-serif">+50 TL</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Kargo Ücreti</span>
                <span className="font-serif">
                  {subtotal - discount >= 1000 ? 'Ücretsiz' : '+75 TL'}
                </span>
              </div>
              
              <div className="flex justify-between text-base font-semibold text-primary pt-3 border-t border-border/40">
                <span>Toplam</span>
                <span className="font-serif text-lg">{total} TL</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
