'use client';

import React from 'react';
import { SlidersHorizontal, ChevronDown, RotateCcw } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
}

interface ProductFilterProps {
  brands: Brand[];
  selectedBrands: string[];
  selectedSkinTypes: string[];
  selectedSkinConcerns: string[];
  priceRange: { min: number; max: number };
  onBrandToggle: (id: string) => void;
  onSkinTypeToggle: (type: string) => void;
  onSkinConcernToggle: (concern: string) => void;
  onPriceChange: (min: number, max: number) => void;
  onClearAll: () => void;
}

const skinTypesList = [
  { value: 'Oily', label: 'Yağlı Cilt' },
  { value: 'Dry', label: 'Kuru Cilt' },
  { value: 'Combination', label: 'Karma Cilt' },
  { value: 'Sensitive', label: 'Hassas Cilt' },
  { value: 'Normal', label: 'Normal Cilt' },
];

const skinConcernsList = [
  { value: 'Acne', label: 'Akne & Gözenek' },
  { value: 'Aging', label: 'Yaşlanma Karşıtı' },
  { value: 'Dark Spots', label: 'Leke Karşıtı' },
  { value: 'Hydration', label: 'Nemsizlik & Kuruluk' },
  { value: 'Dullness', label: 'Matlık & Donukluk' },
  { value: 'Uneven Texture', label: 'Cilt Eşitsizliği' },
  { value: 'Pores', label: 'Geniş Gözenekler' },
];

export default function ProductFilter({
  brands,
  selectedBrands,
  selectedSkinTypes,
  selectedSkinConcerns,
  priceRange,
  onBrandToggle,
  onSkinTypeToggle,
  onSkinConcernToggle,
  onPriceChange,
  onClearAll,
}: ProductFilterProps) {
  return (
    <div className="bg-card border border-border/40 rounded-xl p-6 space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="h-4.5 w-4.5 text-primary" />
          <h3 className="font-sans text-sm font-semibold tracking-wider text-primary uppercase">Filtreler</h3>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs text-muted-foreground hover:text-secondary flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="h-3 w-3" /> Temizle
        </button>
      </div>

      {/* Brands */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold tracking-wider text-primary uppercase flex justify-between items-center cursor-pointer">
          Markalar
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </h4>
        <div className="space-y-2 pt-1">
          {brands.map((brand) => (
            <label key={brand.id} className="flex items-center space-x-3 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand.id)}
                onChange={() => onBrandToggle(brand.id)}
                className="rounded border-border text-secondary focus:ring-secondary/40 h-4 w-4"
              />
              <span className="text-foreground/80 hover:text-primary transition-colors">{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Skin Types */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-semibold tracking-wider text-primary uppercase flex justify-between items-center cursor-pointer">
          Cilt Tipi
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </h4>
        <div className="space-y-2 pt-1">
          {skinTypesList.map((type) => (
            <label key={type.value} className="flex items-center space-x-3 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedSkinTypes.includes(type.value)}
                onChange={() => onSkinTypeToggle(type.value)}
                className="rounded border-border text-secondary focus:ring-secondary/40 h-4 w-4"
              />
              <span className="text-foreground/80 hover:text-primary transition-colors">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Skin Concerns */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-semibold tracking-wider text-primary uppercase flex justify-between items-center cursor-pointer">
          Cilt Kaygısı
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </h4>
        <div className="space-y-2 pt-1 max-h-48 overflow-y-auto pr-2">
          {skinConcernsList.map((concern) => (
            <label key={concern.value} className="flex items-center space-x-3 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedSkinConcerns.includes(concern.value)}
                onChange={() => onSkinConcernToggle(concern.value)}
                className="rounded border-border text-secondary focus:ring-secondary/40 h-4 w-4"
              />
              <span className="text-foreground/80 hover:text-primary transition-colors">{concern.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-semibold tracking-wider text-primary uppercase">Fiyat Aralığı</h4>
        <div className="flex items-center gap-2 pt-1">
          <input
            type="number"
            placeholder="Min TL"
            value={priceRange.min || ''}
            onChange={(e) => onPriceChange(Number(e.target.value), priceRange.max)}
            className="w-full text-xs bg-muted border-none rounded-md p-2 focus:ring-1 focus:ring-secondary"
          />
          <span className="text-muted-foreground text-xs">-</span>
          <input
            type="number"
            placeholder="Max TL"
            value={priceRange.max || ''}
            onChange={(e) => onPriceChange(priceRange.min, Number(e.target.value))}
            className="w-full text-xs bg-muted border-none rounded-md p-2 focus:ring-1 focus:ring-secondary"
          />
        </div>
      </div>

    </div>
  );
}
