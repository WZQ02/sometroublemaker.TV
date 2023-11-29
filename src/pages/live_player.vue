<script setup>
    import '../assets/styles/player.css'
    import { onMounted,ref } from 'vue'
    import Hls from 'hls.js'
    import { getCookie } from '../scripts/cookie.js'

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
        let videoUrl = '';
        let stp_live_lin = getCookie('stp_live_lin');
        if (stp_live_lin == 1) {
            videoUrl = 'https://www.wzq02.cf/hls/index.m3u8';
        } else {
            videoUrl = 'https://wzq02.cf/hls/index.m3u8';
        }
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
        request.open("get", videoUrl);
        request.send(null);
        request.onload = () => {
            if (request.status == 200) {
            } else {
                setTimeout(()=>{promptthereisnolive()},250);
            }
        }
    })
</script>

<template>
    <TransitionGroup name="app_trans"><div class="player" key="player">
        <video id="video" ref="video" controls autoplay muted></video>
    </div>
    <div id="prompb" ref="prompb" key="prompb"></div>
    <div id="nolive_pmpt" ref="nolive_pmpt" class="prompt" key="nolive_pmpt">
        <div style="position: relative; top: -8px;">
            <h2>{{$t("live_player.nolive_pmpt.message.1")}}</h2>
        <span>{{$t("live_player.nolive_pmpt.message.2")}}</span><br><br>
        <button id="promptbtn" @click="oncl_hyperl('https://wzq02.cf/?secquery=wzqtv')">{{$t("live_player.nolive_pmpt.button.1")}}</button>
        <button id="promptbtn" @click="oncl_hyperl('https://live.bilibili.com/956821')" style="float: right;">{{$t("live_player.nolive_pmpt.button.2")}}</button>
        </div>
    </div></TransitionGroup>
</template>