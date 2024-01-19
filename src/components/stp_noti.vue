<script setup>
    import { ref,getCurrentInstance } from 'vue'
    import '../assets/styles/stp_noti.css'

    const stp_noti_main = ref(null)
    const stp_noti_timer = ref(null)
    const stp_noti_content = ref("")//提示内容
    const s_n_show = ref(0)

    const gCI = getCurrentInstance()
    let s_n_show_timeout

    let stp_noti_popup = (content) => {
        if (s_n_show.value == 1) {//如果之前已经触发过提示，重置计时和动画
            clearTimeout(s_n_show_timeout)
            stp_noti_timer.value.style.animation = "none"
            setTimeout(()=>{stp_noti_timer.value.style.animation = null},1)
        }
        s_n_show.value = 1;
        stp_noti_content.value = content;
        s_n_show_timeout = setTimeout(()=>{s_n_show.value = 0;},3250)
    }
    let hide_s_n = () => {
        clearTimeout(s_n_show_timeout)
        s_n_show.value = 0
    }

    gCI.proxy?.$bus.on('trigger_popup',(content)=>{//触发提示
        stp_noti_popup(content)
    })
</script>

<template>
    <Transition name="fade">
        <div id="stp_noti_main" ref="stp_noti_main" v-if="s_n_show" @click="hide_s_n()">
            <div id="stp_noti_timer" ref="stp_noti_timer"></div>
            <div id="stp_noti_content">{{stp_noti_content}}</div>
        </div>
    </Transition>
</template>