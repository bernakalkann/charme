'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductFilter from '@/components/shop/ProductFilter';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';

interface Brand {
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

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number | null;
  sku: string;
  images: string[];
  brandId: string;
  categoryId: string;
  skinTypes: string[];
  skinConcerns: string[];
  badges: string[];
  brand: Brand;
  variants: Variant[];
}

interface CategoryContentProps {
  categoryName: string;
  initialProducts: Product[];
  brands: Brand[];
}

export default function CategoryContent({
  categoryName,
  initialProducts,
  brands,
}: CategoryContentProps) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [selectedSkinConcerns, setSelectedSkinConcerns] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  const handleBrandToggle = (id: string) => {
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
    );
  };

  const handleSkinTypeToggle = (type: string) => {
    setSelectedSkinTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSkinConcernToggle = (concern: string) => {
    setSelectedSkinConcerns((prev) =>
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern]
    );
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange({ min, max });
  };

  const handleClearAll = () => {
    setSelectedBrands([]);
    setSelectedSkinTypes([]);
    setSelectedSkinConcerns([]);
    setPriceRange({ min: 0, max: 10000 });
  };

  // Client-side filtering logic
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brandId)) {
        return false;
      }
      // Skin Type filter (product has at least one of the selected skin types)
      if (selectedSkinTypes.length > 0) {
        const hasMatch = product.skinTypes.some((type) => selectedSkinTypes.includes(type));
        if (!hasMatch) return false;
      }
      // Skin Concern filter
      if (selectedSkinConcerns.length > 0) {
        const hasMatch = product.skinConcerns.some((concern) => selectedSkinConcerns.includes(concern));
        if (!hasMatch) return false;
      }
      // Price filter
      const finalPrice = product.discountPrice ?? product.price;
      if (finalPrice < priceRange.min || finalPrice > priceRange.max) {
        return false;
      }

      return true;
    });
  }, [initialProducts, selectedBrands, selectedSkinTypes, selectedSkinConcerns, priceRange]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mb-8 border-b border-border/40 pb-5">
        <h1 className="font-serif text-3xl font-semibold tracking-wide text-primary">{categoryName}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Premium ve lüks {categoryName.toLowerCase()} koleksiyonumuzu keşfedin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <ProductFilter
            brands={brands}
            selectedBrands={selectedBrands}
            selectedSkinTypes={selectedSkinTypes}
            selectedSkinConcerns={selectedSkinConcerns}
            priceRange={priceRange}
            onBrandToggle={handleBrandToggle}
            onSkinTypeToggle={handleSkinTypeToggle}
            onSkinConcernToggle={handleSkinConcernToggle}
            onPriceChange={handlePriceChange}
            onClearAll={handleClearAll}
          />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-border rounded-xl bg-card">
              <Sparkles className="h-10 w-10 text-muted-foreground/60 mb-4" />
              <h3 className="text-base font-semibold text-primary">Eşleşen Ürün Bulunamadı</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Seçtiğiniz filtrelere uygun ürün bulunmuyor. Farklı kombinasyonlar deneyebilirsiniz.
              </p>
              <button
                onClick={handleClearAll}
                className="mt-4 text-xs font-semibold text-secondary hover:underline"
              >
                Filtreleri Sıfırla
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const hasDiscount = product.discountPrice !== null;
                const price = product.price;
                const discountPrice = product.discountPrice;
                const displayPrice = hasDiscount ? discountPrice : price;
                const isOutOfStock = product.variants.every((v) => v.stock === 0);

                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card transition-all duration-300 hover:shadow-md"
                  >
                    {/* Badge */}
                    {product.badges.length > 0 && (
                      <span className="absolute left-3 top-3 z-10 bg-accent text-accent-foreground px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full">
                        {product.badges[0]}
                      </span>
                    )}

                    {/* Image container */}
                    <div className="aspect-h-1 aspect-w-1 w-full bg-muted overflow-hidden relative min-h-[260px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                          <span className="bg-white/95 text-primary text-[10px] font-bold tracking-widest px-3 py-1.5 uppercase rounded">
                            Tükendi
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-4 space-y-2">
                      <div className="flex-1">
                        <p className="text-[10px] font-bold tracking-widest text-secondary uppercase">
                          {product.brand.name}
                        </p>
                        <h3 className="mt-1 text-sm font-medium text-primary line-clamp-1">
                          <Link href={`/product/${product.slug}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            {product.name}
                          </Link>
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      {/* Prices & Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/40">
                        <div className="flex items-baseline space-x-2">
                          {hasDiscount ? (
                            <>
                              <span className="font-serif text-sm font-semibold text-primary">{discountPrice} TL</span>
                              <span className="font-serif text-xs text-muted-foreground line-through">{price} TL</span>
                            </>
                          ) : (
                            <span className="font-serif text-sm font-semibold text-primary">{price} TL</span>
                          )}
                        </div>
                        <div className="text-secondary group-hover:translate-x-1 transition-transform">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
