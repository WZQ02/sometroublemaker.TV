//import './assets/styles/pages.css'
import './assets/styles/pages_text.css'

import { createApp } from 'vue'
import { createRouter,createWebHashHistory } from 'vue-router'
import main from './main.vue'

import Wel from './pages/welcome.vue'
import Home from './pages/home.vue'
import LivePlayer from './pages/live_player.vue'
import ChatRoom from './pages/chatroom.vue'

const routes = [
    { path: '/', component: Wel, name: Wel },
    { path: '/home', component: Home, name: Home },
    { path: '/player', component: LivePlayer, name: LivePlayer },
    { path: '/chat', component: ChatRoom, name: ChatRoom }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

const app = createApp(main)
app.use(router)
app.mount('#app')