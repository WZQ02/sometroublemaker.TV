import './assets/styles/pages.css'
import { stp_app_date,stp_app_version } from './assets/json/ver.json'

import { createApp } from 'vue'
import { createRouter,createWebHashHistory } from 'vue-router'
import main from './main.vue'
import { createI18n } from 'vue-i18n'

import { stp_glob_i18n } from './locales/global.js'
//import { getCookie } from './scripts/cookie.js'

import Wel from './pages/welcome.vue'
import Home from './pages/home.vue'
import LivePlayer from './pages/live_player.vue'
import ChatRoom from './pages/chatroom.vue'
import Settings from './pages/settings.vue'
//import Test1 from './pages/testpage.vue'

import mitt from 'mitt'

console.log("sometroublemaker's playground version "+stp_app_version+". Last updated "+stp_app_date)

const routes = [
    { path: '/', component: Wel, name: Wel },
    { path: '/home', component: Home, name: Home, meta: {title: '概览 / Overview'} },
    { path: '/player', component: LivePlayer, name: LivePlayer, meta: {title: '直播间 / Player'} },
    { path: '/chat', component: ChatRoom, name: ChatRoom, meta: {title: '聊天室 / Chatroom'} },
    { path: '/settings', component: Settings, name: Settings, meta: {title: '设置 / Settings'} }
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

let navi_lang = ''
//let stp_lang = getCookie('stp_lang');
let stp_lang = localStorage.getItem('stp_lang');
if (stp_lang == 1) {
    navi_lang = 'zh'
} else if (stp_lang == 2) {
    navi_lang = 'en'
} else {
    navi_lang = (navigator.language || 'zh').toLocaleLowerCase()
}

const i18n = createI18n({
    legacy: false,
    locale: navi_lang.split('-')[0],
    fallbackLocale: 'zh',
    messages: stp_glob_i18n,
})

const app = createApp(main)
app.use(router)
app.use(i18n)
app.config.globalProperties.$bus = mitt();

app.mount('#app')