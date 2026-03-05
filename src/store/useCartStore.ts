import { create } from 'zustand';
import api from '@/lib/axios';

// Interfaces matching your backend Prisma response
export interface CartItem {
  id: string; // The CartItem ID
  quantity: number;
  variation: {
    id: string;
    name: string;
    salePrice: string | null;
    basePrice: string;
    stock: number;
    product: {
      name: string;
      slug: string;
      featuredImage?: { originalUrl: string };
      // Added this so TypeScript knows about the siblings for the dropdown
      variations?: {
        id: string;
        name: string;
        stock: number;
      }[];
    };
  };
}

export interface CartData {
  id: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

interface CartState {
  cart: CartData | null;
  isLoading: boolean;
  
  // Actions that talk to the backend
  fetchCart: () => Promise<void>;
  addToCart: (variationId: string, quantity: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  updateVariation: (cartItemId: string, newVariationId: string) => Promise<void>; // <-- NEW
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/cart');
      set({ cart: response.data.data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      set({ isLoading: false });
    }
  },

  addToCart: async (variationId, quantity) => {
    try {
      await api.post('/cart', { variationId, quantity });
      await get().fetchCart(); // Re-fetch to get updated totals from DB
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error; 
    }
  },

  updateQuantity: async (cartItemId, quantity) => {
    try {
      // Assuming your backend handles quantity updates here
      await api.patch(`/cart/${cartItemId}`, { quantity });
      await get().fetchCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
      throw error;
    }
  },

  // --- NEW: Update Variation Action ---
  updateVariation: async (cartItemId, newVariationId) => {
    try {
      // This sends the new variation ID to the backend to swap it
      await api.put(`/cart/item/${cartItemId}/variation`, { variationId: newVariationId });
      await get().fetchCart(); // Re-fetch to update prices, images, and totals
    } catch (error) {
      console.error('Failed to update variation:', error);
      throw error;
    }
  },

  removeItem: async (cartItemId) => {
    try {
      await api.delete(`/cart/${cartItemId}`);
      await get().fetchCart();
    } catch (error) {
      console.error('Failed to remove item:', error);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart');
      await get().fetchCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  },
}));