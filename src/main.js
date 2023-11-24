import './assets/styles/pages.css'
import { stp_app_date,stp_app_version } from './assets/json/ver.json'

import { createApp } from 'vue'
import { createRouter,createWebHashHistory } from 'vue-router'
import main from './main.vue'

import Wel from './pages/welcome.vue'
import Home from './pages/home.vue'
import LivePlayer from './pages/live_player.vue'
import ChatRoom from './pages/chatroom.vue'
import Test1 from './pages/testpage.vue'

import mitt from 'mitt'

console.log("sometroublemaker's playground version "+stp_app_version+". Last updated "+stp_app_date)

const routes = [
    { path: '/', component: Wel, name: Wel },
    { path: '/home', component: Home, name: Home, meta: {title: '概览'} },
    { path: '/player', component: LivePlayer, name: LivePlayer, meta: {title: '直播间'} },
    { path: '/chat', component: ChatRoom, name: ChatRoom, meta: {title: '聊天室'} },
    { path: '/test1', component: Test1, name: Test1, meta: {title: '功能测试'} }
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
app.config.globalProperties.$bus = mitt();

app.mount('#app')