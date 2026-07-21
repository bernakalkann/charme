'use client';

import React, { useState } from 'react';
import { 
  getAdminStats, 
  updateOrderStatus, 
  createProduct, 
  deleteProduct, 
  createCoupon, 
  toggleCouponActive 
} from '@/actions/admin';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Percent, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Plus, 
  Trash2, 
  Truck,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { OrderStatus, DiscountType } from '@prisma/client';

interface LowStock {
  id: string;
  variantName: string;
  productName: string;
  brandName: string;
  stock: number;
}

interface BestSeller {
  id: string;
  name: string;
  brandName: string;
  price: number;
  salesCount: number;
}

interface AdminStats {
  totalSales: number;
  totalOrders: number;
  lowStockCount: number;
  lowStockVariants: LowStock[];
  bestSellers: BestSeller[];
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  sku: string;
  brand: { name: string };
  category: { name: string };
  variants: { id: string; name: string; stock: number }[];
}

interface Order {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  trackingCode: string | null;
  createdAt: Date;
  user: { name: string; email: string };
  items: { id: string; quantity: number; productVariant: { name: string; product: { name: string } } }[];
}

interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchase: number;
  expiryDate: Date;
  active: boolean;
  usageCount: number;
}

interface AdminDashboardContentProps {
  initialStats: AdminStats;
  initialProducts: Product[];
  initialOrders: Order[];
  initialCoupons: Coupon[];
  brands: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}

