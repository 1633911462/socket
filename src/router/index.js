import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '@/views/index.vue'
import room from '@/views/room.vue'

Vue.use(VueRouter)

  const routes = [
    {
      path:'/',
      name: 'index',
      component:index
    },
    {
      path:'/room/:id',
      name: 'room',
      component:room
    }
]

const router = new VueRouter({
  routes
})


export default router
