<script setup lang="ts">
    //import { createApp, onMounted } from 'vue'
    import './assets/styles/stp_top_bar.css'
    import top_bar from './components/stp_top_bar.vue'
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
    <div id="stp_top_noti"></div>
</template>