<script setup>
    import '../assets/styles/player.css'
    import { onMounted, onUnmounted, ref } from 'vue'
    import Hls from 'hls.js'

    const video = ref(null);
    const prompb = ref(null)
    const nolive_pmpt = ref(null);

    let promptthereisnolive = () => {
        prompb.value.style.display = "block";
        nolive_pmpt.value.style.display = "block";
    }
    let oncl_hyperl = (url) => {
        window.location.href = url
    }

    onMounted(() => {
        let videoUrl = 'https://wzq02.cf/hls/index.m3u8';
        let load_stream = () => {
            if (Hls.isSupported()) {
                let hls = new Hls();
                hls.loadSource(videoUrl);
                hls.attachMedia(video.value);
                hls.on(Hls.Events.MANIFEST_PARSED,() => {
                    video.value.play();
                });
            }
        }
        load_stream();
        var request = new XMLHttpRequest();
        request.open("get", "https://wzq02.cf/hls/index.m3u8");
        request.send(null);
        request.onload = () => {
            if (request.status == 200) {
            } else {
                setTimeout(()=>{promptthereisnolive()},250);
            }
        }
    })

    onMounted(() => {
        document.title = "直播间"
    })
</script>

<template>
    <TransitionGroup name="app_trans"><div class="player" key="player">
        <video id="video" ref="video" controls autoplay muted></video>
    </div>
    <div id="prompb" ref="prompb" key="prompb"></div>
    <div id="nolive_pmpt" ref="nolive_pmpt" class="prompt" key="nolive_pmpt">
        <div style="position: relative; top: -8px;">
            <h2>对面关播了。</h2>
        <span>目前没有人往此直播间推流。</span><br><br>
        <button id="promptbtn" @click="oncl_hyperl('https://wzq02.cf/?secquery=wzqtv')">返回主站</button>
        <button id="promptbtn" @click="oncl_hyperl('https://live.bilibili.com/956821')" style="float: right;">前往 B 站直播间</button>
        </div>
    </div></TransitionGroup>
</template>