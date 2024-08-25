import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/Home.vue';
import InfoPage from '../views/Info.vue';
import DetailPage from '../views/Detail.vue';
import PaymentPage from '../views/Payment.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/info',
    name: 'Info',
    component: InfoPage,
  },
  {
    path: '/detail',
    name: 'DetailPage',
    component: DetailPage,
  },
  {
    path: '/payment',
    name: 'PaymentPage',
    component: PaymentPage,
  },
];

const router = createRouter({
  history: createWebHistory(),  // 硬编码基础路径
  routes,
});

export default router;
