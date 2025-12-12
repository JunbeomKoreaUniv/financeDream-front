import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      
      setUser: (userData) => set({ 
        user: userData, 
        isLoggedIn: true 
      }),
      
      updateStocks: (stocks) => set((state) => ({
        user: state.user ? { ...state.user, stocks } : null
      })),
      
      logout: () => set({ 
        user: null, 
        isLoggedIn: false 
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
