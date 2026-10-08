import { create } from 'zustand';

// Page load / refresh hote hi seedha localStorage check karega
const savedToken = localStorage.getItem('token');
const savedUser = JSON.parse(localStorage.getItem('user') || 'null');

const useAuthStore = create((set) => ({
  user: savedUser,
  token: savedToken,
  isAuthenticated: !!(savedToken && savedUser),

  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({
      user: user,
      token: token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  loadFromStorage: () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (token && user) {
      set({
        user: user,
        token: token,
        isAuthenticated: true,
      });
    }
  },
}));

export default useAuthStore;