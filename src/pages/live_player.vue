<script setup>
    import '../assets/styles/player.css'
    import { onMounted,ref,getCurrentInstance, onActivated, onDeactivated } from 'vue'
    import Hls from 'hls.js'
    //import flvjs from 'flv.js'
    import mpegts from 'mpegts.js'
    //import { getCookie } from '../scripts/cookie.js'

    const video = ref(null);
    const prompb = ref(null)
    const nolive_pmpt = ref(null);

    const gCI = getCurrentInstance()

    const vid_domain = ['https://www.wzq02.cf/','https://wzq02.cf/','']
    const vid_src = ['/live/livestream.m3u8','/live/livestream.flv']

    let promptthereisnolive_loaded = 0;
    let promptthereisnolive = (cancel) => {
        let e
        if (cancel) {
            e = ''
            promptthereisnolive_loaded = 0;
        } else {
            e = 'block'
            promptthereisnolive_loaded = 1;
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
    let detect_live_status_interval;
    let detect_live_status_when_playing_interval;
    let should_trigger_live_reload = 0;

    let live_reload;

    gCI.proxy?.$bus.on('change_pip_setting',function(e){
        allow_pip = e
    })
    //gCI.proxy?.$bus.on('live_reload',live_reload())

    onMounted(() => {
        let videoUrl = '';
        let stp_live_lin;
        let stp_allow_pip;
        let player_type;//0为hls播放器，1为mpegts
        let get_live_url=()=>{
            //stp_live_lin = getCookie('stp_live_lin');
            //stp_allow_pip = getCookie('stp_allow_pip');
            stp_live_lin = localStorage.getItem('stp_live_lin');
            stp_allow_pip = localStorage.getItem('stp_allow_pip');
            if (localStorage.getItem('adv_set_enabled') == 1 && localStorage.getItem('enable_mpegts_player') == 1) {
                player_type = 1;
            } else {
                player_type = 0;
            }
            if (localStorage.getItem('adv_set_enabled') == 1 && localStorage.getItem('custom_hls_url')) {
                videoUrl = localStorage.getItem('custom_hls_url');
            } else {
                if (stp_live_lin == 2) {
                    videoUrl = vid_domain[0];
                } else if (stp_live_lin == 1) {
                    videoUrl = vid_domain[1];
                } else {
                    videoUrl = vid_domain[2];
                }
                if (player_type) {
                    videoUrl += vid_src[1]
                } else {
                    videoUrl += vid_src[0]
                }
            }
        }
        get_live_url();
        if (stp_allow_pip == 1) {
            allow_pip = 1;
        }
        let hls,mpegtsplayer,mpegtsplayer_canbedestroyed
        if (Hls.isSupported()) {
            hls = new Hls();
        }
        let load_stream = () => {
            if (player_type) {
                if (mpegts.getFeatureList().mseLivePlayback) {
                    mpegtsplayer_canbedestroyed = 1;
                    mpegtsplayer = mpegts.createPlayer({
                        type: 'flv',
                        url: videoUrl
                    });
                    mpegtsplayer.attachMediaElement(video.value);
                    mpegtsplayer.load();
                    play();
                }
            } else {
                hls.loadSource(videoUrl);
                hls.attachMedia(video.value);
                hls.on(Hls.Events.MANIFEST_PARSED,() => {
                    play();
                });
            }
        }
        let detect_live_status=(reload_if_back_online)=>{
            var request = new XMLHttpRequest();
            request.open("get", videoUrl);
            request.send(null);
            request.onload = () => {
                if (request.status == 200) {
                    console.log("连接直播服务器成功。")
                    vid_allow_teleport = 1
                    if (reload_if_back_online) {
                        live_reload();
                    }
                    if (detect_live_status_interval) {
                        clearInterval(detect_live_status_interval)
                    }
                    if (detect_live_status_when_playing_interval) {} else {
                        detect_live_status_when_playing_interval = setInterval(()=>{detect_live_status_when_playing()},5000)
                    }
                } else if (promptthereisnolive_loaded) {} else {
                    console.log("无法连接到直播服务器，当前可能无人推送视频流。")
                    setTimeout(()=>{promptthereisnolive()},250)
                    if (detect_live_status_when_playing_interval) {
                        clearInterval(detect_live_status_when_playing_interval)
                    }
                    detect_live_status_interval = setInterval(()=>{detect_live_status(1)},10000)
                }
            }
        }
        detect_live_status();
        load_stream();
        live_reload = (redetect) => {
            if (mpegtsplayer_canbedestroyed) {
                mpegtsplayer.destroy();
                mpegtsplayer_canbedestroyed = 0
            }
            promptthereisnolive(1);
            get_live_url();
            if (redetect) {
                detect_live_status();
            }
            load_stream();
        }
        let time_minus_buffered;
        let detect_live_status_when_playing = () => {
            if (video.value.buffered.length) {
                time_minus_buffered = video.value.buffered.end(0) - video.value.currentTime;
                if (time_minus_buffered <= 0.2) {
                    should_trigger_live_reload++;
                    if (should_trigger_live_reload >= 7) {
                        should_trigger_live_reload = 0;
                        clearTimeout(detect_live_status_when_playing_interval);
                        detect_live_status_when_playing_interval = 0;
                        detect_live_status(1);
                    } else {
                        console.log("视频连接似乎已断开。若在 "+(35 - should_trigger_live_reload*5)+" 秒后不恢复，则将尝试重连服务器...")
                    }
                } else {
                    should_trigger_live_reload = 0;
                }
            } else {
                return;
            }
        }
    })
    onDeactivated(() => {
        if (vid_allow_teleport) {
            vid_tele_disabled.value = 0
            if (allow_pip) {
                if (video.value.buffered.length) {
                    video.value.requestPictureInPicture()//调用浏览器视频画中画功能
                }
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
    <TransitionGroup name="app_trans"> 
        <div class="player" key="player">
            <Teleport to="body" :disabled="vid_tele_disabled">
                <video id="video" ref="video" v-bind:class="{inpage:vid_tele_disabled,nodisplay:vid_tele_disabled==0}" controls></video>
            </Teleport>
            <div id="player_underline" v-bind:title="$t('item_title.player_underline')" @click="live_reload(1)"></div>
        </div>
    <div id="prompb" ref="prompb" key="prompb"></div>
    <div id="nolive_pmpt" ref="nolive_pmpt" class="prompt" key="nolive_pmpt">
        <div style="position: relative; top: -8px;">
            <h2>{{$t("live_player.nolive_pmpt.message.1")}}</h2>
        <span>{{$t("live_player.nolive_pmpt.message.2")}}</span><br><br>
        <button id="promptbtn" @click="oncl_hyperl('https://wzq02.cf/#/tv')">{{$t("live_player.nolive_pmpt.button.1")}}</button>
        <button id="promptbtn" @click="oncl_hyperl('https://live.bilibili.com/956821')" style="float: right;">{{$t("live_player.nolive_pmpt.button.2")}}</button>
        </div>
    </div></TransitionGroup>
</template>