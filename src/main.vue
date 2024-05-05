<script setup lang="ts">
    import top_bar from './components/stp_top_bar.vue'
    import top_noti from './components/stp_noti.vue'
    import chat_backend from './components/stp_chat_bknd.vue'
    import stp_bg_canvas from './components/stp_bg_canvas.vue'
</script>

<template>
    <div id="pseudo_background">
        <stp_bg_canvas />
    </div>
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