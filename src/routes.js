// 路由配置
export default [
  {
    path: '/',
    component: () => import('./views/Login.vue')
  },
  {
    path: '/student',
    component: () => import('./views/student/Layout.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('./views/student/Dashboard.vue')
      },
      {
        path: 'creation',
        component: () => import('./views/student/Creation.vue')
      },
      {
        path: 'learning',
        component: () => import('./views/student/Learning.vue')
      },
      {
        path: 'messages',
        component: () => import('./views/student/Messages.vue')
      },
      {
        path: 'profile',
        component: () => import('./views/student/Profile.vue')
      }
    ]
  },
  {
    path: '/teacher',
    component: () => import('./views/teacher/Layout.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('./views/teacher/Dashboard.vue')
      },
      {
        path: 'correction',
        component: () => import('./views/teacher/Correction.vue')
      },
      {
        path: 'profile',
        component: () => import('./views/teacher/Profile.vue')
      }
    ]
  },
  {
    path: '/parent',
    component: () => import('./views/parent/Layout.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('./views/parent/Dashboard.vue')
      },
      {
        path: 'messages',
        component: () => import('./views/parent/Messages.vue')
      },
      {
        path: 'profile',
        component: () => import('./views/parent/Profile.vue')
      }
    ]
  }
] 