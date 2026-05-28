import { defineStore } from 'pinia';
import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '', withCredentials: true });

export const useCategoryStore = defineStore('categories', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll() {
      this.loading = true;
      try {
        const { data } = await api.get('/api/categories');
        this.items = data;
      } catch (e) {
        this.error = e?.response?.data?.error || e.message;
      } finally {
        this.loading = false;
      }
    },
    async create(payload) {
      const { data } = await api.post('/api/categories', payload);
      this.items.unshift(data);
      return data;
    },
    async update(id, payload) {
      const { data } = await api.patch(`/api/categories/${id}`, payload);
      const idx = this.items.findIndex(i => i.id === id);
      if (idx !== -1) this.items[idx] = data;
      return data;
    },
    async remove(id) {
      await api.delete(`/api/categories/${id}`);
      this.items = this.items.filter(i => i.id !== id);
    },
  },
});