export default function AdminDashboardContent({
  initialStats,
  initialProducts,
  initialOrders,
  initialCoupons,
  brands,
  categories,
}: AdminDashboardContentProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'orders' | 'coupons'>('stats');
  
  // Dynamic lists from state to allow UI updates
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  // New Product State
  const [newProd, setNewProd] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    discountPrice: 0,
    sku: '',
    images: ['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop'],
    brandId: brands[0]?.id || '',
    categoryId: categories[0]?.id || '',
    skinTypes: [] as string[],
    skinConcerns: [] as string[],
    ingredients: '',
    badges: [] as string[],
    usageRoutine: '',
  });
  
  const [newVariants, setNewVariants] = useState<Omit<Product['variants'][0], 'id'>[]>([
    { name: '50ml Standard', stock: 20 },
  ]);

  const [prodSuccess, setProdSuccess] = useState('');
  const [prodError, setProdError] = useState('');

  // New Coupon State
  const [newCoup, setNewCoup] = useState({
    code: '',
    discountType: 'PERCENTAGE' as DiscountType,
    discountValue: 10,
    minPurchase: 500,
    expiryDate: '',
  });
  const [coupSuccess, setCoupSuccess] = useState('');
  const [coupError, setCoupError] = useState('');

  // Order update states
  const [updatingOrderId, setUpdatingOrderId] = useState('');
  const [trackingInputs, setTrackingInputs] = useState<{ [key: string]: string }>({});

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdatingOrderId(orderId);
    const tracking = trackingInputs[orderId] || '';
    const res = await updateOrderStatus(orderId, status, tracking);
    if (res.success) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status, trackingCode: tracking || o.trackingCode } : o));
    }
    setUpdatingOrderId('');
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProdSuccess('');
    setProdError('');

    // Format variants for submission
    const formattedVariants = newVariants.map((v) => ({
      name: v.name,
      type: v.name.toLowerCase().includes('ml') ? 'VOLUME' : 'SHADE',
      priceAdjustment: 0.0,
      stock: v.stock,
      sku: `${newProd.sku}-${v.name.replace(/\s+/g, '-').toUpperCase()}`,
    }));

    const payload = {
      ...newProd,
      discountPrice: newProd.discountPrice > 0 ? newProd.discountPrice : undefined,
      variants: formattedVariants,
    };

    const res = await createProduct(payload as any);
    if (res.success) {
      setProdSuccess('Ürün başarıyla eklendi! Sayfa yenileniyor...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      setProdError(res.error || 'Ürün eklenemedi.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    const res = await deleteProduct(id);
    if (res.success) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCoupSuccess('');
    setCoupError('');

    const res = await createCoupon({
      code: newCoup.code,
      discountType: newCoup.discountType,
      discountValue: Number(newCoup.discountValue),
      minPurchase: Number(newCoup.minPurchase),
      expiryDate: new Date(newCoup.expiryDate),
    });

    if (res.success) {
      setCoupSuccess('Kupon kodu başarıyla eklendi.');
      // Refresh local list
      setCoupons([{
        id: Math.random().toString(),
        code: newCoup.code.toUpperCase(),
        discountType: newCoup.discountType,
        discountValue: Number(newCoup.discountValue),
        minPurchase: Number(newCoup.minPurchase),
        expiryDate: new Date(newCoup.expiryDate),
        active: true,
        usageCount: 0,
      }, ...coupons]);
      setNewCoup({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minPurchase: 500,
        expiryDate: '',
      });
    } else {
      setCoupError(res.error || 'Kupon eklenemedi.');
    }
  };

  const handleToggleCoupon = async (id: string, active: boolean) => {
    const res = await toggleCouponActive(id, active);
    if (res.success) {
      setCoupons(coupons.map((c) => (c.id === id ? { ...c, active } : c)));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/40 pb-5 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-wide text-primary">Yönetici Paneli (Dashboard)</h1>
          <p className="mt-2 text-sm text-muted-foreground">Charme kozmetik platformu satış, stok ve kampanya yönetim merkezi.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border/40 rounded-xl overflow-hidden divide-y divide-border/40">
            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full text-left px-5 py-4.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors ${
                activeTab === 'stats' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-muted'
              }`}
            >
              <BarChart3 className="h-4.5 w-4.5" /> Analiz & Raporlar
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full text-left px-5 py-4.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors ${
                activeTab === 'products' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-muted'
              }`}
            >
              <Package className="h-4.5 w-4.5" /> Ürün Yönetimi
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-5 py-4.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors ${
                activeTab === 'orders' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-muted'
              }`}
            >
              <ShoppingBag className="h-4.5 w-4.5" /> Sipariş Takibi
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full text-left px-5 py-4.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors ${
                activeTab === 'coupons' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-muted'
              }`}
            >
              <Percent className="h-4.5 w-4.5" /> Kampanyalar & Kuponlar
            </button>
          </div>
        </div>

        {/* Tab content view */}
        <div className="lg:col-span-4 space-y-8 animate-in fade-in duration-200">
          
          {/* STATS TAB */}
          {activeTab === 'stats' && (
            <div className="space-y-8">
              
              {/* Counter Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-card border border-border/40 p-6 rounded-xl flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Toplam Brüt Ciro</span>
                    <h3 className="font-serif text-xl font-bold text-primary mt-0.5">{initialStats.totalSales.toFixed(2)} TL</h3>
                  </div>
                </div>

                <div className="bg-card border border-border/40 p-6 rounded-xl flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Alınan Sipariş</span>
                    <h3 className="font-serif text-xl font-bold text-primary mt-0.5">{initialStats.totalOrders} Sipariş</h3>
                  </div>
                </div>

                <div className="bg-card border border-border/40 p-6 rounded-xl flex items-center gap-4">
                  <div className={`p-3 rounded-full ${initialStats.lowStockCount > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Kritik Stok Alarmları</span>
                    <h3 className="font-serif text-xl font-bold text-primary mt-0.5">{initialStats.lowStockCount} Varyant</h3>
                  </div>
                </div>
              </div>

              {/* Best sellers & Stock tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Low Stock list */}
                <div className="bg-card border border-border/40 rounded-xl p-6 space-y-4">
                  <h3 className="text-sm font-semibold tracking-wider text-primary uppercase border-b pb-3 flex items-center gap-1.5">
                    <AlertTriangle className="h-4.5 w-4.5 text-red-500" /> Düşük Stok Uyarıları
                  </h3>
                  <div className="divide-y divide-border/40 max-h-60 overflow-y-auto pr-2 text-xs">
                    {initialStats.lowStockVariants.length === 0 ? (
                      <p className="text-muted-foreground italic py-4">Tüm ürün varyantlarında yeterli stok bulunuyor.</p>
                    ) : (
                      initialStats.lowStockVariants.map((v) => (
                        <div key={v.id} className="py-2.5 flex justify-between items-center">
                          <div>
                            <span className="font-semibold text-primary">{v.productName}</span>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{v.brandName} - {v.variantName}</p>
                          </div>
                          <span className={`px-2 py-0.5 font-bold rounded ${v.stock === 0 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                            {v.stock} Adet
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Best Sellers */}
                <div className="bg-card border border-border/40 rounded-xl p-6 space-y-4">
                  <h3 className="text-sm font-semibold tracking-wider text-primary uppercase border-b pb-3 flex items-center gap-1.5">
                    <TrendingUp className="h-4.5 w-4.5 text-emerald-500" /> En Çok Satan Ürünler (Popüler)
                  </h3>
                  <div className="divide-y divide-border/40 max-h-60 overflow-y-auto pr-2 text-xs">
                    {initialStats.bestSellers.map((seller) => (
                      <div key={seller.id} className="py-3 flex justify-between items-center">
                        <div>
                          <span className="font-semibold text-primary">{seller.name}</span>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{seller.brandName}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-serif font-bold text-primary">{seller.price} TL</span>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{seller.salesCount} adet satıldı</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-8">
              
              {/* Product Listing */}
              <div className="bg-card border border-border/40 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-semibold tracking-wider text-primary uppercase border-b pb-3">Mevcut Ürünler ({products.length})</h3>
                <div className="divide-y divide-border/40 text-xs">
                  {products.map((p) => {
                    const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
                    return (
                      <div key={p.id} className="py-3.5 flex justify-between items-center gap-4">
                        <div className="min-w-0">
                          <span className="font-semibold text-primary text-sm truncate block">{p.name}</span>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            SKU: {p.sku} | Marka: {p.brand.name} | Kategori: {p.category.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-6 flex-shrink-0">
                          <div className="text-right">
                            <span className="font-serif font-semibold text-primary block">{p.price} TL</span>
                            <span className="text-[10px] text-muted-foreground">Toplam Stok: {totalStock}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add New Product Form */}
              <div className="bg-card border border-border/40 rounded-xl p-6 space-y-6">
                <h3 className="text-sm font-semibold tracking-wider text-primary uppercase border-b pb-3 flex items-center gap-1.5">
                  <Plus className="h-5 w-5 text-secondary" /> Yeni Ürün Ekle
                </h3>
                
                <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Ürün Adı</label>
                      <input
                        type="text"
                        required
                        value={newProd.name}
                        onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                        className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Slug (URL)</label>
                      <input
                        type="text"
                        required
                        placeholder="karpuz-glow-maske"
                        value={newProd.slug}
                        onChange={(e) => setNewProd({ ...newProd, slug: e.target.value })}
                        className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-secondary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Ana Fiyat (TL)</label>
                      <input
                        type="number"
                        required
                        value={newProd.price || ''}
                        onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                        className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">İndirimli Fiyat (Opsiyonel)</label>
                      <input
                        type="number"
                        value={newProd.discountPrice || ''}
                        onChange={(e) => setNewProd({ ...newProd, discountPrice: Number(e.target.value) })}
                        className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Ana SKU</label>
                      <input
                        type="text"
                        required
                        placeholder="GLOW-PARENT"
                        value={newProd.sku}
                        onChange={(e) => setNewProd({ ...newProd, sku: e.target.value })}
                        className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-secondary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Marka</label>
                      <select
                        value={newProd.brandId}
                        onChange={(e) => setNewProd({ ...newProd, brandId: e.target.value })}
                        className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-secondary"
                      >
                        {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Kategori</label>
                      <select
                        value={newProd.categoryId}
                        onChange={(e) => setNewProd({ ...newProd, categoryId: e.target.value })}
                        className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-secondary"
                      >
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Skin Types & Concerns Multi Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Hedef Cilt Tipleri</label>
                      <div className="flex flex-wrap gap-2">
                        {['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'].map((type) => {
                          const has = newProd.skinTypes.includes(type);
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => {
                                const list = has 
                                  ? newProd.skinTypes.filter((t) => t !== type) 
                                  : [...newProd.skinTypes, type];
                                setNewProd({ ...newProd, skinTypes: list });
                              }}
                              className={`px-3 py-1 rounded-full border text-[10px] font-semibold transition-all ${
                                has ? 'bg-primary border-primary text-primary-foreground' : 'border-border bg-card hover:bg-muted'
                              }`}
                            >
                              {type === 'Oily' ? 'Yağlı' : type === 'Dry' ? 'Kuru' : type === 'Combination' ? 'Karma' : type === 'Sensitive' ? 'Hassas' : type}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Hedef Cilt Kaygıları</label>
                      <div className="flex flex-wrap gap-2">
                        {['Acne', 'Aging', 'Dark Spots', 'Hydration', 'Dullness', 'Uneven Texture', 'Pores'].map((concern) => {
                          const has = newProd.skinConcerns.includes(concern);
                          return (
                            <button
                              key={concern}
                              type="button"
                              onClick={() => {
                                const list = has 
                                  ? newProd.skinConcerns.filter((c) => c !== concern) 
                                  : [...newProd.skinConcerns, concern];
                                setNewProd({ ...newProd, skinConcerns: list });
                              }}
                              className={`px-3 py-1 rounded-full border text-[10px] font-semibold transition-all ${
                                has ? 'bg-primary border-primary text-primary-foreground' : 'border-border bg-card hover:bg-muted'
                              }`}
                            >
                              {concern === 'Acne' ? 'Akne' : concern === 'Aging' ? 'Yaşlanma' : concern === 'Dark Spots' ? 'Leke' : concern === 'Hydration' ? 'Nemsizlik' : concern}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* INCI List & Routine */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Açıklama</label>
                    <textarea
                      required
                      rows={2}
                      value={newProd.description}
                      onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                      className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Nasıl Kullanılır? (Kullanım Rutini)</label>
                    <textarea
                      rows={2}
                      value={newProd.usageRoutine}
                      onChange={(e) => setNewProd({ ...newProd, usageRoutine: e.target.value })}
                      className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">İçindekiler / INCI Listesi</label>
                    <textarea
                      required
                      rows={2}
                      value={newProd.ingredients}
                      onChange={(e) => setNewProd({ ...newProd, ingredients: e.target.value })}
                      className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-secondary"
                    />
                  </div>

                  {/* Badges */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Ürün Rozetleri</label>
                    <div className="flex flex-wrap gap-2">
                      {['Cruelty-Free', 'Vegan', 'Dermatologically Tested', 'Fragrance-Free', 'Non-Comedogenic'].map((badge) => {
                        const has = newProd.badges.includes(badge);
                        return (
                          <button
                            key={badge}
                            type="button"
                            onClick={() => {
                              const list = has 
                                ? newProd.badges.filter((b) => b !== badge) 
                                : [...newProd.badges, badge];
                              setNewProd({ ...newProd, badges: list });
                            }}
                            className={`px-3 py-1 rounded-full border text-[10px] font-semibold transition-all ${
                              has ? 'bg-primary border-primary text-primary-foreground' : 'border-border bg-card hover:bg-muted'
                            }`}
                          >
                            {badge}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Product Variants Form */}
                  <div className="border-t border-border/40 pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-primary uppercase tracking-wider text-[10px]">Ürün Varyasyonları</span>
                      <button
                        type="button"
                        onClick={() => setNewVariants([...newVariants, { name: '', stock: 10 }])}
                        className="text-secondary font-semibold hover:underline flex items-center gap-1 text-[10px]"
                      >
                        <Plus className="h-3 w-3" /> Varyant Ekle
                      </button>
                    </div>
                    <div className="space-y-2">
                      {newVariants.map((v, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                          <input
                            type="text"
                            placeholder="Varyant Adı (Örn: 50ml, Shade 02)"
                            required
                            value={v.name}
                            onChange={(e) => {
                              const list = [...newVariants];
                              list[idx].name = e.target.value;
                              setNewVariants(list);
                            }}
                            className="flex-1 text-xs bg-muted border-none rounded-md p-2 focus:outline-none"
                          />
                          <input
                            type="number"
                            placeholder="Stok"
                            required
                            value={v.stock || ''}
                            onChange={(e) => {
                              const list = [...newVariants];
                              list[idx].stock = Number(e.target.value);
                              setNewVariants(list);
                            }}
                            className="w-28 text-xs bg-muted border-none rounded-md p-2 focus:outline-none"
                          />
                          {newVariants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setNewVariants(newVariants.filter((_, i) => i !== idx))}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {prodSuccess && <p className="text-emerald-600 font-semibold">{prodSuccess}</p>}
                  {prodError && <p className="text-red-600 font-semibold">{prodError}</p>}

                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-full hover:bg-primary/90 transition-colors uppercase tracking-widest font-sans"
                  >
                    Ürünü Kaydet & Yayınla
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="bg-card border border-border/40 rounded-xl p-6 space-y-6">
              <h3 className="text-sm font-semibold tracking-wider text-primary uppercase border-b pb-3">Sipariş Yönetimi ({orders.length})</h3>
              
              <div className="divide-y divide-border/40 text-xs space-y-6">
                {orders.length === 0 ? (
                  <p className="text-muted-foreground italic py-6">Henüz sipariş bulunmuyor.</p>
                ) : (
                  orders.map((o) => (
                    <div key={o.id} className="py-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div>
                          <span className="font-semibold text-primary text-sm font-mono block">{o.id}</span>
                          <span className="text-[10px] text-muted-foreground mt-0.5 block">
                            Alıcı: {o.user.name} ({o.user.email}) | Tarih: {new Date(o.createdAt).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-serif font-bold text-primary mr-2">{o.totalAmount} TL</span>
                          
                          {/* Dropdown status update */}
                          <select
                            value={o.status}
                            disabled={updatingOrderId === o.id}
                            onChange={(e) => handleUpdateStatus(o.id, e.target.value as OrderStatus)}
                            className="bg-muted border-none text-[10px] font-bold tracking-wider uppercase rounded px-2.5 py-1.5 focus:ring-1 focus:ring-secondary focus:outline-none"
                          >
                            <option value="PENDING">Onay Bekliyor</option>
                            <option value="PROCESSING">Hazırlanıyor</option>
                            <option value="SHIPPED">Kargolandı</option>
                            <option value="COMPLETED">Teslim Edildi</option>
                            <option value="CANCELLED">İptal Edildi</option>
                            <option value="RETURNED">İade Edildi</option>
                          </select>
                        </div>
                      </div>

                      {/* Items nested info */}
                      <div className="bg-muted/30 p-3 rounded-lg border border-border/30 space-y-1.5">
                        {o.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-[11px] text-foreground/80">
                            <span>{item.productVariant.product.name} ({item.productVariant.name})</span>
                            <span className="font-semibold">x {item.quantity} Adet</span>
                          </div>
                        ))}
                      </div>

                      {/* Tracking Code input box */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-sm flex gap-2">
                          <input
                            type="text"
                            placeholder="Kargo takip kodu girin..."
                            value={trackingInputs[o.id] !== undefined ? trackingInputs[o.id] : (o.trackingCode || '')}
                            onChange={(e) => setTrackingInputs({ ...trackingInputs, [o.id]: e.target.value })}
                            className="flex-1 text-[11px] bg-muted border-none rounded px-2 py-1.5 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(o.id, o.status)}
                            className="bg-primary text-primary-foreground text-[10px] font-semibold px-3.5 rounded hover:bg-primary/90 flex items-center gap-1"
                          >
                            <Truck className="h-3.5 w-3.5" /> Kaydet
                          </button>
                        </div>
                        {o.trackingCode && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Kargo Kodu Kayıtlı
                          </span>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* COUPONS TAB */}
          {activeTab === 'coupons' && (
            <div className="space-y-8">
              
              {/* Coupons List */}
              <div className="bg-card border border-border/40 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-semibold tracking-wider text-primary uppercase border-b pb-3">Aktif Kampanyalar & Kupon Kodları</h3>
                <div className="divide-y divide-border/40 text-xs">
                  {coupons.map((c) => (
                    <div key={c.id} className="py-3 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-primary font-mono text-sm block">{c.code}</span>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Türü: {c.discountType === 'PERCENTAGE' ? `%${c.discountValue} İndirim` : `${c.discountValue} TL Sabit İndirim`} | Min: {c.minPurchase} TL
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="text-[10px] text-muted-foreground block">Toplam Kullanım</span>
                          <span className="font-semibold text-primary block">{c.usageCount} Defa</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={c.active}
                          onChange={(e) => handleToggleCoupon(c.id, e.target.checked)}
                          className="rounded border-border text-secondary focus:ring-secondary/40 h-4.5 w-4.5 cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Coupon Form */}
              <div className="bg-card border border-border/40 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-semibold tracking-wider text-primary uppercase border-b pb-3 flex items-center gap-1.5">
                  <Plus className="h-5 w-5 text-secondary" /> Yeni İndirim Kodu Tanımla
                </h3>

                <form onSubmit={handleAddCoupon} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Kupon Kodu</label>
                      <input
                        type="text"
                        required
                        placeholder="WELCOME10"
                        value={newCoup.code}
                        onChange={(e) => setNewCoup({ ...newCoup, code: e.target.value })}
                        className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-secondary uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">İndirim Türü</label>
                      <select
                        value={newCoup.discountType}
                        onChange={(e) => setNewCoup({ ...newCoup, discountType: e.target.value as DiscountType })}
                        className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-secondary"
                      >
                        <option value="PERCENTAGE">Yüzdesel İndirim (%)</option>
                        <option value="FIXED">Sabit TL İndirimi (TL)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">İndirim Değeri</label>
                      <input
                        type="number"
                        required
                        value={newCoup.discountValue || ''}
                        onChange={(e) => setNewCoup({ ...newCoup, discountValue: Number(e.target.value) })}
                        className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Minimum Alışveriş Tutarı (TL)</label>
                      <input
                        type="number"
                        required
                        value={newCoup.minPurchase || ''}
                        onChange={(e) => setNewCoup({ ...newCoup, minPurchase: Number(e.target.value) })}
                        className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Geçerlilik Son Tarihi</label>
                      <input
                        type="date"
                        required
                        value={newCoup.expiryDate}
                        onChange={(e) => setNewCoup({ ...newCoup, expiryDate: e.target.value })}
                        className="w-full text-xs bg-muted border-none rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-secondary"
                      />
                    </div>
                  </div>

                  {coupSuccess && <p className="text-emerald-600 font-semibold">{coupSuccess}</p>}
                  {coupError && <p className="text-red-600 font-semibold">{coupError}</p>}

                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-full hover:bg-primary/90 transition-colors uppercase tracking-widest font-sans"
                  >
                    Kuponu Tanımla
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
