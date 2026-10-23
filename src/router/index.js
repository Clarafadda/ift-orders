import { createRouter, createWebHistory } from 'vue-router'
import { useAuth, waitForAuth } from '../composables/useAuth'
import LoginView from '../views/LoginView.vue'
import OrdersView from '../views/OrdersView.vue'
import OrderFormView from '../views/OrderFormView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    { path: '/', name: 'orders', component: OrdersView, meta: { auth: true } },
    { path: '/orders/new', name: 'order-new', component: OrderFormView, meta: { auth: true } },
    { path: '/orders/:id/edit', name: 'order-edit', component: OrderFormView, meta: { auth: true }, props: true },
  ],
})
router.beforeEach(async (to) => {
  await waitForAuth()
  const { user } = useAuth()
  if (to.meta.auth && !user.value) return { name: 'login' }
  if (to.name === 'login' && user.value) return { name: 'orders' }
})
export default router
