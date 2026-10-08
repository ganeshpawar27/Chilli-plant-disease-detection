import { create } from 'zustand';

const useAdminStore = create((set) => ({
  farmers: [],
  analytics: null,
  loading: false,
  error: null,
  
  setFarmers: (farmers) => set({ farmers }),
  setAnalytics: (analytics) => set({ analytics }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  clearAll: () => set({
    farmers: [],
    analytics: null,
    loading: false,
    error: null,
  }),
}));

export default useAdminStore;