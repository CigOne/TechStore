import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Home from '@/views/Home.vue';
import Shop from '@/views/Shop.vue';
import Product from '@/views/Product.vue';
import About from '@/views/About.vue';
import Cart from '@/views/Cart.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import AdminDashboard from '@/views/AdminDashboard.vue';
import AdminProducts from '@/views/AdminProducts.vue';
import AdminCategories from '@/views/AdminCategories.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/shop', name: 'Shop', component: Shop },
    { path: '/product/:id', name: 'Product', component: Product, props: true },
    { path: '/about', name: 'About', component: About },
    { path: '/cart', name: 'Cart', component: Cart },
    { path: '/login', name: 'Login', component: Login, meta: { guest: true } },
    { path: '/register', name: 'Register', component: Register, meta: { guest: true } },
    { path: '/admin', name: 'AdminDashboard', component: AdminDashboard, meta: { admin: true } },
    { path: '/admin/products', name: 'AdminProducts', component: AdminProducts, meta: { admin: true } },
    { path: '/admin/categories', name: 'AdminCategories', component: AdminCategories, meta: { admin: true } },
    { path: '/admin/products/new', name: 'ProductForm', component: () => import('@/views/ProductForm.vue'), meta: { admin: true } },
    { path: '/admin/products/:id/edit', name: 'ProductEdit', component: () => import('@/views/ProductForm.vue'), meta: { admin: true } },
    { path: '/admin/categories/new', name: 'CategoryForm', component: () => import('@/views/CategoryForm.vue'), meta: { admin: true } },
    { path: '/admin/categories/:id/edit', name: 'CategoryEdit', component: () => import('@/views/CategoryForm.vue'), meta: { admin: true } },
  ]
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  if (!auth.checked) await auth.fetchUser();

  if (to.meta.admin) {
    if (!auth.isLoggedIn) return next('/login');
    if (!auth.isAdmin) return next('/');
    return next();
  }

  if (to.meta.guest) {
    if (auth.isLoggedIn) {
      if (auth.isAdmin) return next('/admin');
      return next('/');
    }
    return next();
  }

  next();
});

export default router;
