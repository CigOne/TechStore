import { defineStore } from 'pinia';
import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '', withCredentials: true });

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  getters: {
    count: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),
    total: (state) => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  },
  actions: {
    async fetchCart() {
      this.loading = true;
      try {
        const { data } = await api.get('/api/cart');
        this.items = data;
      } catch (e) {
        this.error = e?.response?.data?.error || e.message;
      } finally {
        this.loading = false;
      }
    },
    async addToCart(productId, quantity = 1) {
      await api.post('/api/cart', { product_id: productId, quantity });
      await this.fetchCart();
    },
    async updateQuantity(cartId, quantity) {
      await api.patch(`/api/cart/${cartId}`, { quantity });
      await this.fetchCart();
    },
    async removeItem(cartId) {
      await api.delete(`/api/cart/${cartId}`);
      await this.fetchCart();
    },
    async clearCart() {
      await api.delete('/api/cart');
      this.items = [];
    },
  },
});
