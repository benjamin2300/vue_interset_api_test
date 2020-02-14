import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import Login from '@/views/Login'
// import OrganizationReportForm from '@/components/OrganizationReportForm'
// import Home from '../views/Home.vue'
// import IntersetReporting from '@/views/IntersetReporting'
// import PDFGenerator from '@/components/PDFGenerator'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home'),
    children: [
      {
        path: "/report/organization",
        name: "organizationReportForm",
        component: () => import("@/components/OrganizationReportForm"),
        meta: {title: "總體報表"}
      },
      {
        path: "/report/single-user",
        name: "singleReportForm",
        component: () => import("@/components/SingleUserReportForm"),
        meta: {title: "單一使用者報表"}
      }, 
      {
        path: "/report/multi-user",
        name: "multiUserReportForm",
        component: () => import("@/components/MultiUserReportForm"),
        meta: {title: "多名使用者報表"}
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
