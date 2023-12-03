<script setup>
    import '../assets/styles/player.css'
    import { onMounted,ref,getCurrentInstance, onActivated, onDeactivated } from 'vue'
    import Hls from 'hls.js'
    import { getCookie } from '../scripts/cookie.js'

    const video = ref(null);
    const prompb = ref(null)
    const nolive_pmpt = ref(null);

    const gCI = getCurrentInstance()

    let promptthereisnolive = (cancel) => {
        let e
        if (cancel) {
            e = ''
        } else {
            e = 'block'
        }
        prompb.value.style.display = e;
        nolive_pmpt.value.style.display = e;
    }
    let oncl_hyperl = (url) => {
        window.location.href = url
    }
    let play = () => {
        video.value.muted = true;
        video.value.play();
        //检测是否允许自动播放
        const ctx = new AudioContext();
        const canautoplay = ctx.state == 'running';
        ctx.close();
        if (canautoplay) {
            video.value.muted = false;
        } else {
            gCI.proxy?.$bus.emit('trigger_popup',gCI.proxy?.$t("toasts.2"))
        }
    }
    let vid_allow_teleport = 0
    const vid_tele_disabled = ref(1)
    let allow_pip = 0

    //let live_reload=()=>{}

    gCI.proxy?.$bus.on('change_pip_setting',function(e){
        allow_pip = e
    })
    //gCI.proxy?.$bus.on('live_reload',live_reload())

    onMounted(() => {
        let videoUrl = '';
        let stp_live_lin = getCookie('stp_live_lin');
        let stp_allow_pip = getCookie('stp_allow_pip');
        let get_live_url=()=>{
            if (stp_live_lin == 2) {
                videoUrl = 'https://www.wzq02.cf/hls/index.m3u8';
            } else if (stp_live_lin == 1) {
                videoUrl = 'https://wzq02.cf/hls/index.m3u8';
            } else {
                videoUrl = '/hls/index.m3u8';
            }
        }
        get_live_url();
        if (stp_allow_pip == 1) {
            allow_pip = 1;
        }
        let hls
        if (Hls.isSupported()) {
            hls = new Hls();
        }
        let load_stream = () => {
            hls.loadSource(videoUrl);
            hls.attachMedia(video.value);
            hls.on(Hls.Events.MANIFEST_PARSED,() => {
                play();
            });
        }
        let detect_live_status=()=>{
            var request = new XMLHttpRequest();
            request.open("get", videoUrl);
            request.send(null);
            request.onload = () => {
                if (request.status == 200) {
                    vid_allow_teleport = 1
                } else {
                    setTimeout(()=>{promptthereisnolive()},250)
                }
            }
        }
        detect_live_status();
        load_stream();
        /*live_reload=()=>{
            promptthereisnolive(cancel);
            get_live_url();
            detect_live_status();
            load_stream();
        }*/
    })
    onDeactivated(() => {
        if (vid_allow_teleport) {
            vid_tele_disabled.value = 0
            if (allow_pip) {
                video.value.requestPictureInPicture()//调用浏览器视频画中画功能
            }
        }
    })
    onActivated(() => {
        vid_tele_disabled.value = 1
        if (document.pictureInPictureElement) {//退出画中画
            document.exitPictureInPicture();
        }
    })
</script>

<template>
    <TransitionGroup name="app_trans"><div class="player" key="player">
        <Teleport to="body" :disabled="vid_tele_disabled"><video id="video" ref="video" v-bind:class="{inpage:vid_tele_disabled,nodisplay:vid_tele_disabled==0}" controls></video></Teleport>
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