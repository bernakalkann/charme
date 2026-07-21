'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createAddress } from '@/actions/orders';
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  Plus, 
  Truck, 
  Calendar, 
  CheckCircle2, 
  Info,
  Clock,
  LogOut,
  ShieldAlert,
  Heart
} from 'lucide-react';
import { signOut } from 'next-auth/react';

interface OrderItem {
  id: string;
  price: number;
  quantity: number;
  productVariant: {
    name: string;
    product: {
      name: string;
      images: string[];
    };
  };
}

interface Order {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED' | 'RETURNED';
  totalAmount: number;
  trackingCode: string | null;
  giftWrap: boolean;
  createdAt: Date;
  items: OrderItem[];
}

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

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice: number | null;
    images: string[];
    brand: { name: string };
  };
}

interface ProfileContentProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  initialOrders: Order[];
  initialAddresses: Address[];
  initialWishlist: WishlistItem[];
}

export default function ProfileContent({
  user,
  initialOrders,
  initialAddresses,
  initialWishlist,
}: ProfileContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
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

  // Sync state if URL changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createAddress(newAddress);
    if (res.success && res.address) {
      setAddresses([res.address as Address, ...addresses]);
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

  const statusLabels: { [key: string]: { label: string; color: string; icon: any } } = {
    PENDING: { label: 'Onay Bekliyor', color: 'bg-amber-50 text-amber-700 border-amber-200/50', icon: Clock },
    PROCESSING: { label: 'Hazırlanıyor', color: 'bg-blue-50 text-blue-700 border-blue-200/50', icon: Info },
    SHIPPED: { label: 'Kargolandı', color: 'bg-purple-50 text-purple-700 border-purple-200/50', icon: Truck },
    COMPLETED: { label: 'Teslim Edildi', color: 'bg-emerald-50 text-emerald-700 border-emerald-200/50', icon: CheckCircle2 },
    CANCELLED: { label: 'İptal Edildi', color: 'bg-red-50 text-red-700 border-red-200/50', icon: ShieldAlert },
    RETURNED: { label: 'İade Edildi', color: 'bg-gray-50 text-gray-700 border-gray-200/50', icon: ShieldAlert },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left: Sidebar navigations */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card border border-border/40 rounded-xl p-6 text-center space-y-3">
            <div className="h-16 w-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto text-xl font-semibold font-serif">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-serif font-semibold text-primary">{user.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
              {user.role === 'ADMIN' && (
                <span className="inline-block mt-2 text-[9px] bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded font-bold uppercase">
                  Yönetici
                </span>
              )}
            </div>
          </div>

          <div className="bg-card border border-border/40 rounded-xl overflow-hidden divide-y divide-border/40">
            <button
              onClick={() => { setActiveTab('orders'); router.replace('/profile?tab=orders'); }}
              className={`w-full text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors ${
                activeTab === 'orders' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-muted'
              }`}
            >
              <ShoppingBag className="h-4.5 w-4.5" /> Siparişlerim
            </button>
            <button
              onClick={() => { setActiveTab('wishlist'); router.replace('/profile?tab=wishlist'); }}
              className={`w-full text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors ${
                activeTab === 'wishlist' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-muted'
              }`}
            >
              <Heart className="h-4.5 w-4.5" /> Favorilerim
            </button>
            <button
              onClick={() => { setActiveTab('addresses'); router.replace('/profile?tab=addresses'); }}
              className={`w-full text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors ${
                activeTab === 'addresses' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-muted'
              }`}
            >
              <MapPin className="h-4.5 w-4.5" /> Adres Defterim
            </button>
            <button
              onClick={() => { setActiveTab('account'); router.replace('/profile?tab=account'); }}
              className={`w-full text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors ${
                activeTab === 'account' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-muted'
              }`}
            >
              <User className="h-4.5 w-4.5" /> Hesap Bilgilerim
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-3 text-red-600 hover:bg-red-50/40 transition-colors"
            >
              <LogOut className="h-4.5 w-4.5" /> Çıkış Yap
            </button>
          </div>
        </div>

        {/* Right: Content view */}
        <div className="lg:col-span-3">
          
          {/* Siparişlerim Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-semibold text-primary border-b border-border/50 pb-3">
                Sipariş Geçmişim ({initialOrders.length})
              </h2>

              {initialOrders.length === 0 ? (
                <div className="text-center py-16 bg-card border border-border/40 rounded-xl space-y-3">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                  <p className="text-sm text-muted-foreground">Henüz kayıtlı bir siparişiniz bulunmuyor.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {initialOrders.map((order) => {
                    const statusInfo = statusLabels[order.status] || statusLabels.PENDING;
                    const StatusIcon = statusInfo.icon;
                    return (
                      <div key={order.id} className="bg-card border border-border/40 rounded-xl overflow-hidden shadow-xs">
                        
                        {/* Summary Header */}
                        <div className="bg-muted/40 p-4 border-b border-border/40 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-muted-foreground block font-medium">Sipariş Tarihi</span>
                            <span className="text-primary font-semibold mt-0.5 block">
                              {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block font-medium">Toplam Tutar</span>
                            <span className="text-primary font-semibold mt-0.5 block font-serif">
                              {order.totalAmount} TL
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block font-medium">Sipariş No</span>
                            <span className="text-primary font-mono truncate max-w-[120px] block mt-0.5">
                              {order.id}
                            </span>
                          </div>
                          <div className="flex sm:justify-end items-center">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded border uppercase tracking-wider ${statusInfo.color}`}>
                              <StatusIcon className="h-3.5 w-3.5" /> {statusInfo.label}
                            </span>
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="p-4 divide-y divide-border/30">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex py-3 first:pt-0 last:pb-0 gap-4">
                              <div className="h-16 w-16 rounded border border-border bg-muted overflow-hidden flex-shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={item.productVariant.product.images[0]} alt="" className="h-full w-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-semibold text-primary">{item.productVariant.product.name}</h4>
                                <p className="text-[10px] text-muted-foreground mt-0.5">{item.productVariant.name}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">{item.quantity} adet x {item.price} TL</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Shipping status / tracking */}
                        {order.trackingCode && (
                          <div className="bg-secondary/5 px-4 py-3 border-t border-border/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Truck className="h-4 w-4 text-secondary" />
                              <span>Kargo Takip Kodu</span>
                            </div>
                            <span className="font-mono font-semibold text-primary bg-white border border-border px-2.5 py-1 rounded">
                              {order.trackingCode}
                            </span>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Adres Defteri Tab */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-border/50 pb-3">
                <h2 className="font-serif text-xl font-semibold text-primary">Adres Defterim</h2>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="text-xs text-secondary font-semibold hover:underline flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Yeni Adres Ekle
                </button>
              </div>

              {isAddingAddress && (
                <div className="bg-card border border-border/40 rounded-xl p-6">
                  <form onSubmit={handleAddAddress} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Adres Başlığı</label>
                        <input
                          type="text"
                          required
                          placeholder="Evim, İşyerim vb."
                          value={newAddress.title}
                          onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                          className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:ring-1 focus:ring-secondary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Alıcı Ad Soyad</label>
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
                      <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Adres Detayı</label>
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
                    <div className="flex justify-end gap-2">
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
                        Kaydet
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {addresses.length === 0 ? (
                <div className="text-center py-16 bg-card border border-border/40 rounded-xl space-y-3">
                  <MapPin className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                  <p className="text-sm text-muted-foreground">Kayıtlı bir adresiniz bulunmuyor.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="bg-card border border-border/40 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between items-center border-b border-border/30 pb-2">
                        <span className="font-semibold text-sm text-primary">{addr.title}</span>
                      </div>
                      <p className="text-xs font-medium text-foreground/80 pt-1">{addr.fullName}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {addr.addressLine}, {addr.state}/{addr.city}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Hesap Bilgilerim Tab */}
          {activeTab === 'account' && (
            <div className="bg-card border border-border/40 rounded-xl p-6 space-y-6">
              <h2 className="font-serif text-xl font-semibold text-primary border-b border-border/50 pb-3">
                Hesap Bilgilerim
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                <div>
                  <span className="text-muted-foreground block font-medium">Ad Soyad</span>
                  <span className="text-primary font-semibold text-sm mt-0.5 block">{user.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">E-Posta Adresi</span>
                  <span className="text-primary font-semibold text-sm mt-0.5 block">{user.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Kullanıcı Rolü</span>
                  <span className="text-primary font-semibold text-sm mt-0.5 block uppercase">{user.role}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Hesap Tipi</span>
                  <span className="text-primary font-semibold text-sm mt-0.5 block">Premium Müşteri</span>
                </div>
              </div>
            </div>
          )}

          {/* Favorilerim Tab */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-semibold text-primary border-b border-border/50 pb-3">
                Favori Ürünlerim ({initialWishlist.length})
              </h2>

              {initialWishlist.length === 0 ? (
                <div className="text-center py-16 bg-card border border-border/40 rounded-xl space-y-3">
                  <Heart className="h-10 w-10 text-muted-foreground/45 mx-auto fill-muted-foreground/5" />
                  <p className="text-sm text-muted-foreground">Favorilerinizde henüz ürün bulunmuyor.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {initialWishlist.map((item) => {
                    const product = item.product;
                    const hasDiscount = product.discountPrice !== null;
                    const price = product.price;
                    const discountPrice = product.discountPrice;

                    return (
                      <div
                        key={item.id}
                        className="group relative flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card transition-all duration-300 hover:shadow-md"
                      >
                        <div className="aspect-h-1 aspect-w-1 w-full bg-muted overflow-hidden relative min-h-[220px]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        <div className="flex flex-1 flex-col p-4 space-y-2">
                          <div className="flex-1">
                            <p className="text-[10px] font-bold tracking-widest text-secondary uppercase">
                              {product.brand.name}
                            </p>
                            <h3 className="mt-1 text-xs font-semibold text-primary line-clamp-1">
                              <Link href={`/product/${product.slug}`}>
                                <span aria-hidden="true" className="absolute inset-0" />
                                {product.name}
                              </Link>
                            </h3>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-border/40">
                            <div className="flex items-baseline space-x-2">
                              {hasDiscount ? (
                                <>
                                  <span className="font-serif text-xs font-semibold text-primary">{discountPrice} TL</span>
                                  <span className="font-serif text-[10px] text-muted-foreground line-through">{price} TL</span>
                                </>
                              ) : (
                                <span className="font-serif text-xs font-semibold text-primary">{price} TL</span>
                              )}
                            </div>
                            <span className="text-[10px] text-secondary font-semibold hover:underline">
                              İncele
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
