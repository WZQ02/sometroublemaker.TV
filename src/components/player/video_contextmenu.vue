<script setup>
    import { getCurrentInstance,ref } from 'vue'
    const gCI = getCurrentInstance()
    function show_player_menu() {
        gCI.proxy?.$bus.emit('show_player_menu',1);
    }
    function show_video_info() {
        gCI.proxy?.$bus.emit('show_video_info',1);
    }
    function copy_video_frame() {
        gCI.proxy?.$bus.emit('copy_video_frame',1);
    }
</script>

<template>
    <div id="contextmenu_container">
        <div class="context_item c" @click="show_player_menu()">{{$t('live_player.contextmenu.1')}}</div>
        <div class="context_item c" @click="copy_video_frame()">{{$t('live_player.contextmenu.3')}}</div>
        <div class="context_item c" @click="show_video_info()">{{$t('live_player.contextmenu.2')}}</div>
    </div>
</template>

<style scoped>
#contextmenu_container {
    position: absolute;
    left: 0px;
    top: 0px;
    background-color: rgba(255,255,255,.8);
    border-radius: 8px;
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 16px #0006;
    z-index: 3;
}
.context_item {
    position: relative;
    margin: 4px;
    padding: 0px 8px;
    width: calc(100% - 24px);
    height: 32px;
    border-radius: 4px;
    color: #000;
    font-weight: normal;
    font-size: 15px;
    line-height: 32px;
    white-space: nowrap;
}
@media (prefers-color-scheme: dark) {
    #contextmenu_container {
        background-color: rgba(30,30,30,.8);
    }
    .context_item {
        color: #fff
    }
}
</style>