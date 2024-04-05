<script setup>
    import '../assets/styles/player.css'
    import { onMounted,ref,getCurrentInstance, onActivated, onDeactivated, watch } from 'vue'
    import Hls from 'hls.js'
    import mpegts from 'mpegts.js'
    import Danmaku from 'danmaku'
    import SvgIcon from '@jamescoyle/vue-icon';
    import { mdiSend,mdiReload,mdiFullscreen,mdiFullscreenExit,mdiVolumeHigh,mdiVolumeMute, mdiConsoleNetwork } from '@mdi/js';
    import { stp_store } from '../store.js'
    import '@material/web/progress/circular-progress.js';
    import contextMenu from '../components/player/video_contextmenu.vue'
    //import MediaInfoFactory from 'mediainfo.js'
    
    const video = ref(null);
    const video_container = ref(null);
    const prompb = ref(null)
    const nolive_pmpt = ref(null);
    const usrmsg = ref(null)
    const player_controls = ref(null)

    const gCI = getCurrentInstance()

    const vid_domain = ['https://wzq02.top','https://d.wzq02.top','']
    const vid_src = ['/live/livestream.m3u8','/live/livestream.flv']
    const mpegts_src_type = ['flv','mpegts','m2ts','mp4','mse']

    let promptthereisnolive_loaded = 0;
    let promptthereisnolive = (cancel) => {
        let e
        if (cancel) {
            e = ''
            promptthereisnolive_loaded2.value = promptthereisnolive_loaded = 0
        } else {
            e = 'block'
            promptthereisnolive_loaded2.value = promptthereisnolive_loaded = 1
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
    let detect_live_status_interval
    let detect_live_status_when_playing_interval
    let should_trigger_live_reload = 0
    const display_controls = ref(0)
    const fullscreen = ref(0)
    const controls_folded = ref(0)
    const player_switching_fullscrn = ref(0)
    const native_controls_enabled = ref(0)
    const video_buffering_status = ref(0)
    const contextmenu_display = ref(0)
    const promptthereisnolive_loaded2 = ref(0)
    const context_style = ref("")
    const player_info = ref({
        type: "",
        domain: "",
        buffered_length: "",
        total_length: "",
        buffer_health: "",
        res_h: "",
        res_v: "",
        framerate: "",
        vpt_h: "",
        vpt_v: "",
        v_codec: "",
        a_codec: "",
        bitrate: ""
    })
    const show_video_info = ref(0)
    const show_extra_video_info = ref(0)//使用mpegts播放器时展示额外信息

    let live_reload;
    let hover_show_controls_timeout;

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
        getviewportsize();
    }

    let show_controls = () => {
        if (display_controls.value) {
            display_controls.value = 0;
            if (hover_show_controls_timeout) {
                clearTimeout(hover_show_controls_timeout)
            }
        } else {
            display_controls.value = 1;
        }
    }
    function hover_show_controls(cancel) {
        if (!display_controls.value) {
            if (cancel) {
                clearTimeout(hover_show_controls_timeout)
            } else {
                hover_show_controls_timeout = setTimeout(()=>{display_controls.value = 1},1000)
            }
        }
    }
    let toggle_fullscreen = () => {
        if (player_switching_fullscrn.value != 1) {
            if (!stp_store.settings.browser_fullscreen.value) {
                player_switching_fullscrn.value = 1;
                setTimeout(()=>{player_switching_fullscrn.value = 0;danmaku.resize()},700);
            }
            stp_store.session.player_fullscreen.toggle();
            if (fullscreen.value) {//退出全屏
                fullscreen.value = 0;
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
            } else {//进入全屏
                fullscreen.value = 1;
                if (stp_store.settings.browser_fullscreen.value) {
                    document.body.querySelector('#app').requestFullscreen()
                }
                //进入全屏后，若鼠标不移动到底部，则在2.5秒后隐藏底栏
                controls_autohide();
            }
            setTimeout(()=>{getviewportsize()},700);
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
        } else if (usrmsg.value.value.length > 50) {
            gCI.proxy?.$bus.emit('trigger_popup',gCI.proxy?.$t("toasts.3.2"))//作为弹幕发送时，msg长度不应超过50
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

    //用户使用F11退出全屏时，此时如果已启用“浏览器全屏”，则同时退出播放器全屏
    document.addEventListener('fullscreenchange',()=>{
        if (!document.fullscreenElement && stp_store.settings.browser_fullscreen.value && fullscreen.value) {
            toggle_fullscreen()
        }
    })
    gCI.proxy?.$bus.on('show_player_menu',()=>{
        display_controls.value = 1
        controls_folded.value = 0
    });
    gCI.proxy?.$bus.on('show_video_info',()=>{
        if (show_video_info.value) {
            show_video_info.value = 0
        } else {
            show_video_info.value = 1
        }
    });
    function getviewportsize() {
        player_info.value.vpt_h = Math.round(video_container.value.offsetWidth * window.devicePixelRatio)
        player_info.value.vpt_v = Math.round(video_container.value.offsetHeight * window.devicePixelRatio)
    }

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
                    player_info.value.type = "mpegts"
                    videoUrl += vid_src[1]
                } else {
                    player_info.value.type = "hls"
                    videoUrl += vid_src[0]
                }
            }
            player_info.value.domain = videoUrl
        }
        get_live_url();
        if (stp_allow_pip == 1) {
            allow_pip = 1;
        }
        let hls,mpegtsplayer,mpegtsplayer_canbedestroyed
        let load_stream = () => {
            if (player_type) {//使用mpegts播放器
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
                    mpegtsplayer.on(mpegts.Events.MEDIA_INFO,(e)=>{
                        player_info.value.framerate = Math.round(e.fps*1000)/1000
                        player_info.value.a_codec = e.audioCodec
                        //视频编码判断
                        if (e.videoCodec.indexOf("avc")!=-1) {
                            player_info.value.v_codec = `H.264 / AVC (${e.videoCodec})`
                        } else if (e.videoCodec.indexOf("hvc")!=-1) {
                            player_info.value.v_codec = `H.265 / HEVC (${e.videoCodec})`
                        } else if (e.videoCodec.indexOf("av01")!=-1) {
                            player_info.value.v_codec = `AV1 (${e.videoCodec})`
                        } else {
                            player_info.value.v_codec = e.videoCodec
                        }
                        player_info.value.bitrate = Math.round(e.videoDataRate)
                        show_extra_video_info.value = 1//显示详细编码信息
                        //console.log(e)
                    })
                    play();
                }
            } else {//使用hls.js
                if (Hls.isSupported()) {
                    hls = new Hls();
                }
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
            if (mpegtsplayer_canbedestroyed) {//上次使用的是mpegts，则销毁mpegts实例
                mpegtsplayer.destroy();
                mpegtsplayer_canbedestroyed = 0
            } else {
                hls.destroy();//否则销毁hls
            }
            show_extra_video_info.value = 0
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
        swipeshowtb.on('swipeup', () => {
            controls_reshow();
            controls_autohide();
        });
        swipeshowtb.on('swipedown', () => {
            controls_folded.value = 1;
            if (!fullscreen.value) {
                display_controls.value = 0;
            }
        });
        //轮询检查视频缓冲状态(坏主意，但暂且这么实现了)并更新player_info数值
        setInterval(()=>{
            if (video.value.controls) {
                video_buffering_status.value = 0
                return
            }
            if (!video.value.buffered.length || (video.value.buffered.end(0) - video.value.currentTime <= 0.2)) {
                video_buffering_status.value = 1
            } else {
                video_buffering_status.value = 0
            }
            player_info.value.buffered_length = Math.round(video.value.buffered.end(0)*100)/100
            player_info.value.total_length = Math.round(video.value.duration*100)/100
            player_info.value.buffer_health = Math.round((video.value.buffered.end(0) - video.value.currentTime)*100)/100
        },500)
        //video右键点击事件
        video.value.addEventListener('contextmenu',(e)=>{
            if (video.value.controls) {//启用原生播放器控制时，不阻止右键菜单
                return
            }
            e.preventDefault()
            contextmenu_display.value = 1;
            context_style.value = `top:${e.clientY}px;left:${e.clientX}px`
        })
        //
        document.addEventListener('click',()=>{
            contextmenu_display.value = 0;
        })

        /* mediainfo.js test code */
        /*MediaInfoFactory().then((mediainfo)=>{
            const getSize = () => 100;

            mediainfo.analyzeFile("https://d.wzq02.top/video/sample_1.mp4")
        })
        function checkmediainfo() {
            const fileurl = video.value.src
            fetch(fileurl)
            .then((fileContent)=>{
                console.log(fileContent.size)
            })
            .catch((error)=>{

            })
            //const getSize = file.size
            //console.log(file,getSize)
        }*/
        video.value.addEventListener("loadedmetadata",()=>{
            player_info.value.res_h = video.value.videoWidth
            player_info.value.res_v = video.value.videoHeight
            //player_info.value.framerate = video.value.getVideoPlaybackQuality().frameRate
        })
        getviewportsize();
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
                    <div id="mdprog_container" v-if="video_buffering_status&&!promptthereisnolive_loaded2">
                        <md-circular-progress indeterminate></md-circular-progress>
                    </div>
                    <video id="video" ref="video" v-bind:class="{inpage:vid_tele_disabled,nodisplay:vid_tele_disabled==0}" :controls="native_controls_enabled"></video>
                    <Transition name="fade"><div id="video_info" v-if="show_video_info">
                        {{ $t('live_player.info.1') }}{{ player_info.type=="hls"&&"HLS"||"MPEG-TS" }}<br>
                        {{ $t('live_player.info.2') }}{{ player_info.domain }}<br>
                        {{ $t('live_player.info.7') }}{{ player_info.res_h+" x "+player_info.res_v }}<br>
                        <div v-if="show_extra_video_info">
                            {{ player_info.framerate&&$t('live_player.info.9')+player_info.framerate+$t('live_player.info.13')||"" }}<br>
                            {{ player_info.framerate&&$t('live_player.info.10')+player_info.v_codec+""||"" }}<br>
                            {{ player_info.framerate&&$t('live_player.info.11')+player_info.a_codec+""||"" }}<br>
                            {{ (player_info.bitrate>1024&&$t('live_player.info.12')+Math.round(player_info.bitrate/10.24)/100+" Mbps")||(player_info.framerate&&$t('live_player.info.12')+player_info.bitrate+" Kbps")||"" }}
                        </div>
                        {{ $t('live_player.info.8') }}{{ player_info.vpt_h+" x "+player_info.vpt_v }}<br>
                        {{ $t('live_player.info.3') }}{{ player_info.buffered_length+$t('live_player.info.6') }} / {{ player_info.total_length=="Infinity"&&$t('live_player.info.5')||player_info.total_length+$t('live_player.info.6') }}<br>
                        {{ $t('live_player.info.4') }}{{ player_info.buffer_health+$t('live_player.info.6') }}
                    </div></Transition>
                </div>
            </Teleport>
            <Transition name="fade"><div id="player_underline" v-bind:title="$t('item_title.player_underline')" @click="show_controls()" v-if="!fullscreen" @mouseover="hover_show_controls()" @mouseout="hover_show_controls(1)"></div></Transition>
            <Transition name="pl_controls_popup"><div id="player_controls" ref="player_controls" v-show="display_controls" v-bind:class="{fullscreen:fullscreen,folded:controls_folded}" v-on:mouseover="controls_reshow" v-on:mouseout="controls_autohide">
                <input type="text" v-bind:placeholder="$t('chatroom.input.1')" id="usrmsg" ref="usrmsg" class="player_controls_component usrmsg" maxlength="50">
                <!--弹幕限50字-->
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
                <button id="promptbtn" @click="oncl_hyperl('https://wzq02.top/#/tv')">{{$t("live_player.nolive_pmpt.button.1")}}</button>
                <button id="promptbtn" @click="oncl_hyperl('https://live.bilibili.com/956821')" style="float: right;">{{$t("live_player.nolive_pmpt.button.2")}}</button>
            </div>
        </div>
    </TransitionGroup>
    <Transition name="fade">
        <contextMenu v-if="contextmenu_display" :style="context_style"/>
    </Transition>
    
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
    opacity: .2;
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
    #video_info {
        background-color: #222b !important;
    }
}
@media (prefers-color-scheme: dark) and (any-hover: hover) {
    .player_controls_component.iconbutton:hover {
        background-color: #fff4;
    }
}
#player_controls {
    z-index: 3
}
#mdprog_container {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2
}
md-circular-progress {
    left: calc(50% - 48px);
    top: calc(50% - 48px);
}
#video_info {
    position: absolute;
    top: 0px;
    z-index: 4;
    border-radius: 4px;
    margin: 12px;
    padding: 12px;
    font-size: 14px;
    backdrop-filter: blur(8px);
    background-color: #fffb;
    box-shadow: 0 4px 16px #0006;
}
#nolive_pmpt {
    z-index: 5;
}
</style>