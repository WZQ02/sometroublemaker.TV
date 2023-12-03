<script setup lang="ts">
    import '../assets/styles/stp_top_bar.css'
    import SvgIcon from '@jamescoyle/vue-icon'
    import { mdiTelevision,mdiChatOutline,mdiCog } from '@mdi/js'
    import { onMounted,ref } from 'vue'
    import { TouchRipple } from 'vue-touch-ripple'
    import 'vue-touch-ripple/style.css'

    const isselected_1 = ref(0)
    const isselected_2 = ref(0)
    const isselected_3 = ref(0)
    const isselected_4 = ref(0)
    const tb_show = ref(0)

    let tb_select = (selected) => {//指定顶栏上哪个项目高亮显示
        let tb_btn = [isselected_1,isselected_2,isselected_3,isselected_4]
        for (let i=0; i<tb_btn.length; i++) {
            if (i+1 == selected) {
                tb_btn[i].value = 1
            } else {
                tb_btn[i].value = 0
            }
        }
    }

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
    })
</script>

<template>
    <div id="stp_tb_container" v-bind:class="{tb_show:tb_show}" v-on:mouseover="tb_reshow" v-on:mouseout="tb_autohide">
        <div id="stp_tb_main">
            <router-link to="/home">
                <div class="stp_tb_button" id="stp_t_b_1" v-bind:class="{selected:isselected_1}" @click="tb_select(1)" title="概览">
                    <touch-ripple color="#fff" :opacity="0.2" transition="ease-out" :duration="250" :keep-last-ripple="false">
                        <div>
                            <img src="../assets/images/sometroublemaker.webp">
                        </div>
                    </touch-ripple>
                </div>
            </router-link>
            <router-link to="/player">
                <div class="stp_tb_button" id="stp_t_b_2" v-bind:class="{selected:isselected_2}" @click="tb_select(2)" title="直播间">
                    <touch-ripple color="#fff" :opacity="0.2" transition="ease-out" :duration="250" :keep-last-ripple="false">
                        <div>
                            <svg-icon type="mdi" :path=mdiTelevision></svg-icon>
                        </div>
                    </touch-ripple>
                </div>
            </router-link>
            <router-link to="/chat">
                <div class="stp_tb_button" id="stp_t_b_3" v-bind:class="{selected:isselected_3}" @click="tb_select(3)" title="聊天室">
                    <touch-ripple color="#fff" :opacity="0.2" transition="ease-out" :duration="250" :keep-last-ripple="false">
                        <div>
                            <svg-icon type="mdi" :path=mdiChatOutline></svg-icon>
                        </div>
                    </touch-ripple>
                </div>
            </router-link>
            <router-link to="/settings">
                <div class="stp_tb_button" id="stp_t_b_4" v-bind:class="{selected:isselected_4}" @click="tb_select(4)" title="设置">
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