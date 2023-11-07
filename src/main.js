import './assets/styles/pages.css'

import { createApp } from 'vue'
import { createRouter,createWebHashHistory } from 'vue-router'
import main from './main.vue'

import Wel from './pages/welcome.vue'
import Home from './pages/home.vue'
import LivePlayer from './pages/live_player.vue'
import ChatRoom from './pages/chatroom.vue'

const routes = [
    { path: '/', component: Wel, name: Wel },
    { path: '/home', component: Home, name: Home, meta: {title: '概览'} },
    { path: '/player', component: LivePlayer, name: LivePlayer, meta: {title: '直播间'} },
    { path: '/chat', component: ChatRoom, name: ChatRoom, meta: {title: '聊天室'} }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to,from,next)=>{
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})

const app = createApp(main)
app.use(router)
app.mount('#app')