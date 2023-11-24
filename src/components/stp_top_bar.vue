<script setup lang="ts">
    import '../assets/styles/stp_top_bar.css'
    import SvgIcon from '@jamescoyle/vue-icon'
    import { mdiTelevision,mdiChatOutline } from '@mdi/js'
    import { onMounted,ref } from 'vue'
    import '@material/ripple'

    const isselected_1 = ref(0)
    const isselected_2 = ref(0)
    const isselected_3 = ref(0)
    const tb_show = ref(0)

    let tb_select = (selected) => {
        let tb_btn = [isselected_1,isselected_2,isselected_3]
        for (let i=0; i<tb_btn.length; i++) {
            if (i+1 == selected) {
                tb_btn[i].value = 1
            } else {
                tb_btn[i].value = 0
            }
        }
    }

    var hide_tb;
    let tb_autohide = () => {
        hide_tb = setTimeout(() => {
            tb_show.value = 0;
        },2500)
    }
    let tb_reshow = () => {
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
            <router-link to="/home"><div class="stp_tb_button mdc-ripple-surface" id="stp_t_b_1" v-bind:class="{selected:isselected_1}" @click="tb_select(1)" title="概览">
                <img src="../assets/images/sometroublemaker.webp">
            </div></router-link>
            <router-link to="/player"><div class="stp_tb_button mdc-ripple-surface" id="stp_t_b_2" v-bind:class="{selected:isselected_2}" @click="tb_select(2)" title="直播间">
                <svg-icon type="mdi" :path=mdiTelevision></svg-icon>
            </div></router-link>
            <router-link to="/chat"><div class="stp_tb_button mdc-ripple-surface" id="stp_t_b_3" v-bind:class="{selected:isselected_3}" @click="tb_select(3)" title="聊天室">
                <svg-icon type="mdi" :path=mdiChatOutline></svg-icon>
            </div></router-link>
        </div>
    </div>
</template>