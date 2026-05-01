import { create } from 'zustand';
import api from '@/lib/axios';

interface Filters {
  materials: string[];
  categories: { id: string, name: string, slug: string }[];
}

interface ProductState {
  products: any[];
  filters: Filters | null;
  activeFilters: {
    category: string[];
    material: string[];
    minPrice: string | null;
    maxPrice: string | null;
  };
  loading: boolean;
  error: string | null;

  fetchProducts: (params?: any) => Promise<void>;
  fetchFilterOptions: () => Promise<void>;
  setFilter: (key: 'category' | 'material', value: string) => void;
  removeFilter: (key: 'category' | 'material', value: string) => void;
  setPriceRange: (min: string | null, max: string | null) => void;
  clearFilters: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  filters: null,
  activeFilters: {
    category: [],
    material: [],
    minPrice: null,
    maxPrice: null,
  },
  loading: false,
  error: null,

  fetchProducts: async (params = {}) => {
    set({ loading: true });
    try {
      const activeFilters = get().activeFilters;
      const queryParams = new URLSearchParams();
      
      // Add manual params (page, limit, search, sort)
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, String(value));
      });

      // Add category filter
      if (activeFilters.category.length > 0) {
        queryParams.append('category', activeFilters.category[0]); // Using first for now
      }

      // Add material filter
      if (activeFilters.material.length > 0) {
        queryParams.append('material', activeFilters.material.join(','));
      }

      // Add price range
      if (activeFilters.minPrice) queryParams.append('minPrice', activeFilters.minPrice);
      if (activeFilters.maxPrice) queryParams.append('maxPrice', activeFilters.maxPrice);

      const response = await api.get(`/products?${queryParams.toString()}`);
      set({ products: response.data.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch products', loading: false });
    }
  },

  fetchFilterOptions: async () => {
    try {
      const response = await api.get('/products/filters/options');
      set({ filters: response.data.data });
    } catch (error) {
      console.error('Failed to fetch filter options', error);
    }
  },

  setFilter: (key, value) => {
    set((state) => ({
      activeFilters: {
        ...state.activeFilters,
        [key]: key === 'category' ? [value] : [...((state.activeFilters[key] as string[]) || []), value],
      },
    }));
    get().fetchProducts();
  },

  removeFilter: (key, value) => {
    set((state) => ({
      activeFilters: {
        ...state.activeFilters,
        [key]: ((state.activeFilters[key] as string[]) || []).filter((v) => v !== value),
      },
    }));
    get().fetchProducts();
  },

  setPriceRange: (min, max) => {
    set((state) => ({
      activeFilters: {
        ...state.activeFilters,
        minPrice: min,
        maxPrice: max,
      },
    }));
    get().fetchProducts();
  },

  clearFilters: () => {
    set({
      activeFilters: {
        category: [],
        material: [],
        minPrice: null,
        maxPrice: null,
      },
    });
    get().fetchProducts();
  },
}));
