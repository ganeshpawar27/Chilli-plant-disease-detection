import { create } from 'zustand';

const useFarmerStore = create((set) => ({
  profile: null,
  predictions: [],
  loading: false,
  error: null,
  
  setProfile: (profile) => set({ profile }),
  setPredictions: (predictions) => set({ predictions }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  clearAll: () => set({
    profile: null,
    predictions: [],
    loading: false,
    error: null,
  }),
}));

export default useFarmerStore;