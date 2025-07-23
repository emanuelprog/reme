import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: 'login', component: () => import('pages/Login/LoginPage.vue'), meta: { public: true }, },
      { path: 'unauthorized', component: () => import('pages/Unauthorized/UnauthorizedPage.vue'), meta: { public: true }, }
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'home', component: () => import('pages/Home/HomePage.vue'), meta: { requiresAuth: true } },
      { path: 'config', component: () => import('pages/Config/ConfigPage.vue'), meta: { requiresAuth: true } },
      { path: 'selection-lesson-plan', component: () => import('pages/SelectionLessonPlan/SelectionLessonPlanPage.vue'), meta: { requiresAuth: true } },
      { path: 'selection-averages', component: () => import('pages/SelectionAverage/SelectionAveragePage.vue'), meta: { requiresAuth: true } },
      { path: 'selection-frequency', component: () => import('pages/SelectionFrequency/SelectionFrequencyPage.vue'), meta: { requiresAuth: true } },
      { path: 'frequency', component: () => import('pages/Frequency/FrequencyPage.vue'), meta: { requiresAuth: true, requiresDiary: true } }
    ],
  },
];

export default routes;