'use client';

import React from 'react';

interface Variant {
  id: string;
  name: string;
  type: string;
  priceAdjustment: number;
  stock: number;
  sku: string;
}

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariantId: string;
  onSelect: (variant: Variant) => void;
}

export default function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) return null;

  // Group variants by type: VOLUME or SHADE
  const type = variants[0].type; // Assuming a product has variants of the same type

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold tracking-wider text-primary uppercase font-sans">
        {type === 'VOLUME' ? 'Boyut / Hacim Seçin' : 'Renk / Ton Seçin'}
      </h3>
      
      <div className="flex flex-wrap gap-2.5">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedVariantId;
          const isOutOfStock = variant.stock === 0;
          
          let displayPrice = '';
          if (variant.priceAdjustment > 0) {
            displayPrice = ` (+${variant.priceAdjustment} TL)`;
          } else if (variant.priceAdjustment < 0) {
            displayPrice = ` (${variant.priceAdjustment} TL)`;
          }

          if (type === 'VOLUME') {
            return (
              <button
                key={variant.id}
                type="button"
                disabled={isOutOfStock}
                onClick={() => onSelect(variant)}
                className={`px-4 py-2.5 text-xs font-medium rounded-md border transition-all duration-200 focus:outline-none ${
                  isOutOfStock
                    ? 'border-border/30 bg-muted/20 text-muted-foreground/40 cursor-not-allowed line-through'
                    : isSelected
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-border bg-card text-foreground hover:border-muted-foreground'
                }`}
              >
                {variant.name}
                {displayPrice}
              </button>
            );
          } else {
            // Shade variant styling (with potential circular indicators)
            return (
              <button
                key={variant.id}
                type="button"
                disabled={isOutOfStock}
                onClick={() => onSelect(variant)}
                className={`px-4 py-3 text-xs font-medium rounded-full border transition-all duration-200 focus:outline-none flex items-center gap-2 ${
                  isOutOfStock
                    ? 'border-border/30 bg-muted/20 text-muted-foreground/40 cursor-not-allowed line-through'
                    : isSelected
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-border bg-card text-foreground hover:border-muted-foreground'
                }`}
              >
                {/* Circular indicator for shade style */}
                <span 
                  className="h-3 w-3 rounded-full border border-black/10 inline-block"
                  style={{ 
                    backgroundColor: variant.name.toLowerCase().includes('kırmızı') 
                      ? '#dc2626' 
                      : variant.name.toLowerCase().includes('pembe') || variant.name.toLowerCase().includes('peach') || variant.name.toLowerCase().includes('mélodieuse')
                      ? '#f43f5e' 
                      : variant.name.toLowerCase().includes('neutral') 
                      ? '#f3d9c9' 
                      : '#a1a1aa' 
                  }}
                />
                {variant.name}
                {displayPrice}
              </button>
            );
          }
        })}
      </div>
    </div>
  );
}
