import { defineStore } from 'pinia';
import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '', withCredentials: true });

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    checked: false,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
  },
  actions: {
    async fetchUser() {
      try {
        const { data } = await api.get('/api/auth/me');
        this.user = data.user;
      } catch (e) {
        this.user = null;
      } finally {
        this.checked = true;
      }
    },
    async login(username, password) {
      const { data } = await api.post('/api/auth/login', { username, password });
      if (data.success) {
        this.user = data.user;
        return true;
      }
      return false;
    },
    async register(username, password, email) {
      const { data } = await api.post('/api/auth/register', { username, password, email });
      if (data.success) {
        this.user = data.user;
        return true;
      }
      return false;
    },
    async logout() {
      await api.post('/api/auth/logout');
      this.user = null;
    },
  },
});
