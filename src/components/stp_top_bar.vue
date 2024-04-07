<script setup>
    import '../assets/styles/stp_top_bar.css'
    import SvgIcon from '@jamescoyle/vue-icon'
    import { mdiTelevision,mdiChatOutline,mdiCog } from '@mdi/js'
    import { onMounted,ref,watch,getCurrentInstance } from 'vue'
    import { TouchRipple } from 'vue-touch-ripple'
    import 'vue-touch-ripple/style.css'
    import Hammer from 'hammerjs'
    import { stp_store } from '../store.js'

    const isselected_1 = ref(0)
    const isselected_2 = ref(0)
    const isselected_3 = ref(0)
    const isselected_4 = ref(0)
    const tb_show = ref(0)
    const tb_fullscrn = ref(0)
    const stp_tb_cont = ref(0)
    const tb_fullscrn_inv = ref(0)

    const tb_btn = [isselected_1,isselected_2,isselected_3,isselected_4]
    const gCI = getCurrentInstance()

    const loading_state = ref(0)

    watch(() => gCI.proxy?.$route,(to,from) => {//监听路由并改变高亮显示的顶栏项目
        let selected
        switch (to.path) {
            case '/home':
                selected = 1
                break
            case '/player':
                selected = 2
                break
            case '/chat':
                selected = 3
                break
            case '/settings':
                selected = 4
                break
        }
        for (let i=0; i<tb_btn.length; i++) {
            if (i+1 == selected) {
                tb_btn[i].value = 1
            } else {
                tb_btn[i].value = 0
            }
        }
        show_loading_bar(1)
    })

    var hide_tb;
    let tb_autohide = () => {//鼠标移出2.5秒后，隐藏顶栏
        hide_tb = setTimeout(() => {
            tb_show.value = 0;
        },2500)
    }
    let tb_reshow = () => {//鼠标移入，顶栏重新显示
        clearTimeout(hide_tb)
        tb_show.value = 1;
    }

    function show_loading_bar(hide) {
        if (hide) {
            loading_state.value = 2;
            setTimeout(()=>{loading_state.value = 0},1500)
        } else {
            if (!loading_state.value) {
                loading_state.value = 1;
            }
        }
    }

    onMounted(() => {
        tb_show.value = 0;
        let swipeshowtb = new Hammer(stp_tb_cont.value)
        swipeshowtb.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
        swipeshowtb.on('swipedown', function() {
            tb_reshow();//触屏设备上，从顶部向下滑动，显示顶栏，无操作后2.5秒后隐藏
            tb_autohide();
        });
        swipeshowtb.on('swipeup', function() {
            tb_show.value = 0;//触屏设备上，向上滑动，则隐藏顶栏
        });
        watch(() => stp_store.session.player_fullscreen.value,() => {
            tb_fullscrn.value = stp_store.session.player_fullscreen.value
        })
        watch(() => stp_store.session.player_controls_invisable.value,() => {
            tb_fullscrn_inv.value = stp_store.session.player_controls_invisable.value
        })
        gCI.proxy?.$bus.on('router_start',()=>{
            show_loading_bar();
        })
    })
</script>

<template>
    <div id="stp_tb_container" ref="stp_tb_cont" v-bind:class="{tb_show:tb_show,fullscrn:tb_fullscrn,invisable:tb_fullscrn&&tb_fullscrn_inv}" v-on:mouseover="tb_reshow" v-on:mouseout="tb_autohide">
        <div id="stp_tb_main">
            <router-link to="/home">
                <div class="stp_tb_button" id="stp_t_b_1" v-bind:class="{selected:isselected_1}" v-bind:title="$t('item_title.topbar.1')">
                    <touch-ripple color="#fff" :opacity="0.2" transition="ease-out" :duration="250" :keep-last-ripple="false">
                        <div>
                            <img src="../assets/images/sometroublemaker.webp">
                        </div>
                    </touch-ripple>
                </div>
            </router-link>
            <router-link to="/player">
                <div class="stp_tb_button" id="stp_t_b_2" v-bind:class="{selected:isselected_2}" v-bind:title="$t('item_title.topbar.2')">
                    <touch-ripple color="#fff" :opacity="0.2" transition="ease-out" :duration="250" :keep-last-ripple="false">
                        <div>
                            <svg-icon type="mdi" :path=mdiTelevision></svg-icon>
                        </div>
                    </touch-ripple>
                </div>
            </router-link>
            <router-link to="/chat">
                <div class="stp_tb_button" id="stp_t_b_3" v-bind:class="{selected:isselected_3}" v-bind:title="$t('item_title.topbar.3')">
                    <touch-ripple color="#fff" :opacity="0.2" transition="ease-out" :duration="250" :keep-last-ripple="false">
                        <div>
                            <svg-icon type="mdi" :path=mdiChatOutline></svg-icon>
                        </div>
                    </touch-ripple>
                </div>
            </router-link>
            <router-link to="/settings">
                <div class="stp_tb_button" id="stp_t_b_4" v-bind:class="{selected:isselected_4}" v-bind:title="$t('item_title.topbar.4')">
                    <touch-ripple color="#fff" :opacity="0.2" transition="ease-out" :duration="250" :keep-last-ripple="false">
                        <div>
                            <svg-icon type="mdi" :path=mdiCog></svg-icon>
                        </div>
                    </touch-ripple>
                </div>
            </router-link>
        </div>
    </div>
    <div id="stp_loading_bar" v-bind:class="{loading:loading_state==1,loaded:loading_state==2}">
        <div id="stp_loading_bar_in"></div>
    </div>
</template>

<style scoped>
    #stp_loading_bar {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 0%;
        height: 4px;
        transition: none;
    }
    #stp_loading_bar.loaded {
        width: 100%;
        transition: .5s cubic-bezier(0, 0.75, 0, 1);
    }
    #stp_loading_bar.loading {
        transition: width 15s ease-out;
        width: 70%;
    }
    #stp_loading_bar.loading div {
        opacity: 1;
    }
    #stp_loading_bar_in {
        width: 100%;
        height: 100%;
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
        background-color: #48d;
        opacity: 0;
        transition: opacity 1.5s ease;
    }
</style>