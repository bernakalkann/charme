import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  variantId: string;
  variantName: string;
  price: number; // Base price + variant price adjustment
  quantity: number;
  stock: number;
}

interface Coupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minPurchase: number;
}

interface CartStore {
  items: CartItem[];
  giftWrap: boolean;
  giftNote: string;
  selectedTesters: string[]; // up to 3 tester product IDs
  coupon: Coupon | null;
  
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  
  setGiftWrap: (wrap: boolean) => void;
  setGiftNote: (note: string) => void;
  toggleTester: (testerId: string) => void;
  applyCoupon: (coupon: Coupon | null) => void;
  
  // Helpers
  getItemsCount: () => number;
  getCartSubtotal: () => number;
  getDiscountAmount: () => number;
  getCartTotal: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      giftWrap: false,
      giftNote: '',
      selectedTesters: [],
      coupon: null,

      addItem: (newItem, qty = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.variantId === newItem.variantId
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            const item = updatedItems[existingItemIndex];
            const newQty = Math.min(item.quantity + qty, item.stock);
            updatedItems[existingItemIndex] = { ...item, quantity: newQty };
            return { items: updatedItems };
          }

          return { items: [...state.items, { ...newItem, quantity: Math.min(qty, newItem.stock) }] };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.variantId === variantId
              ? { ...item, quantity: Math.min(Math.max(1, quantity), item.stock) }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], giftWrap: false, giftNote: '', selectedTesters: [], coupon: null });
      },

      setGiftWrap: (giftWrap) => set({ giftWrap }),
      
      setGiftNote: (giftNote) => set({ giftNote }),

      toggleTester: (testerId) => {
        set((state) => {
          const isSelected = state.selectedTesters.includes(testerId);
          if (isSelected) {
            return { selectedTesters: state.selectedTesters.filter((id) => id !== testerId) };
          }
          if (state.selectedTesters.length >= 3) {
            return {}; // Max 3 testers
          }
          return { selectedTesters: [...state.selectedTesters, testerId] };
        });
      },

      applyCoupon: (coupon) => set({ coupon }),

      getItemsCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      getCartSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getCartSubtotal();
        const coupon = get().coupon;
        if (!coupon || subtotal < coupon.minPurchase) return 0;
        
        if (coupon.discountType === 'PERCENTAGE') {
          return (subtotal * coupon.discountValue) / 100;
        } else {
          return Math.min(coupon.discountValue, subtotal);
        }
      },

      getCartTotal: () => {
        const subtotal = get().getCartSubtotal();
        const discount = get().getDiscountAmount();
        const giftWrapFee = get().giftWrap ? 50 : 0; // Hediye paketi ücreti 50 TL
        const shippingFee = subtotal - discount >= 1000 ? 0 : 75; // 1000 TL üzeri ücretsiz kargo, altı 75 TL
        
        return Math.max(0, subtotal - discount + giftWrapFee + shippingFee);
      },
    }),
    {
      name: 'charme-cart-storage',
    }
  )
);
