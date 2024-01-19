<script setup>
    import '../assets/styles/stp_top_bar.css'
    import SvgIcon from '@jamescoyle/vue-icon'
    import { mdiTelevision,mdiChatOutline,mdiCog } from '@mdi/js'
    import { onMounted,ref,watch,getCurrentInstance } from 'vue'
    import { TouchRipple } from 'vue-touch-ripple'
    import 'vue-touch-ripple/style.css'
    import Hammer from 'hammerjs'

    const isselected_1 = ref(0)
    const isselected_2 = ref(0)
    const isselected_3 = ref(0)
    const isselected_4 = ref(0)
    const tb_show = ref(0)
    const stp_tb_cont = ref(0)

    const tb_btn = [isselected_1,isselected_2,isselected_3,isselected_4]
    const gCI = getCurrentInstance()

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
    })
</script>

<template>
    <div id="stp_tb_container" ref="stp_tb_cont" v-bind:class="{tb_show:tb_show}" v-on:mouseover="tb_reshow" v-on:mouseout="tb_autohide">
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
</template>