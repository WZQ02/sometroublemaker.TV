<script setup lang="ts">
    import { onMounted } from 'vue'

    onMounted(() => {
        document.title = "概览"
    })
</script>

<template>
    <TransitionGroup name="app_trans"><div id="container" key="home_container">
        <h1>sometroublemaker's playground 概览</h1>
        <p>sometroublemaker's playground 作为 wzq02.cf 的一个扩充而存在。目前该站点整合了 wzq02.cf 的直播页和聊天室功能，以后会考虑整合更多东西进来。</p>
        <p>本站也用于笔者上手 Vue 3 框架上的网站开发。</p>
        <p>你仍可通过以下链接访问原先使用的直播页和聊天页：</p>
        <a id="c" href="https://wzq02.cf/player/livewithchat">直播页 (带聊天室)</a>&nbsp;
        <a id="c" href="https://wzq02.cf/chatroom1">聊天室</a>
        <br><br>
        <p></p>
        <a id="c" href="https://wzq02.cf/?secquery=wzqtv">返回主站</a>
    </div></TransitionGroup>
</template>

<style>
</style>