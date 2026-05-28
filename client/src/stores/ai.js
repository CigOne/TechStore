import { defineStore } from 'pinia';
import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '', withCredentials: true });

export const useAIStore = defineStore('ai', {
  state: () => ({
    comparing: false,
    result: null,
    error: null,
  }),
  actions: {
    async compareProducts(productAId, productBId) {
      this.comparing = true;
      this.error = null;
      this.result = null;
      try {
        const { data } = await api.post('/api/ai/compare', {
          product_a_id: productAId,
          product_b_id: productBId,
        });
        this.result = data;
        return data;
      } catch (e) {
        this.error = e?.response?.data?.error || e.message;
        throw e;
      } finally {
        this.comparing = false;
      }
    },
  },
});
