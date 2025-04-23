import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size: string;
}

interface CartState {
  items: CartItem[];
  discountCode: string | null;
  discountPercentage: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateSize: (productId: number, size: string) => void;
  clearCart: () => void;
  applyDiscount: (code: string, percentage: number) => void;
  removeDiscount: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      discountCode: null,
      discountPercentage: 0,
      
      addItem: (item) => set((state) => {
        const existingItemIndex = state.items.findIndex(
          i => i.productId === item.productId
        );
        
        if (existingItemIndex >= 0) {
          // Item already exists, update quantity
          const updatedItems = [...state.items];
          updatedItems[existingItemIndex].quantity += item.quantity;
          return { items: updatedItems };
        } else {
          // New item, add to cart
          return { items: [...state.items, item] };
        }
      }),
      
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(i => i.productId !== productId)
      })),
      
      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map(item => 
          item.productId === productId 
            ? { ...item, quantity: Math.max(1, quantity) } 
            : item
        )
      })),
      
      updateSize: (productId, size) => set((state) => ({
        items: state.items.map(item => 
          item.productId === productId 
            ? { ...item, size } 
            : item
        )
      })),
      
      clearCart: () => set({ items: [], discountCode: null, discountPercentage: 0 }),
      
      applyDiscount: (code, percentage) => set({ 
        discountCode: code, 
        discountPercentage: percentage 
      }),
      
      removeDiscount: () => set({ 
        discountCode: null, 
        discountPercentage: 0 
      }),
      
      getSubtotal: () => {
        return get().items.reduce((total, item) => 
          total + (item.price * item.quantity), 0);
      },
      
      getDiscount: () => {
        const subtotal = get().getSubtotal();
        return Math.round(subtotal * (get().discountPercentage / 100));
      },
      
      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        return subtotal - discount;
      }
    }),
    {
      name: "cart-storage"
    }
  )
);
