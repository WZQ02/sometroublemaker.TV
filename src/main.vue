<script setup lang="ts">
    import top_bar from './components/stp_top_bar.vue'
    import top_noti from './components/stp_noti.vue'
    import chat_backend from './components/stp_chat_bknd.vue'
    import { C2Stransfer } from './scripts/cookie.js'

    //将原本使用cookie的数据转储到本地存储
    C2Stransfer('chatUserName');
    C2Stransfer('stp_lang');
    C2Stransfer('stp_live_lin');
    C2Stransfer('stp_allow_pip');
    C2Stransfer('isshowuserinout')
</script>

<template>
    <top_bar />
    <div id="stp_page_content">
        <router-view v-slot="slotProps">
            <keep-alive>
                <component :is="slotProps.Component"></component>
            </keep-alive>
        </router-view>
    </div>
    <top_noti />
    <chat_backend />
</template>