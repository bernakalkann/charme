'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import VariantSelector from '@/components/shop/VariantSelector';
import { submitStockNotification, submitProductReview } from '@/actions/products';
import { 
  Star, 
  Check, 
  Truck, 
  Info, 
  Send,
  AlertCircle,
  ShoppingBag,
  Sparkles,
  BookmarkCheck
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Brand {
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface Variant {
  id: string;
  name: string;
  type: string;
  priceAdjustment: number;
  stock: number;
  sku: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  images: string[];
  verifiedPurchase: boolean;
  createdAt: Date;
  user: {
    name: string;
  };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number | null;
  sku: string;
  images: string[];
  skinTypes: string[];
  skinConcerns: string[];
  ingredients: string;
  badges: string[];
  usageRoutine: string | null;
  brand: Brand;
  category: Category;
  variants: Variant[];
  reviews: Review[];
  averageRating: number;
  ratingCount: number;
}

interface ProductDetailContentProps {
  product: Product;
  complementary: any[];
}

export default function ProductDetailContent({
  product,
  complementary,
}: ProductDetailContentProps) {
  const { data: session } = useSession();
  const cartStore = useCart();
  const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[0]);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [activeTab, setActiveTab] = useState<'desc' | 'routine' | 'inci'>('desc');
  
  // Stock alert state
  const [emailInput, setEmailInput] = useState('');
  const [alertSuccess, setAlertSuccess] = useState('');
  const [alertError, setAlertError] = useState('');

  // Review state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [isPending, startTransition] = useTransition();

  // Dynamic pricing
  const basePrice = product.discountPrice ?? product.price;
  const currentPrice = basePrice + (selectedVariant?.priceAdjustment ?? 0);
  const isOutOfStock = selectedVariant ? selectedVariant.stock === 0 : true;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    cartStore.addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      productImage: product.images[0],
      variantId: selectedVariant.id,
      variantName: `${selectedVariant.type === 'VOLUME' ? 'Boyut: ' : 'Renk: '}${selectedVariant.name}`,
      price: currentPrice,
      stock: selectedVariant.stock,
    }, 1);

    // Open cart drawer implicitly
    const cartButton = document.querySelector('[aria-label="Sepet"]') as HTMLButtonElement;
    if (cartButton) cartButton.click();
  };

  const handleStockAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;

    const res = await submitStockNotification({
      email: emailInput,
      productId: product.id,
      productVariantId: selectedVariant?.id,
    });

    if (res.success) {
      setAlertSuccess(res.message || '');
      setAlertError('');
      setEmailInput('');
    } else {
      setAlertError(res.error || '');
      setAlertSuccess('');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment) return;

    startTransition(async () => {
      const res = await submitProductReview({
        productId: product.id,
        rating: newRating,
        comment: newComment,
      });

      if (res.success) {
        setReviewSuccess(res.message || '');
        setReviewError('');
        setNewComment('');
        // Fast mock: insert review into UI list without full reload
        product.reviews.unshift({
          id: Math.random().toString(),
          rating: newRating,
          comment: newComment,
          images: [],
          verifiedPurchase: false,
          createdAt: new Date(),
          user: { name: session?.user?.name || 'Ben' },
        });
      } else {
        setReviewError(res.error || '');
        setReviewSuccess('');
      }
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Product main block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Left: Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-xl border border-border bg-card relative min-h-[400px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`h-16 w-16 overflow-hidden rounded-md border-2 transition-all ${
                    selectedImage === img ? 'border-primary' : 'border-border/40 hover:border-muted-foreground'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col space-y-6">
          <div>
            <p className="text-xs font-bold tracking-widest text-secondary uppercase">
              {product.brand.name}
            </p>
            <h1 className="mt-1 font-serif text-3xl font-semibold tracking-wide text-primary">
              {product.name}
            </h1>
            
            {/* Stars */}
            <div className="mt-3 flex items-center space-x-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4.5 w-4.5 ${
                      i < Math.round(product.averageRating) ? 'fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {product.averageRating.toFixed(1)} / 5 ({product.ratingCount} Değerlendirme)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="border-t border-b border-border/40 py-4 flex items-center space-x-4">
            <span className="font-serif text-2xl font-semibold text-primary">{currentPrice} TL</span>
            {product.discountPrice !== null && (
              <span className="font-serif text-base text-muted-foreground line-through">
                {product.price + (selectedVariant?.priceAdjustment ?? 0)} TL
              </span>
            )}
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 font-bold uppercase tracking-wider rounded">
              Stokta Mevcut
            </span>
          </div>

          {/* Skin types and concerns tags */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-xs font-semibold text-primary mr-1">Cilt Tipleri:</span>
              {product.skinTypes.map((type) => (
                <span key={type} className="text-[10px] bg-muted text-foreground/80 px-2.5 py-0.5 rounded font-medium">
                  {type === 'Oily' ? 'Yağlı' : type === 'Dry' ? 'Kuru' : type === 'Combination' ? 'Karma' : type === 'Sensitive' ? 'Hassas' : type}
                </span>
              ))}
            </div>
            {product.skinConcerns.length > 0 && (
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-xs font-semibold text-primary mr-1">Cilt Kaygıları:</span>
                {product.skinConcerns.map((concern) => (
                  <span key={concern} className="text-[10px] bg-muted text-foreground/80 px-2.5 py-0.5 rounded font-medium">
                    {concern === 'Acne' ? 'Akne' : concern === 'Aging' ? 'Kırışıklık' : concern === 'Dark Spots' ? 'Leke' : concern === 'Hydration' ? 'Nemsizlik' : concern}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Variant Selector */}
          <VariantSelector
            variants={product.variants}
            selectedVariantId={selectedVariant?.id}
            onSelect={(v) => {
              setSelectedVariant(v);
              setAlertSuccess('');
              setAlertError('');
            }}
          />

          {/* Action buttons (Add to Cart / Stock Alert) */}
          <div className="pt-2">
            {isOutOfStock ? (
              <div className="bg-card border border-amber-200/60 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-2 text-amber-700 text-xs">
                  <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Bu varyasyon şu anda tükenmiştir.</span>
                    <p className="mt-0.5 text-muted-foreground text-gray-500">Stoğa gelince anında haberdar olmak için e-posta adresinizi bırakabilirsiniz.</p>
                  </div>
                </div>
                <form onSubmit={handleStockAlertSubmit} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="E-posta adresiniz"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    className="flex-1 text-xs bg-muted border-none rounded-md px-3 py-2.5 focus:ring-1 focus:ring-secondary focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-md hover:bg-primary/90 transition-colors uppercase tracking-wider"
                  >
                    Bildir
                  </button>
                </form>
                {alertSuccess && <p className="text-xs text-emerald-600 font-medium">{alertSuccess}</p>}
                {alertError && <p className="text-xs text-red-600 font-medium">{alertError}</p>}
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-colors uppercase tracking-widest font-sans"
              >
                <ShoppingBag className="h-4 w-4" /> Sepete Ekle
              </button>
            )}
          </div>

          {/* Badges strip */}
          {product.badges.length > 0 && (
            <div className="flex flex-wrap gap-4 py-3 border-t border-b border-border/40">
              {product.badges.map((badge) => (
                <div key={badge} className="flex items-center text-xs font-medium text-primary gap-1.5">
                  <Sparkles className="h-4 w-4 text-secondary" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          )}

          {/* Delivery & Shipping Info */}
          <div className="flex items-center text-xs text-muted-foreground gap-2">
            <Truck className="h-4 w-4 text-gray-400" />
            <span>Bugün sipariş verin, en geç 2 gün içinde kargoda! 1000 TL üzeri ücretsiz kargo.</span>
          </div>

        </div>
      </div>

      {/* Tabs segment */}
      <div className="mt-16 border-t border-border/40 pt-10">
        <div className="border-b border-border/60">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-4 text-sm font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'desc' ? 'border-b-2 border-secondary text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Açıklama
            </button>
            {product.usageRoutine && (
              <button
                onClick={() => setActiveTab('routine')}
                className={`pb-4 text-sm font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === 'routine' ? 'border-b-2 border-secondary text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                Kullanım Rutini
              </button>
            )}
            <button
              onClick={() => setActiveTab('inci')}
              className={`pb-4 text-sm font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'inci' ? 'border-b-2 border-secondary text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              İçerik (INCI Listesi)
            </button>
          </div>
        </div>

        <div className="py-6">
          {activeTab === 'desc' && (
            <div className="prose prose-sm text-sm text-foreground/80 leading-relaxed max-w-none">
              {product.description}
            </div>
          )}
          {activeTab === 'routine' && product.usageRoutine && (
            <div className="prose prose-sm text-sm text-foreground/80 leading-relaxed max-w-none space-y-2">
              <h4 className="font-semibold text-primary">Nasıl Kullanılır?</h4>
              <p>{product.usageRoutine}</p>
            </div>
          )}
          {activeTab === 'inci' && (
            <div className="space-y-4">
              <div className="flex gap-2 text-amber-700 bg-amber-50 border border-amber-200/40 p-3.5 rounded-lg text-xs leading-relaxed max-w-3xl">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Alerjen Uyarısı:</strong> Kozmetik ürünleri kullanmadan önce bileğinizin iç kısmında yama testi (patch test) yapmanızı öneririz. Kızarıklık veya kaşıntı halinde kullanımı durdurun.
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono leading-relaxed bg-muted/40 p-4 rounded-lg border border-border/40">
                {product.ingredients}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cross-sell: Complementary Products */}
      {complementary.length > 0 && (
        <div className="mt-16 border-t border-border/40 pt-12">
          <h2 className="font-serif text-2xl font-semibold tracking-wide text-primary mb-8">
            Tamamlayıcı Ürünler (Rutini Tamamla)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {complementary.map((compProd) => {
              const compPrice = compProd.discountPrice ?? compProd.price;
              return (
                <div key={compProd.id} className="group relative flex flex-col rounded-xl border border-border/40 bg-card overflow-hidden transition-all duration-200 hover:shadow-sm">
                  <div className="aspect-h-1 aspect-w-1 w-full bg-muted overflow-hidden relative min-h-[200px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={compProd.images[0]}
                      alt={compProd.name}
                      className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[9px] font-bold tracking-widest text-secondary uppercase">{compProd.brand.name}</p>
                      <h4 className="text-xs font-semibold text-primary mt-1 line-clamp-1">
                        <Link href={`/product/${compProd.slug}`}>{compProd.name}</Link>
                      </h4>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/30">
                      <span className="font-serif text-xs font-bold text-primary">{compPrice} TL</span>
                      <Link 
                        href={`/product/${compProd.slug}`}
                        className="text-[10px] text-secondary font-semibold hover:underline"
                      >
                        İncele
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-16 border-t border-border/40 pt-12">
        <h2 className="font-serif text-2xl font-semibold tracking-wide text-primary mb-8">
          Müşteri Değerlendirmeleri ({product.reviews.length})
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Review list */}
          <div className="lg:col-span-2 space-y-6">
            {product.reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Bu ürün için henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
            ) : (
              product.reviews.map((rev) => (
                <div key={rev.id} className="border-b border-border/40 pb-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-primary">{rev.user.name}</span>
                      {rev.verifiedPurchase && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200/30 px-1.5 py-0.5 rounded font-bold uppercase">
                          <BookmarkCheck className="h-3 w-3" /> Doğrulanmış Alıcı
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(rev.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < rev.rating ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>

                  <p className="text-sm text-foreground/80 leading-relaxed">{rev.comment}</p>

                  {/* Review images */}
                  {rev.images.length > 0 && (
                    <div className="flex gap-2 pt-1">
                      {rev.images.map((imgUrl, idx) => (
                        <div key={idx} className="h-16 w-16 overflow-hidden rounded-md border border-border bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imgUrl} alt="" className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Write review form */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border/40 rounded-xl p-6 space-y-4">
              <h3 className="font-serif text-lg font-semibold text-primary">Ürünü Değerlendirin</h3>
              
              {session ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Puanınız</label>
                    <div className="flex gap-1.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setNewRating(val)}
                          className="hover:scale-110 transition-transform"
                        >
                          <Star className={`h-6 w-6 ${val <= newRating ? 'fill-current' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="comment" className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      Yorumunuz
                    </label>
                    <textarea
                      id="comment"
                      rows={4}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                      placeholder="Ürün hakkındaki görüşlerinizi yazın..."
                      className="w-full text-xs bg-muted border-none rounded-md p-3 focus:ring-1 focus:ring-secondary focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-primary text-primary-foreground text-xs font-semibold py-3 rounded-full hover:bg-primary/90 transition-colors uppercase tracking-widest font-sans flex items-center justify-center gap-1.5"
                  >
                    <Send className="h-3 w-3" /> Gönder
                  </button>

                  {reviewSuccess && <p className="text-xs text-emerald-600 font-medium">{reviewSuccess}</p>}
                  {reviewError && <p className="text-xs text-red-600 font-medium">{reviewError}</p>}
                </form>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <p className="text-xs text-muted-foreground">Ürünü değerlendirmek için öncelikle giriş yapmalısınız.</p>
                  <Link
                    href="/login"
                    className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors uppercase tracking-wider"
                  >
                    Giriş Yap
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
