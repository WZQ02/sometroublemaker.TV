<script setup>
    import '../assets/styles/player.css'
    import { onMounted,ref,getCurrentInstance, onActivated, onDeactivated, watch } from 'vue'
    import Hls from 'hls.js'
    //import flvjs from 'flv.js'
    import mpegts from 'mpegts.js'
    import Danmaku from 'danmaku'
    //import { getCookie } from '../scripts/cookie.js'
    import SvgIcon from '@jamescoyle/vue-icon';
    import { mdiSend,mdiReload,mdiFullscreen,mdiFullscreenExit,mdiVolumeHigh,mdiVolumeMute, mdiConsoleNetwork } from '@mdi/js';
    import { stp_store } from '../store.js'

    const video = ref(null);
    const video_container = ref(null);
    const prompb = ref(null)
    const nolive_pmpt = ref(null);
    const usrmsg = ref(null)
    const player_controls = ref(null)

    const gCI = getCurrentInstance()

    const vid_domain = ['https://www.wzq02.cf/','https://wzq02.cf/','']
    const vid_src = ['/live/livestream.m3u8','/live/livestream.flv']
    const mpegts_src_type = ['flv','mpegts','m2ts','mp4','mse']

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
            gCI.proxy?.$bus.emit('trigger_popup',gCI.proxy?.$t("toasts.2"));
            audio_muted_status.value = 1;
        }
    }
    let vid_allow_teleport = 0
    const vid_tele_disabled = ref(1)
    let allow_pip = 0
    let detect_live_status_interval;
    let detect_live_status_when_playing_interval;
    let should_trigger_live_reload = 0;
    const display_controls = ref(0);
    const fullscreen = ref(0);
    const controls_folded = ref(0);
    const player_switching_fullscrn = ref(0);
    const native_controls_enabled = ref(0);

    let live_reload;

    gCI.proxy?.$bus.on('change_pip_setting',function(e){
        allow_pip = e
    })
    gCI.proxy?.$bus.on('toggle_native_controls',function(e){
        native_controls_enabled.value = e
    })
    //gCI.proxy?.$bus.on('live_reload',live_reload())
    let mpegts_src_detect = (url) => {
        if (url.indexOf('.flv') != -1) {
            return 0
        } else if (url.indexOf('.mts') != -1 || url.indexOf('.ts') != -1) {
            return 1
        } else if (url.indexOf('.m2t') != -1) {
            return 2
        } else if (url.indexOf('.mp4') != -1 || url.indexOf('.m4v') != -1) {
            return 3
        } else {
            return 4
        }
    }
    let get_if_reload_isallowed = () => {
        return (stp_store.settings.adv_set_enabled.value && stp_store.adv_settings.disallow_auto_reload_video.value)?0:1
    }
    let danmaku;
    let enabledanmaku = () => {
        danmaku = new Danmaku({
            container: video_container.value,
            media: video.value,
            speed: 96
        })
    }
    gCI.proxy?.$bus.on('display_danmaku',(e)=>{
        danmaku.emit({
            text: e,
            style: {
                fontSize: '24px',
                color: '#ffffff',
                textShadow: '0 0 4px #000'
            }
        })
    })
    window.onresize = () => {
        danmaku.resize();
    }

    let show_controls = () => {
        if (display_controls.value) {
            display_controls.value = 0;
        } else {
            display_controls.value = 1;
        }
    }
    let toggle_fullscreen = () => {
        if (player_switching_fullscrn.value != 1) {
            if (!stp_store.settings.browser_fullscreen.value) {
                player_switching_fullscrn.value = 1;
                setTimeout(()=>{player_switching_fullscrn.value = 0;danmaku.resize();},700);
            }
            stp_store.session.player_fullscreen.toggle();
            if (fullscreen.value) {
                fullscreen.value = 0;
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
            } else {
                fullscreen.value = 1;
                if (stp_store.settings.browser_fullscreen.value) {
                    document.body.querySelector('#app').requestFullscreen()
                }
            }
        }
    } 
    let toggle_sound = () => {
        if (video.value.muted) {
            video.value.muted = audio_muted_status.value = 0;
        } else {
            video.value.muted = audio_muted_status.value = 1;
        }
    }
    let sendusrmsg = () => {
        if (usrmsg.value.value.length <= 0) {
            gCI.proxy?.$bus.emit('trigger_popup',dystr(str1c))
	    } else if (usrmsg.value.value == "~!@#$%^&*()_+") {
            gCI.proxy?.$bus.emit('chatroom_clean_history');
            usrmsg.value.value = "";
        } else {
            gCI.proxy?.$bus.emit('chatroom_send',usrmsg.value.value)
		    usrmsg.value.value = "";
	    }
    }
    const str1c = [gCI.proxy?.$t("toasts.1.1"), gCI.proxy?.$t("toasts.1.2"), gCI.proxy?.$t("toasts.1.3")];
    let dystr = (strxc) => {return strxc[Math.floor(Math.random()*3)];}

    let hide_controls;
    let controls_autohide = () => {//鼠标移出2.5秒后，隐藏底栏
        hide_controls = setTimeout(() => {
            controls_folded.value = 1;
        },2500)
    }
    let controls_reshow = () => {//鼠标移入，底栏重新显示
        clearTimeout(hide_controls)
        controls_folded.value = 0;
    }

    const audio_muted_status = ref(0)

    onMounted(() => {
        let videoUrl = '';
        let stp_live_lin;
        let stp_allow_pip;
        let player_type;//0为hls播放器，1为mpegts
        let get_live_url=()=>{
            stp_live_lin = stp_store.settings.stp_live_lin.value;
            stp_allow_pip = stp_store.settings.stp_allow_pip.value;
            player_type = (stp_store.settings.adv_set_enabled.value && stp_store.adv_settings.enable_mpegts_player.value)?1:0
            if (stp_store.settings.adv_set_enabled.value && stp_store.adv_settings.custom_hls_url.value) {
                videoUrl = stp_store.adv_settings.custom_hls_url.value;
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
                    let src_type = mpegts_src_detect(videoUrl)
                    mpegtsplayer = mpegts.createPlayer({
                        type: mpegts_src_type[src_type],
                        url: videoUrl
                    });
                    mpegtsplayer.attachMediaElement(video.value);
                    mpegtsplayer.load();
                    //mpegtsplayer.play();
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
            let request = new XMLHttpRequest();
            request.open("head", videoUrl);
            request.send();
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
                    if (player_type) {
                        console.log("当前播放器类型：mpegts.js")
                    } else {
                        console.log("当前播放器类型：hls.js")
                    }
                    request.abort();
                } else if (promptthereisnolive_loaded) {} else {
                    console.log("无法连接到直播服务器，当前可能无人推送视频流。")
                    setTimeout(()=>{promptthereisnolive()},250)
                    if (detect_live_status_when_playing_interval) {
                        clearInterval(detect_live_status_when_playing_interval)
                    }
                    detect_live_status_interval = setInterval(()=>{
                        if (get_if_reload_isallowed()) {
                            detect_live_status(1)
                        }
                    },10000)
                }
            }
        }
        detect_live_status();
        load_stream();
        live_reload = (redetect) => {
            //danmaku.clear();
            danmaku.destroy();
            enabledanmaku();
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
            audio_muted_status.value = 0;
        }
        let time_minus_buffered;
        let detect_live_status_when_playing = () => {
            if (video.value.buffered.length && get_if_reload_isallowed()) {
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
        enabledanmaku();
        if (stp_store.settings.danmaku_disabled.value) {
            danmaku.hide();
        }
        if (stp_store.settings.adv_set_enabled.value && stp_store.adv_settings.player_native_controls.value) {
            native_controls_enabled.value = 1;
        }
        gCI.proxy?.$bus.emit('req_chatserverbknd',1)//为使弹幕功能一开始就起作用，在播放器初始化chat组件
        usrmsg.value.addEventListener('keydown',(e) => {//回车发送弹幕
	        if (e.keyCode == 13) {
		        sendusrmsg();
	        }
        });
        let swipeshowtb = new Hammer(player_controls.value)
        swipeshowtb.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
        swipeshowtb.on('swipeup', function() {
            controls_reshow();
            controls_autohide();
        });
        swipeshowtb.on('swipedown', function() {
            controls_folded.value = 1;
            if (!fullscreen.value) {
                display_controls.value = 0;
            }
        });
    })
    onDeactivated(() => {
        danmaku.hide();
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
        if (!stp_store.settings.danmaku_disabled.value) {
            danmaku.show();
        }
        vid_tele_disabled.value = 1
        if (document.pictureInPictureElement) {//退出画中画
            document.exitPictureInPicture();
        }
    })
</script>

<template>
    <TransitionGroup name="app_trans"> 
        <div class="player" key="player" v-bind:class="{fullscreen:fullscreen,switching_fullscrn:player_switching_fullscrn}">
            <Teleport to="body" :disabled="vid_tele_disabled">
                <div id="video_container" ref="video_container" v-bind:class="{inpage:vid_tele_disabled,nodisplay:vid_tele_disabled==0,fullscreen:fullscreen}">
                    <video id="video" ref="video" v-bind:class="{inpage:vid_tele_disabled,nodisplay:vid_tele_disabled==0}" :controls="native_controls_enabled"></video>
                </div>
            </Teleport>
            <Transition name="fade"><div id="player_underline" v-bind:title="$t('item_title.player_underline')" @click="show_controls()" v-if="!fullscreen"></div></Transition>
            <Transition name="pl_controls_popup"><div id="player_controls" ref="player_controls" v-show="display_controls" v-bind:class="{fullscreen:fullscreen,folded:controls_folded}" v-on:mouseover="controls_reshow" v-on:mouseout="controls_autohide">
                <input type="text" v-bind:placeholder="$t('chatroom.input.1')" id="usrmsg" ref="usrmsg" class="player_controls_component usrmsg">
                <button id="reload_stream" @click="live_reload(1)" class="player_controls_component reload iconbutton" v-bind:title="$t('live_player.menu.1')">
                    <svg-icon type="mdi" :path=mdiReload></svg-icon>
                </button>
                <button id="toggle_sound" @click="toggle_sound()" class="player_controls_component sound iconbutton" v-bind:title="$t('live_player.menu.4')" v-if="!audio_muted_status">
                    <svg-icon type="mdi" :path=mdiVolumeHigh></svg-icon>
                </button>
                <button id="toggle_sound" @click="toggle_sound()" class="player_controls_component sound iconbutton" v-bind:title="$t('live_player.menu.5')" v-if="audio_muted_status">
                    <svg-icon type="mdi" :path=mdiVolumeMute></svg-icon>
                </button>
                <button id="toggle_fullscrn" @click="toggle_fullscreen();" class="player_controls_component fullscrn iconbutton" v-bind:title="$t('live_player.menu.3')" v-if="!fullscreen">
                    <svg-icon type="mdi" :path=mdiFullscreen></svg-icon>
                </button>
                <button id="toggle_fullscrn" @click="toggle_fullscreen();" class="player_controls_component fullscrn iconbutton" v-bind:title="$t('live_player.menu.6')" v-if="fullscreen">
                    <svg-icon type="mdi" :path=mdiFullscreenExit></svg-icon>
                </button>
                <button id="sendmsg" ref="sendmsg" class="player_controls_component send" @click="sendusrmsg();" v-bind:title="$t('live_player.menu.2')">
                    <svg-icon type="mdi" :path=mdiSend></svg-icon>
                </button>
            </div></Transition>
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

<style scoped>
.player.fullscreen {
    width: 100vw !important;
    max-width: 100vw !important;
    height: 100vh !important;
    max-height: 100vh !important;
    left: 0px !important;
    top: 0px !important;
}
#video_container.inpage,.player.switching_fullscrn {
    transition-property: width,height,left,top,max-width,max-height,margin;
    transition-duration: .7s;
    transition-timing-function: cubic-bezier(0.5, 0, 0.2, 1)
}
#video_container.inpage.fullscreen {
    margin: 0 0;
    width: 100%;
    height: 100%;
    border-radius: 0px;
}
#player_controls.fullscreen {
    top: calc(100% - 104px);
}
#player_controls.fullscreen.folded {
    top: calc(100% - 16px);
    opacity: .4;
}
.player_controls_component.usrmsg {
    position: absolute;
    margin: 50px 0 0 12px;
    height: 22px;
    width: calc(100% - 110px);
}
.player_controls_component.send {
    position: absolute;
    width: 50px;
    height: 34px;
    margin: 48px 12px 0 0;
}
.player_controls_component.send svg {
    position: relative;
    width: 22px;
    top: -1px;
    left: -1px;
}
.player_controls_component.reload {
    margin: 10px 0 0 12px;
}
.player_controls_component.fullscrn {
    position: relative;
    right: 12px;
    margin: 10px 0 0 0;
}
.player_controls_component.reload svg {
    width: 22px;
    height: 22px;
    left: -.5px;
    top: 1px;
}
.player_controls_component.fullscrn svg {
    width: 26px;
    height: 26px;
    top: 1.5px;
    left: -3px;
}
.player_controls_component.sound {
    position: relative;
    right: 54px;
    margin: 10px 0 0 0;
}
.player_controls_component.sound svg {
    top: 1px;
    left: -2px;
}
.player_controls_component.iconbutton {
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 18px;
    border: none;
    background-color: #fff0;
    transition: 0.25s;
}
.player_controls_component.iconbutton svg {
    position: relative;
    opacity: 0.6;
    transition: 0.25s;
}
.player_controls_component.iconbutton:active {
    filter: brightness(50%) !important;
}
.pl_controls_popup-enter-active {
    transition: all 0.25s cubic-bezier(0, 0.4, 0.2, 1) !important;
}
.pl_controls_popup-leave-active {
    transition: all 0.15s cubic-bezier(0.4, 0, 1, 0.2) !important;
}
.pl_controls_popup-enter-from,
.pl_controls_popup-leave-to {
    opacity: 0;
    transform: translateY(24px);
}
@media (any-hover: hover) {
    .player_controls_component.iconbutton:hover {
        background-color: #fffd;
        filter: brightness(100%);
    }
    .player_controls_component.iconbutton svg:hover {
        opacity: 1;
    }
}
@media (prefers-color-scheme: dark) {
    .player_controls_component.iconbutton svg {
        color: #fff;
    }
}
@media (prefers-color-scheme: dark) and (any-hover: hover) {
    .player_controls_component.iconbutton:hover {
        background-color: #fff4;
    }
}
</style>